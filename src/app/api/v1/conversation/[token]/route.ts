import { corsJson, corsPreflight } from "@/lib/cors";
import { getConversationContext, isSupportActive } from "@/lib/guard";
import { listAttachments, listReplies } from "@/lib/repo";
import { env } from "@/lib/env";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

export function OPTIONS() {
  return corsPreflight();
}

export async function GET(req: Request, ctx: { params: Promise<{ token: string }> }) {
  if (!rateLimit(`conv:${clientIp(req)}`, 120, 60_000)) {
    return corsJson({ error: "rate_limited" }, 429);
  }

  const { token } = await ctx.params;
  const result = await getConversationContext(token);
  if (!result.ok) return corsJson({ error: "not_found" }, 404);

  const { feedback, config } = result;

  // Conversation access is gated by the per-site/widget setting.
  if (!config.allowConversation) return corsJson({ error: "conversation_disabled" }, 403);

  const [attachments, replies] = await Promise.all([
    listAttachments(feedback.id),
    listReplies(feedback.id),
  ]);

  const base = env.publicBaseUrl;
  return corsJson({
    ok: true,
    conversation: {
      id: feedback.id,
      category: feedback.category,
      message: feedback.message,
      status: feedback.status,
      page_url: feedback.page_url,
      created_at: feedback.created_at,
      last_activity_at: feedback.last_activity_at,
      custom_fields: feedback.custom_fields_json
        ? JSON.parse(feedback.custom_fields_json)
        : [],
      attachments: attachments.map((a) => ({
        id: a.id,
        kind: a.kind,
        mime: a.mime,
        reply_id: a.reply_id,
        url: `${base}/api/v1/conversation/${token}/attachment/${a.id}`,
      })),
      replies: replies.map((r) => ({
        id: r.id,
        author: r.author,
        message: r.message,
        created_at: r.created_at,
      })),
    },
    support: { unlimited: config.supportEndsAt === null, endsAt: config.supportEndsAt },
    can_reply: isSupportActive(config),
  });
}
