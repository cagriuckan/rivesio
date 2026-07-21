"use strict";(()=>{var ct=`
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
  background: var(--kf-accent, #0B1437);
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

/* Icon-only FAB: compact circular button, no text label. */
.kf-root[data-fab="icon"] .kf-fab { padding: 13px; border-radius: 50%; position: relative; }
.kf-root[data-fab="icon"] .kf-fab span { display: none; }
.kf-root[data-fab="icon"] .kf-fab svg { width: 18px; height: 18px; }

/* Tooltip on the icon-only FAB (label shown on hover / focus). */
.kf-root[data-fab="icon"] .kf-fab::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  padding: 5px 10px;
  border-radius: 8px;
  background: var(--elevated);
  color: var(--txt);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-fab);
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity .14s ease, transform .14s ease;
}
.kf-root[data-fab="icon"][data-pos="bottom-left"] .kf-fab::after { left: 0; transform: translateX(0) translateY(4px); }
.kf-root[data-fab="icon"][data-pos="bottom-right"] .kf-fab::after { left: auto; right: 0; transform: translateX(0) translateY(4px); }
.kf-root[data-fab="icon"] .kf-fab:hover::after,
.kf-root[data-fab="icon"] .kf-fab:focus-visible::after {
  opacity: 1;
  transform: translateX(0) translateY(0);
}

/* \u2500\u2500 Powered-by footer \u2500\u2500 */
.kf-powered {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 16px;
  border-top: 1px solid var(--border-sub);
  background: var(--surface);
  font-size: 10.5px;
  color: var(--txt-faint);
  text-decoration: none;
  transition: color .14s;
}
.kf-powered:hover { color: var(--txt-muted); }
.kf-powered .kf-brand { display: inline-flex; align-items: center; gap: 4px; }
.kf-powered .kf-brand svg { display: block; border-radius: 4px; }
.kf-powered .kf-brand-name { font-weight: 700; color: var(--txt-dim); letter-spacing: -0.01em; }

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
  background: var(--kf-accent, #0B1437);
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
/* [hidden] must win over the explicit display:flex above (success screen). */
.kf-body[hidden], .kf-foot[hidden] { display: none; }

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
  border-color: var(--kf-accent, #0B1437);
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
  border-color: var(--kf-accent, #0B1437);
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
  border-color: var(--kf-accent, #0B1437);
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
.kf-cf-check input { width: 16px; height: 16px; accent-color: var(--kf-accent, #0B1437); cursor: pointer; }

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
  background: var(--kf-accent, #0B1437);
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
  background: var(--kf-accent, #0B1437);
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
.kf-hi-date { font-size: 10.5px; color: var(--txt-muted); }

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

/* \u2500\u2500 Tabs \u2500\u2500 */
.kf-tabs {
  display: flex;
  gap: 2px;
  padding: 8px 12px 0;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.kf-tab {
  flex: 1;
  position: relative;
  padding: 9px 8px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--txt-muted);
  cursor: pointer;
  font-family: var(--font);
  transition: color .14s, border-color .14s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.kf-tab svg { width: 14px; height: 14px; }
.kf-tab:hover { color: var(--txt-dim); }
.kf-tab[data-active="1"] { color: var(--txt); border-bottom-color: var(--kf-accent, #0B1437); }

/* \u2500\u2500 Support badge \u2500\u2500 */
.kf-support {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 12px 16px 0;
  padding: 8px 11px;
  border-radius: var(--radius-md);
  font-size: 12px;
  background: var(--elevated);
  color: var(--txt-dim);
  border: 1px solid var(--border-sub);
}
.kf-support[hidden] { display: none; }
.kf-support svg { width: 14px; height: 14px; flex-shrink: 0; }
.kf-support[data-expired="1"] { background: var(--err-bg); color: var(--err-txt); border-color: transparent; }

/* \u2500\u2500 Token box (success) \u2500\u2500 */
.kf-token-box {
  margin-top: 8px; padding: 10px 12px;
  background: var(--elevated); border-radius: var(--radius-sm);
  border: 1px solid var(--border-sub);
}
.kf-token-label { font-size: 11px; color: var(--txt-muted); margin-bottom: 4px; display: block; }
.kf-token-row { display: flex; align-items: center; gap: 8px; }
.kf-token-val {
  flex: 1; font-size: 12px; font-weight: 600; color: var(--txt);
  font-family: var(--font); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  background: var(--surface); padding: 7px 9px; border-radius: 6px; border: 1px solid var(--border);
}
.kf-token-copy { width: 100%; margin-top: 8px; }
.kf-token-hint { margin-top: 6px; font-size: 10.5px; color: var(--txt-muted); line-height: 1.4; }

/* Success screen (form hidden, only the confirmation + code shown). */
.kf-msg.kf-success { flex-direction: column; align-items: stretch; gap: 12px; }
.kf-msg.kf-success .kf-success-head {
  display: flex; align-items: center; gap: 9px; font-weight: 600; font-size: 13px;
}
.kf-msg.kf-success .kf-success-head svg { width: 16px; height: 16px; flex-shrink: 0; }
.kf-new-submit { width: 100%; }

/* \u2500\u2500 History / recover \u2500\u2500 */
.kf-history-item { cursor: pointer; }
.kf-recover {
  margin: 6px 16px 16px;
  padding-top: 14px;
  border-top: 1px solid var(--border-sub);
  display: flex; flex-direction: column; gap: 8px;
}
.kf-recover-title {
  font-size: 11px; font-weight: 600; letter-spacing: .05em; text-transform: uppercase;
  color: var(--txt-muted); margin-bottom: 2px;
}
.kf-recover-row { display: flex; gap: 6px; }
.kf-recover-row .kf-input { flex: 1; }
.kf-recover-row .kf-btn { flex-shrink: 0; padding: 8px 12px; }


/* \u2500\u2500 Unread badges \u2500\u2500 */
.kf-fab-badge, .kf-tab-badge {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 16px; height: 16px; padding: 0 4px;
  border-radius: 999px; background: #ef4444; color: #fff;
  font-size: 10px; font-weight: 800; line-height: 1;
}
.kf-fab-badge[hidden], .kf-tab-badge[hidden] { display: none; }
.kf-fab { position: relative; }
.kf-root[data-fab="icon"] .kf-fab .kf-fab-badge { position: absolute; top: -4px; right: -4px; }

/* \u2500\u2500 Email OTP access \u2500\u2500 */
.kf-otp {
  margin: 10px 14px 14px; padding: 12px;
  border: 1px dashed var(--border); border-radius: var(--radius-md);
  display: flex; flex-direction: column; gap: 8px;
}
.kf-otp[hidden] { display: none; }
.kf-otp-hint { font-size: 11px; color: var(--txt-faint); line-height: 1.5; }
.kf-otp-code { letter-spacing: 4px; font-weight: 700; }
.kf-otp-step2[hidden] { display: none; }

.kf-session-bar {
  display: flex; align-items: center; gap: 8px;
  margin: 10px 14px 0; padding: 8px 12px;
  background: var(--elevated); border: 1px solid var(--border-sub);
  border-radius: var(--radius-md); font-size: 12px;
}
.kf-session-bar[hidden] { display: none; }
.kf-session-email { font-weight: 600; color: var(--txt); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.kf-link {
  margin-left: auto; background: none; border: none; cursor: pointer;
  color: var(--kf-accent, #0B1437); font-size: 11.5px; font-weight: 700; font-family: var(--font);
}
.kf-hi-dot {
  display: inline-block; width: 7px; height: 7px; border-radius: 50%;
  background: #ef4444; margin-left: 6px; vertical-align: middle;
}

/* \u2500\u2500 Conversation detail \u2500\u2500 */
.kf-convo { display: flex; flex-direction: column; max-height: 70dvh; }
.kf-convo[hidden] { display: none; }
.kf-convo-head {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; border-bottom: 1px solid var(--border-sub);
}
.kf-back {
  display: inline-flex; align-items: center; gap: 5px;
  background: transparent; border: none; color: var(--txt-dim);
  font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: var(--font);
  padding: 4px 6px; border-radius: var(--radius-sm); transition: background .12s, color .12s;
}
.kf-back:hover { background: var(--elevated); color: var(--txt); }
.kf-back svg { width: 14px; height: 14px; }
.kf-convo-cat { font-size: 12px; color: var(--txt-faint); margin-left: auto; }

.kf-thread {
  display: flex; flex-direction: column; gap: 10px;
  padding: 14px 16px; overflow-y: auto; flex: 1;
}
.kf-msg-row { display: flex; flex-direction: column; max-width: 85%; }
.kf-msg-row.kf-mine { align-self: flex-end; align-items: flex-end; }
.kf-msg-row.kf-theirs { align-self: flex-start; align-items: flex-start; }
.kf-bubble { padding: 9px 13px; border-radius: 16px; font-size: 12.5px; line-height: 1.55; }
.kf-mine .kf-bubble { background: var(--kf-accent, #0B1437); border-bottom-right-radius: 6px; }
.kf-mine .kf-bubble-body { color: #fff; }
.kf-theirs .kf-bubble { background: var(--elevated); border: 1px solid var(--border-sub); border-bottom-left-radius: 6px; }
.kf-bubble-body { white-space: pre-wrap; word-break: break-word; color: var(--txt); }
.kf-bubble-time { font-size: 10px; color: var(--txt-muted); margin-top: 3px; padding: 0 4px; }
.kf-day-sep {
  display: flex; align-items: center; gap: 10px; margin: 4px 0;
  font-size: 10.5px; color: var(--txt-muted);
}
.kf-day-sep::before, .kf-day-sep::after { content: ""; flex: 1; height: 1px; background: var(--border-sub); }
.kf-day-sep span {
  border: 1px solid var(--border-sub); background: var(--surface);
  border-radius: 999px; padding: 2px 10px; font-weight: 600;
}
.kf-convo-imgs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.kf-convo-imgs img { width: 60px; height: 46px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-sub); cursor: pointer; }

.kf-reply-box {
  border-top: 1px solid var(--border); padding: 12px 16px; background: var(--surface);
  display: flex; flex-direction: column; gap: 8px;
}
.kf-reply-box[hidden] { display: none; }
.kf-reply-foot { display: flex; align-items: center; gap: 8px; }
.kf-reply-foot .kf-counter { margin-right: auto; }
.kf-convo-closed {
  padding: 12px 16px; border-top: 1px solid var(--border);
  font-size: 12px; color: var(--txt-faint); text-align: center; background: var(--surface);
}
.kf-convo-closed[hidden] { display: none; }

/* \u2500\u2500 Scrollbar \u2500\u2500 */
.kf-body::-webkit-scrollbar, .kf-thread::-webkit-scrollbar { width: 4px; }
.kf-body::-webkit-scrollbar-track, .kf-thread::-webkit-scrollbar-track { background: transparent; }
.kf-body::-webkit-scrollbar-thumb, .kf-thread::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

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
`;async function Me(n){let l;try{l=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser",frameRate:1},audio:!1,preferCurrentTab:!0,selfBrowserSurface:"include"})}catch(o){return null}let[u]=l.getVideoTracks();n&&(n.style.visibility="hidden");let p=document.createElement("video");p.muted=!0,p.playsInline=!0,p.srcObject=l,await new Promise(o=>{p.onloadedmetadata=()=>o()}),await p.play(),await new Promise(o=>requestAnimationFrame(()=>requestAnimationFrame(()=>o())));let{videoWidth:d,videoHeight:f}=p,k=document.createElement("canvas");return k.width=d,k.height=f,k.getContext("2d").drawImage(p,0,0,d,f),p.pause(),p.srcObject=null,u.stop(),n&&(n.style.visibility=""),{bitmap:await createImageBitmap(k),scaleX:d/window.innerWidth,scaleY:f/window.innerHeight}}function pt(n){n==null||n.bitmap.close()}function me(n,l,u,p,d,f){n.beginPath(),n.moveTo(l+f,u),n.arcTo(l+p,u,l+p,u+d,f),n.arcTo(l+p,u+d,l,u+d,f),n.arcTo(l,u+d,l,u,f),n.arcTo(l,u,l+p,u,f),n.closePath()}async function ft(n){let l=await Me(n);if(!l)return null;let{bitmap:u}=l,p=document.createElement("canvas");return p.width=u.width,p.height=u.height,p.getContext("2d").drawImage(u,0,0),u.close(),new Promise(d=>p.toBlob(d,"image/png"))}async function ut(n){return Me(n)}function bt(n,l,u){let{bitmap:p,scaleX:d,scaleY:f}=n,k=document.createElement("canvas");k.width=p.width,k.height=p.height;let s=k.getContext("2d");s.drawImage(p,0,0);let o=Math.round(l.x*d),D=Math.round(l.y*f),c=Math.round(l.w*d),M=Math.round(l.h*f),r=Math.max(3,Math.round(2*Math.max(d,f))),I=Math.max(14,Math.round(12*Math.max(d,f)));s.save(),s.fillStyle="rgba(59, 130, 246, 0.18)",me(s,o,D,c,M,I),s.fill(),s.strokeStyle="#3b82f6",s.lineWidth=r,me(s,o+r/2,D+r/2,Math.max(0,c-r),Math.max(0,M-r),I),s.stroke();let w=Math.max(24,Math.round(22*Math.max(d,f))),N=Math.min(k.width-w-r,Math.max(r,o+c-w/2)),x=Math.max(r,D-w/2);return s.fillStyle="#3b82f6",s.beginPath(),s.arc(N+w/2,x+w/2,w/2,0,Math.PI*2),s.fill(),s.strokeStyle="#ffffff",s.lineWidth=Math.max(2,Math.round(1.5*Math.max(d,f))),s.stroke(),s.fillStyle="#ffffff",s.font=`700 ${Math.round(w*.5)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText(String(u),N+w/2,x+w/2+1),s.restore(),new Promise(L=>k.toBlob(L,"image/png"))}async function mt(n){let l=await Me(n);return l?Yt(l):null}function Yt({bitmap:n,scaleX:l,scaleY:u}){return new Promise(p=>{let d=window.innerWidth,f=window.innerHeight,k=Math.min(window.devicePixelRatio||1,2),s=document.createElement("canvas");s.width=d*k,s.height=f*k,Object.assign(s.style,{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",zIndex:"2147483646",cursor:"crosshair",userSelect:"none"}),document.body.appendChild(s);let o=s.getContext("2d");o.scale(k,k);function D(){o.drawImage(n,0,0,n.width,n.height,0,0,d,f),o.fillStyle="rgba(0,0,0,0.38)",o.fillRect(0,0,d,f)}function c(){let h="S\xFCr\xFCkle: alan se\xE7   \u2022   B\u0131rak: onayla   \u2022   Esc: iptal";o.font="13px -apple-system, system-ui, sans-serif";let B=o.measureText(h).width+24,E=36,_=(d-B)/2,H=f-E-20;o.fillStyle="rgba(15,23,42,0.72)",me(o,_,H,B,E,10),o.fill(),o.fillStyle="#f1f5f9",o.textAlign="center",o.textBaseline="middle",o.fillText(h,d/2,H+E/2),o.textAlign="left",o.textBaseline="alphabetic"}function M(h,T,B,E){o.save(),o.beginPath(),o.rect(h,T,B,E),o.clip(),o.drawImage(n,0,0,n.width,n.height,0,0,d,f),o.restore(),o.strokeStyle="#6366f1",o.lineWidth=2,o.setLineDash([6,3]),o.strokeRect(h+1,T+1,B-2,E-2),o.setLineDash([]);let _=7;o.fillStyle="#6366f1",[[h,T],[h+B-_,T],[h,T+E-_],[h+B-_,T+E-_]].forEach(([ne,ee])=>o.fillRect(ne,ee,_,_)),o.font="bold 12px -apple-system, system-ui, sans-serif";let H=`${Math.round(B)} \xD7 ${Math.round(E)}`,P=o.measureText(H).width+14,R=22,C=Math.min(h,d-P-4),Q=T>R+8?T-R-4:T+E+4;o.fillStyle="#6366f1",me(o,C,Q,P,R,5),o.fill(),o.fillStyle="#fff",o.textBaseline="middle",o.fillText(H,C+7,Q+R/2),o.textBaseline="alphabetic"}let r=0,I=0,w=!1;function N(h,T){if(D(),c(),h===void 0||T===void 0)return;let B=Math.min(r,h),E=Math.min(I,T),_=Math.abs(h-r),H=Math.abs(T-I);_>1&&H>1&&M(B,E,_,H)}N(),s.addEventListener("mousedown",h=>{h.preventDefault(),r=h.clientX,I=h.clientY,w=!0}),s.addEventListener("mousemove",h=>{w&&N(h.clientX,h.clientY)}),s.addEventListener("mouseup",h=>{if(!w)return;w=!1;let T=Math.min(r,h.clientX),B=Math.min(I,h.clientY),E=Math.abs(h.clientX-r),_=Math.abs(h.clientY-I);if(L(),E<10||_<10){n.close(),p(null);return}b(T,B,E,_)});function x(h){h.key==="Escape"&&(L(),n.close(),p(null))}window.addEventListener("keydown",x,!0);function L(){s.remove(),window.removeEventListener("keydown",x,!0)}function b(h,T,B,E){let _=Math.round(h*l),H=Math.round(T*u),P=Math.round(B*l),R=Math.round(E*u),C=document.createElement("canvas");C.width=P,C.height=R,C.getContext("2d").drawImage(n,_,H,P,R,0,0,P,R),n.close(),C.toBlob(Q=>p(Q),"image/png")}})}var Gt={tr:{fabLabel:"Geri bildirim",title:"Geri bildirim",categoryLabel:"Kategori",messageLabel:"A\xE7\u0131klama",messagePlaceholder:"Ne eklensin ya da nerede bir sorun var?",submitLabel:"G\xF6nder",successMessage:"Te\u015Fekk\xFCrler! Geri bildirimin al\u0131nd\u0131.",errorMessage:"G\xF6nderilemedi. L\xFCtfen tekrar dene."},en:{fabLabel:"Feedback",title:"Feedback",categoryLabel:"Category",messageLabel:"Description",messagePlaceholder:"What should be added, or where is the problem?",submitLabel:"Send",successMessage:"Thanks! Your feedback was received.",errorMessage:"Couldn't send. Please try again."}},Xt={tr:{tabForm:"G\xF6nderim",tabHistory:"Ge\xE7mi\u015F",historyEmpty:"Hen\xFCz bir konu\u015Fman yok.",otpTitle:"Ge\xE7mi\u015Fine eri\u015F",otpHint:"E-postana g\xF6nderece\u011Fimiz 6 haneli kodla t\xFCm konu\u015Fmalar\u0131n\u0131 g\xF6rebilirsin.",sendCode:"Kod g\xF6nder",codePlaceholder:"6 haneli kod",verify:"Do\u011Frula",codeSent:"Kod e-postana g\xF6nderildi.",invalidCode:"Kod hatal\u0131 ya da s\xFCresi doldu.",changeEmail:"De\u011Fi\u015Ftir",newReplyBadge:"Yeni yan\u0131t",open:"A\xE7",emailPlaceholder:"E-posta adresin",supportUnlimited:"S\u0131n\u0131rs\u0131z destek",supportLeft:n=>`Destek: ${n} g\xFCn kald\u0131`,supportLastDay:"Destek bug\xFCn sona eriyor",supportEnded:"Destek s\xFCresi doldu",emailLabel:"E-posta",emailHint:"Yan\u0131tlar\u0131 takip etmek ve kodunu kurtarmak i\xE7in.",tokenSaved:"Eri\u015Fim kodun",tokenHint:"Konu\u015Fmana Ge\xE7mi\u015F sekmesinden e-postanla eri\u015Febilirsin.",replyPlaceholder:"Yan\u0131t\u0131n\u0131 yaz\u2026",send:"G\xF6nder",sending:"G\xF6nderiliyor\u2026",you:"Sen",support:"Destek",loadError:"Konu\u015Fma y\xFCklenemedi.",notFound:"Konu\u015Fma bulunamad\u0131. Kodu kontrol et.",closedNotice:"Destek s\xFCresi doldu\u011Fu i\xE7in yeni yan\u0131t eklenemiyor.",back:"Geri",copied:"Kopyaland\u0131",copy:"Kodu kopyala",newSubmission:"Yeni g\xF6nderim",addImage:"G\xF6rsel ekle",attachmentSent:"\u{1F4CE} Ek g\xF6nderildi",poweredBy:"\xC7al\u0131\u015Ft\u0131rd\u0131\u011F\u0131m\u0131z platform"},en:{tabForm:"Submit",tabHistory:"History",historyEmpty:"You have no conversations yet.",otpTitle:"Access your history",otpHint:"We'll email you a 6-digit code to see all your conversations.",sendCode:"Send code",codePlaceholder:"6-digit code",verify:"Verify",codeSent:"The code was sent to your email.",invalidCode:"Wrong or expired code.",changeEmail:"Change",newReplyBadge:"New reply",open:"Open",emailPlaceholder:"Your email",supportUnlimited:"Unlimited support",supportLeft:n=>`Support: ${n} days left`,supportLastDay:"Support ends today",supportEnded:"Support period ended",emailLabel:"Email",emailHint:"To follow replies and recover your code.",tokenSaved:"Your access code",tokenHint:"You can return to this conversation from the History tab with your email.",replyPlaceholder:"Write your reply\u2026",send:"Send",sending:"Sending\u2026",you:"You",support:"Support",loadError:"Couldn't load the conversation.",notFound:"Conversation not found. Check the code.",closedNotice:"Support period ended; new replies are disabled.",back:"Back",copied:"Copied",copy:"Copy code",newSubmission:"New submission",addImage:"Add image",attachmentSent:"\u{1F4CE} Attachment sent",poweredBy:"Powered by"}},Jt='<svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="7" fill="#0B1437"/><ellipse cx="12" cy="11.2" rx="6.2" ry="5" fill="#fff"/><path d="M8.5 14.5 L7 18 L11.5 15.4 Z" fill="#fff"/><circle cx="9.4" cy="11.2" r="1" fill="#0B1437"/><circle cx="12" cy="11.2" r="1" fill="#0B1437"/><circle cx="14.6" cy="11.2" r="1" fill="#0B1437"/></svg>';function ge(n,l){var f;return(f=(l==="en"?{support_ended:"Support period ended; submissions are closed.",daily_limit_site:"Daily submission limit for this site reached.",daily_limit_visitor:"You've hit today's submission limit. Try again tomorrow.",pending:"This site isn't approved yet.",blocked:"This site is blocked."}:{support_ended:"Destek s\xFCresi doldu, yeni g\xF6nderim al\u0131nam\u0131yor.",daily_limit_site:"Bu site i\xE7in g\xFCnl\xFCk g\xF6nderim limitine ula\u015F\u0131ld\u0131.",daily_limit_visitor:"G\xFCnl\xFCk g\xF6nderim limitine ula\u015Ft\u0131n. Yar\u0131n tekrar dene.",pending:"Bu site hen\xFCz onaylanmad\u0131.",blocked:"Bu site engellenmi\u015F."})[n!=null?n:""])!=null?f:l==="en"?"Couldn't send. Please try again.":"G\xF6nderilemedi. L\xFCtfen tekrar dene."}function Vt(){return(document.documentElement.lang||"").toLowerCase().startsWith("en")?"en":"tr"}var V=4;function j(n){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${n}</svg>`}var y={chat:j('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),history:j('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),copy:j('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),camera:j('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),crop:j('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),target:j('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>'),upload:j('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),close:j('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),check:j('<polyline points="20 6 9 17 4 12"/>'),alert:j('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),clock:j('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),infinity:j('<path d="M18.6 6.62a4.38 4.38 0 1 0 0 6.76L12 12l-6.6 1.38a4.38 4.38 0 1 0 0-6.76L12 12z"/>'),back:j('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'),x:j('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')};function Zt(){return crypto!=null&&crypto.randomUUID?crypto.randomUUID():`ann_${Date.now()}_${Math.random().toString(36).slice(2)}`}async function gt(){var k,s,o,D,c,M,r,I,w;let n=window.__KF_CONFIG__;if(!n)return;let l=(k=window.RivesioFeedback)!=null?k:{},u=l.domain||location.host,p;try{p=await(await fetch(`${n.base}/api/v1/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:n.widgetKey,domain:u,meta:{user:l.user,href:location.href}})})).json()}catch(N){return}if(!p.enabled)return;let d={...n.project,...(s=p.project)!=null?s:{}},f={conversationEnabled:(D=(o=p.conversation)==null?void 0:o.enabled)!=null?D:!1,emailRequired:(M=(c=p.conversation)==null?void 0:c.emailRequired)!=null?M:!1,support:(r=p.support)!=null?r:null,canSubmit:(I=p.canSubmit)!=null?I:!0,blockedReason:(w=p.blockedReason)!=null?w:null};Qt(n,l,d,{domain:u},f)}function Qt(n,l,u,p,d){var ot,it,rt;let f=document.createElement("div");f.id="rivesio-widget",document.body.appendChild(f);let k=f.attachShadow({mode:"open"}),s=document.createElement("style");s.textContent=ct,k.appendChild(s);let o=document.createElement("div");o.className="kf-root",o.dataset.pos=u.position||"bottom-right",o.dataset.fab=u.fabStyle||"label",o.style.setProperty("--kf-accent",u.accentColor||"#0B1437");let D=u.theme||"auto";(D==="light"||D==="auto"&&document.documentElement.getAttribute("data-theme")==="light")&&(o.dataset.theme="light");let c=Vt(),M={...Gt[c],...(ot=u.text)==null?void 0:ot[c]},r=Xt[c],I=(it=u.fields)!=null?it:[],w=d.conversationEnabled,N=((rt=u.categories)!=null?rt:["\xD6neri"]).map(e=>`<option value="${a(e)}">${a(e)}</option>`).join(""),x=I.map(e=>{var $;let t=e.required?"required":"",i=e.placeholder?`placeholder="${a(e.placeholder)}"`:"",m=`<label class="kf-label">${a(e.label)}${e.required?" *":""}</label>`,g="";if(e.type==="textarea")g=`<textarea class="kf-textarea kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" ${i} ${t}></textarea>`;else if(e.type==="select"){let v=(($=e.options)!=null?$:[]).map(A=>`<option value="${a(A)}">${a(A)}</option>`).join("");g=`<select class="kf-select kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" ${t}>${v}</select>`}else{if(e.type==="checkbox")return`<label class="kf-cf-check"><input type="checkbox" class="kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" data-cf-type="checkbox" ${t}> ${a(e.label)}</label>`;g=`<input type="${e.type==="email"?"email":"text"}" class="kf-input kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" ${i} ${t}>`}return`<div>${m}${g}</div>`}).join(""),L=w?`<div>
         <label class="kf-label">${a(r.emailLabel)}${d.emailRequired?" *":""}</label>
         <input type="email" class="kf-input kf-email" placeholder="${a(r.emailPlaceholder)}" ${d.emailRequired?"required":""}>
         <div class="kf-token-hint">${a(r.emailHint)}</div>
       </div>`:"";o.innerHTML=`
    <button class="kf-fab" type="button" aria-label="${a(M.fabLabel)}" data-tip="${a(M.fabLabel)}">
      ${y.chat}<span>${a(M.fabLabel)}</span><span class="kf-fab-badge" hidden></span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="${a(M.title)}">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${y.chat}</div>
          <span class="kf-title">${a(M.title)}</span>
        </div>
        <div class="kf-head-actions">
          <button class="kf-icon-btn kf-close-btn" type="button" aria-label="${a(r.back)}">${y.close}</button>
        </div>
      </div>

      <div class="kf-tabs">
        <button class="kf-tab kf-tab-form" type="button" data-active="1">${y.chat}<span>${a(r.tabForm)}</span></button>
        <button class="kf-tab kf-tab-history" type="button" data-active="0">${y.history}<span>${a(r.tabHistory)}</span><span class="kf-tab-badge" hidden></span></button>
      </div>

      <div class="kf-support" hidden></div>
      <div class="kf-msg" hidden></div>

      <!-- \u2500\u2500 FORM TAB \u2500\u2500 -->
      <div class="kf-view-form">
        <div class="kf-body">
          <div>
            <label class="kf-label">${a(M.categoryLabel)}</label>
            <select class="kf-select" aria-label="${a(M.categoryLabel)}">${N}</select>
          </div>

          <div>
            <label class="kf-label">${a(M.messageLabel)}</label>
            <textarea class="kf-textarea" placeholder="${a(M.messagePlaceholder)}"></textarea>
          </div>

          ${L}
          ${x}

          <div class="kf-capture-row">
            <button class="kf-chip kf-capture-full" type="button">${y.camera} ${a(c==="en"?"Full screen":"T\xFCm ekran")}</button>
            <button class="kf-chip kf-capture-area" type="button">${y.crop} ${a(c==="en"?"Select area":"Alan se\xE7")}</button>
            <button class="kf-chip kf-element-select" type="button">${y.target} ${a(c==="en"?"Pick element":"\xD6\u011Fe se\xE7")}</button>
            <button class="kf-chip kf-chip-upload kf-upload" type="button" aria-label="${a(r.addImage)}">${y.upload}</button>
          </div>

          <div class="kf-attach-row"><span class="kf-counter">0 / ${V}</span></div>
          <div class="kf-thumbs"></div>
          <div class="kf-annotations" hidden></div>
          <input class="kf-file" type="file" accept="image/*" multiple hidden />

          <div class="kf-hint">${a(c==="en"?"Tip:":"\u0130pucu:")} <kbd>\u2318 / Ctrl + /</kbd></div>
        </div>

        <div class="kf-foot">
          <button class="kf-btn kf-btn-ghost kf-cancel" type="button">${a(c==="en"?"Cancel":"Vazge\xE7")}</button>
          <button class="kf-btn kf-btn-primary kf-submit" type="button">${a(M.submitLabel)}</button>
        </div>
      </div>

      <!-- \u2500\u2500 HISTORY TAB \u2500\u2500 -->
      <div class="kf-view-history" hidden>
        <div class="kf-history-main">
          <div class="kf-session-bar" hidden>
            <span class="kf-session-email"></span>
            <button class="kf-link kf-session-change" type="button">${a(r.changeEmail)}</button>
          </div>
          <ul class="kf-history-list"></ul>
          <p class="kf-history-empty" hidden>${a(r.historyEmpty)}</p>
          ${w?`
          <div class="kf-otp">
            <div class="kf-recover-title">${a(r.otpTitle)}</div>
            <div class="kf-otp-hint">${a(r.otpHint)}</div>
            <div class="kf-recover-row kf-otp-step1">
              <input type="email" class="kf-input kf-otp-email" placeholder="${a(r.emailPlaceholder)}">
              <button class="kf-btn kf-btn-primary kf-otp-send" type="button">${a(r.sendCode)}</button>
            </div>
            <div class="kf-recover-row kf-otp-step2" hidden>
              <input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" class="kf-input kf-otp-code" placeholder="${a(r.codePlaceholder)}">
              <button class="kf-btn kf-btn-primary kf-otp-verify" type="button">${a(r.verify)}</button>
            </div>
          </div>`:""}
        </div>

        <div class="kf-convo" hidden>
          <div class="kf-convo-head">
            <button class="kf-back" type="button">${y.back} ${a(r.back)}</button>
            <span class="kf-convo-cat"></span>
          </div>
          <div class="kf-thread"></div>
          <div class="kf-reply-box">
            <textarea class="kf-reply-input kf-textarea" placeholder="${a(r.replyPlaceholder)}" style="min-height:64px"></textarea>
            <div class="kf-reply-foot">
              <span class="kf-counter kf-reply-counter">0 / ${V}</span>
              <button class="kf-chip kf-reply-upload" type="button" aria-label="${a(r.addImage)}">${y.upload}</button>
              <button class="kf-btn kf-btn-primary kf-reply-send" type="button">${a(r.send)}</button>
            </div>
            <input class="kf-reply-file" type="file" accept="image/*" multiple hidden />
          </div>
          <div class="kf-convo-closed" hidden>${a(r.closedNotice)}</div>
        </div>
      </div>

      <a class="kf-powered" href="${a(n.base)}" target="_blank" rel="noopener noreferrer">
        <span>${a(r.poweredBy)}</span>
        <span class="kf-brand">${Jt}<span class="kf-brand-name">Rivesio</span></span>
      </a>

    </div>
  `,k.appendChild(o);let b=e=>o.querySelector(e),h=b(".kf-fab"),T=b(".kf-close-btn"),B=b(".kf-tab-form"),E=b(".kf-tab-history"),_=b(".kf-cancel"),H=b(".kf-submit"),P=b(".kf-capture-full"),R=b(".kf-capture-area"),C=b(".kf-element-select"),Q=b(".kf-upload"),ne=b(".kf-file"),ee=b(".kf-view-form .kf-textarea"),U=o.querySelector(".kf-email"),Te=b(".kf-view-form .kf-select"),Se=b(".kf-thumbs"),xt=b(".kf-attach-row .kf-counter"),he=b(".kf-annotations"),q=b(".kf-msg"),K=b(".kf-support"),ke=b(".kf-view-form"),He=b(".kf-view-form .kf-body"),Ce=b(".kf-view-form .kf-foot"),Be=b(".kf-view-history"),_e=b(".kf-history-main"),Ae=b(".kf-history-list"),vt=b(".kf-history-empty"),ze=b(".kf-convo"),yt=b(".kf-convo-cat"),Z=b(".kf-thread"),Ie=b(".kf-reply-box"),pe=b(".kf-reply-input"),fe=b(".kf-reply-file"),Re=b(".kf-reply-upload"),re=b(".kf-reply-send"),wt=b(".kf-reply-counter"),De=b(".kf-convo-closed"),Et=b(".kf-back"),Pe=b(".kf-fab-badge"),Fe=b(".kf-tab-badge"),Lt=b(".kf-session-bar"),$t=b(".kf-session-email"),Mt=b(".kf-session-change"),je=o.querySelector(".kf-otp"),Y=o.querySelector(".kf-otp-email"),se=o.querySelector(".kf-otp-send"),ue=o.querySelector(".kf-otp-step2"),F=o.querySelector(".kf-otp-code"),te=o.querySelector(".kf-otp-verify"),O=[],G=[],X=[];function xe(){let e=d.support;if(!e||e.unlimited||e.endsAt===null){K.hidden=!0;return}K.hidden=!1;let t=Math.ceil((e.endsAt-Date.now())/864e5);if(t<=0)K.dataset.expired="1",K.innerHTML=`${y.alert}<span>${a(r.supportEnded)}</span>`;else{K.dataset.expired="0";let i=t===1?r.supportLastDay:r.supportLeft(t);K.innerHTML=`${y.clock}<span>${a(i)}</span>`}}let Oe=`kf_history_${n.widgetKey}`,ve=`kf_session_${n.widgetKey}`,Ne=`kf_seen_${n.widgetKey}`;function ye(){try{return JSON.parse(localStorage.getItem(Oe)||"[]")}catch(e){return[]}}function Tt(e){let t=ye();t.unshift(e),localStorage.setItem(Oe,JSON.stringify(t.slice(0,50)))}function We(){try{return JSON.parse(localStorage.getItem(ve)||"null")}catch(e){return null}}function qe(e){e?localStorage.setItem(ve,JSON.stringify(e)):localStorage.removeItem(ve)}function Ke(){try{return JSON.parse(localStorage.getItem(Ne)||"{}")}catch(e){return{}}}function St(e){let t=Ke();t[e]=Date.now(),localStorage.setItem(Ne,JSON.stringify(t)),Ge()}function Ht(e){return new Date(e).toLocaleDateString(c==="en"?"en-US":"tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}function Ct(e){return new Date(e).toLocaleTimeString(c==="en"?"en-US":"tr-TR",{hour:"2-digit",minute:"2-digit"})}function Bt(e){return new Date(e).toLocaleDateString(c==="en"?"en-US":"tr-TR",{day:"numeric",month:"long",year:"numeric"})}let Ue={};function Ye(){var i;let e=We(),t=new Set;for(let m of(i=e==null?void 0:e.conversations)!=null?i:[])t.add(m.token);for(let m of ye())m.token&&t.add(m.token);return Array.from(t)}function we(e){var i;let t=Ue[e];return t?((i=Ke()[e])!=null?i:0)<t:!1}function _t(){return Ye().filter(we).length}function Ge(){let e=_t();Pe.hidden=e===0,Pe.textContent=e>9?"9+":String(e),Fe.hidden=e===0,Fe.textContent=e>9?"9+":String(e)}async function Xe(){var t;if(!w)return;let e=Ye().slice(0,50);if(e.length)try{let i=await fetch(`${n.base}/api/v1/conversation/status`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:n.widgetKey,tokens:e})});if(!i.ok)return;let m=await i.json();for(let[g,$]of Object.entries((t=m.statuses)!=null?t:{}))$.last_admin_reply_at&&(Ue[g]=$.last_admin_reply_at);Ge()}catch(i){}}function Je(e){let t=document.createElement("li");return t.className="kf-history-item",e.unread&&(t.dataset.unread="1"),t.innerHTML=`
      <div class="kf-hi-left">
        <span class="kf-hi-cat">${a(e.title)}${e.unread?`<span class="kf-hi-dot" title="${a(r.newReplyBadge)}"></span>`:""}</span>
        <span class="kf-hi-page">${a(e.snippet)}</span>
      </div>
      <div class="kf-hi-right">
        <span class="kf-hi-date">${a(Ht(e.date))}</span>
      </div>`,w&&e.token?t.addEventListener("click",()=>tt(e.token)):t.style.cursor="default",t}function ae(){var m;let e=We();Ae.innerHTML="",Lt.hidden=!e,e&&($t.textContent=e.email),je&&(je.hidden=!!e);let t=[],i=new Set;for(let g of(m=e==null?void 0:e.conversations)!=null?m:[])i.add(g.token),t.push(Je({title:g.category,snippet:g.last_message,date:g.last_activity_at,token:g.token,unread:we(g.token)}));for(let g of ye())g.token&&i.has(g.token)||t.push(Je({title:g.category,snippet:g.page,date:g.date,token:g.token,id:g.id,unread:g.token?we(g.token):!1}));vt.hidden=t.length>0,t.forEach(g=>Ae.appendChild(g))}function Ve(){He.hidden=!1,Ce.hidden=!1}function Ze(){B.dataset.active="1",E.dataset.active="0",ke.hidden=!1,Be.hidden=!0,Ve(),K.hidden=!d.support,xe(),S("",null)}function At(){B.dataset.active="0",E.dataset.active="1",ke.hidden=!0,Be.hidden=!1,K.hidden=!0,S("",null),et(),ae()}B.addEventListener("click",Ze),E.addEventListener("click",At);function zt(e,t){var i;if((i=navigator.clipboard)==null||i.writeText(e).catch(()=>{}),t){t.classList.add("copied");let m=t.innerHTML;t.innerHTML=y.check,setTimeout(()=>{t.classList.remove("copied"),t.innerHTML=m},1600)}}function S(e,t){if(!t){q.hidden=!0,q.innerHTML="";return}q.hidden=!1,q.className=`kf-msg kf-${t}`,q.innerHTML=`${t==="ok"?y.check:y.alert} ${a(e)}`}function J(){let e=O.length>=V;xt.textContent=`${O.length} / ${V}`,P.disabled=e,R.disabled=e,C.disabled=e,Q.disabled=e,Se.innerHTML="",O.forEach((t,i)=>{let m=document.createElement("div");m.className="kf-thumb",m.innerHTML=`<img src="${t.url}" alt="ek"><button class="kf-thumb-del" type="button" aria-label="Kald\u0131r">${y.x}</button>`,m.querySelector("button").addEventListener("click",()=>{if(URL.revokeObjectURL(t.url),t.annotationId){let g=G.findIndex($=>$.id===t.annotationId);g>=0&&G.splice(g,1)}O.splice(i,1),J(),le()}),Se.appendChild(m)})}function le(){he.hidden=G.length===0,he.innerHTML="",G.forEach((e,t)=>{let i=document.createElement("div");i.className="kf-ann-item",i.innerHTML=`
        <div class="kf-ann-pin">${t+1}</div>
        <div class="kf-ann-main">
          <div class="kf-ann-selector">${a(e.selector)}</div>
          <div class="kf-ann-note">${a(e.value)}</div>
        </div>
        <button class="kf-ann-del" type="button" aria-label="Kald\u0131r">${y.x}</button>`,i.querySelector("button").addEventListener("click",()=>{for(let m=O.length-1;m>=0;m--)O[m].annotationId===e.id&&(URL.revokeObjectURL(O[m].url),O.splice(m,1));G.splice(t,1),J(),le()}),he.appendChild(i)})}function be(e,t,i){O.length>=V||(O.push({blob:e,kind:t,annotationId:i,url:URL.createObjectURL(e)}),J())}function Ee(){o.dataset.open="1",ke.hidden||setTimeout(()=>ee.focus(),60)}function de(){o.dataset.open="0",Ze()}function Qe(){o.dataset.open==="1"?de():Ee()}h.addEventListener("click",Qe),T.addEventListener("click",de),_.addEventListener("click",de),Q.addEventListener("click",()=>ne.click()),ne.addEventListener("change",()=>{var e;Array.from((e=ne.files)!=null?e:[]).filter(t=>t.type.startsWith("image/")).forEach(t=>be(t,"upload")),ne.value=""}),P.addEventListener("click",async()=>{P.disabled=!0,P.innerHTML=`${y.camera} ${a(c==="en"?"Waiting\u2026":"Bekleniyor\u2026")}`;try{let e=await ft(f);e?be(e,"screenshot"):S(c==="en"?"Screen share cancelled.":"Ekran payla\u015F\u0131m\u0131 iptal edildi.","err")}catch(e){S(c==="en"?"Couldn't capture screen.":"Ekran yakalanamad\u0131.","err")}finally{P.innerHTML=`${y.camera} ${a(c==="en"?"Full screen":"T\xFCm ekran")}`,J()}}),R.addEventListener("click",async()=>{R.disabled=!0,R.innerHTML=`${y.crop} ${a(c==="en"?"Waiting\u2026":"Bekleniyor\u2026")}`;try{let e=await mt(f);e?be(e,"screenshot"):S(c==="en"?"Area selection cancelled.":"Alan se\xE7imi iptal edildi.","err")}catch(e){S(c==="en"?"Couldn't capture screen.":"Ekran yakalanamad\u0131.","err")}finally{R.innerHTML=`${y.crop} ${a(c==="en"?"Select area":"Alan se\xE7")}`,J()}}),C.addEventListener("click",async()=>{if(O.length>=V){S(c==="en"?"Attachment limit reached.":"Ek s\u0131n\u0131r\u0131na ula\u015F\u0131ld\u0131.","err");return}de(),C.disabled=!0,C.innerHTML=`${y.target} ${a(c==="en"?"Waiting\u2026":"Bekleniyor\u2026")}`;let e=await ut(f);if(!e){C.innerHTML=`${y.target} ${a(c==="en"?"Pick element":"\xD6\u011Fe se\xE7")}`,C.disabled=!1,Ee(),S(c==="en"?"Screen capture was cancelled.":"Ekran payla\u015F\u0131m\u0131 iptal edildi.","err"),J();return}try{let t=G.length+1,i=await tn(f,c,t);if(i){let m=await bt(e,{x:i.rect.x,y:i.rect.y,w:i.rect.width,h:i.rect.height},t);G.push(i),m?be(m,"screenshot",i.id):S(c==="en"?"Element screenshot couldn't be captured.":"\xD6\u011Fe ekran g\xF6r\xFCnt\xFCs\xFC al\u0131namad\u0131.","err"),le()}}finally{pt(e),C.innerHTML=`${y.target} ${a(c==="en"?"Pick element":"\xD6\u011Fe se\xE7")}`,C.disabled=!1,Ee(),J()}});function It(){let e=o.querySelectorAll(".kf-cf"),t=[];for(let i of Array.from(e)){let m=i.dataset.cfLabel||"",$=i.dataset.cfType==="checkbox"?i.checked?c==="en"?"Yes":"Evet":"":i.value.trim();if(i.hasAttribute("required")&&!$)return i.focus(),{ok:!1,values:[]};$&&t.push({label:m,value:$})}return{ok:!0,values:t}}function Rt(){d.canSubmit||(H.disabled=!0,S(ge(d.blockedReason,c),"err"))}async function Dt(){var m,g,$,v;if(!d.canSubmit){S(ge(d.blockedReason,c),"err");return}let e=ee.value.trim();if(!e){S(c==="en"?"Please write a description.":"L\xFCtfen bir a\xE7\u0131klama yaz.","err"),ee.focus();return}let t=(U==null?void 0:U.value.trim())||"";if(U!=null&&U.hasAttribute("required")&&!t){S(c==="en"?"Please enter your email.":"L\xFCtfen e-postan\u0131 gir.","err"),U.focus();return}let i=It();if(!i.ok){S(c==="en"?"Please fill required fields.":"L\xFCtfen zorunlu alanlar\u0131 doldur.","err");return}H.disabled=!0,H.textContent=c==="en"?"Sending\u2026":"G\xF6nderiliyor\u2026",S("",null);try{let A=await fetch(`${n.base}/api/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:n.widgetKey,domain:p.domain,category:Te.value,message:e,email:t||void 0,page_url:location.href,viewport:`${window.innerWidth}x${window.innerHeight}`,wp_user:l.user,locale:c,custom_fields:[...i.values,...G]})}),W=await A.json();if(!A.ok||!W.ok){S(ge((m=W==null?void 0:W.error)!=null?m:null,c),"err");return}let jt=new Map(((g=W.annotation_replies)!=null?g:[]).map(z=>[z.id,z.reply_id])),ce=0;for(let z of O){let ie=new FormData;ie.append("widget_key",n.widgetKey),ie.append("domain",p.domain),ie.append("kind",z.kind);let Kt=z.blob.type==="image/png"?"png":"jpg";ie.append("file",z.blob,`${z.kind}.${Kt}`);let dt=z.annotationId?jt.get(z.annotationId):void 0;dt&&ie.append("reply_id",dt),await fetch(`${n.base}/api/v1/feedback/${W.feedback_id}/attachment`,{method:"POST",body:ie}).then(Ut=>Ut.ok).catch(()=>!1)||ce++}let $e=W.feedback_id,st=W.token;Tt({id:$e,token:st,category:Te.value,page:location.pathname,date:Date.now()});let Ot=ce>0?`<div class="kf-msg kf-warn">${y.alert} ${a(c==="en"?`${ce} attachment${ce>1?"s":""} could not be uploaded.`:`${ce} ek y\xFCklenemedi.`)}</div>`:"",lt=$e,Nt=c==="en"?"Reference":"Referans no",Wt=`#${$e.slice(0,8)}`,qt=w&&st?`<div class="kf-token-hint">${a(r.tokenHint)}</div>`:"";He.hidden=!0,Ce.hidden=!0,K.hidden=!0,q.hidden=!1,q.className="kf-msg kf-ok kf-success",q.innerHTML=`
        <div class="kf-success-head">${y.check}<span>${a(M.successMessage)}</span></div>
        <div class="kf-token-box">
          <span class="kf-token-label">${a(Nt)}</span>
          <div class="kf-token-row">
            <span class="kf-token-val" title="${a(lt)}">${a(Wt)}</span>
          </div>
          <button class="kf-btn kf-btn-primary kf-token-copy" type="button">${y.copy}<span>${a(r.copy)}</span></button>
          ${qt}
        </div>
        ${Ot}
        <button class="kf-btn kf-btn-ghost kf-new-submit" type="button">${a(r.newSubmission)}</button>`,($=q.querySelector(".kf-token-copy"))==null||$.addEventListener("click",z=>zt(lt,z.currentTarget)),(v=q.querySelector(".kf-new-submit"))==null||v.addEventListener("click",()=>{Ve(),K.hidden=!d.support,xe(),S("",null),ee.focus()}),ee.value="",U&&(U.value=t),o.querySelectorAll(".kf-cf").forEach(z=>{z.dataset.cfType==="checkbox"?z.checked=!1:z.value=""}),O.splice(0).forEach(z=>URL.revokeObjectURL(z.url)),G.splice(0),J(),le()}catch(A){S(c==="en"?"Connection error. Please try again.":"Ba\u011Flant\u0131 hatas\u0131. L\xFCtfen tekrar dene.","err")}finally{H.disabled=!1,H.textContent=M.submitLabel}}H.addEventListener("click",Dt);let oe=null;function et(){oe=null,ze.hidden=!0,_e.hidden=!1,X.splice(0)}Et.addEventListener("click",()=>{et(),ae()});async function tt(e){oe=e,_e.hidden=!0,ze.hidden=!1,Z.innerHTML='<p class="kf-history-empty">\u2026</p>',De.hidden=!0,Ie.hidden=!0;try{let t=await fetch(`${n.base}/api/v1/conversation/${encodeURIComponent(e)}`);if(t.status===404){Z.innerHTML=`<p class="kf-history-empty">${a(r.notFound)}</p>`;return}if(!t.ok){Z.innerHTML=`<p class="kf-history-empty">${a(r.loadError)}</p>`;return}let i=await t.json();Ft(i.conversation,e),St(e);let m=!!i.can_reply;Ie.hidden=!m,De.hidden=m,Le()}catch(t){Z.innerHTML=`<p class="kf-history-empty">${a(r.loadError)}</p>`}}function Pt(e){var i;let t=(i=e.imgs)!=null&&i.length?`<div class="kf-convo-imgs">${e.imgs.map(m=>`<img src="${a(m.url)}" alt="ek">`).join("")}</div>`:"";return`<div class="kf-msg-row ${e.mine?"kf-mine":"kf-theirs"}">
      <div class="kf-bubble">
        <div class="kf-bubble-body">${a(e.body)}</div>${t}
      </div>
      <div class="kf-bubble-time">${a(e.author)} \xB7 ${a(Ct(e.ts))}</div>
    </div>`}function Ft(e,t){yt.textContent=e.category;let i=e.attachments.filter(v=>!v.reply_id).map(v=>({url:v.url})),m=[{author:"user",message:e.message,created_at:e.created_at,imgs:i},...e.replies.map(v=>({...v,imgs:e.attachments.filter(A=>A.reply_id===v.id).map(A=>({url:A.url}))}))],g="",$="";for(let v of m){let A=Bt(v.created_at);A!==$&&(g+=`<div class="kf-day-sep"><span>${a(A)}</span></div>`,$=A);let W=v.author==="user";g+=Pt({author:W?r.you:r.support,ts:v.created_at,body:v.message,mine:W,imgs:v.imgs})}Z.innerHTML=g,Z.querySelectorAll(".kf-convo-imgs img").forEach(v=>{v.addEventListener("click",()=>window.open(v.src,"_blank"))}),Z.scrollTop=Z.scrollHeight}function Le(){wt.textContent=`${X.length} / ${V}`,Re.toggleAttribute("disabled",X.length>=V)}Re.addEventListener("click",()=>fe.click()),fe.addEventListener("change",()=>{var e;Array.from((e=fe.files)!=null?e:[]).filter(t=>t.type.startsWith("image/")).slice(0,V-X.length).forEach(t=>X.push(t)),fe.value="",Le()});async function nt(){var t,i,m;if(!oe)return;let e=pe.value.trim();if(!e&&X.length===0){pe.focus();return}re.disabled=!0,re.textContent=r.sending;try{let g=null;if(e||X.length>0){let $=await fetch(`${n.base}/api/v1/conversation/${encodeURIComponent(oe)}/reply`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e||r.attachmentSent,page_url:location.href})});if(!$.ok){let A=await $.json().catch(()=>({}));S(ge((t=A==null?void 0:A.error)!=null?t:null,c),"err");return}let v=await $.json().catch(()=>null);g=(m=(i=v==null?void 0:v.reply)==null?void 0:i.id)!=null?m:null}for(let $ of X){let v=new FormData;v.append("file",$,$.name||"image.jpg"),g&&v.append("reply_id",g),await fetch(`${n.base}/api/v1/conversation/${encodeURIComponent(oe)}/attachment`,{method:"POST",body:v}).catch(()=>{})}pe.value="",X.splice(0),Le(),await tt(oe)}finally{re.disabled=!1,re.textContent=r.send}}re.addEventListener("click",nt),pe.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),nt())}),se==null||se.addEventListener("click",async()=>{let e=Y==null?void 0:Y.value.trim();if(!e||!e.includes("@")){Y==null||Y.focus();return}se.disabled=!0;try{await fetch(`${n.base}/api/v1/conversation/request-code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:n.widgetKey,domain:p.domain,email:e})}).catch(()=>{}),S(r.codeSent,"ok"),ue&&(ue.hidden=!1),F==null||F.focus()}finally{se.disabled=!1}});async function at(){var i;let e=Y==null?void 0:Y.value.trim(),t=F==null?void 0:F.value.trim();if(!e||!t||t.length!==6){F==null||F.focus();return}te&&(te.disabled=!0);try{let m=await fetch(`${n.base}/api/v1/conversation/verify-code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:n.widgetKey,email:e,code:t})}),g=await m.json().catch(()=>({}));if(!m.ok||!g.ok){S(r.invalidCode,"err");return}qe({email:e,conversations:(i=g.conversations)!=null?i:[],verifiedAt:Date.now()}),F&&(F.value=""),ue&&(ue.hidden=!0),S("",null),Xe().then(ae),ae()}catch(m){S(r.invalidCode,"err")}finally{te&&(te.disabled=!1)}}te==null||te.addEventListener("click",at),F==null||F.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),at())}),Mt.addEventListener("click",()=>{qe(null),ae()}),window.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="/"&&(e.preventDefault(),Qe()),e.key==="Escape"&&o.dataset.open==="1"&&de()}),xe(),J(),le(),Rt(),Xe().then(ae)}function a(n){return n.replace(/[&<>"']/g,l=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[l])}function ht(n){let l=[],u=n;for(;u&&u.nodeType===1&&u!==document.body&&l.length<5;){let p=u.tagName.toLowerCase();if(u.id){p+=`#${kt(u.id)}`,l.unshift(p);break}let d=Array.from(u.classList).filter(k=>k&&!k.startsWith("rivesio-")&&!k.startsWith("kf-")).slice(0,2);d.length&&(p+=`.${d.map(kt).join(".")}`);let f=u.parentElement;if(f){let k=Array.from(f.children).filter(s=>s.tagName===u.tagName);k.length>1&&(p+=`:nth-of-type(${k.indexOf(u)+1})`)}l.unshift(p),u=f}return l.join(" > ")||n.tagName.toLowerCase()}function kt(n){let l=window.CSS;return l!=null&&l.escape?l.escape(n):n.replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function en(n){return(n.textContent||"").replace(/\s+/g," ").trim().slice(0,140)}function tn(n,l,u){return new Promise(p=>{let d=document.createElement("div");d.className="rivesio-element-highlight",Object.assign(d.style,{position:"fixed",zIndex:"2147483645",pointerEvents:"none",border:"2px solid #3b82f6",background:"rgba(59,130,246,.14)",borderRadius:"8px",boxShadow:"0 0 0 9999px rgba(15,23,42,.18)",transition:"left .08s, top .08s, width .08s, height .08s",display:"none"});let f=document.createElement("div");Object.assign(f.style,{position:"fixed",zIndex:"2147483646",pointerEvents:"none",background:"#2563eb",color:"#fff",borderRadius:"999px",padding:"4px 9px",font:"600 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",boxShadow:"0 8px 18px rgba(37,99,235,.28)",display:"none"}),f.textContent=l==="en"?"Click an element":"\xD6\u011Feye t\u0131kla",document.body.append(d,f),n.style.visibility="hidden";let k=null,s=null,o=!1;function D(x){o||(o=!0,c(),p(x))}function c(){n.style.visibility="",d.remove(),f.remove(),s==null||s.remove(),window.removeEventListener("mousemove",r,!0),window.removeEventListener("click",I,!0),window.removeEventListener("keydown",w,!0)}function M(x){if(k=x,!x){d.style.display="none",f.style.display="none";return}let L=x.getBoundingClientRect();d.style.display="block",d.style.left=`${Math.max(0,L.left)}px`,d.style.top=`${Math.max(0,L.top)}px`,d.style.width=`${Math.max(0,L.width)}px`,d.style.height=`${Math.max(0,L.height)}px`,f.style.display="block",f.style.left=`${Math.min(window.innerWidth-132,Math.max(8,L.left))}px`,f.style.top=`${Math.max(8,L.top-32)}px`}function r(x){if(s)return;let L=document.elementFromPoint(x.clientX,x.clientY);if(!L||L===n||n.contains(L)){M(null);return}M(L)}function I(x){s!=null&&s.contains(x.target)||(x.preventDefault(),x.stopPropagation(),k&&N(k))}function w(x){x.key==="Escape"&&(x.preventDefault(),D(null))}function N(x){let L=x.getBoundingClientRect();s==null||s.remove(),s=document.createElement("div");let b=Math.min(320,window.innerWidth-24),h=190,T=window.innerHeight-L.bottom-10,B=L.top-10,E;T>=h||T>=B?E=Math.min(window.innerHeight-h-8,L.bottom+10):E=Math.max(8,L.top-h-10);let _=Math.min(window.innerWidth-b-8,Math.max(8,L.left));Object.assign(s.style,{position:"fixed",zIndex:"2147483647",width:`${b}px`,left:`${_}px`,top:`${Math.max(8,E)}px`,background:"#ffffff",border:"1px solid rgba(15,23,42,.14)",borderRadius:"12px",boxShadow:"0 20px 50px rgba(15,23,42,.22)",padding:"12px",font:"13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",color:"#0f172a"}),s.innerHTML=`
        <div style="font-weight:700;margin-bottom:6px">${l==="en"?"Add note to element":"\xD6\u011Feye not ekle"}</div>
        <div style="font-size:11px;color:#64748b;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a(ht(x))}</div>
        <textarea style="width:100%;min-height:78px;resize:none;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font:13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;outline:none" placeholder="${l==="en"?"What should change here?":"Burada ne de\u011Fi\u015Fmeli?"}"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
          <button type="button" data-cancel style="border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:7px 10px;font-weight:600;color:#475569;cursor:pointer">${l==="en"?"Cancel":"Vazge\xE7"}</button>
          <button type="button" data-save style="border:0;background:#2563eb;border-radius:8px;padding:7px 12px;font-weight:700;color:#fff;cursor:pointer">${l==="en"?"Add":"Ekle"}</button>
        </div>`,document.body.appendChild(s);let H=s.querySelector("textarea");H.focus(),s.querySelector("[data-cancel]").addEventListener("click",()=>D(null)),s.querySelector("[data-save]").addEventListener("click",()=>{let P=H.value.trim();if(!P){H.focus();return}let R=ht(x),C=x.getBoundingClientRect();D({id:Zt(),kind:"element_annotation",index:u,label:l==="en"?"Element note":"\xD6\u011Fe notu",value:P,selector:R,tagName:x.tagName.toLowerCase(),text:en(x),rect:{x:Math.round(C.left),y:Math.round(C.top),width:Math.round(C.width),height:Math.round(C.height),viewportWidth:window.innerWidth,viewportHeight:window.innerHeight}})})}window.addEventListener("mousemove",r,!0),window.addEventListener("click",I,!0),window.addEventListener("keydown",w,!0)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",gt):gt();})();
