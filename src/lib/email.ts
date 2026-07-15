import { Resend } from "resend";
import { emailEnabled, env } from "./env";

const resend = emailEnabled ? new Resend(env.email.resendApiKey) : null;

const DEFAULT_ACCENT = "#0B1437";
const DEFAULT_BRAND = "Revisto";

export interface EmailBrand {
  /** Accent color, taken from the related widget/site. */
  accent?: string;
  /** Brand/widget name shown in the header. */
  name?: string;
  /** Absolute URL to the widget's logo, shown in the header. */
  logo?: string;
}

/** Public Revisto logo, always shown in the email footer. */
const REVISTO_LOGO_URL = `${env.publicBaseUrl}/icon-192.png`;

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

/** Guard against malformed color values slipping into inline styles. */
function safeColor(c: string | undefined): string {
  if (!c) return DEFAULT_ACCENT;
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$|^rgb/i.test(c.trim()) ? c.trim() : DEFAULT_ACCENT;
}

/** Only allow http(s) image URLs into the <img src> to avoid injection. */
function safeUrl(u: string | undefined): string | null {
  if (!u) return null;
  const t = u.trim();
  return /^https?:\/\/[^\s"'<>]+$/i.test(t) ? t : null;
}

/**
 * Corporate email shell. Wraps content in a branded, email-client-safe layout
 * whose accent color comes from the related widget (or site).
 */
function wrapEmail(opts: { brand?: EmailBrand; title: string; content: string; cta?: { label: string; href: string } }): string {
  const accent = safeColor(opts.brand?.accent);
  const brandName = esc(opts.brand?.name || DEFAULT_BRAND);
  const logo = safeUrl(opts.brand?.logo);
  // Widget logo if configured, otherwise a solid accent tile as the mark.
  const brandMark = logo
    ? `<img src="${esc(logo)}" alt="${brandName}" width="26" height="26" style="display:block;width:26px;height:26px;border-radius:8px;object-fit:cover;border:0" />`
    : `<span style="display:inline-block;width:26px;height:26px;border-radius:8px;background:${accent};vertical-align:middle"></span>`;
  const cta = opts.cta
    ? `<tr><td style="padding:8px 0 0">
        <a href="${esc(opts.cta.href)}" style="display:inline-block;background:${accent};color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:10px;font-weight:600;font-size:14px">${esc(opts.cta.label)}</a>
      </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,.08)">
        <tr><td style="height:4px;background:${accent}"></td></tr>
        <tr><td style="padding:22px 32px 0">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle">
              ${brandMark}
            </td>
            <td style="vertical-align:middle;padding-left:10px">
              <span style="font-size:15px;font-weight:700;color:#0f172a;vertical-align:middle">${brandName}</span>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:20px 32px 8px">
          <h1 style="margin:0 0 4px;font-size:19px;line-height:1.35;color:#0f172a">${esc(opts.title)}</h1>
        </td></tr>
        <tr><td style="padding:0 32px 8px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-size:14px;color:#334155;line-height:1.6">
            ${opts.content}
          </td></tr>${cta}</table>
        </td></tr>
        <tr><td style="padding:24px 32px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb">
            <tr>
              <td style="padding-top:16px;vertical-align:middle">
                <a href="${esc(env.publicBaseUrl)}" style="text-decoration:none;color:#94a3b8">
                  <img src="${esc(REVISTO_LOGO_URL)}" alt="Revisto" width="18" height="18" style="vertical-align:middle;width:18px;height:18px;border-radius:5px;border:0" />
                  <span style="vertical-align:middle;padding-left:7px;font-size:12px;color:#94a3b8">
                    ${brandName === DEFAULT_BRAND ? "" : `${brandName} · `}Revisto ile gönderildi
                  </span>
                </a>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

async function deliver(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    // Dev / unconfigured: log instead of sending so the flow stays testable.
    console.info(`[email:dev] to=${to} subject="${subject}"\n${html}`);
    return;
  }
  try {
    const { data, error } = await resend.emails.send({ from: env.email.from, to, subject, html });
    if (error) console.error("[email] send rejected", error);
    else console.info(`[email] sent id=${data?.id} to=${to} subject="${subject}"`);
  } catch (err) {
    console.error("[email] send failed", err);
  }
}

export interface ConversationMessage {
  author: "admin" | "user";
  message: string;
  created_at: number;
}

function buildHistoryHtml(
  history: ConversationMessage[],
  accent: string,
  adminLabel = "Destek",
  userLabel = "Sen",
): string {
  if (!history.length) return "";
  const items = history
    .map((m) => {
      const isAdmin = m.author === "admin";
      const date = new Date(m.created_at).toLocaleString("tr-TR");
      return `<div style="margin-bottom:8px;padding:10px 14px;border-radius:8px;background:${isAdmin ? "#f8f9ff" : "#f8fafc"};border-left:3px solid ${isAdmin ? accent : "#cbd5e1"}">
        <div style="font-size:11px;color:#94a3b8;margin-bottom:4px">${esc(isAdmin ? adminLabel : userLabel)} · ${esc(date)}</div>
        <div style="color:#334155;font-size:14px;white-space:pre-wrap">${esc(m.message)}</div>
      </div>`;
    })
    .join("");
  return `<div style="margin:16px 0 0">
    <div style="font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Konuşma Geçmişi</div>
    ${items}
  </div>`;
}

/** Notify the end user that support replied to their conversation. */
export async function sendReplyNotification(
  to: string,
  token: string,
  snippet: string,
  history: ConversationMessage[] = [],
  brand?: EmailBrand,
): Promise<void> {
  const accent = safeColor(brand?.accent);
  const content = `
    <blockquote style="margin:0 0 14px;padding:10px 14px;background:#f8fafc;border-left:3px solid ${accent};color:#334155;border-radius:0 8px 8px 0">
      ${esc(snippet.slice(0, 280))}
    </blockquote>
    <p style="margin:0 0 4px;color:#475569">
      Widget'ta <strong>Geçmiş</strong> sekmesinden e-postanla konuşmanı açabilirsin.
    </p>
    ${buildHistoryHtml(history, accent, "Destek", "Sen")}`;
  await deliver(to, "Konuşmanıza yeni bir yanıt geldi", wrapEmail({ brand, title: "Yeni bir yanıt geldi", content }));
}

/** Notify the project owner that a user replied to a conversation. */
export async function sendAdminReplyNotification(
  adminEmail: string,
  token: string,
  userMessage: string,
  feedback: { category: string },
  history: ConversationMessage[] = [],
  brand?: EmailBrand,
): Promise<void> {
  if (!adminEmail) return;
  const accent = safeColor(brand?.accent);
  const content = `
    <div style="margin-bottom:12px;padding:6px 12px;border-radius:6px;background:#f1f5f9;font-size:12px;color:#64748b">
      <strong>Kategori:</strong> ${esc(feedback.category)}
    </div>
    <blockquote style="margin:0;padding:10px 14px;background:#fef3f2;border-left:3px solid #f97316;color:#334155;border-radius:0 8px 8px 0">
      ${esc(userMessage.slice(0, 500))}
    </blockquote>
    ${buildHistoryHtml(history, accent, "Destek", "Kullanıcı")}`;
  await deliver(adminEmail, `Yeni kullanıcı yanıtı: ${feedback.category}`, wrapEmail({ brand, title: "Kullanıcı yanıt verdi", content }));
}

/** Generic panel notification email (new feedback, status change, …). */
export async function sendNotificationEmail(
  to: string,
  title: string,
  body: string,
  link: string | null,
  brand?: EmailBrand,
): Promise<void> {
  const content = `<p style="margin:0;color:#475569;white-space:pre-wrap">${esc(body)}</p>`;
  await deliver(
    to,
    title,
    wrapEmail({
      brand,
      title,
      content,
      cta: link ? { label: "Panelde aç", href: `${env.publicBaseUrl}${link}` } : undefined,
    }),
  );
}

/** 6-digit conversation access code for the widget (OTP). */
export async function sendOtpEmail(
  to: string,
  code: string,
  projectName: string,
  brand?: EmailBrand,
): Promise<void> {
  const accent = safeColor(brand?.accent);
  const content = `
    <p style="margin:0 0 16px;color:#475569">
      <strong>${esc(projectName)}</strong> geri bildirim geçmişine erişmek için aşağıdaki kodu gir. Kod 10 dakika geçerlidir.
    </p>
    <div style="display:inline-block;background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:14px 22px;font:700 28px/1 ui-monospace,Menlo,monospace;letter-spacing:8px;color:${accent}">${esc(code)}</div>
    <p style="color:#94a3b8;font-size:12px;margin:16px 0 0">Bu isteği sen yapmadıysan bu e-postayı yok sayabilirsin.</p>`;
  await deliver(to, `Doğrulama kodu: ${code}`, wrapEmail({ brand: { ...brand, name: projectName }, title: "Doğrulama kodun", content }));
}

/** Invites a person to become an agent (collaborator) on a project's inbox. */
export async function sendAgentInviteEmail(
  to: string,
  token: string,
  projectName: string,
  inviterName: string,
  categories: string[] | null,
  brand?: EmailBrand,
): Promise<void> {
  const categoryLine = categories?.length
    ? `<p style="margin:0 0 16px;color:#475569"><strong>Kategoriler:</strong> ${esc(categories.join(", "))}</p>`
    : "";
  const content = `
    <p style="margin:0 0 12px;color:#475569">
      <strong>${esc(inviterName)}</strong>, seni <strong>${esc(projectName)}</strong> widget'ının gelen kutusunda
      ajan olarak yardımcı olman için davet etti.
    </p>
    ${categoryLine}
    <p style="color:#94a3b8;font-size:12px;margin:16px 0 0">Bu davet 7 gün geçerlidir.</p>`;
  await deliver(
    to,
    `${projectName} — ajan daveti`,
    wrapEmail({
      brand: { ...brand, name: projectName },
      title: "Ekibe katılmaya davet edildin",
      content,
      cta: { label: "Daveti görüntüle", href: `${env.publicBaseUrl}/agent-invite/${token}` },
    }),
  );
}
