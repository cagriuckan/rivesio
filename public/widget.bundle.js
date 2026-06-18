"use strict";(()=>{var Q=`
:host { all: initial; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.kf-root {
  font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  position: fixed;
  z-index: 2147483000;
  bottom: 24px;
}
.kf-root[data-pos="bottom-right"] { right: 24px; }
.kf-root[data-pos="bottom-left"] { left: 24px; }

/* \u2500\u2500 FAB \u2500\u2500 */
.kf-fab {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  border: none;
  cursor: pointer;
  background: var(--kf-accent, #4f46e5);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  padding: 11px 18px;
  border-radius: 100px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,.12), 0 12px 20px -4px rgba(0,0,0,.15);
  transition: transform .15s ease, box-shadow .15s ease;
  outline: none;
  font-family: inherit;
}
.kf-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px -2px rgba(0,0,0,.15), 0 18px 28px -6px rgba(0,0,0,.18);
}
.kf-fab:focus-visible { box-shadow: 0 0 0 3px rgba(99,102,241,.45); }
.kf-fab svg { width: 16px; height: 16px; flex-shrink: 0; }

/* \u2500\u2500 Panel \u2500\u2500 */
.kf-panel {
  position: absolute;
  bottom: calc(100% + 10px);
  width: 380px;
  max-width: calc(100vw - 32px);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 0 0 1px rgba(0,0,0,.06), 0 8px 16px -4px rgba(0,0,0,.1), 0 24px 48px -8px rgba(0,0,0,.2);
  overflow: hidden;
  opacity: 0;
  transform: translateY(10px) scale(.97);
  pointer-events: none;
  transition: opacity .2s cubic-bezier(.16,1,.3,1), transform .2s cubic-bezier(.16,1,.3,1);
}
.kf-root[data-pos="bottom-right"] .kf-panel { right: 0; }
.kf-root[data-pos="bottom-left"] .kf-panel { left: 0; }
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
  padding: 13px 14px;
  border-bottom: 1px solid #f1f5f9;
}
.kf-title-wrap { display: flex; align-items: center; gap: 9px; }
.kf-title-icon {
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  background: var(--kf-accent, #4f46e5);
  display: flex; align-items: center; justify-content: center; color: #fff;
}
.kf-title-icon svg { width: 14px; height: 14px; }
.kf-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.kf-close {
  width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: none; border: none; cursor: pointer; color: #94a3b8;
  transition: background .12s, color .12s;
}
.kf-close:hover { background: #f1f5f9; color: #475569; }
.kf-close svg { width: 15px; height: 15px; }

/* \u2500\u2500 Message bar \u2500\u2500 */
.kf-msg {
  font-size: 12.5px; font-weight: 500;
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-bottom: 1px solid transparent;
}
.kf-msg[hidden] { display: none; }
.kf-msg.kf-ok  { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.kf-msg.kf-err { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }
.kf-msg svg { width: 14px; height: 14px; flex-shrink: 0; }

/* \u2500\u2500 Body \u2500\u2500 */
.kf-body { padding: 14px; display: flex; flex-direction: column; gap: 10px; }

.kf-field-label {
  display: block;
  font-size: 11px; font-weight: 700; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 5px;
}

/* Select */
.kf-select {
  width: 100%; padding: 9px 32px 9px 11px; font-size: 13.5px; color: #0f172a;
  border: 1.5px solid #e2e8f0; border-radius: 10px; background: #f8fafc;
  cursor: pointer; outline: none; font-family: inherit;
  transition: border-color .12s, box-shadow .12s, background .12s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2394a3b8' stroke-width='2' viewBox='0 0 24 24'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 9px center;
}
.kf-select:focus {
  border-color: var(--kf-accent, #4f46e5);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--kf-accent, #4f46e5) 15%, transparent);
  background-color: #fff;
}

/* Textarea */
.kf-textarea {
  width: 100%; min-height: 86px; resize: none; padding: 10px 12px;
  font-size: 13.5px; font-family: inherit;
  border: 1.5px solid #e2e8f0; border-radius: 10px; color: #0f172a;
  line-height: 1.55; background: #f8fafc; outline: none;
  transition: border-color .12s, box-shadow .12s, background .12s;
}
.kf-textarea:focus {
  border-color: var(--kf-accent, #4f46e5);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--kf-accent, #4f46e5) 15%, transparent);
  background-color: #fff;
}
.kf-textarea::placeholder { color: #c8d1dc; }

/* \u2500\u2500 Capture row \u2500\u2500 */
.kf-capture-row { display: flex; gap: 6px; }
.kf-chip {
  flex: 1;
  display: inline-flex; align-items: center; justify-content: center; gap: 5px;
  font-size: 12px; font-weight: 600; color: #475569; white-space: nowrap;
  background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px;
  padding: 8px 10px; cursor: pointer; outline: none; font-family: inherit;
  transition: background .12s, border-color .12s, color .12s, box-shadow .12s;
}
.kf-chip:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; color: #1e293b; }
.kf-chip:focus-visible { box-shadow: 0 0 0 3px rgba(99,102,241,.2); }
.kf-chip:disabled { opacity: .4; cursor: not-allowed; }
.kf-chip svg { width: 13px; height: 13px; flex-shrink: 0; }
.kf-chip-upload { flex: none; padding: 8px 11px; }

/* \u2500\u2500 Attach counter \u2500\u2500 */
.kf-attach-row {
  display: flex; align-items: center; gap: 6px;
}
.kf-counter {
  font-size: 11px; font-weight: 700; color: #94a3b8;
  background: #f1f5f9; padding: 2px 8px; border-radius: 100px;
}

/* \u2500\u2500 Thumbnails \u2500\u2500 */
.kf-thumbs { display: flex; flex-wrap: wrap; gap: 6px; }
.kf-thumb {
  position: relative; width: 58px; height: 58px;
  border-radius: 9px; overflow: hidden;
  border: 1.5px solid #e2e8f0; background: #f8fafc;
}
.kf-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.kf-thumb-del {
  position: absolute; top: 3px; right: 3px;
  width: 17px; height: 17px; border-radius: 50%;
  border: none; background: rgba(15,23,42,.7); color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; padding: 0; line-height: 1;
  transition: background .1s;
}
.kf-thumb-del:hover { background: rgba(15,23,42,.9); }
.kf-thumb-del svg { width: 9px; height: 9px; }

/* \u2500\u2500 Hint \u2500\u2500 */
.kf-hint { font-size: 11.5px; color: #94a3b8; text-align: center; }
.kf-hint kbd {
  display: inline-block;
  background: #f1f5f9; border: 1px solid #e2e8f0; border-bottom-width: 2px;
  border-radius: 5px; padding: 0 5px; font-size: 10.5px; color: #64748b;
  font-family: inherit;
}

/* \u2500\u2500 History view \u2500\u2500 */
.kf-view-form,
.kf-view-history { display: flex; flex-direction: column; }
.kf-view-history { padding: 8px 0 4px; }

.kf-history-empty {
  padding: 32px 16px; text-align: center;
  color: #94a3b8; font-size: 13px;
}
.kf-history-list { list-style: none; margin: 0; padding: 0 0 4px; }
.kf-history-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 16px; border-bottom: 1px solid #f1f5f9;
  cursor: default;
}
.kf-history-item:last-child { border-bottom: none; }
.kf-hi-left { flex: 1; min-width: 0; }
.kf-hi-cat {
  font-size: 12px; font-weight: 700; color: #334155;
  display: block; margin-bottom: 2px;
}
.kf-hi-page {
  font-size: 11px; color: #94a3b8;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  max-width: 200px; display: block;
}
.kf-hi-right { text-align: right; flex-shrink: 0; }
.kf-hi-id {
  font-size: 11px; font-weight: 700; color: #6366f1;
  font-family: "SF Mono", "Fira Code", monospace;
  background: #eef2ff; border-radius: 5px;
  padding: 2px 6px; display: inline-block; margin-bottom: 2px;
  cursor: pointer; transition: background .1s;
}
.kf-hi-id:hover { background: #e0e7ff; }
.kf-hi-date { font-size: 11px; color: #94a3b8; display: block; }

/* Success ID display */
.kf-ref-box {
  display: flex; align-items: center; gap: 6px;
  background: #eef2ff; border-radius: 8px; padding: 6px 10px;
  margin-top: 6px;
}
.kf-ref-label { font-size: 11px; color: #6366f1; font-weight: 600; flex-shrink: 0; }
.kf-ref-id {
  font-size: 12px; font-weight: 700; color: #4338ca;
  font-family: "SF Mono", "Fira Code", monospace;
  flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.kf-ref-copy {
  background: none; border: none; cursor: pointer; padding: 2px;
  color: #818cf8; display: flex; align-items: center; flex-shrink: 0;
  border-radius: 4px; transition: color .1s, background .1s;
}
.kf-ref-copy:hover { color: #4338ca; background: #c7d2fe; }
.kf-ref-copy svg { width: 13px; height: 13px; }
.kf-ref-copy.copied { color: #059669; }

/* \u2500\u2500 Footer \u2500\u2500 */
.kf-foot {
  display: flex; justify-content: flex-end; gap: 7px;
  padding: 11px 14px; border-top: 1px solid #f1f5f9; background: #fafbfe;
}
.kf-btn {
  font-size: 13px; font-weight: 600; border-radius: 10px;
  padding: 8px 16px; cursor: pointer; border: 1.5px solid transparent;
  font-family: inherit; outline: none;
  transition: background .12s, box-shadow .12s, filter .12s;
}
.kf-btn:focus-visible { box-shadow: 0 0 0 3px rgba(99,102,241,.25); }
.kf-btn:disabled { opacity: .5; cursor: not-allowed; }
.kf-btn-ghost { background: transparent; color: #64748b; border-color: #e2e8f0; }
.kf-btn-ghost:hover:not(:disabled) { background: #f1f5f9; color: #334155; }
.kf-btn-primary {
  background: var(--kf-accent, #4f46e5); color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,.12);
}
.kf-btn-primary:hover:not(:disabled) { filter: brightness(.92); }
`;async function ee(t){let o;try{o=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser",frameRate:1},audio:!1,preferCurrentTab:!0,selfBrowserSurface:"include"})}catch(e){return null}let[l]=o.getVideoTracks();t&&(t.style.visibility="hidden");let a=document.createElement("video");a.muted=!0,a.playsInline=!0,a.srcObject=o,await new Promise(e=>{a.onloadedmetadata=()=>e()}),await a.play(),await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(()=>e())));let{videoWidth:s,videoHeight:p}=a,k=document.createElement("canvas");return k.width=s,k.height=p,k.getContext("2d").drawImage(a,0,0,s,p),a.pause(),a.srcObject=null,l.stop(),t&&(t.style.visibility=""),{bitmap:await createImageBitmap(k),scaleX:s/window.innerWidth,scaleY:p/window.innerHeight}}function Z(t,o,l,a,s,p){t.beginPath(),t.moveTo(o+p,l),t.arcTo(o+a,l,o+a,l+s,p),t.arcTo(o+a,l+s,o,l+s,p),t.arcTo(o,l+s,o,l,p),t.arcTo(o,l,o+a,l,p),t.closePath()}async function te(t){let o=await ee(t);if(!o)return null;let{bitmap:l}=o,a=document.createElement("canvas");return a.width=l.width,a.height=l.height,a.getContext("2d").drawImage(l,0,0),l.close(),new Promise(s=>a.toBlob(s,"image/png"))}async function ne(t){let o=await ee(t);return o?fe(o):null}function fe({bitmap:t,scaleX:o,scaleY:l}){return new Promise(a=>{let s=window.innerWidth,p=window.innerHeight,k=Math.min(window.devicePixelRatio||1,2),c=document.createElement("canvas");c.width=s*k,c.height=p*k,Object.assign(c.style,{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",zIndex:"2147483646",cursor:"crosshair",userSelect:"none"}),document.body.appendChild(c);let e=c.getContext("2d");e.scale(k,k);function d(){e.drawImage(t,0,0,t.width,t.height,0,0,s,p),e.fillStyle="rgba(0,0,0,0.38)",e.fillRect(0,0,s,p)}function V(){let i="S\xFCr\xFCkle: alan se\xE7   \u2022   B\u0131rak: onayla   \u2022   Esc: iptal";e.font="13px -apple-system, system-ui, sans-serif";let m=e.measureText(i).width+24,u=36,g=(s-m)/2,h=p-u-20;e.fillStyle="rgba(15,23,42,0.72)",Z(e,g,h,m,u,10),e.fill(),e.fillStyle="#f1f5f9",e.textAlign="center",e.textBaseline="middle",e.fillText(i,s/2,h+u/2),e.textAlign="left",e.textBaseline="alphabetic"}function N(i,f,m,u){e.save(),e.beginPath(),e.rect(i,f,m,u),e.clip(),e.drawImage(t,0,0,t.width,t.height,0,0,s,p),e.restore(),e.strokeStyle="#6366f1",e.lineWidth=2,e.setLineDash([6,3]),e.strokeRect(i+1,f+1,m-2,u-2),e.setLineDash([]);let g=7;e.fillStyle="#6366f1",[[i,f],[i+m-g,f],[i,f+u-g],[i+m-g,f+u-g]].forEach(([O,T])=>e.fillRect(O,T,g,g)),e.font="bold 12px -apple-system, system-ui, sans-serif";let h=`${Math.round(m)} \xD7 ${Math.round(u)}`,M=e.measureText(h).width+14,w=22,v=Math.min(i,s-M-4),A=f>w+8?f-w-4:f+u+4;e.fillStyle="#6366f1",Z(e,v,A,M,w,5),e.fill(),e.fillStyle="#fff",e.textBaseline="middle",e.fillText(h,v+7,A+w/2),e.textBaseline="alphabetic"}let j=0,y=0,_=!1;function H(i,f){if(d(),V(),i===void 0||f===void 0)return;let m=Math.min(j,i),u=Math.min(y,f),g=Math.abs(i-j),h=Math.abs(f-y);g>1&&h>1&&N(m,u,g,h)}H(),c.addEventListener("mousedown",i=>{i.preventDefault(),j=i.clientX,y=i.clientY,_=!0}),c.addEventListener("mousemove",i=>{_&&H(i.clientX,i.clientY)}),c.addEventListener("mouseup",i=>{if(!_)return;_=!1;let f=Math.min(j,i.clientX),m=Math.min(y,i.clientY),u=Math.abs(i.clientX-j),g=Math.abs(i.clientY-y);if(C(),u<10||g<10){t.close(),a(null);return}K(f,m,u,g)});function S(i){i.key==="Escape"&&(C(),t.close(),a(null))}window.addEventListener("keydown",S,!0);function C(){c.remove(),window.removeEventListener("keydown",S,!0)}function K(i,f,m,u){let g=Math.round(i*o),h=Math.round(f*l),M=Math.round(m*o),w=Math.round(u*l),v=document.createElement("canvas");v.width=M,v.height=w,v.getContext("2d").drawImage(t,g,h,M,w,0,0,M,w),t.close(),v.toBlob(A=>a(A),"image/png")}})}var R=4;function E(t){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}var b={chat:E('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),history:E('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),copy:E('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),camera:E('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),crop:E('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),upload:E('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),close:E('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),check:E('<polyline points="20 6 9 17 4 12"/>'),alert:E('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),x:E('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')};async function ie(){var c,e;let t=window.__KF_CONFIG__;if(!t)return;let o=(c=window.KanewsFeedback)!=null?c:{},l=o.domain||location.host,a=o.license||"",s=o.theme||"",p;try{p=await(await fetch(`${t.base}/api/v1/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:l,license_key:a,theme:s,meta:{themeVersion:o.themeVersion,user:o.user,href:location.href}})})).json()}catch(d){return}if(!p.enabled)return;let k={...t.project,...(e=p.project)!=null?e:{}};pe(t,o,k,{domain:l,license:a,theme:s})}function pe(t,o,l,a){var J;let s=document.createElement("div");s.id="kanews-feedback-widget",document.body.appendChild(s);let p=s.attachShadow({mode:"open"}),k=document.createElement("style");k.textContent=Q,p.appendChild(k);let c=document.createElement("div");c.className="kf-root",c.dataset.pos=l.position||"bottom-right",c.style.setProperty("--kf-accent",l.accentColor||"#4f46e5");let e=((J=l.categories)!=null?J:["\xD6neri"]).map(n=>`<option value="${z(n)}">${z(n)}</option>`).join("");c.innerHTML=`
    <button class="kf-fab" type="button" aria-label="Geri bildirim">
      ${b.chat}<span>Geri bildirim</span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="Geri bildirim formu">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${b.chat}</div>
          <span class="kf-title">Geri bildirim</span>
        </div>
        <div style="display:flex;gap:4px;align-items:center;">
          <button class="kf-close kf-history-toggle" type="button" aria-label="Ge\xE7mi\u015F">${b.history}</button>
          <button class="kf-close" type="button" aria-label="Kapat">${b.close}</button>
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
          <label class="kf-field-label">Kategori</label>
          <select class="kf-select" aria-label="Kategori">${e}</select>
        </div>

        <div>
          <label class="kf-field-label">A\xE7\u0131klama</label>
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
          <span class="kf-counter">0 / ${R}</span>
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
  `,p.appendChild(c);let d=n=>c.querySelector(n),V=d(".kf-fab"),N=d(".kf-panel"),j=d(".kf-close"),y=d(".kf-history-toggle"),_=d(".kf-cancel"),H=d(".kf-submit"),S=d(".kf-capture-full"),C=d(".kf-capture-area"),K=d(".kf-upload"),i=d(".kf-file"),f=d(".kf-textarea"),m=d(".kf-select"),u=d(".kf-thumbs"),g=d(".kf-counter"),h=d(".kf-msg"),M=d(".kf-view-form"),w=d(".kf-view-history"),v=d(".kf-history-list"),A=d(".kf-history-empty"),O=d(".kf-foot"),T=[],Y=`kf_history_${t.widgetKey}`;function U(){try{return JSON.parse(localStorage.getItem(Y)||"[]")}catch(n){return[]}}function oe(n){let r=U();r.unshift(n),localStorage.setItem(Y,JSON.stringify(r.slice(0,50)))}function ae(n){return new Date(n).toLocaleDateString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}function re(){let n=U();v.innerHTML="",A.hidden=n.length>0,n.forEach(r=>{let x=document.createElement("li");x.className="kf-history-item",x.innerHTML=`
        <div class="kf-hi-left">
          <span class="kf-hi-cat">${z(r.category)}</span>
          <span class="kf-hi-page">${z(r.page)}</span>
        </div>
        <div class="kf-hi-right">
          <span class="kf-hi-id" title="Kopyala">#${z(r.id.slice(0,8))}</span>
          <span class="kf-hi-date">${z(ae(r.date))}</span>
        </div>`,x.querySelector(".kf-hi-id").addEventListener("click",()=>q(r.id)),v.appendChild(x)})}let P=!1;function W(){P=!1,M.hidden=!1,w.hidden=!0,O.hidden=!1,y.title="Ge\xE7mi\u015F",y.innerHTML=b.history,L("",null)}function se(){P=!0,M.hidden=!0,w.hidden=!1,O.hidden=!0,y.title="Forma d\xF6n",y.innerHTML=b.close,re(),L("",null)}y.addEventListener("click",()=>P?W():se());function q(n,r){var x;(x=navigator.clipboard)==null||x.writeText(n).catch(()=>{}),r&&(r.classList.add("copied"),r.innerHTML=b.check,setTimeout(()=>{r.classList.remove("copied"),r.innerHTML=b.copy},1800))}function L(n,r){if(!r){h.hidden=!0,h.innerHTML="";return}h.hidden=!1,h.className=`kf-msg kf-${r}`,h.innerHTML=`${r==="ok"?b.check:b.alert} ${z(n)}`}function I(){let n=T.length>=R;g.textContent=`${T.length} / ${R}`,S.disabled=n,C.disabled=n,K.disabled=n,u.innerHTML="",T.forEach((r,x)=>{let $=document.createElement("div");$.className="kf-thumb",$.innerHTML=`<img src="${r.url}" alt="ek"><button class="kf-thumb-del" type="button" aria-label="Kald\u0131r">${b.x}</button>`,$.querySelector("button").addEventListener("click",()=>{URL.revokeObjectURL(r.url),T.splice(x,1),I()}),u.appendChild($)})}function G(n,r){T.length>=R||(T.push({blob:n,kind:r,url:URL.createObjectURL(n)}),I())}function le(){c.dataset.open="1",P||setTimeout(()=>f.focus(),60)}function D(){c.dataset.open="0",W()}function X(){c.dataset.open==="1"?D():le()}V.addEventListener("click",X),j.addEventListener("click",D),_.addEventListener("click",D),K.addEventListener("click",()=>i.click()),i.addEventListener("change",()=>{var n;Array.from((n=i.files)!=null?n:[]).filter(r=>r.type.startsWith("image/")).forEach(r=>G(r,"upload")),i.value=""}),S.addEventListener("click",async()=>{S.disabled=!0,S.innerHTML=`${b.camera} Bekleniyor\u2026`;try{let n=await te(s);n?G(n,"screenshot"):L("Ekran payla\u015F\u0131m\u0131 iptal edildi.","err")}catch(n){L("Ekran yakalanamad\u0131.","err")}finally{S.innerHTML=`${b.camera} T\xFCm ekran`,I()}}),C.addEventListener("click",async()=>{C.disabled=!0,C.innerHTML=`${b.crop} Bekleniyor\u2026`;try{let n=await ne(s);n?G(n,"screenshot"):L("Alan se\xE7imi iptal edildi.","err")}catch(n){L("Ekran yakalanamad\u0131.","err")}finally{C.innerHTML=`${b.crop} Alan se\xE7`,I()}});async function ce(){let n=f.value.trim();if(!n){L("L\xFCtfen bir a\xE7\u0131klama yaz.","err"),f.focus();return}H.disabled=!0,H.textContent="G\xF6nderiliyor\u2026",L("",null);try{let r=await fetch(`${t.base}/api/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:a.domain,license_key:a.license,theme:a.theme,category:m.value,message:n,page_url:location.href,viewport:`${window.innerWidth}x${window.innerHeight}`,wp_user:o.user,meta:{themeVersion:o.themeVersion}})}),x=await r.json();if(!r.ok||!x.ok){L("G\xF6nderilemedi. L\xFCtfen tekrar dene.","err");return}for(let B of T){let F=new FormData;F.append("widget_key",t.widgetKey),F.append("domain",a.domain),F.append("license_key",a.license),a.theme&&F.append("theme",a.theme),F.append("kind",B.kind);let de=B.blob.type==="image/png"?"png":"jpg";F.append("file",B.blob,`${B.kind}.${de}`),await fetch(`${t.base}/api/v1/feedback/${x.feedback_id}/attachment`,{method:"POST",body:F}).catch(()=>{})}let $=x.feedback_id;oe({id:$,category:m.value,page:location.pathname,date:Date.now()}),h.hidden=!1,h.className="kf-msg kf-ok",h.innerHTML=`
        ${b.check} Te\u015Fekk\xFCrler! Geri bildirimin al\u0131nd\u0131.
        <div class="kf-ref-box">
          <span class="kf-ref-label">Referans no</span>
          <span class="kf-ref-id">#${z($)}</span>
          <button class="kf-ref-copy" type="button" aria-label="Kopyala">${b.copy}</button>
        </div>`,h.querySelector(".kf-ref-copy").addEventListener("click",B=>q($,B.currentTarget)),f.value="",T.splice(0).forEach(B=>URL.revokeObjectURL(B.url)),I(),setTimeout(D,4e3)}catch(r){L("Ba\u011Flant\u0131 hatas\u0131. L\xFCtfen tekrar dene.","err")}finally{H.disabled=!1,H.textContent="G\xF6nder"}}H.addEventListener("click",ce),window.addEventListener("keydown",n=>{(n.metaKey||n.ctrlKey)&&n.key==="/"&&(n.preventDefault(),X()),n.key==="Escape"&&c.dataset.open==="1"&&D()}),I()}function z(t){return t.replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ie):ie();})();
