import { z } from "zod";
import { corsJson, corsPreflight } from "@/lib/cors";
import { guardSubmission } from "@/lib/guard";
import { addReply, createFeedback, getProjectOwner, parseSettings } from "@/lib/repo";
import { maybeAutoAssignOnCreate } from "@/lib/agent-repo";
import { publish } from "@/lib/events";
import { notify } from "@/lib/notify";
import { after } from "next/server";
import { limits } from "@/lib/env";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { visitorHash } from "@/lib/visitor";

export const runtime = "nodejs";

const schema = z.object({
  widget_key: z.string().min(1).max(200),
  domain: z.string().min(1).max(300),
  category: z.string().max(100).optional(),
  message: z.string().min(1).max(limits.maxMessageLength),
  email: z.string().email().max(200).optional().nullable(),
  page_url: z.string().max(2000).optional().nullable(),
  viewport: z.string().max(50).optional().nullable(),
  wp_user: z.string().max(300).optional().nullable(),
  locale: z.enum(["tr", "en"]).optional(),
  custom_fields: z
    .array(z.object({
      id: z.string().max(120).optional(),
      label: z.string().max(80),
      value: z.string().max(2000),
      kind: z.literal("element_annotation").optional(),
      index: z.number().int().positive().optional(),
      selector: z.string().max(500).optional(),
      tagName: z.string().max(80).optional(),
      text: z.string().max(500).optional(),
      rect: z.object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
        viewportWidth: z.number(),
        viewportHeight: z.number(),
      }).optional(),
    }))
    .max(20)
    .optional(),
  meta: z.record(z.unknown()).optional(),
});

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  // 20 submissions / 10 min per IP (burst guard; durable daily limits live in guard).
  if (!rateLimit(`feedback:${ip}`, 20, 10 * 60_000)) {
    return corsJson({ error: "rate_limited" }, 429);
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return corsJson({ error: "invalid_input" }, 400);
  const data = parsed.data;

  const userAgent = req.headers.get("user-agent");
  const vHash = visitorHash(ip, userAgent);

  const result = await guardSubmission({
    widgetKey: data.widget_key,
    domain: data.domain,
    meta: { ...(data.meta ?? {}), ip },
    visitorHash: vHash,
  });

  if (!result.ok) {
    // Authorization + limit/support failures all surface as 403 with a code.
    return corsJson({ error: result.error }, 403);
  }

  const email = data.email?.trim().toLowerCase() || null;

  const customFields = data.custom_fields
    ?.map((f) => ({
      ...f,
      label: f.label.trim(),
      value: f.value.trim(),
      selector: f.selector?.trim(),
      tagName: f.tagName?.trim(),
      text: f.text?.trim(),
    }))
    .filter((f) => f.value);

  const { id: feedbackId, token } = await createFeedback({
    projectId: result.project.id,
    siteId: result.site.id,
    category: data.category?.trim() || "Öneri",
    message: data.message.trim(),
    pageUrl: data.page_url ?? null,
    userAgent,
    viewport: data.viewport ?? null,
    wpUser: data.wp_user ?? null,
    email,
    visitorHash: vHash,
    customFields,
  });

  // Element-picker notes are conceptually separate messages ("what's wrong with this
  // element") rather than fields on the main description, so surface each one as its
  // own reply bubble in the conversation thread instead of hiding it in custom_fields.
  // The badge number matches the one drawn on the element's screenshot, so the admin
  // (and the visitor, who sees these replies too in their own history) can tell
  // exactly which picked element a note refers to.
  const badgeText = (locale: "tr" | "en", index?: number) =>
    locale === "en"
      ? index
        ? `${index}️⃣ Selected element`
        : "📍 Selected element"
      : index
        ? `${index}️⃣ numaralı seçili alan`
        : "📍 Seçili alan";

  const annotations = customFields?.filter((f) => f.kind === "element_annotation") ?? [];
  const annotationReplies: { id: string; reply_id: string }[] = [];
  for (const ann of annotations) {
    const reply = await addReply({
      feedbackId,
      author: "user",
      message: `${badgeText(data.locale ?? "tr", ann.index)}\n${ann.value}`,
      pageUrl: data.page_url ?? null,
      userAgent,
    });
    if (ann.id) annotationReplies.push({ id: ann.id, reply_id: reply.id });
  }

  const category = data.category?.trim() || "Öneri";
  const autoAssignedAgentId = await maybeAutoAssignOnCreate(result.project.id, feedbackId, category);

  const owner = await getProjectOwner(result.project.id);
  if (owner) {
    const recipientIds = Array.from(new Set([owner.id, ...(autoAssignedAgentId ? [autoAssignedAgentId] : [])]));
    for (const recipientId of recipientIds) {
      publish({
        type: "feedback.created",
        userId: recipientId,
        payload: {
          feedback_id: feedbackId,
          project_id: result.project.id,
          category,
          message: data.message.trim().slice(0, 200),
          domain: result.site.domain,
        },
      });
    }
    const settings = parseSettings(result.project);
    const accentColor = settings.accentColor;
    const brandName = result.project.name;
    after(() =>
      Promise.all(
        recipientIds.map((recipientId) =>
          notify(recipientId, {
            type: "feedback_new",
            title: `Yeni geri bildirim: ${category}`,
            body: `${result.site.domain} — ${data.message.trim().slice(0, 200)}`,
            link: `/feedbacks?f=${feedbackId}`,
            accentColor,
            brandName,
            logoUrl: settings.logoUrl,
          }),
        ),
      ),
    );
  }

  return corsJson({
    ok: true,
    feedback_id: feedbackId,
    token,
    conversation_enabled: result.config.allowConversation,
    max_attachments: limits.maxAttachments,
    annotation_replies: annotationReplies,
  });
}
