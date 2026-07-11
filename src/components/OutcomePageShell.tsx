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
};

export function OutcomePageShell({
  eyebrow,
  headline,
  children,
  onBack,
  onNext,
  nextLabel = "Next",
  backLabel = "Back",
}: OutcomePageShellProps) {
  const [showHeadline, setShowHeadline] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShowHeadline(true), 60);
    return () => window.clearTimeout(t);
  }, [headline]);

  return (
    <section className="flex flex-col sm:h-[calc(100dvh-6.5rem)] sm:max-h-[780px]">
      <div className="mb-2 shrink-0 text-center sm:mb-3">
        {eyebrow ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-teal sm:text-xs">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={`${eyebrow ? "mt-2" : ""} text-balance text-lg font-extrabold leading-snug text-brand-navy sm:text-2xl ${
            showHeadline ? "animate-scale-jump" : "opacity-0"
          }`}
        >
          {headline}
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto sm:overflow-visible">{children}</div>

      <div className="mt-3 flex shrink-0 gap-2 sm:mt-4 sm:gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {backLabel}
          </button>
        )}
        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="flex-[1.4] rounded-xl bg-brand-navy px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-navy/90"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </section>
  );
}
