-- Add notification types for agent invites and ticket assignment.
ALTER TYPE "public"."notification_type" ADD VALUE IF NOT EXISTS 'agent_invite';--> statement-breakpoint
ALTER TYPE "public"."notification_type" ADD VALUE IF NOT EXISTS 'assignment';
