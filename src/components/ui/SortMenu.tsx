"use client";

import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { Dropdown } from "@/components/ui/Dropdown";

export interface SortOption<K extends string> {
  key: K;
  label: string;
}

/**
 * Sort control rendered as an action menu (shared Dropdown). The trigger shows
 * the active option; the panel lists every option with a check on the current
 * one. Selection is single-choice, so items use the `menuitemradio` role.
 */
export function SortMenu<K extends string>({
  options,
  value,
  onChange,
  label,
  align = "right",
  className,
}: {
  options: ReadonlyArray<SortOption<K>>;
  value: K;
  onChange: (key: K) => void;
  /** Accessible label for the trigger, e.g. "Sort by". */
  label: string;
  align?: "left" | "right";
  className?: string;
}) {
  const active = options.find((o) => o.key === value) ?? options[0];

  return (
    <Dropdown
      role="menu"
      align={align}
      panelClassName="w-56"
      className={cn("shrink-0", className)}
      trigger={({ open, triggerProps }) => (
        <button
          {...triggerProps}
          aria-label={label}
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg border border-line bg-transparent px-3 text-left text-xs font-semibold text-secondary transition-colors outline-none",
            "hover:border-line-strong hover:bg-raised/60 hover:text-primary focus-visible:ring-2 focus-visible:ring-accent",
            open && "border-accent-line text-accent-text",
          )}
        >
          <Icon.sort className="h-4 w-4 shrink-0 text-subtle" />
        </button>
      )}
    >
      {(close) => (
        <>
          {options.map((option) => {
            const selected = option.key === value;
            return (
              <button
                key={option.key}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  onChange(option.key);
                  close();
                }}
                className={cn(
                  "flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs transition-colors outline-none",
                  selected
                    ? "bg-accent-soft font-semibold text-accent-text"
                    : "text-secondary hover:bg-raised hover:text-primary",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {selected && <Icon.check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            );
          })}
        </>
      )}
    </Dropdown>
  );
}
