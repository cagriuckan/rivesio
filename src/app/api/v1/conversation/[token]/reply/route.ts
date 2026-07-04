import { z } from "zod";
import { corsJson, corsPreflight } from "@/lib/cors";
import { getConversationContext, isSupportActive } from "@/lib/guard";
import { addReply, getProjectOwner, parseSettings } from "@/lib/repo";
import { limits } from "@/lib/env";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { publish } from "@/lib/events";
import { notify } from "@/lib/notify";
import { after } from "next/server";

export const runtime = "nodejs";

const schema = z.object({
  message: z.string().trim().min(1).max(limits.maxReplyLength),
  page_url: z.string().max(2000).optional().nullable(),
});

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const ip = clientIp(req);
  if (!rateLimit(`conv-reply:${ip}`, 30, 10 * 60_000)) {
    return corsJson({ error: "rate_limited" }, 429);
  }

  const { token } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return corsJson({ error: "invalid_input" }, 400);

  const result = await getConversationContext(token);
  if (!result.ok) return corsJson({ error: "not_found" }, 404);

  const { feedback, config } = result;
  if (!config.allowConversation) return corsJson({ error: "conversation_disabled" }, 403);
  if (!isSupportActive(config)) return corsJson({ error: "support_ended" }, 403);

  const reply = await addReply({
    feedbackId: feedback.id,
    author: "user",
    message: parsed.data.message,
    pageUrl: parsed.data.page_url ?? null,
    userAgent: req.headers.get("user-agent"),
  });

  // Notify the project owner that the user replied — fire & forget, never block the response.
  const owner = await getProjectOwner(feedback.project_id);
  if (owner) {
    publish({
      type: "reply.created",
      userId: owner.id,
      payload: {
        feedback_id: feedback.id,
        author: "user",
        message: reply.message.slice(0, 200),
        reply_id: reply.id,
        created_at: reply.created_at,
      },
    });
    const ownerId = owner.id;
    const settings = parseSettings(result.project);
    const accentColor = settings.accentColor;
    const brandName = result.project.name;
    after(() =>
      notify(ownerId, {
        type: "reply_user",
        title: `Yeni kullanıcı yanıtı: ${feedback.category}`,
        body: parsed.data.message.slice(0, 200),
        link: `/feedbacks?f=${feedback.id}`,
        accentColor,
        brandName,
        logoUrl: settings.logoUrl,
      }),
    );
  }
  return corsJson({
    ok: true,
    reply: { id: reply.id, author: reply.author, message: reply.message, created_at: reply.created_at },
  });
}
