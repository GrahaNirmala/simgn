import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { singleton } from "../utils/singleton";
import { config } from "../config";

function getConnection() {
  const maxOpenConnections = 2 * require('os').cpus().length;
  const maxLifetimeConnections = 30 * 60;

  const url = config.db.url;

  const pool = postgres(url, {
    ssl: true,
    max: maxOpenConnections,
    keep_alive: maxOpenConnections,
    max_lifetime: maxLifetimeConnections,
    idle_timeout: maxLifetimeConnections,
  });

  const connection = drizzle(pool, { logger: true, schema: schema });

  return connection;
}

export function db() {
  return singleton("db", getConnection);
}