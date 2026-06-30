import { getTranslations } from "next-intl/server";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";

export default async function CategoryCard({
  categories,
}: {
  categories: { category: string; count: number }[];
}) {
  const t = await getTranslations("dashboard");
  const max = Math.max(1, ...categories.map((c) => c.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={Icon.layers}>{t("categories")}</CardTitle>
      </CardHeader>
      <CardBody>
        {categories.length === 0 ? (
          <p className="py-6 text-center text-sm text-subtle">{t("noData")}</p>
        ) : (
          <ul className="space-y-3">
            {categories.map((c) => (
              <li key={c.category}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm text-secondary">{c.category}</span>
                  <span className="text-sm font-semibold text-primary tnum">{c.count}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-inset">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-violet"
                    style={{ width: `${(c.count / max) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
