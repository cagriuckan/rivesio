"use strict";(()=>{var ie=`
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
`;async function le(a){let o;try{o=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser",frameRate:1},audio:!1,preferCurrentTab:!0,selfBrowserSurface:"include"})}catch(t){return null}let[l]=o.getVideoTracks();a&&(a.style.visibility="hidden");let i=document.createElement("video");i.muted=!0,i.playsInline=!0,i.srcObject=o,await new Promise(t=>{i.onloadedmetadata=()=>t()}),await i.play(),await new Promise(t=>requestAnimationFrame(()=>requestAnimationFrame(()=>t())));let{videoWidth:c,videoHeight:h}=i,v=document.createElement("canvas");return v.width=c,v.height=h,v.getContext("2d").drawImage(i,0,0,c,h),i.pause(),i.srcObject=null,l.stop(),a&&(a.style.visibility=""),{bitmap:await createImageBitmap(v),scaleX:c/window.innerWidth,scaleY:h/window.innerHeight}}function se(a,o,l,i,c,h){a.beginPath(),a.moveTo(o+h,l),a.arcTo(o+i,l,o+i,l+c,h),a.arcTo(o+i,l+c,o,l+c,h),a.arcTo(o,l+c,o,l,h),a.arcTo(o,l,o+i,l,h),a.closePath()}async function ce(a){let o=await le(a);if(!o)return null;let{bitmap:l}=o,i=document.createElement("canvas");return i.width=l.width,i.height=l.height,i.getContext("2d").drawImage(l,0,0),l.close(),new Promise(c=>i.toBlob(c,"image/png"))}async function de(a){let o=await le(a);return o?ve(o):null}function ve({bitmap:a,scaleX:o,scaleY:l}){return new Promise(i=>{let c=window.innerWidth,h=window.innerHeight,v=Math.min(window.devicePixelRatio||1,2),d=document.createElement("canvas");d.width=c*v,d.height=h*v,Object.assign(d.style,{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",zIndex:"2147483646",cursor:"crosshair",userSelect:"none"}),document.body.appendChild(d);let t=d.getContext("2d");t.scale(v,v);function T(){t.drawImage(a,0,0,a.width,a.height,0,0,c,h),t.fillStyle="rgba(0,0,0,0.38)",t.fillRect(0,0,c,h)}function w(){let s="S\xFCr\xFCkle: alan se\xE7   \u2022   B\u0131rak: onayla   \u2022   Esc: iptal";t.font="13px -apple-system, system-ui, sans-serif";let m=t.measureText(s).width+24,u=36,k=(c-m)/2,y=h-u-20;t.fillStyle="rgba(15,23,42,0.72)",se(t,k,y,m,u,10),t.fill(),t.fillStyle="#f1f5f9",t.textAlign="center",t.textBaseline="middle",t.fillText(s,c/2,y+u/2),t.textAlign="left",t.textBaseline="alphabetic"}function N(s,p,m,u){t.save(),t.beginPath(),t.rect(s,p,m,u),t.clip(),t.drawImage(a,0,0,a.width,a.height,0,0,c,h),t.restore(),t.strokeStyle="#6366f1",t.lineWidth=2,t.setLineDash([6,3]),t.strokeRect(s+1,p+1,m-2,u-2),t.setLineDash([]);let k=7;t.fillStyle="#6366f1",[[s,p],[s+m-k,p],[s,p+u-k],[s+m-k,p+u-k]].forEach(([H,W])=>t.fillRect(H,W,k,k)),t.font="bold 12px -apple-system, system-ui, sans-serif";let y=`${Math.round(m)} \xD7 ${Math.round(u)}`,E=t.measureText(y).width+14,M=22,C=Math.min(s,c-E-4),I=p>M+8?p-M-4:p+u+4;t.fillStyle="#6366f1",se(t,C,I,E,M,5),t.fill(),t.fillStyle="#fff",t.textBaseline="middle",t.fillText(y,C+7,I+M/2),t.textBaseline="alphabetic"}let F=0,j=0,f=!1;function D(s,p){if(T(),w(),s===void 0||p===void 0)return;let m=Math.min(F,s),u=Math.min(j,p),k=Math.abs(s-F),y=Math.abs(p-j);k>1&&y>1&&N(m,u,k,y)}D(),d.addEventListener("mousedown",s=>{s.preventDefault(),F=s.clientX,j=s.clientY,f=!0}),d.addEventListener("mousemove",s=>{f&&D(s.clientX,s.clientY)}),d.addEventListener("mouseup",s=>{if(!f)return;f=!1;let p=Math.min(F,s.clientX),m=Math.min(j,s.clientY),u=Math.abs(s.clientX-F),k=Math.abs(s.clientY-j);if(O(),u<10||k<10){a.close(),i(null);return}P(p,m,u,k)});function Y(s){s.key==="Escape"&&(O(),a.close(),i(null))}window.addEventListener("keydown",Y,!0);function O(){d.remove(),window.removeEventListener("keydown",Y,!0)}function P(s,p,m,u){let k=Math.round(s*o),y=Math.round(p*l),E=Math.round(m*o),M=Math.round(u*l),C=document.createElement("canvas");C.width=E,C.height=M,C.getContext("2d").drawImage(a,k,y,E,M,0,0,E,M),a.close(),C.toBlob(I=>i(I),"image/png")}})}var ye={tr:{fabLabel:"Geri bildirim",title:"Geri bildirim",categoryLabel:"Kategori",messageLabel:"A\xE7\u0131klama",messagePlaceholder:"Ne eklensin ya da nerede bir sorun var?",submitLabel:"G\xF6nder",successMessage:"Te\u015Fekk\xFCrler! Geri bildirimin al\u0131nd\u0131.",errorMessage:"G\xF6nderilemedi. L\xFCtfen tekrar dene."},en:{fabLabel:"Feedback",title:"Feedback",categoryLabel:"Category",messageLabel:"Description",messagePlaceholder:"What should be added, or where is the problem?",submitLabel:"Send",successMessage:"Thanks! Your feedback was received.",errorMessage:"Couldn't send. Please try again."}};function we(){return(document.documentElement.lang||"").toLowerCase().startsWith("en")?"en":"tr"}var V=4;function B(a){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${a}</svg>`}var g={chat:B('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),history:B('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),copy:B('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),camera:B('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),crop:B('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),upload:B('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),close:B('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),check:B('<polyline points="20 6 9 17 4 12"/>'),alert:B('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),x:B('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')};async function fe(){var v,d;let a=window.__KF_CONFIG__;if(!a)return;let o=(v=window.RevistoFeedback)!=null?v:{},l=o.domain||location.host,i=o.theme||"",c;try{c=await(await fetch(`${a.base}/api/v1/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:a.widgetKey,domain:l,theme:i,meta:{themeVersion:o.themeVersion,user:o.user,href:location.href}})})).json()}catch(t){return}if(!c.enabled)return;let h={...a.project,...(d=c.project)!=null?d:{}};Le(a,o,h,{domain:l,theme:i})}function Le(a,o,l,i){var ne,re,oe;let c=document.createElement("div");c.id="revisto-widget",document.body.appendChild(c);let h=c.attachShadow({mode:"open"}),v=document.createElement("style");v.textContent=ie,h.appendChild(v);let d=document.createElement("div");d.className="kf-root",d.dataset.pos=l.position||"bottom-right",d.style.setProperty("--kf-accent",l.accentColor||"#6366f1"),document.documentElement.getAttribute("data-theme")==="light"&&(d.dataset.theme="light");let T=we(),w={...ye[T],...(ne=l.text)==null?void 0:ne[T]},N=(re=l.fields)!=null?re:[],F=((oe=l.categories)!=null?oe:["\xD6neri"]).map(e=>`<option value="${r(e)}">${r(e)}</option>`).join(""),j=N.map(e=>{var x;let n=e.required?"required":"",b=e.placeholder?`placeholder="${r(e.placeholder)}"`:"",L=`<label class="kf-label">${r(e.label)}${e.required?" *":""}</label>`,S="";if(e.type==="textarea")S=`<textarea class="kf-textarea kf-cf" data-cf="${r(e.id)}" data-cf-label="${r(e.label)}" ${b} ${n}></textarea>`;else if(e.type==="select"){let z=((x=e.options)!=null?x:[]).map(q=>`<option value="${r(q)}">${r(q)}</option>`).join("");S=`<select class="kf-select kf-cf" data-cf="${r(e.id)}" data-cf-label="${r(e.label)}" ${n}>${z}</select>`}else{if(e.type==="checkbox")return`<label class="kf-cf-check"><input type="checkbox" class="kf-cf" data-cf="${r(e.id)}" data-cf-label="${r(e.label)}" data-cf-type="checkbox" ${n}> ${r(e.label)}</label>`;S=`<input type="${e.type==="email"?"email":"text"}" class="kf-input kf-cf" data-cf="${r(e.id)}" data-cf-label="${r(e.label)}" ${b} ${n}>`}return`<div>${L}${S}</div>`}).join("");d.innerHTML=`
    <button class="kf-fab" type="button" aria-label="${r(w.fabLabel)}">
      ${g.chat}<span>${r(w.fabLabel)}</span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="${r(w.title)}">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${g.chat}</div>
          <span class="kf-title">${r(w.title)}</span>
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
          <label class="kf-label">${r(w.categoryLabel)}</label>
          <select class="kf-select" aria-label="${r(w.categoryLabel)}">${F}</select>
        </div>

        <div>
          <label class="kf-label">${r(w.messageLabel)}</label>
          <textarea class="kf-textarea" placeholder="${r(w.messagePlaceholder)}"></textarea>
        </div>

        ${j}

        <div class="kf-capture-row">
          <button class="kf-chip kf-capture-full" type="button">
            ${g.camera} T\xFCm ekran
          </button>
          <button class="kf-chip kf-capture-area" type="button">
            ${g.crop} Alan se\xE7
          </button>
          <button class="kf-chip kf-chip-upload kf-upload" type="button" aria-label="G\xF6rsel y\xFCkle">
            ${g.upload}
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
        <button class="kf-btn kf-btn-ghost kf-cancel" type="button">${r(T==="en"?"Cancel":"Vazge\xE7")}</button>
        <button class="kf-btn kf-btn-primary kf-submit" type="button">${r(w.submitLabel)}</button>
      </div>

    </div>
  `,h.appendChild(d);let f=e=>d.querySelector(e),D=f(".kf-fab"),Y=f(".kf-panel"),O=f(".kf-close-btn"),P=f(".kf-history-toggle"),s=f(".kf-cancel"),p=f(".kf-submit"),m=f(".kf-capture-full"),u=f(".kf-capture-area"),k=f(".kf-upload"),y=f(".kf-file"),E=f(".kf-textarea"),M=f(".kf-select"),C=f(".kf-thumbs"),I=f(".kf-counter"),H=f(".kf-msg"),W=f(".kf-view-form"),U=f(".kf-view-history"),X=f(".kf-history-list"),pe=f(".kf-history-empty"),J=f(".kf-foot"),A=[],Q=`kf_history_${a.widgetKey}`;function Z(){try{return JSON.parse(localStorage.getItem(Q)||"[]")}catch(e){return[]}}function ue(e){let n=Z();n.unshift(e),localStorage.setItem(Q,JSON.stringify(n.slice(0,50)))}function be(e){return new Date(e).toLocaleDateString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}function he(){let e=Z();X.innerHTML="",pe.hidden=e.length>0,e.forEach(n=>{let b=document.createElement("li");b.className="kf-history-item",b.innerHTML=`
        <div class="kf-hi-left">
          <span class="kf-hi-cat">${r(n.category)}</span>
          <span class="kf-hi-page">${r(n.page)}</span>
        </div>
        <div class="kf-hi-right">
          <span class="kf-hi-id" title="Kopyala">#${r(n.id.slice(0,8))}</span>
          <span class="kf-hi-date">${r(be(n.date))}</span>
        </div>`,b.querySelector(".kf-hi-id").addEventListener("click",()=>te(n.id)),X.appendChild(b)})}let K=!1;function ee(){K=!1,W.hidden=!1,U.hidden=!0,J.hidden=!1,P.title="Ge\xE7mi\u015F",P.innerHTML=g.history,$("",null)}function me(){K=!0,W.hidden=!0,U.hidden=!1,J.hidden=!0,P.title="Forma d\xF6n",P.innerHTML=g.close,he(),$("",null)}P.addEventListener("click",()=>K?ee():me());function te(e,n){var b;(b=navigator.clipboard)==null||b.writeText(e).catch(()=>{}),n&&(n.classList.add("copied"),n.innerHTML=g.check,setTimeout(()=>{n.classList.remove("copied"),n.innerHTML=g.copy},1800))}function $(e,n){if(!n){H.hidden=!0,H.innerHTML="";return}H.hidden=!1,H.className=`kf-msg kf-${n}`,H.innerHTML=`${n==="ok"?g.check:g.alert} ${r(e)}`}function R(){let e=A.length>=V;I.textContent=`${A.length} / ${V}`,m.disabled=e,u.disabled=e,k.disabled=e,C.innerHTML="",A.forEach((n,b)=>{let L=document.createElement("div");L.className="kf-thumb",L.innerHTML=`<img src="${n.url}" alt="ek"><button class="kf-thumb-del" type="button" aria-label="Kald\u0131r">${g.x}</button>`,L.querySelector("button").addEventListener("click",()=>{URL.revokeObjectURL(n.url),A.splice(b,1),R()}),C.appendChild(L)})}function G(e,n){A.length>=V||(A.push({blob:e,kind:n,url:URL.createObjectURL(e)}),R())}function ge(){d.dataset.open="1",K||setTimeout(()=>E.focus(),60)}function _(){d.dataset.open="0",ee()}function ae(){d.dataset.open==="1"?_():ge()}D.addEventListener("click",ae),O.addEventListener("click",_),s.addEventListener("click",_),k.addEventListener("click",()=>y.click()),y.addEventListener("change",()=>{var e;Array.from((e=y.files)!=null?e:[]).filter(n=>n.type.startsWith("image/")).forEach(n=>G(n,"upload")),y.value=""}),m.addEventListener("click",async()=>{m.disabled=!0,m.innerHTML=`${g.camera} Bekleniyor\u2026`;try{let e=await ce(c);e?G(e,"screenshot"):$("Ekran payla\u015F\u0131m\u0131 iptal edildi.","err")}catch(e){$("Ekran yakalanamad\u0131.","err")}finally{m.innerHTML=`${g.camera} T\xFCm ekran`,R()}}),u.addEventListener("click",async()=>{u.disabled=!0,u.innerHTML=`${g.crop} Bekleniyor\u2026`;try{let e=await de(c);e?G(e,"screenshot"):$("Alan se\xE7imi iptal edildi.","err")}catch(e){$("Ekran yakalanamad\u0131.","err")}finally{u.innerHTML=`${g.crop} Alan se\xE7`,R()}});function ke(){let e=d.querySelectorAll(".kf-cf"),n=[];for(let b of Array.from(e)){let L=b.dataset.cfLabel||"",x=b.dataset.cfType==="checkbox"?b.checked?T==="en"?"Yes":"Evet":"":b.value.trim();if(b.hasAttribute("required")&&!x)return b.focus(),{ok:!1,values:[]};x&&n.push({label:L,value:x})}return{ok:!0,values:n}}async function xe(){let e=E.value.trim();if(!e){$(T==="en"?"Please write a description.":"L\xFCtfen bir a\xE7\u0131klama yaz.","err"),E.focus();return}let n=ke();if(!n.ok){$(T==="en"?"Please fill required fields.":"L\xFCtfen zorunlu alanlar\u0131 doldur.","err");return}p.disabled=!0,p.textContent=T==="en"?"Sending\u2026":"G\xF6nderiliyor\u2026",$("",null);try{let b=await fetch(`${a.base}/api/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:a.widgetKey,domain:i.domain,theme:i.theme,category:M.value,message:e,page_url:location.href,viewport:`${window.innerWidth}x${window.innerHeight}`,wp_user:o.user,custom_fields:n.values,meta:{themeVersion:o.themeVersion}})}),L=await b.json();if(!b.ok||!L.ok){$(w.errorMessage,"err");return}for(let x of A){let z=new FormData;z.append("widget_key",a.widgetKey),z.append("domain",i.domain),i.theme&&z.append("theme",i.theme),z.append("kind",x.kind);let q=x.blob.type==="image/png"?"png":"jpg";z.append("file",x.blob,`${x.kind}.${q}`),await fetch(`${a.base}/api/v1/feedback/${L.feedback_id}/attachment`,{method:"POST",body:z}).catch(()=>{})}let S=L.feedback_id;ue({id:S,category:M.value,page:location.pathname,date:Date.now()}),H.hidden=!1,H.className="kf-msg kf-ok",H.innerHTML=`
        ${g.check} ${r(w.successMessage)}
        <div class="kf-ref-box">
          <span class="kf-ref-label">${r(T==="en"?"Reference":"Referans no")}</span>
          <span class="kf-ref-id" title="${r(S)}">#${r(S.slice(0,8))}</span>
          <button class="kf-ref-copy" type="button" aria-label="Kopyala">${g.copy}</button>
        </div>`,H.querySelector(".kf-ref-copy").addEventListener("click",x=>te(S,x.currentTarget)),E.value="",d.querySelectorAll(".kf-cf").forEach(x=>{x.dataset.cfType==="checkbox"?x.checked=!1:x.value=""}),A.splice(0).forEach(x=>URL.revokeObjectURL(x.url)),R(),setTimeout(_,4e3)}catch(b){$(T==="en"?"Connection error. Please try again.":"Ba\u011Flant\u0131 hatas\u0131. L\xFCtfen tekrar dene.","err")}finally{p.disabled=!1,p.textContent=w.submitLabel}}p.addEventListener("click",xe),window.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="/"&&(e.preventDefault(),ae()),e.key==="Escape"&&d.dataset.open==="1"&&_()}),R()}function r(a){return a.replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",fe):fe();})();
