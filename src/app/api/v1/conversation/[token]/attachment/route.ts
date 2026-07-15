import { corsJson, corsPreflight } from "@/lib/cors";
import { getConversationContext, isSupportActive } from "@/lib/guard";
import { addAttachment, countAttachments, listReplies } from "@/lib/repo";
import { saveAttachment } from "@/lib/storage";
import { limits } from "@/lib/env";
import { generateId } from "@/lib/ids";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

// Soft cap on images across the whole conversation thread.
const MAX_CONVERSATION_ATTACHMENTS = 20;

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const ip = clientIp(req);
  if (!rateLimit(`conv-attach:${ip}`, 60, 10 * 60_000)) {
    return corsJson({ error: "rate_limited" }, 429);
  }

  const { token } = await ctx.params;
  const result = await getConversationContext(token);
  if (!result.ok) return corsJson({ error: "not_found" }, 404);

  const { feedback, config } = result;
  if (!config.allowConversation) return corsJson({ error: "conversation_disabled" }, 403);
  if (!isSupportActive(config)) return corsJson({ error: "support_ended" }, 403);

  if ((await countAttachments(feedback.id)) >= MAX_CONVERSATION_ATTACHMENTS) {
    return corsJson({ error: "too_many_attachments" }, 400);
  }

  const form = await req.formData().catch(() => null);
  if (!form) return corsJson({ error: "invalid_input" }, 400);
  const file = form.get("file");
  if (!(file instanceof File)) return corsJson({ error: "no_file" }, 400);
  if (!limits.allowedMimeTypes.includes(file.type)) {
    return corsJson({ error: "unsupported_type" }, 400);
  }
  if (file.size > limits.maxAttachmentBytes) {
    return corsJson({ error: "file_too_large" }, 400);
  }

  // Attribute the attachment to the reply it was sent alongside, so it renders next to
  // that message in the thread instead of always falling back to the origin message.
  const replyIdRaw = form.get("reply_id");
  let replyId: string | null = null;
  if (typeof replyIdRaw === "string" && replyIdRaw) {
    const replies = await listReplies(feedback.id);
    if (replies.some((r) => r.id === replyIdRaw)) replyId = replyIdRaw;
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const fileId = generateId();
  const relPath = await saveAttachment(feedback.id, fileId, file.type, buf);
  const row = await addAttachment({
    feedbackId: feedback.id,
    kind: "upload",
    filePath: relPath,
    mime: file.type,
    size: buf.length,
    replyId,
  });

  return corsJson({ ok: true, attachment_id: row.id });
}
