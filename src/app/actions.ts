"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { tasks, users } from "@/db/schema";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/session";
import {
  STATUSES,
  fieldErrors,
  formToObject,
  loginSchema,
  registerSchema,
  taskSchema,
  type Status,
} from "@/lib/validation";

export type FormState = { errors?: Record<string, string>; ok?: boolean } | undefined;

async function startSession(userId: string) {
  (await cookies()).set(SESSION_COOKIE, await signSession(userId), sessionCookieOptions);
}

export async function register(_: FormState, form: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(formToObject(form));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const { name, email, password } = parsed.data;
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing) {
    return { errors: { email: "An account with this email already exists" } };
  }

  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash: await bcrypt.hash(password, 10) })
    .returning({ id: users.id });
  await startSession(user.id);
  redirect("/dashboard");
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(formToObject(form));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  const [user] = await db.select().from(users).where(eq(users.email, parsed.data.email));
  const valid = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!valid) return { errors: { form: "Wrong email or password" } };

  await startSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

export async function createTask(_: FormState, form: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = taskSchema.safeParse(formToObject(form));
  if (!parsed.success) return { errors: fieldErrors(parsed.error) };

  await db.insert(tasks).values({ ...parsed.data, userId: user.id });
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function moveTask(taskId: string, status: Status) {
  const user = await requireUser();
  if (!STATUSES.includes(status)) throw new Error("Invalid status");
  // Filtering by userId too means users can never touch someone else's task.
  await db
    .update(tasks)
    .set({ status })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));
  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
  const user = await requireUser();
  await db.delete(tasks).where(and(eq(tasks.id, taskId), eq(tasks.userId, user.id)));
  revalidatePath("/dashboard");
}
