import { z } from "zod";
import { corsJson, corsPreflight } from "@/lib/cors";
import { getProjectByWidgetKey, listConversationsByEmail } from "@/lib/repo";
import { verifyOtp } from "@/lib/otp";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

const schema = z.object({
  widget_key: z.string().min(1).max(200),
  email: z.string().email().max(200),
  code: z.string().regex(/^\d{6}$/),
});

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`otp-verify:${ip}`, 20, 15 * 60_000)) {
    return corsJson({ error: "rate_limited" }, 429);
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return corsJson({ error: "invalid_input" }, 400);
  const { widget_key, email, code } = parsed.data;

  const project = await getProjectByWidgetKey(widget_key);
  if (!project) return corsJson({ error: "invalid_code" }, 403);

  const ok = await verifyOtp(project.id, email, code);
  if (!ok) return corsJson({ error: "invalid_code" }, 403);

  const conversations = await listConversationsByEmail(project.id, email.trim().toLowerCase());
  return corsJson({ ok: true, conversations });
}
