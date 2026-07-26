import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";
import { DonutChart, TONE_CYCLE, TONE_HEX } from "@/components/ui/DonutChart";
import { cn } from "@/components/ui/cn";

const MAX_SEGMENTS = 5;

export default async function CategoryCard({
  categories,
  baseHref,
}: {
  categories: { category: string; count: number }[];
  baseHref: string;
}) {
  const t = await getTranslations("dashboard");
  const tc = await getTranslations("common");
  const sorted = [...categories].sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, MAX_SEGMENTS);
  const rest = sorted.slice(MAX_SEGMENTS);
  const restCount = rest.reduce((s, c) => s + c.count, 0);
  const legend = restCount > 0 ? [...top, { category: t("otherCategory"), count: restCount }] : top;
  const total = legend.reduce((s, c) => s + c.count, 0);
  const join = baseHref.includes("?") ? "&" : "?";

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex min-w-0 items-center gap-2">
          <CardTitle icon={Icon.layers}>{t("categories")}</CardTitle>
          {total > 0 && (
            <span className="rounded-md bg-raised px-1.5 py-0.5 text-[11px] font-semibold text-subtle tnum">
              {total}
            </span>
          )}
        </div>
        <Link
          href={baseHref}
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent-text hover:underline"
        >
          {tc("all")} <Icon.chevronRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardBody>
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-raised">
              <Icon.layers className="h-5 w-5 text-subtle" />
            </div>
            <p className="text-sm font-medium text-secondary">{t("categoriesEmpty")}</p>
            <p className="mt-1 max-w-[240px] text-xs text-faint">{t("categoriesEmptyHint")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <DonutChart
              size={120}
              thickness={16}
              segments={legend.map((c, i) => ({
                value: c.count,
                color:
                  rest.length && i === legend.length - 1
                    ? TONE_HEX.neutral
                    : TONE_HEX[TONE_CYCLE[i % TONE_CYCLE.length]],
              }))}
              centerValue={total}
              centerLabel={t("totalCount")}
            />
            <ul className="min-w-0 flex-1 space-y-3">
              {legend.map((c, i) => {
                const pct = total ? Math.round((c.count / total) * 100) : 0;
                const isOther = rest.length > 0 && i === legend.length - 1;
                const color = isOther
                  ? TONE_HEX.neutral
                  : TONE_HEX[TONE_CYCLE[i % TONE_CYCLE.length]];
                const row = (
                  <>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-secondary group-hover:text-primary">
                        {c.category}
                      </span>
                      <span className="text-sm font-semibold text-primary tnum">{c.count}</span>
                      <span className="w-9 text-right text-xs text-faint tnum">{pct}%</span>
                    </div>
                    <div className="mt-1.5 ml-5 h-1.5 overflow-hidden rounded-full bg-inset">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </>
                );

                if (isOther) {
                  return (
                    <li key={c.category} className="opacity-80">
                      {row}
                    </li>
                  );
                }

                return (
                  <li key={c.category}>
                    <Link
                      href={`${baseHref}${join}category=${encodeURIComponent(c.category)}`}
                      className={cn(
                        "group block rounded-lg -mx-1.5 px-1.5 py-0.5",
                        "transition-colors hover:bg-raised",
                      )}
                    >
                      {row}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
