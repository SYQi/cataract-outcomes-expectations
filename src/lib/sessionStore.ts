import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { list, put } from "@vercel/blob";
import type { PatientSessionRecord } from "@/lib/sessionAnalytics";

const LOCAL_DIR = "/tmp/patient-conversion-sessions";
const BLOB_PREFIX = "patient-sessions/";

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function ensureLocalDir() {
  await mkdir(LOCAL_DIR, { recursive: true });
}

export async function saveSessionRecord(record: PatientSessionRecord): Promise<void> {
  const body = JSON.stringify(record, null, 2);
  const filename = `${record.sessionId}.json`;

  if (hasBlobToken()) {
    await put(`${BLOB_PREFIX}${filename}`, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }

  await ensureLocalDir();
  await writeFile(path.join(LOCAL_DIR, filename), body, "utf8");
}

export async function listSessionRecords(): Promise<PatientSessionRecord[]> {
  if (hasBlobToken()) {
    const records: PatientSessionRecord[] = [];
    let cursor: string | undefined;
    do {
      const result = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 });
      for (const blob of result.blobs) {
        try {
          const res = await fetch(blob.url);
          if (!res.ok) continue;
          const json = (await res.json()) as PatientSessionRecord;
          if (json?.sessionId) records.push(json);
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

export function sessionsToCsv(records: PatientSessionRecord[]): string {
  const headers = [
    "session_id",
    "patient_name",
    "nric",
    "form_datetime_gmt8",
    "started_at_iso",
    "ended_at_iso",
    "seconds_details",
    "seconds_assessment",
    "seconds_va",
    "seconds_refraction",
    "seconds_complications",
    "seconds_proms",
    "total_seconds",
    "cat_prom5_score",
    "visual_acuity",
    "completed",
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
      r.startedAtIso,
      r.endedAtIso,
      r.pageSeconds.details,
      r.pageSeconds.assessment,
      r.pageSeconds.va,
      r.pageSeconds.refraction,
      r.pageSeconds.complications,
      r.pageSeconds.proms,
      r.totalSeconds,
      r.catProm5Score ?? "",
      r.visualAcuity ?? "",
      r.completed ? "yes" : "no",
    ]
      .map(escape)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
}

export function storageMode(): "vercel-blob" | "local-tmp" {
  return hasBlobToken() ? "vercel-blob" : "local-tmp";
}
