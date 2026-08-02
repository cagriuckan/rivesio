-- Support-inbox triage: rename product-board statuses to actionable ones.
ALTER TYPE "public"."feedback_status" RENAME VALUE 'new' TO 'open';--> statement-breakpoint
ALTER TYPE "public"."feedback_status" RENAME VALUE 'planned' TO 'pending';--> statement-breakpoint
ALTER TYPE "public"."feedback_status" RENAME VALUE 'wontfix' TO 'closed';--> statement-breakpoint
ALTER TABLE "feedbacks" ALTER COLUMN "status" SET DEFAULT 'open';
