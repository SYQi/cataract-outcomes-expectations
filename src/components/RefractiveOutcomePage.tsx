"use client";

import { useEffect, useState } from "react";
import { OutcomePageShell } from "@/components/OutcomePageShell";
import { RefractiveQuarterlyChart } from "@/components/RefractiveQuarterlyChart";
import { SPECIALIST_CARE_FOOTNOTE } from "@/lib/messaging";
import {
  COHORT_CASE_COUNT,
  NHS_REFRACTIVE_CITATION,
  NHS_REFRACTIVE_REFERENCE_PERCENT,
  REFRACTIVE_WITHIN_1D_PERCENT,
  REPORTING_WINDOW_LABEL,
} from "@/lib/whOutcomes";

type RefractiveOutcomePageProps = {
  onBack: () => void;
  onNext: () => void;
};

export function RefractiveOutcomePage({ onBack, onNext }: RefractiveOutcomePageProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <OutcomePageShell
      prominentHeadline
      eyebrow="Refractive accuracy"
      headline={
        <span className="block">
          No Glasses Required After Surgery:{" "}
          <span className="text-[1.15em] font-extrabold text-brand-teal">
            {REFRACTIVE_WITHIN_1D_PERCENT}%
          </span>{" "}
          Success Rate
        </span>
      }
      onBack={onBack}
      onNext={onNext}
      nextLabel="Complications →"
    >
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        <div className="flex shrink-0 justify-center">
          <div
            className={`relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy to-teal-600 shadow-xl landscape:h-32 landscape:w-32 sm:h-36 sm:w-36 ${
              show ? "animate-scale-jump" : "scale-75 opacity-0"
            }`}
          >
            <div className="absolute inset-2.5 rounded-full border-2 border-white/30 sm:inset-3" />
            <div className="text-center text-white">
              <p className="text-3xl font-black leading-none sm:text-4xl">
                {REFRACTIVE_WITHIN_1D_PERCENT}%
              </p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-white/90 sm:text-[10px]">
                within ±1.0D
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 w-full shrink-0">
          <div className="h-[210px] w-full landscape:h-[200px] sm:h-[240px]">
            <RefractiveQuarterlyChart />
          </div>

          <p className="mt-3 text-center text-sm font-medium leading-snug text-slate-600 sm:text-base">
            Reading glasses are still required for near or small text.
          </p>

          <p className="mt-2 shrink-0 text-center text-[10px] text-slate-400 sm:text-[11px]">
            {SPECIALIST_CARE_FOOTNOTE} · VA ≥ 6/12 cohort · {COHORT_CASE_COUNT} cases ·{" "}
            {REPORTING_WINDOW_LABEL}
          </p>
          <p className="mt-2 hidden border-t border-slate-200 pt-2 text-left text-[10px] leading-snug text-slate-500 landscape:pb-1 sm:block">
            <span className="font-semibold text-slate-600">
              Reference (NHS, {NHS_REFRACTIVE_REFERENCE_PERCENT}% within ±1.0D):{" "}
            </span>
            {NHS_REFRACTIVE_CITATION}
          </p>
        </div>
      </div>
    </OutcomePageShell>
  );
}
