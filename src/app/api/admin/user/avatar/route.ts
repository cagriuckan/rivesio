import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { user } from "@/db/schema";
import { requireAdminSession } from "@/lib/auth";
import { saveAvatar, deleteAvatarDir } from "@/lib/storage";
import { logoLimits, env } from "@/lib/env";
import { generateId } from "@/lib/ids";

export const runtime = "nodejs";

/** Public URL the app points at, cache-busted so replacements refresh. */
function avatarUrl(userId: string): string {
  return `${env.publicBaseUrl}/api/avatars/${userId}?v=${Date.now()}`;
}

export async function POST(req: Request) {
  const session = await requireAdminSession();
  if (session instanceof NextResponse) return session;

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
  // Drop any previous avatar so a user never accumulates orphaned objects.
  await deleteAvatarDir(session.id).catch(() => {});
  const path = await saveAvatar(session.id, generateId(), file.type, buf);

  const url = avatarUrl(session.id);
  await db.update(user).set({ image: url, imagePath: path }).where(eq(user.id, session.id));

  return NextResponse.json({ ok: true, imageUrl: url });
}

export async function DELETE() {
  const session = await requireAdminSession();
  if (session instanceof NextResponse) return session;

  await deleteAvatarDir(session.id).catch(() => {});
  await db.update(user).set({ image: null, imagePath: null }).where(eq(user.id, session.id));

  return NextResponse.json({ ok: true });
}
