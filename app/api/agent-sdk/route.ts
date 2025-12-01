import { db } from "@/db"; // Your Drizzle instance
import { agentTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, agentId } = await req.json();

    // Validate inputs
    if (!userId || !agentId) {
      return NextResponse.json(
        { error: "userId and agentId are required" },
        { status: 400 }
      );
    }

    // Fetch agent from Neon Postgres using Drizzle
    const agentDetail = await db
      .select()
      .from(agentTable)
      .where(
        and(eq(agentTable.userId, userId), eq(agentTable.agentId, agentId))
      )
      .limit(1);

    // Check if agent exists
    if (!agentDetail || agentDetail.length === 0) {
      return NextResponse.json(
        { error: "Agent not found or access denied" },
        { status: 404 }
      );
    }

    console.log("Agent detail:", agentDetail[0]);

    return NextResponse.json(agentDetail[0], { status: 200 });
  } catch (error: any) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch agent" },
      { status: 500 }
    );
  }
}
