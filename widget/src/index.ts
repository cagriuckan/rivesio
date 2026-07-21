import { widgetCss } from "./styles";
import { captureElementFrame, captureViewport, releaseFrame, renderHighlightedElement, selectAndCapture } from "./capture";

interface WidgetText {
  fabLabel: string;
  title: string;
  categoryLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
}

type WidgetLocale = "tr" | "en";

interface FormField {
  id: string;
  type: "text" | "textarea" | "select" | "checkbox" | "email";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface ServerConfig {
  base: string;
  widgetKey: string;
  project: {
    name: string;
    accentColor: string;
    position: "bottom-right" | "bottom-left";
    fabStyle?: "label" | "icon";
    theme?: "auto" | "dark" | "light";
    categories: string[];
    text?: Record<WidgetLocale, WidgetText>;
    fields?: FormField[];
  };
}

/** Per-site runtime config resolved by /register (conversation, support, limits). */
interface Runtime {
  conversationEnabled: boolean;
  emailRequired: boolean;
  support: { unlimited: boolean; endsAt: number | null } | null;
  canSubmit: boolean;
  blockedReason: string | null;
}

const DEFAULT_TEXT: Record<WidgetLocale, WidgetText> = {
  tr: {
    fabLabel: "Geri bildirim",
    title: "Geri bildirim",
    categoryLabel: "Kategori",
    messageLabel: "Açıklama",
    messagePlaceholder: "Ne eklensin ya da nerede bir sorun var?",
    submitLabel: "Gönder",
    successMessage: "Teşekkürler! Geri bildirimin alındı.",
    errorMessage: "Gönderilemedi. Lütfen tekrar dene.",
  },
  en: {
    fabLabel: "Feedback",
    title: "Feedback",
    categoryLabel: "Category",
    messageLabel: "Description",
    messagePlaceholder: "What should be added, or where is the problem?",
    submitLabel: "Send",
    successMessage: "Thanks! Your feedback was received.",
    errorMessage: "Couldn't send. Please try again.",
  },
};

// Non-customizable UI chrome (tabs, history, conversation), localized in code.
const UI = {
  tr: {
    tabForm: "Gönderim",
    tabHistory: "Geçmiş",
    historyEmpty: "Henüz bir konuşman yok.",
    otpTitle: "Geçmişine eriş",
    otpHint: "E-postana göndereceğimiz 6 haneli kodla tüm konuşmalarını görebilirsin.",
    sendCode: "Kod gönder",
    codePlaceholder: "6 haneli kod",
    verify: "Doğrula",
    codeSent: "Kod e-postana gönderildi.",
    invalidCode: "Kod hatalı ya da süresi doldu.",
    changeEmail: "Değiştir",
    newReplyBadge: "Yeni yanıt",
    open: "Aç",
    emailPlaceholder: "E-posta adresin",
    supportUnlimited: "Sınırsız destek",
    supportLeft: (d: number) => `Destek: ${d} gün kaldı`,
    supportLastDay: "Destek bugün sona eriyor",
    supportEnded: "Destek süresi doldu",
    emailLabel: "E-posta",
    emailHint: "Yanıtları takip etmek ve kodunu kurtarmak için.",
    tokenSaved: "Erişim kodun",
    tokenHint: "Konuşmana Geçmiş sekmesinden e-postanla erişebilirsin.",
    replyPlaceholder: "Yanıtını yaz…",
    send: "Gönder",
    sending: "Gönderiliyor…",
    you: "Sen",
    support: "Destek",
    loadError: "Konuşma yüklenemedi.",
    notFound: "Konuşma bulunamadı. Kodu kontrol et.",
    closedNotice: "Destek süresi dolduğu için yeni yanıt eklenemiyor.",
    back: "Geri",
    copied: "Kopyalandı",
    copy: "Kodu kopyala",
    newSubmission: "Yeni gönderim",
    addImage: "Görsel ekle",
    attachmentSent: "📎 Ek gönderildi",
    poweredBy: "Çalıştırdığımız platform",
  },
  en: {
    tabForm: "Submit",
    tabHistory: "History",
    historyEmpty: "You have no conversations yet.",
    otpTitle: "Access your history",
    otpHint: "We'll email you a 6-digit code to see all your conversations.",
    sendCode: "Send code",
    codePlaceholder: "6-digit code",
    verify: "Verify",
    codeSent: "The code was sent to your email.",
    invalidCode: "Wrong or expired code.",
    changeEmail: "Change",
    newReplyBadge: "New reply",
    open: "Open",
    emailPlaceholder: "Your email",
    supportUnlimited: "Unlimited support",
    supportLeft: (d: number) => `Support: ${d} days left`,
    supportLastDay: "Support ends today",
    supportEnded: "Support period ended",
    emailLabel: "Email",
    emailHint: "To follow replies and recover your code.",
    tokenSaved: "Your access code",
    tokenHint: "You can return to this conversation from the History tab with your email.",
    replyPlaceholder: "Write your reply…",
    send: "Send",
    sending: "Sending…",
    you: "You",
    support: "Support",
    loadError: "Couldn't load the conversation.",
    notFound: "Conversation not found. Check the code.",
    closedNotice: "Support period ended; new replies are disabled.",
    back: "Back",
    copied: "Copied",
    copy: "Copy code",
    newSubmission: "New submission",
    addImage: "Add image",
    attachmentSent: "📎 Attachment sent",
    poweredBy: "Powered by",
  },
} as const;

// Compact Rivesio brand mark for the widget footer.
const BRAND_MARK = `<svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="7" fill="#0B1437"/><ellipse cx="12" cy="11.2" rx="6.2" ry="5" fill="#fff"/><path d="M8.5 14.5 L7 18 L11.5 15.4 Z" fill="#fff"/><circle cx="9.4" cy="11.2" r="1" fill="#0B1437"/><circle cx="12" cy="11.2" r="1" fill="#0B1437"/><circle cx="14.6" cy="11.2" r="1" fill="#0B1437"/></svg>`;

function submitErrorText(code: string | null, locale: WidgetLocale): string {
  const tr: Record<string, string> = {
    support_ended: "Destek süresi doldu, yeni gönderim alınamıyor.",
    daily_limit_site: "Bu site için günlük gönderim limitine ulaşıldı.",
    daily_limit_visitor: "Günlük gönderim limitine ulaştın. Yarın tekrar dene.",
    pending: "Bu site henüz onaylanmadı.",
    blocked: "Bu site engellenmiş.",
  };
  const en: Record<string, string> = {
    support_ended: "Support period ended; submissions are closed.",
    daily_limit_site: "Daily submission limit for this site reached.",
    daily_limit_visitor: "You've hit today's submission limit. Try again tomorrow.",
    pending: "This site isn't approved yet.",
    blocked: "This site is blocked.",
  };
  const dict = locale === "en" ? en : tr;
  return dict[code ?? ""] ?? (locale === "en" ? "Couldn't send. Please try again." : "Gönderilemedi. Lütfen tekrar dene.");
}

/** Pick widget locale from the host page's <html lang>, default tr. */
function detectLocale(): WidgetLocale {
  const lang = (document.documentElement.lang || "").toLowerCase();
  return lang.startsWith("en") ? "en" : "tr";
}

interface HostConfig {
  domain?: string;
  user?: string;
}

declare global {
  interface Window {
    __KF_CONFIG__?: ServerConfig;
    RivesioFeedback?: HostConfig;
  }
}

const MAX_ATTACHMENTS = 4;

interface Attachment {
  blob: Blob;
  url: string;
  kind: "screenshot" | "upload";
  annotationId?: string;
}

interface ElementAnnotation {
  id: string;
  kind: "element_annotation";
  // 1-based pick order, matches the numbered badge drawn on the element's screenshot.
  index: number;
  label: string;
  value: string;
  selector: string;
  tagName: string;
  text: string;
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
    viewportWidth: number;
    viewportHeight: number;
  };
}

