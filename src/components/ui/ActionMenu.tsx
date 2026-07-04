"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icons";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/Dropdown";

/** Reports `open` to `onOpenChange` whenever it changes, without violating the rules of hooks. */
function OpenChangeReporter({ open, onOpenChange }: { open: boolean; onOpenChange?: (open: boolean) => void }) {
  const lastReported = useRef<boolean | null>(null);
  useEffect(() => {
    if (lastReported.current === open) return;
    lastReported.current = open;
    onOpenChange?.(open);
  }, [open, onOpenChange]);
  return null;
}

export interface ActionMenuItem {
  key: string;
  label: string;
  icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  onSelect: () => void;
  danger?: boolean;
}

export type ActionMenuGroup = ActionMenuItem[];

export function ActionMenu({
  groups,
  label,
  disabled,
  align = "right",
  onOpenChange,
}: {
  groups: ActionMenuGroup[];
  label: string;
  disabled?: boolean;
  align?: "left" | "right";
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dropdown
      role="menu"
      align={align}
      side="bottom"
      panelClassName="w-52"
      portal
      trigger={({ open, triggerProps }) => (
        <>
          <OpenChangeReporter open={open} onOpenChange={onOpenChange} />
          <button
            type="button"
            ref={triggerProps.ref}
            id={triggerProps.id}
            onClick={(e) => {
              e.stopPropagation();
              triggerProps.onClick();
            }}
            disabled={disabled}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-45"
            aria-label={label}
            aria-haspopup={triggerProps["aria-haspopup"]}
            aria-expanded={triggerProps["aria-expanded"]}
            aria-controls={triggerProps["aria-controls"]}
          >
            <Icon.dots className="h-4 w-4" />
          </button>
        </>
      )}
    >
      {(close) => (
        <div onClick={(e) => e.stopPropagation()}>
          {groups.map((group, gi) => (
            <div key={gi}>
              {gi > 0 && <DropdownSeparator />}
              {group.map((item) => (
                <DropdownItem
                  key={item.key}
                  icon={item.icon}
                  danger={item.danger}
                  onClick={() => {
                    close();
                    item.onSelect();
                  }}
                  className="text-xs"
                >
                  {item.label}
                </DropdownItem>
              ))}
            </div>
          ))}
        </div>
      )}
    </Dropdown>
  );
}
