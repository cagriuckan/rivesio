import html2canvas from "html2canvas";
import { widgetCss } from "./styles";

// Injected by the server when serving /api/widget/<key>.js
interface ServerConfig {
  base: string;
  widgetKey: string;
  project: {
    name: string;
    accentColor: string;
    position: "bottom-right" | "bottom-left";
    categories: string[];
  };
}

// Injected by the host site (WordPress theme localizes this).
interface HostConfig {
  license?: string;
  domain?: string;
  theme?: string;
  themeVersion?: string;
  user?: string;
}

declare global {
  interface Window {
    __KF_CONFIG__?: ServerConfig;
    KanewsFeedback?: HostConfig;
  }
}

const MAX_ATTACHMENTS = 4;

interface Attachment {
  blob: Blob;
  url: string;
  kind: "screenshot" | "upload";
}

function svgIcon(path: string): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

async function boot() {
  const server = window.__KF_CONFIG__;
  if (!server) return;
  const host: HostConfig = window.KanewsFeedback ?? {};

  const domain = host.domain || location.host;
  const license = host.license || "";
  const theme = host.theme || "";

  // Ask the server whether this site may show the widget.
  let registration: { enabled: boolean; project?: ServerConfig["project"] };
  try {
    const res = await fetch(`${server.base}/api/v1/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        widget_key: server.widgetKey,
        domain,
        license_key: license,
        theme,
        meta: {
          themeVersion: host.themeVersion,
          user: host.user,
          href: location.href,
        },
      }),
    });
    registration = await res.json();
  } catch {
    return; // network/server down: stay invisible.
  }

  if (!registration.enabled) return;

  const cfg = { ...server.project, ...(registration.project ?? {}) };
  mount(server, host, cfg, { domain, license, theme });
}

function mount(
  server: ServerConfig,
  host: HostConfig,
  project: ServerConfig["project"],
  ctx: { domain: string; license: string; theme: string }
) {
  const containerHost = document.createElement("div");
  containerHost.id = "kanews-feedback-widget";
  document.body.appendChild(containerHost);
  const shadow = containerHost.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = widgetCss;
  shadow.appendChild(style);

  const root = document.createElement("div");
  root.className = "kf-root";
  root.dataset.pos = project.position || "bottom-right";
  root.style.setProperty("--kf-accent", project.accentColor || "#4f46e5");

  const categoryOptions = (project.categories || ["Öneri"])
    .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join("");

  root.innerHTML = `
    <button class="kf-fab" type="button" aria-label="Geri bildirim">
      ${svgIcon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>')}
      <span>Geri bildirim</span>
    </button>
    <div class="kf-panel" role="dialog" aria-label="Geri bildirim">
      <div class="kf-head">
        <span class="kf-title">Geri bildirim</span>
        <button class="kf-close" type="button" aria-label="Kapat">&times;</button>
      </div>
      <div class="kf-msg" hidden></div>
      <div class="kf-body">
        <div class="kf-field">
          <select class="kf-select" aria-label="Kategori">${categoryOptions}</select>
        </div>
        <div class="kf-field">
          <textarea class="kf-textarea" placeholder="Ne eklensin ya da nerede bir sorun var? Olabildiğince açık yaz…"></textarea>
        </div>
        <div class="kf-actions">
          <button class="kf-chip kf-capture" type="button">
            ${svgIcon('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>')}
            Ekranı yakala
          </button>
          <button class="kf-chip kf-upload" type="button">
            ${svgIcon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>')}
            Görsel yükle
          </button>
          <span class="kf-counter">0/${MAX_ATTACHMENTS}</span>
        </div>
        <div class="kf-thumbs"></div>
        <input class="kf-file" type="file" accept="image/*" multiple hidden />
        <div class="kf-hint">İpucu: her yerden <kbd>⌘/Ctrl + /</kbd> ile açabilirsin.</div>
      </div>
      <div class="kf-foot">
        <button class="kf-btn kf-btn-ghost kf-cancel" type="button">Vazgeç</button>
        <button class="kf-btn kf-btn-primary kf-submit" type="button">Gönder</button>
      </div>
    </div>
  `;
  shadow.appendChild(root);

  // --- Element refs ---
  const $ = <T extends Element>(sel: string) => root.querySelector(sel) as T;
  const fab = $<HTMLButtonElement>(".kf-fab");
  const panel = $<HTMLDivElement>(".kf-panel");
  const closeBtn = $<HTMLButtonElement>(".kf-close");
  const cancelBtn = $<HTMLButtonElement>(".kf-cancel");
  const submitBtn = $<HTMLButtonElement>(".kf-submit");
  const captureBtn = $<HTMLButtonElement>(".kf-capture");
  const uploadBtn = $<HTMLButtonElement>(".kf-upload");
  const fileInput = $<HTMLInputElement>(".kf-file");
  const textarea = $<HTMLTextAreaElement>(".kf-textarea");
  const select = $<HTMLSelectElement>(".kf-select");
  const thumbs = $<HTMLDivElement>(".kf-thumbs");
  const counter = $<HTMLSpanElement>(".kf-counter");
  const msg = $<HTMLDivElement>(".kf-msg");

  const attachments: Attachment[] = [];

  function setMessage(text: string, kind: "ok" | "err" | null) {
    if (!kind) {
      msg.hidden = true;
      msg.textContent = "";
      return;
    }
    msg.hidden = false;
    msg.textContent = text;
    msg.className = `kf-msg kf-${kind}`;
  }

  function renderAttachments() {
    counter.textContent = `${attachments.length}/${MAX_ATTACHMENTS}`;
    const atMax = attachments.length >= MAX_ATTACHMENTS;
    captureBtn.disabled = atMax;
    uploadBtn.disabled = atMax;
    thumbs.innerHTML = "";
    attachments.forEach((att, i) => {
      const wrap = document.createElement("div");
      wrap.className = "kf-thumb";
      wrap.innerHTML = `<img src="${att.url}" alt="ek"/><button type="button" aria-label="Kaldır">&times;</button>`;
      wrap.querySelector("button")!.addEventListener("click", () => {
        URL.revokeObjectURL(att.url);
        attachments.splice(i, 1);
        renderAttachments();
      });
      thumbs.appendChild(wrap);
    });
  }

  function addAttachment(blob: Blob, kind: "screenshot" | "upload") {
    if (attachments.length >= MAX_ATTACHMENTS) return;
    attachments.push({ blob, kind, url: URL.createObjectURL(blob) });
    renderAttachments();
  }

  function open() {
    root.dataset.open = "1";
    setTimeout(() => textarea.focus(), 50);
  }
  function close() {
    root.dataset.open = "0";
  }
  function toggle() {
    root.dataset.open === "1" ? close() : open();
  }

  fab.addEventListener("click", toggle);
  closeBtn.addEventListener("click", close);
  cancelBtn.addEventListener("click", close);

  uploadBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files ?? []);
    for (const f of files) {
      if (f.type.startsWith("image/")) addAttachment(f, "upload");
    }
    fileInput.value = "";
  });

  captureBtn.addEventListener("click", async () => {
    const prevOpen = root.dataset.open;
    captureBtn.disabled = true;
    captureBtn.textContent = "Yakalanıyor…";
    // Hide our own UI so it does not appear in the screenshot.
    containerHost.style.visibility = "hidden";
    try {
      const canvas = await html2canvas(document.body, {
        logging: false,
        useCORS: true,
        scale: Math.min(window.devicePixelRatio || 1, 2),
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
        x: window.scrollX,
        y: window.scrollY,
        width: window.innerWidth,
        height: window.innerHeight,
      });
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
      if (blob) addAttachment(blob, "screenshot");
    } catch {
      setMessage("Ekran yakalanamadı.", "err");
    } finally {
      containerHost.style.visibility = "";
      captureBtn.innerHTML = `${svgIcon('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>')} Ekranı yakala`;
      root.dataset.open = prevOpen;
      renderAttachments();
    }
  });

  async function submit() {
    const message = textarea.value.trim();
    if (!message) {
      setMessage("Lütfen bir açıklama yaz.", "err");
      textarea.focus();
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = "Gönderiliyor…";
    setMessage("", null);

    try {
      const res = await fetch(`${server.base}/api/v1/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          widget_key: server.widgetKey,
          domain: ctx.domain,
          license_key: ctx.license,
          theme: ctx.theme,
          category: select.value,
          message,
          page_url: location.href,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          wp_user: host.user,
          meta: { themeVersion: host.themeVersion },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setMessage("Gönderilemedi. Lütfen tekrar dene.", "err");
        return;
      }

      // Upload attachments sequentially.
      for (const att of attachments) {
        const fd = new FormData();
        fd.append("widget_key", server.widgetKey);
        fd.append("domain", ctx.domain);
        fd.append("license_key", ctx.license);
        if (ctx.theme) fd.append("theme", ctx.theme);
        fd.append("kind", att.kind);
        const ext = att.blob.type === "image/png" ? "png" : "jpg";
        fd.append("file", att.blob, `${att.kind}.${ext}`);
        await fetch(`${server.base}/api/v1/feedback/${data.feedback_id}/attachment`, {
          method: "POST",
          body: fd,
        }).catch(() => {});
      }

      setMessage("Teşekkürler! Geri bildirimin alındı.", "ok");
      textarea.value = "";
      attachments.splice(0).forEach((a) => URL.revokeObjectURL(a.url));
      renderAttachments();
      setTimeout(close, 1400);
    } catch {
      setMessage("Bağlantı hatası. Lütfen tekrar dene.", "err");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Gönder";
    }
  }

  submitBtn.addEventListener("click", submit);

  // Global shortcut: Cmd/Ctrl + /
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "/") {
      e.preventDefault();
      toggle();
    }
    if (e.key === "Escape" && root.dataset.open === "1") close();
  });

  renderAttachments();
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
