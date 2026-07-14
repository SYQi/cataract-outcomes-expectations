"use client";

import { useEffect, useState } from "react";
import { OutcomePageShell } from "@/components/OutcomePageShell";
import { SPECIALIST_CARE_FOOTNOTE } from "@/lib/messaging";
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
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShow(true), 180);
    return () => window.clearTimeout(t);
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
      eyebrow="Complications"
      headline={
        <>
          <span className="block">
            <span className="text-[1.15em] font-extrabold text-brand-teal">
              {SURGERY_SUCCESS_NO_COMPLICATION_PERCENT}%
            </span>{" "}
            success rate with no complications:
          </span>
          <span className="mt-1 block">
            <span className="text-[1.15em] font-extrabold text-brand-teal">Specialist Outcomes</span>
          </span>
        </>
      }
      onBack={onBack}
      onNext={onNext}
      nextLabel="Quality of life →"
    >
      <div className="flex flex-col gap-2 landscape:grid landscape:grid-cols-2 landscape:gap-3 sm:gap-3">
        <div
          className={`relative shrink-0 overflow-hidden rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-teal-50 p-3 shadow-sm landscape:flex landscape:flex-col landscape:justify-center sm:p-4 ${
            show ? "animate-scale-jump" : "opacity-0"
          }`}
        >
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.16em] text-teal-700 sm:text-xs">
            Specialist care · Woodlands Hospital
          </p>
          <p className="mt-1 text-center text-3xl font-black leading-none text-brand-navy landscape:text-4xl sm:text-4xl">
            {SURGERY_SUCCESS_NO_COMPLICATION_PERCENT}%
          </p>
          <p className="mt-1 text-center text-xs font-semibold text-slate-600 sm:text-sm">
            successful with no complications
          </p>
        </div>

        <div
          className={`relative shrink-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 ${
            show ? "animate-fade-up" : "opacity-0"
          }`}
          style={{ animationDelay: "0.35s" }}
        >
          <p className="text-center text-xs font-bold text-brand-navy sm:text-sm">
            Complication rate: Woodlands vs United Kingdom
          </p>
          <p className="mt-0.5 text-center text-[10px] text-slate-500 sm:text-[11px]">
            All-cause intraoperative complications — specialist outcomes at Woodlands Hospital
          </p>

          {/* Reserved top row for rate labels so they never overlap the titles above */}
          <div className="mx-auto mt-3 max-w-md">
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
                  <span className="sm:hidden">RCOphth (UK)</span>
                  <span className="hidden sm:inline">
                    Royal College of Ophthalmologists, United Kingdom
                  </span>
                </p>
              </div>
              <div className="w-[42%] px-0.5 text-center sm:w-[45%]">
                <p className="text-[10px] font-bold uppercase tracking-wide text-brand-navy sm:text-[11px]">
                  Woodlands
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 border-t border-slate-100 pt-3 text-center text-xs font-semibold leading-relaxed text-slate-700 landscape:mt-2 landscape:pt-2 sm:text-sm">
            <span className="block">
              Woodlands specialist rate:{" "}
              <strong className="text-brand-navy">{COMPLICATION_RATE_PERCENT}%</strong>
            </span>
            <span className="block">
              vs Royal College of Ophthalmologists (UK): {RCOPHTH_COMPLICATION_RATE_LOW_PERCENT}–
              {RCOPHTH_COMPLICATION_RATE_HIGH_PERCENT}%
            </span>
            <span className="block">
              About <strong className="text-teal-700">{ratioVsMid}%</strong> of the typical UK rate —{" "}
              <strong>nearly half</strong>
            </span>
          </p>
        </div>

        <div className="shrink-0 landscape:col-span-2">
          <p className="text-center text-[10px] leading-relaxed text-slate-400 sm:text-[11px]">
            {SPECIALIST_CARE_FOOTNOTE} · {COHORT_CASE_COUNT} cases · {REPORTING_WINDOW_LABEL}
          </p>
          <div className="mt-2 hidden border-t border-slate-200 pt-2 text-left text-[10px] leading-relaxed text-slate-500 landscape:pb-1 sm:block">
            <p className="font-semibold text-slate-600">
              Reference — Royal College of Ophthalmologists, United Kingdom (
              {RCOPHTH_COMPLICATION_RATE_LOW_PERCENT}–{RCOPHTH_COMPLICATION_RATE_HIGH_PERCENT}%)
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
