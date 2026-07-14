"use client";

import { useEffect, useState, type ReactNode } from "react";

type OutcomePageShellProps = {
  eyebrow?: string;
  headline: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  /** Fit content to the viewport without inner scrolling (e.g. Visual Acuity). */
  fitViewport?: boolean;
};

export function OutcomePageShell({
  eyebrow,
  headline,
  children,
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
  fitViewport = false,
}: OutcomePageShellProps) {
  const [showHeadline, setShowHeadline] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShowHeadline(true), 60);
    return () => window.clearTimeout(t);
  }, [headline]);

  return (
    <section
      className={`flex min-h-0 flex-col landscape:h-[calc(100dvh-4.75rem)] sm:h-[calc(100dvh-6.5rem)] sm:max-h-[780px] landscape:max-h-none ${
        fitViewport ? "overflow-hidden" : ""
      }`}
    >
      <div className="mb-1.5 shrink-0 text-center landscape:mb-1 sm:mb-2">
        {eyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-teal landscape:text-[9px] sm:text-xs">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={`${eyebrow ? "mt-1 landscape:mt-0.5" : ""} text-balance text-lg font-extrabold leading-snug text-brand-navy landscape:text-base sm:text-xl landscape:sm:text-lg ${
            showHeadline ? "animate-scale-jump" : "opacity-0"
          }`}
        >
          {headline}
        </h2>
      </div>

      <div
        className={`min-h-0 flex-1 pr-0.5 ${
          fitViewport ? "flex flex-col overflow-hidden" : "overflow-y-auto overscroll-contain"
        }`}
      >
        {children}
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
