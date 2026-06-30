import { forwardRef } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline" | "gradient";
type Size = "sm" | "md" | "lg" | "icon";

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap " +
  "rounded-full transition-all duration-150 outline-none cursor-pointer " +
  "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-canvas active:scale-[.97] " +
  "disabled:pointer-events-none disabled:opacity-45 select-none";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover shadow-sm",
  gradient:
    "bg-grad-accent text-white shadow-accent hover:brightness-[1.06]",
  secondary:
    "bg-raised text-primary ring-1 ring-line hover:bg-line",
  ghost:
    "bg-transparent text-secondary hover:bg-raised hover:text-primary",
  danger:
    "bg-danger-soft text-danger-text hover:brightness-105",
  outline:
    "bg-surface text-secondary ring-1 ring-line-strong hover:bg-raised hover:text-primary shadow-xs",
};

const SIZES: Record<Size, string> = {
  sm: "h-7 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-4 text-sm",
  icon: "h-9 w-9 p-0 text-sm",
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
