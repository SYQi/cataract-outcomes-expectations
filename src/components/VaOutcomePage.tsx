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
      <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-3 landscape:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] landscape:gap-3">
        <div className="min-h-0 landscape:max-h-full">
          <VaPrePostCompare stacked visualAcuity={visualAcuity} />
        </div>

        <div className="flex min-h-0 flex-col gap-0">
          <VaQuarterlyChart />

          <div className="relative -mt-0.5 shrink-0 overflow-hidden rounded-2xl border border-teal-200/90 bg-gradient-to-br from-brand-navy via-teal-800 to-teal-600 px-5 py-5 text-center shadow-lg ring-1 ring-teal-300/50 sm:px-6 sm:py-6">
            <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-sm" />
            <div className="pointer-events-none absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-teal-300/25 blur-md" />
            <p className="relative text-sm font-bold uppercase tracking-[0.2em] text-teal-100 sm:text-base">
              Better Vision After Surgery
            </p>
            <p className="relative mt-2.5 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
              {VA_612_OR_BETTER_PERCENT}%
              <span className="ml-2.5 text-xl font-bold text-teal-100 sm:text-2xl">success rate</span>
            </p>
            <p className="relative mt-2.5 text-xs font-medium text-teal-50/85 sm:text-sm">
              Specialist outcomes at Woodlands Hospital
            </p>
          </div>

          <p className="shrink-0 pt-1 text-center text-[9px] leading-snug text-slate-400 sm:text-[10px]">
            {SPECIALIST_CARE_FOOTNOTE} · {COHORT_CASE_COUNT} cases · {REPORTING_WINDOW_LABEL}
          </p>
        </div>
      </div>
    </OutcomePageShell>
  );
}
