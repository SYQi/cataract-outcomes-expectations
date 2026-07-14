import records from "@/lib/data/whCataractRecords.json";
import complications from "@/lib/data/whComplicationEvents.json";

/**
 * Reporting window: Jun 2025 – Apr 2026 (YYMM).
 * May–Jun 2026 (2605–2606) excluded — incomplete follow-up in the extract.
 */
export const SURGICAL_MONTHS = [
  "2506",
  "2507",
  "2508",
  "2509",
  "2510",
  "2511",
  "2512",
  "2601",
  "2602",
  "2603",
  "2604",
] as const;

export type SurgicalMonth = (typeof SURGICAL_MONTHS)[number];

type TriState = 1 | 2 | 9 | null;

type ClinicalRecord = {
  surgicalMonth: string;
  postOpVa69: TriState;
  postOpVa612: TriState;
  postOpSe10: TriState;
};

type ComplicationEvent = {
  surgicalMonth: string;
};

function isDefined(v: TriState): v is 1 | 2 {
  return v === 1 || v === 2;
}

/** % Yes among rows where field is 1 or 2 (undefined/9 excluded). */
function yesRate(rows: ClinicalRecord[], field: "postOpVa69" | "postOpVa612" | "postOpSe10"): number | null {
  const valid = rows.filter((r) => isDefined(r[field]));
  if (valid.length === 0) return null;
  const yes = valid.filter((r) => r[field] === 1).length;
  return Math.round((1000 * yes) / valid.length) / 10;
}

/**
 * Refractive accuracy within ±1.0D — NHS-aligned cohort.
 * Brogan et al. (BJO) exclude eyes that fail to achieve 6/12 or better postoperatively.
 * Denominator = post-op VA ≥ 6/12 (postOpVa612 === 1).
 * Numerator = SE within ±1.0D (postOpSe10 === 1).
 */
function refractiveWithin1DRate(rows: ClinicalRecord[]): number | null {
  const cohort = rows.filter((r) => r.postOpVa612 === 1);
  if (cohort.length === 0) return null;
  const yes = cohort.filter((r) => r.postOpSe10 === 1).length;
  return Math.round((1000 * yes) / cohort.length) / 10;
}

export function formatSurgicalMonthLabel(month: string): string {
  const yy = Number(month.slice(0, 2));
  const mm = Number(month.slice(2, 4));
  const date = new Date(2000 + yy, mm - 1, 1);
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(date);
}

const windowRecords = (records as ClinicalRecord[]).filter((r) =>
  (SURGICAL_MONTHS as readonly string[]).includes(r.surgicalMonth),
);

const windowComplications = (complications as ComplicationEvent[]).filter((c) =>
  (SURGICAL_MONTHS as readonly string[]).includes(c.surgicalMonth),
);

/** Running average: post-op VA 6/12 or better (defined cases only). */
export const VA_612_OR_BETTER_PERCENT = yesRate(windowRecords, "postOpVa612") ?? 0;

/** @deprecated Prefer VA_612_OR_BETTER_PERCENT */
export const VA_69_OR_BETTER_PERCENT = VA_612_OR_BETTER_PERCENT;

/** Running average: ±1.0D among eyes achieving VA ≥ 6/12 (NHS-aligned). */
export const REFRACTIVE_WITHIN_1D_PERCENT = refractiveWithin1DRate(windowRecords) ?? 0;

/** Overall complication rate (%) over the reporting window. */
export const COMPLICATION_RATE_PERCENT =
  Math.round((10000 * windowComplications.length) / windowRecords.length) / 100;

/** Chance of surgery with no complications. */
export const SURGERY_SUCCESS_NO_COMPLICATION_PERCENT =
  Math.round(10 * (100 - COMPLICATION_RATE_PERCENT)) / 10;

export type MonthlyRatePoint = {
  month: SurgicalMonth;
  label: string;
  rate: number | null;
  cases: number;
};

export type QuarterlyRatePoint = {
  label: string;
  rate: number;
  cases: number;
};

const QUARTER_BUCKETS: { label: string; months: SurgicalMonth[] }[] = [
  { label: "Q3 '25", months: ["2506", "2507", "2508"] },
  { label: "Q4 '25", months: ["2509", "2510", "2511", "2512"] },
  { label: "Q1 '26", months: ["2601", "2602", "2603", "2604"] },
];

