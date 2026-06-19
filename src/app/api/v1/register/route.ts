import { z } from "zod";
import { corsJson, corsPreflight } from "@/lib/cors";
import { guardRegister } from "@/lib/guard";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

const schema = z.object({
  widget_key: z.string().min(1).max(200),
  domain: z.string().min(1).max(300),
  theme: z.string().max(100).optional().nullable(),
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
  const meta = { ...(parsed.data.meta ?? {}), ip, theme: parsed.data.theme ?? undefined };

  const result = guardRegister({
    widgetKey: parsed.data.widget_key,
    domain: parsed.data.domain,
    theme: parsed.data.theme,
    meta,
  });

  if (!result.ok) {
    // The widget treats anything other than enabled:true as "stay hidden".
    return corsJson({ enabled: false, status: result.error }, 200);
  }

  const settings = JSON.parse(result.project.settings_json || "{}");
  return corsJson({
    enabled: true,
    status: result.site.status,
    project: {
      name: result.project.name,
      accentColor: settings.accentColor ?? "#4f46e5",
      position: settings.position ?? "bottom-right",
      categories: settings.categories ?? ["Öneri", "Hata", "Tasarım", "Diğer"],
    },
  });
}
