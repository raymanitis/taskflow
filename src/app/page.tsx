import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <p className="text-sm font-semibold text-indigo-600">Taskflow</p>
      <h1 className="mt-3 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
        Plan your work. Ship it.
      </h1>
      <p className="mt-4 max-w-md text-zinc-500">
        A simple kanban board with priorities, due dates and progress stats.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/register" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500">
          Get started
        </Link>
        <Link href="/login" className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900">
          Log in
        </Link>
      </div>
    </main>
  );
}
