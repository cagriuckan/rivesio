import { forwardRef } from "react";
import { cn } from "./cn";

const FIELD_BASE =
  "w-full bg-inset text-primary placeholder:text-faint " +
  "border border-line rounded-md transition-all duration-150 outline-none " +
  "hover:border-line-strong focus:border-accent " +
  "focus:ring-[3px] focus:ring-accent-soft";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-2xs font-semibold uppercase tracking-wider text-subtle", className)}
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
    <textarea ref={ref} className={cn(FIELD_BASE, "px-3 py-2.5 text-sm leading-relaxed resize-none", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(FIELD_BASE, "h-9 pl-3 pr-9 text-sm appearance-none cursor-pointer", className)}
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  )
);
Select.displayName = "Select";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
