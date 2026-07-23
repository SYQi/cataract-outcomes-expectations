export type Locale = "en" | "zh-CN" | "ms" | "ta";

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  en: "en",
  "zh-CN": "zh-CN",
  ms: "ms",
  ta: "ta",
};

export type CatProm5QuestionCopy = {
  labelParts: { text: string; emphasize?: boolean }[];
  minLabel: string;
  maxLabel: string;
};

export type ConsultantCopy = {
  rank: string;
  department: string;
  clinicalInterests: string;
  languages: string[];
  about: string;
  sourceLabel: string;
};

export type Messages = {
  admin: {
    languageLabel: string;
    languageEnglish: string;
    languageChinese: string;
    languageMalay: string;
    languageTamil: string;
    languageHint: string;
  };
  wizard: {
    titleLine1: string;
    titleLine2: string;
    verifyIntro: string;
    assessmentTitle: string;
    assessmentSubtitle: string;
    outcomeOf: string; // "{current} of {total} · {label}"
    swipeHint: string;
    outcomeSummary: string;
    outcomeVa: string;
    outcomeRefraction: string;
    outcomeComplications: string;
    outcomeProms: string;
    outcomeCareTeam: string;
  };
  details: {
    heading: string;
    intro: string;
    fullName: string;
    nric: string;
    backToStaff: string;
    confirmContinue: string;
  };
  assessment: {
    questionOf: string; // "Question {n} of {total}"
    frontierHint: string;
    adjustHint: string;
    selected: string; // "Selected: {value}"
  };
  catProm5: Record<"a" | "b" | "c" | "d" | "e", CatProm5QuestionCopy>;
  common: {
    next: string;
    back: string;
    woodlandsHospital: string;
    woodlandsHealth: string;
    cases: string; // "{count} cases"
  };
  messaging: {
    specialistCareFootnote: string;
  };
  outcomesSummary: {
    eyebrow: string;
    headlineBefore: string;
    headlineSpecialist: string;
    headlineAfter: string;
    specialistBanner: string;
    vaTitle: string;
    vaCaption: string;
    refractiveTitle: string;
    refractiveCaption: string;
    complicationsTitle: string;
    complicationsCaption: string;
    promsTitle: string;
    promsCaption: string;
    moreDetails: string;
    nextLabel: string;
    backLabel: string;
    backToOverview: string;
  };
  va: {
    eyebrow: string;
    headlineSpecialists: string;
    headlineAtHospital: string;
    badgeTitle: string;
    successRate: string;
    badgeSubtitle: string;
    nextLabel: string;
    backLabel: string;
    howYouSeeToday: string;
    afterSurgery: string;
    postOpVaLabel: string;
    altToday: string;
    altAfter: string;
    chartTitle: string;
    legendSydney: string; // includes {percent}
    referenceSydney: string;
    tooltipSeries: string;
  };
  refraction: {
    eyebrow: string;
    headlineNoGlasses: string;
    probability: string; // "{percent}% probability"
    within1d: string;
    readingGlassesNote: string;
    footnoteCohort: string;
    nextLabel: string;
    chartTitle: string;
    legendNhs: string; // includes {percent}
    referenceNhs: string; // includes {percent}
  };
  complications: {
    eyebrow: string;
    headlineSuccess: string; // ends before % which is injected
    headlineSuccessSuffix: string;
    headlineSpecialistOutcomes: string;
    nextLabel: string;
    careBadge: string;
    successfulNoComplications: string;
    compareTitle: string;
    compareSubtitle: string;
    labelRcoShort: string;
    labelRcoLong: string;
    labelWoodlands: string;
    summaryWhRate: string;
    summaryVsRco: string; // includes low–high
    summaryRatio: string; // includes {ratio}
    nearlyHalf: string;
    referenceTitle: string; // includes low–high
  };
  proms: {
    eyebrow: string;
    headline: string;
    nextLabel: string;
    backLabel: string;
    poor: string;
    great: string;
    youToday: string;
    firstEye: string;
    secondEye: string;
    qolLine1: string;
    qolLine2Before: string;
    qolLine2Mid: string;
    qolLine3: string;
    referenceLabel: string;
  };
  careTeam: {
    headlineYour: string;
    headlineInsurer: string;
    headlineAnd: string;
    headlineSpecialist: string;
    headlineForSurgery: string;
    yourInsurer: string;
    yourSpecialist: string;
    clinicalInterests: string;
  languages: string;
  nhgEyeInstitute: string;
  sourcePrefix: string;
  nextLabel: string;
  backLabel: string;
  consultants: Record<string, ConsultantCopy>;
};
};
