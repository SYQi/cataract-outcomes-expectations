"use client";

import { OutcomePageShell } from "@/components/OutcomePageShell";
import { VaPrePostCompare } from "@/components/VaPrePostCompare";
import { VaTrendChart } from "@/components/VaTrendChart";
import { SPECIALIST_CARE_FOOTNOTE } from "@/lib/messaging";
import type { VisualAcuity } from "@/lib/va";
import {
  BLUE_MOUNTAINS_CITATION,
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
      eyebrow="Visual acuity"
      headline={
        <>
          <span className="block">
            <span className={EMPHASIS}>Specialist Ophthalmologists</span> at Woodlands Hospital
          </span>
          <span className="mt-1 block">
            achieve good vision for{" "}
            <span className={EMPHASIS}>{VA_612_OR_BETTER_PERCENT}%</span> of all patients
          </span>
          <span className="mt-1 block">within 1 month of cataract surgery</span>
        </>
      }
      onBack={onBack}
      onNext={onNext}
      nextLabel="Refractive accuracy →"
      backLabel="Revise answers"
    >
      <div className="flex min-h-0 flex-col gap-3 sm:h-full sm:gap-3">
        <VaPrePostCompare visualAcuity={visualAcuity} />
        <div className="min-h-[130px] sm:min-h-[170px]">
          <VaTrendChart />
        </div>
        <p className="shrink-0 text-center text-[10px] text-slate-400 sm:text-[11px]">
          {SPECIALIST_CARE_FOOTNOTE} · {COHORT_CASE_COUNT} cases · {REPORTING_WINDOW_LABEL}
        </p>
        <p className="hidden border-t border-slate-200 pt-2 text-left text-[10px] leading-snug text-slate-500 sm:block">
          <span className="font-semibold text-slate-600">Reference (Blue Mountains Eye Study, 75%): </span>
          {BLUE_MOUNTAINS_CITATION}
        </p>
      </div>
    </OutcomePageShell>
  );
}
