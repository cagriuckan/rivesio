import { defineConfig } from "drizzle-kit";

// drizzle-kit auto-loads .env / .env.local from the project root.
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgres://postgres:postgres@127.0.0.1:5432/rivesio",
  },
  casing: "snake_case",
  strict: true,
  verbose: true,
});
