import { logout } from "@/app/actions";
import { NewTaskForm } from "@/components/NewTaskForm";
import { TaskCard } from "@/components/TaskCard";
import { requireUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { tasks as tasksTable } from "@/db/schema";
import { db } from "@/lib/db";
import { groupByStatus, taskStats } from "@/lib/tasks";
import { STATUSES } from "@/lib/validation";

const COLUMN_TITLE = { TODO: "To do", IN_PROGRESS: "In progress", DONE: "Done" };

export default async function Dashboard() {
  const user = await requireUser();
  const tasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, user.id));
  const columns = groupByStatus(tasks);
  const stats = taskStats(tasks);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">Taskflow</p>
          <h1 className="text-2xl font-bold">Hi, {user.name}</h1>
        </div>
        <form action={logout}>
          <button className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Log out</button>
        </form>
      </header>

      <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total" value={stats.total} />
        <Stat label="Done" value={stats.done} />
        <Stat label="Overdue" value={stats.overdue} danger={stats.overdue > 0} />
        <Stat label="Completion" value={`${stats.completion}%`} />
      </section>

      <div className="mb-6">
        <NewTaskForm />
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {STATUSES.map((status) => (
          <div key={status} className="rounded-2xl bg-zinc-100 p-3 dark:bg-zinc-900/60">
            <h2 className="mb-3 flex items-center justify-between px-1 text-sm font-semibold">
              {COLUMN_TITLE[status]}
              <span className="rounded-full bg-zinc-200 px-2 text-xs dark:bg-zinc-800">{columns[status].length}</span>
            </h2>
            <div className="space-y-2">
              {columns[status].map((t) => <TaskCard key={t.id} task={t} />)}
              {columns[status].length === 0 && <p className="px-1 py-6 text-center text-xs text-zinc-400">Nothing here</p>}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value, danger }: { label: string; value: number | string; danger?: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`text-2xl font-bold ${danger ? "text-red-500" : ""}`}>{value}</p>
    </div>
  );
}
