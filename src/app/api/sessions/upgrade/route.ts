import { NextResponse } from "next/server";
import { isUpgradeDecision } from "@/lib/sessionAnalytics";
import { setSessionUpgradeDecision } from "@/lib/sessionStore";

export const runtime = "nodejs";

const ADMIN_PASSWORD = process.env.ANALYTICS_ADMIN_PASSWORD || "123";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      password?: string;
      sessionId?: string;
      decision?: unknown;
    };

    if ((body.password || "") !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!body.sessionId || typeof body.sessionId !== "string") {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }
    // null clears the label; otherwise must be a valid decision value.
    if (body.decision !== null && !isUpgradeDecision(body.decision)) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    const updated = await setSessionUpgradeDecision(
      body.sessionId,
      body.decision === null ? null : body.decision,
    );
    if (!updated) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, session: updated });
  } catch (error) {
    console.error("Failed to update upgrade decision", error);
    return NextResponse.json({ error: "Failed to update upgrade decision" }, { status: 500 });
  }
}
