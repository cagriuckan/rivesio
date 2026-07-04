"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createPopper, type Instance, type Placement } from "@popperjs/core";
import { cn } from "@/components/ui/cn";

export interface DropdownProps {
  /** Renders the trigger element. Must spread `triggerProps` onto the interactive element. */
  trigger: (state: {
    open: boolean;
    triggerProps: {
      ref: React.RefObject<HTMLButtonElement | null>;
      id: string;
      onClick: () => void;
      "aria-haspopup": "menu" | "listbox";
      "aria-expanded": boolean;
      "aria-controls": string;
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
  /** Render the panel through a portal anchored to the trigger's screen position — useful when the trigger sits inside a clipped/overflow container. */
  portal?: boolean;
  className?: string;
}

const PANEL_BASE = "ds-fade-in rounded-lg border border-line bg-surface p-1 shadow-md";

/**
 * Shared dropdown chrome: open state, outside-click/escape dismissal, and
 * Popper positioning anchored to each dropdown's own trigger button.
 */
export function Dropdown({
  trigger,
  children,
  align = "left",
  side = "bottom",
  role = "menu",
  panelClassName,
  portal = true,
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [panelEl, setPanelEl] = useState<HTMLDivElement | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popperRef = useRef<Instance | null>(null);
  const dropdownId = useId().replace(/:/g, "");
  const triggerId = `dropdown-trigger-${dropdownId}`;
  const panelId = `dropdown-panel-${dropdownId}`;
  const placement: Placement = `bottom-${align === "right" ? "end" : "start"}`;

  useEffect(() => setMounted(true), []);

  function close() {
    setOpen(false);
  }

  function toggle() {
    setOpen((v) => !v);
  }

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !panelEl) return;

    popperRef.current?.destroy();
    popperRef.current = createPopper(triggerRef.current, panelEl, {
      placement,
      strategy: "fixed",
      modifiers: [
        { name: "offset", options: { offset: [0, 8] } },
        { name: "flip", enabled: false },
        { name: "preventOverflow", options: { padding: 8, mainAxis: false, altAxis: true } },
        { name: "computeStyles", options: { gpuAcceleration: false } },
      ],
    });

    return () => {
      popperRef.current?.destroy();
      popperRef.current = null;
    };
  }, [open, panelEl, placement, portal]);

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
      ref={setPanelEl}
      id={panelId}
      data-dropdown-panel={panelId}
      role={role}
      aria-labelledby={triggerId}
      className={cn(
        PANEL_BASE,
        portal ? "fixed z-[9999]" : "fixed z-50 w-56",
        panelClassName,
      )}
      style={portal && triggerRef.current ? { minWidth: triggerRef.current.offsetWidth } : undefined}
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
          id: triggerId,
          onClick: toggle,
          "aria-haspopup": role,
          "aria-expanded": open,
          "aria-controls": panelId,
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
        "flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-sm transition-colors",
        danger
          ? "text-danger-text hover:bg-danger-soft"
          : "text-muted hover:bg-raised hover:text-primary",
        className,
      )}
      {...props}
    >
      {ItemIcon && <ItemIcon className="h-3.5 w-3.5 shrink-0 text-subtle" />}
      {children}
    </button>
  );
}

export function DropdownSeparator() {
  return <div className="my-1 h-px bg-line" />;
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 pb-0.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-faint">
      {children}
    </div>
  );
}
