import { db } from "@/db";
import { agentTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ agentId: string }> }
) {
  try {
    const { agentId } = await context.params;

    // Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the agent tool config from request body
    const { agentToolConfig } = await request.json();

    if (!agentToolConfig) {
      return NextResponse.json(
        { error: "Agent tool config is required" },
        { status: 400 }
      );
    }

    // Update the agent in database
    const updatedAgent = await db
      .update(agentTable)
      .set({
        agentToolConfig: agentToolConfig,
        updatedAt: new Date(),
      })
      .where(eq(agentTable.agentId, agentId))
      .returning();

    if (!updatedAgent.length) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      agent: updatedAgent[0],
    });
  } catch (error) {
    console.error("Error updating agent tool config:", error);
    return NextResponse.json(
      { error: "Failed to update agent config" },
      { status: 500 }
    );
  }
}
