"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useLocale, useMessages } from "@/lib/i18n";
import { resetPageScrollAfterPaint } from "@/lib/scrollReset";

type OutcomePageShellProps = {
  eyebrow?: string;
  headline: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  /** +30% headline size for key outcome toplines. */
  prominentHeadline?: boolean;
  /** Pin content to the top instead of vertically centering when space allows. */
  alignContentTop?: boolean;
  /** Reduce space between headline and content (care team page). */
  compactHeadline?: boolean;
  /** Prevent inner scroll; content must fit the remaining viewport height. */
  fitViewport?: boolean;
  /** Extra top margin before the headline (care team page). */
  headlineSpaced?: boolean;
  /** +20% on top of prominent headline sizing (outcomes overview). */
  summaryHeadlineBoost?: boolean;
};

export function OutcomePageShell({
  eyebrow,
  headline,
  children,
  onBack,
  onNext,
  nextLabel,
  backLabel,
  prominentHeadline = false,
  alignContentTop = false,
  compactHeadline = false,
  fitViewport = false,
  headlineSpaced = false,
  summaryHeadlineBoost = false,
}: OutcomePageShellProps) {
  const t = useMessages();
  const { locale } = useLocale();
  const zhTitle = locale === "zh-CN";
  const resolvedNext = nextLabel ?? t.common.next;
  const resolvedBack = backLabel ?? t.common.back;
  const [showHeadline, setShowHeadline] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHeadline(true), 60);
    return () => window.clearTimeout(timer);
  }, [headline]);

  useLayoutEffect(() => {
    if (!alignContentTop) return;
    resetPageScrollAfterPaint(contentScrollRef.current);
  }, [alignContentTop, headline]);

  const headlineSize = prominentHeadline
    ? summaryHeadlineBoost
      ? zhTitle
        ? "text-[2.737rem] landscape:text-[2.527rem] sm:text-[3.042rem] landscape:sm:text-[2.737rem]"
        : "text-[2.281rem] landscape:text-[2.106rem] sm:text-[2.535rem] landscape:sm:text-[2.281rem]"
      : zhTitle
        ? "text-[2.281rem] landscape:text-[2.106rem] sm:text-[2.535rem] landscape:sm:text-[2.281rem]"
        : "text-[1.901rem] landscape:text-[1.755rem] sm:text-[2.1125rem] landscape:sm:text-[1.901rem]"
    : zhTitle
      ? "text-[1.35rem] landscape:text-[1.2rem] sm:text-[1.5rem] landscape:sm:text-[1.35rem]"
      : "text-lg landscape:text-base sm:text-xl landscape:sm:text-lg";

  const eyebrowSize = summaryHeadlineBoost
    ? "text-[12px] landscape:text-[11px] sm:text-[14.4px]"
    : "text-[10px] landscape:text-[9px] sm:text-xs";

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div
        className={`shrink-0 text-center ${
          headlineSpaced ? "mt-10 landscape:mt-8 sm:mt-14" : ""
        } ${
          compactHeadline ? "mb-0.5 landscape:mb-0 sm:mb-1" : "mb-1.5 landscape:mb-1 sm:mb-2"
        }`}
      >
        {eyebrow ? (
          <p className={`font-semibold uppercase tracking-[0.18em] text-brand-teal ${eyebrowSize}`}>
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={`${eyebrow ? "mt-1 landscape:mt-0.5" : ""} text-balance font-extrabold leading-snug text-brand-navy ${headlineSize} ${
            showHeadline ? "animate-scale-jump" : "opacity-0"
          }`}
        >
          {headline}
        </h2>
      </div>

      {/* Default: center when content fits. alignContentTop: pin to top so page chrome stays in view. */}
      <div
        ref={contentScrollRef}
        className={`flex min-h-0 flex-1 flex-col ${
          fitViewport ? "overflow-hidden" : "overflow-y-auto overscroll-contain"
        } ${alignContentTop ? "justify-start" : "justify-center"}`}
      >
        <div
          className={`w-full ${compactHeadline ? "py-0" : "py-1"} ${
            fitViewport ? "flex min-h-0 flex-1 flex-col" : ""
          } ${alignContentTop ? "" : "my-auto"}`}
        >
          {children}
        </div>
      </div>

      <div
        className={`z-20 flex shrink-0 gap-2 border-t border-slate-200/80 bg-[var(--background)]/95 pt-2 backdrop-blur-sm sm:gap-3 ${
          fitViewport ? "mt-1 landscape:mt-0.5 landscape:pt-1.5" : "mt-1.5 landscape:mt-1 sm:mt-2"
        }`}
      >
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 landscape:py-2"
          >
            {resolvedBack}
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="flex-[1.4] rounded-xl bg-brand-navy px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90 landscape:py-2"
          >
            {resolvedNext}
          </button>
        )}
      </div>
    </section>
  );
}
