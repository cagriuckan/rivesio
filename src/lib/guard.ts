import {
  countSiteSubmissionsSince,
  countSitesForProject,
  countVisitorSubmissionsSince,
  findSite,
  getFeedbackByToken,
  getProjectById,
  getProjectByWidgetKey,
  getSiteById,
  normalizeDomain,
  upsertSite,
} from "./repo";
import { startOfUtcDay } from "./visitor";
import type { FeedbackRow, ProjectRow, SiteRow } from "./types";

export type GuardError =
  | "invalid_widget"
  | "not_registered"
  | "pending"
  | "blocked"
  | "site_limit"
  | "support_ended"
  | "daily_limit_site"
  | "daily_limit_visitor";

/** Effective, inherited-then-overridden runtime config for one site. */
export interface SiteConfig {
  dailyLimitSite: number | null;
  dailyLimitVisitor: number | null;
  supportDays: number | null;
  allowConversation: boolean;
  supportStartsAt: number;
  /** epoch-ms when support ends, or null when unlimited. */
  supportEndsAt: number | null;
}

export interface GuardOk {
  ok: true;
  project: ProjectRow;
  site: SiteRow;
  config: SiteConfig;
}
export interface GuardFail {
  ok: false;
  error: GuardError;
}

interface Input {
  widgetKey: string;
  domain: string;
  meta?: Record<string, unknown>;
  visitorHash?: string | null;
}

/** Resolve per-site overrides against widget-global defaults. null == unlimited. */
export function resolveSiteConfig(project: ProjectRow, site: SiteRow): SiteConfig {
  const supportDays = site.support_days ?? project.default_support_days;
  const supportStartsAt = site.support_starts_at ?? site.first_seen;
  return {
    dailyLimitSite: site.daily_limit_site ?? project.default_daily_limit_site,
    dailyLimitVisitor: site.daily_limit_visitor ?? project.default_daily_limit_visitor,
    supportDays,
    allowConversation: site.allow_conversation ?? project.allow_conversation,
    supportStartsAt,
    supportEndsAt:
      supportDays === null ? null : supportStartsAt + supportDays * 86_400_000,
  };
}

/** Is the support window still open right now? */
export function isSupportActive(config: SiteConfig, now = Date.now()): boolean {
  return config.supportEndsAt === null || now <= config.supportEndsAt;
}

/**
 * Run support + daily-limit gates. DB counts only happen here, after the cheaper
 * approval/support checks pass.
 */
export async function checkSubmissionAllowed(
  site: SiteRow,
  config: SiteConfig,
  visitorHash?: string | null,
): Promise<GuardFail | { ok: true }> {
  if (!isSupportActive(config)) return { ok: false, error: "support_ended" };

  const since = startOfUtcDay();
  if (config.dailyLimitSite !== null) {
    const used = await countSiteSubmissionsSince(site.id, since);
    if (used >= config.dailyLimitSite) return { ok: false, error: "daily_limit_site" };
  }
  if (config.dailyLimitVisitor !== null && visitorHash) {
    const used = await countVisitorSubmissionsSince(site.id, visitorHash, since);
    if (used >= config.dailyLimitVisitor) return { ok: false, error: "daily_limit_visitor" };
  }
  return { ok: true };
}

/**
 * Register/refresh a site on widget load. Resolves the project from the widget key,
 * enforces the per-widget site limit, and upserts the site row.
 */
export async function guardRegister(input: Input): Promise<GuardFail | GuardOk> {
  const project = await getProjectByWidgetKey(input.widgetKey);
  if (!project) return { ok: false, error: "invalid_widget" };

  const domain = normalizeDomain(input.domain);
  const existing = await findSite(project.id, domain);

  // Enforce the site limit only when a brand-new site would be created.
  if (!existing && project.site_limit !== null) {
    const sitesUsed = await countSitesForProject(project.id);
    if (sitesUsed >= project.site_limit) return { ok: false, error: "site_limit" };
  }

  const site = await upsertSite({
    projectId: project.id,
    domain,
    meta: input.meta ?? {},
    defaultStatus: project.auto_approve_sites ? "approved" : "pending",
  });

  if (site.status === "blocked") return { ok: false, error: "blocked" };
  if (site.status === "pending") return { ok: false, error: "pending" };
  return { ok: true, project, site, config: resolveSiteConfig(project, site) };
}

export interface ConversationContext {
  ok: true;
  feedback: FeedbackRow;
  project: ProjectRow;
  site: SiteRow;
  config: SiteConfig;
}

/**
 * Resolve a conversation from its access token, along with the owning project/site
 * and effective config. Used by the public widget history/reply endpoints.
 */
export async function getConversationContext(
  token: string,
): Promise<ConversationContext | { ok: false; error: "not_found" }> {
  const feedback = await getFeedbackByToken(token);
  if (!feedback) return { ok: false, error: "not_found" };
  const [project, site] = await Promise.all([
    getProjectById(feedback.project_id),
    getSiteById(feedback.site_id),
  ]);
  if (!project || !site) return { ok: false, error: "not_found" };
  return { ok: true, feedback, project, site, config: resolveSiteConfig(project, site) };
}

/**
 * Authorize a feedback submission. The site must already exist (registered) and be
 * approved, within its support window and under its daily limits.
 */
export async function guardSubmission(input: Input): Promise<GuardFail | GuardOk> {
  const project = await getProjectByWidgetKey(input.widgetKey);
  if (!project) return { ok: false, error: "invalid_widget" };

  const domain = normalizeDomain(input.domain);
  const site = await findSite(project.id, domain);
  if (!site) return { ok: false, error: "not_registered" };
  if (site.status === "blocked") return { ok: false, error: "blocked" };
  if (site.status === "pending") return { ok: false, error: "pending" };

  const config = resolveSiteConfig(project, site);
  const allowed = await checkSubmissionAllowed(site, config, input.visitorHash);
  if (!allowed.ok) return allowed;

  // Refresh last_seen + meta on each submission.
  const refreshed = await upsertSite({
    projectId: project.id,
    domain,
    meta: input.meta ?? {},
    defaultStatus: "approved",
  });

  return { ok: true, project, site: refreshed, config };
}
