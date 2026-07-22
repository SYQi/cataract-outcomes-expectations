"use client";

import { OutcomePageShell } from "@/components/OutcomePageShell";
import { PromsHorizontalScale } from "@/components/PromsHorizontalScale";
import { useLocale, useMessages } from "@/lib/i18n";
import { CAT_PROM5_CITATION } from "@/lib/whOutcomes";

type PromsOutcomePageProps = {
  patientScore: number;
  onBack: () => void;
  onNext: () => void;
};

export function PromsOutcomePage({ patientScore, onBack, onNext }: PromsOutcomePageProps) {
  const t = useMessages();
  const { locale } = useLocale();
  const zhTitle = locale === "zh-CN";

  return (
    <OutcomePageShell
      eyebrow={t.proms.eyebrow}
      headline={
        <span
          className={`block ${
            zhTitle ? "text-[2.43rem] sm:text-[2.7rem]" : "text-[2.025rem] sm:text-[2.25rem]"
          }`}
        >
          {t.proms.headline}
        </span>
      }
      onBack={onBack}
      onNext={onNext}
      nextLabel={t.outcomesSummary.nextLabel}
      backLabel={t.outcomesSummary.backToOverview}
    >
      <div className="flex flex-col justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <PromsHorizontalScale patientScore={patientScore} />
        <p className="mt-2 shrink-0 text-center text-[10px] text-slate-400 sm:text-[11px]">
          {t.messaging.specialistCareFootnote}
        </p>
        <p className="mt-2 hidden border-t border-slate-200 pt-2 text-left text-[10px] leading-snug text-slate-500 sm:block">
          <span className="font-semibold text-slate-600">{t.proms.referenceLabel}</span>
          {CAT_PROM5_CITATION}
        </p>
      </div>
    </OutcomePageShell>
  );
}
