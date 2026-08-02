import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import type { CustomFieldValue, NotificationPrefs, ProjectSettings } from "../lib/types";

// Epoch milliseconds (Date.now()) stored as bigint, surfaced to JS as a number.
const epoch = (name: string) => bigint(name, { mode: "number" });

// ── Enums ────────────────────────────────────────────────────────────
export const siteStatusEnum = pgEnum("site_status", ["pending", "approved", "blocked"]);
export const siteSourceEnum = pgEnum("site_source", ["auto", "manual"]);
export const feedbackStatusEnum = pgEnum("feedback_status", [
  "open",
  "pending",
  "in_progress",
  "resolved",
  "closed",
]);
export const priorityEnum = pgEnum("priority", ["low", "normal", "high"]);
export const replyAuthorEnum = pgEnum("reply_author", ["admin", "user"]);
export const attachmentKindEnum = pgEnum("attachment_kind", ["screenshot", "upload"]);
export const agentMembershipStatusEnum = pgEnum("agent_membership_status", ["invited", "active", "revoked"]);
export const feedbackAssignmentSourceEnum = pgEnum("feedback_assignment_source", [
  "claimed",
  "category_auto",
  "manual",
]);

// ── Auth (Better Auth managed tables) ────────────────────────────────
// Exception to the epoch-ms convention: Better Auth requires native
// `timestamp` columns on its own tables.
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("member"),
  notificationPrefs: jsonb("notification_prefs").$type<NotificationPrefs>(),
  // Internal storage key for the uploaded avatar (backs the public serving route).
  imagePath: text("image_path"),
  // Free-form per-user labels, e.g. a display override. Not yet editable via UI.
  metadata: jsonb("metadata").$type<Record<string, string>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [uniqueIndex("uniq_user_email").on(t.email)]);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  token: text("token").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [
  uniqueIndex("uniq_session_token").on(t.token),
  index("idx_session_user").on(t.userId),
]);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [index("idx_account_user").on(t.userId)]);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [index("idx_verification_identifier").on(t.identifier)]);

// ── Projects (= "Widget" in product terms) ───────────────────────────
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  // Tenant owner. Nullable only for legacy rows; claimed by the first user.
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  widgetKey: text("widget_key").notNull(),
  // Presentational config (accent, position, categories, text, fields).
  settings: jsonb("settings").$type<ProjectSettings>().notNull(),
  // When false the embed stays hidden and public APIs reject the widget.
  isActive: boolean("is_active").notNull().default(true),
  // Operational, widget-global defaults. null == unlimited.
  siteLimit: integer("site_limit"),
  autoApproveSites: boolean("auto_approve_sites").notNull().default(false),
  allowConversation: boolean("allow_conversation").notNull().default(true),
  defaultDailyLimitSite: integer("default_daily_limit_site"),
  defaultDailyLimitVisitor: integer("default_daily_limit_visitor"),
  defaultSupportDays: integer("default_support_days"),
  createdAt: epoch("created_at").notNull(),
  updatedAt: epoch("updated_at").notNull(),
}, (t) => [
  uniqueIndex("uniq_projects_slug").on(t.slug),
  uniqueIndex("uniq_projects_widget_key").on(t.widgetKey),
  index("idx_projects_user").on(t.userId),
]);

// ── Sites (a domain where a widget is embedded) ──────────────────────
export const sites = pgTable("sites", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  domain: text("domain").notNull(),
  label: text("label"),
  status: siteStatusEnum("status").notNull().default("pending"),
  isFavorite: boolean("is_favorite").notNull().default(false),
  source: siteSourceEnum("source").notNull().default("auto"),
  meta: jsonb("meta").$type<Record<string, unknown>>().notNull(),
  // Per-site overrides. null == inherit the widget default.
  supportStartsAt: epoch("support_starts_at"),
  dailyLimitSite: integer("daily_limit_site"),
  dailyLimitVisitor: integer("daily_limit_visitor"),
  supportDays: integer("support_days"),
  allowConversation: boolean("allow_conversation"),
  firstSeen: epoch("first_seen").notNull(),
  lastSeen: epoch("last_seen").notNull(),
  createdAt: epoch("created_at").notNull(),
}, (t) => [
  uniqueIndex("uniq_sites_project_domain").on(t.projectId, t.domain),
  index("idx_sites_project_status").on(t.projectId, t.status),
]);

// ── Agent memberships (per-project collaborators invited by the owner) ──
export const agentMemberships = pgTable("agent_memberships", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  // Lowercased invite target. Kept even after acceptance for display/resend.
  email: text("email").notNull(),
  // Filled in once the invite is accepted (or immediately if the email already
  // matches an existing user).
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  status: agentMembershipStatusEnum("status").notNull().default("invited"),
  // Categories this agent auto-receives tickets for. null == all categories.
  categories: jsonb("categories").$type<string[] | null>(),
  invitedBy: text("invited_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  invitedAt: epoch("invited_at").notNull(),
  acceptedAt: epoch("accepted_at"),
  createdAt: epoch("created_at").notNull(),
  updatedAt: epoch("updated_at").notNull(),
}, (t) => [
  uniqueIndex("uniq_agent_memberships_project_email").on(t.projectId, t.email),
  index("idx_agent_memberships_user").on(t.userId),
  index("idx_agent_memberships_project_status").on(t.projectId, t.status),
]);

