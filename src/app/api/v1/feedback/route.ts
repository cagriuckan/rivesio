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
  license_key: z.string().max(300).optional().nullable(),
  theme: z.string().max(100).optional().nullable(),
  category: z.string().max(100).optional(),
  message: z.string().min(1).max(limits.maxMessageLength),
  page_url: z.string().max(2000).optional().nullable(),
  viewport: z.string().max(50).optional().nullable(),
  wp_user: z.string().max(300).optional().nullable(),
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

  const result = guardSubmission({
    widgetKey: data.widget_key,
    domain: data.domain,
    licenseKey: data.license_key,
    theme: data.theme,
    meta: { ...(data.meta ?? {}), ip },
  });

  if (!result.ok) {
    // All guard failures are authorization problems (license/theme/approval).
    return corsJson({ error: result.error }, 403);
  }

  const feedbackId = createFeedback({
    projectId: result.project.id,
    siteId: result.site.id,
    category: data.category?.trim() || "Öneri",
    message: data.message.trim(),
    pageUrl: data.page_url ?? null,
    userAgent: req.headers.get("user-agent"),
    viewport: data.viewport ?? null,
    wpUser: data.wp_user ?? null,
  });

  return corsJson({ ok: true, feedback_id: feedbackId, max_attachments: limits.maxAttachments });
}
