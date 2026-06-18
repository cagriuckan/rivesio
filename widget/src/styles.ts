// Styles for the widget UI, scoped inside a Shadow DOM so they never clash with the host page.
export const widgetCss = `
:host { all: initial; }
*, *::before, *::after { box-sizing: border-box; }
.kf-root {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  position: fixed;
  z-index: 2147483000;
  bottom: 20px;
}
.kf-root[data-pos="bottom-right"] { right: 20px; }
.kf-root[data-pos="bottom-left"] { left: 20px; }

.kf-fab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  background: var(--kf-accent, #4f46e5);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 16px;
  border-radius: 999px;
  box-shadow: 0 8px 24px rgba(0,0,0,.18);
  transition: transform .15s ease, box-shadow .15s ease;
}
.kf-fab:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(0,0,0,.24); }
.kf-fab svg { width: 18px; height: 18px; }

.kf-panel {
  position: absolute;
  bottom: 60px;
  width: 360px;
  max-width: calc(100vw - 32px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,.28);
  overflow: hidden;
  opacity: 0;
  transform: translateY(8px) scale(.98);
  pointer-events: none;
  transition: opacity .16s ease, transform .16s ease;
}
.kf-root[data-pos="bottom-right"] .kf-panel { right: 0; }
.kf-root[data-pos="bottom-left"] .kf-panel { left: 0; }
.kf-root[data-open="1"] .kf-panel { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

.kf-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #eef0f4;
}
.kf-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.kf-close { background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 20px; line-height: 1; padding: 4px; }
.kf-close:hover { color: #475569; }

.kf-body { padding: 16px 18px; }
.kf-field { margin-bottom: 12px; }
.kf-select {
  width: 100%; padding: 9px 10px; font-size: 14px; color: #0f172a;
  border: 1px solid #d8dde6; border-radius: 9px; background: #fff;
}
.kf-textarea {
  width: 100%; min-height: 96px; resize: vertical; padding: 10px 12px; font-size: 14px;
  border: 1px solid #d8dde6; border-radius: 9px; color: #0f172a; line-height: 1.4;
}
.kf-textarea:focus, .kf-select:focus { outline: 2px solid var(--kf-accent, #4f46e5); outline-offset: 0; border-color: transparent; }

.kf-actions { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.kf-chip {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #334155;
  background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 7px 10px; cursor: pointer;
}
.kf-chip:hover { background: #e8edf5; }
.kf-chip:disabled { opacity: .5; cursor: not-allowed; }
.kf-chip svg { width: 15px; height: 15px; }
.kf-counter { margin-left: auto; font-size: 12px; color: #94a3b8; }

.kf-thumbs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.kf-thumb { position: relative; width: 56px; height: 56px; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
.kf-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.kf-thumb button {
  position: absolute; top: 2px; right: 2px; width: 18px; height: 18px;
  border-radius: 50%; border: none; background: rgba(15,23,42,.75); color: #fff;
  font-size: 12px; line-height: 1; cursor: pointer; padding: 0;
}

.kf-hint { margin-top: 14px; font-size: 12px; color: #94a3b8; }
.kf-hint kbd {
  background: #f1f5f9; border: 1px solid #e2e8f0; border-bottom-width: 2px;
  border-radius: 5px; padding: 1px 5px; font-size: 11px; color: #475569;
}

.kf-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 18px; border-top: 1px solid #eef0f4; background: #fbfcfe; }
.kf-btn { font-size: 14px; font-weight: 600; border-radius: 9px; padding: 9px 16px; cursor: pointer; border: 1px solid transparent; }
.kf-btn-ghost { background: transparent; color: #475569; }
.kf-btn-ghost:hover { background: #eef2f7; }
.kf-btn-primary { background: var(--kf-accent, #4f46e5); color: #fff; }
.kf-btn-primary:hover { filter: brightness(.95); }
.kf-btn:disabled { opacity: .6; cursor: not-allowed; }

.kf-msg { font-size: 13px; padding: 8px 18px 0; }
.kf-msg.kf-ok { color: #047857; }
.kf-msg.kf-err { color: #dc2626; }

.kf-capturing { position: fixed; inset: 0; pointer-events: none; }
`;