function icon(path: string) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

const ICONS = {
  chat:   icon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  history: icon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
  copy:    icon('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
  camera: icon('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),
  crop: icon('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),
  target: icon('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>'),
  upload: icon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),
  close: icon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
  check: icon('<polyline points="20 6 9 17 4 12"/>'),
  alert: icon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),
  clock: icon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
  infinity: icon('<path d="M18.6 6.62a4.38 4.38 0 1 0 0 6.76L12 12l-6.6 1.38a4.38 4.38 0 1 0 0-6.76L12 12z"/>'),
  back: icon('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'),
  x: icon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
};

function localId(): string {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `ann_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function boot() {
  const server = window.__KF_CONFIG__;
  if (!server) return;
  const host: HostConfig = window.RivesioFeedback ?? {};

  const domain = host.domain || location.host;

  let registration: {
    enabled: boolean;
    project?: ServerConfig["project"];
    conversation?: { enabled: boolean; emailRequired: boolean };
    support?: { unlimited: boolean; endsAt: number | null };
    canSubmit?: boolean;
    blockedReason?: string | null;
  };
  try {
    const res = await fetch(`${server.base}/api/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        widget_key: server.widgetKey,
        domain,
        meta: { user: host.user, href: location.href },
      }),
    });
    registration = await res.json();
  } catch {
    return;
  }

  if (!registration.enabled) return;

  const cfg = { ...server.project, ...(registration.project ?? {}) };
  const runtime: Runtime = {
    conversationEnabled: registration.conversation?.enabled ?? false,
    emailRequired: registration.conversation?.emailRequired ?? false,
    support: registration.support ?? null,
    canSubmit: registration.canSubmit ?? true,
    blockedReason: registration.blockedReason ?? null,
  };
  mount(server, host, cfg, { domain }, runtime);
}

