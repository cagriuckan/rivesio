CREATE TYPE "public"."agent_membership_status" AS ENUM('invited', 'active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."feedback_assignment_source" AS ENUM('claimed', 'category_auto', 'manual');--> statement-breakpoint
CREATE TABLE "agent_memberships" (
	"id" text PRIMARY KEY NOT NULL,
	"project_id" text NOT NULL,
	"email" text NOT NULL,
	"user_id" text,
	"status" "agent_membership_status" DEFAULT 'invited' NOT NULL,
	"categories" jsonb,
	"invited_by" text NOT NULL,
	"invited_at" bigint NOT NULL,
	"accepted_at" bigint,
	"created_at" bigint NOT NULL,
	"updated_at" bigint NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "assigned_to" text;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "assigned_at" bigint;--> statement-breakpoint
ALTER TABLE "feedbacks" ADD COLUMN "assignment_source" "feedback_assignment_source";--> statement-breakpoint
ALTER TABLE "agent_memberships" ADD CONSTRAINT "agent_memberships_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_memberships" ADD CONSTRAINT "agent_memberships_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agent_memberships" ADD CONSTRAINT "agent_memberships_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_agent_memberships_project_email" ON "agent_memberships" USING btree ("project_id","email");--> statement-breakpoint
CREATE INDEX "idx_agent_memberships_user" ON "agent_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_agent_memberships_project_status" ON "agent_memberships" USING btree ("project_id","status");--> statement-breakpoint
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_feedbacks_assigned" ON "feedbacks" USING btree ("project_id","assigned_to");