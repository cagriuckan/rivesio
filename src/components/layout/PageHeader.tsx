export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between border-b border-line px-4 py-3">
      <div>
        <h1 className="text-base font-semibold tracking-tight text-strong">{title}</h1>
        {subtitle && <p className="text-xs text-subtle">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
