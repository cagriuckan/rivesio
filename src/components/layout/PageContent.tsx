import { cn } from "@/components/ui/cn";

export default function PageContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("content-radius-tight mx-auto w-full max-w-6xl px-5 py-5", className)}>
      {children}
    </div>
  );
}
