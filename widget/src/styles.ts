export const widgetCss = `
:host { all: initial; }
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Tokens ── */
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

/* ── FAB ── */
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

/* ── Panel ── */
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

/* ── Header ── */
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

/* ── Icon buttons ── */
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

/* ── Message (ok/err) ── */
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

/* ── Body ── */
.kf-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  overflow-y: auto;
  max-height: 68dvh;
}

/* ── Field label ── */
.kf-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--txt-muted);
  margin-bottom: 6px;
}

/* ── Select ── */
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

/* ── Textarea ── */
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

/* ── Custom text/email input ── */
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

/* ── Custom checkbox field ── */
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

/* ── Capture row ── */
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

/* ── Attachments ── */
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

/* ── Element annotations ── */
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

/* ── Hint ── */
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

/* ── Footer ── */
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

/* ── History view ── */
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

/* ── Success ref box ── */
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

/* ── Scrollbar ── */
.kf-body::-webkit-scrollbar { width: 4px; }
.kf-body::-webkit-scrollbar-track { background: transparent; }
.kf-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

/* ── Mobile ── */
@media (max-width: 480px) {
  .kf-root { bottom: 16px; }
  .kf-root[data-pos="bottom-right"] { right: 16px; }
  .kf-root[data-pos="bottom-left"]  { left: 16px; }
  .kf-panel { width: calc(100vw - 24px); max-width: none; border-radius: var(--radius-lg); }
  .kf-fab span { display: none; }
  .kf-fab { padding: 12px; border-radius: 50%; }
  .kf-fab svg { width: 18px; height: 18px; }
}
`;
