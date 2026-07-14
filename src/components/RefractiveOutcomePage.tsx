"use client";

import { useEffect, useState } from "react";
import { OutcomePageShell } from "@/components/OutcomePageShell";
import { OutcomeTrendChart } from "@/components/OutcomeTrendChart";
import { SPECIALIST_CARE_FOOTNOTE } from "@/lib/messaging";
import {
  COHORT_CASE_COUNT,
  MONTHLY_REFRACTIVE_1D_TREND,
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
        <>
          <span className="block">
            <span className="text-[1.15em] font-extrabold text-brand-teal">
              {REFRACTIVE_WITHIN_1D_PERCENT}%
            </span>{" "}
            chance you wont need glasses when looking far:
          </span>
          <span className="mt-1 block">
            <span className="text-[1.15em] font-extrabold text-brand-teal">Consultant-led</span>{" "}
            surgeries
          </span>
        </>
      }
      onBack={onBack}
      onNext={onNext}
      nextLabel="Complications →"
    >
      <div className="flex flex-col items-center gap-3 landscape:grid landscape:grid-cols-[auto_1fr] landscape:items-center landscape:gap-4 sm:gap-3">
        <div className="flex shrink-0 justify-center">
          <div
            className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy to-teal-600 shadow-xl landscape:h-24 landscape:w-24 sm:h-32 sm:w-32 ${
              show ? "animate-scale-jump" : "scale-75 opacity-0"
            }`}
          >
            <div className="absolute inset-2 rounded-full border-2 border-white/30 sm:inset-3" />
            <div className="text-center text-white">
              <p className="text-2xl font-black leading-none sm:text-3xl">
                {REFRACTIVE_WITHIN_1D_PERCENT}%
              </p>
              <p className="mt-1 text-[8px] font-semibold uppercase tracking-wide text-white/85 sm:text-[9px]">
                within ±1.0D
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 w-full shrink-0">
          <div className="min-h-[100px] landscape:min-h-[120px] sm:min-h-[150px]">
            <OutcomeTrendChart
              title="Refractive ±1.0D — Woodlands specialist trend"
              seriesLabel="Within ±1.0D"
              data={MONTHLY_REFRACTIVE_1D_TREND}
              stroke="#0d9488"
              dotFill="#00205B"
              reference={{
                value: NHS_REFRACTIVE_REFERENCE_PERCENT,
                label: `NHS ${NHS_REFRACTIVE_REFERENCE_PERCENT}%`,
                stroke: "#b45309",
              }}
            />
          </div>

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
