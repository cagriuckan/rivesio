"use strict";(()=>{var Lt=`
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
  z-index: var(--kf-z, 99999);
  --kf-offset-x: 20px;
  --kf-offset-y: 20px;
  --kf-offset-x-mobile: 16px;
  --kf-offset-y-mobile: 16px;
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

.kf-root[data-pos="bottom-right"] { bottom: var(--kf-offset-y); right: var(--kf-offset-x); }
.kf-root[data-pos="bottom-left"]  { bottom: var(--kf-offset-y); left: var(--kf-offset-x); }

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
.kf-fab .kf-logo,
.kf-title-icon .kf-logo {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  object-fit: cover;
  flex-shrink: 0;
  display: block;
  background: rgba(255,255,255,.18);
}

/* Icon-only FAB: compact circular button, no text label. */
.kf-root[data-fab="icon"] .kf-fab { padding: 13px; border-radius: 50%; position: relative; }
.kf-root[data-fab="icon"] .kf-fab > span:not(.kf-fab-badge) { display: none; }
.kf-root[data-fab="icon"] .kf-fab svg { width: 18px; height: 18px; }
.kf-root[data-fab="icon"] .kf-fab .kf-logo { width: 22px; height: 22px; border-radius: 7px; }
.kf-root[data-has-logo="1"][data-fab="icon"] .kf-fab { padding: 8px; }

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
  overflow: hidden;
}
.kf-title-icon svg { width: 13px; height: 13px; }
.kf-title-icon .kf-logo {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  background: transparent;
}
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
  .kf-root[data-pos="bottom-right"] {
    bottom: var(--kf-offset-y-mobile);
    right: var(--kf-offset-x-mobile);
  }
  .kf-root[data-pos="bottom-left"] {
    bottom: var(--kf-offset-y-mobile);
    left: var(--kf-offset-x-mobile);
  }
  .kf-panel { width: calc(100vw - 24px); max-width: none; border-radius: var(--radius-lg); }
  .kf-fab > span:not(.kf-fab-badge) { display: none; }
  .kf-fab { padding: 12px; border-radius: 50%; }
  .kf-fab svg { width: 18px; height: 18px; }
  .kf-fab .kf-logo { width: 22px; height: 22px; border-radius: 7px; }
  .kf-root[data-has-logo="1"] .kf-fab { padding: 8px; }
}
`;async function We(t){let r;try{r=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser",frameRate:1},audio:!1,preferCurrentTab:!0,selfBrowserSurface:"include"})}catch(n){return null}let[i]=r.getVideoTracks();t&&(t.style.visibility="hidden");let f=document.createElement("video");f.muted=!0,f.playsInline=!0,f.srcObject=r,await new Promise(n=>{f.onloadedmetadata=()=>n()}),await f.play(),await new Promise(n=>requestAnimationFrame(()=>requestAnimationFrame(()=>n())));let{videoWidth:p,videoHeight:u}=f,h=document.createElement("canvas");return h.width=p,h.height=u,h.getContext("2d").drawImage(f,0,0,p,u),f.pause(),f.srcObject=null,i.stop(),t&&(t.style.visibility=""),{bitmap:await createImageBitmap(h),scaleX:p/window.innerWidth,scaleY:u/window.innerHeight}}function St(t){t==null||t.bitmap.close()}function Le(t,r,i,f,p,u){t.beginPath(),t.moveTo(r+u,i),t.arcTo(r+f,i,r+f,i+p,u),t.arcTo(r+f,i+p,r,i+p,u),t.arcTo(r,i+p,r,i,u),t.arcTo(r,i,r+f,i,u),t.closePath()}async function Mt(t){let r=await We(t);if(!r)return null;let{bitmap:i}=r,f=document.createElement("canvas");return f.width=i.width,f.height=i.height,f.getContext("2d").drawImage(i,0,0),i.close(),new Promise(p=>f.toBlob(p,"image/png"))}async function $t(t){return We(t)}function Tt(t,r,i){let{bitmap:f,scaleX:p,scaleY:u}=t,h=document.createElement("canvas");h.width=f.width,h.height=f.height;let l=h.getContext("2d");l.drawImage(f,0,0);let n=Math.round(r.x*p),R=Math.round(r.y*u),q=Math.round(r.w*p),F=Math.round(r.h*u),$=Math.max(3,Math.round(2*Math.max(p,u))),B=Math.max(14,Math.round(12*Math.max(p,u)));l.save(),l.fillStyle="rgba(59, 130, 246, 0.18)",Le(l,n,R,q,F,B),l.fill(),l.strokeStyle="#3b82f6",l.lineWidth=$,Le(l,n+$/2,R+$/2,Math.max(0,q-$),Math.max(0,F-$),B),l.stroke();let c=Math.max(24,Math.round(22*Math.max(p,u))),S=Math.min(h.width-c-$,Math.max($,n+q-c/2)),s=Math.max($,R-c/2);return l.fillStyle="#3b82f6",l.beginPath(),l.arc(S+c/2,s+c/2,c/2,0,Math.PI*2),l.fill(),l.strokeStyle="#ffffff",l.lineWidth=Math.max(2,Math.round(1.5*Math.max(p,u))),l.stroke(),l.fillStyle="#ffffff",l.font=`700 ${Math.round(c*.5)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,l.textAlign="center",l.textBaseline="middle",l.fillText(String(i),S+c/2,s+c/2+1),l.restore(),new Promise(E=>h.toBlob(E,"image/png"))}async function Ht(t){let r=await We(t);return r?tn(r):null}function tn({bitmap:t,scaleX:r,scaleY:i}){return new Promise(f=>{let p=window.innerWidth,u=window.innerHeight,h=Math.min(window.devicePixelRatio||1,2),l=document.createElement("canvas");l.width=p*h,l.height=u*h,Object.assign(l.style,{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",zIndex:"2147483646",cursor:"crosshair",userSelect:"none"}),document.body.appendChild(l);let n=l.getContext("2d");n.scale(h,h);function R(){n.drawImage(t,0,0,t.width,t.height,0,0,p,u),n.fillStyle="rgba(0,0,0,0.38)",n.fillRect(0,0,p,u)}function q(){let g="S\xFCr\xFCkle: alan se\xE7   \u2022   B\u0131rak: onayla   \u2022   Esc: iptal";n.font="13px -apple-system, system-ui, sans-serif";let H=n.measureText(g).width+24,w=36,T=(p-H)/2,z=u-w-20;n.fillStyle="rgba(15,23,42,0.72)",Le(n,T,z,H,w,10),n.fill(),n.fillStyle="#f1f5f9",n.textAlign="center",n.textBaseline="middle",n.fillText(g,p/2,z+w/2),n.textAlign="left",n.textBaseline="alphabetic"}function F(g,L,H,w){n.save(),n.beginPath(),n.rect(g,L,H,w),n.clip(),n.drawImage(t,0,0,t.width,t.height,0,0,p,u),n.restore(),n.strokeStyle="#6366f1",n.lineWidth=2,n.setLineDash([6,3]),n.strokeRect(g+1,L+1,H-2,w-2),n.setLineDash([]);let T=7;n.fillStyle="#6366f1",[[g,L],[g+H-T,L],[g,L+w-T],[g+H-T,L+w-T]].forEach(([U,$e])=>n.fillRect(U,$e,T,T)),n.font="bold 12px -apple-system, system-ui, sans-serif";let z=`${Math.round(H)} \xD7 ${Math.round(w)}`,k=n.measureText(z).width+14,O=22,A=Math.min(g,p-k-4),j=L>O+8?L-O-4:L+w+4;n.fillStyle="#6366f1",Le(n,A,j,k,O,5),n.fill(),n.fillStyle="#fff",n.textBaseline="middle",n.fillText(z,A+7,j+O/2),n.textBaseline="alphabetic"}let $=0,B=0,c=!1;function S(g,L){if(R(),q(),g===void 0||L===void 0)return;let H=Math.min($,g),w=Math.min(B,L),T=Math.abs(g-$),z=Math.abs(L-B);T>1&&z>1&&F(H,w,T,z)}S(),l.addEventListener("mousedown",g=>{g.preventDefault(),$=g.clientX,B=g.clientY,c=!0}),l.addEventListener("mousemove",g=>{c&&S(g.clientX,g.clientY)}),l.addEventListener("mouseup",g=>{if(!c)return;c=!1;let L=Math.min($,g.clientX),H=Math.min(B,g.clientY),w=Math.abs(g.clientX-$),T=Math.abs(g.clientY-B);if(E(),w<10||T<10){t.close(),f(null);return}oe(L,H,w,T)});function s(g){g.key==="Escape"&&(E(),t.close(),f(null))}window.addEventListener("keydown",s,!0);function E(){l.remove(),window.removeEventListener("keydown",s,!0)}function oe(g,L,H,w){let T=Math.round(g*r),z=Math.round(L*i),k=Math.round(H*r),O=Math.round(w*i),A=document.createElement("canvas");A.width=k,A.height=O,A.getContext("2d").drawImage(t,T,z,k,O,0,0,k,O),t.close(),A.toBlob(j=>f(j),"image/png")}})}var nn={tr:{fabLabel:"Geri bildirim",title:"Geri bildirim",categoryLabel:"Kategori",messageLabel:"A\xE7\u0131klama",messagePlaceholder:"Ne eklensin ya da nerede bir sorun var?",submitLabel:"G\xF6nder",successMessage:"Te\u015Fekk\xFCrler! Geri bildirimin al\u0131nd\u0131.",errorMessage:"G\xF6nderilemedi. L\xFCtfen tekrar dene."},en:{fabLabel:"Feedback",title:"Feedback",categoryLabel:"Category",messageLabel:"Description",messagePlaceholder:"What should be added, or where is the problem?",submitLabel:"Send",successMessage:"Thanks! Your feedback was received.",errorMessage:"Couldn't send. Please try again."}},on={tr:{tabForm:"G\xF6nderim",tabHistory:"Ge\xE7mi\u015F",historyEmpty:"Hen\xFCz bir konu\u015Fman yok.",otpTitle:"Ge\xE7mi\u015Fine eri\u015F",otpHint:"E-postana g\xF6nderece\u011Fimiz 6 haneli kodla t\xFCm konu\u015Fmalar\u0131n\u0131 g\xF6rebilirsin.",sendCode:"Kod g\xF6nder",codePlaceholder:"6 haneli kod",verify:"Do\u011Frula",codeSent:"Kod e-postana g\xF6nderildi.",invalidCode:"Kod hatal\u0131 ya da s\xFCresi doldu.",changeEmail:"De\u011Fi\u015Ftir",newReplyBadge:"Yeni yan\u0131t",open:"A\xE7",emailPlaceholder:"E-posta adresin",supportUnlimited:"S\u0131n\u0131rs\u0131z destek",supportLeft:t=>`Destek: ${t} g\xFCn kald\u0131`,supportLastDay:"Destek bug\xFCn sona eriyor",supportEnded:"Destek s\xFCresi doldu",emailLabel:"E-posta",emailHint:"Yan\u0131tlar\u0131 takip etmek ve kodunu kurtarmak i\xE7in.",tokenSaved:"Eri\u015Fim kodun",tokenHint:"Konu\u015Fmana Ge\xE7mi\u015F sekmesinden e-postanla eri\u015Febilirsin.",replyPlaceholder:"Yan\u0131t\u0131n\u0131 yaz\u2026",send:"G\xF6nder",sending:"G\xF6nderiliyor\u2026",you:"Sen",support:"Destek",loadError:"Konu\u015Fma y\xFCklenemedi.",notFound:"Konu\u015Fma bulunamad\u0131. Kodu kontrol et.",closedNotice:"Destek s\xFCresi doldu\u011Fu i\xE7in yeni yan\u0131t eklenemiyor.",back:"Geri",copied:"Kopyaland\u0131",copy:"Kodu kopyala",newSubmission:"Yeni g\xF6nderim",addImage:"G\xF6rsel ekle",attachmentSent:"\u{1F4CE} Ek g\xF6nderildi",poweredBy:"\xC7al\u0131\u015Ft\u0131rd\u0131\u011F\u0131m\u0131z platform"},en:{tabForm:"Submit",tabHistory:"History",historyEmpty:"You have no conversations yet.",otpTitle:"Access your history",otpHint:"We'll email you a 6-digit code to see all your conversations.",sendCode:"Send code",codePlaceholder:"6-digit code",verify:"Verify",codeSent:"The code was sent to your email.",invalidCode:"Wrong or expired code.",changeEmail:"Change",newReplyBadge:"New reply",open:"Open",emailPlaceholder:"Your email",supportUnlimited:"Unlimited support",supportLeft:t=>`Support: ${t} days left`,supportLastDay:"Support ends today",supportEnded:"Support period ended",emailLabel:"Email",emailHint:"To follow replies and recover your code.",tokenSaved:"Your access code",tokenHint:"You can return to this conversation from the History tab with your email.",replyPlaceholder:"Write your reply\u2026",send:"Send",sending:"Sending\u2026",you:"You",support:"Support",loadError:"Couldn't load the conversation.",notFound:"Conversation not found. Check the code.",closedNotice:"Support period ended; new replies are disabled.",back:"Back",copied:"Copied",copy:"Copy code",newSubmission:"New submission",addImage:"Add image",attachmentSent:"\u{1F4CE} Attachment sent",poweredBy:"Powered by"}},an='<svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="7" fill="#0B1437"/><ellipse cx="12" cy="11.2" rx="6.2" ry="5" fill="#fff"/><path d="M8.5 14.5 L7 18 L11.5 15.4 Z" fill="#fff"/><circle cx="9.4" cy="11.2" r="1" fill="#0B1437"/><circle cx="12" cy="11.2" r="1" fill="#0B1437"/><circle cx="14.6" cy="11.2" r="1" fill="#0B1437"/></svg>';function Se(t,r){var u;return(u=(r==="en"?{support_ended:"Support period ended; submissions are closed.",daily_limit_site:"Daily submission limit for this site reached.",daily_limit_visitor:"You've hit today's submission limit. Try again tomorrow.",pending:"This site isn't approved yet.",blocked:"This site is blocked."}:{support_ended:"Destek s\xFCresi doldu, yeni g\xF6nderim al\u0131nam\u0131yor.",daily_limit_site:"Bu site i\xE7in g\xFCnl\xFCk g\xF6nderim limitine ula\u015F\u0131ld\u0131.",daily_limit_visitor:"G\xFCnl\xFCk g\xF6nderim limitine ula\u015Ft\u0131n. Yar\u0131n tekrar dene.",pending:"Bu site hen\xFCz onaylanmad\u0131.",blocked:"Bu site engellenmi\u015F."})[t!=null?t:""])!=null?u:r==="en"?"Couldn't send. Please try again.":"G\xF6nderilemedi. L\xFCtfen tekrar dene."}function rn(){return(document.documentElement.lang||"").toLowerCase().startsWith("en")?"en":"tr"}var sn=[{value:"\xD6neri",labels:{tr:"\xD6neri",en:"Suggestion"}},{value:"Hata",labels:{tr:"Hata",en:"Bug"}},{value:"Tasar\u0131m",labels:{tr:"Tasar\u0131m",en:"Design"}},{value:"Di\u011Fer",labels:{tr:"Di\u011Fer",en:"Other"}}],ln={\u00D6neri:"Suggestion",Hata:"Bug",Tasar\u0131m:"Design",Di\u011Fer:"Other"};function dn(t,r){return t!=null&&t.length?typeof t[0]=="string"?t.map(i=>{var f,p,u,h,l;return{value:i,labels:{tr:(p=(f=r==null?void 0:r.tr)==null?void 0:f[i])!=null?p:i,en:(l=(h=(u=r==null?void 0:r.en)==null?void 0:u[i])!=null?h:ln[i])!=null?l:i}}}):t.map(i=>{var p,u,h,l;if(!i||typeof i!="object")return null;let f=typeof i.value=="string"?i.value:"";return f?{value:f,labels:{tr:((p=i.labels)==null?void 0:p.tr)||((u=r==null?void 0:r.tr)==null?void 0:u[f])||f,en:((h=i.labels)==null?void 0:h.en)||((l=r==null?void 0:r.en)==null?void 0:l[f])||f}}:null}).filter(i=>!!i):sn}function Ct(t,r){return String(t.labels[r]||t.labels.tr||t.labels.en||t.value||"")}var ee=4;function D(t){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}var v={chat:D('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),history:D('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),copy:D('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),camera:D('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),crop:D('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),target:D('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>'),upload:D('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),close:D('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),check:D('<polyline points="20 6 9 17 4 12"/>'),alert:D('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),clock:D('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),infinity:D('<path d="M18.6 6.62a4.38 4.38 0 1 0 0 6.76L12 12l-6.6 1.38a4.38 4.38 0 1 0 0-6.76L12 12z"/>'),back:D('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'),x:D('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')};function cn(){return crypto!=null&&crypto.randomUUID?crypto.randomUUID():`ann_${Date.now()}_${Math.random().toString(36).slice(2)}`}async function Bt(){var h,l,n,R,q,F,$,B,c;let t=window.__KF_CONFIG__;if(!t)return;let r=(h=window.RivesioFeedback)!=null?h:{},i=r.domain||location.host,f;try{f=await(await fetch(`${t.base}/api/v1/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:i,meta:{user:r.user,href:location.href}})})).json()}catch(S){return}if(!f.enabled)return;let p={...t.project,...(l=f.project)!=null?l:{}},u={conversationEnabled:(R=(n=f.conversation)==null?void 0:n.enabled)!=null?R:!1,emailRequired:(F=(q=f.conversation)==null?void 0:q.emailRequired)!=null?F:!1,support:($=f.support)!=null?$:null,canSubmit:(B=f.canSubmit)!=null?B:!0,blockedReason:(c=f.blockedReason)!=null?c:null};try{fn(t,r,p,{domain:i},u)}catch(S){}}function fn(t,r,i,f,p){var xt,yt;let u=document.createElement("div");u.id="rivesio-widget",document.body.appendChild(u);let h=u.attachShadow({mode:"open"}),l=document.createElement("style");l.textContent=Lt,h.appendChild(l);let n=document.createElement("div");n.className="kf-root",n.dataset.pos=i.position||"bottom-right",n.dataset.fab=i.fabStyle||"label",i.logoUrl&&(n.dataset.hasLogo="1"),n.style.setProperty("--kf-accent",i.accentColor||"#0B1437");let R=Me(i.offsetX,20),q=Me(i.offsetY,20),F=Me(i.offsetXMobile,16),$=Me(i.offsetYMobile,16);n.style.setProperty("--kf-offset-x",`${R}px`),n.style.setProperty("--kf-offset-y",`${q}px`),n.style.setProperty("--kf-offset-x-mobile",`${F}px`),n.style.setProperty("--kf-offset-y-mobile",`${$}px`),n.style.setProperty("--kf-z",String(pn(i.zIndex,99999)));let B=i.theme||"auto";(B==="light"||B==="auto"&&document.documentElement.getAttribute("data-theme")==="light")&&(n.dataset.theme="light");let c=rn(),S={...nn[c],...(xt=i.text)==null?void 0:xt[c]},s=on[c],E=(yt=i.fields)!=null?yt:[],oe=dn(i.categories,i.categoryLabels),g=p.conversationEnabled,L=i.logoUrl?`<img class="kf-logo" src="${a(i.logoUrl)}" alt="" width="20" height="20" decoding="async">`:v.chat,H=oe.map(e=>`<option value="${a(e.value)}">${a(Ct(e,c))}</option>`).join("");function w(e){let o=String(e!=null?e:""),d=oe.find(b=>b.value===o);return d?Ct(d,c):o}let T=E.map(e=>{var y;let o=e.required?"required":"",d=e.placeholder?`placeholder="${a(e.placeholder)}"`:"",b=`<label class="kf-label">${a(e.label)}${e.required?" *":""}</label>`,x="";if(e.type==="textarea")x=`<textarea class="kf-textarea kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" ${d} ${o}></textarea>`;else if(e.type==="select"){let m=((y=e.options)!=null?y:[]).map(C=>`<option value="${a(C)}">${a(C)}</option>`).join("");x=`<select class="kf-select kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" ${o}>${m}</select>`}else{if(e.type==="checkbox")return`<label class="kf-cf-check"><input type="checkbox" class="kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" data-cf-type="checkbox" ${o}> ${a(e.label)}</label>`;x=`<input type="${e.type==="email"?"email":"text"}" class="kf-input kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" ${d} ${o}>`}return`<div>${b}${x}</div>`}).join(""),z=g?`<div>
         <label class="kf-label">${a(s.emailLabel)}${p.emailRequired?" *":""}</label>
         <input type="email" class="kf-input kf-email" placeholder="${a(s.emailPlaceholder)}" ${p.emailRequired?"required":""}>
         <div class="kf-token-hint">${a(s.emailHint)}</div>
       </div>`:"";n.innerHTML=`
    <button class="kf-fab" type="button" aria-label="${a(S.fabLabel)}" data-tip="${a(S.fabLabel)}">
      ${L}<span>${a(S.fabLabel)}</span><span class="kf-fab-badge" hidden></span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="${a(S.title)}">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${L}</div>
          <span class="kf-title">${a(S.title)}</span>
        </div>
        <div class="kf-head-actions">
          <button class="kf-icon-btn kf-close-btn" type="button" aria-label="${a(s.back)}">${v.close}</button>
        </div>
      </div>

      ${g?`<div class="kf-tabs">
        <button class="kf-tab kf-tab-form" type="button" data-active="1">${v.chat}<span>${a(s.tabForm)}</span></button>
        <button class="kf-tab kf-tab-history" type="button" data-active="0">${v.history}<span>${a(s.tabHistory)}</span><span class="kf-tab-badge" hidden></span></button>
      </div>`:""}

      <div class="kf-support" hidden></div>
      <div class="kf-msg" hidden></div>

      <!-- \u2500\u2500 FORM TAB \u2500\u2500 -->
      <div class="kf-view-form">
        <div class="kf-body">
          <div>
            <label class="kf-label">${a(S.categoryLabel)}</label>
            <select class="kf-select" aria-label="${a(S.categoryLabel)}">${H}</select>
          </div>

          <div>
            <label class="kf-label">${a(S.messageLabel)}</label>
            <textarea class="kf-textarea" placeholder="${a(S.messagePlaceholder)}"></textarea>
          </div>

          ${z}
          ${T}

          <div class="kf-capture-row">
            <button class="kf-chip kf-capture-full" type="button">${v.camera} ${a(c==="en"?"Full screen":"T\xFCm ekran")}</button>
            <button class="kf-chip kf-capture-area" type="button">${v.crop} ${a(c==="en"?"Select area":"Alan se\xE7")}</button>
            <button class="kf-chip kf-element-select" type="button">${v.target} ${a(c==="en"?"Pick element":"\xD6\u011Fe se\xE7")}</button>
            <button class="kf-chip kf-chip-upload kf-upload" type="button" aria-label="${a(s.addImage)}">${v.upload}</button>
          </div>

          <div class="kf-attach-row"><span class="kf-counter">0 / ${ee}</span></div>
          <div class="kf-thumbs"></div>
          <div class="kf-annotations" hidden></div>
          <input class="kf-file" type="file" accept="image/*" multiple hidden />

          <div class="kf-hint">${a(c==="en"?"Tip:":"\u0130pucu:")} <kbd>\u2318 / Ctrl + /</kbd></div>
        </div>

        <div class="kf-foot">
          <button class="kf-btn kf-btn-ghost kf-cancel" type="button">${a(c==="en"?"Cancel":"Vazge\xE7")}</button>
          <button class="kf-btn kf-btn-primary kf-submit" type="button">${a(S.submitLabel)}</button>
        </div>
      </div>

      ${g?`<!-- \u2500\u2500 HISTORY TAB \u2500\u2500 -->
      <div class="kf-view-history" hidden>
        <div class="kf-history-main">
          <div class="kf-session-bar" hidden>
            <span class="kf-session-email"></span>
            <button class="kf-link kf-session-change" type="button">${a(s.changeEmail)}</button>
          </div>
          <ul class="kf-history-list"></ul>
          <p class="kf-history-empty" hidden>${a(s.historyEmpty)}</p>
          <div class="kf-otp">
            <div class="kf-recover-title">${a(s.otpTitle)}</div>
            <div class="kf-otp-hint">${a(s.otpHint)}</div>
            <div class="kf-recover-row kf-otp-step1">
              <input type="email" class="kf-input kf-otp-email" placeholder="${a(s.emailPlaceholder)}">
              <button class="kf-btn kf-btn-primary kf-otp-send" type="button">${a(s.sendCode)}</button>
            </div>
            <div class="kf-recover-row kf-otp-step2" hidden>
              <input type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" class="kf-input kf-otp-code" placeholder="${a(s.codePlaceholder)}">
              <button class="kf-btn kf-btn-primary kf-otp-verify" type="button">${a(s.verify)}</button>
            </div>
          </div>
        </div>

        <div class="kf-convo" hidden>
          <div class="kf-convo-head">
            <button class="kf-back" type="button">${v.back} ${a(s.back)}</button>
            <span class="kf-convo-cat"></span>
          </div>
          <div class="kf-thread"></div>
          <div class="kf-reply-box">
            <textarea class="kf-reply-input kf-textarea" placeholder="${a(s.replyPlaceholder)}" style="min-height:64px"></textarea>
            <div class="kf-reply-foot">
              <span class="kf-counter kf-reply-counter">0 / ${ee}</span>
              <button class="kf-chip kf-reply-upload" type="button" aria-label="${a(s.addImage)}">${v.upload}</button>
              <button class="kf-btn kf-btn-primary kf-reply-send" type="button">${a(s.send)}</button>
            </div>
            <input class="kf-reply-file" type="file" accept="image/*" multiple hidden />
          </div>
          <div class="kf-convo-closed" hidden>${a(s.closedNotice)}</div>
        </div>
      </div>`:""}

      <a class="kf-powered" href="${a(t.base)}" target="_blank" rel="noopener noreferrer">
        <span>${a(s.poweredBy)}</span>
        <span class="kf-brand">${an}<span class="kf-brand-name">Rivesio</span></span>
      </a>

    </div>
  `,h.appendChild(n);let k=e=>n.querySelector(e),O=k(".kf-fab"),A=k(".kf-close-btn"),j=n.querySelector(".kf-tab-form"),U=n.querySelector(".kf-tab-history"),$e=k(".kf-cancel"),ie=k(".kf-submit"),ce=k(".kf-capture-full"),fe=k(".kf-capture-area"),te=k(".kf-element-select"),Ne=k(".kf-upload"),ke=k(".kf-file"),pe=k(".kf-view-form .kf-textarea"),G=n.querySelector(".kf-email"),Ye=k(".kf-view-form .kf-select"),Ke=k(".kf-thumbs"),Rt=k(".kf-attach-row .kf-counter"),Te=k(".kf-annotations"),N=k(".kf-msg"),Y=k(".kf-support"),He=k(".kf-view-form"),Ue=k(".kf-view-form .kf-body"),Ge=k(".kf-view-form .kf-foot"),xe=n.querySelector(".kf-view-history"),ye=n.querySelector(".kf-history-main"),Ce=n.querySelector(".kf-history-list"),Xe=n.querySelector(".kf-history-empty"),ve=n.querySelector(".kf-convo"),Je=n.querySelector(".kf-convo-cat"),K=n.querySelector(".kf-thread"),Be=n.querySelector(".kf-reply-box"),ae=n.querySelector(".kf-reply-input"),X=n.querySelector(".kf-reply-file"),ue=n.querySelector(".kf-reply-upload"),ne=n.querySelector(".kf-reply-send"),Ve=n.querySelector(".kf-reply-counter"),_e=n.querySelector(".kf-convo-closed"),ze=n.querySelector(".kf-back"),Ze=k(".kf-fab-badge"),Re=n.querySelector(".kf-tab-badge"),Qe=n.querySelector(".kf-session-bar"),et=n.querySelector(".kf-session-email"),Ae=n.querySelector(".kf-session-change"),tt=n.querySelector(".kf-otp"),J=n.querySelector(".kf-otp-email"),be=n.querySelector(".kf-otp-send"),we=n.querySelector(".kf-otp-step2"),I=n.querySelector(".kf-otp-code"),re=n.querySelector(".kf-otp-verify"),P=[],V=[],Z=[];function Ie(){let e=p.support;if(!e||e.unlimited||e.endsAt===null){Y.hidden=!0;return}Y.hidden=!1;let o=Math.ceil((e.endsAt-Date.now())/864e5);if(o<=0)Y.dataset.expired="1",Y.innerHTML=`${v.alert}<span>${a(s.supportEnded)}</span>`;else{Y.dataset.expired="0";let d=o===1?s.supportLastDay:s.supportLeft(o);Y.innerHTML=`${v.clock}<span>${a(d)}</span>`}}let nt=`kf_history_${t.widgetKey}`,De=`kf_session_${t.widgetKey}`,ot=`kf_seen_${t.widgetKey}`;function Pe(){try{return JSON.parse(localStorage.getItem(nt)||"[]")}catch(e){return[]}}function At(e){let o=Pe();o.unshift(e),localStorage.setItem(nt,JSON.stringify(o.slice(0,50)))}function at(){try{return JSON.parse(localStorage.getItem(De)||"null")}catch(e){return null}}function rt(e){e?localStorage.setItem(De,JSON.stringify(e)):localStorage.removeItem(De)}function it(){try{return JSON.parse(localStorage.getItem(ot)||"{}")}catch(e){return{}}}function It(e){let o=it();o[e]=Date.now(),localStorage.setItem(ot,JSON.stringify(o)),dt()}function Dt(e){return new Date(e).toLocaleDateString(c==="en"?"en-US":"tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}function Pt(e){return new Date(e).toLocaleTimeString(c==="en"?"en-US":"tr-TR",{hour:"2-digit",minute:"2-digit"})}function qt(e){return new Date(e).toLocaleDateString(c==="en"?"en-US":"tr-TR",{day:"numeric",month:"long",year:"numeric"})}let st={};function lt(){var d;let e=at(),o=new Set;for(let b of(d=e==null?void 0:e.conversations)!=null?d:[])o.add(b.token);for(let b of Pe())b.token&&o.add(b.token);return Array.from(o)}function qe(e){var d;let o=st[e];return o?((d=it()[e])!=null?d:0)<o:!1}function Ft(){return lt().filter(qe).length}function dt(){if(!g)return;let e=Ft();Ze.hidden=e===0,Ze.textContent=e>9?"9+":String(e),Re&&(Re.hidden=e===0,Re.textContent=e>9?"9+":String(e))}async function ct(){var o;if(!g)return;let e=lt().slice(0,50);if(e.length)try{let d=await fetch(`${t.base}/api/v1/conversation/status`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,tokens:e})});if(!d.ok)return;let b=await d.json();for(let[x,y]of Object.entries((o=b.statuses)!=null?o:{}))y.last_admin_reply_at&&(st[x]=y.last_admin_reply_at);dt()}catch(d){}}function ft(e){let o=document.createElement("li");return o.className="kf-history-item",e.unread&&(o.dataset.unread="1"),o.innerHTML=`
      <div class="kf-hi-left">
        <span class="kf-hi-cat">${a(e.title)}${e.unread?`<span class="kf-hi-dot" title="${a(s.newReplyBadge)}"></span>`:""}</span>
        <span class="kf-hi-page">${a(e.snippet)}</span>
      </div>
      <div class="kf-hi-right">
        <span class="kf-hi-date">${a(Dt(e.date))}</span>
      </div>`,g&&e.token?o.addEventListener("click",()=>gt(e.token)):o.style.cursor="default",o}function se(){var b,x,y;if(!Ce||!Xe||!Qe)return;let e=at();Ce.innerHTML="",Qe.hidden=!e,e&&et&&(et.textContent=e.email),tt&&(tt.hidden=!!e);let o=[],d=new Set;for(let m of(b=e==null?void 0:e.conversations)!=null?b:[])d.add(m.token),o.push(ft({title:w(m.category),snippet:(x=m.last_message)!=null?x:"",date:m.last_activity_at,token:m.token,unread:qe(m.token)}));for(let m of Pe())m.token&&d.has(m.token)||o.push(ft({title:w(m.category),snippet:(y=m.page)!=null?y:"",date:m.date,token:m.token,id:m.id,unread:m.token?qe(m.token):!1}));Xe.hidden=o.length>0,o.forEach(m=>Ce.appendChild(m))}function pt(){Ue.hidden=!1,Ge.hidden=!1}function ut(){j&&(j.dataset.active="1"),U&&(U.dataset.active="0"),He.hidden=!1,xe&&(xe.hidden=!0),pt(),Y.hidden=!p.support,Ie(),M("",null)}function Ot(){!g||!j||!U||!xe||(j.dataset.active="0",U.dataset.active="1",He.hidden=!0,xe.hidden=!1,Y.hidden=!0,M("",null),mt(),se())}j==null||j.addEventListener("click",ut),U==null||U.addEventListener("click",Ot);function jt(e,o){var d;if((d=navigator.clipboard)==null||d.writeText(e).catch(()=>{}),o){o.classList.add("copied");let b=o.innerHTML;o.innerHTML=v.check,setTimeout(()=>{o.classList.remove("copied"),o.innerHTML=b},1600)}}function M(e,o){if(!o){N.hidden=!0,N.innerHTML="";return}N.hidden=!1,N.className=`kf-msg kf-${o}`,N.innerHTML=`${o==="ok"?v.check:v.alert} ${a(e)}`}function Q(){let e=P.length>=ee;Rt.textContent=`${P.length} / ${ee}`,ce.disabled=e,fe.disabled=e,te.disabled=e,Ne.disabled=e,Ke.innerHTML="",P.forEach((o,d)=>{let b=document.createElement("div");b.className="kf-thumb",b.innerHTML=`<img src="${o.url}" alt="ek"><button class="kf-thumb-del" type="button" aria-label="Kald\u0131r">${v.x}</button>`,b.querySelector("button").addEventListener("click",()=>{if(URL.revokeObjectURL(o.url),o.annotationId){let x=V.findIndex(y=>y.id===o.annotationId);x>=0&&V.splice(x,1)}P.splice(d,1),Q(),me()}),Ke.appendChild(b)})}function me(){Te.hidden=V.length===0,Te.innerHTML="",V.forEach((e,o)=>{let d=document.createElement("div");d.className="kf-ann-item",d.innerHTML=`
        <div class="kf-ann-pin">${o+1}</div>
        <div class="kf-ann-main">
          <div class="kf-ann-selector">${a(e.selector)}</div>
          <div class="kf-ann-note">${a(e.value)}</div>
        </div>
        <button class="kf-ann-del" type="button" aria-label="Kald\u0131r">${v.x}</button>`,d.querySelector("button").addEventListener("click",()=>{for(let b=P.length-1;b>=0;b--)P[b].annotationId===e.id&&(URL.revokeObjectURL(P[b].url),P.splice(b,1));V.splice(o,1),Q(),me()}),Te.appendChild(d)})}function Ee(e,o,d){P.length>=ee||(P.push({blob:e,kind:o,annotationId:d,url:URL.createObjectURL(e)}),Q())}function Fe(){n.dataset.open="1",He.hidden||setTimeout(()=>pe.focus(),60)}function ge(){n.dataset.open="0",ut()}function bt(){n.dataset.open==="1"?ge():Fe()}O.addEventListener("click",bt),A.addEventListener("click",ge),$e.addEventListener("click",ge),Ne.addEventListener("click",()=>ke.click()),ke.addEventListener("change",()=>{var e;Array.from((e=ke.files)!=null?e:[]).filter(o=>o.type.startsWith("image/")).forEach(o=>Ee(o,"upload")),ke.value=""}),ce.addEventListener("click",async()=>{ce.disabled=!0,ce.innerHTML=`${v.camera} ${a(c==="en"?"Waiting\u2026":"Bekleniyor\u2026")}`;try{let e=await Mt(u);e?Ee(e,"screenshot"):M(c==="en"?"Screen share cancelled.":"Ekran payla\u015F\u0131m\u0131 iptal edildi.","err")}catch(e){M(c==="en"?"Couldn't capture screen.":"Ekran yakalanamad\u0131.","err")}finally{ce.innerHTML=`${v.camera} ${a(c==="en"?"Full screen":"T\xFCm ekran")}`,Q()}}),fe.addEventListener("click",async()=>{fe.disabled=!0,fe.innerHTML=`${v.crop} ${a(c==="en"?"Waiting\u2026":"Bekleniyor\u2026")}`;try{let e=await Ht(u);e?Ee(e,"screenshot"):M(c==="en"?"Area selection cancelled.":"Alan se\xE7imi iptal edildi.","err")}catch(e){M(c==="en"?"Couldn't capture screen.":"Ekran yakalanamad\u0131.","err")}finally{fe.innerHTML=`${v.crop} ${a(c==="en"?"Select area":"Alan se\xE7")}`,Q()}}),te.addEventListener("click",async()=>{if(P.length>=ee){M(c==="en"?"Attachment limit reached.":"Ek s\u0131n\u0131r\u0131na ula\u015F\u0131ld\u0131.","err");return}ge(),te.disabled=!0,te.innerHTML=`${v.target} ${a(c==="en"?"Waiting\u2026":"Bekleniyor\u2026")}`;let e=await $t(u);if(!e){te.innerHTML=`${v.target} ${a(c==="en"?"Pick element":"\xD6\u011Fe se\xE7")}`,te.disabled=!1,Fe(),M(c==="en"?"Screen capture was cancelled.":"Ekran payla\u015F\u0131m\u0131 iptal edildi.","err"),Q();return}try{let o=V.length+1,d=await bn(u,c,o);if(d){let b=await Tt(e,{x:d.rect.x,y:d.rect.y,w:d.rect.width,h:d.rect.height},o);V.push(d),b?Ee(b,"screenshot",d.id):M(c==="en"?"Element screenshot couldn't be captured.":"\xD6\u011Fe ekran g\xF6r\xFCnt\xFCs\xFC al\u0131namad\u0131.","err"),me()}}finally{St(e),te.innerHTML=`${v.target} ${a(c==="en"?"Pick element":"\xD6\u011Fe se\xE7")}`,te.disabled=!1,Fe(),Q()}});function Wt(){let e=n.querySelectorAll(".kf-cf"),o=[];for(let d of Array.from(e)){let b=d.dataset.cfLabel||"",y=d.dataset.cfType==="checkbox"?d.checked?c==="en"?"Yes":"Evet":"":d.value.trim();if(d.hasAttribute("required")&&!y)return d.focus(),{ok:!1,values:[]};y&&o.push({label:b,value:y})}return{ok:!0,values:o}}function Nt(){p.canSubmit||(ie.disabled=!0,M(Se(p.blockedReason,c),"err"))}async function Yt(){var b,x,y,m;if(!p.canSubmit){M(Se(p.blockedReason,c),"err");return}let e=pe.value.trim();if(!e){M(c==="en"?"Please write a description.":"L\xFCtfen bir a\xE7\u0131klama yaz.","err"),pe.focus();return}let o=(G==null?void 0:G.value.trim())||"";if(G!=null&&G.hasAttribute("required")&&!o){M(c==="en"?"Please enter your email.":"L\xFCtfen e-postan\u0131 gir.","err"),G.focus();return}let d=Wt();if(!d.ok){M(c==="en"?"Please fill required fields.":"L\xFCtfen zorunlu alanlar\u0131 doldur.","err");return}ie.disabled=!0,ie.textContent=c==="en"?"Sending\u2026":"G\xF6nderiliyor\u2026",M("",null);try{let C=await fetch(`${t.base}/api/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:f.domain,category:Ye.value,message:e,email:o||void 0,page_url:location.href,viewport:`${window.innerWidth}x${window.innerHeight}`,wp_user:r.user,locale:c,custom_fields:[...d.values,...V]})}),W=await C.json();if(!C.ok||!W.ok){M(Se((b=W==null?void 0:W.error)!=null?b:null,c),"err");return}let Gt=new Map(((x=W.annotation_replies)!=null?x:[]).map(_=>[_.id,_.reply_id])),he=0;for(let _ of P){let de=new FormData;de.append("widget_key",t.widgetKey),de.append("domain",f.domain),de.append("kind",_.kind);let Qt=_.blob.type==="image/png"?"png":"jpg";de.append("file",_.blob,`${_.kind}.${Qt}`);let Et=_.annotationId?Gt.get(_.annotationId):void 0;Et&&de.append("reply_id",Et),await fetch(`${t.base}/api/v1/feedback/${W.feedback_id}/attachment`,{method:"POST",body:de}).then(en=>en.ok).catch(()=>!1)||he++}let je=W.feedback_id,vt=W.token;At({id:je,token:vt,category:Ye.value,page:location.pathname,date:Date.now()});let Xt=he>0?`<div class="kf-msg kf-warn">${v.alert} ${a(c==="en"?`${he} attachment${he>1?"s":""} could not be uploaded.`:`${he} ek y\xFCklenemedi.`)}</div>`:"",wt=je,Jt=c==="en"?"Reference":"Referans no",Vt=`#${je.slice(0,8)}`,Zt=g&&vt?`<div class="kf-token-hint">${a(s.tokenHint)}</div>`:"";Ue.hidden=!0,Ge.hidden=!0,Y.hidden=!0,N.hidden=!1,N.className="kf-msg kf-ok kf-success",N.innerHTML=`
        <div class="kf-success-head">${v.check}<span>${a(S.successMessage)}</span></div>
        <div class="kf-token-box">
          <span class="kf-token-label">${a(Jt)}</span>
          <div class="kf-token-row">
            <span class="kf-token-val" title="${a(wt)}">${a(Vt)}</span>
          </div>
          <button class="kf-btn kf-btn-primary kf-token-copy" type="button">${v.copy}<span>${a(s.copy)}</span></button>
          ${Zt}
        </div>
        ${Xt}
        <button class="kf-btn kf-btn-ghost kf-new-submit" type="button">${a(s.newSubmission)}</button>`,(y=N.querySelector(".kf-token-copy"))==null||y.addEventListener("click",_=>jt(wt,_.currentTarget)),(m=N.querySelector(".kf-new-submit"))==null||m.addEventListener("click",()=>{pt(),Y.hidden=!p.support,Ie(),M("",null),pe.focus()}),pe.value="",G&&(G.value=o),n.querySelectorAll(".kf-cf").forEach(_=>{_.dataset.cfType==="checkbox"?_.checked=!1:_.value=""}),P.splice(0).forEach(_=>URL.revokeObjectURL(_.url)),V.splice(0),Q(),me()}catch(C){M(c==="en"?"Connection error. Please try again.":"Ba\u011Flant\u0131 hatas\u0131. L\xFCtfen tekrar dene.","err")}finally{ie.disabled=!1,ie.textContent=S.submitLabel}}ie.addEventListener("click",Yt);let le=null;function mt(){!g||!ve||!ye||(le=null,ve.hidden=!0,ye.hidden=!1,Z.splice(0))}ze==null||ze.addEventListener("click",()=>{mt(),se()});async function gt(e){if(!(!ve||!ye||!K||!_e||!Be)){le=e,ye.hidden=!0,ve.hidden=!1,K.innerHTML='<p class="kf-history-empty">\u2026</p>',_e.hidden=!0,Be.hidden=!0;try{let o=await fetch(`${t.base}/api/v1/conversation/${encodeURIComponent(e)}`);if(o.status===404){K.innerHTML=`<p class="kf-history-empty">${a(s.notFound)}</p>`;return}if(!o.ok){K.innerHTML=`<p class="kf-history-empty">${a(s.loadError)}</p>`;return}let d=await o.json();Ut(d.conversation,e),It(e);let b=!!d.can_reply;Be.hidden=!b,_e.hidden=b,Oe()}catch(o){K.innerHTML=`<p class="kf-history-empty">${a(s.loadError)}</p>`}}}function Kt(e){var d;let o=(d=e.imgs)!=null&&d.length?`<div class="kf-convo-imgs">${e.imgs.map(b=>`<img src="${a(b.url)}" alt="ek">`).join("")}</div>`:"";return`<div class="kf-msg-row ${e.mine?"kf-mine":"kf-theirs"}">
      <div class="kf-bubble">
        <div class="kf-bubble-body">${a(e.body)}</div>${o}
      </div>
      <div class="kf-bubble-time">${a(e.author)} \xB7 ${a(Pt(e.ts))}</div>
    </div>`}function Ut(e,o){if(!Je||!K)return;Je.textContent=w(e.category);let d=e.attachments.filter(m=>!m.reply_id).map(m=>({url:m.url})),b=[{author:"user",message:e.message,created_at:e.created_at,imgs:d},...e.replies.map(m=>({...m,imgs:e.attachments.filter(C=>C.reply_id===m.id).map(C=>({url:C.url}))}))],x="",y="";for(let m of b){let C=qt(m.created_at);C!==y&&(x+=`<div class="kf-day-sep"><span>${a(C)}</span></div>`,y=C);let W=m.author==="user";x+=Kt({author:W?s.you:s.support,ts:m.created_at,body:m.message,mine:W,imgs:m.imgs})}K.innerHTML=x,K.querySelectorAll(".kf-convo-imgs img").forEach(m=>{m.addEventListener("click",()=>window.open(m.src,"_blank"))}),K.scrollTop=K.scrollHeight}function Oe(){!Ve||!ue||(Ve.textContent=`${Z.length} / ${ee}`,ue.toggleAttribute("disabled",Z.length>=ee))}ue==null||ue.addEventListener("click",()=>X==null?void 0:X.click()),X==null||X.addEventListener("change",()=>{var e;X&&(Array.from((e=X.files)!=null?e:[]).filter(o=>o.type.startsWith("image/")).slice(0,ee-Z.length).forEach(o=>Z.push(o)),X.value="",Oe())});async function ht(){var o,d,b;if(!le||!ae||!ne)return;let e=ae.value.trim();if(!e&&Z.length===0){ae.focus();return}ne.disabled=!0,ne.textContent=s.sending;try{let x=null;if(e||Z.length>0){let y=await fetch(`${t.base}/api/v1/conversation/${encodeURIComponent(le)}/reply`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e||s.attachmentSent,page_url:location.href})});if(!y.ok){let C=await y.json().catch(()=>({}));M(Se((o=C==null?void 0:C.error)!=null?o:null,c),"err");return}let m=await y.json().catch(()=>null);x=(b=(d=m==null?void 0:m.reply)==null?void 0:d.id)!=null?b:null}for(let y of Z){let m=new FormData;m.append("file",y,y.name||"image.jpg"),x&&m.append("reply_id",x),await fetch(`${t.base}/api/v1/conversation/${encodeURIComponent(le)}/attachment`,{method:"POST",body:m}).catch(()=>{})}ae.value="",Z.splice(0),Oe(),await gt(le)}finally{ne.disabled=!1,ne.textContent=s.send}}ne==null||ne.addEventListener("click",ht),ae==null||ae.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),ht())}),be==null||be.addEventListener("click",async()=>{let e=J==null?void 0:J.value.trim();if(!e||!e.includes("@")){J==null||J.focus();return}be.disabled=!0;try{await fetch(`${t.base}/api/v1/conversation/request-code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:f.domain,email:e})}).catch(()=>{}),M(s.codeSent,"ok"),we&&(we.hidden=!1),I==null||I.focus()}finally{be.disabled=!1}});async function kt(){var d;let e=J==null?void 0:J.value.trim(),o=I==null?void 0:I.value.trim();if(!e||!o||o.length!==6){I==null||I.focus();return}re&&(re.disabled=!0);try{let b=await fetch(`${t.base}/api/v1/conversation/verify-code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,email:e,code:o})}),x=await b.json().catch(()=>({}));if(!b.ok||!x.ok){M(s.invalidCode,"err");return}rt({email:e,conversations:(d=x.conversations)!=null?d:[],verifiedAt:Date.now()}),I&&(I.value=""),we&&(we.hidden=!0),M("",null),ct().then(se),se()}catch(b){M(s.invalidCode,"err")}finally{re&&(re.disabled=!1)}}re==null||re.addEventListener("click",kt),I==null||I.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),kt())}),Ae==null||Ae.addEventListener("click",()=>{rt(null),se()}),window.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="/"&&(e.preventDefault(),bt()),e.key==="Escape"&&n.dataset.open==="1"&&ge()}),Ie(),Q(),me(),Nt(),g&&ct().then(se)}function a(t){return String(t!=null?t:"").replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r])}function Me(t,r){return typeof t!="number"||!Number.isFinite(t)?r:Math.min(200,Math.max(0,Math.round(t)))}function pn(t,r){return typeof t!="number"||!Number.isFinite(t)?r:Math.min(2147483647,Math.max(1,Math.round(t)))}function _t(t){let r=[],i=t;for(;i&&i.nodeType===1&&i!==document.body&&r.length<5;){let f=i.tagName.toLowerCase();if(i.id){f+=`#${zt(i.id)}`,r.unshift(f);break}let p=Array.from(i.classList).filter(h=>h&&!h.startsWith("rivesio-")&&!h.startsWith("kf-")).slice(0,2);p.length&&(f+=`.${p.map(zt).join(".")}`);let u=i.parentElement;if(u){let h=Array.from(u.children).filter(l=>l.tagName===i.tagName);h.length>1&&(f+=`:nth-of-type(${h.indexOf(i)+1})`)}r.unshift(f),i=u}return r.join(" > ")||t.tagName.toLowerCase()}function zt(t){let r=window.CSS;return r!=null&&r.escape?r.escape(t):t.replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function un(t){return(t.textContent||"").replace(/\s+/g," ").trim().slice(0,140)}function bn(t,r,i){return new Promise(f=>{let p=document.createElement("div");p.className="rivesio-element-highlight",Object.assign(p.style,{position:"fixed",zIndex:"2147483645",pointerEvents:"none",border:"2px solid #3b82f6",background:"rgba(59,130,246,.14)",borderRadius:"8px",boxShadow:"0 0 0 9999px rgba(15,23,42,.18)",transition:"left .08s, top .08s, width .08s, height .08s",display:"none"});let u=document.createElement("div");Object.assign(u.style,{position:"fixed",zIndex:"2147483646",pointerEvents:"none",background:"#2563eb",color:"#fff",borderRadius:"999px",padding:"4px 9px",font:"600 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",boxShadow:"0 8px 18px rgba(37,99,235,.28)",display:"none"}),u.textContent=r==="en"?"Click an element":"\xD6\u011Feye t\u0131kla",document.body.append(p,u),t.style.visibility="hidden";let h=null,l=null,n=!1;function R(s){n||(n=!0,q(),f(s))}function q(){t.style.visibility="",p.remove(),u.remove(),l==null||l.remove(),window.removeEventListener("mousemove",$,!0),window.removeEventListener("click",B,!0),window.removeEventListener("keydown",c,!0)}function F(s){if(h=s,!s){p.style.display="none",u.style.display="none";return}let E=s.getBoundingClientRect();p.style.display="block",p.style.left=`${Math.max(0,E.left)}px`,p.style.top=`${Math.max(0,E.top)}px`,p.style.width=`${Math.max(0,E.width)}px`,p.style.height=`${Math.max(0,E.height)}px`,u.style.display="block",u.style.left=`${Math.min(window.innerWidth-132,Math.max(8,E.left))}px`,u.style.top=`${Math.max(8,E.top-32)}px`}function $(s){if(l)return;let E=document.elementFromPoint(s.clientX,s.clientY);if(!E||E===t||t.contains(E)){F(null);return}F(E)}function B(s){l!=null&&l.contains(s.target)||(s.preventDefault(),s.stopPropagation(),h&&S(h))}function c(s){s.key==="Escape"&&(s.preventDefault(),R(null))}function S(s){let E=s.getBoundingClientRect();l==null||l.remove(),l=document.createElement("div");let oe=Math.min(320,window.innerWidth-24),g=190,L=window.innerHeight-E.bottom-10,H=E.top-10,w;L>=g||L>=H?w=Math.min(window.innerHeight-g-8,E.bottom+10):w=Math.max(8,E.top-g-10);let T=Math.min(window.innerWidth-oe-8,Math.max(8,E.left));Object.assign(l.style,{position:"fixed",zIndex:"2147483647",width:`${oe}px`,left:`${T}px`,top:`${Math.max(8,w)}px`,background:"#ffffff",border:"1px solid rgba(15,23,42,.14)",borderRadius:"12px",boxShadow:"0 20px 50px rgba(15,23,42,.22)",padding:"12px",font:"13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",color:"#0f172a"}),l.innerHTML=`
        <div style="font-weight:700;margin-bottom:6px">${r==="en"?"Add note to element":"\xD6\u011Feye not ekle"}</div>
        <div style="font-size:11px;color:#64748b;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a(_t(s))}</div>
        <textarea style="width:100%;min-height:78px;resize:none;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font:13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;outline:none" placeholder="${r==="en"?"What should change here?":"Burada ne de\u011Fi\u015Fmeli?"}"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
          <button type="button" data-cancel style="border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:7px 10px;font-weight:600;color:#475569;cursor:pointer">${r==="en"?"Cancel":"Vazge\xE7"}</button>
          <button type="button" data-save style="border:0;background:#2563eb;border-radius:8px;padding:7px 12px;font-weight:700;color:#fff;cursor:pointer">${r==="en"?"Add":"Ekle"}</button>
        </div>`,document.body.appendChild(l);let z=l.querySelector("textarea");z.focus(),l.querySelector("[data-cancel]").addEventListener("click",()=>R(null)),l.querySelector("[data-save]").addEventListener("click",()=>{let k=z.value.trim();if(!k){z.focus();return}let O=_t(s),A=s.getBoundingClientRect();R({id:cn(),kind:"element_annotation",index:i,label:r==="en"?"Element note":"\xD6\u011Fe notu",value:k,selector:O,tagName:s.tagName.toLowerCase(),text:un(s),rect:{x:Math.round(A.left),y:Math.round(A.top),width:Math.round(A.width),height:Math.round(A.height),viewportWidth:window.innerWidth,viewportHeight:window.innerHeight}})})}window.addEventListener("mousemove",$,!0),window.addEventListener("click",B,!0),window.addEventListener("keydown",c,!0)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Bt):Bt();})();
