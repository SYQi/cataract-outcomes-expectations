import { mkdir, readdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";
import { del, get, list, put } from "@vercel/blob";
import type { PatientSessionRecord, UpgradeDecision } from "@/lib/sessionAnalytics";

const LOCAL_DIR = "/tmp/patient-conversion-sessions";
const BLOB_PREFIX = "patient-sessions/";

/**
 * New Blob stores use OIDC (`BLOB_STORE_ID` + `VERCEL_OIDC_TOKEN` on Vercel).
 * Older stores used a long-lived `BLOB_READ_WRITE_TOKEN`.
 */
function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}

function blobAccess(): "public" | "private" {
  if (process.env.BLOB_ACCESS === "public" || process.env.BLOB_ACCESS === "private") {
    return process.env.BLOB_ACCESS;
  }
  // OIDC-connected stores are typically private; legacy RW-token examples used public.
  return process.env.BLOB_STORE_ID ? "private" : "public";
}

async function ensureLocalDir() {
  await mkdir(LOCAL_DIR, { recursive: true });
}

async function readBlobRecord(pathname: string): Promise<PatientSessionRecord | null> {
  const access = blobAccess();
  const result = await get(pathname, { access });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  const text = await new Response(result.stream).text();
  const json = JSON.parse(text) as PatientSessionRecord;
  return json?.sessionId ? json : null;
}

export async function saveSessionRecord(record: PatientSessionRecord): Promise<void> {
  const body = JSON.stringify(record, null, 2);
  const filename = `${record.sessionId}.json`;

  if (hasBlobStorage()) {
    await put(`${BLOB_PREFIX}${filename}`, body, {
      access: blobAccess(),
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  await ensureLocalDir();
  await writeFile(path.join(LOCAL_DIR, filename), body, "utf8");
}

/** Read a single stored record by session id (Blob or local file). */
export async function readSessionRecord(sessionId: string): Promise<PatientSessionRecord | null> {
  // Session ids are UUIDs or sess_* tokens; reject anything path-like.
  if (!/^[A-Za-z0-9_-]+$/.test(sessionId)) return null;
  const filename = `${sessionId}.json`;

  if (hasBlobStorage()) {
    try {
      return await readBlobRecord(`${BLOB_PREFIX}${filename}`);
    } catch {
      return null;
    }
  }

  await ensureLocalDir();
  try {
    const raw = await readFile(path.join(LOCAL_DIR, filename), "utf8");
    const json = JSON.parse(raw) as PatientSessionRecord;
    return json?.sessionId ? json : null;
  } catch {
    return null;
  }
}

/**
 * Set or clear the staff-entered upgrade decision on a stored session.
 * Returns the updated record, or null if the session does not exist.
 */
export async function setSessionUpgradeDecision(
  sessionId: string,
  decision: UpgradeDecision | null,
): Promise<PatientSessionRecord | null> {
  const record = await readSessionRecord(sessionId);
  if (!record) return null;

  const updated: PatientSessionRecord = { ...record };
  if (decision) {
    updated.upgradeDecision = decision;
  } else {
    delete updated.upgradeDecision;
  }
  await saveSessionRecord(updated);
  return updated;
}

/**
 * Permanently delete a single session record.
 * Returns true if a record was removed, false if it did not exist / id was invalid.
 */
export async function deleteSessionRecord(sessionId: string): Promise<boolean> {
  if (!/^[A-Za-z0-9_-]+$/.test(sessionId)) return false;
  const filename = `${sessionId}.json`;

  if (hasBlobStorage()) {
    const pathname = `${BLOB_PREFIX}${filename}`;
    const existing = await readBlobRecord(pathname).catch(() => null);
    if (!existing) return false;
    await del(pathname);
    return true;
  }

  await ensureLocalDir();
  const filePath = path.join(LOCAL_DIR, filename);
  try {
    await rm(filePath, { force: false });
    return true;
  } catch {
    return false;
  }
}

export async function listSessionRecords(): Promise<PatientSessionRecord[]> {
  if (hasBlobStorage()) {
    const records: PatientSessionRecord[] = [];
    let cursor: string | undefined;
    do {
      const result = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 });
      for (const blob of result.blobs) {
        try {
          const json = await readBlobRecord(blob.pathname);
          if (json) records.push(json);
        } catch {
          // skip corrupt blobs
        }
      }
      cursor = result.cursor;
      if (!result.hasMore) break;
    } while (cursor);
    return records.sort((a, b) => a.startedAtIso.localeCompare(b.startedAtIso));
  }

  await ensureLocalDir();
  const files = (await readdir(LOCAL_DIR)).filter((f) => f.endsWith(".json"));
  const records: PatientSessionRecord[] = [];
  for (const file of files) {
    try {
      const raw = await readFile(path.join(LOCAL_DIR, file), "utf8");
      const json = JSON.parse(raw) as PatientSessionRecord;
      if (json?.sessionId) records.push(json);
    } catch {
      // skip
    }
  }
  return records.sort((a, b) => a.startedAtIso.localeCompare(b.startedAtIso));
}

/** Permanently delete all stored patient session records. Returns how many were removed. */
export async function clearAllSessionRecords(): Promise<number> {
  if (hasBlobStorage()) {
    const pathnames: string[] = [];
    let cursor: string | undefined;
    do {
      const result = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 });
      for (const blob of result.blobs) {
        pathnames.push(blob.pathname);
      }
      cursor = result.cursor;
      if (!result.hasMore) break;
    } while (cursor);

    if (pathnames.length > 0) {
      // Batch deletes; @vercel/blob accepts a string or array of pathnames/URLs.
      const chunkSize = 100;
      for (let i = 0; i < pathnames.length; i += chunkSize) {
        await del(pathnames.slice(i, i + chunkSize));
      }
    }
    return pathnames.length;
  }

  await ensureLocalDir();
  const files = (await readdir(LOCAL_DIR)).filter((f) => f.endsWith(".json"));
  await Promise.all(files.map((file) => rm(path.join(LOCAL_DIR, file), { force: true })));
  return files.length;
}

