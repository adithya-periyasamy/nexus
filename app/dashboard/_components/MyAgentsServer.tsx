import { db } from "@/db";
import { agentTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { BrainCircuit } from "lucide-react";
import moment from "moment";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyAgentsServer() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const agents = await db
    .select()
    .from(agentTable)
    .where(eq(agentTable.userId, session.user.id))
    .orderBy(desc(agentTable.createdAt));

  if (agents.length === 0) {
    return (
      <div className="w-full mt-3 flex justify-center items-center py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <BrainCircuit className="h-16 w-16 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-700">No agents yet</h3>
          <p className="text-gray-500">
            Create your first AI agent to get started
          </p>
          {/* <Link href="/dashboard">
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Button>
          </Link> */}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => (
          <Link
            href={`/agent-builder/${agent.agentId}`}
            key={agent.agentId}
            className="p-5 border rounded-2xl shadow hover:shadow-lg transition-shadow duration-200 hover:border-gray-400"
          >
            <div className="flex items-start justify-between">
              <BrainCircuit className="bg-yellow-100 p-2 rounded-lg h-10 w-10 text-yellow-600" />
              {agent.published && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Published
                </span>
              )}
            </div>
            <h2 className="mt-3 font-semibold text-lg line-clamp-1">
              {agent.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Created {moment(agent.createdAt).fromNow()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
