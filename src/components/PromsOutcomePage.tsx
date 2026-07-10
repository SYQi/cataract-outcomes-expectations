"use client";

import { OutcomePageShell } from "@/components/OutcomePageShell";
import { PromsHorizontalScale } from "@/components/PromsHorizontalScale";
import { SPECIALIST_CARE_FOOTNOTE } from "@/lib/messaging";
import { CAT_PROM5_CITATION } from "@/lib/whOutcomes";

type PromsOutcomePageProps = {
  patientScore: number;
  onBack: () => void;
  onNext: () => void;
};

export function PromsOutcomePage({ patientScore, onBack, onNext }: PromsOutcomePageProps) {
  return (
    <OutcomePageShell
      eyebrow="Patient-reported outcomes"
      headline={<>Better Sight, Happier Lives</>}
      onBack={onBack}
      onNext={onNext}
      nextLabel="Your care team →"
      backLabel="← Complications"
    >
      <div className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:h-full sm:p-6">
        <div className="min-h-0 flex-1">
          <PromsHorizontalScale patientScore={patientScore} />
        </div>
        <p className="mt-2 shrink-0 text-center text-[10px] text-slate-400 sm:text-[11px]">
          {SPECIALIST_CARE_FOOTNOTE}
        </p>
        <p className="mt-2 hidden border-t border-slate-200 pt-2 text-left text-[10px] leading-snug text-slate-500 sm:block">
          <span className="font-semibold text-slate-600">Reference (Cat-PROM5): </span>
          {CAT_PROM5_CITATION}
        </p>
      </div>
    </OutcomePageShell>
  );
}
