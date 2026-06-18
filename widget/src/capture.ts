export interface Region { x: number; y: number; w: number; h: number; }

// ── Internal: grab one frame via getDisplayMedia ──────────────────────────────

interface ScreenFrame {
  bitmap: ImageBitmap;
  /** bitmap.width / window.innerWidth  (≈ devicePixelRatio on retina) */
  scaleX: number;
  /** bitmap.height / window.innerHeight */
  scaleY: number;
}

async function grabFrame(hideEl?: HTMLElement): Promise<ScreenFrame | null> {
  let stream: MediaStream;
  try {
    stream = await (navigator.mediaDevices as any).getDisplayMedia({
      video: { displaySurface: "browser", frameRate: 1 },
      audio: false,
      preferCurrentTab: true,   // Chrome 107+ auto-selects current tab
      selfBrowserSurface: "include",
    });
  } catch {
    return null; // user denied or not supported
  }

  const [track] = stream.getVideoTracks();

  // Hide widget so it doesn't appear in the capture
  if (hideEl) hideEl.style.visibility = "hidden";

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;

  await new Promise<void>((r) => {
    video.onloadedmetadata = () => r();
  });
  await video.play();

  // Wait two rAF cycles so the frame is actually rendered
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

  const { videoWidth: bw, videoHeight: bh } = video;
  const offscreen = document.createElement("canvas");
  offscreen.width = bw;
  offscreen.height = bh;
  offscreen.getContext("2d")!.drawImage(video, 0, 0, bw, bh);

  video.pause();
  video.srcObject = null;
  track.stop();

  if (hideEl) hideEl.style.visibility = "";

  const bitmap = await createImageBitmap(offscreen);
  return {
    bitmap,
    scaleX: bw / window.innerWidth,
    scaleY: bh / window.innerHeight,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function rrect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ── Public: full viewport capture ────────────────────────────────────────────

export async function captureViewport(hideEl?: HTMLElement): Promise<Blob | null> {
  const frame = await grabFrame(hideEl);
  if (!frame) return null;
  const { bitmap } = frame;

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  bitmap.close();

  return new Promise((r) => canvas.toBlob(r, "image/png"));
}

// ── Public: capture then show area selector ───────────────────────────────────
//
// Flow:
//  1. grabFrame()  → get pixel-perfect screenshot
//  2. show overlay → screenshot fills viewport, dimmed
//  3. user drags   → selection rectangle
//  4. mouseup      → crop from bitmap, return blob
//  5. Esc          → cancel (resolve null)

export async function selectAndCapture(hideEl?: HTMLElement): Promise<Blob | null> {
  const frame = await grabFrame(hideEl);
  if (!frame) return null;
  return runSelector(frame);
}

function runSelector({ bitmap, scaleX, scaleY }: ScreenFrame): Promise<Blob | null> {
  return new Promise((resolve) => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cv = document.createElement("canvas");
    cv.width  = W * dpr;
    cv.height = H * dpr;
    Object.assign(cv.style, {
      position: "fixed", top: "0", left: "0",
      width: "100vw", height: "100vh",
      zIndex: "2147483646", cursor: "crosshair",
      userSelect: "none",
    });
    document.body.appendChild(cv);

    const ctx = cv.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // Draw screenshot scaled to viewport
    function drawBase() {
      ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, W, H);
      ctx.fillStyle = "rgba(0,0,0,0.38)";
      ctx.fillRect(0, 0, W, H);
    }

    function drawInstruction() {
      const hint = "Sürükle: alan seç   •   Bırak: onayla   •   Esc: iptal";
      ctx.font = "13px -apple-system, system-ui, sans-serif";
      const tw = ctx.measureText(hint).width;
      const pw = tw + 24, ph = 36, px = (W - pw) / 2, py = H - ph - 20;
      ctx.fillStyle = "rgba(15,23,42,0.72)";
      rrect(ctx, px, py, pw, ph, 10); ctx.fill();
      ctx.fillStyle = "#f1f5f9";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(hint, W / 2, py + ph / 2);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }

    function drawSelection(x: number, y: number, w: number, h: number) {
      // Restore bright screenshot inside selection
      ctx.save();
      ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, W, H);
      ctx.restore();

      // Dashed border
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
      ctx.setLineDash([]);

      // Corner handles
      const hs = 7;
      ctx.fillStyle = "#6366f1";
      [[x, y],[x+w-hs, y],[x, y+h-hs],[x+w-hs, y+h-hs]].forEach(
        ([cx, cy]) => ctx.fillRect(cx, cy, hs, hs)
      );

      // Size badge
      ctx.font = "bold 12px -apple-system, system-ui, sans-serif";
      const label = `${Math.round(w)} × ${Math.round(h)}`;
      const lw = ctx.measureText(label).width + 14, lh = 22;
      const lx = Math.min(x, W - lw - 4);
      const ly = y > lh + 8 ? y - lh - 4 : y + h + 4;
      ctx.fillStyle = "#6366f1";
      rrect(ctx, lx, ly, lw, lh, 5); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.textBaseline = "middle";
      ctx.fillText(label, lx + 7, ly + lh / 2);
      ctx.textBaseline = "alphabetic";
    }

    let startX = 0, startY = 0, dragging = false;

    function redraw(ex?: number, ey?: number) {
      drawBase();
      drawInstruction();
      if (ex === undefined || ey === undefined) return;
      const x = Math.min(startX, ex), y = Math.min(startY, ey);
      const w = Math.abs(ex - startX), h = Math.abs(ey - startY);
      if (w > 1 && h > 1) drawSelection(x, y, w, h);
    }

    redraw();

    cv.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startX = e.clientX; startY = e.clientY;
      dragging = true;
    });

    cv.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      redraw(e.clientX, e.clientY);
    });

    cv.addEventListener("mouseup", (e) => {
      if (!dragging) return;
      dragging = false;
      const x = Math.min(startX, e.clientX), y = Math.min(startY, e.clientY);
      const w = Math.abs(e.clientX - startX), h = Math.abs(e.clientY - startY);
      cleanup();
      if (w < 10 || h < 10) { bitmap.close(); resolve(null); return; }
      cropAndResolve(x, y, w, h);
    });

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { cleanup(); bitmap.close(); resolve(null); }
    }
    window.addEventListener("keydown", onKey, true);

    function cleanup() {
      cv.remove();
      window.removeEventListener("keydown", onKey, true);
    }

    function cropAndResolve(x: number, y: number, w: number, h: number) {
      const sx = Math.round(x * scaleX), sy = Math.round(y * scaleY);
      const sw = Math.round(w * scaleX), sh = Math.round(h * scaleY);
      const out = document.createElement("canvas");
      out.width = sw; out.height = sh;
      out.getContext("2d")!.drawImage(bitmap, sx, sy, sw, sh, 0, 0, sw, sh);
      bitmap.close();
      out.toBlob((b) => resolve(b), "image/png");
    }
  });
}
