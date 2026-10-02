import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import { migrate as migratePg } from "drizzle-orm/postgres-js/migrator";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { migrate as migratePglite } from "drizzle-orm/pglite/migrator";
import postgres from "postgres";

try {
  process.loadEnvFile(".env");
} catch {
  // no .env file, that is fine
}

const migrationsFolder = "./drizzle";

async function main() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const sql = postgres(url, { max: 1 });
    await migratePg(drizzlePg(sql), { migrationsFolder });
    await sql.end();
  } else {
    const db = drizzlePglite("./.pglite");
    await migratePglite(db, { migrationsFolder });
    await db.$client.close();
  }
  console.log(`Migrations applied (${url ? "Postgres" : "PGlite at ./.pglite"})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
