import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import postgres from "postgres";
import * as schema from "@/db/schema";

/**
 * With DATABASE_URL set we connect to a real Postgres server.
 * Without it (local dev with no Docker) we use PGlite, an embedded
 * Postgres that stores its data in ./.pglite.
 */
function createDb() {
  const url = process.env.DATABASE_URL;
  if (url) return drizzlePg(postgres(url, { max: 10 }), { schema });
  return drizzlePglite("./.pglite", { schema }) as unknown as ReturnType<typeof drizzlePg<typeof schema>>;
}

const globalForDb = globalThis as unknown as { db?: ReturnType<typeof createDb> };

export const db = globalForDb.db ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;
