/** Page keys tracked for dwell-time analytics. */
export const TRACKED_PAGES = [
  "admin",
  "details",
  "assessment",
  "va",
  "refraction",
  "complications",
  "care-team",
  "proms",
] as const;

export type TrackedPage = (typeof TRACKED_PAGES)[number];

export type PageDurationsSeconds = Record<TrackedPage, number>;

/** Staff-entered end-of-day label: did the patient follow through with a private upgrade? */
export type UpgradeDecision = "upgraded" | "no-upgrade";

export function isUpgradeDecision(value: unknown): value is UpgradeDecision {
  return value === "upgraded" || value === "no-upgrade";
}

export type PatientSessionRecord = {
  sessionId: string;
  patientName: string;
  nric: string;
  /** GMT+8 display timestamp captured on the form. */
  formDateTime: string;
  insurer?: string;
  consultant?: string;
  roomAssistant?: string;
  startedAtIso: string;
  endedAtIso: string;
  pageSeconds: PageDurationsSeconds;
  totalSeconds: number;
  catProm5Score: number | null;
  visualAcuity: string | null;
  completed: boolean;
  /** Set manually from /admin after the clinic day; absent until labelled. */
  upgradeDecision?: UpgradeDecision;
};

export function emptyPageSeconds(): PageDurationsSeconds {
  return {
    admin: 0,
    details: 0,
    assessment: 0,
    va: 0,
    refraction: 0,
    complications: 0,
    "care-team": 0,
    proms: 0,
  };
}

export function isTrackedPage(value: string): value is TrackedPage {
  return (TRACKED_PAGES as readonly string[]).includes(value);
}

export const PAGE_LABELS: Record<TrackedPage, string> = {
  admin: "Administrator (staff)",
  details: "Patient verification",
  assessment: "CAT-PROM5 + VA assessment",
  va: "Visual acuity outcomes",
  refraction: "Refractive accuracy",
  complications: "Complications",
  "care-team": "Insurer & consultant",
  proms: "PROMS / quality of life",
};
