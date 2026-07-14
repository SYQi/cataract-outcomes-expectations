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
  /** +30% headline size for key outcome toplines. */
  prominentHeadline?: boolean;
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
}: OutcomePageShellProps) {
  const [showHeadline, setShowHeadline] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShowHeadline(true), 60);
    return () => window.clearTimeout(t);
  }, [headline]);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="mb-1.5 shrink-0 text-center landscape:mb-1 sm:mb-2">
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

      {/* my-auto: vertically centers when content fits; scrolls when it overflows */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
        <div className="my-auto w-full py-1">{children}</div>
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
