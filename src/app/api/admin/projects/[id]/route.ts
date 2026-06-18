import { NextResponse } from "next/server";
import { z } from "zod";
import { rotateWidgetKey, updateProject, deleteProject } from "@/lib/admin-repo";
import { getProjectById, parseSettings } from "@/lib/repo";

const schema = z.object({
  name: z.string().min(1).max(120).optional(),
  themeSlug: z.string().min(1).max(60).optional(),
  accentColor: z.string().max(20).optional(),
  position: z.enum(["bottom-right", "bottom-left"]).optional(),
  categories: z.array(z.string().min(1).max(60)).optional(),
  rotateKey: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const project = getProjectById(id);
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const d = parsed.data;

  const current = parseSettings(project);
  updateProject(id, {
    name: d.name,
    themeSlug: d.themeSlug,
    settings: {
      accentColor: d.accentColor ?? current.accentColor,
      position: d.position ?? current.position,
      categories: d.categories ?? current.categories,
    },
  });

  let widget_key = project.widget_key;
  if (d.rotateKey) widget_key = rotateWidgetKey(id);

  return NextResponse.json({ ok: true, widget_key });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!getProjectById(id)) return NextResponse.json({ error: "not_found" }, { status: 404 });
  deleteProject(id);
  return NextResponse.json({ ok: true });
}
