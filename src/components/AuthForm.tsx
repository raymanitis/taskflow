"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, register, type FormState } from "@/app/actions";
import { Button, Input } from "./ui";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    mode === "login" ? login : register,
    undefined,
  );
  const e = state?.errors ?? {};
  const isLogin = mode === "login";

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form
        action={action}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div>
          <Link href="/" className="text-sm font-semibold text-indigo-600">Taskflow</Link>
          <h1 className="mt-2 text-2xl font-bold">{isLogin ? "Welcome back" : "Create account"}</h1>
        </div>
        {!isLogin && <Input label="Name" name="name" autoComplete="name" error={e.name} />}
        <Input label="Email" name="email" type="email" autoComplete="email" error={e.email} />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          error={e.password}
        />
        {e.form && <p className="text-sm text-red-500">{e.form}</p>}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
        </Button>
        <p className="text-center text-sm text-zinc-500">
          {isLogin ? "No account? " : "Already have one? "}
          <Link href={isLogin ? "/register" : "/login"} className="text-indigo-600 hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </form>
    </main>
  );
}
