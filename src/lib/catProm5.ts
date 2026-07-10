/** Raw score (0–21) → logit score lookup for CAT-PROM5. */
export const RAW_TO_LOGIT: Record<number, number> = {
  0: -9.18,
  1: -6.8,
  2: -4.92,
  3: -4.03,
  4: -3.37,
  5: -2.81,
  6: -2.29,
  7: -1.8,
  8: -1.31,
  9: -0.82,
  10: -0.32,
  11: 0.18,
  12: 0.69,
  13: 1.22,
  14: 1.76,
  15: 2.33,
  16: 2.93,
  17: 3.56,
  18: 4.23,
  19: 4.98,
  20: 6.01,
  21: 7.45,
};

export const CAT_PROM5_QUESTIONS = [
  {
    id: "a" as const,
    label:
      "How bad is the visual impairment considering only the affected eye?",
    minLabel: "No impairment at all",
    maxLabel: "Very bad",
    min: 0,
    max: 3,
  },
  {
    id: "b" as const,
    label: "How bad is the visual impairment, with both eyes open?",
    minLabel: "No impairment at all",
    maxLabel: "Very bad",
    min: 0,
    max: 6,
  },
  {
    id: "c" as const,
    label: "How has your (poor) eyesight interfered with life in general?",
    minLabel: "No interference at all",
    maxLabel: "Extremely bad effect on quality of life",
    min: 0,
    max: 5,
  },
  {
    id: "d" as const,
    label:
      "How has your (poor) eyesight prevented you from doing things that you like to do / hobbies?",
    minLabel: "Never",
    maxLabel: "All the time",
    min: 0,
    max: 3,
  },
  {
    id: "e" as const,
    label:
      "How has your (poor) eyesight affected your ability to read (with the assistance of reading glasses, if any)?",
    minLabel: "No difficulties reading at all",
    maxLabel: "Can't read at all because of poor eyesight",
    min: 0,
    max: 4,
  },
] as const;

export type CatProm5Answers = Record<(typeof CAT_PROM5_QUESTIONS)[number]["id"], number>;

export const DEFAULT_CAT_PROM5_ANSWERS: CatProm5Answers = {
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
};

export function sumRawScore(answers: CatProm5Answers): number {
  return answers.a + answers.b + answers.c + answers.d + answers.e;
}

export function rawToLogit(raw: number): number {
  const clamped = Math.max(0, Math.min(21, Math.round(raw)));
  return RAW_TO_LOGIT[clamped];
}

/** Higher = better quality of life / less impairment. */
export function logitToScore100(logit: number): number {
  const score = ((7.45 - logit) / 16.63) * 100;
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

export function computeCatProm5Score100(answers: CatProm5Answers): {
  raw: number;
  logit: number;
  score100: number;
} {
  const raw = sumRawScore(answers);
  const logit = rawToLogit(raw);
  const score100 = logitToScore100(logit);
  return { raw, logit, score100 };
}

export const POST_OP_CAT_PROM5_FIRST_EYE = 60;
export const POST_OP_CAT_PROM5_SECOND_EYE = 72;
