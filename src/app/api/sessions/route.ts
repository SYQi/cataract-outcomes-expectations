import { NextResponse } from "next/server";
import type { PatientSessionRecord } from "@/lib/sessionAnalytics";
import { emptyDetailDrillClicks, emptyPageSeconds, isTrackedPage } from "@/lib/sessionAnalytics";
import { readSessionRecord, saveSessionRecord } from "@/lib/sessionStore";

export const runtime = "nodejs";

function isValidRecord(body: unknown): body is PatientSessionRecord {
  if (!body || typeof body !== "object") return false;
  const r = body as Partial<PatientSessionRecord>;
  if (typeof r.sessionId !== "string" || !r.sessionId) return false;
  if (typeof r.patientName !== "string") return false;
  if (typeof r.nric !== "string") return false;
  if (typeof r.formDateTime !== "string") return false;
  if (typeof r.startedAtIso !== "string") return false;
  if (typeof r.endedAtIso !== "string") return false;
  if (typeof r.totalSeconds !== "number") return false;
  if (typeof r.completed !== "boolean") return false;
  if (!r.pageSeconds || typeof r.pageSeconds !== "object") return false;
  for (const key of Object.keys(r.pageSeconds)) {
    if (!isTrackedPage(key)) return false;
  }
  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isValidRecord(body)) {
      return NextResponse.json({ error: "Invalid session payload" }, { status: 400 });
    }

    const pageSeconds = { ...emptyPageSeconds(), ...body.pageSeconds };
    const totalSeconds = Object.values(pageSeconds).reduce((sum, n) => sum + (Number(n) || 0), 0);
    const detailDrillClicks = {
      ...emptyDetailDrillClicks(),
      ...(body.detailDrillClicks ?? {}),
    };

    const record: PatientSessionRecord = {
      ...body,
      pageSeconds,
      detailDrillClicks,
      totalSeconds: Math.round(totalSeconds),
      patientName: body.patientName.trim(),
      nric: body.nric.trim().toUpperCase(),
    };

    // Preserve staff-labelled upgrade decisions and any previously saved
    // CAT-PROM5 score when a later flush omits them (e.g. early wizard steps).
    const existing = await readSessionRecord(record.sessionId);
    if (record.upgradeDecision === undefined && existing?.upgradeDecision) {
      record.upgradeDecision = existing.upgradeDecision;
    }
    if (record.catProm5Score == null && existing?.catProm5Score != null) {
      record.catProm5Score = existing.catProm5Score;
    }

    await saveSessionRecord(record);
    return NextResponse.json({ ok: true, sessionId: record.sessionId });
  } catch (error) {
    console.error("Failed to save session", error);
    return NextResponse.json({ error: "Failed to save session" }, { status: 500 });
  }
}
