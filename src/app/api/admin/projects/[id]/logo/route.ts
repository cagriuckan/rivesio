import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { getOwnedProject, updateProject } from "@/lib/admin-repo";
import { parseSettings } from "@/lib/repo";
import { saveLogo, deleteLogoDir } from "@/lib/storage";
import { logoLimits, env } from "@/lib/env";
import { generateId } from "@/lib/ids";

export const runtime = "nodejs";

/** Public URL the widget's emails point at, cache-busted so replacements refresh. */
function logoUrl(projectId: string): string {
  return `${env.publicBaseUrl}/api/logos/${projectId}?v=${Date.now()}`;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  const project = await getOwnedProject(user.id, id);
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (!logoLimits.allowedMimeTypes.includes(file.type)) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
  }
  if (file.size > logoLimits.maxBytes) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  // Drop any previous logo so a project never accumulates orphaned objects.
  await deleteLogoDir(id).catch(() => {});
  const path = await saveLogo(id, generateId(), file.type, buf);

  const current = parseSettings(project);
  const url = logoUrl(id);
  await updateProject(user.id, id, {
    settings: { ...current, logoPath: path, logoUrl: url },
  });

  return NextResponse.json({ ok: true, logoUrl: url });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  const project = await getOwnedProject(user.id, id);
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await deleteLogoDir(id).catch(() => {});
  const current = parseSettings(project);
  await updateProject(user.id, id, {
    settings: { ...current, logoPath: undefined, logoUrl: undefined },
  });

  return NextResponse.json({ ok: true });
}
