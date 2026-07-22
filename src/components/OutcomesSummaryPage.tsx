"use client";

import { PromsHorizontalScale } from "@/components/PromsHorizontalScale";
import { OutcomePageShell } from "@/components/OutcomePageShell";
import { formatMessage, useLocale, useMessages } from "@/lib/i18n";
import {
  COHORT_CASE_COUNT,
  REFRACTIVE_WITHIN_1D_PERCENT,
  REPORTING_WINDOW_LABEL,
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
    teal: "border-teal-300 bg-gradient-to-br from-teal-50 to-white ring-teal-200/60",
    navy: "border-blue-300 bg-gradient-to-br from-blue-50 to-white ring-blue-200/60",
    green: "border-green-300 bg-gradient-to-br from-green-50 to-white ring-green-200/60",
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
      className={`group flex w-full flex-col rounded-2xl border-2 p-4 text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-4 ${accentClass}`}
    >
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500 sm:text-base">{title}</p>
      <p
        className={`mt-1 font-black leading-none ${valueClass} ${
          largeZh
            ? "text-[3.25rem] sm:text-[3.75rem]"
            : "text-[3rem] sm:text-[3.5rem]"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-base font-semibold leading-snug text-slate-700 sm:text-lg">{caption}</p>
      <p className="mt-3 text-sm font-bold text-brand-navy underline-offset-2 group-hover:underline">
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
      headline={t.outcomesSummary.headline}
      prominentHeadline
      alignContentTop
      onBack={onBack}
      onNext={onNext}
      nextLabel={t.outcomesSummary.nextLabel}
      backLabel={t.outcomesSummary.backLabel}
    >
      <div className="space-y-4 pb-2">
        <div className="rounded-2xl border-2 border-brand-navy/20 bg-brand-navy px-4 py-3 text-center shadow-md">
          <p
            className={`font-extrabold leading-snug text-white ${
              largeZh ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
            }`}
          >
            {t.outcomesSummary.specialistBanner}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
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

        <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500 sm:text-base">
                {t.outcomesSummary.promsTitle}
              </p>
              <p className="mt-1 text-base font-semibold text-slate-700 sm:text-lg">
                {t.outcomesSummary.promsCaption}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenProms}
              className="shrink-0 rounded-xl border border-brand-navy/20 bg-white px-3 py-2 text-sm font-bold text-brand-navy shadow-sm hover:bg-slate-50"
            >
              {t.outcomesSummary.moreDetails} →
            </button>
          </div>
          <div className="mt-2">
            <PromsHorizontalScale patientScore={patientScore} />
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          {t.messaging.specialistCareFootnote} ·{" "}
          {formatMessage(t.common.cases, { count: COHORT_CASE_COUNT })} · {REPORTING_WINDOW_LABEL}
        </p>
      </div>
    </OutcomePageShell>
  );
}
