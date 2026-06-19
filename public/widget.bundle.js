"use strict";(()=>{var Z=`
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
`;async function te(t){let a;try{a=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser",frameRate:1},audio:!1,preferCurrentTab:!0,selfBrowserSurface:"include"})}catch(e){return null}let[l]=a.getVideoTracks();t&&(t.style.visibility="hidden");let r=document.createElement("video");r.muted=!0,r.playsInline=!0,r.srcObject=a,await new Promise(e=>{r.onloadedmetadata=()=>e()}),await r.play(),await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(()=>e())));let{videoWidth:s,videoHeight:f}=r,k=document.createElement("canvas");return k.width=s,k.height=f,k.getContext("2d").drawImage(r,0,0,s,f),r.pause(),r.srcObject=null,l.stop(),t&&(t.style.visibility=""),{bitmap:await createImageBitmap(k),scaleX:s/window.innerWidth,scaleY:f/window.innerHeight}}function ee(t,a,l,r,s,f){t.beginPath(),t.moveTo(a+f,l),t.arcTo(a+r,l,a+r,l+s,f),t.arcTo(a+r,l+s,a,l+s,f),t.arcTo(a,l+s,a,l,f),t.arcTo(a,l,a+r,l,f),t.closePath()}async function ne(t){let a=await te(t);if(!a)return null;let{bitmap:l}=a,r=document.createElement("canvas");return r.width=l.width,r.height=l.height,r.getContext("2d").drawImage(l,0,0),l.close(),new Promise(s=>r.toBlob(s,"image/png"))}async function ae(t){let a=await te(t);return a?pe(a):null}function pe({bitmap:t,scaleX:a,scaleY:l}){return new Promise(r=>{let s=window.innerWidth,f=window.innerHeight,k=Math.min(window.devicePixelRatio||1,2),d=document.createElement("canvas");d.width=s*k,d.height=f*k,Object.assign(d.style,{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",zIndex:"2147483646",cursor:"crosshair",userSelect:"none"}),document.body.appendChild(d);let e=d.getContext("2d");e.scale(k,k);function D(){e.drawImage(t,0,0,t.width,t.height,0,0,s,f),e.fillStyle="rgba(0,0,0,0.38)",e.fillRect(0,0,s,f)}function p(){let i="S\xFCr\xFCkle: alan se\xE7   \u2022   B\u0131rak: onayla   \u2022   Esc: iptal";e.font="13px -apple-system, system-ui, sans-serif";let h=e.measureText(i).width+24,u=36,m=(s-h)/2,v=f-u-20;e.fillStyle="rgba(15,23,42,0.72)",ee(e,m,v,h,u,10),e.fill(),e.fillStyle="#f1f5f9",e.textAlign="center",e.textBaseline="middle",e.fillText(i,s/2,v+u/2),e.textAlign="left",e.textBaseline="alphabetic"}function G(i,c,h,u){e.save(),e.beginPath(),e.rect(i,c,h,u),e.clip(),e.drawImage(t,0,0,t.width,t.height,0,0,s,f),e.restore(),e.strokeStyle="#6366f1",e.lineWidth=2,e.setLineDash([6,3]),e.strokeRect(i+1,c+1,h-2,u-2),e.setLineDash([]);let m=7;e.fillStyle="#6366f1",[[i,c],[i+h-m,c],[i,c+u-m],[i+h-m,c+u-m]].forEach(([N,P])=>e.fillRect(N,P,m,m)),e.font="bold 12px -apple-system, system-ui, sans-serif";let v=`${Math.round(h)} \xD7 ${Math.round(u)}`,g=e.measureText(v).width+14,y=22,T=Math.min(i,s-g-4),A=c>y+8?c-y-4:c+u+4;e.fillStyle="#6366f1",ee(e,T,A,g,y,5),e.fill(),e.fillStyle="#fff",e.textBaseline="middle",e.fillText(v,T+7,A+y/2),e.textBaseline="alphabetic"}let I=0,z=0,w=!1;function O(i,c){if(D(),p(),i===void 0||c===void 0)return;let h=Math.min(I,i),u=Math.min(z,c),m=Math.abs(i-I),v=Math.abs(c-z);m>1&&v>1&&G(h,u,m,v)}O(),d.addEventListener("mousedown",i=>{i.preventDefault(),I=i.clientX,z=i.clientY,w=!0}),d.addEventListener("mousemove",i=>{w&&O(i.clientX,i.clientY)}),d.addEventListener("mouseup",i=>{if(!w)return;w=!1;let c=Math.min(I,i.clientX),h=Math.min(z,i.clientY),u=Math.abs(i.clientX-I),m=Math.abs(i.clientY-z);if(H(),u<10||m<10){t.close(),r(null);return}j(c,h,u,m)});function M(i){i.key==="Escape"&&(H(),t.close(),r(null))}window.addEventListener("keydown",M,!0);function H(){d.remove(),window.removeEventListener("keydown",M,!0)}function j(i,c,h,u){let m=Math.round(i*a),v=Math.round(c*l),g=Math.round(h*a),y=Math.round(u*l),T=document.createElement("canvas");T.width=g,T.height=y,T.getContext("2d").drawImage(t,m,v,g,y,0,0,g,y),t.close(),T.toBlob(A=>r(A),"image/png")}})}var V=4;function E(t){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}var b={chat:E('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),history:E('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),copy:E('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),camera:E('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),crop:E('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),upload:E('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),close:E('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),check:E('<polyline points="20 6 9 17 4 12"/>'),alert:E('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),x:E('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')};async function re(){var d,e;let t=window.__KF_CONFIG__;if(!t)return;let a=(d=window.KanewsFeedback)!=null?d:{},l=a.domain||location.host,r=a.license||"",s=a.theme||"",f;try{f=await(await fetch(`${t.base}/api/v1/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:l,license_key:r,theme:s,meta:{themeVersion:a.themeVersion,user:a.user,href:location.href}})})).json()}catch(D){return}if(!f.enabled)return;let k={...t.project,...(e=f.project)!=null?e:{}};ue(t,a,k,{domain:l,license:r,theme:s})}function ue(t,a,l,r){var Q;let s=document.createElement("div");s.id="kanews-feedback-widget",document.body.appendChild(s);let f=s.attachShadow({mode:"open"}),k=document.createElement("style");k.textContent=Z,f.appendChild(k);let d=document.createElement("div");d.className="kf-root",d.dataset.pos=l.position||"bottom-right",d.style.setProperty("--kf-accent",l.accentColor||"#6366f1"),document.documentElement.getAttribute("data-theme")==="light"&&(d.dataset.theme="light");let D=((Q=l.categories)!=null?Q:["\xD6neri"]).map(n=>`<option value="${B(n)}">${B(n)}</option>`).join("");d.innerHTML=`
    <button class="kf-fab" type="button" aria-label="Geri bildirim">
      ${b.chat}<span>Geri bildirim</span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="Geri bildirim formu">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${b.chat}</div>
          <span class="kf-title">Geri bildirim</span>
        </div>
        <div class="kf-head-actions">
          <button class="kf-icon-btn kf-history-toggle" type="button" aria-label="Ge\xE7mi\u015F">${b.history}</button>
          <button class="kf-icon-btn kf-close-btn" type="button" aria-label="Kapat">${b.close}</button>
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
          <label class="kf-label">Kategori</label>
          <select class="kf-select" aria-label="Kategori">${D}</select>
        </div>

        <div>
          <label class="kf-label">A\xE7\u0131klama</label>
          <textarea class="kf-textarea" placeholder="Ne eklensin ya da nerede bir sorun var?"></textarea>
        </div>

        <div class="kf-capture-row">
          <button class="kf-chip kf-capture-full" type="button">
            ${b.camera} T\xFCm ekran
          </button>
          <button class="kf-chip kf-capture-area" type="button">
            ${b.crop} Alan se\xE7
          </button>
          <button class="kf-chip kf-chip-upload kf-upload" type="button" aria-label="G\xF6rsel y\xFCkle">
            ${b.upload}
          </button>
        </div>

        <div class="kf-attach-row">
          <span class="kf-counter">0 / ${V}</span>
        </div>

        <div class="kf-thumbs"></div>
        <input class="kf-file" type="file" accept="image/*" multiple hidden />

        <div class="kf-hint">\u0130pucu: <kbd>\u2318 / Ctrl + /</kbd> ile her yerden a\xE7</div>
      </div>

      </div> <!-- /kf-view-form -->

      <div class="kf-foot">
        <button class="kf-btn kf-btn-ghost kf-cancel" type="button">Vazge\xE7</button>
        <button class="kf-btn kf-btn-primary kf-submit" type="button">G\xF6nder</button>
      </div>

    </div>
  `,f.appendChild(d);let p=n=>d.querySelector(n),G=p(".kf-fab"),I=p(".kf-panel"),z=p(".kf-close-btn"),w=p(".kf-history-toggle"),O=p(".kf-cancel"),M=p(".kf-submit"),H=p(".kf-capture-full"),j=p(".kf-capture-area"),i=p(".kf-upload"),c=p(".kf-file"),h=p(".kf-textarea"),u=p(".kf-select"),m=p(".kf-thumbs"),v=p(".kf-counter"),g=p(".kf-msg"),y=p(".kf-view-form"),T=p(".kf-view-history"),A=p(".kf-history-list"),N=p(".kf-history-empty"),P=p(".kf-foot"),S=[],U=`kf_history_${t.widgetKey}`;function W(){try{return JSON.parse(localStorage.getItem(U)||"[]")}catch(n){return[]}}function ie(n){let o=W();o.unshift(n),localStorage.setItem(U,JSON.stringify(o.slice(0,50)))}function oe(n){return new Date(n).toLocaleDateString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}function se(){let n=W();A.innerHTML="",N.hidden=n.length>0,n.forEach(o=>{let x=document.createElement("li");x.className="kf-history-item",x.innerHTML=`
        <div class="kf-hi-left">
          <span class="kf-hi-cat">${B(o.category)}</span>
          <span class="kf-hi-page">${B(o.page)}</span>
        </div>
        <div class="kf-hi-right">
          <span class="kf-hi-id" title="Kopyala">#${B(o.id.slice(0,8))}</span>
          <span class="kf-hi-date">${B(oe(o.date))}</span>
        </div>`,x.querySelector(".kf-hi-id").addEventListener("click",()=>X(o.id)),A.appendChild(x)})}let R=!1;function q(){R=!1,y.hidden=!1,T.hidden=!0,P.hidden=!1,w.title="Ge\xE7mi\u015F",w.innerHTML=b.history,L("",null)}function le(){R=!0,y.hidden=!0,T.hidden=!1,P.hidden=!0,w.title="Forma d\xF6n",w.innerHTML=b.close,se(),L("",null)}w.addEventListener("click",()=>R?q():le());function X(n,o){var x;(x=navigator.clipboard)==null||x.writeText(n).catch(()=>{}),o&&(o.classList.add("copied"),o.innerHTML=b.check,setTimeout(()=>{o.classList.remove("copied"),o.innerHTML=b.copy},1800))}function L(n,o){if(!o){g.hidden=!0,g.innerHTML="";return}g.hidden=!1,g.className=`kf-msg kf-${o}`,g.innerHTML=`${o==="ok"?b.check:b.alert} ${B(n)}`}function F(){let n=S.length>=V;v.textContent=`${S.length} / ${V}`,H.disabled=n,j.disabled=n,i.disabled=n,m.innerHTML="",S.forEach((o,x)=>{let C=document.createElement("div");C.className="kf-thumb",C.innerHTML=`<img src="${o.url}" alt="ek"><button class="kf-thumb-del" type="button" aria-label="Kald\u0131r">${b.x}</button>`,C.querySelector("button").addEventListener("click",()=>{URL.revokeObjectURL(o.url),S.splice(x,1),F()}),m.appendChild(C)})}function Y(n,o){S.length>=V||(S.push({blob:n,kind:o,url:URL.createObjectURL(n)}),F())}function de(){d.dataset.open="1",R||setTimeout(()=>h.focus(),60)}function K(){d.dataset.open="0",q()}function J(){d.dataset.open==="1"?K():de()}G.addEventListener("click",J),z.addEventListener("click",K),O.addEventListener("click",K),i.addEventListener("click",()=>c.click()),c.addEventListener("change",()=>{var n;Array.from((n=c.files)!=null?n:[]).filter(o=>o.type.startsWith("image/")).forEach(o=>Y(o,"upload")),c.value=""}),H.addEventListener("click",async()=>{H.disabled=!0,H.innerHTML=`${b.camera} Bekleniyor\u2026`;try{let n=await ne(s);n?Y(n,"screenshot"):L("Ekran payla\u015F\u0131m\u0131 iptal edildi.","err")}catch(n){L("Ekran yakalanamad\u0131.","err")}finally{H.innerHTML=`${b.camera} T\xFCm ekran`,F()}}),j.addEventListener("click",async()=>{j.disabled=!0,j.innerHTML=`${b.crop} Bekleniyor\u2026`;try{let n=await ae(s);n?Y(n,"screenshot"):L("Alan se\xE7imi iptal edildi.","err")}catch(n){L("Ekran yakalanamad\u0131.","err")}finally{j.innerHTML=`${b.crop} Alan se\xE7`,F()}});async function ce(){let n=h.value.trim();if(!n){L("L\xFCtfen bir a\xE7\u0131klama yaz.","err"),h.focus();return}M.disabled=!0,M.textContent="G\xF6nderiliyor\u2026",L("",null);try{let o=await fetch(`${t.base}/api/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:r.domain,license_key:r.license,theme:r.theme,category:u.value,message:n,page_url:location.href,viewport:`${window.innerWidth}x${window.innerHeight}`,wp_user:a.user,meta:{themeVersion:a.themeVersion}})}),x=await o.json();if(!o.ok||!x.ok){L("G\xF6nderilemedi. L\xFCtfen tekrar dene.","err");return}for(let $ of S){let _=new FormData;_.append("widget_key",t.widgetKey),_.append("domain",r.domain),_.append("license_key",r.license),r.theme&&_.append("theme",r.theme),_.append("kind",$.kind);let fe=$.blob.type==="image/png"?"png":"jpg";_.append("file",$.blob,`${$.kind}.${fe}`),await fetch(`${t.base}/api/v1/feedback/${x.feedback_id}/attachment`,{method:"POST",body:_}).catch(()=>{})}let C=x.feedback_id;ie({id:C,category:u.value,page:location.pathname,date:Date.now()}),g.hidden=!1,g.className="kf-msg kf-ok",g.innerHTML=`
        ${b.check} Te\u015Fekk\xFCrler! Geri bildirimin al\u0131nd\u0131.
        <div class="kf-ref-box">
          <span class="kf-ref-label">Referans no</span>
          <span class="kf-ref-id">#${B(C)}</span>
          <button class="kf-ref-copy" type="button" aria-label="Kopyala">${b.copy}</button>
        </div>`,g.querySelector(".kf-ref-copy").addEventListener("click",$=>X(C,$.currentTarget)),h.value="",S.splice(0).forEach($=>URL.revokeObjectURL($.url)),F(),setTimeout(K,4e3)}catch(o){L("Ba\u011Flant\u0131 hatas\u0131. L\xFCtfen tekrar dene.","err")}finally{M.disabled=!1,M.textContent="G\xF6nder"}}M.addEventListener("click",ce),window.addEventListener("keydown",n=>{(n.metaKey||n.ctrlKey)&&n.key==="/"&&(n.preventDefault(),J()),n.key==="Escape"&&d.dataset.open==="1"&&K()}),F()}function B(t){return t.replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[a])}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",re):re();})();
