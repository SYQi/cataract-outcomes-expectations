"use client";

import { OutcomePageShell } from "@/components/OutcomePageShell";
import { VaPrePostCompare } from "@/components/VaPrePostCompare";
import { VaTrendChart } from "@/components/VaTrendChart";
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
      fitViewport
      eyebrow="Visual acuity"
      headline={
        <>
          <span className="block">
            <span className={EMPHASIS}>Specialist Ophthalmologists</span> at Woodlands Hospital
          </span>
          <span className="mt-0.5 block">
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
      <div className="flex min-h-0 flex-1 flex-col gap-2 landscape:grid landscape:grid-cols-2 landscape:gap-3">
        <div className="min-h-0 flex-[1.05] landscape:h-full">
          <VaPrePostCompare visualAcuity={visualAcuity} />
        </div>
        <div className="flex min-h-0 flex-1 flex-col landscape:h-full">
          <div className="min-h-0 flex-1">
            <VaTrendChart />
          </div>
          <p className="mt-1 shrink-0 text-center text-[9px] leading-snug text-slate-400 sm:text-[10px]">
            {SPECIALIST_CARE_FOOTNOTE} · {COHORT_CASE_COUNT} cases · {REPORTING_WINDOW_LABEL}
          </p>
        </div>
      </div>
    </OutcomePageShell>
  );
}
