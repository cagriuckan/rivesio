"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/components/ui/cn";

export interface DropdownProps {
  /** Renders the trigger element. Must spread `triggerProps` onto the interactive element. */
  trigger: (state: {
    open: boolean;
    triggerProps: {
      ref: React.RefObject<HTMLButtonElement | null>;
      onClick: () => void;
      "aria-haspopup": "menu" | "listbox";
      "aria-expanded": boolean;
    };
  }) => React.ReactNode;
  /** Renders the panel content. Receives `close` to dismiss the dropdown from inside an item. */
  children: (close: () => void) => React.ReactNode;
  /** Horizontal alignment of the panel relative to the trigger. */
  align?: "left" | "right";
  /** Which side of the trigger the panel opens toward. */
  side?: "bottom" | "top";
  /** ARIA role for the panel: "menu" for actions, "listbox" for selection. */
  role?: "menu" | "listbox";
  /** Extra classes for the panel (width, etc). */
  panelClassName?: string;
  /** Render the panel through a portal anchored to the trigger's screen position — needed when the trigger sits inside a clipped/overflow container (e.g. collapsed sidebar rail). */
  portal?: boolean;
  className?: string;
}

const PANEL_BASE = "ds-fade-in rounded-2xl border border-line bg-surface p-1 shadow-lg";

/**
 * Shared dropdown chrome: open state, outside-click/escape dismissal, and
 * positioning (inline or portal). Mirrors the sidebar user menu's behavior
 * so every dropdown in the app opens, closes, and looks the same way.
 */
export function Dropdown({
  trigger,
  children,
  align = "left",
  side = "bottom",
  role = "menu",
  panelClassName,
  portal = false,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number; width: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => setMounted(true), []);

  function close() {
    setOpen(false);
  }

  function toggle() {
    if (portal && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos(
        side === "top"
          ? { bottom: window.innerHeight - rect.top + 8, left: rect.left, width: rect.width }
          : { top: rect.bottom + 8, left: rect.left, width: rect.width },
      );
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      const insideTrigger = wrapRef.current?.contains(target);
      const insidePanel = (target as Element)?.closest?.(`[data-dropdown-panel="${panelId}"]`);
      if (!insideTrigger && !insidePanel) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, panelId]);

  const panel = open ? (
    <div
      data-dropdown-panel={panelId}
      role={role}
      className={cn(
        PANEL_BASE,
        !portal && "absolute z-50 w-56",
        !portal && (side === "top" ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"),
        !portal && (align === "right" ? "right-0" : "left-0"),
        portal && "fixed z-[9999]",
        panelClassName,
      )}
      style={portal && pos ? { top: pos.top, bottom: pos.bottom, left: pos.left, minWidth: pos.width } : undefined}
    >
      {children(close)}
    </div>
  ) : null;

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      {trigger({
        open,
        triggerProps: {
          ref: triggerRef,
          onClick: toggle,
          "aria-haspopup": role,
          "aria-expanded": open,
        },
      })}
      {portal ? mounted && panel && createPortal(panel, document.body) : panel}
    </div>
  );
}

export function DropdownItem({
  icon: ItemIcon,
  danger,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-sm font-medium transition-colors",
        danger
          ? "text-danger-text hover:bg-danger-soft"
          : "text-muted hover:bg-raised hover:text-primary",
        className,
      )}
      {...props}
    >
      {ItemIcon && <ItemIcon className="h-4 w-4 shrink-0 text-subtle" />}
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1.5 h-px bg-line" />;
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-faint">
      {children}
    </div>
  );
}
