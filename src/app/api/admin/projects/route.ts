import { NextResponse } from "next/server";
import { z } from "zod";
import { createProject } from "@/lib/admin-repo";
import { DEFAULT_PROJECT_CATEGORIES } from "@/lib/db";

const schema = z.object({
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/, "slug: a-z0-9-"),
  name: z.string().min(1).max(120),
  themeSlug: z.string().min(1).max(60),
  accentColor: z.string().max(20).optional(),
  position: z.enum(["bottom-right", "bottom-left"]).optional(),
  categories: z.array(z.string().min(1).max(60)).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", detail: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  try {
    const project = createProject({
      slug: d.slug,
      name: d.name,
      themeSlug: d.themeSlug,
      settings: {
        accentColor: d.accentColor || "#4f46e5",
        position: d.position || "bottom-right",
        categories: d.categories?.length ? d.categories : DEFAULT_PROJECT_CATEGORIES,
      },
    });
    return NextResponse.json({ ok: true, id: project.id, widget_key: project.widget_key });
  } catch (e) {
    // Most likely a duplicate slug (UNIQUE constraint).
    return NextResponse.json({ error: "slug_taken" }, { status: 409 });
  }
}
