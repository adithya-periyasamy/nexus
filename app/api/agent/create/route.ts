import { db } from "@/db";
import { agentTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Agent name is required" },
        { status: 400 }
      );
    }

    // Insert agent into database
    const [newAgent] = await db
      .insert(agentTable)
      .values({
        name: name.trim(),
        userId: session.user.id,
        published: false,
      })
      .returning();

    return NextResponse.json({
      success: true,
      agent: newAgent,
    });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent" },
      { status: 500 }
    );
  }
}
