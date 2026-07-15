import { z } from "zod";
import { corsJson, corsPreflight } from "@/lib/cors";
import { findSite, getProjectByWidgetKey, normalizeDomain, parseSettings } from "@/lib/repo";
import { createOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

const schema = z.object({
  widget_key: z.string().min(1).max(200),
  domain: z.string().min(1).max(300),
  email: z.string().email().max(200),
});

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  // Sends email — keep tight per IP.
  if (!rateLimit(`otp-req:${ip}`, 5, 15 * 60_000)) {
    return corsJson({ error: "rate_limited" }, 429);
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return corsJson({ error: "invalid_input" }, 400);
  const { widget_key, domain, email } = parsed.data;

  const project = await getProjectByWidgetKey(widget_key);
  if (project) {
    const site = await findSite(project.id, normalizeDomain(domain));
    if (site && site.status === "approved") {
      const code = await createOtp(project.id, email);
      const settings = parseSettings(project);
      await sendOtpEmail(email, code, project.name, {
        accent: settings.accentColor,
        logo: settings.logoUrl,
      });
    }
  }

  // Always report success — never reveal whether an email has conversations.
  return corsJson({ ok: true });
}
