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
  largeZh,
}: {
  title: string;
  value: string;
  caption: string;
  moreDetails: string;
  accent: "teal" | "navy" | "green";
  onClick: () => void;
  largeZh: boolean;
}) {
  const accentClass = {
    teal: "border-teal-300 bg-gradient-to-br from-teal-50 via-white to-teal-50/40 ring-teal-200/50",
    navy: "border-blue-300 bg-gradient-to-br from-blue-50 via-white to-blue-50/40 ring-blue-200/50",
    green: "border-green-300 bg-gradient-to-br from-green-50 via-white to-green-50/40 ring-green-200/50",
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
      className={`group flex w-full flex-col rounded-2xl border-2 p-4 text-left shadow-md ring-1 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-4 landscape:p-3 sm:p-4 ${accentClass}`}
    >
      <p className="text-[1.05rem] font-bold uppercase tracking-wide text-slate-500 sm:text-[1.2rem]">
        {title}
      </p>
      <p
        className={`mt-1 font-black leading-none tracking-tight ${valueClass} ${
          largeZh
            ? "text-[3.9rem] landscape:text-[3.3rem] sm:text-[4.5rem]"
            : "text-[3.6rem] landscape:text-[3.12rem] sm:text-[4.2rem]"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-[1.2rem] font-semibold leading-snug text-slate-700 landscape:mt-1.5 landscape:text-[1.05rem] sm:text-[1.35rem]">
        {caption}
      </p>
      <p className="mt-3 text-[1.05rem] font-bold text-brand-navy underline-offset-2 group-hover:underline landscape:mt-2 sm:text-[1.2rem]">
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
  const largeZh = locale === "zh-CN";

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
      summaryHeadlineBoost
      onBack={onBack}
      onNext={onNext}
      nextLabel={t.outcomesSummary.nextLabel}
      backLabel={t.outcomesSummary.backLabel}
    >
      <div className="flex min-h-0 flex-1 flex-col justify-start gap-3 landscape:gap-2 sm:gap-3.5">
        <div className="shrink-0 rounded-2xl border-2 border-brand-teal/40 bg-gradient-to-r from-brand-navy via-[#00307a] to-brand-navy px-4 py-3 text-center shadow-lg landscape:py-2 sm:rounded-2xl sm:py-3.5">
          <p
            className={`font-extrabold leading-snug tracking-wide text-white ${
              largeZh
                ? "text-[1.5rem] landscape:text-[1.35rem] sm:text-[1.8rem]"
                : "text-[1.35rem] landscape:text-[1.2rem] sm:text-[1.5rem]"
            }`}
          >
            {t.outcomesSummary.specialistBanner}
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-3 landscape:gap-2.5 sm:gap-4">
          <MetricCard
            title={t.outcomesSummary.vaTitle}
            value={`${VA_612_OR_BETTER_PERCENT}%`}
            caption={t.outcomesSummary.vaCaption}
            moreDetails={t.outcomesSummary.moreDetails}
            accent="teal"
            onClick={onOpenVa}
            largeZh={largeZh}
          />
          <MetricCard
            title={t.outcomesSummary.refractiveTitle}
            value={`${REFRACTIVE_WITHIN_1D_PERCENT}%`}
            caption={t.outcomesSummary.refractiveCaption}
            moreDetails={t.outcomesSummary.moreDetails}
            accent="navy"
            onClick={onOpenRefraction}
            largeZh={largeZh}
          />
          <MetricCard
            title={t.outcomesSummary.complicationsTitle}
            value={`${SURGERY_SUCCESS_NO_COMPLICATION_PERCENT}%`}
            caption={t.outcomesSummary.complicationsCaption}
            moreDetails={t.outcomesSummary.moreDetails}
            accent="green"
            onClick={onOpenComplications}
            largeZh={largeZh}
          />
        </div>

        <div className="shrink-0 overflow-hidden rounded-2xl border-2 border-rose-300/80 bg-gradient-to-br from-rose-50 via-white to-amber-50/40 p-3 shadow-md landscape:p-2.5 sm:p-4">
          <div className="mb-1 flex justify-end">
            <button
              type="button"
              onClick={onOpenProms}
              className="rounded-xl border border-brand-navy/25 bg-white px-3.5 py-1.5 text-[1.05rem] font-bold text-brand-navy shadow-sm hover:bg-slate-50 landscape:px-3 landscape:py-1 landscape:text-[0.95rem]"
            >
              {t.outcomesSummary.moreDetails} →
            </button>
          </div>
          <PromsHorizontalScale
            patientScore={patientScore}
            hideEndLabels
            compact
            emphasizeQolCopy
          />
        </div>
      </div>
    </OutcomePageShell>
  );
}
