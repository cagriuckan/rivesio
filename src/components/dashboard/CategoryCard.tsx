import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";
import { DonutChart, TONE_CYCLE, TONE_HEX } from "@/components/ui/DonutChart";

const MAX_SEGMENTS = 5;

export default async function CategoryCard({
  categories,
}: {
  categories: { category: string; count: number }[];
}) {
  const t = await getTranslations("dashboard");
  const sorted = [...categories].sort((a, b) => b.count - a.count);
  const top = sorted.slice(0, MAX_SEGMENTS);
  const rest = sorted.slice(MAX_SEGMENTS);
  const restCount = rest.reduce((s, c) => s + c.count, 0);
  const legend = restCount > 0 ? [...top, { category: t("otherCategory"), count: restCount }] : top;
  const total = legend.reduce((s, c) => s + c.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={Icon.layers}>{t("categories")}</CardTitle>
      </CardHeader>
      <CardBody>
        {categories.length === 0 ? (
          <p className="py-6 text-center text-sm text-subtle">{t("noData")}</p>
        ) : (
          <div className="flex items-center gap-6">
            <DonutChart
              size={112}
              thickness={15}
              segments={legend.map((c, i) => ({
                value: c.count,
                color: rest.length && i === legend.length - 1 ? TONE_HEX.neutral : TONE_HEX[TONE_CYCLE[i % TONE_CYCLE.length]],
              }))}
              centerValue={total}
              centerLabel={t("totalCount")}
            />
            <ul className="min-w-0 flex-1 space-y-2.5">
              {legend.map((c, i) => {
                const pct = total ? Math.round((c.count / total) * 100) : 0;
                const isOther = rest.length > 0 && i === legend.length - 1;
                const color = isOther ? TONE_HEX.neutral : TONE_HEX[TONE_CYCLE[i % TONE_CYCLE.length]];
                return (
                  <li key={c.category} className="flex items-center gap-2.5">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                    <span className="min-w-0 flex-1 truncate text-sm text-secondary">{c.category}</span>
                    <span className="text-sm font-semibold text-primary tnum">{c.count}</span>
                    <span className="w-9 text-right text-xs text-faint tnum">{pct}%</span>
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