function mount(
  server: ServerConfig,
  host: HostConfig,
  project: ServerConfig["project"],
  ctx: { domain: string },
  runtime: Runtime,
) {
  const containerHost = document.createElement("div");
  containerHost.id = "rivesio-widget";
  document.body.appendChild(containerHost);
  const shadow = containerHost.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = widgetCss;
  shadow.appendChild(style);

  const root = document.createElement("div");
  root.className = "kf-root";
  root.dataset.pos = project.position || "bottom-right";
  root.dataset.fab = project.fabStyle || "label";
  root.style.setProperty("--kf-accent", project.accentColor || "#0B1437");

  // Theme: "auto" mirrors the host page's data-theme; otherwise force dark/light.
  const theme = project.theme || "auto";
  if (theme === "light") {
    root.dataset.theme = "light";
  } else if (theme === "auto") {
    const pageTheme = document.documentElement.getAttribute("data-theme");
    if (pageTheme === "light") root.dataset.theme = "light";
  }
  // "dark" is the default styling; no data-theme needed.

  const locale = detectLocale();
  const txt: WidgetText = { ...DEFAULT_TEXT[locale], ...(project.text?.[locale]) };
  const ui = UI[locale];
  const fields = project.fields ?? [];
  const convo = runtime.conversationEnabled;

  const categoryOptions = (project.categories ?? ["Öneri"])
    .map((c) => `<option value="${esc(c)}">${esc(c)}</option>`)
    .join("");

  const customFieldsHtml = fields
    .map((f) => {
      const req = f.required ? "required" : "";
      const ph = f.placeholder ? `placeholder="${esc(f.placeholder)}"` : "";
      const label = `<label class="kf-label">${esc(f.label)}${f.required ? " *" : ""}</label>`;
      let control = "";
      if (f.type === "textarea") {
        control = `<textarea class="kf-textarea kf-cf" data-cf="${esc(f.id)}" data-cf-label="${esc(f.label)}" ${ph} ${req}></textarea>`;
      } else if (f.type === "select") {
        const opts = (f.options ?? [])
          .map((o) => `<option value="${esc(o)}">${esc(o)}</option>`)
          .join("");
        control = `<select class="kf-select kf-cf" data-cf="${esc(f.id)}" data-cf-label="${esc(f.label)}" ${req}>${opts}</select>`;
      } else if (f.type === "checkbox") {
        return `<label class="kf-cf-check"><input type="checkbox" class="kf-cf" data-cf="${esc(f.id)}" data-cf-label="${esc(f.label)}" data-cf-type="checkbox" ${req}> ${esc(f.label)}</label>`;
      } else {
        const inputType = f.type === "email" ? "email" : "text";
        control = `<input type="${inputType}" class="kf-input kf-cf" data-cf="${esc(f.id)}" data-cf-label="${esc(f.label)}" ${ph} ${req}>`;
      }
      return `<div>${label}${control}</div>`;
    })
    .join("");

  const emailFieldHtml = convo
    ? `<div>
         <label class="kf-label">${esc(ui.emailLabel)}${runtime.emailRequired ? " *" : ""}</label>
         <input type="email" class="kf-input kf-email" placeholder="${esc(ui.emailPlaceholder)}" ${runtime.emailRequired ? "required" : ""}>
         <div class="kf-token-hint">${esc(ui.emailHint)}</div>
       </div>`
    : "";

  root.innerHTML = `
    <button class="kf-fab" type="button" aria-label="${esc(txt.fabLabel)}" data-tip="${esc(txt.fabLabel)}">
      ${ICONS.chat}<span>${esc(txt.fabLabel)}</span><span class="kf-fab-badge" hidden></span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="${esc(txt.title)}">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${ICONS.chat}</div>
          <span class="kf-title">${esc(txt.title)}</span>
        </div>
        <div class="kf-head-actions">
          <button class="kf-icon-btn kf-close-btn" type="button" aria-label="${esc(ui.back)}">${ICONS.close}</button>
        </div>
      </div>

      <div class="kf-tabs">
        <button class="kf-tab kf-tab-form" type="button" data-active="1">${ICONS.chat}<span>${esc(ui.tabForm)}</span></button>
        <button class="kf-tab kf-tab-history" type="button" data-active="0">${ICONS.history}<span>${esc(ui.tabHistory)}</span><span class="kf-tab-badge" hidden></span></button>
      </div>

      <div class="kf-support" hidden></div>
      <div class="kf-msg" hidden></div>

      <!-- ── FORM TAB ── -->
      <div class="kf-view-form">
        <div class="kf-body">
          <div>
            <label class="kf-label">${esc(txt.categoryLabel)}</label>
            <select class="kf-select" aria-label="${esc(txt.categoryLabel)}">${categoryOptions}</select>
          </div>

          <div>
            <label class="kf-label">${esc(txt.messageLabel)}</label>
            <textarea class="kf-textarea" placeholder="${esc(txt.messagePlaceholder)}"></textarea>
          </div>

          ${emailFieldHtml}
          ${customFieldsHtml}

          <div class="kf-capture-row">
            <button class="kf-chip kf-capture-full" type="button">${ICONS.camera} ${esc(locale === "en" ? "Full screen" : "Tüm ekran")}</button>
            <button class="kf-chip kf-capture-area" type="button">${ICONS.crop} ${esc(locale === "en" ? "Select area" : "Alan seç")}</button>
            <button class="kf-chip kf-element-select" type="button">${ICONS.target} ${esc(locale === "en" ? "Pick element" : "Öğe seç")}</button>
            <button class="kf-chip kf-chip-upload kf-upload" type="button" aria-label="${esc(ui.addImage)}">${ICONS.upload}</button>
          </div>

          <div class="kf-attach-row"><span class="kf-counter">0 / ${MAX_ATTACHMENTS}</span></div>
          <div class="kf-thumbs"></div>
          <div class="kf-annotations" hidden></div>
          <input class="kf-file" type="file" accept="image/*" multiple hidden />

          <div class="kf-hint">${esc(locale === "en" ? "Tip:" : "İpucu:")} <kbd>⌘ / Ctrl + /</kbd></div>
        </div>

        <div class="kf-foot">
          <button class="kf-btn kf-btn-ghost kf-cancel" type="button">${esc(locale === "en" ? "Cancel" : "Vazgeç")}</button>
          <button class="kf-btn kf-btn-primary kf-submit" type="button">${esc(txt.submitLabel)}</button>
        </div>
      </div>

      <!-- ── HISTORY TAB ── -->
      <div class="kf-view-history" hidden>
        <div class="kf-history-main">
          <div class="kf-session-bar" hidden>
            <span class="kf-session-email"></span>
            <button class="kf-link kf-session-change" type="button">${esc(ui.changeEmail)}</button>
          </div>
          <ul class="kf-history-list"></ul>
          <p class="kf-history-empty" hidden>${esc(ui.historyEmpty)}</p>
          ${convo ? `
          <div class="kf-otp">
            <div class="kf-recover-title">${esc(ui.otpTitle)}</div>
            <div class="kf-otp-hint">${esc(ui.otpHint)}</div>
            <div class="kf-recover-row kf-otp-step1">
              <input type="email" class="kf-input kf-otp-email" placeholder="${esc(ui.emailPlaceholder)}">
              <button class="kf-btn kf-btn-primary kf-otp-send" type="button">${esc(ui.sendCode)}</button>
            </div>
            <div class="kf-recover-row kf-otp-step2" hidden>
              <input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" class="kf-input kf-otp-code" placeholder="${esc(ui.codePlaceholder)}">
              <button class="kf-btn kf-btn-primary kf-otp-verify" type="button">${esc(ui.verify)}</button>
            </div>
          </div>` : ""}
        </div>

        <div class="kf-convo" hidden>
          <div class="kf-convo-head">
            <button class="kf-back" type="button">${ICONS.back} ${esc(ui.back)}</button>
            <span class="kf-convo-cat"></span>
          </div>
          <div class="kf-thread"></div>
          <div class="kf-reply-box">
            <textarea class="kf-reply-input kf-textarea" placeholder="${esc(ui.replyPlaceholder)}" style="min-height:64px"></textarea>
            <div class="kf-reply-foot">
              <span class="kf-counter kf-reply-counter">0 / ${MAX_ATTACHMENTS}</span>
              <button class="kf-chip kf-reply-upload" type="button" aria-label="${esc(ui.addImage)}">${ICONS.upload}</button>
              <button class="kf-btn kf-btn-primary kf-reply-send" type="button">${esc(ui.send)}</button>
            </div>
            <input class="kf-reply-file" type="file" accept="image/*" multiple hidden />
          </div>
          <div class="kf-convo-closed" hidden>${esc(ui.closedNotice)}</div>
        </div>
      </div>

      <a class="kf-powered" href="${esc(server.base)}" target="_blank" rel="noopener noreferrer">
        <span>${esc(ui.poweredBy)}</span>
        <span class="kf-brand">${BRAND_MARK}<span class="kf-brand-name">Rivesio</span></span>
      </a>

    </div>
  `;
  shadow.appendChild(root);

  const $ = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const fab            = $<HTMLButtonElement>(".kf-fab");
  const closeBtn       = $<HTMLButtonElement>(".kf-close-btn");
  const tabForm        = $<HTMLButtonElement>(".kf-tab-form");
  const tabHistory     = $<HTMLButtonElement>(".kf-tab-history");
  const cancelBtn      = $<HTMLButtonElement>(".kf-cancel");
  const submitBtn      = $<HTMLButtonElement>(".kf-submit");
  const capFullBtn     = $<HTMLButtonElement>(".kf-capture-full");
  const capAreaBtn     = $<HTMLButtonElement>(".kf-capture-area");
  const elementBtn     = $<HTMLButtonElement>(".kf-element-select");
  const uploadBtn      = $<HTMLButtonElement>(".kf-upload");
  const fileInput      = $<HTMLInputElement>(".kf-file");
  const textarea       = $<HTMLTextAreaElement>(".kf-view-form .kf-textarea");
  const emailInput     = root.querySelector<HTMLInputElement>(".kf-email");
  const select         = $<HTMLSelectElement>(".kf-view-form .kf-select");
  const thumbs         = $<HTMLDivElement>(".kf-thumbs");
  const counter        = $<HTMLSpanElement>(".kf-attach-row .kf-counter");
  const annotationsEl  = $<HTMLDivElement>(".kf-annotations");
  const msg            = $<HTMLDivElement>(".kf-msg");
  const supportEl      = $<HTMLDivElement>(".kf-support");
  const viewForm       = $<HTMLDivElement>(".kf-view-form");
  const formBody       = $<HTMLDivElement>(".kf-view-form .kf-body");
  const formFoot       = $<HTMLDivElement>(".kf-view-form .kf-foot");
  const viewHistory    = $<HTMLDivElement>(".kf-view-history");
  const historyMain    = $<HTMLDivElement>(".kf-history-main");
  const historyList    = $<HTMLUListElement>(".kf-history-list");
  const historyEmpty   = $<HTMLParagraphElement>(".kf-history-empty");
  const convoEl        = $<HTMLDivElement>(".kf-convo");
  const convoCat       = $<HTMLSpanElement>(".kf-convo-cat");
  const threadEl       = $<HTMLDivElement>(".kf-thread");
  const replyBox       = $<HTMLDivElement>(".kf-reply-box");
  const replyInput     = $<HTMLTextAreaElement>(".kf-reply-input");
  const replyFile      = $<HTMLInputElement>(".kf-reply-file");
  const replyUpload    = $<HTMLButtonElement>(".kf-reply-upload");
  const replySend      = $<HTMLButtonElement>(".kf-reply-send");
  const replyCounter   = $<HTMLSpanElement>(".kf-reply-counter");
  const convoClosed    = $<HTMLDivElement>(".kf-convo-closed");
  const backBtn        = $<HTMLButtonElement>(".kf-back");
  const fabBadge       = $<HTMLSpanElement>(".kf-fab-badge");
  const tabBadge       = $<HTMLSpanElement>(".kf-tab-badge");
  const sessionBar     = $<HTMLDivElement>(".kf-session-bar");
  const sessionEmail   = $<HTMLSpanElement>(".kf-session-email");
  const sessionChange  = $<HTMLButtonElement>(".kf-session-change");
  const otpBox         = root.querySelector<HTMLDivElement>(".kf-otp");
  const otpEmail       = root.querySelector<HTMLInputElement>(".kf-otp-email");
  const otpSendBtn     = root.querySelector<HTMLButtonElement>(".kf-otp-send");
  const otpStep2       = root.querySelector<HTMLDivElement>(".kf-otp-step2");
  const otpCode        = root.querySelector<HTMLInputElement>(".kf-otp-code");
  const otpVerifyBtn   = root.querySelector<HTMLButtonElement>(".kf-otp-verify");

  const attachments: Attachment[] = [];
  const annotations: ElementAnnotation[] = [];
  const replyAttachments: File[] = [];

  // ── Support badge ─────────────────────────────────────────────────
  function renderSupport() {
    const s = runtime.support;
    if (!s || s.unlimited || s.endsAt === null) {
      supportEl.hidden = true;
      return;
    }
    supportEl.hidden = false;
    const daysLeft = Math.ceil((s.endsAt - Date.now()) / 86_400_000);
    if (daysLeft <= 0) {
      supportEl.dataset.expired = "1";
      supportEl.innerHTML = `${ICONS.alert}<span>${esc(ui.supportEnded)}</span>`;
    } else {
      supportEl.dataset.expired = "0";
      const label = daysLeft === 1 ? ui.supportLastDay : ui.supportLeft(daysLeft);
      supportEl.innerHTML = `${ICONS.clock}<span>${esc(label)}</span>`;
    }
  }

  // ── History (localStorage + verified email session) ───────────────
  const HISTORY_KEY = `kf_history_${server.widgetKey}`;
  const SESSION_KEY = `kf_session_${server.widgetKey}`;
  const SEEN_KEY = `kf_seen_${server.widgetKey}`;

  interface HistoryEntry {
    id: string;
    token?: string;
    category: string;
    page: string;
    date: number;
  }

  interface ConversationSummary {
    token: string;
    category: string;
    created_at: number;
    last_activity_at: number;
    last_message: string;
    last_admin_reply_at: number | null;
  }

  interface EmailSession {
    email: string;
    conversations: ConversationSummary[];
    verifiedAt: number;
  }

  function loadHistory(): HistoryEntry[] {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
  }
  function saveToHistory(entry: HistoryEntry) {
    const list = loadHistory();
    list.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
  }

  function loadSession(): EmailSession | null {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
  }
  function saveSession(s: EmailSession | null) {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  }

  function loadSeen(): Record<string, number> {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY) || "{}"); } catch { return {}; }
  }
  function markSeen(token: string) {
    const seen = loadSeen();
    seen[token] = Date.now();
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
    updateBadges();
  }

  function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString(locale === "en" ? "en-US" : "tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString(locale === "en" ? "en-US" : "tr-TR", { hour: "2-digit", minute: "2-digit" });
  }
  function formatDay(ts: number): string {
    return new Date(ts).toLocaleDateString(locale === "en" ? "en-US" : "tr-TR", { day: "numeric", month: "long", year: "numeric" });
  }

  // ── Unread tracking (checked once on load) ────────────────────────
  // token → last admin reply timestamp reported by the server.
  const adminReplyAt: Record<string, number> = {};

  function knownTokens(): string[] {
    const session = loadSession();
    const tokens = new Set<string>();
    for (const c of session?.conversations ?? []) tokens.add(c.token);
    for (const e of loadHistory()) if (e.token) tokens.add(e.token);
    return Array.from(tokens);
  }

  function isUnread(token: string): boolean {
    const at = adminReplyAt[token];
    if (!at) return false;
    return (loadSeen()[token] ?? 0) < at;
  }

  function unreadCount(): number {
    return knownTokens().filter(isUnread).length;
  }

  function updateBadges() {
    const n = unreadCount();
    fabBadge.hidden = n === 0;
    fabBadge.textContent = n > 9 ? "9+" : String(n);
    tabBadge.hidden = n === 0;
    tabBadge.textContent = n > 9 ? "9+" : String(n);
  }

  async function checkUnread() {
    if (!convo) return;
    const tokens = knownTokens().slice(0, 50);
    if (!tokens.length) return;
    try {
      const res = await fetch(`${server.base}/api/v1/conversation/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widget_key: server.widgetKey, tokens }),
      });
      if (!res.ok) return;
      const data = await res.json();
      for (const [token, s] of Object.entries<{ last_admin_reply_at: number | null }>(data.statuses ?? {})) {
        if (s.last_admin_reply_at) adminReplyAt[token] = s.last_admin_reply_at;
      }
      updateBadges();
    } catch {
      // Offline — badges stay hidden.
    }
  }

  function historyRow(args: {
    title: string;
    snippet: string;
    date: number;
    token?: string;
    id?: string;
    unread: boolean;
  }): HTMLLIElement {
    const li = document.createElement("li");
    li.className = "kf-history-item";
    if (args.unread) li.dataset.unread = "1";
    li.innerHTML = `
      <div class="kf-hi-left">
        <span class="kf-hi-cat">${esc(args.title)}${args.unread ? `<span class="kf-hi-dot" title="${esc(ui.newReplyBadge)}"></span>` : ""}</span>
        <span class="kf-hi-page">${esc(args.snippet)}</span>
      </div>
      <div class="kf-hi-right">
        <span class="kf-hi-date">${esc(formatDate(args.date))}</span>
      </div>`;
    if (convo && args.token) {
      li.addEventListener("click", () => openConversation(args.token!));
    } else {
      li.style.cursor = "default";
    }
    return li;
  }

  function renderHistory() {
    const session = loadSession();
    historyList.innerHTML = "";

    // Verified session bar + OTP box visibility.
    sessionBar.hidden = !session;
    if (session) sessionEmail.textContent = session.email;
    if (otpBox) otpBox.hidden = !!session;

    const rows: HTMLLIElement[] = [];
    const seenTokens = new Set<string>();

    for (const c of session?.conversations ?? []) {
      seenTokens.add(c.token);
      rows.push(historyRow({
        title: c.category,
        snippet: c.last_message,
        date: c.last_activity_at,
        token: c.token,
        unread: isUnread(c.token),
      }));
    }
    // Local (this-device) submissions not already covered by the session list.
    for (const e of loadHistory()) {
      if (e.token && seenTokens.has(e.token)) continue;
      rows.push(historyRow({
        title: e.category,
        snippet: e.page,
        date: e.date,
        token: e.token,
        id: e.id,
        unread: e.token ? isUnread(e.token) : false,
      }));
    }

    historyEmpty.hidden = rows.length > 0;
    rows.forEach((r) => historyList.appendChild(r));
  }

  // ── Tabs ──────────────────────────────────────────────────────────

  // Restore the form after a success screen (form body + footer hidden on submit).
  function restoreForm() {
    formBody.hidden = false;
    formFoot.hidden = false;
  }

  function showForm() {
    tabForm.dataset.active = "1";
    tabHistory.dataset.active = "0";
    viewForm.hidden = false;
    viewHistory.hidden = true;
    restoreForm();
    supportEl.hidden = !runtime.support;
    renderSupport();
    setMessage("", null);
  }
  function showHistory() {
    tabForm.dataset.active = "0";
    tabHistory.dataset.active = "1";
    viewForm.hidden = true;
    viewHistory.hidden = false;
    supportEl.hidden = true;
    setMessage("", null);
    closeConversation();
    renderHistory();
  }
  tabForm.addEventListener("click", showForm);
  tabHistory.addEventListener("click", showHistory);

  // ── Copy helper ────────────────────────────────────────────────────
  function copyText(text: string, btn?: Element) {
    navigator.clipboard?.writeText(text).catch(() => {});
    if (btn) {
      btn.classList.add("copied");
      const prev = btn.innerHTML;
      btn.innerHTML = ICONS.check;
      setTimeout(() => { btn.classList.remove("copied"); btn.innerHTML = prev; }, 1600);
    }
  }

  // ── UI helpers ────────────────────────────────────────────────────
  function setMessage(text: string, kind: "ok" | "err" | null) {
    if (!kind) { msg.hidden = true; msg.innerHTML = ""; return; }
    msg.hidden = false;
    msg.className = `kf-msg kf-${kind}`;
    msg.innerHTML = `${kind === "ok" ? ICONS.check : ICONS.alert} ${esc(text)}`;
  }

  function renderAttachments() {
    const atMax = attachments.length >= MAX_ATTACHMENTS;
    counter.textContent = `${attachments.length} / ${MAX_ATTACHMENTS}`;
    capFullBtn.disabled = atMax;
    capAreaBtn.disabled = atMax;
    elementBtn.disabled = atMax;
    uploadBtn.disabled  = atMax;

    thumbs.innerHTML = "";
    attachments.forEach((att, i) => {
      const wrap = document.createElement("div");
      wrap.className = "kf-thumb";
      wrap.innerHTML = `<img src="${att.url}" alt="ek"><button class="kf-thumb-del" type="button" aria-label="Kaldır">${ICONS.x}</button>`;
      wrap.querySelector("button")!.addEventListener("click", () => {
        URL.revokeObjectURL(att.url);
        if (att.annotationId) {
          const annIndex = annotations.findIndex((ann) => ann.id === att.annotationId);
          if (annIndex >= 0) annotations.splice(annIndex, 1);
        }
        attachments.splice(i, 1);
        renderAttachments();
        renderAnnotations();
      });
      thumbs.appendChild(wrap);
    });
  }

  function renderAnnotations() {
    annotationsEl.hidden = annotations.length === 0;
    annotationsEl.innerHTML = "";
    annotations.forEach((ann, i) => {
      const row = document.createElement("div");
      row.className = "kf-ann-item";
      row.innerHTML = `
        <div class="kf-ann-pin">${i + 1}</div>
        <div class="kf-ann-main">
          <div class="kf-ann-selector">${esc(ann.selector)}</div>
          <div class="kf-ann-note">${esc(ann.value)}</div>
        </div>
        <button class="kf-ann-del" type="button" aria-label="Kaldır">${ICONS.x}</button>`;
      row.querySelector("button")!.addEventListener("click", () => {
        for (let ai = attachments.length - 1; ai >= 0; ai--) {
          if (attachments[ai].annotationId === ann.id) {
            URL.revokeObjectURL(attachments[ai].url);
            attachments.splice(ai, 1);
          }
        }
        annotations.splice(i, 1);
        renderAttachments();
        renderAnnotations();
      });
      annotationsEl.appendChild(row);
    });
  }

  function addAttachment(blob: Blob, kind: "screenshot" | "upload", annotationId?: string) {
    if (attachments.length >= MAX_ATTACHMENTS) return;
    attachments.push({ blob, kind, annotationId, url: URL.createObjectURL(blob) });
    renderAttachments();
  }

  function open()   { root.dataset.open = "1"; if (!viewForm.hidden) setTimeout(() => textarea.focus(), 60); }
  function close()  { root.dataset.open = "0"; showForm(); }
  function toggle() { root.dataset.open === "1" ? close() : open(); }

  // ── Events ────────────────────────────────────────────────────────
  fab.addEventListener("click", toggle);
  closeBtn.addEventListener("click", close);
  cancelBtn.addEventListener("click", close);

  uploadBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    Array.from(fileInput.files ?? [])
      .filter((f) => f.type.startsWith("image/"))
      .forEach((f) => addAttachment(f, "upload"));
    fileInput.value = "";
  });

  capFullBtn.addEventListener("click", async () => {
    capFullBtn.disabled = true;
    capFullBtn.innerHTML = `${ICONS.camera} ${esc(locale === "en" ? "Waiting…" : "Bekleniyor…")}`;
    try {
      const blob = await captureViewport(containerHost);
      if (blob) addAttachment(blob, "screenshot");
      else setMessage(locale === "en" ? "Screen share cancelled." : "Ekran paylaşımı iptal edildi.", "err");
    } catch {
      setMessage(locale === "en" ? "Couldn't capture screen." : "Ekran yakalanamadı.", "err");
    } finally {
      capFullBtn.innerHTML = `${ICONS.camera} ${esc(locale === "en" ? "Full screen" : "Tüm ekran")}`;
      renderAttachments();
    }
  });

  capAreaBtn.addEventListener("click", async () => {
    capAreaBtn.disabled = true;
    capAreaBtn.innerHTML = `${ICONS.crop} ${esc(locale === "en" ? "Waiting…" : "Bekleniyor…")}`;
    try {
      const blob = await selectAndCapture(containerHost);
      if (blob) addAttachment(blob, "screenshot");
      else setMessage(locale === "en" ? "Area selection cancelled." : "Alan seçimi iptal edildi.", "err");
    } catch {
      setMessage(locale === "en" ? "Couldn't capture screen." : "Ekran yakalanamadı.", "err");
    } finally {
      capAreaBtn.innerHTML = `${ICONS.crop} ${esc(locale === "en" ? "Select area" : "Alan seç")}`;
      renderAttachments();
    }
  });

  elementBtn.addEventListener("click", async () => {
    if (attachments.length >= MAX_ATTACHMENTS) {
      setMessage(locale === "en" ? "Attachment limit reached." : "Ek sınırına ulaşıldı.", "err");
      return;
    }
    close();
    elementBtn.disabled = true;
    elementBtn.innerHTML = `${ICONS.target} ${esc(locale === "en" ? "Waiting…" : "Bekleniyor…")}`;
    const frame = await captureElementFrame(containerHost);
    if (!frame) {
      elementBtn.innerHTML = `${ICONS.target} ${esc(locale === "en" ? "Pick element" : "Öğe seç")}`;
      elementBtn.disabled = false;
      open();
      setMessage(locale === "en" ? "Screen capture was cancelled." : "Ekran paylaşımı iptal edildi.", "err");
      renderAttachments();
      return;
    }
    try {
      const pickIndex = annotations.length + 1;
      const ann = await selectElementAnnotation(containerHost, locale, pickIndex);
      if (ann) {
        const blob = await renderHighlightedElement(frame, {
          x: ann.rect.x, y: ann.rect.y, w: ann.rect.width, h: ann.rect.height,
        }, pickIndex);
        annotations.push(ann);
        if (blob) addAttachment(blob, "screenshot", ann.id);
        else setMessage(locale === "en" ? "Element screenshot couldn't be captured." : "Öğe ekran görüntüsü alınamadı.", "err");
        renderAnnotations();
      }
    } finally {
      releaseFrame(frame);
      elementBtn.innerHTML = `${ICONS.target} ${esc(locale === "en" ? "Pick element" : "Öğe seç")}`;
      elementBtn.disabled = false;
      open();
      renderAttachments();
    }
  });

  // ── Submit ────────────────────────────────────────────────────────
  function collectCustomFields(): { ok: boolean; values: { label: string; value: string }[] } {
    const els = root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(".kf-cf");
    const values: { label: string; value: string }[] = [];
    for (const el of Array.from(els)) {
      const label = el.dataset.cfLabel || "";
      const isCheckbox = el.dataset.cfType === "checkbox";
      const value = isCheckbox
        ? ((el as HTMLInputElement).checked ? (locale === "en" ? "Yes" : "Evet") : "")
        : el.value.trim();
      if (el.hasAttribute("required") && !value) {
        (el as HTMLElement).focus();
        return { ok: false, values: [] };
      }
      if (value) values.push({ label, value });
    }
    return { ok: true, values };
  }

  function applySubmitGate() {
    if (!runtime.canSubmit) {
      submitBtn.disabled = true;
      setMessage(submitErrorText(runtime.blockedReason, locale), "err");
    }
  }

  async function submit() {
    if (!runtime.canSubmit) {
      setMessage(submitErrorText(runtime.blockedReason, locale), "err");
      return;
    }
    const message = textarea.value.trim();
    if (!message) {
      setMessage(locale === "en" ? "Please write a description." : "Lütfen bir açıklama yaz.", "err");
      textarea.focus();
      return;
    }
    const email = emailInput?.value.trim() || "";
    if (emailInput?.hasAttribute("required") && !email) {
      setMessage(locale === "en" ? "Please enter your email." : "Lütfen e-postanı gir.", "err");
      emailInput.focus();
      return;
    }
    const custom = collectCustomFields();
    if (!custom.ok) {
      setMessage(locale === "en" ? "Please fill required fields." : "Lütfen zorunlu alanları doldur.", "err");
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = locale === "en" ? "Sending…" : "Gönderiliyor…";
    setMessage("", null);

    try {
      const res = await fetch(`${server.base}/api/v1/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widget_key: server.widgetKey,
          domain: ctx.domain,
          category: select.value,
          message,
          email: email || undefined,
          page_url: location.href,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          wp_user: host.user,
          locale,
          custom_fields: [...custom.values, ...annotations],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage(submitErrorText(data?.error ?? null, locale), "err");
        return;
      }

      // Each picked element became its own reply message server-side; map the
      // local annotation id to that reply id so its screenshot attaches to the
      // right message instead of falling back onto the main feedback message.
      const annotationReplyIds = new Map<string, string>(
        ((data.annotation_replies ?? []) as { id: string; reply_id: string }[]).map((r) => [r.id, r.reply_id]),
      );

      let failedAttachments = 0;
      for (const att of attachments) {
        const fd = new FormData();
        fd.append("widget_key", server.widgetKey);
        fd.append("domain", ctx.domain);
        fd.append("kind", att.kind);
        const ext = att.blob.type === "image/png" ? "png" : "jpg";
        fd.append("file", att.blob, `${att.kind}.${ext}`);
        const replyId = att.annotationId ? annotationReplyIds.get(att.annotationId) : undefined;
        if (replyId) fd.append("reply_id", replyId);
        const ok = await fetch(`${server.base}/api/v1/feedback/${data.feedback_id}/attachment`, {
          method: "POST", body: fd,
        }).then((r) => r.ok).catch(() => false);
        if (!ok) failedAttachments++;
      }

      const fid: string = data.feedback_id;
      const token: string | undefined = data.token;
      saveToHistory({ id: fid, token, category: select.value, page: location.pathname, date: Date.now() });

      const warningHtml = failedAttachments > 0
        ? `<div class="kf-msg kf-warn">${ICONS.alert} ${esc(
            locale === "en"
              ? `${failedAttachments} attachment${failedAttachments > 1 ? "s" : ""} could not be uploaded.`
              : `${failedAttachments} ek yüklenemedi.`
          )}</div>`
        : "";
      const copyValue = fid;
      const codeLabel = locale === "en" ? "Reference" : "Referans no";
      const codeText = `#${fid.slice(0, 8)}`;
      const codeHint = convo && token ? `<div class="kf-token-hint">${esc(ui.tokenHint)}</div>` : "";

      // Success screen: hide the form and show only the confirmation + copyable code.
      formBody.hidden = true;
      formFoot.hidden = true;
      supportEl.hidden = true;
      msg.hidden = false;
      msg.className = "kf-msg kf-ok kf-success";
      msg.innerHTML = `
        <div class="kf-success-head">${ICONS.check}<span>${esc(txt.successMessage)}</span></div>
        <div class="kf-token-box">
          <span class="kf-token-label">${esc(codeLabel)}</span>
          <div class="kf-token-row">
            <span class="kf-token-val" title="${esc(copyValue)}">${esc(codeText)}</span>
          </div>
          <button class="kf-btn kf-btn-primary kf-token-copy" type="button">${ICONS.copy}<span>${esc(ui.copy)}</span></button>
          ${codeHint}
        </div>
        ${warningHtml}
        <button class="kf-btn kf-btn-ghost kf-new-submit" type="button">${esc(ui.newSubmission)}</button>`;
      msg.querySelector(".kf-token-copy")?.addEventListener("click", (e) =>
        copyText(copyValue, e.currentTarget as Element),
      );
      msg.querySelector(".kf-new-submit")?.addEventListener("click", () => {
        restoreForm();
        supportEl.hidden = !runtime.support;
        renderSupport();
        setMessage("", null);
        textarea.focus();
      });

      textarea.value = "";
      if (emailInput) emailInput.value = email; // keep email for convenience
      root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(".kf-cf").forEach((el) => {
        if (el.dataset.cfType === "checkbox") (el as HTMLInputElement).checked = false;
        else el.value = "";
      });
      attachments.splice(0).forEach((a) => URL.revokeObjectURL(a.url));
      annotations.splice(0);
      renderAttachments();
      renderAnnotations();
    } catch {
      setMessage(locale === "en" ? "Connection error. Please try again." : "Bağlantı hatası. Lütfen tekrar dene.", "err");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = txt.submitLabel;
    }
  }
  submitBtn.addEventListener("click", submit);

  // ── Conversation ──────────────────────────────────────────────────
  let currentToken: string | null = null;

  function closeConversation() {
    currentToken = null;
    convoEl.hidden = true;
    historyMain.hidden = false;
    replyAttachments.splice(0);
  }

  backBtn.addEventListener("click", () => { closeConversation(); renderHistory(); });

  async function openConversation(token: string) {
    currentToken = token;
    historyMain.hidden = true;
    convoEl.hidden = false;
    threadEl.innerHTML = `<p class="kf-history-empty">…</p>`;
    convoClosed.hidden = true;
    replyBox.hidden = true;
    try {
      const res = await fetch(`${server.base}/api/v1/conversation/${encodeURIComponent(token)}`);
      if (res.status === 404) { threadEl.innerHTML = `<p class="kf-history-empty">${esc(ui.notFound)}</p>`; return; }
      if (!res.ok) { threadEl.innerHTML = `<p class="kf-history-empty">${esc(ui.loadError)}</p>`; return; }
      const data = await res.json();
      renderThread(data.conversation, token);
      markSeen(token);
      const canReply = !!data.can_reply;
      replyBox.hidden = !canReply;
      convoClosed.hidden = canReply;
      renderReplyCounter();
    } catch {
      threadEl.innerHTML = `<p class="kf-history-empty">${esc(ui.loadError)}</p>`;
    }
  }

  function bubble(args: {
    author: string;
    ts: number;
    body: string;
    mine: boolean;
    imgs?: { url: string }[];
  }): string {
    const imgHtml = args.imgs?.length
      ? `<div class="kf-convo-imgs">${args.imgs.map((i) => `<img src="${esc(i.url)}" alt="ek">`).join("")}</div>`
      : "";
    return `<div class="kf-msg-row ${args.mine ? "kf-mine" : "kf-theirs"}">
      <div class="kf-bubble">
        <div class="kf-bubble-body">${esc(args.body)}</div>${imgHtml}
      </div>
      <div class="kf-bubble-time">${esc(args.author)} · ${esc(formatTime(args.ts))}</div>
    </div>`;
  }

  interface ConvoData {
    category: string;
    message: string;
    created_at: number;
    attachments: { url: string; kind: string; reply_id: string | null }[];
    replies: { id: string; author: "admin" | "user"; message: string; created_at: number }[];
  }

  function renderThread(c: ConvoData, _token: string) {
    convoCat.textContent = c.category;
    const originImgs = c.attachments.filter((a) => !a.reply_id).map((a) => ({ url: a.url }));
    const messages = [
      { author: "user" as const, message: c.message, created_at: c.created_at, imgs: originImgs },
      ...c.replies.map((r) => ({
        ...r,
        imgs: c.attachments.filter((a) => a.reply_id === r.id).map((a) => ({ url: a.url })),
      })),
    ];
    let html = "";
    let lastDay = "";
    for (const m of messages) {
      const day = formatDay(m.created_at);
      if (day !== lastDay) {
        html += `<div class="kf-day-sep"><span>${esc(day)}</span></div>`;
        lastDay = day;
      }
      const isUser = m.author === "user";
      html += bubble({
        author: isUser ? ui.you : ui.support,
        ts: m.created_at,
        body: m.message,
        mine: isUser,
        imgs: m.imgs,
      });
    }
    threadEl.innerHTML = html;
    threadEl.querySelectorAll<HTMLImageElement>(".kf-convo-imgs img").forEach((img) => {
      img.addEventListener("click", () => window.open(img.src, "_blank"));
    });
    threadEl.scrollTop = threadEl.scrollHeight;
  }

  function renderReplyCounter() {
    replyCounter.textContent = `${replyAttachments.length} / ${MAX_ATTACHMENTS}`;
    replyUpload.toggleAttribute("disabled", replyAttachments.length >= MAX_ATTACHMENTS);
  }

  replyUpload.addEventListener("click", () => replyFile.click());
  replyFile.addEventListener("change", () => {
    Array.from(replyFile.files ?? [])
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_ATTACHMENTS - replyAttachments.length)
      .forEach((f) => replyAttachments.push(f));
    replyFile.value = "";
    renderReplyCounter();
  });

  async function sendReply() {
    if (!currentToken) return;
    const message = replyInput.value.trim();
    if (!message && replyAttachments.length === 0) { replyInput.focus(); return; }
    replySend.disabled = true;
    replySend.textContent = ui.sending;
    try {
      // Attachments must be pinned to a reply row so they render next to the
      // message that sent them, rather than being lost/misattributed to the
      // very first message in the thread. If the user only attached images
      // with no text, create a placeholder reply to hold them.
      let replyId: string | null = null;
      if (message || replyAttachments.length > 0) {
        const res = await fetch(`${server.base}/api/v1/conversation/${encodeURIComponent(currentToken)}/reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: message || ui.attachmentSent, page_url: location.href }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setMessage(submitErrorText(d?.error ?? null, locale), "err");
          return;
        }
        const data = await res.json().catch(() => null);
        replyId = data?.reply?.id ?? null;
      }
      for (const file of replyAttachments) {
        const fd = new FormData();
        fd.append("file", file, file.name || "image.jpg");
        if (replyId) fd.append("reply_id", replyId);
        await fetch(`${server.base}/api/v1/conversation/${encodeURIComponent(currentToken)}/attachment`, {
          method: "POST", body: fd,
        }).catch(() => {});
      }
      replyInput.value = "";
      replyAttachments.splice(0);
      renderReplyCounter();
      await openConversation(currentToken);
    } finally {
      replySend.disabled = false;
      replySend.textContent = ui.send;
    }
  }
  replySend.addEventListener("click", sendReply);

  // Enter = send, Shift+Enter = newline in reply textarea
  replyInput.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  });

  // ── Email OTP history access ───────────────────────────────────────
  otpSendBtn?.addEventListener("click", async () => {
    const email = otpEmail?.value.trim();
    if (!email || !email.includes("@")) { otpEmail?.focus(); return; }
    otpSendBtn.disabled = true;
    try {
      await fetch(`${server.base}/api/v1/conversation/request-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widget_key: server.widgetKey, domain: ctx.domain, email }),
      }).catch(() => {});
      setMessage(ui.codeSent, "ok");
      if (otpStep2) otpStep2.hidden = false;
      otpCode?.focus();
    } finally {
      otpSendBtn.disabled = false;
    }
  });

  async function verifyOtpCode() {
    const email = otpEmail?.value.trim();
    const code = otpCode?.value.trim();
    if (!email || !code || code.length !== 6) { otpCode?.focus(); return; }
    if (otpVerifyBtn) otpVerifyBtn.disabled = true;
    try {
      const res = await fetch(`${server.base}/api/v1/conversation/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ widget_key: server.widgetKey, email, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setMessage(ui.invalidCode, "err");
        return;
      }
      saveSession({ email, conversations: data.conversations ?? [], verifiedAt: Date.now() });
      if (otpCode) otpCode.value = "";
      if (otpStep2) otpStep2.hidden = true;
      setMessage("", null);
      checkUnread().then(renderHistory);
      renderHistory();
    } catch {
      setMessage(ui.invalidCode, "err");
    } finally {
      if (otpVerifyBtn) otpVerifyBtn.disabled = false;
    }
  }
  otpVerifyBtn?.addEventListener("click", verifyOtpCode);
  otpCode?.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); verifyOtpCode(); }
  });

  sessionChange.addEventListener("click", () => {
    saveSession(null);
    renderHistory();
  });

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "/") { e.preventDefault(); toggle(); }
    if (e.key === "Escape" && root.dataset.open === "1") close();
  });

  renderSupport();
  renderAttachments();
  renderAnnotations();
  applySubmitGate();
  // One-shot unread check on load: badge on the FAB + history tab.
  checkUnread().then(renderHistory);
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

function elementSelector(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node.nodeType === 1 && node !== document.body && parts.length < 5) {
    let part = node.tagName.toLowerCase();
    if (node.id) {
      part += `#${cssEscape(node.id)}`;
      parts.unshift(part);
      break;
    }
    const classes = Array.from(node.classList)
      .filter((c) => c && !c.startsWith("rivesio-") && !c.startsWith("kf-"))
      .slice(0, 2);
    if (classes.length) part += `.${classes.map(cssEscape).join(".")}`;
    const parent = node.parentElement;
    if (parent) {
      const sameTag = Array.from(parent.children).filter((child) => child.tagName === node!.tagName);
      if (sameTag.length > 1) part += `:nth-of-type(${sameTag.indexOf(node) + 1})`;
    }
    parts.unshift(part);
    node = parent;
  }
  return parts.join(" > ") || el.tagName.toLowerCase();
}

