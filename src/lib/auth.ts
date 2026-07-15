import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { count, eq, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { env } from "./env";

export const auth = betterAuth({
  // In dev the port can vary; let Better Auth infer the base URL from the request.
  baseURL: process.env.NODE_ENV === "production" ? env.publicBaseUrl : undefined,
  secret: env.authSecret,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "member", input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (created) => {
          // First registered user becomes admin and inherits any legacy
          // (pre-membership) projects that have no owner yet.
          const [r] = await db.select({ c: count() }).from(schema.user);
          if ((r?.c ?? 0) === 1) {
            await db.update(schema.user).set({ role: "admin" }).where(eq(schema.user.id, created.id));
            await db
              .update(schema.projects)
              .set({ userId: created.id })
              .where(isNull(schema.projects.userId));
          }
        },
      },
    },
  },
});

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
}

/** Returns the signed-in user, or null. Server-side (route handlers, RSC). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  const u = session.user as SessionUser & { image?: string | null };
  return { id: u.id, name: u.name, email: u.email, role: u.role, image: u.image ?? null };
}

/** Route-handler guard: returns the user or a ready-made 401 response. */
export async function requireAdminSession(): Promise<SessionUser | NextResponse> {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return user;
}

/** Back-compat helper used by server components/pages. */
export async function isAuthenticated(): Promise<boolean> {
  return (await getSessionUser()) !== null;
}
