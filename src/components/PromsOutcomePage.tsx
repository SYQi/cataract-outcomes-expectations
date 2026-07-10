"use client";

import { OutcomePageShell } from "@/components/OutcomePageShell";
import { PromsHorizontalScale } from "@/components/PromsHorizontalScale";
import { SPECIALIST_CARE_FOOTNOTE } from "@/lib/messaging";
import { CAT_PROM5_CITATION } from "@/lib/whOutcomes";

type PromsOutcomePageProps = {
  patientScore: number;
  onBack: () => void;
  onNewPatient: () => void;
};

export function PromsOutcomePage({ patientScore, onBack, onNewPatient }: PromsOutcomePageProps) {
  return (
    <OutcomePageShell
      eyebrow="Patient-reported outcomes"
      headline={<>Better Sight, Happier Lives</>}
      onBack={onBack}
      onNext={onNewPatient}
      nextLabel="New patient"
      backLabel="← Complications"
    >
      <div className="flex h-full min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="min-h-0 flex-1">
          <PromsHorizontalScale patientScore={patientScore} />
        </div>
        <p className="mt-2 shrink-0 text-center text-[10px] text-slate-400 sm:text-[11px]">
          {SPECIALIST_CARE_FOOTNOTE}
        </p>
        <p className="mt-2 shrink-0 border-t border-slate-200 pt-2 text-left text-[9px] leading-snug text-slate-500 sm:text-[10px]">
          <span className="font-semibold text-slate-600">Reference (Cat-PROM5): </span>
          {CAT_PROM5_CITATION}
        </p>
      </div>
    </OutcomePageShell>
  );
}
