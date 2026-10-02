import type { Priority, Status } from "./validation";

export interface TaskLike {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  dueDate: Date | null;
  createdAt: Date;
}

const PRIORITY_RANK: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

/** High priority first, then earliest due date, then newest. */
export function sortTasks<T extends TaskLike>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => {
    const p = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (p !== 0) return p;
    const ad = a.dueDate?.getTime() ?? Infinity;
    const bd = b.dueDate?.getTime() ?? Infinity;
    if (ad !== bd) return ad - bd;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export function groupByStatus<T extends TaskLike>(tasks: T[]): Record<Status, T[]> {
  const groups: Record<Status, T[]> = { TODO: [], IN_PROGRESS: [], DONE: [] };
  for (const t of sortTasks(tasks)) groups[t.status].push(t);
  return groups;
}

export function isOverdue(task: TaskLike, now: Date = new Date()): boolean {
  return task.status !== "DONE" && task.dueDate !== null && task.dueDate < now;
}

export function taskStats(tasks: TaskLike[], now: Date = new Date()) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const overdue = tasks.filter((t) => isOverdue(t, now)).length;
  return {
    total,
    done,
    overdue,
    completion: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

export function nextStatus(s: Status): Status | null {
  return s === "TODO" ? "IN_PROGRESS" : s === "IN_PROGRESS" ? "DONE" : null;
}

export function prevStatus(s: Status): Status | null {
  return s === "DONE" ? "IN_PROGRESS" : s === "IN_PROGRESS" ? "TODO" : null;
}
