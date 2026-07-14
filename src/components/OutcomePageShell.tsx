"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

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
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setShowHeadline(true), 60);
    return () => window.clearTimeout(t);
  }, [headline]);

  useEffect(() => {
    if (contentScrollRef.current) contentScrollRef.current.scrollTop = 0;
  }, [headline]);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="mb-1.5 shrink-0 text-center landscape:mb-0.5 sm:mb-2">
        {eyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-teal landscape:text-[8px] sm:text-xs">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={`${eyebrow ? "mt-1 landscape:mt-0" : ""} text-balance font-extrabold leading-snug text-brand-navy landscape:leading-tight ${
            prominentHeadline
              ? "text-[1.4625rem] landscape:text-[1.05rem] sm:text-[1.625rem] landscape:sm:text-[1.15rem]"
              : "text-lg landscape:text-[0.95rem] sm:text-xl landscape:sm:text-base"
          } ${showHeadline ? "animate-scale-jump" : "opacity-0"}`}
        >
          {headline}
        </h2>
      </div>

      <div
        ref={contentScrollRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
      >
        <div className="my-auto w-full py-1 landscape:my-0 landscape:py-0">{children}</div>
      </div>

      <div className="z-20 mt-1 flex shrink-0 gap-2 border-t border-slate-200/80 bg-[var(--background)]/95 pt-1.5 backdrop-blur-sm landscape:mt-0.5 landscape:pt-1 sm:mt-2 sm:gap-3 sm:pt-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 landscape:py-1.5 landscape:text-xs"
          >
            {backLabel}
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="flex-[1.4] rounded-xl bg-brand-navy px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90 landscape:py-1.5 landscape:text-xs"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </section>
  );
}
