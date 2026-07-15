CREATE TYPE "public"."attachment_kind" AS ENUM('screenshot', 'upload');--> statement-breakpoint
CREATE TYPE "public"."feedback_status" AS ENUM('new', 'planned', 'in_progress', 'resolved', 'wontfix');--> statement-breakpoint
CREATE TYPE "public"."priority" AS ENUM('low', 'normal', 'high');--> statement-breakpoint
CREATE TYPE "public"."reply_author" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."site_source" AS ENUM('auto', 'manual');--> statement-breakpoint
CREATE TYPE "public"."site_status" AS ENUM('pending', 'approved', 'blocked');--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" text PRIMARY KEY NOT NULL,
	"feedback_id" text NOT NULL,
	"reply_id" text,
	"kind" "attachment_kind" DEFAULT 'upload' NOT NULL,
	"file_path" text NOT NULL,
	"mime" text NOT NULL,
	"size" bigint NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback_replies" (
	"id" text PRIMARY KEY NOT NULL,
	"feedback_id" text NOT NULL,
	"author" "reply_author" DEFAULT 'admin' NOT NULL,
	"message" text NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedbacks" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"site_id" text NOT NULL,
	"category" text DEFAULT 'Öneri' NOT NULL,
	"message" text NOT NULL,
	"page_url" text,
	"user_agent" text,
	"viewport" text,
	"wp_user" text,
	"email" text,
	"access_token" text NOT NULL,
	"visitor_hash" text,
	"status" "feedback_status" DEFAULT 'new' NOT NULL,
	"priority" "priority" DEFAULT 'normal' NOT NULL,
	"admin_note" text,
	"custom_fields" jsonb,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL,
	"last_activity_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"widget_key" text NOT NULL,
	"settings" jsonb NOT NULL,
	"site_limit" integer,
	"auto_approve_sites" boolean DEFAULT false NOT NULL,
	"allow_conversation" boolean DEFAULT true NOT NULL,
	"default_daily_limit_site" integer,
	"default_daily_limit_visitor" integer,
	"default_support_days" integer,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"domain" text NOT NULL,
	"label" text,
	"status" "site_status" DEFAULT 'pending' NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"source" "site_source" DEFAULT 'auto' NOT NULL,
	"meta" jsonb NOT NULL,
	"support_starts_at" bigint,
	"daily_limit_site" integer,
	"daily_limit_visitor" integer,
	"support_days" integer,
	"allow_conversation" boolean,
	"first_seen" bigint NOT NULL,
	"last_seen" bigint NOT NULL,
	"created_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_feedback_id_feedbacks_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedbacks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_reply_id_feedback_replies_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."feedback_replies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback_replies" ADD CONSTRAINT "feedback_replies_feedback_id_feedbacks_id_fk" FOREIGN KEY ("feedback_id") REFERENCES "public"."feedbacks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_site_id_sites_id_fk" FOREIGN KEY ("site_id") REFERENCES "public"."sites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sites" ADD CONSTRAINT "sites_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_attachments_feedback" ON "attachments" USING btree ("feedback_id");--> statement-breakpoint
CREATE INDEX "idx_attachments_reply" ON "attachments" USING btree ("reply_id");--> statement-breakpoint
CREATE INDEX "idx_feedback_replies_feedback" ON "feedback_replies" USING btree ("feedback_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_feedbacks_access_token" ON "feedbacks" USING btree ("access_token");--> statement-breakpoint
CREATE INDEX "idx_feedbacks_project_created" ON "feedbacks" USING btree ("project_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_feedbacks_site_created" ON "feedbacks" USING btree ("site_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_feedbacks_site_visitor_created" ON "feedbacks" USING btree ("site_id","visitor_hash","created_at");--> statement-breakpoint
CREATE INDEX "idx_feedbacks_status" ON "feedbacks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_feedbacks_email" ON "feedbacks" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_feedbacks_message_fts" ON "feedbacks" USING gin (to_tsvector('simple', "message"));--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_projects_slug" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_projects_widget_key" ON "projects" USING btree ("widget_key");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_sites_project_domain" ON "sites" USING btree ("project_id","domain");--> statement-breakpoint
CREATE INDEX "idx_sites_project_status" ON "sites" USING btree ("project_id","status");