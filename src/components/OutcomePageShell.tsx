"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
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
};

export function OutcomePageShell({
  eyebrow,
  headline,
  children,
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  prominentHeadline = false,
  alignContentTop = false,
  compactHeadline = false,
}: OutcomePageShellProps) {
  const [showHeadline, setShowHeadline] = useState(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setShowHeadline(true), 60);
    return () => window.clearTimeout(t);
  }, [headline]);

  useLayoutEffect(() => {
    if (!alignContentTop) return;
    resetPageScrollAfterPaint(contentScrollRef.current);
  }, [alignContentTop, headline]);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div
        className={`shrink-0 text-center ${
          compactHeadline ? "mb-0.5 landscape:mb-0 sm:mb-1" : "mb-1.5 landscape:mb-1 sm:mb-2"
        }`}
      >
        {eyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-teal landscape:text-[9px] sm:text-xs">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={`${eyebrow ? "mt-1 landscape:mt-0.5" : ""} text-balance font-extrabold leading-snug text-brand-navy ${
            prominentHeadline
              ? "text-[1.4625rem] landscape:text-[1.35rem] sm:text-[1.625rem] landscape:sm:text-[1.4625rem]"
              : "text-lg landscape:text-base sm:text-xl landscape:sm:text-lg"
          } ${showHeadline ? "animate-scale-jump" : "opacity-0"}`}
        >
          {headline}
        </h2>
      </div>

      {/* Default: center when content fits. alignContentTop: pin to top so page chrome stays in view. */}
      <div
        ref={contentScrollRef}
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain ${
          alignContentTop ? "justify-start" : "justify-center"
        }`}
      >
        <div className={`w-full ${compactHeadline ? "py-0" : "py-1"} ${alignContentTop ? "" : "my-auto"}`}>
          {children}
        </div>
      </div>

      <div className="z-20 mt-1.5 flex shrink-0 gap-2 border-t border-slate-200/80 bg-[var(--background)]/95 pt-2 backdrop-blur-sm landscape:mt-1 sm:mt-2 sm:gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 landscape:py-2"
          >
            {backLabel}
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="flex-[1.4] rounded-xl bg-brand-navy px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90 landscape:py-2"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </section>
  );
}
