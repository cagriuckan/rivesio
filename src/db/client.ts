import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  // Reuse the SQL connection + Drizzle instance across Next.js hot reloads.
  // eslint-disable-next-line no-var
  var __revistoSql: ReturnType<typeof postgres> | undefined;
  // eslint-disable-next-line no-var
  var __revistoDb: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing required environment variable: DATABASE_URL");
    }
    return "postgres://postgres:postgres@127.0.0.1:5432/revisto";
  }
  return url;
}

function sqlClient(): ReturnType<typeof postgres> {
  if (!global.__revistoSql) {
    global.__revistoSql = postgres(connectionString(), {
      max: 10,
      // Keep TEXT timestamps out of the way; we store epoch-ms as bigint.
      prepare: false,
    });
  }
  return global.__revistoSql;
}

export const db: ReturnType<typeof drizzle<typeof schema>> =
  global.__revistoDb ?? drizzle(sqlClient(), { schema });

if (!global.__revistoDb) global.__revistoDb = db;

export { schema };
