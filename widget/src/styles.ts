export const widgetCss = `
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

/* ── FAB ── */
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

/* ── Panel ── */
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

/* ── Header ── */
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

/* ── Message bar ── */
.kf-msg {
  font-size: 12.5px; font-weight: 500;
  display: flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-bottom: 1px solid transparent;
}
.kf-msg[hidden] { display: none; }
.kf-msg.kf-ok  { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.kf-msg.kf-err { background: #fef2f2; color: #b91c1c; border-color: #fecaca; }
.kf-msg svg { width: 14px; height: 14px; flex-shrink: 0; }

/* ── Body ── */
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

/* ── Capture row ── */
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

/* ── Attach counter ── */
.kf-attach-row {
  display: flex; align-items: center; gap: 6px;
}
.kf-counter {
  font-size: 11px; font-weight: 700; color: #94a3b8;
  background: #f1f5f9; padding: 2px 8px; border-radius: 100px;
}

/* ── Thumbnails ── */
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

/* ── Hint ── */
.kf-hint { font-size: 11.5px; color: #94a3b8; text-align: center; }
.kf-hint kbd {
  display: inline-block;
  background: #f1f5f9; border: 1px solid #e2e8f0; border-bottom-width: 2px;
  border-radius: 5px; padding: 0 5px; font-size: 10.5px; color: #64748b;
  font-family: inherit;
}

/* ── History view ── */
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

/* ── Footer ── */
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
`;
