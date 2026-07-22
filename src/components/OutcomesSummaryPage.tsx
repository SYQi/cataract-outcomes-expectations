"use client";

import { PromsHorizontalScale } from "@/components/PromsHorizontalScale";
import { OutcomePageShell } from "@/components/OutcomePageShell";
import { useLocale, useMessages } from "@/lib/i18n";
import {
  REFRACTIVE_WITHIN_1D_PERCENT,
  SURGERY_SUCCESS_NO_COMPLICATION_PERCENT,
  VA_612_OR_BETTER_PERCENT,
} from "@/lib/whOutcomes";

type OutcomesSummaryPageProps = {
  patientScore: number;
  onBack: () => void;
  onNext: () => void;
  onOpenVa: () => void;
  onOpenRefraction: () => void;
  onOpenComplications: () => void;
  onOpenProms: () => void;
};

function MetricCard({
  title,
  value,
  caption,
  moreDetails,
  accent,
  onClick,
}: {
  title: string;
  value: string;
  caption: string;
  moreDetails: string;
  accent: "teal" | "navy" | "green";
  onClick: () => void;
}) {
  const accentClass = {
    teal: "border-teal-300 bg-gradient-to-br from-teal-50 to-white",
    navy: "border-blue-300 bg-gradient-to-br from-blue-50 to-white",
    green: "border-green-300 bg-gradient-to-br from-green-50 to-white",
  }[accent];
  const valueClass = {
    teal: "text-brand-teal",
    navy: "text-brand-navy",
    green: "text-green-700",
  }[accent];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-0 w-full flex-col rounded-xl border-2 p-2.5 text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-navy/20 landscape:rounded-lg landscape:p-2 sm:rounded-2xl sm:p-3 ${accentClass}`}
    >
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 landscape:text-[10px] sm:text-sm">
        {title}
      </p>
      <p
        className={`mt-0.5 font-black leading-none landscape:mt-0 ${valueClass} text-[2.25rem] landscape:text-[1.85rem] sm:text-[2.75rem]`}
      >
        {value}
      </p>
      <p className="mt-1 text-sm font-semibold leading-snug text-slate-700 landscape:mt-0.5 landscape:text-xs sm:text-base">
        {caption}
      </p>
      <p className="mt-auto pt-1.5 text-xs font-bold text-brand-navy underline-offset-2 group-hover:underline landscape:pt-1 landscape:text-[11px] sm:text-sm">
        {moreDetails} →
      </p>
    </button>
  );
}

export function OutcomesSummaryPage({
  patientScore,
  onBack,
  onNext,
  onOpenVa,
  onOpenRefraction,
  onOpenComplications,
  onOpenProms,
}: OutcomesSummaryPageProps) {
  const t = useMessages();
  const { locale } = useLocale();
  const zhTitle = locale === "zh-CN";

  return (
    <OutcomePageShell
      eyebrow={t.outcomesSummary.eyebrow}
      headline={
        <>
          {t.outcomesSummary.headlineBefore}
          <span className="text-[1.3em] font-extrabold text-brand-teal">
            {t.outcomesSummary.headlineSpecialist}
          </span>
          {t.outcomesSummary.headlineAfter}
        </>
      }
      prominentHeadline
      alignContentTop
      compactHeadline
      fitViewport
      onBack={onBack}
      onNext={onNext}
      nextLabel={t.outcomesSummary.nextLabel}
      backLabel={t.outcomesSummary.backLabel}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-2 landscape:gap-1.5 sm:gap-2.5">
        <div className="shrink-0 rounded-xl border-2 border-brand-navy/20 bg-brand-navy px-3 py-2 text-center shadow-md landscape:rounded-lg landscape:py-1.5 sm:rounded-2xl sm:px-4 sm:py-2.5">
          <p
            className={`font-extrabold leading-snug text-white ${
              zhTitle
                ? "text-base landscape:text-sm sm:text-xl"
                : "text-base landscape:text-sm sm:text-lg"
            }`}
          >
            {t.outcomesSummary.specialistBannerBefore}
            <span className="text-[1.3em] text-teal-300">{t.outcomesSummary.specialistBannerWord}</span>
            {t.outcomesSummary.specialistBannerAfter}
          </p>
        </div>

        <div className="grid min-h-0 shrink grid-cols-3 gap-2 landscape:gap-1.5 sm:gap-3">
          <MetricCard
            title={t.outcomesSummary.vaTitle}
            value={`${VA_612_OR_BETTER_PERCENT}%`}
            caption={t.outcomesSummary.vaCaption}
            moreDetails={t.outcomesSummary.moreDetails}
            accent="teal"
            onClick={onOpenVa}
          />
          <MetricCard
            title={t.outcomesSummary.refractiveTitle}
            value={`${REFRACTIVE_WITHIN_1D_PERCENT}%`}
            caption={t.outcomesSummary.refractiveCaption}
            moreDetails={t.outcomesSummary.moreDetails}
            accent="navy"
            onClick={onOpenRefraction}
          />
          <MetricCard
            title={t.outcomesSummary.complicationsTitle}
            value={`${SURGERY_SUCCESS_NO_COMPLICATION_PERCENT}%`}
            caption={t.outcomesSummary.complicationsCaption}
            moreDetails={t.outcomesSummary.moreDetails}
            accent="green"
            onClick={onOpenComplications}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col rounded-xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white p-2 shadow-sm landscape:rounded-lg landscape:p-1.5 sm:rounded-2xl sm:p-3">
          <div className="mb-1 flex shrink-0 justify-end">
            <button
              type="button"
              onClick={onOpenProms}
              className="rounded-lg border border-brand-navy/20 bg-white px-2.5 py-1 text-xs font-bold text-brand-navy shadow-sm hover:bg-slate-50 landscape:py-0.5 sm:rounded-xl sm:px-3 sm:py-1.5 sm:text-sm"
            >
              {t.outcomesSummary.moreDetails} →
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <PromsHorizontalScale
              patientScore={patientScore}
              hideEndLabels
              hideQolCopy
              compact
            />
          </div>
        </div>
      </div>
    </OutcomePageShell>
  );
}
