import { forwardRef } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "icon";

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap " +
  "rounded-md transition-all duration-150 outline-none cursor-pointer " +
  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-canvas active:scale-[.98] " +
  "disabled:pointer-events-none disabled:opacity-45 select-none";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover shadow-xs",
  secondary:
    "bg-raised text-primary border border-line hover:bg-overlay hover:border-line-strong",
  ghost:
    "bg-transparent text-secondary hover:bg-raised hover:text-primary",
  danger:
    "bg-danger-soft text-danger-text hover:brightness-110",
  outline:
    "bg-transparent text-secondary border border-line hover:bg-raised hover:text-primary hover:border-line-strong",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  icon: "h-8 w-8 p-0 text-sm",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "secondary", size = "md", className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
