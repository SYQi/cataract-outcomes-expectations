export const VA_OPTIONS = [
  "6/9",
  "6/12",
  "6/15",
  "6/21",
  "6/24",
  "6/30",
  "6/45",
  "6/60",
  "Worse than 6/60",
] as const;

export type VisualAcuity = (typeof VA_OPTIONS)[number];

/** Ordinal index: 0 = best vision, higher = worse. */
export function vaSeverityIndex(va: VisualAcuity): number {
  return VA_OPTIONS.indexOf(va);
}

/** Display % for comparator bar (inverse: better VA = higher bar toward good vision). */
export function vaToGoodVisionPercent(va: VisualAcuity): number {
  const worst = VA_OPTIONS.length - 1;
  const idx = vaSeverityIndex(va);
  return Math.round(((worst - idx) / worst) * 100);
}

export const POST_OP_VA_6_12_OR_BETTER_PERCENT = 90;

export const POST_OP_VA_LABEL = "6/12 or better";

/** Crystal-clear post-op preview (6/12 — no blur). */
export const POST_OP_VA_BLUR_PX = 0;

export const POST_OP_VA_SHARPEN_FILTER =
  "blur(0px) contrast(1.14) saturate(1.2) brightness(1.04)";

/** Gaussian blur radius (px) for simulated vision — worse VA = more blur. */
const VA_BLUR_STEPS_PX = [0, 1.5, 3, 5, 7, 9, 11, 14, 18] as const;

export function vaToBlurPx(va: VisualAcuity): number {
  const idx = vaSeverityIndex(va);
  return VA_BLUR_STEPS_PX[idx] ?? VA_BLUR_STEPS_PX[VA_BLUR_STEPS_PX.length - 1];
}
