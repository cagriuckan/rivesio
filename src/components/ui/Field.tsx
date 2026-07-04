import { forwardRef } from "react";
import { cn } from "./cn";
import { Icon } from "./Icons";

const FIELD_BASE =
  "w-full rounded-lg border border-line bg-surface text-primary shadow-xs " +
  "placeholder:text-faint outline-none transition-[border-color,box-shadow,background-color] duration-150 " +
  "hover:border-line-strong focus:border-accent focus:ring-4 focus:ring-accent-soft " +
  "disabled:cursor-not-allowed disabled:bg-raised disabled:text-subtle disabled:opacity-70";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-left text-xs font-medium text-secondary", className)}
      {...props}
    />
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(FIELD_BASE, "h-9 px-3 text-sm", className)} {...props} />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(FIELD_BASE, "min-h-24 resize-y px-3 py-2.5 text-sm leading-relaxed", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(FIELD_BASE, "h-10 cursor-pointer appearance-none pl-3 pr-9 text-sm", className)}
        {...props}
      >
        {children}
      </select>
      <Icon.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
    </div>
  )
);
Select.displayName = "Select";

export const Checkbox = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 shrink-0 cursor-pointer rounded border border-line bg-surface text-accent accent-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";

export function FieldHint({
  className,
  tone = "neutral",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & { tone?: "neutral" | "success" | "danger" }) {
  return (
    <p
      className={cn(
        "mt-1.5 text-left text-[11px] leading-4",
        tone === "success" && "text-success-text",
        tone === "danger" && "text-danger-text",
        tone === "neutral" && "text-subtle",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
  className,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  hint?: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
      {hint && <FieldHint>{hint}</FieldHint>}
    </div>
  );
}
