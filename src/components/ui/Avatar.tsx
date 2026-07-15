import { cn } from "./cn";

const COLORS = [
  { bg: "#0B1437", text: "#fff" },
  { bg: "#1f2f66", text: "#fff" },
  { bg: "#33478c", text: "#fff" },
  { bg: "#16224e", text: "#fff" },
  { bg: "#3d54a5", text: "#fff" },
  { bg: "#2a3f7e", text: "#fff" },
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
