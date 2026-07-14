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

const EMPHASIS = "text-[1.15em] font-extrabold text-brand-teal";

export function VaOutcomePage({ visualAcuity, onBack, onNext }: VaOutcomePageProps) {
  return (
    <OutcomePageShell
      prominentHeadline
      alignContentTop
      compactHeadline
      fitViewport
      eyebrow="Visual acuity"
      headline={
        <>
          <span className="block landscape:inline">
            <span className={EMPHASIS}>Specialist Ophthalmologists</span> at Woodlands Hospital
          </span>
          <span className="mt-0.5 block landscape:mt-0 landscape:inline landscape:ml-1">
            achieve good vision for{" "}
            <span className={EMPHASIS}>{VA_612_OR_BETTER_PERCENT}%</span> of all patients within 1
            month
          </span>
        </>
      }
      onBack={onBack}
      onNext={onNext}
      nextLabel="Refractive accuracy →"
      backLabel="Revise answers"
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 landscape:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] landscape:gap-3 sm:gap-3">
        <div className="min-h-0 landscape:max-h-full">
          <VaPrePostCompare stacked visualAcuity={visualAcuity} />
        </div>
        <div className="flex min-h-0 flex-col gap-1">
          <div className="min-h-0 flex-1">
            <VaQuarterlyChart />
          </div>
          <p className="shrink-0 text-center text-[9px] leading-snug text-slate-400 landscape:text-[8px] sm:text-[10px]">
            {SPECIALIST_CARE_FOOTNOTE} · {COHORT_CASE_COUNT} cases · {REPORTING_WINDOW_LABEL}
          </p>
        </div>
      </div>
    </OutcomePageShell>
  );
}
