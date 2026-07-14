"use client";

import { OutcomePageShell } from "@/components/OutcomePageShell";
import { VaPrePostCompare } from "@/components/VaPrePostCompare";
import { VaQuarterlyChart } from "@/components/VaQuarterlyChart";
import { SPECIALIST_CARE_FOOTNOTE } from "@/lib/messaging";
import type { VisualAcuity } from "@/lib/va";
import {
  COHORT_CASE_COUNT,
  REPORTING_WINDOW_LABEL,
  VA_612_OR_BETTER_PERCENT,
} from "@/lib/whOutcomes";

type VaOutcomePageProps = {
  visualAcuity: VisualAcuity;
  onBack: () => void;
  onNext: () => void;
};

export function VaOutcomePage({ visualAcuity, onBack, onNext }: VaOutcomePageProps) {
  return (
    <OutcomePageShell
      prominentHeadline
      alignContentTop
      compactHeadline
      fitViewport
      eyebrow="Visual acuity"
      headline={
        <span className="block">
          <span className="text-[1.15em] font-extrabold text-brand-teal">Specialist Ophthalmologists</span>{" "}
          at Woodlands Hospital
        </span>
      }
      onBack={onBack}
      onNext={onNext}
      nextLabel="Refractive accuracy →"
      backLabel="Revise answers"
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-3 landscape:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] landscape:gap-4">
        <div className="min-h-0 landscape:max-h-full">
          <VaPrePostCompare stacked visualAcuity={visualAcuity} />
        </div>

        <div className="flex min-h-0 flex-col justify-between gap-2">
          <div className="min-h-0 flex-1">
            <VaQuarterlyChart />
          </div>

          <div className="shrink-0 rounded-xl border border-teal-100 bg-gradient-to-r from-teal-50/80 to-white px-3 py-2 text-center shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal-700/80 sm:text-xs">
              Better vision after surgery
            </p>
            <p className="mt-0.5 text-base font-extrabold text-brand-navy sm:text-lg">
              <span className="text-teal-700">{VA_612_OR_BETTER_PERCENT}%</span> success rate
            </p>
          </div>

          <p className="shrink-0 text-center text-[9px] leading-snug text-slate-400 sm:text-[10px]">
            {SPECIALIST_CARE_FOOTNOTE} · {COHORT_CASE_COUNT} cases · {REPORTING_WINDOW_LABEL}
          </p>
        </div>
      </div>
    </OutcomePageShell>
  );
}
