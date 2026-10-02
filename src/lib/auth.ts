import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { db } from "./db";
import { SESSION_COOKIE, verifySession } from "./session";

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const userId = await verifySession(token);
  if (!userId) return null;
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email })
    .from(users)
    .where(eq(users.id, userId));
  return user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
