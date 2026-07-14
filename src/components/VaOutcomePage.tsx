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
      <div className="flex min-h-0 flex-col gap-3 landscape:grid landscape:grid-cols-2 landscape:items-stretch landscape:gap-4 sm:gap-3">
        <div className="min-h-0 landscape:flex landscape:flex-col">
          <VaPrePostCompare visualAcuity={visualAcuity} />
        </div>
        <div className="min-h-0 shrink-0 landscape:flex landscape:min-h-0 landscape:flex-col">
          <div className="landscape:min-h-0 landscape:flex-1">
            <VaTrendChart />
          </div>
          <p className="mt-2 shrink-0 text-center text-[10px] text-slate-400 landscape:mt-1.5 sm:text-[11px]">
            {SPECIALIST_CARE_FOOTNOTE} · {COHORT_CASE_COUNT} cases · {REPORTING_WINDOW_LABEL}
          </p>
          <p className="mt-2 hidden border-t border-slate-200 pt-2 text-left text-[10px] leading-snug text-slate-500 landscape:mt-1.5 landscape:pt-1.5 sm:block">
            <span className="font-semibold text-slate-600">
              Reference (Blue Mountains Eye Study, 75%):{" "}
            </span>
            {BLUE_MOUNTAINS_CITATION}
          </p>
        </div>
      </div>
    </OutcomePageShell>
  );
}
