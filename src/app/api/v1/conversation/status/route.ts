import { z } from "zod";
import { corsJson, corsPreflight } from "@/lib/cors";
import { getConversationStatuses, getProjectByWidgetKey } from "@/lib/repo";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

const schema = z.object({
  widget_key: z.string().min(1).max(200),
  tokens: z.array(z.string().min(8).max(200)).min(1).max(50),
});

export function OPTIONS() {
  return corsPreflight();
}

/** Batch activity summary for the widget's locally known conversations (unread badge). */
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`convo-status:${ip}`, 60, 10 * 60_000)) {
    return corsJson({ error: "rate_limited" }, 429);
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return corsJson({ error: "invalid_input" }, 400);

  const project = await getProjectByWidgetKey(parsed.data.widget_key);
  if (!project) return corsJson({ error: "not_found" }, 404);

  const statuses = await getConversationStatuses(project.id, parsed.data.tokens);
  return corsJson({ ok: true, statuses });
}
