import { NextResponse } from "next/server";
import { getProjectById, parseSettings } from "@/lib/repo";
import { readAttachment, extToMime } from "@/lib/storage";

export const runtime = "nodejs";

// A project's logo is public by design — it renders in the widget's emails,
// which are read outside any authenticated session.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const project = await getProjectById(id);
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { logoPath } = parseSettings(project);
  if (!logoPath) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const buf = await readAttachment(logoPath);
  if (!buf) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": extToMime(logoPath),
      // Cache-busted by the ?v= query param, so this can live long.
      "Cache-Control": "public, max-age=86400",
    },
  });
}
