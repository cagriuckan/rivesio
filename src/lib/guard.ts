import { env } from "./env";
import { getProjectByWidgetKey, findSite, normalizeDomain, upsertSite } from "./repo";
import type { ProjectRow, SiteRow } from "./types";

export type GuardError =
  | "invalid_widget"
  | "theme_mismatch"
  | "missing_license"
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
  licenseKey?: string | null;
  theme?: string | null;
  meta?: Record<string, unknown>;
}

/**
 * Register/refresh a site on widget load. Resolves the project from the widget key,
 * enforces the theme match, and upserts the site row (status decided by AUTO_APPROVE).
 */
export function guardRegister(input: Input): GuardFail | GuardOk {
  const project = getProjectByWidgetKey(input.widgetKey);
  if (!project) return { ok: false, error: "invalid_widget" };

  if (input.theme && input.theme !== project.theme_slug) {
    return { ok: false, error: "theme_mismatch" };
  }

  const license = (input.licenseKey ?? "").trim();
  if (!license) return { ok: false, error: "missing_license" };

  const domain = normalizeDomain(input.domain);
  const site = upsertSite({
    projectId: project.id,
    domain,
    licenseKey: license,
    meta: input.meta ?? {},
    defaultStatus: env.autoApproveSites ? "approved" : "pending",
  });

  if (site.status === "blocked") return { ok: false, error: "blocked" };
  if (site.status === "pending") return { ok: false, error: "pending" };
  return { ok: true, project, site };
}

/**
 * Authorize a feedback submission. The site must already exist (registered) and be
 * approved; license + theme must match. Does not create new sites.
 */
export function guardSubmission(input: Input): GuardFail | GuardOk {
  const project = getProjectByWidgetKey(input.widgetKey);
  if (!project) return { ok: false, error: "invalid_widget" };

  if (input.theme && input.theme !== project.theme_slug) {
    return { ok: false, error: "theme_mismatch" };
  }

  const license = (input.licenseKey ?? "").trim();
  if (!license) return { ok: false, error: "missing_license" };

  const domain = normalizeDomain(input.domain);
  const site = findSite(project.id, domain);
  if (!site) return { ok: false, error: "not_registered" };
  if (site.status === "blocked") return { ok: false, error: "blocked" };
  if (site.status === "pending") return { ok: false, error: "pending" };

  // Refresh last_seen + license/meta on each submission.
  const refreshed = upsertSite({
    projectId: project.id,
    domain,
    licenseKey: license,
    meta: input.meta ?? {},
    defaultStatus: "approved",
  });

  return { ok: true, project, site: refreshed };
}
