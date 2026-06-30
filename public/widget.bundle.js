"use strict";(()=>{var fe=`
:host { all: initial; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* \u2500\u2500 Tokens \u2500\u2500 */
.kf-root {
  /* Dark (default) */
  --bg:          #09090b;
  --surface:     #111113;
  --elevated:    #18181b;
  --overlay:     #1e1e21;
  --border:      rgba(255,255,255,.09);
  --border-sub:  rgba(255,255,255,.055);
  --txt:         #e4e4e7;
  --txt-dim:     #a1a1aa;
  --txt-muted:   #71717a;
  --txt-faint:   #52525b;
  --ok:          #10b981;
  --ok-bg:       rgba(16,185,129,.12);
  --ok-txt:      #6ee7b7;
  --err:         #ef4444;
  --err-bg:      rgba(239,68,68,.12);
  --err-txt:     #fca5a5;
  --ring:        rgba(99,102,241,.4);
  --shadow-fab:  0 4px 6px rgba(0,0,0,.35), 0 12px 28px rgba(0,0,0,.4);
  --shadow-panel: 0 0 0 1px rgba(255,255,255,.06), 0 8px 24px rgba(0,0,0,.55), 0 32px 64px rgba(0,0,0,.45);
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --font: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
  font-family: var(--font);
  font-size: 13px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  position: fixed;
  z-index: 2147483000;
  bottom: 20px;
}

/* Light theme */
.kf-root[data-theme="light"] {
  --bg:          #ffffff;
  --surface:     #fafafa;
  --elevated:    #f4f4f5;
  --overlay:     #ececed;
  --border:      rgba(0,0,0,.1);
  --border-sub:  rgba(0,0,0,.06);
  --txt:         #18181b;
  --txt-dim:     #52525b;
  --txt-muted:   #71717a;
  --txt-faint:   #a1a1aa;
  --ok-txt:      #059669;
  --err-txt:     #dc2626;
  --ring:        rgba(79,70,229,.35);
  --shadow-fab:  0 4px 6px rgba(0,0,0,.12), 0 12px 28px rgba(0,0,0,.14);
  --shadow-panel: 0 0 0 1px rgba(0,0,0,.07), 0 8px 24px rgba(0,0,0,.1), 0 32px 64px rgba(0,0,0,.08);
}

.kf-root[data-pos="bottom-right"] { right: 20px; }
.kf-root[data-pos="bottom-left"]  { left: 20px; }

/* \u2500\u2500 FAB \u2500\u2500 */
.kf-fab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: none;
  cursor: pointer;
  background: var(--kf-accent, #6366f1);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  padding: 10px 18px;
  border-radius: 100px;
  box-shadow: var(--shadow-fab);
  transition: transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s ease;
  outline: none;
  font-family: var(--font);
  -webkit-font-smoothing: antialiased;
}
.kf-fab:hover { transform: translateY(-2px) scale(1.02); }
.kf-fab:active { transform: scale(.97); }
.kf-fab:focus-visible { box-shadow: 0 0 0 3px var(--ring); }
.kf-fab svg { width: 15px; height: 15px; flex-shrink: 0; }

/* \u2500\u2500 Panel \u2500\u2500 */
.kf-panel {
  position: absolute;
  bottom: calc(100% + 12px);
  width: 384px;
  max-width: calc(100vw - 24px);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-panel);
  overflow: hidden;
  opacity: 0;
  transform: translateY(12px) scale(.96);
  pointer-events: none;
  transition: opacity .22s cubic-bezier(.16,1,.3,1), transform .22s cubic-bezier(.16,1,.3,1);
  will-change: transform, opacity;
}
.kf-root[data-pos="bottom-right"] .kf-panel { right: 0; }
.kf-root[data-pos="bottom-left"]  .kf-panel { left: 0; }
.kf-root[data-open="1"] .kf-panel {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

/* \u2500\u2500 Header \u2500\u2500 */
.kf-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 14px 16px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.kf-title-wrap { display: flex; align-items: center; gap: 10px; }
.kf-title-icon {
  width: 28px; height: 28px;
  border-radius: 8px;
  flex-shrink: 0;
  background: var(--kf-accent, #6366f1);
  display: flex; align-items: center; justify-content: center;
  color: #fff;
}
.kf-title-icon svg { width: 13px; height: 13px; }
.kf-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--txt);
  letter-spacing: -0.01em;
}
.kf-head-actions { display: flex; gap: 2px; align-items: center; }

/* \u2500\u2500 Icon buttons \u2500\u2500 */
.kf-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px; height: 30px;
  border: none;
  background: transparent;
  color: var(--txt-faint);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background .14s, color .14s;
  font-family: var(--font);
}
.kf-icon-btn:hover { background: var(--elevated); color: var(--txt-dim); }
.kf-icon-btn:focus-visible { outline: 2px solid var(--ring); outline-offset: 1px; }
.kf-icon-btn svg { width: 15px; height: 15px; flex-shrink: 0; }

/* \u2500\u2500 Message (ok/err) \u2500\u2500 */
.kf-msg {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 12px 16px 0;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  font-size: 12.5px;
  line-height: 1.5;
}
.kf-msg[hidden] { display: none; }
.kf-msg svg { width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px; }
.kf-ok  { background: var(--ok-bg);  color: var(--ok-txt); }
.kf-err { background: var(--err-bg); color: var(--err-txt); }

/* \u2500\u2500 Body \u2500\u2500 */
.kf-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  overflow-y: auto;
  max-height: 68dvh;
}

/* \u2500\u2500 Field label \u2500\u2500 */
.kf-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--txt-muted);
  margin-bottom: 6px;
}

/* \u2500\u2500 Select \u2500\u2500 */
.kf-select {
  width: 100%;
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px 32px 8px 12px;
  font-size: 13px;
  color: var(--txt);
  font-family: var(--font);
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  outline: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
  transition: border-color .14s, box-shadow .14s;
}
.kf-select:focus {
  border-color: var(--kf-accent, #6366f1);
  box-shadow: 0 0 0 3px var(--ring);
}
.kf-select option { background: var(--surface); color: var(--txt); }

/* \u2500\u2500 Textarea \u2500\u2500 */
.kf-textarea {
  width: 100%;
  min-height: 96px;
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  font-size: 13px;
  color: var(--txt);
  font-family: var(--font);
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: border-color .14s, box-shadow .14s;
}
.kf-textarea::placeholder { color: var(--txt-faint); }
.kf-textarea:focus {
  border-color: var(--kf-accent, #6366f1);
  box-shadow: 0 0 0 3px var(--ring);
}

/* \u2500\u2500 Custom text/email input \u2500\u2500 */
.kf-input {
  width: 100%;
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 8px 12px;
  font-size: 13px;
  color: var(--txt);
  font-family: var(--font);
  outline: none;
  transition: border-color .14s, box-shadow .14s;
}
.kf-input::placeholder { color: var(--txt-faint); }
.kf-input:focus {
  border-color: var(--kf-accent, #6366f1);
  box-shadow: 0 0 0 3px var(--ring);
}

/* \u2500\u2500 Custom checkbox field \u2500\u2500 */
.kf-cf-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--txt);
  font-family: var(--font);
  cursor: pointer;
}
.kf-cf-check input { width: 16px; height: 16px; accent-color: var(--kf-accent, #6366f1); cursor: pointer; }

/* \u2500\u2500 Capture row \u2500\u2500 */
.kf-capture-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.kf-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 11px;
  background: var(--elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  color: var(--txt-dim);
  cursor: pointer;
  transition: background .14s, border-color .14s, color .14s, transform .1s;
  font-family: var(--font);
  outline: none;
  white-space: nowrap;
}
.kf-chip:hover:not(:disabled) {
  background: var(--overlay);
  color: var(--txt);
  border-color: rgba(255,255,255,.14);
}
.kf-root[data-theme="light"] .kf-chip:hover:not(:disabled) {
  border-color: rgba(0,0,0,.14);
}
.kf-chip:active:not(:disabled) { transform: scale(.97); }
.kf-chip:focus-visible { box-shadow: 0 0 0 2px var(--ring); }
.kf-chip:disabled { opacity: .4; cursor: not-allowed; }
.kf-chip svg { width: 13px; height: 13px; flex-shrink: 0; }

.kf-chip-upload { padding: 6px 10px; margin-left: auto; }

/* \u2500\u2500 Attachments \u2500\u2500 */
.kf-attach-row { display: flex; align-items: center; gap: 6px; }
.kf-counter {
  font-size: 11px;
  color: var(--txt-faint);
  font-variant-numeric: tabular-nums;
}

.kf-thumbs { display: flex; flex-wrap: wrap; gap: 8px; }

.kf-thumb {
  position: relative;
  width: 72px; height: 56px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border);
  flex-shrink: 0;
}
.kf-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.kf-thumb-del {
  position: absolute;
  top: 3px; right: 3px;
  width: 18px; height: 18px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,.65);
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-family: var(--font);
  opacity: 0;
  transition: opacity .14s;
}
.kf-thumb:hover .kf-thumb-del { opacity: 1; }
.kf-thumb-del svg { width: 9px; height: 9px; }

/* \u2500\u2500 Element annotations \u2500\u2500 */
.kf-annotations {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.kf-annotations[hidden] { display: none; }
.kf-ann-item {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  border: 1px solid var(--border);
  background: var(--elevated);
  border-radius: var(--radius-md);
  padding: 9px;
}
.kf-ann-pin {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--kf-accent, #6366f1);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.kf-ann-main { min-width: 0; flex: 1; }
.kf-ann-selector {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
  font-weight: 600;
  color: var(--txt-muted);
}
.kf-ann-note {
  margin-top: 2px;
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--txt);
  word-break: break-word;
}
.kf-ann-del {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--txt-faint);
  cursor: pointer;
  transition: background .14s, color .14s;
}
.kf-ann-del:hover { background: var(--overlay); color: var(--txt-dim); }
.kf-ann-del svg { width: 12px; height: 12px; }

/* \u2500\u2500 Hint \u2500\u2500 */
.kf-hint {
  font-size: 11px;
  color: var(--txt-faint);
  display: flex;
  align-items: center;
  gap: 4px;
}
.kf-hint kbd {
  display: inline-flex;
  align-items: center;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 10px;
  font-family: var(--font);
  background: var(--elevated);
  border: 1px solid var(--border);
  color: var(--txt-muted);
}

/* \u2500\u2500 Footer \u2500\u2500 */
.kf-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border);
  background: var(--surface);
}

.kf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  border: none;
  transition: background .14s, opacity .14s, transform .1s, box-shadow .14s, filter .14s;
  font-family: var(--font);
  outline: none;
  -webkit-font-smoothing: antialiased;
}
.kf-btn:active { transform: scale(.97); }
.kf-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.kf-btn:focus-visible { box-shadow: 0 0 0 3px var(--ring); }

.kf-btn-primary {
  background: var(--kf-accent, #6366f1);
  color: #fff;
}
.kf-btn-primary:hover:not(:disabled) { filter: brightness(1.1); }

.kf-btn-ghost {
  background: transparent;
  color: var(--txt-muted);
  border: 1px solid var(--border);
}
.kf-btn-ghost:hover { background: var(--elevated); color: var(--txt-dim); }

/* \u2500\u2500 History view \u2500\u2500 */
.kf-view-history { padding: 8px 0; }

.kf-history-empty {
  padding: 40px 16px;
  text-align: center;
  font-size: 12.5px;
  color: var(--txt-faint);
}

.kf-history-list { list-style: none; }

.kf-history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-sub);
  transition: background .12s;
}
.kf-history-item:last-child { border-bottom: none; }
.kf-history-item:hover { background: var(--elevated); }

.kf-hi-left { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.kf-hi-cat {
  font-size: 12.5px; font-weight: 600; color: var(--txt);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.kf-hi-page {
  font-size: 11px; color: var(--txt-faint);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;
}
.kf-hi-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
.kf-hi-id {
  font-size: 11px; font-weight: 600; color: var(--txt-muted);
  font-family: var(--font); cursor: pointer;
  padding: 2px 6px; border-radius: 4px;
  background: var(--elevated); border: 1px solid var(--border-sub);
  transition: color .12s, background .12s; letter-spacing: 0.01em;
}
.kf-hi-id:hover, .kf-hi-id.copied { color: var(--ok-txt); background: var(--ok-bg); }
.kf-hi-date { font-size: 10.5px; color: var(--txt-faint); }

/* \u2500\u2500 Success ref box \u2500\u2500 */
.kf-ref-box {
  display: flex; align-items: center; gap: 8px;
  margin-top: 8px; padding: 8px 12px;
  background: var(--elevated); border-radius: var(--radius-sm);
  border: 1px solid var(--border-sub);
}
.kf-ref-label { font-size: 11px; color: var(--txt-faint); }
.kf-ref-id {
  flex: 1; font-size: 11px; font-weight: 600; color: var(--txt-dim);
  font-family: var(--font); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.kf-ref-copy {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border: none; background: transparent;
  color: var(--txt-faint); border-radius: var(--radius-sm); cursor: pointer;
  transition: color .12s, background .12s; font-family: var(--font);
}
.kf-ref-copy:hover { color: var(--txt-dim); background: var(--overlay); }
.kf-ref-copy.copied { color: var(--ok-txt); }
.kf-ref-copy svg { width: 13px; height: 13px; }

/* \u2500\u2500 Scrollbar \u2500\u2500 */
.kf-body::-webkit-scrollbar { width: 4px; }
.kf-body::-webkit-scrollbar-track { background: transparent; }
.kf-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

/* \u2500\u2500 Mobile \u2500\u2500 */
@media (max-width: 480px) {
  .kf-root { bottom: 16px; }
  .kf-root[data-pos="bottom-right"] { right: 16px; }
  .kf-root[data-pos="bottom-left"]  { left: 16px; }
  .kf-panel { width: calc(100vw - 24px); max-width: none; border-radius: var(--radius-lg); }
  .kf-fab span { display: none; }
  .kf-fab { padding: 12px; border-radius: 50%; }
  .kf-fab svg { width: 18px; height: 18px; }
}
`;async function ue(t){let n;try{n=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser",frameRate:1},audio:!1,preferCurrentTab:!0,selfBrowserSurface:"include"})}catch(o){return null}let[r]=n.getVideoTracks();t&&(t.style.visibility="hidden");let a=document.createElement("video");a.muted=!0,a.playsInline=!0,a.srcObject=n,await new Promise(o=>{a.onloadedmetadata=()=>o()}),await a.play(),await new Promise(o=>requestAnimationFrame(()=>requestAnimationFrame(()=>o())));let{videoWidth:l,videoHeight:p}=a,s=document.createElement("canvas");return s.width=l,s.height=p,s.getContext("2d").drawImage(a,0,0,l,p),a.pause(),a.srcObject=null,r.stop(),t&&(t.style.visibility=""),{bitmap:await createImageBitmap(s),scaleX:l/window.innerWidth,scaleY:p/window.innerHeight}}function pe(t,n,r,a,l,p){t.beginPath(),t.moveTo(n+p,r),t.arcTo(n+a,r,n+a,r+l,p),t.arcTo(n+a,r+l,n,r+l,p),t.arcTo(n,r+l,n,r,p),t.arcTo(n,r,n+a,r,p),t.closePath()}async function be(t){let n=await ue(t);if(!n)return null;let{bitmap:r}=n,a=document.createElement("canvas");return a.width=r.width,a.height=r.height,a.getContext("2d").drawImage(r,0,0),r.close(),new Promise(l=>a.toBlob(l,"image/png"))}async function me(t){let n=await ue(t);return n?Te(n):null}function Te({bitmap:t,scaleX:n,scaleY:r}){return new Promise(a=>{let l=window.innerWidth,p=window.innerHeight,s=Math.min(window.devicePixelRatio||1,2),f=document.createElement("canvas");f.width=l*s,f.height=p*s,Object.assign(f.style,{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",zIndex:"2147483646",cursor:"crosshair",userSelect:"none"}),document.body.appendChild(f);let o=f.getContext("2d");o.scale(s,s);function E(){o.drawImage(t,0,0,t.width,t.height,0,0,l,p),o.fillStyle="rgba(0,0,0,0.38)",o.fillRect(0,0,l,p)}function L(){let c="S\xFCr\xFCkle: alan se\xE7   \u2022   B\u0131rak: onayla   \u2022   Esc: iptal";o.font="13px -apple-system, system-ui, sans-serif";let k=o.measureText(c).width+24,g=36,v=(l-k)/2,M=p-g-20;o.fillStyle="rgba(15,23,42,0.72)",pe(o,v,M,k,g,10),o.fill(),o.fillStyle="#f1f5f9",o.textAlign="center",o.textBaseline="middle",o.fillText(c,l/2,M+g/2),o.textAlign="left",o.textBaseline="alphabetic"}function _(c,b,k,g){o.save(),o.beginPath(),o.rect(c,b,k,g),o.clip(),o.drawImage(t,0,0,t.width,t.height,0,0,l,p),o.restore(),o.strokeStyle="#6366f1",o.lineWidth=2,o.setLineDash([6,3]),o.strokeRect(c+1,b+1,k-2,g-2),o.setLineDash([]);let v=7;o.fillStyle="#6366f1",[[c,b],[c+k-v,b],[c,b+g-v],[c+k-v,b+g-v]].forEach(([X,K])=>o.fillRect(X,K,v,v)),o.font="bold 12px -apple-system, system-ui, sans-serif";let M=`${Math.round(k)} \xD7 ${Math.round(g)}`,H=o.measureText(M).width+14,T=22,j=Math.min(c,l-H-4),D=b>T+8?b-T-4:b+g+4;o.fillStyle="#6366f1",pe(o,j,D,H,T,5),o.fill(),o.fillStyle="#fff",o.textBaseline="middle",o.fillText(M,j+7,D+T/2),o.textBaseline="alphabetic"}let B=0,z=0,u=!1;function h(c,b){if(E(),L(),c===void 0||b===void 0)return;let k=Math.min(B,c),g=Math.min(z,b),v=Math.abs(c-B),M=Math.abs(b-z);v>1&&M>1&&_(k,g,v,M)}h(),f.addEventListener("mousedown",c=>{c.preventDefault(),B=c.clientX,z=c.clientY,u=!0}),f.addEventListener("mousemove",c=>{u&&h(c.clientX,c.clientY)}),f.addEventListener("mouseup",c=>{if(!u)return;u=!1;let b=Math.min(B,c.clientX),k=Math.min(z,c.clientY),g=Math.abs(c.clientX-B),v=Math.abs(c.clientY-z);if(P(),g<10||v<10){t.close(),a(null);return}A(b,k,g,v)});function w(c){c.key==="Escape"&&(P(),t.close(),a(null))}window.addEventListener("keydown",w,!0);function P(){f.remove(),window.removeEventListener("keydown",w,!0)}function A(c,b,k,g){let v=Math.round(c*n),M=Math.round(b*r),H=Math.round(k*n),T=Math.round(g*r),j=document.createElement("canvas");j.width=H,j.height=T,j.getContext("2d").drawImage(t,v,M,H,T,0,0,H,T),t.close(),j.toBlob(D=>a(D),"image/png")}})}var $e={tr:{fabLabel:"Geri bildirim",title:"Geri bildirim",categoryLabel:"Kategori",messageLabel:"A\xE7\u0131klama",messagePlaceholder:"Ne eklensin ya da nerede bir sorun var?",submitLabel:"G\xF6nder",successMessage:"Te\u015Fekk\xFCrler! Geri bildirimin al\u0131nd\u0131.",errorMessage:"G\xF6nderilemedi. L\xFCtfen tekrar dene."},en:{fabLabel:"Feedback",title:"Feedback",categoryLabel:"Category",messageLabel:"Description",messagePlaceholder:"What should be added, or where is the problem?",submitLabel:"Send",successMessage:"Thanks! Your feedback was received.",errorMessage:"Couldn't send. Please try again."}};function He(){return(document.documentElement.lang||"").toLowerCase().startsWith("en")?"en":"tr"}var V=4;function C(t){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}var x={chat:C('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),history:C('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),copy:C('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),camera:C('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),crop:C('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),target:C('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>'),upload:C('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),close:C('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),check:C('<polyline points="20 6 9 17 4 12"/>'),alert:C('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),x:C('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')};async function he(){var p,s;let t=window.__KF_CONFIG__;if(!t)return;let n=(p=window.RevistoFeedback)!=null?p:{},r=n.domain||location.host,a;try{a=await(await fetch(`${t.base}/api/v1/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:r,meta:{user:n.user,href:location.href}})})).json()}catch(f){return}if(!a.enabled)return;let l={...t.project,...(s=a.project)!=null?s:{}};Se(t,n,l,{domain:r})}function Se(t,n,r,a){var le,de,ce;let l=document.createElement("div");l.id="revisto-widget",document.body.appendChild(l);let p=l.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=fe,p.appendChild(s);let f=document.createElement("div");f.className="kf-root",f.dataset.pos=r.position||"bottom-right",f.style.setProperty("--kf-accent",r.accentColor||"#6366f1"),document.documentElement.getAttribute("data-theme")==="light"&&(f.dataset.theme="light");let E=He(),L={...$e[E],...(le=r.text)==null?void 0:le[E]},_=(de=r.fields)!=null?de:[],B=((ce=r.categories)!=null?ce:["\xD6neri"]).map(e=>`<option value="${d(e)}">${d(e)}</option>`).join(""),z=_.map(e=>{var y;let i=e.required?"required":"",m=e.placeholder?`placeholder="${d(e.placeholder)}"`:"",$=`<label class="kf-label">${d(e.label)}${e.required?" *":""}</label>`,F="";if(e.type==="textarea")F=`<textarea class="kf-textarea kf-cf" data-cf="${d(e.id)}" data-cf-label="${d(e.label)}" ${m} ${i}></textarea>`;else if(e.type==="select"){let W=((y=e.options)!=null?y:[]).map(G=>`<option value="${d(G)}">${d(G)}</option>`).join("");F=`<select class="kf-select kf-cf" data-cf="${d(e.id)}" data-cf-label="${d(e.label)}" ${i}>${W}</select>`}else{if(e.type==="checkbox")return`<label class="kf-cf-check"><input type="checkbox" class="kf-cf" data-cf="${d(e.id)}" data-cf-label="${d(e.label)}" data-cf-type="checkbox" ${i}> ${d(e.label)}</label>`;F=`<input type="${e.type==="email"?"email":"text"}" class="kf-input kf-cf" data-cf="${d(e.id)}" data-cf-label="${d(e.label)}" ${m} ${i}>`}return`<div>${$}${F}</div>`}).join("");f.innerHTML=`
    <button class="kf-fab" type="button" aria-label="${d(L.fabLabel)}">
      ${x.chat}<span>${d(L.fabLabel)}</span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="${d(L.title)}">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${x.chat}</div>
          <span class="kf-title">${d(L.title)}</span>
        </div>
        <div class="kf-head-actions">
          <button class="kf-icon-btn kf-history-toggle" type="button" aria-label="Ge\xE7mi\u015F">${x.history}</button>
          <button class="kf-icon-btn kf-close-btn" type="button" aria-label="Kapat">${x.close}</button>
        </div>
      </div>

      <div class="kf-msg" hidden></div>

      <!-- History view -->
      <div class="kf-view-history" hidden>
        <p class="kf-history-empty" hidden>Hen\xFCz geri bildirim g\xF6ndermediniz.</p>
        <ul class="kf-history-list"></ul>
      </div>

      <div class="kf-view-form">
      <div class="kf-body">

        <div>
          <label class="kf-label">${d(L.categoryLabel)}</label>
          <select class="kf-select" aria-label="${d(L.categoryLabel)}">${B}</select>
        </div>

        <div>
          <label class="kf-label">${d(L.messageLabel)}</label>
          <textarea class="kf-textarea" placeholder="${d(L.messagePlaceholder)}"></textarea>
        </div>

        ${z}

        <div class="kf-capture-row">
          <button class="kf-chip kf-capture-full" type="button">
            ${x.camera} T\xFCm ekran
          </button>
          <button class="kf-chip kf-capture-area" type="button">
            ${x.crop} Alan se\xE7
          </button>
          <button class="kf-chip kf-element-select" type="button">
            ${x.target} \xD6\u011Fe se\xE7
          </button>
          <button class="kf-chip kf-chip-upload kf-upload" type="button" aria-label="G\xF6rsel y\xFCkle">
            ${x.upload}
          </button>
        </div>

        <div class="kf-attach-row">
          <span class="kf-counter">0 / ${V}</span>
        </div>

        <div class="kf-thumbs"></div>
        <div class="kf-annotations" hidden></div>
        <input class="kf-file" type="file" accept="image/*" multiple hidden />

        <div class="kf-hint">\u0130pucu: <kbd>\u2318 / Ctrl + /</kbd> ile her yerden a\xE7</div>
      </div>

      </div> <!-- /kf-view-form -->

      <div class="kf-foot">
        <button class="kf-btn kf-btn-ghost kf-cancel" type="button">${d(E==="en"?"Cancel":"Vazge\xE7")}</button>
        <button class="kf-btn kf-btn-primary kf-submit" type="button">${d(L.submitLabel)}</button>
      </div>

    </div>
  `,p.appendChild(f);let u=e=>f.querySelector(e),h=u(".kf-fab"),w=u(".kf-panel"),P=u(".kf-close-btn"),A=u(".kf-history-toggle"),c=u(".kf-cancel"),b=u(".kf-submit"),k=u(".kf-capture-full"),g=u(".kf-capture-area"),v=u(".kf-element-select"),M=u(".kf-upload"),H=u(".kf-file"),T=u(".kf-textarea"),j=u(".kf-select"),D=u(".kf-thumbs"),X=u(".kf-counter"),K=u(".kf-annotations"),I=u(".kf-msg"),Z=u(".kf-view-form"),Q=u(".kf-view-history"),ee=u(".kf-history-list"),ke=u(".kf-history-empty"),te=u(".kf-foot"),R=[],N=[],ne=`kf_history_${t.widgetKey}`;function ae(){try{return JSON.parse(localStorage.getItem(ne)||"[]")}catch(e){return[]}}function ve(e){let i=ae();i.unshift(e),localStorage.setItem(ne,JSON.stringify(i.slice(0,50)))}function ye(e){return new Date(e).toLocaleDateString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}function we(){let e=ae();ee.innerHTML="",ke.hidden=e.length>0,e.forEach(i=>{let m=document.createElement("li");m.className="kf-history-item",m.innerHTML=`
        <div class="kf-hi-left">
          <span class="kf-hi-cat">${d(i.category)}</span>
          <span class="kf-hi-page">${d(i.page)}</span>
        </div>
        <div class="kf-hi-right">
          <span class="kf-hi-id" title="Kopyala">#${d(i.id.slice(0,8))}</span>
          <span class="kf-hi-date">${d(ye(i.date))}</span>
        </div>`,m.querySelector(".kf-hi-id").addEventListener("click",()=>re(i.id)),ee.appendChild(m)})}let Y=!1;function oe(){Y=!1,Z.hidden=!1,Q.hidden=!0,te.hidden=!1,A.title="Ge\xE7mi\u015F",A.innerHTML=x.history,S("",null)}function Le(){Y=!0,Z.hidden=!0,Q.hidden=!1,te.hidden=!0,A.title="Forma d\xF6n",A.innerHTML=x.close,we(),S("",null)}A.addEventListener("click",()=>Y?oe():Le());function re(e,i){var m;(m=navigator.clipboard)==null||m.writeText(e).catch(()=>{}),i&&(i.classList.add("copied"),i.innerHTML=x.check,setTimeout(()=>{i.classList.remove("copied"),i.innerHTML=x.copy},1800))}function S(e,i){if(!i){I.hidden=!0,I.innerHTML="";return}I.hidden=!1,I.className=`kf-msg kf-${i}`,I.innerHTML=`${i==="ok"?x.check:x.alert} ${d(e)}`}function O(){let e=R.length>=V;X.textContent=`${R.length} / ${V}`,k.disabled=e,g.disabled=e,M.disabled=e,D.innerHTML="",R.forEach((i,m)=>{let $=document.createElement("div");$.className="kf-thumb",$.innerHTML=`<img src="${i.url}" alt="ek"><button class="kf-thumb-del" type="button" aria-label="Kald\u0131r">${x.x}</button>`,$.querySelector("button").addEventListener("click",()=>{URL.revokeObjectURL(i.url),R.splice(m,1),O()}),D.appendChild($)})}function U(){K.hidden=N.length===0,K.innerHTML="",N.forEach((e,i)=>{let m=document.createElement("div");m.className="kf-ann-item",m.innerHTML=`
        <div class="kf-ann-pin">${i+1}</div>
        <div class="kf-ann-main">
          <div class="kf-ann-selector">${d(e.selector)}</div>
          <div class="kf-ann-note">${d(e.value)}</div>
        </div>
        <button class="kf-ann-del" type="button" aria-label="Kald\u0131r">${x.x}</button>`,m.querySelector("button").addEventListener("click",()=>{N.splice(i,1),U()}),K.appendChild(m)})}function J(e,i){R.length>=V||(R.push({blob:e,kind:i,url:URL.createObjectURL(e)}),O())}function ie(){f.dataset.open="1",Y||setTimeout(()=>T.focus(),60)}function q(){f.dataset.open="0",oe()}function se(){f.dataset.open==="1"?q():ie()}h.addEventListener("click",se),P.addEventListener("click",q),c.addEventListener("click",q),M.addEventListener("click",()=>H.click()),H.addEventListener("change",()=>{var e;Array.from((e=H.files)!=null?e:[]).filter(i=>i.type.startsWith("image/")).forEach(i=>J(i,"upload")),H.value=""}),k.addEventListener("click",async()=>{k.disabled=!0,k.innerHTML=`${x.camera} Bekleniyor\u2026`;try{let e=await be(l);e?J(e,"screenshot"):S("Ekran payla\u015F\u0131m\u0131 iptal edildi.","err")}catch(e){S("Ekran yakalanamad\u0131.","err")}finally{k.innerHTML=`${x.camera} T\xFCm ekran`,O()}}),g.addEventListener("click",async()=>{g.disabled=!0,g.innerHTML=`${x.crop} Bekleniyor\u2026`;try{let e=await me(l);e?J(e,"screenshot"):S("Alan se\xE7imi iptal edildi.","err")}catch(e){S("Ekran yakalanamad\u0131.","err")}finally{g.innerHTML=`${x.crop} Alan se\xE7`,O()}}),v.addEventListener("click",async()=>{q(),v.disabled=!0;try{let e=await Be(l,E);e&&(N.push(e),U())}finally{v.disabled=!1,ie()}});function Ee(){let e=f.querySelectorAll(".kf-cf"),i=[];for(let m of Array.from(e)){let $=m.dataset.cfLabel||"",y=m.dataset.cfType==="checkbox"?m.checked?E==="en"?"Yes":"Evet":"":m.value.trim();if(m.hasAttribute("required")&&!y)return m.focus(),{ok:!1,values:[]};y&&i.push({label:$,value:y})}return{ok:!0,values:i}}async function Me(){let e=T.value.trim();if(!e){S(E==="en"?"Please write a description.":"L\xFCtfen bir a\xE7\u0131klama yaz.","err"),T.focus();return}let i=Ee();if(!i.ok){S(E==="en"?"Please fill required fields.":"L\xFCtfen zorunlu alanlar\u0131 doldur.","err");return}b.disabled=!0,b.textContent=E==="en"?"Sending\u2026":"G\xF6nderiliyor\u2026",S("",null);try{let m=await fetch(`${t.base}/api/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:a.domain,category:j.value,message:e,page_url:location.href,viewport:`${window.innerWidth}x${window.innerHeight}`,wp_user:n.user,custom_fields:[...i.values,...N]})}),$=await m.json();if(!m.ok||!$.ok){S(L.errorMessage,"err");return}for(let y of R){let W=new FormData;W.append("widget_key",t.widgetKey),W.append("domain",a.domain),W.append("kind",y.kind);let G=y.blob.type==="image/png"?"png":"jpg";W.append("file",y.blob,`${y.kind}.${G}`),await fetch(`${t.base}/api/v1/feedback/${$.feedback_id}/attachment`,{method:"POST",body:W}).catch(()=>{})}let F=$.feedback_id;ve({id:F,category:j.value,page:location.pathname,date:Date.now()}),I.hidden=!1,I.className="kf-msg kf-ok",I.innerHTML=`
        ${x.check} ${d(L.successMessage)}
        <div class="kf-ref-box">
          <span class="kf-ref-label">${d(E==="en"?"Reference":"Referans no")}</span>
          <span class="kf-ref-id" title="${d(F)}">#${d(F.slice(0,8))}</span>
          <button class="kf-ref-copy" type="button" aria-label="Kopyala">${x.copy}</button>
        </div>`,I.querySelector(".kf-ref-copy").addEventListener("click",y=>re(F,y.currentTarget)),T.value="",f.querySelectorAll(".kf-cf").forEach(y=>{y.dataset.cfType==="checkbox"?y.checked=!1:y.value=""}),R.splice(0).forEach(y=>URL.revokeObjectURL(y.url)),N.splice(0),O(),U(),setTimeout(q,4e3)}catch(m){S(E==="en"?"Connection error. Please try again.":"Ba\u011Flant\u0131 hatas\u0131. L\xFCtfen tekrar dene.","err")}finally{b.disabled=!1,b.textContent=L.submitLabel}}b.addEventListener("click",Me),window.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="/"&&(e.preventDefault(),se()),e.key==="Escape"&&f.dataset.open==="1"&&q()}),O(),U()}function d(t){return t.replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n])}function ge(t){let n=[],r=t;for(;r&&r.nodeType===1&&r!==document.body&&n.length<5;){let a=r.tagName.toLowerCase();if(r.id){a+=`#${xe(r.id)}`,n.unshift(a);break}let l=Array.from(r.classList).filter(s=>s&&!s.startsWith("revisto-")&&!s.startsWith("kf-")).slice(0,2);l.length&&(a+=`.${l.map(xe).join(".")}`);let p=r.parentElement;if(p){let s=Array.from(p.children).filter(f=>f.tagName===r.tagName);s.length>1&&(a+=`:nth-of-type(${s.indexOf(r)+1})`)}n.unshift(a),r=p}return n.join(" > ")||t.tagName.toLowerCase()}function xe(t){let n=window.CSS;return n!=null&&n.escape?n.escape(t):t.replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function Ce(t){return(t.textContent||"").replace(/\s+/g," ").trim().slice(0,140)}function Be(t,n){return new Promise(r=>{let a=document.createElement("div");a.className="revisto-element-highlight",Object.assign(a.style,{position:"fixed",zIndex:"2147483645",pointerEvents:"none",border:"2px solid #3b82f6",background:"rgba(59,130,246,.14)",borderRadius:"8px",boxShadow:"0 0 0 9999px rgba(15,23,42,.18)",transition:"left .08s, top .08s, width .08s, height .08s",display:"none"});let l=document.createElement("div");Object.assign(l.style,{position:"fixed",zIndex:"2147483646",pointerEvents:"none",background:"#2563eb",color:"#fff",borderRadius:"999px",padding:"4px 9px",font:"600 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",boxShadow:"0 8px 18px rgba(37,99,235,.28)",display:"none"}),l.textContent=n==="en"?"Click an element":"\xD6\u011Feye t\u0131kla",document.body.append(a,l),t.style.visibility="hidden";let p=null,s=null,f=!1;function o(h){f||(f=!0,E(),r(h))}function E(){t.style.visibility="",a.remove(),l.remove(),s==null||s.remove(),window.removeEventListener("mousemove",_,!0),window.removeEventListener("click",B,!0),window.removeEventListener("keydown",z,!0)}function L(h){if(p=h,!h){a.style.display="none",l.style.display="none";return}let w=h.getBoundingClientRect();a.style.display="block",a.style.left=`${Math.max(0,w.left)}px`,a.style.top=`${Math.max(0,w.top)}px`,a.style.width=`${Math.max(0,w.width)}px`,a.style.height=`${Math.max(0,w.height)}px`,l.style.display="block",l.style.left=`${Math.min(window.innerWidth-132,Math.max(8,w.left))}px`,l.style.top=`${Math.max(8,w.top-32)}px`}function _(h){if(s)return;let w=document.elementFromPoint(h.clientX,h.clientY);if(!w||w===t||t.contains(w)){L(null);return}L(w)}function B(h){s!=null&&s.contains(h.target)||(h.preventDefault(),h.stopPropagation(),p&&u(p))}function z(h){h.key==="Escape"&&(h.preventDefault(),o(null))}function u(h){let w=h.getBoundingClientRect();s==null||s.remove(),s=document.createElement("div"),Object.assign(s.style,{position:"fixed",zIndex:"2147483647",width:"min(320px, calc(100vw - 24px))",left:`${Math.min(window.innerWidth-332,Math.max(12,w.left))}px`,top:`${Math.min(window.innerHeight-190,Math.max(12,w.bottom+10))}px`,background:"#ffffff",border:"1px solid rgba(15,23,42,.14)",borderRadius:"12px",boxShadow:"0 20px 50px rgba(15,23,42,.22)",padding:"12px",font:"13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",color:"#0f172a"}),s.innerHTML=`
        <div style="font-weight:700;margin-bottom:6px">${n==="en"?"Add note to element":"\xD6\u011Feye not ekle"}</div>
        <div style="font-size:11px;color:#64748b;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d(ge(h))}</div>
        <textarea style="width:100%;min-height:78px;resize:none;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font:13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;outline:none" placeholder="${n==="en"?"What should change here?":"Burada ne de\u011Fi\u015Fmeli?"}"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
          <button type="button" data-cancel style="border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:7px 10px;font-weight:600;color:#475569;cursor:pointer">${n==="en"?"Cancel":"Vazge\xE7"}</button>
          <button type="button" data-save style="border:0;background:#2563eb;border-radius:8px;padding:7px 12px;font-weight:700;color:#fff;cursor:pointer">${n==="en"?"Add":"Ekle"}</button>
        </div>`,document.body.appendChild(s);let P=s.querySelector("textarea");P.focus(),s.querySelector("[data-cancel]").addEventListener("click",()=>o(null)),s.querySelector("[data-save]").addEventListener("click",()=>{let A=P.value.trim();if(!A){P.focus();return}let c=ge(h),b=h.getBoundingClientRect();o({kind:"element_annotation",label:n==="en"?"Element note":"\xD6\u011Fe notu",value:A,selector:c,tagName:h.tagName.toLowerCase(),text:Ce(h),rect:{x:Math.round(b.left),y:Math.round(b.top),width:Math.round(b.width),height:Math.round(b.height),viewportWidth:window.innerWidth,viewportHeight:window.innerHeight}})})}window.addEventListener("mousemove",_,!0),window.addEventListener("click",B,!0),window.addEventListener("keydown",z,!0)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",he):he();})();
