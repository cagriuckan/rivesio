// Maps Drizzle (camelCase, typed jsonb) records back to the app's snake_case Row
// contracts so the rest of the codebase stays unchanged while the DB layer modernizes.
import type {
  AttachmentRecord,
  NotificationRecord,
  FeedbackRecord,
  FeedbackReplyRecord,
  ProjectRecord,
  SiteRecord,
  AgentMembershipRecord,
} from "./schema";
import type {
  AttachmentRow,
  NotificationRow,
  FeedbackReplyRow,
  FeedbackRow,
  ProjectRow,
  SiteRow,
  AgentMembershipRow,
} from "../lib/types";

export function toProjectRow(r: ProjectRecord): ProjectRow {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    widget_key: r.widgetKey,
    settings_json: JSON.stringify(r.settings),
    site_limit: r.siteLimit,
    auto_approve_sites: r.autoApproveSites,
    allow_conversation: r.allowConversation,
    default_daily_limit_site: r.defaultDailyLimitSite,
    default_daily_limit_visitor: r.defaultDailyLimitVisitor,
    default_support_days: r.defaultSupportDays,
    created_at: r.createdAt,
    updated_at: r.updatedAt,
  };
}

export function toSiteRow(r: SiteRecord): SiteRow {
  return {
    id: r.id,
    project_id: r.projectId,
    domain: r.domain,
    status: r.status,
    source: r.source,
    meta_json: JSON.stringify(r.meta),
    first_seen: r.firstSeen,
    last_seen: r.lastSeen,
    is_favorite: r.isFavorite ? 1 : 0,
    label: r.label,
    support_starts_at: r.supportStartsAt,
    daily_limit_site: r.dailyLimitSite,
    daily_limit_visitor: r.dailyLimitVisitor,
    support_days: r.supportDays,
    allow_conversation: r.allowConversation,
  };
}

export function toFeedbackRow(r: FeedbackRecord): FeedbackRow {
  return {
    id: r.id,
    project_id: r.projectId,
    site_id: r.siteId,
    category: r.category,
    message: r.message,
    page_url: r.pageUrl,
    user_agent: r.userAgent,
    viewport: r.viewport,
    wp_user: r.wpUser,
    email: r.email,
    access_token: r.accessToken,
    visitor_hash: r.visitorHash,
    status: r.status,
    priority: r.priority,
    admin_note: r.adminNote,
    custom_fields_json: r.customFields ? JSON.stringify(r.customFields) : null,
    created_at: r.createdAt,
    updated_at: r.updatedAt,
    last_activity_at: r.lastActivityAt,
    is_favorite: r.isFavorite ? 1 : 0,
    last_admin_read_at: r.lastAdminReadAt,
    pinned_at: r.pinnedAt,
    assigned_to: r.assignedTo,
    assigned_at: r.assignedAt,
    assignment_source: r.assignmentSource,
  };
}

export function toAgentMembershipRow(r: AgentMembershipRecord): AgentMembershipRow {
  return {
    id: r.id,
    project_id: r.projectId,
    email: r.email,
    user_id: r.userId,
    status: r.status,
    categories: r.categories ?? null,
    invited_by: r.invitedBy,
    invited_at: r.invitedAt,
    accepted_at: r.acceptedAt,
    created_at: r.createdAt,
    updated_at: r.updatedAt,
  };
}

export function toReplyRow(r: FeedbackReplyRecord): FeedbackReplyRow {
  return {
    id: r.id,
    feedback_id: r.feedbackId,
    author: r.author,
    message: r.message,
    page_url: r.pageUrl,
    user_agent: r.userAgent,
    created_at: r.createdAt,
  };
}

export function toAttachmentRow(r: AttachmentRecord): AttachmentRow {
  return {
    id: r.id,
    feedback_id: r.feedbackId,
    reply_id: r.replyId,
    kind: r.kind,
    file_path: r.filePath,
    mime: r.mime,
    size: r.size,
    created_at: r.createdAt,
  };
}

export function toNotificationRow(r: NotificationRecord): NotificationRow {
  return {
    id: r.id,
    user_id: r.userId,
    type: r.type,
    title: r.title,
    body: r.body,
    link: r.link,
    icon_url: r.iconUrl,
    read_at: r.readAt,
    created_at: r.createdAt,
  };
}
