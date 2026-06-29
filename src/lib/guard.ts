import { env } from "./env";
import { getProjectByWidgetKey, findSite, normalizeDomain, upsertSite } from "./repo";
import type { ProjectRow, SiteRow } from "./types";

export type GuardError =
  | "invalid_widget"
  | "not_registered"
  | "pending"
  | "blocked";

export interface GuardOk {
  ok: true;
  project: ProjectRow;
  site: SiteRow;
}
export interface GuardFail {
  ok: false;
  error: GuardError;
}

interface Input {
  widgetKey: string;
  domain: string;
  meta?: Record<string, unknown>;
}

/**
 * Register/refresh a site on widget load. Resolves the project from the widget key,
 * and upserts the site row (status decided by AUTO_APPROVE).
 */
export async function guardRegister(input: Input): Promise<GuardFail | GuardOk> {
  const project = await getProjectByWidgetKey(input.widgetKey);
  if (!project) return { ok: false, error: "invalid_widget" };

  const domain = normalizeDomain(input.domain);
  const site = await upsertSite({
    projectId: project.id,
    domain,
    meta: input.meta ?? {},
    defaultStatus: env.autoApproveSites ? "approved" : "pending",
  });

  if (site.status === "blocked") return { ok: false, error: "blocked" };
  if (site.status === "pending") return { ok: false, error: "pending" };
  return { ok: true, project, site };
}

/**
 * Authorize a feedback submission. The site must already exist (registered) and be
 * approved. Does not create new sites.
 */
export async function guardSubmission(input: Input): Promise<GuardFail | GuardOk> {
  const project = await getProjectByWidgetKey(input.widgetKey);
  if (!project) return { ok: false, error: "invalid_widget" };

  const domain = normalizeDomain(input.domain);
  const site = await findSite(project.id, domain);
  if (!site) return { ok: false, error: "not_registered" };
  if (site.status === "blocked") return { ok: false, error: "blocked" };
  if (site.status === "pending") return { ok: false, error: "pending" };

  // Refresh last_seen + meta on each submission.
  const refreshed = await upsertSite({
    projectId: project.id,
    domain,
    meta: input.meta ?? {},
    defaultStatus: "approved",
  });

  return { ok: true, project, site: refreshed };
}
