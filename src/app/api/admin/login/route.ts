import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/ratelimit";

const schema = z.object({
  username: z.string().min(1).max(200),
  password: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  // Throttle brute-force attempts: 10 tries / 5 min per IP.
  if (!rateLimit(`login:${clientIp(req)}`, 10, 5 * 60_000)) {
    return NextResponse.json({ error: "too_many_attempts" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { username, password } = parsed.data;
  const okUser = username === env.adminUser;
  const okPass = env.adminPasswordHash
    ? verifyPassword(password, env.adminPasswordHash)
    : false;

  if (!okUser || !okPass) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const token = await createSessionToken(username);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
