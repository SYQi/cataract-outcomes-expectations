import { NextResponse } from "next/server";
import { deleteSessionRecord, storageMode } from "@/lib/sessionStore";

export const runtime = "nodejs";

const ADMIN_PASSWORD = process.env.ANALYTICS_ADMIN_PASSWORD || "123";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      password?: string;
      sessionId?: string;
    };

    if ((body.password || "") !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!body.sessionId || typeof body.sessionId !== "string") {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const deleted = await deleteSessionRecord(body.sessionId);
    if (!deleted) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, storage: storageMode() });
  } catch (error) {
    console.error("Failed to delete session", error);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}
