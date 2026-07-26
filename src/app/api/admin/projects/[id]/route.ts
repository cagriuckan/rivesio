import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { getOwnedProject, rotateWidgetKey, updateProject, deleteProject } from "@/lib/admin-repo";
import { parseSettings } from "@/lib/repo";
import { deleteLogoDir } from "@/lib/storage";

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

const nullableCount = z.number().int().min(0).max(1_000_000).nullable();

const schema = z.object({
  name: z.string().min(1).max(120).optional(),
  accentColor: z.string().max(20).optional(),
  position: z.enum(["bottom-right", "bottom-left"]).optional(),
  fabStyle: z.enum(["label", "icon"]).optional(),
  theme: z.enum(["auto", "dark", "light"]).optional(),
  categories: z
    .array(
      z.object({
        value: z.string().min(1).max(60),
        labels: z.object({
          tr: z.string().min(1).max(60),
          en: z.string().min(1).max(60),
        }),
      }),
    )
    .max(30)
    .optional(),
  text: z.object({ tr: widgetTextSchema, en: widgetTextSchema }).optional(),
  fields: z.array(formFieldSchema).max(20).optional(),
  rotateKey: z.boolean().optional(),
  // Operational, widget-global defaults.
  siteLimit: nullableCount.optional(),
  autoApproveSites: z.boolean().optional(),
  allowConversation: z.boolean().optional(),
  defaultDailyLimitSite: nullableCount.optional(),
  defaultDailyLimitVisitor: nullableCount.optional(),
  defaultSupportDays: nullableCount.optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  const project = await getOwnedProject(user.id, id);
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const d = parsed.data;

  const current = parseSettings(project);
  await updateProject(user.id, id, {
    name: d.name,
    settings: {
      accentColor: d.accentColor ?? current.accentColor,
      // Logo is managed by the dedicated upload endpoint; preserve it here.
      logoUrl: current.logoUrl,
      logoPath: current.logoPath,
      position: d.position ?? current.position,
      fabStyle: d.fabStyle ?? current.fabStyle ?? "label",
      theme: d.theme ?? current.theme ?? "auto",
      categories: d.categories ?? current.categories,
      text: d.text ?? current.text,
      fields: d.fields ?? current.fields,
    },
    siteLimit: d.siteLimit,
    autoApproveSites: d.autoApproveSites,
    allowConversation: d.allowConversation,
    defaultDailyLimitSite: d.defaultDailyLimitSite,
    defaultDailyLimitVisitor: d.defaultDailyLimitVisitor,
    defaultSupportDays: d.defaultSupportDays,
  });

  let widget_key = project.widget_key;
  if (d.rotateKey) widget_key = await rotateWidgetKey(user.id, id);

  return NextResponse.json({ ok: true, widget_key });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  if (!(await getOwnedProject(user.id, id))) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await deleteProject(user.id, id);
  await deleteLogoDir(id).catch(() => {});
  return NextResponse.json({ ok: true });
}
