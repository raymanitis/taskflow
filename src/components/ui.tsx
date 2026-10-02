import type { ComponentProps } from "react";

export function Input({ label, error, ...props }: ComponentProps<"input"> & { label: string; error?: string }) {
  return (
    <label className="block space-y-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        {...props}
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900"
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </label>
  );
}

export function Button({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={`rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50 ${className}`}
    />
  );
}