function cssEscape(value: string): string {
  const css = (window as unknown as { CSS?: { escape?: (s: string) => string } }).CSS;
  if (css?.escape) return css.escape(value);
  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

function textSnippet(el: Element): string {
  return (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 140);
}

function selectElementAnnotation(
  widgetHost: HTMLElement,
  locale: WidgetLocale,
  pickIndex: number,
): Promise<ElementAnnotation | null> {
  return new Promise((resolve) => {
    const highlight = document.createElement("div");
    highlight.className = "rivesio-element-highlight";
    Object.assign(highlight.style, {
      position: "fixed",
      zIndex: "2147483645",
      pointerEvents: "none",
      border: "2px solid #3b82f6",
      background: "rgba(59,130,246,.14)",
      borderRadius: "8px",
      boxShadow: "0 0 0 9999px rgba(15,23,42,.18)",
      transition: "left .08s, top .08s, width .08s, height .08s",
      display: "none",
    });

    const badge = document.createElement("div");
    Object.assign(badge.style, {
      position: "fixed",
      zIndex: "2147483646",
      pointerEvents: "none",
      background: "#2563eb",
      color: "#fff",
      borderRadius: "999px",
      padding: "4px 9px",
      font: "600 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      boxShadow: "0 8px 18px rgba(37,99,235,.28)",
      display: "none",
    });
    badge.textContent = locale === "en" ? "Click an element" : "Öğeye tıkla";

    document.body.append(highlight, badge);
    widgetHost.style.visibility = "hidden";

    let current: Element | null = null;
    let editor: HTMLDivElement | null = null;
    let done = false;

    function finish(value: ElementAnnotation | null) {
      if (done) return;
      done = true;
      cleanup();
      resolve(value);
    }

    function cleanup() {
      widgetHost.style.visibility = "";
      highlight.remove();
      badge.remove();
      editor?.remove();
      window.removeEventListener("mousemove", onMove, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey, true);
    }

    function setTarget(target: Element | null) {
      current = target;
      if (!target) {
        highlight.style.display = "none";
        badge.style.display = "none";
        return;
      }
      const rect = target.getBoundingClientRect();
      highlight.style.display = "block";
      highlight.style.left = `${Math.max(0, rect.left)}px`;
      highlight.style.top = `${Math.max(0, rect.top)}px`;
      highlight.style.width = `${Math.max(0, rect.width)}px`;
      highlight.style.height = `${Math.max(0, rect.height)}px`;

      badge.style.display = "block";
      badge.style.left = `${Math.min(window.innerWidth - 132, Math.max(8, rect.left))}px`;
      badge.style.top = `${Math.max(8, rect.top - 32)}px`;
    }

    function onMove(e: MouseEvent) {
      if (editor) return;
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target || target === widgetHost || widgetHost.contains(target)) {
        setTarget(null);
        return;
      }
      setTarget(target);
    }

    function onClick(e: MouseEvent) {
      if (editor?.contains(e.target as Node)) return;
      e.preventDefault();
      e.stopPropagation();
      if (!current) return;
      showEditor(current);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        finish(null);
      }
    }

    function showEditor(target: Element) {
      const rect = target.getBoundingClientRect();
      editor?.remove();
      editor = document.createElement("div");
      const editorWidth = Math.min(320, window.innerWidth - 24);
      const editorHeight = 190;
      const spaceBelow = window.innerHeight - rect.bottom - 10;
      const spaceAbove = rect.top - 10;
      // Prefer below; fall back to above if not enough space
      let topPos: number;
      if (spaceBelow >= editorHeight || spaceBelow >= spaceAbove) {
        topPos = Math.min(window.innerHeight - editorHeight - 8, rect.bottom + 10);
      } else {
        topPos = Math.max(8, rect.top - editorHeight - 10);
      }
      const leftPos = Math.min(window.innerWidth - editorWidth - 8, Math.max(8, rect.left));
      Object.assign(editor.style, {
        position: "fixed",
        zIndex: "2147483647",
        width: `${editorWidth}px`,
        left: `${leftPos}px`,
        top: `${Math.max(8, topPos)}px`,
        background: "#ffffff",
        border: "1px solid rgba(15,23,42,.14)",
        borderRadius: "12px",
        boxShadow: "0 20px 50px rgba(15,23,42,.22)",
        padding: "12px",
        font: "13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        color: "#0f172a",
      });
      editor.innerHTML = `
        <div style="font-weight:700;margin-bottom:6px">${locale === "en" ? "Add note to element" : "Öğeye not ekle"}</div>
        <div style="font-size:11px;color:#64748b;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(elementSelector(target))}</div>
        <textarea style="width:100%;min-height:78px;resize:none;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font:13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;outline:none" placeholder="${locale === "en" ? "What should change here?" : "Burada ne değişmeli?"}"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
          <button type="button" data-cancel style="border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:7px 10px;font-weight:600;color:#475569;cursor:pointer">${locale === "en" ? "Cancel" : "Vazgeç"}</button>
          <button type="button" data-save style="border:0;background:#2563eb;border-radius:8px;padding:7px 12px;font-weight:700;color:#fff;cursor:pointer">${locale === "en" ? "Add" : "Ekle"}</button>
        </div>`;
      document.body.appendChild(editor);
      const input = editor.querySelector("textarea") as HTMLTextAreaElement;
      input.focus();
      editor.querySelector("[data-cancel]")!.addEventListener("click", () => finish(null));
      editor.querySelector("[data-save]")!.addEventListener("click", () => {
        const value = input.value.trim();
        if (!value) {
          input.focus();
          return;
        }
        const selector = elementSelector(target);
        const r = target.getBoundingClientRect();
        finish({
          id: localId(),
          kind: "element_annotation",
          index: pickIndex,
          label: locale === "en" ? "Element note" : "Öğe notu",
          value,
          selector,
          tagName: target.tagName.toLowerCase(),
          text: textSnippet(target),
          rect: {
            x: Math.round(r.left),
            y: Math.round(r.top),
            width: Math.round(r.width),
            height: Math.round(r.height),
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
          },
        });
      });
    }

    window.addEventListener("mousemove", onMove, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey, true);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
