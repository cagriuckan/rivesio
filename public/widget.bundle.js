"use strict";(()=>{var pt=`
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
  .kf-root { bottom: 16px; }
  .kf-root[data-pos="bottom-right"] { right: 16px; }
  .kf-root[data-pos="bottom-left"]  { left: 16px; }
  .kf-panel { width: calc(100vw - 24px); max-width: none; border-radius: var(--radius-lg); }
  .kf-fab > span:not(.kf-fab-badge) { display: none; }
  .kf-fab { padding: 12px; border-radius: 50%; }
  .kf-fab svg { width: 18px; height: 18px; }
  .kf-fab .kf-logo { width: 22px; height: 22px; border-radius: 7px; }
  .kf-root[data-has-logo="1"] .kf-fab { padding: 8px; }
}
`;async function Se(t){let i;try{i=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"browser",frameRate:1},audio:!1,preferCurrentTab:!0,selfBrowserSurface:"include"})}catch(o){return null}let[c]=i.getVideoTracks();t&&(t.style.visibility="hidden");let p=document.createElement("video");p.muted=!0,p.playsInline=!0,p.srcObject=i,await new Promise(o=>{p.onloadedmetadata=()=>o()}),await p.play(),await new Promise(o=>requestAnimationFrame(()=>requestAnimationFrame(()=>o())));let{videoWidth:f,videoHeight:b}=p,k=document.createElement("canvas");return k.width=f,k.height=b,k.getContext("2d").drawImage(p,0,0,f,b),p.pause(),p.srcObject=null,c.stop(),t&&(t.style.visibility=""),{bitmap:await createImageBitmap(k),scaleX:f/window.innerWidth,scaleY:b/window.innerHeight}}function ut(t){t==null||t.bitmap.close()}function he(t,i,c,p,f,b){t.beginPath(),t.moveTo(i+b,c),t.arcTo(i+p,c,i+p,c+f,b),t.arcTo(i+p,c+f,i,c+f,b),t.arcTo(i,c+f,i,c,b),t.arcTo(i,c,i+p,c,b),t.closePath()}async function bt(t){let i=await Se(t);if(!i)return null;let{bitmap:c}=i,p=document.createElement("canvas");return p.width=c.width,p.height=c.height,p.getContext("2d").drawImage(c,0,0),c.close(),new Promise(f=>p.toBlob(f,"image/png"))}async function mt(t){return Se(t)}function gt(t,i,c){let{bitmap:p,scaleX:f,scaleY:b}=t,k=document.createElement("canvas");k.width=p.width,k.height=p.height;let l=k.getContext("2d");l.drawImage(p,0,0);let o=Math.round(i.x*f),R=Math.round(i.y*b),u=Math.round(i.w*f),L=Math.round(i.h*b),s=Math.max(3,Math.round(2*Math.max(f,b))),A=Math.max(14,Math.round(12*Math.max(f,b)));l.save(),l.fillStyle="rgba(59, 130, 246, 0.18)",he(l,o,R,u,L,A),l.fill(),l.strokeStyle="#3b82f6",l.lineWidth=s,he(l,o+s/2,R+s/2,Math.max(0,u-s),Math.max(0,L-s),A),l.stroke();let T=Math.max(24,Math.round(22*Math.max(f,b))),I=Math.min(k.width-T-s,Math.max(s,o+u-T/2)),x=Math.max(s,R-T/2);return l.fillStyle="#3b82f6",l.beginPath(),l.arc(I+T/2,x+T/2,T/2,0,Math.PI*2),l.fill(),l.strokeStyle="#ffffff",l.lineWidth=Math.max(2,Math.round(1.5*Math.max(f,b))),l.stroke(),l.fillStyle="#ffffff",l.font=`700 ${Math.round(T*.5)}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,l.textAlign="center",l.textBaseline="middle",l.fillText(String(c),I+T/2,x+T/2+1),l.restore(),new Promise(w=>k.toBlob(w,"image/png"))}async function ht(t){let i=await Se(t);return i?Jt(i):null}function Jt({bitmap:t,scaleX:i,scaleY:c}){return new Promise(p=>{let f=window.innerWidth,b=window.innerHeight,k=Math.min(window.devicePixelRatio||1,2),l=document.createElement("canvas");l.width=f*k,l.height=b*k,Object.assign(l.style,{position:"fixed",top:"0",left:"0",width:"100vw",height:"100vh",zIndex:"2147483646",cursor:"crosshair",userSelect:"none"}),document.body.appendChild(l);let o=l.getContext("2d");o.scale(k,k);function R(){o.drawImage(t,0,0,t.width,t.height,0,0,f,b),o.fillStyle="rgba(0,0,0,0.38)",o.fillRect(0,0,f,b)}function u(){let h="S\xFCr\xFCkle: alan se\xE7   \u2022   B\u0131rak: onayla   \u2022   Esc: iptal";o.font="13px -apple-system, system-ui, sans-serif";let d=o.measureText(h).width+24,M=36,H=(f-d)/2,B=b-M-20;o.fillStyle="rgba(15,23,42,0.72)",he(o,H,B,d,M,10),o.fill(),o.fillStyle="#f1f5f9",o.textAlign="center",o.textBaseline="middle",o.fillText(h,f/2,B+M/2),o.textAlign="left",o.textBaseline="alphabetic"}function L(h,$,d,M){o.save(),o.beginPath(),o.rect(h,$,d,M),o.clip(),o.drawImage(t,0,0,t.width,t.height,0,0,f,b),o.restore(),o.strokeStyle="#6366f1",o.lineWidth=2,o.setLineDash([6,3]),o.strokeRect(h+1,$+1,d-2,M-2),o.setLineDash([]);let H=7;o.fillStyle="#6366f1",[[h,$],[h+d-H,$],[h,$+M-H],[h+d-H,$+M-H]].forEach(([te,U])=>o.fillRect(te,U,H,H)),o.font="bold 12px -apple-system, system-ui, sans-serif";let B=`${Math.round(d)} \xD7 ${Math.round(M)}`,P=o.measureText(B).width+14,O=22,C=Math.min(h,f-P-4),N=$>O+8?$-O-4:$+M+4;o.fillStyle="#6366f1",he(o,C,N,P,O,5),o.fill(),o.fillStyle="#fff",o.textBaseline="middle",o.fillText(B,C+7,N+O/2),o.textBaseline="alphabetic"}let s=0,A=0,T=!1;function I(h,$){if(R(),u(),h===void 0||$===void 0)return;let d=Math.min(s,h),M=Math.min(A,$),H=Math.abs(h-s),B=Math.abs($-A);H>1&&B>1&&L(d,M,H,B)}I(),l.addEventListener("mousedown",h=>{h.preventDefault(),s=h.clientX,A=h.clientY,T=!0}),l.addEventListener("mousemove",h=>{T&&I(h.clientX,h.clientY)}),l.addEventListener("mouseup",h=>{if(!T)return;T=!1;let $=Math.min(s,h.clientX),d=Math.min(A,h.clientY),M=Math.abs(h.clientX-s),H=Math.abs(h.clientY-A);if(w(),M<10||H<10){t.close(),p(null);return}Q($,d,M,H)});function x(h){h.key==="Escape"&&(w(),t.close(),p(null))}window.addEventListener("keydown",x,!0);function w(){l.remove(),window.removeEventListener("keydown",x,!0)}function Q(h,$,d,M){let H=Math.round(h*i),B=Math.round($*c),P=Math.round(d*i),O=Math.round(M*c),C=document.createElement("canvas");C.width=P,C.height=O,C.getContext("2d").drawImage(t,H,B,P,O,0,0,P,O),t.close(),C.toBlob(N=>p(N),"image/png")}})}var Vt={tr:{fabLabel:"Geri bildirim",title:"Geri bildirim",categoryLabel:"Kategori",messageLabel:"A\xE7\u0131klama",messagePlaceholder:"Ne eklensin ya da nerede bir sorun var?",submitLabel:"G\xF6nder",successMessage:"Te\u015Fekk\xFCrler! Geri bildirimin al\u0131nd\u0131.",errorMessage:"G\xF6nderilemedi. L\xFCtfen tekrar dene."},en:{fabLabel:"Feedback",title:"Feedback",categoryLabel:"Category",messageLabel:"Description",messagePlaceholder:"What should be added, or where is the problem?",submitLabel:"Send",successMessage:"Thanks! Your feedback was received.",errorMessage:"Couldn't send. Please try again."}},Zt={tr:{tabForm:"G\xF6nderim",tabHistory:"Ge\xE7mi\u015F",historyEmpty:"Hen\xFCz bir konu\u015Fman yok.",otpTitle:"Ge\xE7mi\u015Fine eri\u015F",otpHint:"E-postana g\xF6nderece\u011Fimiz 6 haneli kodla t\xFCm konu\u015Fmalar\u0131n\u0131 g\xF6rebilirsin.",sendCode:"Kod g\xF6nder",codePlaceholder:"6 haneli kod",verify:"Do\u011Frula",codeSent:"Kod e-postana g\xF6nderildi.",invalidCode:"Kod hatal\u0131 ya da s\xFCresi doldu.",changeEmail:"De\u011Fi\u015Ftir",newReplyBadge:"Yeni yan\u0131t",open:"A\xE7",emailPlaceholder:"E-posta adresin",supportUnlimited:"S\u0131n\u0131rs\u0131z destek",supportLeft:t=>`Destek: ${t} g\xFCn kald\u0131`,supportLastDay:"Destek bug\xFCn sona eriyor",supportEnded:"Destek s\xFCresi doldu",emailLabel:"E-posta",emailHint:"Yan\u0131tlar\u0131 takip etmek ve kodunu kurtarmak i\xE7in.",tokenSaved:"Eri\u015Fim kodun",tokenHint:"Konu\u015Fmana Ge\xE7mi\u015F sekmesinden e-postanla eri\u015Febilirsin.",replyPlaceholder:"Yan\u0131t\u0131n\u0131 yaz\u2026",send:"G\xF6nder",sending:"G\xF6nderiliyor\u2026",you:"Sen",support:"Destek",loadError:"Konu\u015Fma y\xFCklenemedi.",notFound:"Konu\u015Fma bulunamad\u0131. Kodu kontrol et.",closedNotice:"Destek s\xFCresi doldu\u011Fu i\xE7in yeni yan\u0131t eklenemiyor.",back:"Geri",copied:"Kopyaland\u0131",copy:"Kodu kopyala",newSubmission:"Yeni g\xF6nderim",addImage:"G\xF6rsel ekle",attachmentSent:"\u{1F4CE} Ek g\xF6nderildi",poweredBy:"\xC7al\u0131\u015Ft\u0131rd\u0131\u011F\u0131m\u0131z platform"},en:{tabForm:"Submit",tabHistory:"History",historyEmpty:"You have no conversations yet.",otpTitle:"Access your history",otpHint:"We'll email you a 6-digit code to see all your conversations.",sendCode:"Send code",codePlaceholder:"6-digit code",verify:"Verify",codeSent:"The code was sent to your email.",invalidCode:"Wrong or expired code.",changeEmail:"Change",newReplyBadge:"New reply",open:"Open",emailPlaceholder:"Your email",supportUnlimited:"Unlimited support",supportLeft:t=>`Support: ${t} days left`,supportLastDay:"Support ends today",supportEnded:"Support period ended",emailLabel:"Email",emailHint:"To follow replies and recover your code.",tokenSaved:"Your access code",tokenHint:"You can return to this conversation from the History tab with your email.",replyPlaceholder:"Write your reply\u2026",send:"Send",sending:"Sending\u2026",you:"You",support:"Support",loadError:"Couldn't load the conversation.",notFound:"Conversation not found. Check the code.",closedNotice:"Support period ended; new replies are disabled.",back:"Back",copied:"Copied",copy:"Copy code",newSubmission:"New submission",addImage:"Add image",attachmentSent:"\u{1F4CE} Attachment sent",poweredBy:"Powered by"}},Qt='<svg viewBox="0 0 24 24" fill="none" width="14" height="14" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="7" fill="#0B1437"/><ellipse cx="12" cy="11.2" rx="6.2" ry="5" fill="#fff"/><path d="M8.5 14.5 L7 18 L11.5 15.4 Z" fill="#fff"/><circle cx="9.4" cy="11.2" r="1" fill="#0B1437"/><circle cx="12" cy="11.2" r="1" fill="#0B1437"/><circle cx="14.6" cy="11.2" r="1" fill="#0B1437"/></svg>';function ke(t,i){var b;return(b=(i==="en"?{support_ended:"Support period ended; submissions are closed.",daily_limit_site:"Daily submission limit for this site reached.",daily_limit_visitor:"You've hit today's submission limit. Try again tomorrow.",pending:"This site isn't approved yet.",blocked:"This site is blocked."}:{support_ended:"Destek s\xFCresi doldu, yeni g\xF6nderim al\u0131nam\u0131yor.",daily_limit_site:"Bu site i\xE7in g\xFCnl\xFCk g\xF6nderim limitine ula\u015F\u0131ld\u0131.",daily_limit_visitor:"G\xFCnl\xFCk g\xF6nderim limitine ula\u015Ft\u0131n. Yar\u0131n tekrar dene.",pending:"Bu site hen\xFCz onaylanmad\u0131.",blocked:"Bu site engellenmi\u015F."})[t!=null?t:""])!=null?b:i==="en"?"Couldn't send. Please try again.":"G\xF6nderilemedi. L\xFCtfen tekrar dene."}function en(){return(document.documentElement.lang||"").toLowerCase().startsWith("en")?"en":"tr"}var tn=[{value:"\xD6neri",labels:{tr:"\xD6neri",en:"Suggestion"}},{value:"Hata",labels:{tr:"Hata",en:"Bug"}},{value:"Tasar\u0131m",labels:{tr:"Tasar\u0131m",en:"Design"}},{value:"Di\u011Fer",labels:{tr:"Di\u011Fer",en:"Other"}}],nn={\u00D6neri:"Suggestion",Hata:"Bug",Tasar\u0131m:"Design",Di\u011Fer:"Other"};function an(t){return t!=null&&t.length?typeof t[0]=="string"?t.map(i=>{var c;return{value:i,labels:{tr:i,en:(c=nn[i])!=null?c:i}}}):t.map(i=>{var c,p;return{value:i.value,labels:{tr:((c=i.labels)==null?void 0:c.tr)||i.value,en:((p=i.labels)==null?void 0:p.en)||i.value}}}):tn}function kt(t,i){return t.labels[i]||t.labels.tr||t.labels.en||t.value}var Z=4;function F(t){return`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`}var y={chat:F('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),history:F('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),copy:F('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),camera:F('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),crop:F('<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>'),target:F('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>'),upload:F('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>'),close:F('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),check:F('<polyline points="20 6 9 17 4 12"/>'),alert:F('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'),clock:F('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),infinity:F('<path d="M18.6 6.62a4.38 4.38 0 1 0 0 6.76L12 12l-6.6 1.38a4.38 4.38 0 1 0 0-6.76L12 12z"/>'),back:F('<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'),x:F('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')};function on(){return crypto!=null&&crypto.randomUUID?crypto.randomUUID():`ann_${Date.now()}_${Math.random().toString(36).slice(2)}`}async function xt(){var k,l,o,R,u,L,s,A,T;let t=window.__KF_CONFIG__;if(!t)return;let i=(k=window.RivesioFeedback)!=null?k:{},c=i.domain||location.host,p;try{p=await(await fetch(`${t.base}/api/v1/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:c,meta:{user:i.user,href:location.href}})})).json()}catch(I){return}if(!p.enabled)return;let f={...t.project,...(l=p.project)!=null?l:{}},b={conversationEnabled:(R=(o=p.conversation)==null?void 0:o.enabled)!=null?R:!1,emailRequired:(L=(u=p.conversation)==null?void 0:u.emailRequired)!=null?L:!1,support:(s=p.support)!=null?s:null,canSubmit:(A=p.canSubmit)!=null?A:!0,blockedReason:(T=p.blockedReason)!=null?T:null};rn(t,i,f,{domain:c},b)}function rn(t,i,c,p,f){var st,lt;let b=document.createElement("div");b.id="rivesio-widget",document.body.appendChild(b);let k=b.attachShadow({mode:"open"}),l=document.createElement("style");l.textContent=pt,k.appendChild(l);let o=document.createElement("div");o.className="kf-root",o.dataset.pos=c.position||"bottom-right",o.dataset.fab=c.fabStyle||"label",c.logoUrl&&(o.dataset.hasLogo="1"),o.style.setProperty("--kf-accent",c.accentColor||"#0B1437");let R=c.theme||"auto";(R==="light"||R==="auto"&&document.documentElement.getAttribute("data-theme")==="light")&&(o.dataset.theme="light");let u=en(),L={...Vt[u],...(st=c.text)==null?void 0:st[u]},s=Zt[u],A=(lt=c.fields)!=null?lt:[],T=an(c.categories),I=f.conversationEnabled,x=c.logoUrl?`<img class="kf-logo" src="${a(c.logoUrl)}" alt="" width="20" height="20" decoding="async">`:y.chat,w=T.map(e=>`<option value="${a(e.value)}">${a(kt(e,u))}</option>`).join("");function Q(e){let n=T.find(r=>r.value===e);return n?kt(n,u):e}let h=A.map(e=>{var E;let n=e.required?"required":"",r=e.placeholder?`placeholder="${a(e.placeholder)}"`:"",m=`<label class="kf-label">${a(e.label)}${e.required?" *":""}</label>`,g="";if(e.type==="textarea")g=`<textarea class="kf-textarea kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" ${r} ${n}></textarea>`;else if(e.type==="select"){let v=((E=e.options)!=null?E:[]).map(_=>`<option value="${a(_)}">${a(_)}</option>`).join("");g=`<select class="kf-select kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" ${n}>${v}</select>`}else{if(e.type==="checkbox")return`<label class="kf-cf-check"><input type="checkbox" class="kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" data-cf-type="checkbox" ${n}> ${a(e.label)}</label>`;g=`<input type="${e.type==="email"?"email":"text"}" class="kf-input kf-cf" data-cf="${a(e.id)}" data-cf-label="${a(e.label)}" ${r} ${n}>`}return`<div>${m}${g}</div>`}).join(""),$=I?`<div>
         <label class="kf-label">${a(s.emailLabel)}${f.emailRequired?" *":""}</label>
         <input type="email" class="kf-input kf-email" placeholder="${a(s.emailPlaceholder)}" ${f.emailRequired?"required":""}>
         <div class="kf-token-hint">${a(s.emailHint)}</div>
       </div>`:"";o.innerHTML=`
    <button class="kf-fab" type="button" aria-label="${a(L.fabLabel)}" data-tip="${a(L.fabLabel)}">
      ${x}<span>${a(L.fabLabel)}</span><span class="kf-fab-badge" hidden></span>
    </button>

    <div class="kf-panel" role="dialog" aria-label="${a(L.title)}">

      <div class="kf-head">
        <div class="kf-title-wrap">
          <div class="kf-title-icon">${x}</div>
          <span class="kf-title">${a(L.title)}</span>
        </div>
        <div class="kf-head-actions">
          <button class="kf-icon-btn kf-close-btn" type="button" aria-label="${a(s.back)}">${y.close}</button>
        </div>
      </div>

      <div class="kf-tabs">
        <button class="kf-tab kf-tab-form" type="button" data-active="1">${y.chat}<span>${a(s.tabForm)}</span></button>
        <button class="kf-tab kf-tab-history" type="button" data-active="0">${y.history}<span>${a(s.tabHistory)}</span><span class="kf-tab-badge" hidden></span></button>
      </div>

      <div class="kf-support" hidden></div>
      <div class="kf-msg" hidden></div>

      <!-- \u2500\u2500 FORM TAB \u2500\u2500 -->
      <div class="kf-view-form">
        <div class="kf-body">
          <div>
            <label class="kf-label">${a(L.categoryLabel)}</label>
            <select class="kf-select" aria-label="${a(L.categoryLabel)}">${w}</select>
          </div>

          <div>
            <label class="kf-label">${a(L.messageLabel)}</label>
            <textarea class="kf-textarea" placeholder="${a(L.messagePlaceholder)}"></textarea>
          </div>

          ${$}
          ${h}

          <div class="kf-capture-row">
            <button class="kf-chip kf-capture-full" type="button">${y.camera} ${a(u==="en"?"Full screen":"T\xFCm ekran")}</button>
            <button class="kf-chip kf-capture-area" type="button">${y.crop} ${a(u==="en"?"Select area":"Alan se\xE7")}</button>
            <button class="kf-chip kf-element-select" type="button">${y.target} ${a(u==="en"?"Pick element":"\xD6\u011Fe se\xE7")}</button>
            <button class="kf-chip kf-chip-upload kf-upload" type="button" aria-label="${a(s.addImage)}">${y.upload}</button>
          </div>

          <div class="kf-attach-row"><span class="kf-counter">0 / ${Z}</span></div>
          <div class="kf-thumbs"></div>
          <div class="kf-annotations" hidden></div>
          <input class="kf-file" type="file" accept="image/*" multiple hidden />

          <div class="kf-hint">${a(u==="en"?"Tip:":"\u0130pucu:")} <kbd>\u2318 / Ctrl + /</kbd></div>
        </div>

        <div class="kf-foot">
          <button class="kf-btn kf-btn-ghost kf-cancel" type="button">${a(u==="en"?"Cancel":"Vazge\xE7")}</button>
          <button class="kf-btn kf-btn-primary kf-submit" type="button">${a(L.submitLabel)}</button>
        </div>
      </div>

      <!-- \u2500\u2500 HISTORY TAB \u2500\u2500 -->
      <div class="kf-view-history" hidden>
        <div class="kf-history-main">
          <div class="kf-session-bar" hidden>
            <span class="kf-session-email"></span>
            <button class="kf-link kf-session-change" type="button">${a(s.changeEmail)}</button>
          </div>
          <ul class="kf-history-list"></ul>
          <p class="kf-history-empty" hidden>${a(s.historyEmpty)}</p>
          ${I?`
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
          </div>`:""}
        </div>

        <div class="kf-convo" hidden>
          <div class="kf-convo-head">
            <button class="kf-back" type="button">${y.back} ${a(s.back)}</button>
            <span class="kf-convo-cat"></span>
          </div>
          <div class="kf-thread"></div>
          <div class="kf-reply-box">
            <textarea class="kf-reply-input kf-textarea" placeholder="${a(s.replyPlaceholder)}" style="min-height:64px"></textarea>
            <div class="kf-reply-foot">
              <span class="kf-counter kf-reply-counter">0 / ${Z}</span>
              <button class="kf-chip kf-reply-upload" type="button" aria-label="${a(s.addImage)}">${y.upload}</button>
              <button class="kf-btn kf-btn-primary kf-reply-send" type="button">${a(s.send)}</button>
            </div>
            <input class="kf-reply-file" type="file" accept="image/*" multiple hidden />
          </div>
          <div class="kf-convo-closed" hidden>${a(s.closedNotice)}</div>
        </div>
      </div>

      <a class="kf-powered" href="${a(t.base)}" target="_blank" rel="noopener noreferrer">
        <span>${a(s.poweredBy)}</span>
        <span class="kf-brand">${Qt}<span class="kf-brand-name">Rivesio</span></span>
      </a>

    </div>
  `,k.appendChild(o);let d=e=>o.querySelector(e),M=d(".kf-fab"),H=d(".kf-close-btn"),B=d(".kf-tab-form"),P=d(".kf-tab-history"),O=d(".kf-cancel"),C=d(".kf-submit"),N=d(".kf-capture-full"),te=d(".kf-capture-area"),U=d(".kf-element-select"),He=d(".kf-upload"),pe=d(".kf-file"),re=d(".kf-view-form .kf-textarea"),Y=o.querySelector(".kf-email"),Ce=d(".kf-view-form .kf-select"),Be=d(".kf-thumbs"),wt=d(".kf-attach-row .kf-counter"),xe=d(".kf-annotations"),q=d(".kf-msg"),K=d(".kf-support"),ve=d(".kf-view-form"),_e=d(".kf-view-form .kf-body"),ze=d(".kf-view-form .kf-foot"),Ae=d(".kf-view-history"),Re=d(".kf-history-main"),Ie=d(".kf-history-list"),Et=d(".kf-history-empty"),De=d(".kf-convo"),Lt=d(".kf-convo-cat"),ee=d(".kf-thread"),Fe=d(".kf-reply-box"),ue=d(".kf-reply-input"),be=d(".kf-reply-file"),Pe=d(".kf-reply-upload"),se=d(".kf-reply-send"),Tt=d(".kf-reply-counter"),je=d(".kf-convo-closed"),$t=d(".kf-back"),Oe=d(".kf-fab-badge"),We=d(".kf-tab-badge"),Mt=d(".kf-session-bar"),St=d(".kf-session-email"),Ht=d(".kf-session-change"),Ne=o.querySelector(".kf-otp"),G=o.querySelector(".kf-otp-email"),le=o.querySelector(".kf-otp-send"),me=o.querySelector(".kf-otp-step2"),D=o.querySelector(".kf-otp-code"),ne=o.querySelector(".kf-otp-verify"),j=[],X=[],J=[];function ye(){let e=f.support;if(!e||e.unlimited||e.endsAt===null){K.hidden=!0;return}K.hidden=!1;let n=Math.ceil((e.endsAt-Date.now())/864e5);if(n<=0)K.dataset.expired="1",K.innerHTML=`${y.alert}<span>${a(s.supportEnded)}</span>`;else{K.dataset.expired="0";let r=n===1?s.supportLastDay:s.supportLeft(n);K.innerHTML=`${y.clock}<span>${a(r)}</span>`}}let Ue=`kf_history_${t.widgetKey}`,we=`kf_session_${t.widgetKey}`,qe=`kf_seen_${t.widgetKey}`;function Ee(){try{return JSON.parse(localStorage.getItem(Ue)||"[]")}catch(e){return[]}}function Ct(e){let n=Ee();n.unshift(e),localStorage.setItem(Ue,JSON.stringify(n.slice(0,50)))}function Ke(){try{return JSON.parse(localStorage.getItem(we)||"null")}catch(e){return null}}function Ye(e){e?localStorage.setItem(we,JSON.stringify(e)):localStorage.removeItem(we)}function Ge(){try{return JSON.parse(localStorage.getItem(qe)||"{}")}catch(e){return{}}}function Bt(e){let n=Ge();n[e]=Date.now(),localStorage.setItem(qe,JSON.stringify(n)),Ve()}function _t(e){return new Date(e).toLocaleDateString(u==="en"?"en-US":"tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}function zt(e){return new Date(e).toLocaleTimeString(u==="en"?"en-US":"tr-TR",{hour:"2-digit",minute:"2-digit"})}function At(e){return new Date(e).toLocaleDateString(u==="en"?"en-US":"tr-TR",{day:"numeric",month:"long",year:"numeric"})}let Xe={};function Je(){var r;let e=Ke(),n=new Set;for(let m of(r=e==null?void 0:e.conversations)!=null?r:[])n.add(m.token);for(let m of Ee())m.token&&n.add(m.token);return Array.from(n)}function Le(e){var r;let n=Xe[e];return n?((r=Ge()[e])!=null?r:0)<n:!1}function Rt(){return Je().filter(Le).length}function Ve(){let e=Rt();Oe.hidden=e===0,Oe.textContent=e>9?"9+":String(e),We.hidden=e===0,We.textContent=e>9?"9+":String(e)}async function Ze(){var n;if(!I)return;let e=Je().slice(0,50);if(e.length)try{let r=await fetch(`${t.base}/api/v1/conversation/status`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,tokens:e})});if(!r.ok)return;let m=await r.json();for(let[g,E]of Object.entries((n=m.statuses)!=null?n:{}))E.last_admin_reply_at&&(Xe[g]=E.last_admin_reply_at);Ve()}catch(r){}}function Qe(e){let n=document.createElement("li");return n.className="kf-history-item",e.unread&&(n.dataset.unread="1"),n.innerHTML=`
      <div class="kf-hi-left">
        <span class="kf-hi-cat">${a(e.title)}${e.unread?`<span class="kf-hi-dot" title="${a(s.newReplyBadge)}"></span>`:""}</span>
        <span class="kf-hi-page">${a(e.snippet)}</span>
      </div>
      <div class="kf-hi-right">
        <span class="kf-hi-date">${a(_t(e.date))}</span>
      </div>`,I&&e.token?n.addEventListener("click",()=>ot(e.token)):n.style.cursor="default",n}function ae(){var m;let e=Ke();Ie.innerHTML="",Mt.hidden=!e,e&&(St.textContent=e.email),Ne&&(Ne.hidden=!!e);let n=[],r=new Set;for(let g of(m=e==null?void 0:e.conversations)!=null?m:[])r.add(g.token),n.push(Qe({title:Q(g.category),snippet:g.last_message,date:g.last_activity_at,token:g.token,unread:Le(g.token)}));for(let g of Ee())g.token&&r.has(g.token)||n.push(Qe({title:Q(g.category),snippet:g.page,date:g.date,token:g.token,id:g.id,unread:g.token?Le(g.token):!1}));Et.hidden=n.length>0,n.forEach(g=>Ie.appendChild(g))}function et(){_e.hidden=!1,ze.hidden=!1}function tt(){B.dataset.active="1",P.dataset.active="0",ve.hidden=!1,Ae.hidden=!0,et(),K.hidden=!f.support,ye(),S("",null)}function It(){B.dataset.active="0",P.dataset.active="1",ve.hidden=!0,Ae.hidden=!1,K.hidden=!0,S("",null),at(),ae()}B.addEventListener("click",tt),P.addEventListener("click",It);function Dt(e,n){var r;if((r=navigator.clipboard)==null||r.writeText(e).catch(()=>{}),n){n.classList.add("copied");let m=n.innerHTML;n.innerHTML=y.check,setTimeout(()=>{n.classList.remove("copied"),n.innerHTML=m},1600)}}function S(e,n){if(!n){q.hidden=!0,q.innerHTML="";return}q.hidden=!1,q.className=`kf-msg kf-${n}`,q.innerHTML=`${n==="ok"?y.check:y.alert} ${a(e)}`}function V(){let e=j.length>=Z;wt.textContent=`${j.length} / ${Z}`,N.disabled=e,te.disabled=e,U.disabled=e,He.disabled=e,Be.innerHTML="",j.forEach((n,r)=>{let m=document.createElement("div");m.className="kf-thumb",m.innerHTML=`<img src="${n.url}" alt="ek"><button class="kf-thumb-del" type="button" aria-label="Kald\u0131r">${y.x}</button>`,m.querySelector("button").addEventListener("click",()=>{if(URL.revokeObjectURL(n.url),n.annotationId){let g=X.findIndex(E=>E.id===n.annotationId);g>=0&&X.splice(g,1)}j.splice(r,1),V(),de()}),Be.appendChild(m)})}function de(){xe.hidden=X.length===0,xe.innerHTML="",X.forEach((e,n)=>{let r=document.createElement("div");r.className="kf-ann-item",r.innerHTML=`
        <div class="kf-ann-pin">${n+1}</div>
        <div class="kf-ann-main">
          <div class="kf-ann-selector">${a(e.selector)}</div>
          <div class="kf-ann-note">${a(e.value)}</div>
        </div>
        <button class="kf-ann-del" type="button" aria-label="Kald\u0131r">${y.x}</button>`,r.querySelector("button").addEventListener("click",()=>{for(let m=j.length-1;m>=0;m--)j[m].annotationId===e.id&&(URL.revokeObjectURL(j[m].url),j.splice(m,1));X.splice(n,1),V(),de()}),xe.appendChild(r)})}function ge(e,n,r){j.length>=Z||(j.push({blob:e,kind:n,annotationId:r,url:URL.createObjectURL(e)}),V())}function Te(){o.dataset.open="1",ve.hidden||setTimeout(()=>re.focus(),60)}function ce(){o.dataset.open="0",tt()}function nt(){o.dataset.open==="1"?ce():Te()}M.addEventListener("click",nt),H.addEventListener("click",ce),O.addEventListener("click",ce),He.addEventListener("click",()=>pe.click()),pe.addEventListener("change",()=>{var e;Array.from((e=pe.files)!=null?e:[]).filter(n=>n.type.startsWith("image/")).forEach(n=>ge(n,"upload")),pe.value=""}),N.addEventListener("click",async()=>{N.disabled=!0,N.innerHTML=`${y.camera} ${a(u==="en"?"Waiting\u2026":"Bekleniyor\u2026")}`;try{let e=await bt(b);e?ge(e,"screenshot"):S(u==="en"?"Screen share cancelled.":"Ekran payla\u015F\u0131m\u0131 iptal edildi.","err")}catch(e){S(u==="en"?"Couldn't capture screen.":"Ekran yakalanamad\u0131.","err")}finally{N.innerHTML=`${y.camera} ${a(u==="en"?"Full screen":"T\xFCm ekran")}`,V()}}),te.addEventListener("click",async()=>{te.disabled=!0,te.innerHTML=`${y.crop} ${a(u==="en"?"Waiting\u2026":"Bekleniyor\u2026")}`;try{let e=await ht(b);e?ge(e,"screenshot"):S(u==="en"?"Area selection cancelled.":"Alan se\xE7imi iptal edildi.","err")}catch(e){S(u==="en"?"Couldn't capture screen.":"Ekran yakalanamad\u0131.","err")}finally{te.innerHTML=`${y.crop} ${a(u==="en"?"Select area":"Alan se\xE7")}`,V()}}),U.addEventListener("click",async()=>{if(j.length>=Z){S(u==="en"?"Attachment limit reached.":"Ek s\u0131n\u0131r\u0131na ula\u015F\u0131ld\u0131.","err");return}ce(),U.disabled=!0,U.innerHTML=`${y.target} ${a(u==="en"?"Waiting\u2026":"Bekleniyor\u2026")}`;let e=await mt(b);if(!e){U.innerHTML=`${y.target} ${a(u==="en"?"Pick element":"\xD6\u011Fe se\xE7")}`,U.disabled=!1,Te(),S(u==="en"?"Screen capture was cancelled.":"Ekran payla\u015F\u0131m\u0131 iptal edildi.","err"),V();return}try{let n=X.length+1,r=await ln(b,u,n);if(r){let m=await gt(e,{x:r.rect.x,y:r.rect.y,w:r.rect.width,h:r.rect.height},n);X.push(r),m?ge(m,"screenshot",r.id):S(u==="en"?"Element screenshot couldn't be captured.":"\xD6\u011Fe ekran g\xF6r\xFCnt\xFCs\xFC al\u0131namad\u0131.","err"),de()}}finally{ut(e),U.innerHTML=`${y.target} ${a(u==="en"?"Pick element":"\xD6\u011Fe se\xE7")}`,U.disabled=!1,Te(),V()}});function Ft(){let e=o.querySelectorAll(".kf-cf"),n=[];for(let r of Array.from(e)){let m=r.dataset.cfLabel||"",E=r.dataset.cfType==="checkbox"?r.checked?u==="en"?"Yes":"Evet":"":r.value.trim();if(r.hasAttribute("required")&&!E)return r.focus(),{ok:!1,values:[]};E&&n.push({label:m,value:E})}return{ok:!0,values:n}}function Pt(){f.canSubmit||(C.disabled=!0,S(ke(f.blockedReason,u),"err"))}async function jt(){var m,g,E,v;if(!f.canSubmit){S(ke(f.blockedReason,u),"err");return}let e=re.value.trim();if(!e){S(u==="en"?"Please write a description.":"L\xFCtfen bir a\xE7\u0131klama yaz.","err"),re.focus();return}let n=(Y==null?void 0:Y.value.trim())||"";if(Y!=null&&Y.hasAttribute("required")&&!n){S(u==="en"?"Please enter your email.":"L\xFCtfen e-postan\u0131 gir.","err"),Y.focus();return}let r=Ft();if(!r.ok){S(u==="en"?"Please fill required fields.":"L\xFCtfen zorunlu alanlar\u0131 doldur.","err");return}C.disabled=!0,C.textContent=u==="en"?"Sending\u2026":"G\xF6nderiliyor\u2026",S("",null);try{let _=await fetch(`${t.base}/api/v1/feedback`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:p.domain,category:Ce.value,message:e,email:n||void 0,page_url:location.href,viewport:`${window.innerWidth}x${window.innerHeight}`,wp_user:i.user,locale:u,custom_fields:[...r.values,...X]})}),W=await _.json();if(!_.ok||!W.ok){S(ke((m=W==null?void 0:W.error)!=null?m:null,u),"err");return}let Nt=new Map(((g=W.annotation_replies)!=null?g:[]).map(z=>[z.id,z.reply_id])),fe=0;for(let z of j){let ie=new FormData;ie.append("widget_key",t.widgetKey),ie.append("domain",p.domain),ie.append("kind",z.kind);let Gt=z.blob.type==="image/png"?"png":"jpg";ie.append("file",z.blob,`${z.kind}.${Gt}`);let ft=z.annotationId?Nt.get(z.annotationId):void 0;ft&&ie.append("reply_id",ft),await fetch(`${t.base}/api/v1/feedback/${W.feedback_id}/attachment`,{method:"POST",body:ie}).then(Xt=>Xt.ok).catch(()=>!1)||fe++}let Me=W.feedback_id,dt=W.token;Ct({id:Me,token:dt,category:Ce.value,page:location.pathname,date:Date.now()});let Ut=fe>0?`<div class="kf-msg kf-warn">${y.alert} ${a(u==="en"?`${fe} attachment${fe>1?"s":""} could not be uploaded.`:`${fe} ek y\xFCklenemedi.`)}</div>`:"",ct=Me,qt=u==="en"?"Reference":"Referans no",Kt=`#${Me.slice(0,8)}`,Yt=I&&dt?`<div class="kf-token-hint">${a(s.tokenHint)}</div>`:"";_e.hidden=!0,ze.hidden=!0,K.hidden=!0,q.hidden=!1,q.className="kf-msg kf-ok kf-success",q.innerHTML=`
        <div class="kf-success-head">${y.check}<span>${a(L.successMessage)}</span></div>
        <div class="kf-token-box">
          <span class="kf-token-label">${a(qt)}</span>
          <div class="kf-token-row">
            <span class="kf-token-val" title="${a(ct)}">${a(Kt)}</span>
          </div>
          <button class="kf-btn kf-btn-primary kf-token-copy" type="button">${y.copy}<span>${a(s.copy)}</span></button>
          ${Yt}
        </div>
        ${Ut}
        <button class="kf-btn kf-btn-ghost kf-new-submit" type="button">${a(s.newSubmission)}</button>`,(E=q.querySelector(".kf-token-copy"))==null||E.addEventListener("click",z=>Dt(ct,z.currentTarget)),(v=q.querySelector(".kf-new-submit"))==null||v.addEventListener("click",()=>{et(),K.hidden=!f.support,ye(),S("",null),re.focus()}),re.value="",Y&&(Y.value=n),o.querySelectorAll(".kf-cf").forEach(z=>{z.dataset.cfType==="checkbox"?z.checked=!1:z.value=""}),j.splice(0).forEach(z=>URL.revokeObjectURL(z.url)),X.splice(0),V(),de()}catch(_){S(u==="en"?"Connection error. Please try again.":"Ba\u011Flant\u0131 hatas\u0131. L\xFCtfen tekrar dene.","err")}finally{C.disabled=!1,C.textContent=L.submitLabel}}C.addEventListener("click",jt);let oe=null;function at(){oe=null,De.hidden=!0,Re.hidden=!1,J.splice(0)}$t.addEventListener("click",()=>{at(),ae()});async function ot(e){oe=e,Re.hidden=!0,De.hidden=!1,ee.innerHTML='<p class="kf-history-empty">\u2026</p>',je.hidden=!0,Fe.hidden=!0;try{let n=await fetch(`${t.base}/api/v1/conversation/${encodeURIComponent(e)}`);if(n.status===404){ee.innerHTML=`<p class="kf-history-empty">${a(s.notFound)}</p>`;return}if(!n.ok){ee.innerHTML=`<p class="kf-history-empty">${a(s.loadError)}</p>`;return}let r=await n.json();Wt(r.conversation,e),Bt(e);let m=!!r.can_reply;Fe.hidden=!m,je.hidden=m,$e()}catch(n){ee.innerHTML=`<p class="kf-history-empty">${a(s.loadError)}</p>`}}function Ot(e){var r;let n=(r=e.imgs)!=null&&r.length?`<div class="kf-convo-imgs">${e.imgs.map(m=>`<img src="${a(m.url)}" alt="ek">`).join("")}</div>`:"";return`<div class="kf-msg-row ${e.mine?"kf-mine":"kf-theirs"}">
      <div class="kf-bubble">
        <div class="kf-bubble-body">${a(e.body)}</div>${n}
      </div>
      <div class="kf-bubble-time">${a(e.author)} \xB7 ${a(zt(e.ts))}</div>
    </div>`}function Wt(e,n){Lt.textContent=Q(e.category);let r=e.attachments.filter(v=>!v.reply_id).map(v=>({url:v.url})),m=[{author:"user",message:e.message,created_at:e.created_at,imgs:r},...e.replies.map(v=>({...v,imgs:e.attachments.filter(_=>_.reply_id===v.id).map(_=>({url:_.url}))}))],g="",E="";for(let v of m){let _=At(v.created_at);_!==E&&(g+=`<div class="kf-day-sep"><span>${a(_)}</span></div>`,E=_);let W=v.author==="user";g+=Ot({author:W?s.you:s.support,ts:v.created_at,body:v.message,mine:W,imgs:v.imgs})}ee.innerHTML=g,ee.querySelectorAll(".kf-convo-imgs img").forEach(v=>{v.addEventListener("click",()=>window.open(v.src,"_blank"))}),ee.scrollTop=ee.scrollHeight}function $e(){Tt.textContent=`${J.length} / ${Z}`,Pe.toggleAttribute("disabled",J.length>=Z)}Pe.addEventListener("click",()=>be.click()),be.addEventListener("change",()=>{var e;Array.from((e=be.files)!=null?e:[]).filter(n=>n.type.startsWith("image/")).slice(0,Z-J.length).forEach(n=>J.push(n)),be.value="",$e()});async function it(){var n,r,m;if(!oe)return;let e=ue.value.trim();if(!e&&J.length===0){ue.focus();return}se.disabled=!0,se.textContent=s.sending;try{let g=null;if(e||J.length>0){let E=await fetch(`${t.base}/api/v1/conversation/${encodeURIComponent(oe)}/reply`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e||s.attachmentSent,page_url:location.href})});if(!E.ok){let _=await E.json().catch(()=>({}));S(ke((n=_==null?void 0:_.error)!=null?n:null,u),"err");return}let v=await E.json().catch(()=>null);g=(m=(r=v==null?void 0:v.reply)==null?void 0:r.id)!=null?m:null}for(let E of J){let v=new FormData;v.append("file",E,E.name||"image.jpg"),g&&v.append("reply_id",g),await fetch(`${t.base}/api/v1/conversation/${encodeURIComponent(oe)}/attachment`,{method:"POST",body:v}).catch(()=>{})}ue.value="",J.splice(0),$e(),await ot(oe)}finally{se.disabled=!1,se.textContent=s.send}}se.addEventListener("click",it),ue.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),it())}),le==null||le.addEventListener("click",async()=>{let e=G==null?void 0:G.value.trim();if(!e||!e.includes("@")){G==null||G.focus();return}le.disabled=!0;try{await fetch(`${t.base}/api/v1/conversation/request-code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,domain:p.domain,email:e})}).catch(()=>{}),S(s.codeSent,"ok"),me&&(me.hidden=!1),D==null||D.focus()}finally{le.disabled=!1}});async function rt(){var r;let e=G==null?void 0:G.value.trim(),n=D==null?void 0:D.value.trim();if(!e||!n||n.length!==6){D==null||D.focus();return}ne&&(ne.disabled=!0);try{let m=await fetch(`${t.base}/api/v1/conversation/verify-code`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({widget_key:t.widgetKey,email:e,code:n})}),g=await m.json().catch(()=>({}));if(!m.ok||!g.ok){S(s.invalidCode,"err");return}Ye({email:e,conversations:(r=g.conversations)!=null?r:[],verifiedAt:Date.now()}),D&&(D.value=""),me&&(me.hidden=!0),S("",null),Ze().then(ae),ae()}catch(m){S(s.invalidCode,"err")}finally{ne&&(ne.disabled=!1)}}ne==null||ne.addEventListener("click",rt),D==null||D.addEventListener("keydown",e=>{e.key==="Enter"&&(e.preventDefault(),rt())}),Ht.addEventListener("click",()=>{Ye(null),ae()}),window.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="/"&&(e.preventDefault(),nt()),e.key==="Escape"&&o.dataset.open==="1"&&ce()}),ye(),V(),de(),Pt(),Ze().then(ae)}function a(t){return t.replace(/[&<>"']/g,i=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[i])}function vt(t){let i=[],c=t;for(;c&&c.nodeType===1&&c!==document.body&&i.length<5;){let p=c.tagName.toLowerCase();if(c.id){p+=`#${yt(c.id)}`,i.unshift(p);break}let f=Array.from(c.classList).filter(k=>k&&!k.startsWith("rivesio-")&&!k.startsWith("kf-")).slice(0,2);f.length&&(p+=`.${f.map(yt).join(".")}`);let b=c.parentElement;if(b){let k=Array.from(b.children).filter(l=>l.tagName===c.tagName);k.length>1&&(p+=`:nth-of-type(${k.indexOf(c)+1})`)}i.unshift(p),c=b}return i.join(" > ")||t.tagName.toLowerCase()}function yt(t){let i=window.CSS;return i!=null&&i.escape?i.escape(t):t.replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function sn(t){return(t.textContent||"").replace(/\s+/g," ").trim().slice(0,140)}function ln(t,i,c){return new Promise(p=>{let f=document.createElement("div");f.className="rivesio-element-highlight",Object.assign(f.style,{position:"fixed",zIndex:"2147483645",pointerEvents:"none",border:"2px solid #3b82f6",background:"rgba(59,130,246,.14)",borderRadius:"8px",boxShadow:"0 0 0 9999px rgba(15,23,42,.18)",transition:"left .08s, top .08s, width .08s, height .08s",display:"none"});let b=document.createElement("div");Object.assign(b.style,{position:"fixed",zIndex:"2147483646",pointerEvents:"none",background:"#2563eb",color:"#fff",borderRadius:"999px",padding:"4px 9px",font:"600 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",boxShadow:"0 8px 18px rgba(37,99,235,.28)",display:"none"}),b.textContent=i==="en"?"Click an element":"\xD6\u011Feye t\u0131kla",document.body.append(f,b),t.style.visibility="hidden";let k=null,l=null,o=!1;function R(x){o||(o=!0,u(),p(x))}function u(){t.style.visibility="",f.remove(),b.remove(),l==null||l.remove(),window.removeEventListener("mousemove",s,!0),window.removeEventListener("click",A,!0),window.removeEventListener("keydown",T,!0)}function L(x){if(k=x,!x){f.style.display="none",b.style.display="none";return}let w=x.getBoundingClientRect();f.style.display="block",f.style.left=`${Math.max(0,w.left)}px`,f.style.top=`${Math.max(0,w.top)}px`,f.style.width=`${Math.max(0,w.width)}px`,f.style.height=`${Math.max(0,w.height)}px`,b.style.display="block",b.style.left=`${Math.min(window.innerWidth-132,Math.max(8,w.left))}px`,b.style.top=`${Math.max(8,w.top-32)}px`}function s(x){if(l)return;let w=document.elementFromPoint(x.clientX,x.clientY);if(!w||w===t||t.contains(w)){L(null);return}L(w)}function A(x){l!=null&&l.contains(x.target)||(x.preventDefault(),x.stopPropagation(),k&&I(k))}function T(x){x.key==="Escape"&&(x.preventDefault(),R(null))}function I(x){let w=x.getBoundingClientRect();l==null||l.remove(),l=document.createElement("div");let Q=Math.min(320,window.innerWidth-24),h=190,$=window.innerHeight-w.bottom-10,d=w.top-10,M;$>=h||$>=d?M=Math.min(window.innerHeight-h-8,w.bottom+10):M=Math.max(8,w.top-h-10);let H=Math.min(window.innerWidth-Q-8,Math.max(8,w.left));Object.assign(l.style,{position:"fixed",zIndex:"2147483647",width:`${Q}px`,left:`${H}px`,top:`${Math.max(8,M)}px`,background:"#ffffff",border:"1px solid rgba(15,23,42,.14)",borderRadius:"12px",boxShadow:"0 20px 50px rgba(15,23,42,.22)",padding:"12px",font:"13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",color:"#0f172a"}),l.innerHTML=`
        <div style="font-weight:700;margin-bottom:6px">${i==="en"?"Add note to element":"\xD6\u011Feye not ekle"}</div>
        <div style="font-size:11px;color:#64748b;margin-bottom:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${a(vt(x))}</div>
        <textarea style="width:100%;min-height:78px;resize:none;border:1px solid #cbd5e1;border-radius:8px;padding:8px;font:13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif;outline:none" placeholder="${i==="en"?"What should change here?":"Burada ne de\u011Fi\u015Fmeli?"}"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:10px">
          <button type="button" data-cancel style="border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:7px 10px;font-weight:600;color:#475569;cursor:pointer">${i==="en"?"Cancel":"Vazge\xE7"}</button>
          <button type="button" data-save style="border:0;background:#2563eb;border-radius:8px;padding:7px 12px;font-weight:700;color:#fff;cursor:pointer">${i==="en"?"Add":"Ekle"}</button>
        </div>`,document.body.appendChild(l);let B=l.querySelector("textarea");B.focus(),l.querySelector("[data-cancel]").addEventListener("click",()=>R(null)),l.querySelector("[data-save]").addEventListener("click",()=>{let P=B.value.trim();if(!P){B.focus();return}let O=vt(x),C=x.getBoundingClientRect();R({id:on(),kind:"element_annotation",index:c,label:i==="en"?"Element note":"\xD6\u011Fe notu",value:P,selector:O,tagName:x.tagName.toLowerCase(),text:sn(x),rect:{x:Math.round(C.left),y:Math.round(C.top),width:Math.round(C.width),height:Math.round(C.height),viewportWidth:window.innerWidth,viewportHeight:window.innerHeight}})})}window.addEventListener("mousemove",s,!0),window.addEventListener("click",A,!0),window.addEventListener("keydown",T,!0)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",xt):xt();})();
