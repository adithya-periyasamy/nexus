ALTER TABLE "agent" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "agent" ADD COLUMN "nodes" jsonb;--> statement-breakpoint
ALTER TABLE "agent" ADD COLUMN "edges" jsonb;