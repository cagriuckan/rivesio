"use strict";(()=>{var R=`
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
`;async function G(t){let o;try{o=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser",frameRate:1},audio:!1,preferCurrentTab:!0,selfBrowserSurface:"include"})}catch(e){return null}let[s]=o.getVideoTracks();t&&(t.style.visibility="hidden");let a=document.createElement("video");a.muted=!0,a.playsInline=!0,a.srcObject=o,await new Promise(e=>{a.onloadedmetadata=()=>e()}),await a.play(),await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(()=>e())));let{videoWidth:r,videoHeight:c}=a,x=document.createElement("canvas");return x.width=r,x.height=c,x.getContext("2d").drawImage(a,0,0,r,c),a.pause(),a.srcObject=null,s.stop(),t&&(t.style.visibility=""),{bitmap:await createImageBitmap(x),scaleX:r/window.innerWidth,scaleY:c/window.innerHeight}}function D(t,o,s,a,r,c){t.beginPath(),t.moveTo(o+c,s),t.arcTo(o+a,s,o+a,s+r,c),t.arcTo(o+a,s+r,o,s+r,c),t.arcTo(o,s+r,o,s,c),t.arcTo(o,s,o+a,s,c),t.closePath()}async function V(t){let o=await G(t);if(!o)return null;let{bitmap:s}=o,a=document.createElement("canvas");return a.width=s.width,a.height=s.height,a.getContext("2d").drawImage(s,0,0),s.close(),new Promise(r=>a.toBlob(r,"image/png"))}async function N(t){let o=await G(t);return o?X(o):null}function X({bitmap:t,scaleX:o,scaleY:s}){return new Promise(a=>{let r=window.innerWidth,c=window.innerHeight,x=Math.min(window.devicePixelRatio||1,2),l=document.createElement("canvas");l.width=r*x,l.height=c*x,Object.assign(l.style,{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",zIndex:"2147483646",cursor:"crosshair",userSelect:"none"}),document.body.appendChild(l);let e=l.getContext("2d");e.scale(x,x);function b(){e.drawImage(t,0,0,t.width,t.height,0,0,r,c),e.fillStyle="rgba(0,0,0,0.38)",e.fillRect(0,0,r,c)}function F(){let n="S\xFCr\xFCkle: alan se\xE7   \u2022   B\u0131rak: onayla   \u2022   Esc: iptal";e.font="13px -apple-system, system-ui, sans-serif";let h=e.measureText(n).width+24,p=36,d=(r-h)/2,u=c-p-20;e.fillStyle="rgba(15,23,42,0.72)",D(e,d,u,h,p,10),e.fill(),e.fillStyle="#f1f5f9",e.textAlign="center",e.textBaseline="middle",e.fillText(n,r/2,u+p/2),e.textAlign="left",e.textBaseline="alphabetic"}function K(n,f,h,p){e.save(),e.beginPath(),e.rect(n,f,h,p),e.clip(),e.drawImage(t,0,0,t.width,t.height,0,0,r,c),e.restore(),e.strokeStyle="#6366f1",e.lineWidth=2,e.setLineDash([6,3]),e.strokeRect(n+1,f+1,h-2,p-2),e.setLineDash([]);let d=7;e.fillStyle="#6366f1",[[n,f],[n+h-d,f],[n,f+p-d],[n+h-d,f+p-d]].forEach(([S,z])=>e.fillRect(S,z,d,d)),e.font="bold 12px -apple-system, system-ui, sans-serif";let u=`${Math.round(h)} \xD7 ${Math.round(p)}`,m=e.measureText(u).width+14,k=22,y=Math.min(n,r-m-4),j=f>k+8?f-k-4:f+p+4;e.fillStyle="#6366f1",D(e,y,j,m,k,5),e.fill(),e.fillStyle="#fff",e.textBaseline="middle",e.fillText(u,y+7,j+k/2),e.textBaseline="alphabetic"}let C=0,H=0,M=!1;function T(n,f){if(b(),F(),n===void 0||f===void 0)return;let h=Math.min(C,n),p=Math.min(H,f),d=Math.abs(n-C),u=Math.abs(f-H);d>1&&u>1&&K(h,p,d,u)}T(),l.addEventListener("mousedown",n=>{n.preventDefault(),C=n.clientX,H=n.clientY,M=!0}),l.addEventListener("mousemove",n=>{M&&T(n.clientX,n.clientY)}),l.addEventListener("mouseup",n=>{if(!M)return;M=!1;let f=Math.min(C,n.clientX),h=Math.min(H,n.clientY),p=Math.abs(n.clientX-C),d=Math.abs(n.clientY-H);if(A(),p<10||d<10){t.close(),a(null);return}$(f,h,p,d)});function E(n){n.key==="Escape"&&(A(),t.close(),a(null))}window.addEventListener("keydown",E,!0);function A(){l.remove(),window.removeEventListener("keydown",E,!0)}function $(n,f,h,p){let d=Math.round(n*o),u=Math.round(f*s),m=Math.round(h*o),k=Math.round(p*s),y=document.createElement("canvas");y.width=m,y.height=k,y.getContext("2d").drawImage(t,d,u,m,k,0,0,m,k),t.close(),y.toBlob(j=>a(j),"image/png")}})}var P=4;function L(t){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}var w={chat:L('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),camera:L('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),crop:L('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),upload:L('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),close:L('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),check:L('<polyline points="20 6 9 17 4 12"/>'),alert:L('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),x:L('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')};async function Y(){var l,e;let t=window.__KF_CONFIG__;if(!t)return;let o=(l=window.KanewsFeedback)!=null?l:{},s=o.domain||location.host,a=o.license||"",r=o.theme||"",c;try{c=await(await fetch(`${t.base}/api/v1/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:s,license_key:a,theme:r,meta:{themeVersion:o.themeVersion,user:o.user,href:location.href}})})).json()}catch(b){return}if(!c.enabled)return;let x={...t.project,...(e=c.project)!=null?e:{}};q(t,o,x,{domain:s,license:a,theme:r})}function q(t,o,s,a){var O;let r=document.createElement("div");r.id="kanews-feedback-widget",document.body.appendChild(r);let c=r.attachShadow({mode:"open"}),x=document.createElement("style");x.textContent=R,c.appendChild(x);let l=document.createElement("div");l.className="kf-root",l.dataset.pos=s.position||"bottom-right",l.style.setProperty("--kf-accent",s.accentColor||"#4f46e5");let e=((O=s.categories)!=null?O:["\xD6neri"]).map(i=>`<option value="${I(i)}">${I(i)}</option>`).join("");l.innerHTML=`
    <button class="kf-fab" type="button" aria-label="Geri bildirim">
      ${w.chat}<span>Geri bildirim</span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="Geri bildirim formu">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${w.chat}</div>
          <span class="kf-title">Geri bildirim</span>
        </div>
        <button class="kf-close" type="button" aria-label="Kapat">${w.close}</button>
      </div>

      <div class="kf-msg" hidden></div>

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
            ${w.camera} T\xFCm ekran
          </button>
          <button class="kf-chip kf-capture-area" type="button">
            ${w.crop} Alan se\xE7
          </button>
          <button class="kf-chip kf-chip-upload kf-upload" type="button" aria-label="G\xF6rsel y\xFCkle">
            ${w.upload}
          </button>
        </div>

        <div class="kf-attach-row">
          <span class="kf-counter">0 / ${P}</span>
        </div>

        <div class="kf-thumbs"></div>
        <input class="kf-file" type="file" accept="image/*" multiple hidden />

        <div class="kf-hint">\u0130pucu: <kbd>\u2318 / Ctrl + /</kbd> ile her yerden a\xE7</div>
      </div>

      <div class="kf-foot">
        <button class="kf-btn kf-btn-ghost kf-cancel" type="button">Vazge\xE7</button>
        <button class="kf-btn kf-btn-primary kf-submit" type="button">G\xF6nder</button>
      </div>

    </div>
  `,c.appendChild(l);let b=i=>l.querySelector(i),F=b(".kf-fab"),K=b(".kf-panel"),C=b(".kf-close"),H=b(".kf-cancel"),M=b(".kf-submit"),T=b(".kf-capture-full"),E=b(".kf-capture-area"),A=b(".kf-upload"),$=b(".kf-file"),n=b(".kf-textarea"),f=b(".kf-select"),h=b(".kf-thumbs"),p=b(".kf-counter"),d=b(".kf-msg"),u=[];function m(i,g){if(!g){d.hidden=!0,d.innerHTML="";return}d.hidden=!1,d.className=`kf-msg kf-${g}`,d.innerHTML=`${g==="ok"?w.check:w.alert} ${I(i)}`}function k(){let i=u.length>=P;p.textContent=`${u.length} / ${P}`,T.disabled=i,E.disabled=i,A.disabled=i,h.innerHTML="",u.forEach((g,_)=>{let v=document.createElement("div");v.className="kf-thumb",v.innerHTML=`<img src="${g.url}" alt="ek"><button class="kf-thumb-del" type="button" aria-label="Kald\u0131r">${w.x}</button>`,v.querySelector("button").addEventListener("click",()=>{URL.revokeObjectURL(g.url),u.splice(_,1),k()}),h.appendChild(v)})}function y(i,g){u.length>=P||(u.push({blob:i,kind:g,url:URL.createObjectURL(i)}),k())}function j(){l.dataset.open="1",setTimeout(()=>n.focus(),60)}function S(){l.dataset.open="0"}function z(){l.dataset.open==="1"?S():j()}F.addEventListener("click",z),C.addEventListener("click",S),H.addEventListener("click",S),A.addEventListener("click",()=>$.click()),$.addEventListener("change",()=>{var i;Array.from((i=$.files)!=null?i:[]).filter(g=>g.type.startsWith("image/")).forEach(g=>y(g,"upload")),$.value=""}),T.addEventListener("click",async()=>{T.disabled=!0,T.innerHTML=`${w.camera} Bekleniyor\u2026`;try{let i=await V(r);i?y(i,"screenshot"):m("Ekran payla\u015F\u0131m\u0131 iptal edildi.","err")}catch(i){m("Ekran yakalanamad\u0131.","err")}finally{T.innerHTML=`${w.camera} T\xFCm ekran`,k()}}),E.addEventListener("click",async()=>{E.disabled=!0,E.innerHTML=`${w.crop} Bekleniyor\u2026`;try{let i=await N(r);i?y(i,"screenshot"):m("Alan se\xE7imi iptal edildi.","err")}catch(i){m("Ekran yakalanamad\u0131.","err")}finally{E.innerHTML=`${w.crop} Alan se\xE7`,k()}});async function W(){let i=n.value.trim();if(!i){m("L\xFCtfen bir a\xE7\u0131klama yaz.","err"),n.focus();return}M.disabled=!0,M.textContent="G\xF6nderiliyor\u2026",m("",null);try{let g=await fetch(`${t.base}/api/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:a.domain,license_key:a.license,theme:a.theme,category:f.value,message:i,page_url:location.href,viewport:`${window.innerWidth}x${window.innerHeight}`,wp_user:o.user,meta:{themeVersion:o.themeVersion}})}),_=await g.json();if(!g.ok||!_.ok){m("G\xF6nderilemedi. L\xFCtfen tekrar dene.","err");return}for(let v of u){let B=new FormData;B.append("widget_key",t.widgetKey),B.append("domain",a.domain),B.append("license_key",a.license),a.theme&&B.append("theme",a.theme),B.append("kind",v.kind);let U=v.blob.type==="image/png"?"png":"jpg";B.append("file",v.blob,`${v.kind}.${U}`),await fetch(`${t.base}/api/v1/feedback/${_.feedback_id}/attachment`,{method:"POST",body:B}).catch(()=>{})}m("Te\u015Fekk\xFCrler! Geri bildirimin al\u0131nd\u0131.","ok"),n.value="",u.splice(0).forEach(v=>URL.revokeObjectURL(v.url)),k(),setTimeout(S,1600)}catch(g){m("Ba\u011Flant\u0131 hatas\u0131. L\xFCtfen tekrar dene.","err")}finally{M.disabled=!1,M.textContent="G\xF6nder"}}M.addEventListener("click",W),window.addEventListener("keydown",i=>{(i.metaKey||i.ctrlKey)&&i.key==="/"&&(i.preventDefault(),z()),i.key==="Escape"&&l.dataset.open==="1"&&S()}),k()}function I(t){return t.replace(/[&<>"']/g,o=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[o])}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Y):Y();})();
