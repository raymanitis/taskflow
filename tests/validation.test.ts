import { describe, expect, it } from "vitest";
import { fieldErrors, formToObject, registerSchema, taskSchema } from "@/lib/validation";

describe("registerSchema", () => {
  it("normalises email", () => {
    const r = registerSchema.parse({ name: "Ray", email: "  RAY@Example.com ", password: "secret123" });
    expect(r.email).toBe("ray@example.com");
  });

  it("rejects weak passwords", () => {
    const r = registerSchema.safeParse({ name: "Ray", email: "ray@example.com", password: "password" });
    expect(r.success).toBe(false);
    if (!r.success) expect(fieldErrors(r.error).password).toMatch(/number/);
  });
});

describe("taskSchema", () => {
  it("defaults priority and parses due date", () => {
    const r = taskSchema.parse({ title: "Ship it", dueDate: "2026-12-01" });
    expect(r.priority).toBe("MEDIUM");
    expect(r.dueDate).toBeInstanceOf(Date);
  });

  it("requires a title", () => {
    expect(taskSchema.safeParse({ title: "   " }).success).toBe(false);
  });

  it("rejects an invalid date", () => {
    expect(taskSchema.safeParse({ title: "x", dueDate: "not-a-date" }).success).toBe(false);
  });
});

describe("formToObject", () => {
  it("drops empty values", () => {
    const f = new FormData();
    f.set("title", "Hello");
    f.set("dueDate", "");
    expect(formToObject(f)).toEqual({ title: "Hello" });
  });
});
