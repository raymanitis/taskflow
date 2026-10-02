import { describe, expect, it } from "vitest";
import { groupByStatus, isOverdue, nextStatus, prevStatus, sortTasks, taskStats, type TaskLike } from "@/lib/tasks";

const now = new Date("2026-06-15T12:00:00Z");
let n = 0;
const task = (over: Partial<TaskLike> = {}): TaskLike => ({
  id: String(++n),
  title: "t",
  status: "TODO",
  priority: "MEDIUM",
  dueDate: null,
  createdAt: new Date("2026-06-01"),
  ...over,
});

describe("sortTasks", () => {
  it("puts high priority first", () => {
    const sorted = sortTasks([task({ priority: "LOW" }), task({ priority: "HIGH" }), task()]);
    expect(sorted.map((t) => t.priority)).toEqual(["HIGH", "MEDIUM", "LOW"]);
  });

  it("orders same priority by earliest due date, no date last", () => {
    const a = task({ dueDate: new Date("2026-07-01") });
    const b = task({ dueDate: new Date("2026-06-20") });
    const c = task();
    expect(sortTasks([c, a, b]).map((t) => t.id)).toEqual([b.id, a.id, c.id]);
  });

  it("does not mutate the input", () => {
    const input = [task({ priority: "LOW" }), task({ priority: "HIGH" })];
    const copy = [...input];
    sortTasks(input);
    expect(input).toEqual(copy);
  });
});

describe("groupByStatus", () => {
  it("splits tasks into the three columns", () => {
    const g = groupByStatus([task(), task({ status: "DONE" }), task({ status: "IN_PROGRESS" }), task()]);
    expect([g.TODO.length, g.IN_PROGRESS.length, g.DONE.length]).toEqual([2, 1, 1]);
  });
});

describe("isOverdue", () => {
  it("is true for past due unfinished tasks", () => {
    expect(isOverdue(task({ dueDate: new Date("2026-06-10") }), now)).toBe(true);
  });
  it("is false for done tasks or tasks without a date", () => {
    expect(isOverdue(task({ dueDate: new Date("2026-06-10"), status: "DONE" }), now)).toBe(false);
    expect(isOverdue(task(), now)).toBe(false);
  });
});

describe("taskStats", () => {
  it("handles an empty list", () => {
    expect(taskStats([], now)).toEqual({ total: 0, done: 0, overdue: 0, completion: 0 });
  });
  it("counts done, overdue and completion %", () => {
    const stats = taskStats(
      [task({ status: "DONE" }), task({ dueDate: new Date("2026-06-01") }), task()],
      now,
    );
    expect(stats).toEqual({ total: 3, done: 1, overdue: 1, completion: 33 });
  });
});

describe("status transitions", () => {
  it("moves forward and back through the board", () => {
    expect(nextStatus("TODO")).toBe("IN_PROGRESS");
    expect(nextStatus("DONE")).toBeNull();
    expect(prevStatus("IN_PROGRESS")).toBe("TODO");
    expect(prevStatus("TODO")).toBeNull();
  });
});
