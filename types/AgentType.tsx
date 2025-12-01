// import { InferModel } from "drizzle-orm";
// import { agentTable } from "@/db/schema";

// export type AgentType = InferModel<typeof agentTable>;

export type AgentType = {
  agentId: string;
  name: string | "";
  config: any;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  nodes?: any;
  edges?: any;
  agentToolConfig?: any;
};
