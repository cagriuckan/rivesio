import { z } from "zod";
import { corsJson, corsPreflight } from "@/lib/cors";
import { guardSubmission } from "@/lib/guard";
import { createFeedback } from "@/lib/repo";
import { limits } from "@/lib/env";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

const schema = z.object({
  widget_key: z.string().min(1).max(200),
  domain: z.string().min(1).max(300),
  category: z.string().max(100).optional(),
  message: z.string().min(1).max(limits.maxMessageLength),
  page_url: z.string().max(2000).optional().nullable(),
  viewport: z.string().max(50).optional().nullable(),
  wp_user: z.string().max(300).optional().nullable(),
  custom_fields: z
    .array(z.object({
      label: z.string().max(80),
      value: z.string().max(2000),
      kind: z.literal("element_annotation").optional(),
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
  // 20 submissions / 10 min per IP.
  if (!rateLimit(`feedback:${ip}`, 20, 10 * 60_000)) {
    return corsJson({ error: "rate_limited" }, 429);
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return corsJson({ error: "invalid_input" }, 400);
  const data = parsed.data;

  const result = await guardSubmission({
    widgetKey: data.widget_key,
    domain: data.domain,
    meta: { ...(data.meta ?? {}), ip },
  });

  if (!result.ok) {
    // All guard failures are authorization problems (registration/approval).
    return corsJson({ error: result.error }, 403);
  }

  const feedbackId = await createFeedback({
    projectId: result.project.id,
    siteId: result.site.id,
    category: data.category?.trim() || "Öneri",
    message: data.message.trim(),
    pageUrl: data.page_url ?? null,
    userAgent: req.headers.get("user-agent"),
    viewport: data.viewport ?? null,
    wpUser: data.wp_user ?? null,
    customFields: data.custom_fields
      ?.map((f) => ({
        ...f,
        label: f.label.trim(),
        value: f.value.trim(),
        selector: f.selector?.trim(),
        tagName: f.tagName?.trim(),
        text: f.text?.trim(),
      }))
      .filter((f) => f.value),
  });

  return corsJson({ ok: true, feedback_id: feedbackId, max_attachments: limits.maxAttachments });
}
