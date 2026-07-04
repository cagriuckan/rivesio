import { cn } from "./cn";

const COLORS = [
  { bg: "#6e79d6", text: "#fff" },
  { bg: "#3ecf8e", text: "#fff" },
  { bg: "#f5a623", text: "#fff" },
  { bg: "#4aa8ff", text: "#fff" },
  { bg: "#a78bfa", text: "#fff" },
  { bg: "#f5535b", text: "#fff" },
];

function seedIndex(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % COLORS.length;
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
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-sm",
};

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  /** Uploaded avatar URL, if any — rendered instead of the initials fallback. */
  src?: string | null;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className={cn("inline-flex shrink-0 rounded-full object-cover", SIZES[size], className)}
      />
    );
  }
  const c = COLORS[seedIndex(name)];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold",
        SIZES[size],
        className
      )}
      style={{ backgroundColor: c.bg, color: c.text }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}
