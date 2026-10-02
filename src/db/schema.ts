import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "./id";

export const statusEnum = pgEnum("status", ["TODO", "IN_PROGRESS", "DONE"]);
export const priorityEnum = pgEnum("priority", ["LOW", "MEDIUM", "HIGH"]);

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(createId),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasks = pgTable(
  "tasks",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    title: text("title").notNull(),
    description: text("description"),
    status: statusEnum("status").notNull().default("TODO"),
    priority: priorityEnum("priority").notNull().default("MEDIUM"),
    dueDate: timestamp("due_date"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [index("tasks_user_status_idx").on(t.userId, t.status)],
);

export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
