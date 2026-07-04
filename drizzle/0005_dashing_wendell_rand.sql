ALTER TABLE "notifications" ADD COLUMN "icon_url" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "image_path" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "metadata" jsonb;