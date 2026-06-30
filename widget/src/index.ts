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
    categories: string[];
    text?: Record<WidgetLocale, WidgetText>;
    fields?: FormField[];
  };
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
    RevistoFeedback?: HostConfig;
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
  x: icon('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
};

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function localId(): string {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `ann_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

async function boot() {
  const server = window.__KF_CONFIG__;
  if (!server) return;
  const host: HostConfig = window.RevistoFeedback ?? {};

  const domain = host.domain || location.host;

  let registration: { enabled: boolean; project?: ServerConfig["project"] };
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
  mount(server, host, cfg, { domain });
}

function mount(
  server: ServerConfig,
  host: HostConfig,
  project: ServerConfig["project"],
  ctx: { domain: string }
) {
  const containerHost = document.createElement("div");
  containerHost.id = "revisto-widget";
  document.body.appendChild(containerHost);
  const shadow = containerHost.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = widgetCss;
  shadow.appendChild(style);

  const root = document.createElement("div");
  root.className = "kf-root";
  root.dataset.pos = project.position || "bottom-right";
  root.style.setProperty("--kf-accent", project.accentColor || "#6366f1");

  // Mirror host page theme into widget
  const pageTheme = document.documentElement.getAttribute("data-theme");
  if (pageTheme === "light") root.dataset.theme = "light";

  const locale = detectLocale();
  const txt: WidgetText = { ...DEFAULT_TEXT[locale], ...(project.text?.[locale]) };
  const fields = project.fields ?? [];

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

  root.innerHTML = `
    <button class="kf-fab" type="button" aria-label="${esc(txt.fabLabel)}">
      ${ICONS.chat}<span>${esc(txt.fabLabel)}</span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="${esc(txt.title)}">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${ICONS.chat}</div>
          <span class="kf-title">${esc(txt.title)}</span>
        </div>
        <div class="kf-head-actions">
          <button class="kf-icon-btn kf-history-toggle" type="button" aria-label="Geçmiş">${ICONS.history}</button>
          <button class="kf-icon-btn kf-close-btn" type="button" aria-label="Kapat">${ICONS.close}</button>
        </div>
      </div>

      <div class="kf-msg" hidden></div>

      <!-- History view -->
      <div class="kf-view-history" hidden>
        <p class="kf-history-empty" hidden>Henüz geri bildirim göndermediniz.</p>
        <ul class="kf-history-list"></ul>
      </div>

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

        ${customFieldsHtml}

        <div class="kf-capture-row">
          <button class="kf-chip kf-capture-full" type="button">
            ${ICONS.camera} Tüm ekran
          </button>
          <button class="kf-chip kf-capture-area" type="button">
            ${ICONS.crop} Alan seç
          </button>
          <button class="kf-chip kf-element-select" type="button">
            ${ICONS.target} Öğe seç
          </button>
          <button class="kf-chip kf-chip-upload kf-upload" type="button" aria-label="Görsel yükle">
            ${ICONS.upload}
          </button>
        </div>

        <div class="kf-attach-row">
          <span class="kf-counter">0 / ${MAX_ATTACHMENTS}</span>
        </div>

        <div class="kf-thumbs"></div>
        <div class="kf-annotations" hidden></div>
        <input class="kf-file" type="file" accept="image/*" multiple hidden />

        <div class="kf-hint">İpucu: <kbd>⌘ / Ctrl + /</kbd> ile her yerden aç</div>
      </div>

      </div> <!-- /kf-view-form -->

      <div class="kf-foot">
        <button class="kf-btn kf-btn-ghost kf-cancel" type="button">${esc(locale === "en" ? "Cancel" : "Vazgeç")}</button>
        <button class="kf-btn kf-btn-primary kf-submit" type="button">${esc(txt.submitLabel)}</button>
      </div>

    </div>
  `;
  shadow.appendChild(root);

  const $ = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const fab            = $<HTMLButtonElement>(".kf-fab");
  const panel          = $<HTMLDivElement>(".kf-panel");
  const closeBtn       = $<HTMLButtonElement>(".kf-close-btn");
  const historyToggle  = $<HTMLButtonElement>(".kf-history-toggle");
  const cancelBtn      = $<HTMLButtonElement>(".kf-cancel");
  const submitBtn      = $<HTMLButtonElement>(".kf-submit");
  const capFullBtn     = $<HTMLButtonElement>(".kf-capture-full");
  const capAreaBtn     = $<HTMLButtonElement>(".kf-capture-area");
  const elementBtn     = $<HTMLButtonElement>(".kf-element-select");
  const uploadBtn      = $<HTMLButtonElement>(".kf-upload");
  const fileInput      = $<HTMLInputElement>(".kf-file");
  const textarea       = $<HTMLTextAreaElement>(".kf-textarea");
  const select         = $<HTMLSelectElement>(".kf-select");
  const thumbs         = $<HTMLDivElement>(".kf-thumbs");
  const counter        = $<HTMLSpanElement>(".kf-counter");
  const annotationsEl  = $<HTMLDivElement>(".kf-annotations");
  const msg            = $<HTMLDivElement>(".kf-msg");
  const viewForm       = $<HTMLDivElement>(".kf-view-form");
  const viewHistory    = $<HTMLDivElement>(".kf-view-history");
  const historyList    = $<HTMLUListElement>(".kf-history-list");
  const historyEmpty   = $<HTMLParagraphElement>(".kf-history-empty");
  const footEl         = $<HTMLDivElement>(".kf-foot");

  const attachments: Attachment[] = [];
  const annotations: ElementAnnotation[] = [];

  // ── History (localStorage) ────────────────────────────────────────

  const HISTORY_KEY = `kf_history_${server.widgetKey}`;

  interface HistoryEntry {
    id: string;
    category: string;
    page: string;
    date: number;
  }

  function loadHistory(): HistoryEntry[] {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); } catch { return []; }
  }

  function saveToHistory(entry: HistoryEntry) {
    const list = loadHistory();
    list.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
  }

  function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  function renderHistory() {
    const entries = loadHistory();
    historyList.innerHTML = "";
    historyEmpty.hidden = entries.length > 0;

    entries.forEach((e) => {
      const li = document.createElement("li");
      li.className = "kf-history-item";
      li.innerHTML = `
        <div class="kf-hi-left">
          <span class="kf-hi-cat">${esc(e.category)}</span>
          <span class="kf-hi-page">${esc(e.page)}</span>
        </div>
        <div class="kf-hi-right">
          <span class="kf-hi-id" title="Kopyala">#${esc(e.id.slice(0, 8))}</span>
          <span class="kf-hi-date">${esc(formatDate(e.date))}</span>
        </div>`;
      li.querySelector(".kf-hi-id")!.addEventListener("click", () => copyId(e.id));
      historyList.appendChild(li);
    });
  }

  // ── View toggle ───────────────────────────────────────────────────

  let inHistory = false;

  function showFormView() {
    inHistory = false;
    viewForm.hidden = false;
    viewHistory.hidden = true;
    footEl.hidden = false;
    historyToggle.title = "Geçmiş";
    historyToggle.innerHTML = ICONS.history;
    setMessage("", null);
  }

  function showHistoryView() {
    inHistory = true;
    viewForm.hidden = true;
    viewHistory.hidden = false;
    footEl.hidden = true;
    historyToggle.title = "Forma dön";
    historyToggle.innerHTML = ICONS.close;
    renderHistory();
    setMessage("", null);
  }

  historyToggle.addEventListener("click", () => inHistory ? showFormView() : showHistoryView());

  // ── Copy helper ────────────────────────────────────────────────────

  function copyId(id: string, btn?: Element) {
    navigator.clipboard?.writeText(id).catch(() => {});
    if (btn) {
      btn.classList.add("copied");
      btn.innerHTML = ICONS.check;
      setTimeout(() => { btn.classList.remove("copied"); btn.innerHTML = ICONS.copy; }, 1800);
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

  function open()   { root.dataset.open = "1"; if (!inHistory) setTimeout(() => textarea.focus(), 60); }
  function close()  { root.dataset.open = "0"; showFormView(); }
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

  // Full-viewport screenshot via getDisplayMedia (no html2canvas distortion)
  capFullBtn.addEventListener("click", async () => {
    capFullBtn.disabled = true;
    capFullBtn.innerHTML = `${ICONS.camera} Bekleniyor…`;
    try {
      const blob = await captureViewport(containerHost);
      if (blob) addAttachment(blob, "screenshot");
      else setMessage("Ekran paylaşımı iptal edildi.", "err");
    } catch {
      setMessage("Ekran yakalanamadı.", "err");
    } finally {
      capFullBtn.innerHTML = `${ICONS.camera} Tüm ekran`;
      renderAttachments();
    }
  });

  // Area selection: capture first, then draw selection on the screenshot overlay
  capAreaBtn.addEventListener("click", async () => {
    capAreaBtn.disabled = true;
    capAreaBtn.innerHTML = `${ICONS.crop} Bekleniyor…`;
    try {
      const blob = await selectAndCapture(containerHost);
      if (blob) addAttachment(blob, "screenshot");
      else setMessage("Alan seçimi iptal edildi.", "err");
    } catch {
      setMessage("Ekran yakalanamadı.", "err");
    } finally {
      capAreaBtn.innerHTML = `${ICONS.crop} Alan seç`;
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
    elementBtn.innerHTML = `${ICONS.target} Bekleniyor…`;
    const frame = await captureElementFrame(containerHost);
    if (!frame) {
      elementBtn.innerHTML = `${ICONS.target} Öğe seç`;
      elementBtn.disabled = false;
      open();
      setMessage(locale === "en" ? "Screen capture was cancelled." : "Ekran paylaşımı iptal edildi.", "err");
      renderAttachments();
      return;
    }
    try {
      const ann = await selectElementAnnotation(containerHost, locale);
      if (ann) {
        const blob = await renderHighlightedElement(frame, {
          x: ann.rect.x,
          y: ann.rect.y,
          w: ann.rect.width,
          h: ann.rect.height,
        }, annotations.length + 1);
        annotations.push(ann);
        if (blob) addAttachment(blob, "screenshot", ann.id);
        else setMessage(locale === "en" ? "Element screenshot couldn't be captured." : "Öğe ekran görüntüsü alınamadı.", "err");
        renderAnnotations();
      }
    } finally {
      releaseFrame(frame);
      elementBtn.innerHTML = `${ICONS.target} Öğe seç`;
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

  async function submit() {
    const message = textarea.value.trim();
    if (!message) {
      setMessage(locale === "en" ? "Please write a description." : "Lütfen bir açıklama yaz.", "err");
      textarea.focus();
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
          page_url: location.href,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          wp_user: host.user,
          custom_fields: [...custom.values, ...annotations],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage(txt.errorMessage, "err");
        return;
      }

      let failedAttachments = 0;
      for (const att of attachments) {
        const fd = new FormData();
        fd.append("widget_key", server.widgetKey);
        fd.append("domain", ctx.domain);
        fd.append("kind", att.kind);
        const ext = att.blob.type === "image/png" ? "png" : "jpg";
        fd.append("file", att.blob, `${att.kind}.${ext}`);
        const ok = await fetch(`${server.base}/api/v1/feedback/${data.feedback_id}/attachment`, {
          method: "POST",
          body: fd,
        }).then((r) => r.ok).catch(() => false);
        if (!ok) failedAttachments++;
      }

      const fid: string = data.feedback_id;
      saveToHistory({ id: fid, category: select.value, page: location.pathname, date: Date.now() });

      // Show success with copyable reference ID, plus a warning if any attachment failed to upload
      const warningHtml = failedAttachments > 0
        ? `<div class="kf-msg kf-warn">${ICONS.alert} ${esc(
            locale === "en"
              ? `${failedAttachments} attachment${failedAttachments > 1 ? "s" : ""} could not be uploaded.`
              : `${failedAttachments} ek yüklenemedi.`
          )}</div>`
        : "";
      msg.hidden = false;
      msg.className = "kf-msg kf-ok";
      msg.innerHTML = `
        ${ICONS.check} ${esc(txt.successMessage)}
        <div class="kf-ref-box">
          <span class="kf-ref-label">${esc(locale === "en" ? "Reference" : "Referans no")}</span>
          <span class="kf-ref-id" title="${esc(fid)}">#${esc(fid.slice(0, 8))}</span>
          <button class="kf-ref-copy" type="button" aria-label="Kopyala">${ICONS.copy}</button>
        </div>
        ${warningHtml}`;
      msg.querySelector(".kf-ref-copy")!.addEventListener("click", (e) =>
        copyId(fid, e.currentTarget as Element)
      );

      textarea.value = "";
      root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(".kf-cf").forEach((el) => {
        if (el.dataset.cfType === "checkbox") (el as HTMLInputElement).checked = false;
        else el.value = "";
      });
      attachments.splice(0).forEach((a) => URL.revokeObjectURL(a.url));
      annotations.splice(0);
      renderAttachments();
      renderAnnotations();
      setTimeout(close, failedAttachments > 0 ? 7000 : 4000);
    } catch {
      setMessage(locale === "en" ? "Connection error. Please try again." : "Bağlantı hatası. Lütfen tekrar dene.", "err");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = txt.submitLabel;
    }
  }

  submitBtn.addEventListener("click", submit);

  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "/") { e.preventDefault(); toggle(); }
    if (e.key === "Escape" && root.dataset.open === "1") close();
  });

  renderAttachments();
  renderAnnotations();
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
      .filter((c) => c && !c.startsWith("revisto-") && !c.startsWith("kf-"))
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
  return (el.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

function selectElementAnnotation(widgetHost: HTMLElement, locale: WidgetLocale): Promise<ElementAnnotation | null> {
  return new Promise((resolve) => {
    const highlight = document.createElement("div");
    highlight.className = "revisto-element-highlight";
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
      Object.assign(editor.style, {
        position: "fixed",
        zIndex: "2147483647",
        width: "min(320px, calc(100vw - 24px))",
        left: `${Math.min(window.innerWidth - 332, Math.max(12, rect.left))}px`,
        top: `${Math.min(window.innerHeight - 190, Math.max(12, rect.bottom + 10))}px`,
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
