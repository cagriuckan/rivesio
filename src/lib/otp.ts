import { createHash, randomBytes, randomInt } from "node:crypto";
import { and, eq, lt } from "drizzle-orm";
import { db } from "@/db/client";
import { verification } from "@/db/schema";
import { generateId } from "./ids";

// One-time codes for widget conversation access, stored in the (Better Auth)
// `verification` table under a `kf-otp:` identifier namespace.

const TTL_MS = 10 * 60_000;
const MAX_ATTEMPTS = 5;

function identifier(scope: string, email: string): string {
  return `kf-otp:${scope}:${email.toLowerCase()}`;
}

function hash(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

/** Creates (or replaces) a 6-digit code for scope+email. Returns the code to email. */
export async function createOtp(scope: string, email: string): Promise<string> {
  const code = String(randomInt(100000, 1000000));
  const id = identifier(scope, email);
  await db.delete(verification).where(eq(verification.identifier, id));
  await db.insert(verification).values({
    id: generateId(),
    identifier: id,
    value: JSON.stringify({ hash: hash(code), attempts: 0 }),
    expiresAt: new Date(Date.now() + TTL_MS),
  });
  // Opportunistic cleanup of expired codes in our namespace.
  await db
    .delete(verification)
    .where(and(lt(verification.expiresAt, new Date()), eq(verification.identifier, id)))
    .catch(() => {});
  return code;
}

/** Verifies and consumes a code. Wrong codes count as attempts; 5 misses invalidate it. */
export async function verifyOtp(scope: string, email: string, code: string): Promise<boolean> {
  const id = identifier(scope, email);
  const [row] = await db.select().from(verification).where(eq(verification.identifier, id)).limit(1);
  if (!row) return false;
  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(verification).where(eq(verification.id, row.id));
    return false;
  }
  let stored: { hash: string; attempts: number };
  try {
    stored = JSON.parse(row.value);
  } catch {
    return false;
  }
  if (stored.hash !== hash(code)) {
    if (stored.attempts + 1 >= MAX_ATTEMPTS) {
      await db.delete(verification).where(eq(verification.id, row.id));
    } else {
      await db
        .update(verification)
        .set({ value: JSON.stringify({ ...stored, attempts: stored.attempts + 1 }) })
        .where(eq(verification.id, row.id));
    }
    return false;
  }
  await db.delete(verification).where(eq(verification.id, row.id));
  return true;
}

// Long-lived agent-invite tokens, stored in the same `verification` table
// under an `agent-invite:` namespace, keyed by the token's hash (the raw
// token is the bearer secret embedded in the emailed link).

const INVITE_TTL_MS = 7 * 24 * 60 * 60_000;

function inviteIdentifier(tokenHash: string): string {
  return `agent-invite:${tokenHash}`;
}

/** Creates a long-lived invite token for an agent_memberships row. Returns the raw token for the email link. */
export async function createInviteToken(membershipId: string): Promise<string> {
  const token = randomBytes(24).toString("base64url");
  await db.insert(verification).values({
    id: generateId(),
    identifier: inviteIdentifier(hash(token)),
    value: JSON.stringify({ membershipId }),
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  });
  return token;
}

/** Resolves an invite token to its membership id. Pass `peek` to inspect without consuming (e.g. page load). */
export async function consumeInviteToken(token: string, opts?: { peek?: boolean }): Promise<string | null> {
  const id = inviteIdentifier(hash(token));
  const [row] = await db.select().from(verification).where(eq(verification.identifier, id)).limit(1);
  if (!row) return null;
  if (row.expiresAt.getTime() < Date.now()) {
    await db.delete(verification).where(eq(verification.id, row.id));
    return null;
  }
  let stored: { membershipId: string };
  try {
    stored = JSON.parse(row.value);
  } catch {
    return null;
  }
  if (!opts?.peek) {
    await db.delete(verification).where(eq(verification.id, row.id));
  }
  return stored.membershipId;
}
