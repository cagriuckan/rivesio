import { NextResponse } from "next/server";
import { z } from "zod";
import { rotateWidgetKey, updateProject, deleteProject } from "@/lib/admin-repo";
import { getProjectById, parseSettings } from "@/lib/repo";

const widgetTextSchema = z.object({
  fabLabel: z.string().max(60),
  title: z.string().max(60),
  categoryLabel: z.string().max(60),
  messageLabel: z.string().max(60),
  messagePlaceholder: z.string().max(200),
  submitLabel: z.string().max(60),
  successMessage: z.string().max(200),
  errorMessage: z.string().max(200),
});

const formFieldSchema = z.object({
  id: z.string().min(1).max(64),
  type: z.enum(["text", "textarea", "select", "checkbox", "email"]),
  label: z.string().min(1).max(80),
  placeholder: z.string().max(120).optional(),
  required: z.boolean(),
  options: z.array(z.string().min(1).max(60)).max(30).optional(),
});

const schema = z.object({
  name: z.string().min(1).max(120).optional(),
  accentColor: z.string().max(20).optional(),
  position: z.enum(["bottom-right", "bottom-left"]).optional(),
  categories: z.array(z.string().min(1).max(60)).optional(),
  text: z.object({ tr: widgetTextSchema, en: widgetTextSchema }).optional(),
  fields: z.array(formFieldSchema).max(20).optional(),
  rotateKey: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const project = await getProjectById(id);
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const d = parsed.data;

  const current = parseSettings(project);
  await updateProject(id, {
    name: d.name,
    settings: {
      accentColor: d.accentColor ?? current.accentColor,
      position: d.position ?? current.position,
      categories: d.categories ?? current.categories,
      text: d.text ?? current.text,
      fields: d.fields ?? current.fields,
    },
  });

  let widget_key = project.widget_key;
  if (d.rotateKey) widget_key = await rotateWidgetKey(id);

  return NextResponse.json({ ok: true, widget_key });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!(await getProjectById(id))) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
