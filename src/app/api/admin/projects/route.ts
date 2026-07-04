import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { createProject, projectSlugExists } from "@/lib/admin-repo";
import { DEFAULT_PROJECT_CATEGORIES } from "@/lib/repo";

const schema = z.object({
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/, "slug: a-z0-9-"),
  name: z.string().min(1).max(120),
  accentColor: z.string().max(20).optional(),
  position: z.enum(["bottom-right", "bottom-left"]).optional(),
  categories: z.array(z.string().min(1).max(60)).optional(),
});

export async function GET(req: Request) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug")?.trim() ?? "";
  const parsed = schema.shape.slug.safeParse(slug);
  if (!parsed.success) {
    return NextResponse.json({ ok: true, valid: false, available: false });
  }
  return NextResponse.json({
    ok: true,
    valid: true,
    available: !(await projectSlugExists(parsed.data)),
  });
}

export async function POST(req: Request) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", detail: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  try {
    const project = await createProject(user.id, {
      slug: d.slug,
      name: d.name,
      settings: {
        accentColor: d.accentColor || "#4f46e5",
        position: d.position || "bottom-right",
        categories: d.categories?.length ? d.categories : DEFAULT_PROJECT_CATEGORIES,
      },
    });
    return NextResponse.json({ ok: true, id: project.id, widget_key: project.widget_key });
  } catch {
    // Most likely a duplicate slug (UNIQUE constraint).
    return NextResponse.json({ error: "slug_taken" }, { status: 409 });
  }
}
