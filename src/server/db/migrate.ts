import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";
import { config } from "../config";
import { seed } from "./seed";


async function runMigrations() {
  const url = config.db.url;
  
  const pool = postgres(url, {
    ssl: true,
    max: 2 * require('os').cpus().length,
    keep_alive: 2 * require('os').cpus().length,
    max_lifetime: 30 * 60,
    idle_timeout: 30 * 60,
  });

  const connection = drizzle(pool, { logger: true, schema: schema });

  try {
    console.log("Running migrations...");
    await migrate(connection, {
      migrationsFolder: "./drizzle",
    });
    console.log("Migrations applied successfully.");
    await seed(connection)
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    console.log("Migration process complete.");
  }
}

runMigrations();
