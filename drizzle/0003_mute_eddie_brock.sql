ALTER TABLE "agent" ALTER COLUMN "agent_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "agent" ALTER COLUMN "agent_id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "agent" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agent" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "agent" ADD CONSTRAINT "agent_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;