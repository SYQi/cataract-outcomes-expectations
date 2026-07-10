/** Page keys tracked for dwell-time analytics. */
export const TRACKED_PAGES = [
  "details",
  "assessment",
  "va",
  "refraction",
  "complications",
  "proms",
] as const;

export type TrackedPage = (typeof TRACKED_PAGES)[number];

export type PageDurationsSeconds = Record<TrackedPage, number>;

export type PatientSessionRecord = {
  sessionId: string;
  patientName: string;
  nric: string;
  /** GMT+8 display timestamp captured on the form. */
  formDateTime: string;
  startedAtIso: string;
  endedAtIso: string;
  pageSeconds: PageDurationsSeconds;
  totalSeconds: number;
  catProm5Score: number | null;
  visualAcuity: string | null;
  completed: boolean;
};

export function emptyPageSeconds(): PageDurationsSeconds {
  return {
    details: 0,
    assessment: 0,
    va: 0,
    refraction: 0,
    complications: 0,
    proms: 0,
  };
}

export function isTrackedPage(value: string): value is TrackedPage {
  return (TRACKED_PAGES as readonly string[]).includes(value);
}

export const PAGE_LABELS: Record<TrackedPage, string> = {
  details: "Patient details",
  assessment: "CAT-PROM5 + VA assessment",
  va: "Visual acuity outcomes",
  refraction: "Refractive accuracy",
  complications: "Complications",
  proms: "PROMS / quality of life",
};
