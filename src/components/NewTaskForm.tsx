"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTask, type FormState } from "@/app/actions";
import { Button } from "./ui";

const field =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-900";

export function NewTaskForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createTask, undefined);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-wrap items-start gap-2">
      <div className="min-w-56 flex-1">
        <input name="title" placeholder="New task title..." className={`${field} w-full`} aria-label="Title" />
        {state?.errors?.title && <p className="mt-1 text-xs text-red-500">{state.errors.title}</p>}
      </div>
      <select name="priority" defaultValue="MEDIUM" className={field} aria-label="Priority">
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
      <input name="dueDate" type="date" className={field} aria-label="Due date" />
      <Button type="submit" disabled={pending}>{pending ? "Adding..." : "Add task"}</Button>
    </form>
  );
}
