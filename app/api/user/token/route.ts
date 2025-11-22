import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use select instead of query for better compatibility
    const userData = await db
      .select({
        id: user.id,
        token: user.token,
        name: user.name,
        email: user.email,
      })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!userData || userData.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRecord = userData[0];

    return NextResponse.json({
      token: userRecord.token,
      user: {
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
      },
    });
  } catch (error) {
    console.error("Error fetching user token:", error);
    // Return more details in development
    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 }
    );
  }
}
