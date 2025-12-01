import { db } from "@/db";
import { agentTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: any) {
  const { agentId } = await context.params;
  try {
    console.log("🔥 API HIT");
    console.log(request.method);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .select({
        agentId: agentTable.agentId,
        name: agentTable.name,
        published: agentTable.published,
        nodes: agentTable.nodes,
        edges: agentTable.edges,
        userId: agentTable.userId,
      })
      .from(agentTable)
      .where(eq(agentTable.agentId, agentId))
      .limit(1);

    console.log("🔥 QUERY RESULT:", result);

    if (!result || result.length === 0) {
      console.log("🔥 RESULT EMPTY — RETURNING 404");

      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const agent = result[0];

    console.log("🔥 AGENT USER ID:", agent.userId);
    console.log("🔥 SESSION USER ID:", session?.user?.id);

    if (agent.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      agentId: agent.agentId,
      name: agent.name,
      published: agent.published,
      nodes: agent.nodes || [
        {
          id: "start",
          position: { x: 0, y: 0 },
          data: { label: "Start" },
          type: "StartNode",
        },
      ],
      edges: agent.edges || [],
    });
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: any) {
  const { agentId } = await context.params;
  try {
    // giving info about who is making the request
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // 401 -> http status code for not authorized.
    }

    const { nodes = [], edges = [] } = await request.json(); // text to js obj (reverse of JSON.stringify)

    console.log("🔥 PUT REQUEST:", nodes, edges);

    // ✅ Best: Remove all ReactFlow internal properties
    const cleanedNodes = nodes.map(
      ({ selected, dragging, measured, ...node }: any) => node
    );

    await db
      .update(agentTable)
      .set({
        nodes: cleanedNodes,
        edges: edges,
        updatedAt: new Date(),
      })
      .where(eq(agentTable.agentId, agentId));

    return NextResponse.json({ success: true }); // returning success response 200
  } catch (error) {
    console.error("Error saving workflow:", error);
    return NextResponse.json(
      { error: "Failed to save workflow" },
      { status: 500 }
    );
  }
}