// ── Feedbacks (= a conversation / ticket) ────────────────────────────
export const feedbacks = pgTable("feedbacks", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  siteId: text("site_id")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  category: text("category").notNull().default("Öneri"),
  message: text("message").notNull(),
  pageUrl: text("page_url"),
  userAgent: text("user_agent"),
  viewport: text("viewport"),
  wpUser: text("wp_user"),
  email: text("email"),
  // Capability token: returned once on submit, used by the widget to view/reply.
  accessToken: text("access_token").notNull(),
  // sha256(ip|userAgent) — backs per-visitor daily limits.
  visitorHash: text("visitor_hash"),
  status: feedbackStatusEnum("status").notNull().default("open"),
  priority: priorityEnum("priority").notNull().default("normal"),
  adminNote: text("admin_note"),
  customFields: jsonb("custom_fields").$type<CustomFieldValue[]>(),
  isFavorite: boolean("is_favorite").notNull().default(false),
  // Inbox state: unread = user activity newer than last_admin_read_at.
  lastAdminReadAt: epoch("last_admin_read_at"),
  pinnedAt: epoch("pinned_at"),
  // Agent assignment: who is handling this conversation (owner or an active agent).
  assignedTo: text("assigned_to").references(() => user.id, { onDelete: "set null" }),
  assignedAt: epoch("assigned_at"),
  assignmentSource: feedbackAssignmentSourceEnum("assignment_source"),
  createdAt: epoch("created_at").notNull(),
  updatedAt: epoch("updated_at").notNull(),
  lastActivityAt: epoch("last_activity_at").notNull(),
}, (t) => [
  uniqueIndex("uniq_feedbacks_access_token").on(t.accessToken),
  index("idx_feedbacks_project_created").on(t.projectId, t.createdAt),
  index("idx_feedbacks_site_created").on(t.siteId, t.createdAt),
  index("idx_feedbacks_site_visitor_created").on(t.siteId, t.visitorHash, t.createdAt),
  index("idx_feedbacks_status").on(t.status),
  index("idx_feedbacks_email").on(t.email),
  index("idx_feedbacks_assigned").on(t.projectId, t.assignedTo),
  // Full-text search over the message (admin search-ready).
  index("idx_feedbacks_message_fts").using("gin", sql`to_tsvector('simple', ${t.message})`),
]);

// ── Feedback replies (the conversation thread) ───────────────────────
export const feedbackReplies = pgTable("feedback_replies", {
  id: text("id").primaryKey(),
  feedbackId: text("feedback_id")
    .notNull()
    .references(() => feedbacks.id, { onDelete: "cascade" }),
  author: replyAuthorEnum("author").notNull().default("admin"),
  message: text("message").notNull(),
  // Where a user reply was sent from (page URL) + which browser — null for admin.
  pageUrl: text("page_url"),
  userAgent: text("user_agent"),
  createdAt: epoch("created_at").notNull(),
}, (t) => [
  index("idx_feedback_replies_feedback").on(t.feedbackId, t.createdAt),
]);

// ── Attachments (on a feedback or on a specific reply) ───────────────
export const attachments = pgTable("attachments", {
  id: text("id").primaryKey(),
  feedbackId: text("feedback_id")
    .notNull()
    .references(() => feedbacks.id, { onDelete: "cascade" }),
  replyId: text("reply_id").references(() => feedbackReplies.id, { onDelete: "cascade" }),
  kind: attachmentKindEnum("kind").notNull().default("upload"),
  filePath: text("file_path").notNull(),
  mime: text("mime").notNull(),
  size: epoch("size").notNull(),
  createdAt: epoch("created_at").notNull(),
}, (t) => [
  index("idx_attachments_feedback").on(t.feedbackId),
  index("idx_attachments_reply").on(t.replyId),
]);

// ── Notifications (in-app notification center) ───────────────────────
export const notificationTypeEnum = pgEnum("notification_type", [
  "feedback_new",
  "reply_user",
  "status_change",
  "agent_invite",
  "assignment",
]);

export const notifications = pgTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  link: text("link"),
  // Related widget branding (project logo), shown as the notification's avatar.
  iconUrl: text("icon_url"),
  readAt: epoch("read_at"),
  createdAt: epoch("created_at").notNull(),
}, (t) => [
  index("idx_notifications_user_read").on(t.userId, t.readAt),
  index("idx_notifications_user_created").on(t.userId, t.createdAt),
]);

// ── Web push subscriptions (one row per browser/device) ──────────────
export const pushSubscriptions = pgTable("push_subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  userAgent: text("user_agent"),
  createdAt: epoch("created_at").notNull(),
}, (t) => [
  uniqueIndex("uniq_push_subscriptions_endpoint").on(t.endpoint),
  index("idx_push_subscriptions_user").on(t.userId),
]);

export type UserRecord = typeof user.$inferSelect;
export type NotificationRecord = typeof notifications.$inferSelect;
export type PushSubscriptionRecord = typeof pushSubscriptions.$inferSelect;
export type ProjectRecord = typeof projects.$inferSelect;
export type SiteRecord = typeof sites.$inferSelect;
export type FeedbackRecord = typeof feedbacks.$inferSelect;
export type FeedbackReplyRecord = typeof feedbackReplies.$inferSelect;
export type AttachmentRecord = typeof attachments.$inferSelect;
export type AgentMembershipRecord = typeof agentMemberships.$inferSelect;
