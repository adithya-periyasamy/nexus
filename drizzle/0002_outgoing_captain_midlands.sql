CREATE TABLE "agent" (
	"agent_id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"config" jsonb,
	"published" boolean DEFAULT false NOT NULL
);
