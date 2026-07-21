import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // Reuse the SQL connection + Drizzle instance across Next.js hot reloads.
  // eslint-disable-next-line no-var
  var __rivesioSql: ReturnType<typeof postgres> | undefined;
  // eslint-disable-next-line no-var
  var __rivesioDb: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing required environment variable: DATABASE_URL");
    }
    return "postgres://postgres:postgres@127.0.0.1:5432/rivesio";
  }
  return url;
}

function sqlClient(): ReturnType<typeof postgres> {
  if (!global.__rivesioSql) {
    global.__rivesioSql = postgres(connectionString(), {
      max: 10,
      // Keep TEXT timestamps out of the way; we store epoch-ms as bigint.
      prepare: false,
    });
  }
  return global.__rivesioSql;
}

export const db: ReturnType<typeof drizzle<typeof schema>> =
  global.__rivesioDb ?? drizzle(sqlClient(), { schema });

if (!global.__rivesioDb) global.__rivesioDb = db;

export { schema };
