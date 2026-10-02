import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taskflow",
  description: "A simple kanban task tracker built with Next.js, Prisma and PostgreSQL.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
