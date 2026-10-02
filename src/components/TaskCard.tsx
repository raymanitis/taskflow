"use client";

import { useTransition } from "react";
import { deleteTask, moveTask } from "@/app/actions";
import { isOverdue, nextStatus, prevStatus, type TaskLike } from "@/lib/tasks";

const PRIORITY_STYLE = {
  HIGH: "bg-red-500/10 text-red-600 dark:text-red-400",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  LOW: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const btn = "rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800";

export function TaskCard({ task }: { task: TaskLike }) {
  const [pending, start] = useTransition();
  const prev = prevStatus(task.status);
  const next = nextStatus(task.status);
  const overdue = isOverdue(task);

  return (
    <article
      className={`rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition dark:border-zinc-800 dark:bg-zinc-950 ${pending ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={`text-sm font-medium ${task.status === "DONE" ? "text-zinc-400 line-through" : ""}`}>
          {task.title}
        </h3>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_STYLE[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      {task.dueDate && (
        <p className={`mt-1 text-xs ${overdue ? "font-medium text-red-500" : "text-zinc-500"}`}>
          {overdue ? "Overdue · " : "Due "}
          {task.dueDate.toLocaleDateString("en-GB")}
        </p>
      )}
      <div className="mt-2 flex justify-between">
        <div className="flex gap-1">
          {prev && <button className={btn} onClick={() => start(() => moveTask(task.id, prev))}>← Back</button>}
          {next && <button className={btn} onClick={() => start(() => moveTask(task.id, next))}>Next →</button>}
        </div>
        <button className={`${btn} hover:text-red-500`} onClick={() => start(() => deleteTask(task.id))}>
          Delete
        </button>
      </div>
    </article>
  );
}