export function sessionsToCsv(records: PatientSessionRecord[]): string {
  const headers = [
    "session_id",
    "patient_name",
    "nric",
    "form_datetime_gmt8",
    "insurer",
    "consultant",
    "room_assistant",
    "started_at_iso",
    "ended_at_iso",
    "seconds_admin",
    "seconds_details",
    "seconds_assessment",
    "seconds_outcomes_summary",
    "seconds_va",
    "seconds_refraction",
    "seconds_complications",
    "seconds_proms",
    "seconds_care_team",
    "clicks_va_details",
    "clicks_refraction_details",
    "clicks_complications_details",
    "clicks_proms_details",
    "total_seconds",
    "cat_prom5_score",
    "visual_acuity",
    "completed",
    "upgrade_decision",
  ];

  const escape = (value: string | number | boolean | null | undefined) => {
    const s = value == null ? "" : String(value);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const rows = records.map((r) =>
    [
      r.sessionId,
      r.patientName,
      r.nric,
      r.formDateTime,
      r.insurer ?? "",
      r.consultant ?? "",
      r.roomAssistant ?? "",
      r.startedAtIso,
      r.endedAtIso,
      r.pageSeconds.admin,
      r.pageSeconds.details,
      r.pageSeconds.assessment,
      r.pageSeconds["outcomes-summary"] ?? 0,
      r.pageSeconds.va,
      r.pageSeconds.refraction,
      r.pageSeconds.complications,
      r.pageSeconds.proms,
      r.pageSeconds["care-team"],
      r.detailDrillClicks?.va ?? 0,
      r.detailDrillClicks?.refraction ?? 0,
      r.detailDrillClicks?.complications ?? 0,
      r.detailDrillClicks?.proms ?? 0,
      r.totalSeconds,
      r.catProm5Score ?? "",
      r.visualAcuity ?? "",
      r.completed ? "yes" : "no",
      r.upgradeDecision === "upgraded" ? "upgraded" : r.upgradeDecision === "no-upgrade" ? "no upgrade" : "",
    ]
      .map(escape)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

export function storageMode(): "vercel-blob" | "local-tmp" {
  return hasBlobStorage() ? "vercel-blob" : "local-tmp";
}
