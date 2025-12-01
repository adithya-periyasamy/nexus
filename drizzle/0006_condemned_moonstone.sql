CREATE TABLE "conversationIdTable" (
	"conversation_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agentId" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversationIdTable" ADD CONSTRAINT "conversationIdTable_agentId_agent_agent_id_fk" FOREIGN KEY ("agentId") REFERENCES "public"."agent"("agent_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversationIdTable" ADD CONSTRAINT "conversationIdTable_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;