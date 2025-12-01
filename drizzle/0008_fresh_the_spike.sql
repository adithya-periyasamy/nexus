ALTER TABLE "conversationIdTable" RENAME COLUMN "agentId" TO "agent_id";--> statement-breakpoint
ALTER TABLE "conversationIdTable" DROP CONSTRAINT "conversationIdTable_agentId_agent_agent_id_fk";
--> statement-breakpoint
ALTER TABLE "conversationIdTable" ADD CONSTRAINT "conversationIdTable_agent_id_agent_agent_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."agent"("agent_id") ON DELETE no action ON UPDATE no action;