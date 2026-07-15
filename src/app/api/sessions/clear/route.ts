import { NextResponse } from "next/server";
import { clearAllSessionRecords, storageMode } from "@/lib/sessionStore";

export const runtime = "nodejs";

const ADMIN_PASSWORD = process.env.ANALYTICS_ADMIN_PASSWORD || "123";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { password?: string };
    const password = body.password || "";

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await clearAllSessionRecords();
    return NextResponse.json({
      ok: true,
      deleted,
      storage: storageMode(),
    });
  } catch (error) {
    console.error("Failed to clear sessions", error);
    return NextResponse.json({ error: "Failed to clear sessions" }, { status: 500 });
  }
}
