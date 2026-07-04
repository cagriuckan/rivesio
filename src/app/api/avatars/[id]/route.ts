import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { user } from "@/db/schema";
import { readAttachment, extToMime } from "@/lib/storage";

export const runtime = "nodejs";

// A user's avatar is public by design — it renders in notifications and the
// sidebar, and (like project logos) carries no sensitive data.
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const [row] = await db.select({ imagePath: user.imagePath }).from(user).where(eq(user.id, id)).limit(1);
  if (!row?.imagePath) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const buf = await readAttachment(row.imagePath);
  if (!buf) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return new NextResponse(new Uint8Array(buf), {
    headers: {
      "Content-Type": extToMime(row.imagePath),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
