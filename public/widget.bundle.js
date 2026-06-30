"use strict";(()=>{var be=`
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
  --warn-bg:     rgba(245,158,11,.12);
  --warn-txt:    #fcd34d;
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
  --warn-bg:     rgba(245,158,11,.14);
  --warn-txt:    #b45309;
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
.kf-msg .kf-warn {
  margin: 8px 0 0;
  padding: 8px 10px;
  background: var(--warn-bg);
  color: var(--warn-txt);
  border-radius: var(--radius-sm);
  flex-basis: 100%;
}
.kf-msg .kf-warn svg { width: 13px; height: 13px; }

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
`;async function te(t){let a;try{a=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser",frameRate:1},audio:!1,preferCurrentTab:!0,selfBrowserSurface:"include"})}catch(i){return null}let[d]=a.getVideoTracks();t&&(t.style.visibility="hidden");let r=document.createElement("video");r.muted=!0,r.playsInline=!0,r.srcObject=a,await new Promise(i=>{r.onloadedmetadata=()=>i()}),await r.play(),await new Promise(i=>requestAnimationFrame(()=>requestAnimationFrame(()=>i())));let{videoWidth:s,videoHeight:p}=r,l=document.createElement("canvas");return l.width=s,l.height=p,l.getContext("2d").drawImage(r,0,0,s,p),r.pause(),r.srcObject=null,d.stop(),t&&(t.style.visibility=""),{bitmap:await createImageBitmap(l),scaleX:s/window.innerWidth,scaleY:p/window.innerHeight}}function me(t){t==null||t.bitmap.close()}function Z(t,a,d,r,s,p){t.beginPath(),t.moveTo(a+p,d),t.arcTo(a+r,d,a+r,d+s,p),t.arcTo(a+r,d+s,a,d+s,p),t.arcTo(a,d+s,a,d,p),t.arcTo(a,d,a+r,d,p),t.closePath()}async function he(t){let a=await te(t);if(!a)return null;let{bitmap:d}=a,r=document.createElement("canvas");return r.width=d.width,r.height=d.height,r.getContext("2d").drawImage(d,0,0),d.close(),new Promise(s=>r.toBlob(s,"image/png"))}async function ge(t){return te(t)}function xe(t,a,d){let{bitmap:r,scaleX:s,scaleY:p}=t,l=document.createElement("canvas");l.width=r.width,l.height=r.height;let n=l.getContext("2d");n.drawImage(r,0,0);let i=Math.round(a.x*s),v=Math.round(a.y*p),y=Math.round(a.w*s),D=Math.round(a.h*p),E=Math.max(3,Math.round(2*Math.max(s,p))),S=Math.max(14,Math.round(12*Math.max(s,p)));n.save(),n.fillStyle="rgba(59, 130, 246, 0.18)",Z(n,i,v,y,D,S),n.fill(),n.strokeStyle="#3b82f6",n.lineWidth=E,Z(n,i+E/2,v+E/2,Math.max(0,y-E),Math.max(0,D-E),S),n.stroke();let c=Math.max(24,Math.round(22*Math.max(s,p))),m=Math.min(l.width-c-E,Math.max(E,i+y-c/2)),w=Math.max(E,v-c/2);return n.fillStyle="#3b82f6",n.beginPath(),n.arc(m+c/2,w+c/2,c/2,0,Math.PI*2),n.fill(),n.strokeStyle="#ffffff",n.lineWidth=Math.max(2,Math.round(1.5*Math.max(s,p))),n.stroke(),n.fillStyle="#ffffff",n.font=`700 ${Math.round(c*.5)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,n.textAlign="center",n.textBaseline="middle",n.fillText(String(d),m+c/2,w+c/2+1),n.restore(),new Promise(P=>l.toBlob(P,"image/png"))}async function ke(t){let a=await te(t);return a?ze(a):null}function ze({bitmap:t,scaleX:a,scaleY:d}){return new Promise(r=>{let s=window.innerWidth,p=window.innerHeight,l=Math.min(window.devicePixelRatio||1,2),n=document.createElement("canvas");n.width=s*l,n.height=p*l,Object.assign(n.style,{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",zIndex:"2147483646",cursor:"crosshair",userSelect:"none"}),document.body.appendChild(n);let i=n.getContext("2d");i.scale(l,l);function v(){i.drawImage(t,0,0,t.width,t.height,0,0,s,p),i.fillStyle="rgba(0,0,0,0.38)",i.fillRect(0,0,s,p)}function y(){let u="S\xFCr\xFCkle: alan se\xE7   \u2022   B\u0131rak: onayla   \u2022   Esc: iptal";i.font="13px -apple-system, system-ui, sans-serif";let M=i.measureText(u).width+24,k=36,x=(s-M)/2,C=p-k-20;i.fillStyle="rgba(15,23,42,0.72)",Z(i,x,C,M,k,10),i.fill(),i.fillStyle="#f1f5f9",i.textAlign="center",i.textBaseline="middle",i.fillText(u,s/2,C+k/2),i.textAlign="left",i.textBaseline="alphabetic"}function D(u,h,M,k){i.save(),i.beginPath(),i.rect(u,h,M,k),i.clip(),i.drawImage(t,0,0,t.width,t.height,0,0,s,p),i.restore(),i.strokeStyle="#6366f1",i.lineWidth=2,i.setLineDash([6,3]),i.strokeRect(u+1,h+1,M-2,k-2),i.setLineDash([]);let x=7;i.fillStyle="#6366f1",[[u,h],[u+M-x,h],[u,h+k-x],[u+M-x,h+k-x]].forEach(([Q,K])=>i.fillRect(Q,K,x,x)),i.font="bold 12px -apple-system, system-ui, sans-serif";let C=`${Math.round(M)} \xD7 ${Math.round(k)}`,I=i.measureText(C).width+14,B=22,R=Math.min(u,s-I-4),O=h>B+8?h-B-4:h+k+4;i.fillStyle="#6366f1",Z(i,R,O,I,B,5),i.fill(),i.fillStyle="#fff",i.textBaseline="middle",i.fillText(C,R+7,O+B/2),i.textBaseline="alphabetic"}let E=0,S=0,c=!1;function m(u,h){if(v(),y(),u===void 0||h===void 0)return;let M=Math.min(E,u),k=Math.min(S,h),x=Math.abs(u-E),C=Math.abs(h-S);x>1&&C>1&&D(M,k,x,C)}m(),n.addEventListener("mousedown",u=>{u.preventDefault(),E=u.clientX,S=u.clientY,c=!0}),n.addEventListener("mousemove",u=>{c&&m(u.clientX,u.clientY)}),n.addEventListener("mouseup",u=>{if(!c)return;c=!1;let h=Math.min(E,u.clientX),M=Math.min(S,u.clientY),k=Math.abs(u.clientX-E),x=Math.abs(u.clientY-S);if(P(),k<10||x<10){t.close(),r(null);return}j(h,M,k,x)});function w(u){u.key==="Escape"&&(P(),t.close(),r(null))}window.addEventListener("keydown",w,!0);function P(){n.remove(),window.removeEventListener("keydown",w,!0)}function j(u,h,M,k){let x=Math.round(u*a),C=Math.round(h*d),I=Math.round(M*a),B=Math.round(k*d),R=document.createElement("canvas");R.width=I,R.height=B,R.getContext("2d").drawImage(t,x,C,I,B,0,0,I,B),t.close(),R.toBlob(O=>r(O),"image/png")}})}var Ae={tr:{fabLabel:"Geri bildirim",title:"Geri bildirim",categoryLabel:"Kategori",messageLabel:"A\xE7\u0131klama",messagePlaceholder:"Ne eklensin ya da nerede bir sorun var?",submitLabel:"G\xF6nder",successMessage:"Te\u015Fekk\xFCrler! Geri bildirimin al\u0131nd\u0131.",errorMessage:"G\xF6nderilemedi. L\xFCtfen tekrar dene."},en:{fabLabel:"Feedback",title:"Feedback",categoryLabel:"Category",messageLabel:"Description",messagePlaceholder:"What should be added, or where is the problem?",submitLabel:"Send",successMessage:"Thanks! Your feedback was received.",errorMessage:"Couldn't send. Please try again."}};function Ie(){return(document.documentElement.lang||"").toLowerCase().startsWith("en")?"en":"tr"}var G=4;function F(t){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}var g={chat:F('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),history:F('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),copy:F('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),camera:F('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),crop:F('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),target:F('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>'),upload:F('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),close:F('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),check:F('<polyline points="20 6 9 17 4 12"/>'),alert:F('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),x:F('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')};function Fe(){return crypto!=null&&crypto.randomUUID?crypto.randomUUID():`ann_${Date.now()}_${Math.random().toString(36).slice(2)}`}async function ve(){var p,l;let t=window.__KF_CONFIG__;if(!t)return;let a=(p=window.RevistoFeedback)!=null?p:{},d=a.domain||location.host,r;try{r=await(await fetch(`${t.base}/api/v1/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:d,meta:{user:a.user,href:location.href}})})).json()}catch(n){return}if(!r.enabled)return;let s={...t.project,...(l=r.project)!=null?l:{}};Pe(t,a,s,{domain:d})}function Pe(t,a,d,r){var fe,pe,ue;let s=document.createElement("div");s.id="revisto-widget",document.body.appendChild(s);let p=s.attachShadow({mode:"open"}),l=document.createElement("style");l.textContent=be,p.appendChild(l);let n=document.createElement("div");n.className="kf-root",n.dataset.pos=d.position||"bottom-right",n.style.setProperty("--kf-accent",d.accentColor||"#6366f1"),document.documentElement.getAttribute("data-theme")==="light"&&(n.dataset.theme="light");let v=Ie(),y={...Ae[v],...(fe=d.text)==null?void 0:fe[v]},D=(pe=d.fields)!=null?pe:[],E=((ue=d.categories)!=null?ue:["\xD6neri"]).map(e=>`<option value="${f(e)}">${f(e)}</option>`).join(""),S=D.map(e=>{var A;let o=e.required?"required":"",b=e.placeholder?`placeholder="${f(e.placeholder)}"`:"",L=`<label class="kf-label">${f(e.label)}${e.required?" *":""}</label>`,T="";if(e.type==="textarea")T=`<textarea class="kf-textarea kf-cf" data-cf="${f(e.id)}" data-cf-label="${f(e.label)}" ${b} ${o}></textarea>`;else if(e.type==="select"){let J=((A=e.options)!=null?A:[]).map($=>`<option value="${f($)}">${f($)}</option>`).join("");T=`<select class="kf-select kf-cf" data-cf="${f(e.id)}" data-cf-label="${f(e.label)}" ${o}>${J}</select>`}else{if(e.type==="checkbox")return`<label class="kf-cf-check"><input type="checkbox" class="kf-cf" data-cf="${f(e.id)}" data-cf-label="${f(e.label)}" data-cf-type="checkbox" ${o}> ${f(e.label)}</label>`;T=`<input type="${e.type==="email"?"email":"text"}" class="kf-input kf-cf" data-cf="${f(e.id)}" data-cf-label="${f(e.label)}" ${b} ${o}>`}return`<div>${L}${T}</div>`}).join("");n.innerHTML=`
    <button class="kf-fab" type="button" aria-label="${f(y.fabLabel)}">
      ${g.chat}<span>${f(y.fabLabel)}</span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="${f(y.title)}">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${g.chat}</div>
          <span class="kf-title">${f(y.title)}</span>
        </div>
        <div class="kf-head-actions">
          <button class="kf-icon-btn kf-history-toggle" type="button" aria-label="Ge\xE7mi\u015F">${g.history}</button>
          <button class="kf-icon-btn kf-close-btn" type="button" aria-label="Kapat">${g.close}</button>
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
          <label class="kf-label">${f(y.categoryLabel)}</label>
          <select class="kf-select" aria-label="${f(y.categoryLabel)}">${E}</select>
        </div>

        <div>
          <label class="kf-label">${f(y.messageLabel)}</label>
          <textarea class="kf-textarea" placeholder="${f(y.messagePlaceholder)}"></textarea>
        </div>

        ${S}

        <div class="kf-capture-row">
          <button class="kf-chip kf-capture-full" type="button">
            ${g.camera} T\xFCm ekran
          </button>
          <button class="kf-chip kf-capture-area" type="button">
            ${g.crop} Alan se\xE7
          </button>
          <button class="kf-chip kf-element-select" type="button">
            ${g.target} \xD6\u011Fe se\xE7
          </button>
          <button class="kf-chip kf-chip-upload kf-upload" type="button" aria-label="G\xF6rsel y\xFCkle">
            ${g.upload}
          </button>
        </div>

        <div class="kf-attach-row">
          <span class="kf-counter">0 / ${G}</span>
        </div>

        <div class="kf-thumbs"></div>
        <div class="kf-annotations" hidden></div>
        <input class="kf-file" type="file" accept="image/*" multiple hidden />

        <div class="kf-hint">\u0130pucu: <kbd>\u2318 / Ctrl + /</kbd> ile her yerden a\xE7</div>
      </div>

      </div> <!-- /kf-view-form -->

      <div class="kf-foot">
        <button class="kf-btn kf-btn-ghost kf-cancel" type="button">${f(v==="en"?"Cancel":"Vazge\xE7")}</button>
        <button class="kf-btn kf-btn-primary kf-submit" type="button">${f(y.submitLabel)}</button>
      </div>

    </div>
  `,p.appendChild(n);let c=e=>n.querySelector(e),m=c(".kf-fab"),w=c(".kf-panel"),P=c(".kf-close-btn"),j=c(".kf-history-toggle"),u=c(".kf-cancel"),h=c(".kf-submit"),M=c(".kf-capture-full"),k=c(".kf-capture-area"),x=c(".kf-element-select"),C=c(".kf-upload"),I=c(".kf-file"),B=c(".kf-textarea"),R=c(".kf-select"),O=c(".kf-thumbs"),Q=c(".kf-counter"),K=c(".kf-annotations"),W=c(".kf-msg"),ne=c(".kf-view-form"),ae=c(".kf-view-history"),re=c(".kf-history-list"),Me=c(".kf-history-empty"),ie=c(".kf-foot"),z=[],_=[],oe=`kf_history_${t.widgetKey}`;function se(){try{return JSON.parse(localStorage.getItem(oe)||"[]")}catch(e){return[]}}function Ee(e){let o=se();o.unshift(e),localStorage.setItem(oe,JSON.stringify(o.slice(0,50)))}function Le(e){return new Date(e).toLocaleDateString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}function Te(){let e=se();re.innerHTML="",Me.hidden=e.length>0,e.forEach(o=>{let b=document.createElement("li");b.className="kf-history-item",b.innerHTML=`
        <div class="kf-hi-left">
          <span class="kf-hi-cat">${f(o.category)}</span>
          <span class="kf-hi-page">${f(o.page)}</span>
        </div>
        <div class="kf-hi-right">
          <span class="kf-hi-id" title="Kopyala">#${f(o.id.slice(0,8))}</span>
          <span class="kf-hi-date">${f(Le(o.date))}</span>
        </div>`,b.querySelector(".kf-hi-id").addEventListener("click",()=>de(o.id)),re.appendChild(b)})}let V=!1;function le(){V=!1,ne.hidden=!1,ae.hidden=!0,ie.hidden=!1,j.title="Ge\xE7mi\u015F",j.innerHTML=g.history,H("",null)}function $e(){V=!0,ne.hidden=!0,ae.hidden=!1,ie.hidden=!0,j.title="Forma d\xF6n",j.innerHTML=g.close,Te(),H("",null)}j.addEventListener("click",()=>V?le():$e());function de(e,o){var b;(b=navigator.clipboard)==null||b.writeText(e).catch(()=>{}),o&&(o.classList.add("copied"),o.innerHTML=g.check,setTimeout(()=>{o.classList.remove("copied"),o.innerHTML=g.copy},1800))}function H(e,o){if(!o){W.hidden=!0,W.innerHTML="";return}W.hidden=!1,W.className=`kf-msg kf-${o}`,W.innerHTML=`${o==="ok"?g.check:g.alert} ${f(e)}`}function N(){let e=z.length>=G;Q.textContent=`${z.length} / ${G}`,M.disabled=e,k.disabled=e,x.disabled=e,C.disabled=e,O.innerHTML="",z.forEach((o,b)=>{let L=document.createElement("div");L.className="kf-thumb",L.innerHTML=`<img src="${o.url}" alt="ek"><button class="kf-thumb-del" type="button" aria-label="Kald\u0131r">${g.x}</button>`,L.querySelector("button").addEventListener("click",()=>{if(URL.revokeObjectURL(o.url),o.annotationId){let T=_.findIndex(A=>A.id===o.annotationId);T>=0&&_.splice(T,1)}z.splice(b,1),N(),U()}),O.appendChild(L)})}function U(){K.hidden=_.length===0,K.innerHTML="",_.forEach((e,o)=>{let b=document.createElement("div");b.className="kf-ann-item",b.innerHTML=`
        <div class="kf-ann-pin">${o+1}</div>
        <div class="kf-ann-main">
          <div class="kf-ann-selector">${f(e.selector)}</div>
          <div class="kf-ann-note">${f(e.value)}</div>
        </div>
        <button class="kf-ann-del" type="button" aria-label="Kald\u0131r">${g.x}</button>`,b.querySelector("button").addEventListener("click",()=>{for(let L=z.length-1;L>=0;L--)z[L].annotationId===e.id&&(URL.revokeObjectURL(z[L].url),z.splice(L,1));_.splice(o,1),N(),U()}),K.appendChild(b)})}function X(e,o,b){z.length>=G||(z.push({blob:e,kind:o,annotationId:b,url:URL.createObjectURL(e)}),N())}function ee(){n.dataset.open="1",V||setTimeout(()=>B.focus(),60)}function q(){n.dataset.open="0",le()}function ce(){n.dataset.open==="1"?q():ee()}m.addEventListener("click",ce),P.addEventListener("click",q),u.addEventListener("click",q),C.addEventListener("click",()=>I.click()),I.addEventListener("change",()=>{var e;Array.from((e=I.files)!=null?e:[]).filter(o=>o.type.startsWith("image/")).forEach(o=>X(o,"upload")),I.value=""}),M.addEventListener("click",async()=>{M.disabled=!0,M.innerHTML=`${g.camera} Bekleniyor\u2026`;try{let e=await he(s);e?X(e,"screenshot"):H("Ekran payla\u015F\u0131m\u0131 iptal edildi.","err")}catch(e){H("Ekran yakalanamad\u0131.","err")}finally{M.innerHTML=`${g.camera} T\xFCm ekran`,N()}}),k.addEventListener("click",async()=>{k.disabled=!0,k.innerHTML=`${g.crop} Bekleniyor\u2026`;try{let e=await ke(s);e?X(e,"screenshot"):H("Alan se\xE7imi iptal edildi.","err")}catch(e){H("Ekran yakalanamad\u0131.","err")}finally{k.innerHTML=`${g.crop} Alan se\xE7`,N()}}),x.addEventListener("click",async()=>{if(z.length>=G){H(v==="en"?"Attachment limit reached.":"Ek s\u0131n\u0131r\u0131na ula\u015F\u0131ld\u0131.","err");return}q(),x.disabled=!0,x.innerHTML=`${g.target} Bekleniyor\u2026`;let e=await ge(s);if(!e){x.innerHTML=`${g.target} \xD6\u011Fe se\xE7`,x.disabled=!1,ee(),H(v==="en"?"Screen capture was cancelled.":"Ekran payla\u015F\u0131m\u0131 iptal edildi.","err"),N();return}try{let o=await Re(s,v);if(o){let b=await xe(e,{x:o.rect.x,y:o.rect.y,w:o.rect.width,h:o.rect.height},_.length+1);_.push(o),b?X(b,"screenshot",o.id):H(v==="en"?"Element screenshot couldn't be captured.":"\xD6\u011Fe ekran g\xF6r\xFCnt\xFCs\xFC al\u0131namad\u0131.","err"),U()}}finally{me(e),x.innerHTML=`${g.target} \xD6\u011Fe se\xE7`,x.disabled=!1,ee(),N()}});function He(){let e=n.querySelectorAll(".kf-cf"),o=[];for(let b of Array.from(e)){let L=b.dataset.cfLabel||"",A=b.dataset.cfType==="checkbox"?b.checked?v==="en"?"Yes":"Evet":"":b.value.trim();if(b.hasAttribute("required")&&!A)return b.focus(),{ok:!1,values:[]};A&&o.push({label:L,value:A})}return{ok:!0,values:o}}async function Se(){let e=B.value.trim();if(!e){H(v==="en"?"Please write a description.":"L\xFCtfen bir a\xE7\u0131klama yaz.","err"),B.focus();return}let o=He();if(!o.ok){H(v==="en"?"Please fill required fields.":"L\xFCtfen zorunlu alanlar\u0131 doldur.","err");return}h.disabled=!0,h.textContent=v==="en"?"Sending\u2026":"G\xF6nderiliyor\u2026",H("",null);try{let b=await fetch(`${t.base}/api/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:r.domain,category:R.value,message:e,page_url:location.href,viewport:`${window.innerWidth}x${window.innerHeight}`,wp_user:a.user,custom_fields:[...o.values,..._]})}),L=await b.json();if(!b.ok||!L.ok){H(y.errorMessage,"err");return}let T=0;for(let $ of z){let Y=new FormData;Y.append("widget_key",t.widgetKey),Y.append("domain",r.domain),Y.append("kind",$.kind);let Ce=$.blob.type==="image/png"?"png":"jpg";Y.append("file",$.blob,`${$.kind}.${Ce}`),await fetch(`${t.base}/api/v1/feedback/${L.feedback_id}/attachment`,{method:"POST",body:Y}).then(Be=>Be.ok).catch(()=>!1)||T++}let A=L.feedback_id;Ee({id:A,category:R.value,page:location.pathname,date:Date.now()});let J=T>0?`<div class="kf-msg kf-warn">${g.alert} ${f(v==="en"?`${T} attachment${T>1?"s":""} could not be uploaded.`:`${T} ek y\xFCklenemedi.`)}</div>`:"";W.hidden=!1,W.className="kf-msg kf-ok",W.innerHTML=`
        ${g.check} ${f(y.successMessage)}
        <div class="kf-ref-box">
          <span class="kf-ref-label">${f(v==="en"?"Reference":"Referans no")}</span>
          <span class="kf-ref-id" title="${f(A)}">#${f(A.slice(0,8))}</span>
          <button class="kf-ref-copy" type="button" aria-label="Kopyala">${g.copy}</button>
        </div>
        ${J}`,W.querySelector(".kf-ref-copy").addEventListener("click",$=>de(A,$.currentTarget)),B.value="",n.querySelectorAll(".kf-cf").forEach($=>{$.dataset.cfType==="checkbox"?$.checked=!1:$.value=""}),z.splice(0).forEach($=>URL.revokeObjectURL($.url)),_.splice(0),N(),U(),setTimeout(q,T>0?7e3:4e3)}catch(b){H(v==="en"?"Connection error. Please try again.":"Ba\u011Flant\u0131 hatas\u0131. L\xFCtfen tekrar dene.","err")}finally{h.disabled=!1,h.textContent=y.submitLabel}}h.addEventListener("click",Se),window.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="/"&&(e.preventDefault(),ce()),e.key==="Escape"&&n.dataset.open==="1"&&q()}),N(),U()}function f(t){return t.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}function ye(t){let a=[],d=t;for(;d&&d.nodeType===1&&d!==document.body&&a.length<5;){let r=d.tagName.toLowerCase();if(d.id){r+=`#${we(d.id)}`,a.unshift(r);break}let s=Array.from(d.classList).filter(l=>l&&!l.startsWith("revisto-")&&!l.startsWith("kf-")).slice(0,2);s.length&&(r+=`.${s.map(we).join(".")}`);let p=d.parentElement;if(p){let l=Array.from(p.children).filter(n=>n.tagName===d.tagName);l.length>1&&(r+=`:nth-of-type(${l.indexOf(d)+1})`)}a.unshift(r),d=p}return a.join(" > ")||t.tagName.toLowerCase()}function we(t){let a=window.CSS;return a!=null&&a.escape?a.escape(t):t.replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function je(t){return(t.textContent||"").replace(/\s+/g," ").trim().slice(0,140)}function Re(t,a){return new Promise(d=>{let r=document.createElement("div");r.className="revisto-element-highlight",Object.assign(r.style,{position:"fixed",zIndex:"2147483645",pointerEvents:"none",border:"2px solid #3b82f6",background:"rgba(59,130,246,.14)",borderRadius:"8px",boxShadow:"0 0 0 9999px rgba(15,23,42,.18)",transition:"left .08s, top .08s, width .08s, height .08s",display:"none"});let s=document.createElement("div");Object.assign(s.style,{position:"fixed",zIndex:"2147483646",pointerEvents:"none",background:"#2563eb",color:"#fff",borderRadius:"999px",padding:"4px 9px",font:"600 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",boxShadow:"0 8px 18px rgba(37,99,235,.28)",display:"none"}),s.textContent=a==="en"?"Click an element":"\xD6\u011Feye t\u0131kla",document.body.append(r,s),t.style.visibility="hidden";let p=null,l=null,n=!1;function i(m){n||(n=!0,v(),d(m))}function v(){t.style.visibility="",r.remove(),s.remove(),l==null||l.remove(),window.removeEventListener("mousemove",D,!0),window.removeEventListener("click",E,!0),window.removeEventListener("keydown",S,!0)}function y(m){if(p=m,!m){r.style.display="none",s.style.display="none";return}let w=m.getBoundingClientRect();r.style.display="block",r.style.left=`${Math.max(0,w.left)}px`,r.style.top=`${Math.max(0,w.top)}px`,r.style.width=`${Math.max(0,w.width)}px`,r.style.height=`${Math.max(0,w.height)}px`,s.style.display="block",s.style.left=`${Math.min(window.innerWidth-132,Math.max(8,w.left))}px`,s.style.top=`${Math.max(8,w.top-32)}px`}function D(m){if(l)return;let w=document.elementFromPoint(m.clientX,m.clientY);if(!w||w===t||t.contains(w)){y(null);return}y(w)}function E(m){l!=null&&l.contains(m.target)||(m.preventDefault(),m.stopPropagation(),p&&c(p))}function S(m){m.key==="Escape"&&(m.preventDefault(),i(null))}function c(m){let w=m.getBoundingClientRect();l==null||l.remove(),l=document.createElement("div"),Object.assign(l.style,{position:"fixed",zIndex:"2147483647",width:"min(320px, calc(100vw - 24px))",left:`${Math.min(window.innerWidth-332,Math.max(12,w.left))}px`,top:`${Math.min(window.innerHeight-190,Math.max(12,w.bottom+10))}px`,background:"#ffffff",border:"1px solid rgba(15,23,42,.14)",borderRadius:"12px",boxShadow:"0 20px 50px rgba(15,23,42,.22)",padding:"12px",font:"13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",color:"#0f172a"}),l.innerHTML=`
        <div style="font-weight:700;margin-bottom:6px">${a==="en"?"Add note to element":"\xD6\u011Feye not ekle"}</div>
        <div style="font-size:11px;color:#64748b;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f(ye(m))}</div>
        <textarea style="width:100%;min-height:78px;resize:none;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font:13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;outline:none" placeholder="${a==="en"?"What should change here?":"Burada ne de\u011Fi\u015Fmeli?"}"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
          <button type="button" data-cancel style="border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:7px 10px;font-weight:600;color:#475569;cursor:pointer">${a==="en"?"Cancel":"Vazge\xE7"}</button>
          <button type="button" data-save style="border:0;background:#2563eb;border-radius:8px;padding:7px 12px;font-weight:700;color:#fff;cursor:pointer">${a==="en"?"Add":"Ekle"}</button>
        </div>`,document.body.appendChild(l);let P=l.querySelector("textarea");P.focus(),l.querySelector("[data-cancel]").addEventListener("click",()=>i(null)),l.querySelector("[data-save]").addEventListener("click",()=>{let j=P.value.trim();if(!j){P.focus();return}let u=ye(m),h=m.getBoundingClientRect();i({id:Fe(),kind:"element_annotation",label:a==="en"?"Element note":"\xD6\u011Fe notu",value:j,selector:u,tagName:m.tagName.toLowerCase(),text:je(m),rect:{x:Math.round(h.left),y:Math.round(h.top),width:Math.round(h.width),height:Math.round(h.height),viewportWidth:window.innerWidth,viewportHeight:window.innerHeight}})})}window.addEventListener("mousemove",D,!0),window.addEventListener("click",E,!0),window.addEventListener("keydown",S,!0)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ve):ve();})();
