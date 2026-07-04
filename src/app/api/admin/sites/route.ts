import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { createManualSite, getOwnedProject } from "@/lib/admin-repo";
import { findSite, normalizeDomain } from "@/lib/repo";

const schema = z.object({
  projectId: z.string().min(1).max(64),
  domain: z.string().min(1).max(255),
  status: z.enum(["pending", "approved", "blocked"]).optional(),
});

export async function POST(req: Request) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const { projectId, status } = parsed.data;
  const domain = normalizeDomain(parsed.data.domain);
  if (!domain) return NextResponse.json({ error: "invalid_domain" }, { status: 400 });

  const project = await getOwnedProject(user.id, projectId);
  if (!project) return NextResponse.json({ error: "project_not_found" }, { status: 404 });

  if (await findSite(projectId, domain)) {
    return NextResponse.json({ error: "site_exists" }, { status: 409 });
  }

  const site = await createManualSite({
    projectId,
    domain,
    // Manually added sites default to approved (admin intent), unless told otherwise.
    status: status ?? "approved",
  });
  return NextResponse.json({ ok: true, id: site.id });
}
