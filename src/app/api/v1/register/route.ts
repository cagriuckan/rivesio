import { z } from "zod";
import { corsJson, corsPreflight } from "@/lib/cors";
import { checkSubmissionAllowed, guardRegister } from "@/lib/guard";
import { parseSettings } from "@/lib/repo";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

const schema = z.object({
  widget_key: z.string().min(1).max(200),
  domain: z.string().min(1).max(300),
  meta: z.record(z.unknown()).optional(),
});

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: Request) {
  if (!rateLimit(`register:${clientIp(req)}`, 60, 60_000)) {
    return corsJson({ error: "rate_limited" }, 429);
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return corsJson({ error: "invalid_input" }, 400);

  const ip = clientIp(req);
  const meta = { ...(parsed.data.meta ?? {}), ip };

  const result = await guardRegister({
    widgetKey: parsed.data.widget_key,
    domain: parsed.data.domain,
    meta,
  });

  if (!result.ok) {
    // The widget treats anything other than enabled:true as "stay hidden".
    return corsJson({ enabled: false, status: result.error }, 200);
  }

  const settings = parseSettings(result.project);
  const { config } = result;

  // Site-level submit availability (support window + site daily cap). Per-visitor
  // caps are enforced at submit time.
  const allowed = await checkSubmissionAllowed(result.site, config);

  return corsJson({
    enabled: true,
    status: result.site.status,
    project: {
      name: result.project.name,
      accentColor: settings.accentColor,
      position: settings.position,
      fabStyle: settings.fabStyle ?? "label",
      theme: settings.theme ?? "auto",
      logoUrl: settings.logoUrl,
      categories: settings.categories,
      text: settings.text,
      fields: settings.fields,
    },
    conversation: {
      enabled: config.allowConversation,
      emailRequired: config.allowConversation,
    },
    support: {
      unlimited: config.supportEndsAt === null,
      endsAt: config.supportEndsAt,
    },
    canSubmit: allowed.ok,
    blockedReason: allowed.ok ? null : allowed.error,
  });
}
