import { z } from "zod";

export const STATUSES = ["TODO", "IN_PROGRESS", "DONE"] as const;
export const PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

export type Status = (typeof STATUSES)[number];
export type Priority = (typeof PRIORITIES)[number];

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .transform((v) => (v ? v : undefined)),
  priority: z.enum(PRIORITIES).default("MEDIUM"),
  dueDate: z
    .string()
    .optional()
    .transform((v) => (v ? new Date(v) : undefined))
    .refine((d) => d === undefined || !Number.isNaN(d.getTime()), "Invalid date"),
});

/** Turns FormData into a plain object, dropping empty strings. */
export function formToObject(form: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string" && value !== "") out[key] = value;
  }
  return out;
}

/** First error message per field, for showing next to inputs. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