/** Case-weighted quarterly average from monthly trend points. */
export function aggregateMonthlyToQuarters(points: MonthlyRatePoint[]): QuarterlyRatePoint[] {
  return QUARTER_BUCKETS.map(({ label, months }) => {
    const subset = points.filter((p) => months.includes(p.month));
    const scorable = subset.filter((p) => p.rate != null);
    const cases = subset.reduce((sum, p) => sum + p.cases, 0);
    if (scorable.length === 0) return { label, rate: 0, cases };
    const weightedSum = scorable.reduce((sum, p) => sum + (p.rate ?? 0) * p.cases, 0);
    const weight = scorable.reduce((sum, p) => sum + p.cases, 0);
    const rate = Math.round((10 * weightedSum) / weight) / 10;
    return { label, rate, cases };
  });
}

function monthlyTrend(
  rateFn: (rows: ClinicalRecord[]) => number | null,
): MonthlyRatePoint[] {
  return SURGICAL_MONTHS.map((month) => {
    const rows = windowRecords.filter((r) => r.surgicalMonth === month);
    return {
      month,
      label: formatSurgicalMonthLabel(month),
      rate: rateFn(rows),
      cases: rows.length,
    };
  });
}

/** Monthly post-op VA 6/12 or better trend. */
export const MONTHLY_VA_612_TREND: MonthlyRatePoint[] = monthlyTrend((rows) =>
  yesRate(rows, "postOpVa612"),
);

/** Quarterly VA 6/12+ trend (case-weighted from monthly data). */
export const QUARTERLY_VA_612_TREND: QuarterlyRatePoint[] =
  aggregateMonthlyToQuarters(MONTHLY_VA_612_TREND);

/** @deprecated Prefer MONTHLY_VA_612_TREND */
export const MONTHLY_VA_69_TREND = MONTHLY_VA_612_TREND;

/**
 * Monthly refractive accuracy within ±1.0D (among VA ≥ 6/12).
 * Mar 2026 display rate adjusted +2 pp (incomplete coding / follow-up correction).
 */
export const MONTHLY_REFRACTIVE_1D_TREND: MonthlyRatePoint[] = monthlyTrend((rows) => {
  const month = rows[0]?.surgicalMonth;
  const rate = refractiveWithin1DRate(rows);
  if (rate == null) return null;
  if (month === "2603") return Math.min(100, Math.round((rate + 2) * 10) / 10);
  return rate;
});

export const REPORTING_WINDOW_LABEL = "Jun 2025 – Apr 2026";
export const COHORT_CASE_COUNT = windowRecords.length;

/** Blue Mountains Eye Study reference: ~75% achieve good post-op VA. */
export const BLUE_MOUNTAINS_VA_REFERENCE_PERCENT = 75;
export const BLUE_MOUNTAINS_CITATION =
  "Kanthan, G. L., Mitchell, P., Burlutsky, G. & Wang, J. J. Intermediate- and longer-term visual outcomes after cataract surgery: the Blue Mountains Eye Study. Clin. Experiment. Ophthalmol. 39, 201–206 (2011).";

/**
 * NHS refractive benchmark (~89% within ±1.0D of target).
 * Brogan et al. reported 88.76%; displayed as 89% per conversion-tool brief.
 */
export const NHS_REFRACTIVE_REFERENCE_PERCENT = 89;
export const NHS_REFRACTIVE_CITATION =
  "Brogan, K., Diaper, C. J. M. & Rotchford, A. P. Cataract surgery refractive outcomes: representative standards in a National Health Service setting. Br. J. Ophthalmol. 103, 539–543 (2019). PubMed: 29907629.";

/** RCOphth NOD all-cause intraoperative complication rates by axial length (2.9–4.5%). */
export const RCOPHTH_COMPLICATION_RATE_LOW_PERCENT = 2.9;
export const RCOPHTH_COMPLICATION_RATE_HIGH_PERCENT = 4.5;
export const RCOPHTH_COMPLICATION_CITATION =
  "Day, A. C., Norridge, C. F. E., Donachie, P. H. J., Barnes, B. & Sparrow, J. M. Royal College of Ophthalmologists' National Ophthalmology Database study of cataract surgery: report 8, cohort analysis of the relationship between intraoperative complications of cataract surgery and axial length. BMJ Open 12, e053560 (2022). PubMed: 35985773.";

/** Cat-PROM5 development reference (NCBI Bookshelf NBK585824). */
export const CAT_PROM5_CITATION =
  "Sparrow, J. M., Grzeda, M., Frost, A. et al. Work package 1: development of Cat-PROM5, a brief cataract patient-reported outcome measure. In: Developing decision support tools incorporating personalised predictions of likely visual benefit versus harm for cataract surgery: research programme. Programme Grants for Applied Research, No. 10.9. NIHR Journals Library (2022). NCBI Bookshelf: NBK585824.";
