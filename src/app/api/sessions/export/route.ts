import { NextResponse } from "next/server";
import { listSessionRecords, sessionsToCsv, storageMode } from "@/lib/sessionStore";

export const runtime = "nodejs";

const ADMIN_PASSWORD = process.env.ANALYTICS_ADMIN_PASSWORD || "123";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password") || "";
  const format = searchParams.get("format") || "csv";

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const records = await listSessionRecords();

    if (format === "json") {
      return NextResponse.json({
        storage: storageMode(),
        count: records.length,
        sessions: records,
      });
    }

    const csv = sessionsToCsv(records);
    const stamp = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="cataract-outcomes-sessions-${stamp}.csv"`,
      },
    });
  } catch (error) {
    console.error("Failed to export sessions", error);
    return NextResponse.json({ error: "Failed to export sessions" }, { status: 500 });
  }
}
