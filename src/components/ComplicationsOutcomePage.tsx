"use client";

import { useEffect, useState } from "react";
import { OutcomePageShell } from "@/components/OutcomePageShell";
import { formatMessage, useMessages } from "@/lib/i18n";
import {
  COHORT_CASE_COUNT,
  COMPLICATION_RATE_PERCENT,
  RCOPHTH_COMPLICATION_RATE_HIGH_PERCENT,
  RCOPHTH_COMPLICATION_RATE_LOW_PERCENT,
  REPORTING_WINDOW_LABEL,
  SURGERY_SUCCESS_NO_COMPLICATION_PERCENT,
} from "@/lib/whOutcomes";

type ComplicationsOutcomePageProps = {
  onBack: () => void;
  onNext: () => void;
};

export function ComplicationsOutcomePage({ onBack, onNext }: ComplicationsOutcomePageProps) {
  const t = useMessages();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShow(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  const rcoMid =
    (RCOPHTH_COMPLICATION_RATE_LOW_PERCENT + RCOPHTH_COMPLICATION_RATE_HIGH_PERCENT) / 2;
  const barMax = RCOPHTH_COMPLICATION_RATE_HIGH_PERCENT;
  const whHeightPct = Math.max(8, (COMPLICATION_RATE_PERCENT / barMax) * 100);
  const rcoLowHeightPct = (RCOPHTH_COMPLICATION_RATE_LOW_PERCENT / barMax) * 100;
  const ratioVsMid = Math.round((COMPLICATION_RATE_PERCENT / rcoMid) * 100);

  return (
    <OutcomePageShell
      prominentHeadline
      eyebrow={t.complications.eyebrow}
      headline={
        <>
          <span className="block">
            <span className="text-[1.15em] font-extrabold text-brand-teal">
              {SURGERY_SUCCESS_NO_COMPLICATION_PERCENT}%
            </span>{" "}
            {t.complications.headlineSuccessSuffix}
          </span>
          <span className="mt-1 block">
            <span className="text-[1.15em] font-extrabold text-brand-teal">
              {t.complications.headlineSpecialistOutcomes}
            </span>
          </span>
        </>
      }
      onBack={onBack}
      onNext={onNext}
      nextLabel={t.complications.nextLabel}
    >
      <div className="flex flex-col gap-2 landscape:grid landscape:grid-cols-2 landscape:gap-3 sm:gap-3">
        <div
          className={`relative shrink-0 overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-teal-50 p-3 shadow-sm landscape:flex landscape:flex-col landscape:justify-center sm:p-4 ${
            show ? "animate-scale-jump" : "opacity-0"
          }`}
        >
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700 sm:text-xs">
            {t.complications.careBadge}
          </p>
          <p className="mt-1 text-center text-3xl font-black leading-none text-brand-navy landscape:text-4xl sm:text-4xl">
            {SURGERY_SUCCESS_NO_COMPLICATION_PERCENT}%
          </p>
          <p className="mt-1 text-center text-xs font-semibold text-slate-600 sm:text-sm">
            {t.complications.successfulNoComplications}
          </p>
        </div>

        <div
          className={`relative shrink-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 ${
            show ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.35s" }}
        >
          <p className="text-center text-xs font-bold text-brand-navy sm:text-sm">
            {t.complications.compareTitle}
          </p>
          <p className="mt-1.5 text-center text-[11px] leading-relaxed text-slate-500 sm:mt-2 sm:text-xs">
            {t.complications.compareSubtitle}
          </p>

          <div className="mx-auto mt-5 max-w-md pb-1 sm:mt-6">
            <div className="flex justify-center gap-4 sm:gap-6">
              <div className="relative h-24 w-[42%] landscape:h-28 sm:h-36 landscape:sm:h-28 sm:w-[45%]">
                <p className="absolute inset-x-0 top-0 z-10 -translate-y-full pb-1 text-center text-[10px] font-semibold leading-none text-amber-800 sm:text-xs">
                  {RCOPHTH_COMPLICATION_RATE_LOW_PERCENT}–{RCOPHTH_COMPLICATION_RATE_HIGH_PERCENT}%
                </p>
                <div className="absolute inset-x-0 bottom-0 h-full rounded-t-xl bg-gradient-to-t from-amber-500 to-amber-300 shadow-inner" />
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-xl border-t-2 border-dashed border-amber-700/50 bg-amber-400/40"
                  style={{ height: `${rcoLowHeightPct}%` }}
                />
              </div>

              <div className="relative h-24 w-[42%] landscape:h-28 sm:h-36 landscape:sm:h-28 sm:w-[45%]">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-t-xl bg-gradient-to-t from-brand-navy to-teal-500 shadow-lg ring-2 ring-teal-300/60"
                  style={{ height: `${whHeightPct}%` }}
                >
                  <p className="absolute inset-x-0 top-0 z-10 -translate-y-full pb-1 text-center text-[10px] font-bold leading-none text-brand-navy sm:text-xs">
                    {COMPLICATION_RATE_PERCENT}%
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-center gap-4 sm:gap-6">
              <div className="w-[42%] px-0.5 text-center sm:w-[45%]">
                <p className="text-[10px] font-bold leading-snug text-amber-900 sm:text-[11px]">
                  <span className="sm:hidden">{t.complications.labelRcoShort}</span>
                  <span className="hidden sm:inline">{t.complications.labelRcoLong}</span>
                </p>
              </div>
              <div className="w-[42%] px-0.5 text-center sm:w-[45%]">
                <p className="text-[10px] font-bold uppercase tracking-wide text-brand-navy sm:text-[11px]">
                  {t.complications.labelWoodlands}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 border-t border-slate-100 pt-3 text-center text-xs font-semibold leading-relaxed text-slate-700 landscape:mt-2 landscape:pt-2 sm:text-sm">
            <span className="block">
              {t.complications.summaryWhRate}{" "}
              <strong className="text-brand-navy">{COMPLICATION_RATE_PERCENT}%</strong>
            </span>
            <span className="block">
              {formatMessage(t.complications.summaryVsRco, {
                low: RCOPHTH_COMPLICATION_RATE_LOW_PERCENT,
                high: RCOPHTH_COMPLICATION_RATE_HIGH_PERCENT,
              })}
            </span>
            <span className="block">
              {formatMessage(t.complications.summaryRatio, { ratio: ratioVsMid })}{" "}
              <strong>{t.complications.nearlyHalf}</strong>
            </span>
          </p>
        </div>

        <div className="shrink-0 landscape:col-span-2">
          <p className="text-center text-[10px] leading-relaxed text-slate-400 sm:text-[11px]">
            {t.messaging.specialistCareFootnote} ·{" "}
            {formatMessage(t.common.cases, { count: COHORT_CASE_COUNT })} · {REPORTING_WINDOW_LABEL}
          </p>
          <div className="mt-2 hidden border-t border-slate-200 pt-2 text-left text-[10px] leading-relaxed text-slate-500 landscape:pb-1 sm:block">
            <p className="font-semibold text-slate-600">
              {formatMessage(t.complications.referenceTitle, {
                low: RCOPHTH_COMPLICATION_RATE_LOW_PERCENT,
                high: RCOPHTH_COMPLICATION_RATE_HIGH_PERCENT,
              })}
            </p>
            <p>
              Day, A. C., Norridge, C. F. E., Donachie, P. H. J., Barnes, B. &amp; Sparrow, J. M. Royal
              College of Ophthalmologists&apos; National Ophthalmology Database study of cataract
              surgery: report 8.
            </p>
            <p>BMJ Open 12, e053560 (2022). PubMed: 35985773.</p>
          </div>
        </div>
      </div>
    </OutcomePageShell>
  );
}
