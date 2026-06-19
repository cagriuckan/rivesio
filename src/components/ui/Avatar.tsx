import { cn } from "./cn";

/** Deterministic gradient from a string seed. */
const GRADIENTS = [
  "from-[#6e79d6] to-[#a78bfa]",
  "from-[#3ecf8e] to-[#4aa8ff]",
  "from-[#f5a623] to-[#f5535b]",
  "from-[#4aa8ff] to-[#6e79d6]",
  "from-[#a78bfa] to-[#f5535b]",
  "from-[#3ecf8e] to-[#6e79d6]",
];

function seedIndex(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % GRADIENTS.length;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZES = {
  xs: "h-5 w-5 text-[9px]",
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "bg-gradient-to-br font-semibold text-white",
        GRADIENTS[seedIndex(name)],
        SIZES[size],
        className
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
