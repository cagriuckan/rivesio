"use client";

import { Icon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

/** Horizontal sub-tab navigation (in-page, not routed). */
export function SettingsTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="-mx-1 mb-6 flex items-center gap-1 overflow-x-auto overflow-y-hidden border-b border-line px-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          aria-current={value === tab.key ? "page" : undefined}
          className={cn(
            "relative shrink-0 px-3 pb-3 pt-1 text-sm font-semibold transition-colors outline-none",
            value === tab.key ? "text-strong" : "text-subtle hover:text-primary",
          )}
        >
          {tab.label}
          {value === tab.key && (
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent" />
          )}
        </button>
      ))}
    </div>
  );
}

/** Section header: title + description, optional right-aligned link. */
export function SettingsSectionHeader({
  title,
  description,
  link,
}: {
  title: string;
  description?: string;
  link?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 pb-5">
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-strong">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-subtle">{description}</p>}
      </div>
      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-subtle transition-colors hover:text-primary"
        >
          {link.label}
          <Icon.externalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

/**
 * A settings row: label + description (+ optional secondary link) on the left,
 * the control on the right. Stacks on small screens.
 */
export function SettingsRow({
  label,
  description,
  secondaryLink,
  children,
  align = "center",
  className,
}: {
  label: string;
  description?: string;
  secondaryLink?: { label: string; onClick: () => void };
  children: React.ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-8 gap-y-3 border-t border-line py-5 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]",
        align === "start" ? "lg:items-start" : "lg:items-center",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="text-sm font-semibold text-strong">{label}</div>
        {description && <p className="mt-0.5 text-sm text-subtle">{description}</p>}
        {secondaryLink && (
          <button
            type="button"
            onClick={secondaryLink.onClick}
            className="mt-2 text-sm font-semibold text-accent-text hover:underline"
          >
            {secondaryLink.label}
          </button>
        )}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Selectable card group with preview + checkmark badge, like the reference layout. */
export function OptionCards<T extends string>({
  options,
  value,
  onChange,
  columns = 3,
}: {
  options: {
    value: T;
    title: string;
    description?: string;
    preview?: React.ReactNode;
    disabled?: boolean;
  }[];
  value: T;
  onChange: (value: T) => void;
  columns?: 2 | 3;
}) {
  return (
    <div className={cn("grid gap-4", columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={opt.disabled}
            onClick={() => onChange(opt.value)}
            className={cn(
              "group text-left outline-none disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            {opt.preview !== undefined && (
              <div
                className={cn(
                  "relative overflow-hidden rounded-xl border-2 bg-raised transition-colors",
                  selected ? "border-accent" : "border-line group-hover:border-line-strong",
                )}
              >
                <div className="aspect-[16/10] w-full">{opt.preview}</div>
                <span
                  className={cn(
                    "absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full transition-all",
                    selected ? "bg-accent text-white" : "border border-line bg-surface",
                  )}
                >
                  {selected && <Icon.check className="h-3 w-3" />}
                </span>
              </div>
            )}
            <div className={cn("flex items-start gap-2", opt.preview !== undefined && "mt-2.5")}>
              {opt.preview === undefined && (
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-all",
                    selected ? "bg-accent text-white" : "border border-line-strong bg-surface",
                  )}
                >
                  {selected && <Icon.check className="h-2.5 w-2.5" />}
                </span>
              )}
              <div className="min-w-0">
                <div className="text-sm font-semibold text-strong">{opt.title}</div>
                {opt.description && <div className="mt-0.5 text-sm text-subtle">{opt.description}</div>}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/** Sticky footer with Cancel / Save. Only shown when there are unsaved changes. */
export function SettingsFooter({
  dirty,
  saving,
  saved,
  onCancel,
  onSave,
  cancelLabel,
  saveLabel,
  savingLabel,
  savedLabel,
}: {
  dirty: boolean;
  saving: boolean;
  saved: boolean;
  onCancel: () => void;
  onSave: () => void;
  cancelLabel: string;
  saveLabel: string;
  savingLabel: string;
  savedLabel: string;
}) {
  if (!dirty && !saved) return null;
  return (
    <div className="sticky bottom-0 z-10 mt-2 flex items-center justify-end gap-3 border-t border-line bg-surface/85 py-4 backdrop-blur">
      {saved && !dirty && (
        <span className="mr-auto flex items-center gap-1.5 text-sm font-medium text-success-text">
          <Icon.check className="h-4 w-4" />
          {savedLabel}
        </span>
      )}
      {dirty && (
        <>
          <Button variant="outline" onClick={onCancel} disabled={saving} className="rounded-lg">
            {cancelLabel}
          </Button>
          <Button variant="primary" onClick={onSave} disabled={saving} className="rounded-lg">
            {saving ? savingLabel : saveLabel}
          </Button>
        </>
      )}
    </div>
  );
}

/** A labelled toggle switch, reused across settings. */
export function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50",
        checked ? "bg-accent" : "bg-line-strong",
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-4" : "translate-x-0.5",
        )}
      />
    </button>
  );
}
