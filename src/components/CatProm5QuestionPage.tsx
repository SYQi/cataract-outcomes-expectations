"use client";

import { useEffect, useRef } from "react";
import { GradientSlider } from "@/components/GradientSlider";
import type { CatProm5Answers } from "@/lib/catProm5";
import { CAT_PROM5_QUESTIONS } from "@/lib/catProm5";
import { formatMessage, useMessages } from "@/lib/i18n";

type CatProm5QuestionPageProps = {
  /** Number of questions currently unlocked (1–5). */
  unlockedCount: number;
  answers: CatProm5Answers;
  onAnswer: (questionId: keyof CatProm5Answers, value: number) => void;
  /** Called when the user releases the slider on the newest unlocked question. */
  onFrontierRelease: () => void;
};

/** One question ≈ one viewport so neighbors are off-screen until the patient scrolls. */
const PANEL_HEIGHT = "min-h-[calc(100dvh-6.5rem)] landscape:min-h-[calc(100dvh-5.25rem)]";

export function CatProm5QuestionPage({
  unlockedCount,
  answers,
  onAnswer,
  onFrontierRelease,
}: CatProm5QuestionPageProps) {
  const t = useMessages();
  const questionRefs = useRef<(HTMLElement | null)[]>([]);
  const prevUnlocked = useRef(unlockedCount);

  useEffect(() => {
    if (unlockedCount > prevUnlocked.current) {
      const el = questionRefs.current[unlockedCount - 1];
      window.setTimeout(() => {
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 40);
    }
    prevUnlocked.current = unlockedCount;
  }, [unlockedCount]);

  return (
    <div className="flex flex-col">
      {CAT_PROM5_QUESTIONS.slice(0, unlockedCount).map((q, index) => {
        const letter = String.fromCharCode(65 + index);
        const isFrontier = index === unlockedCount - 1;
        const copy = t.catProm5[q.id];

        return (
          <section
            key={q.id}
            ref={(el) => {
              questionRefs.current[index] = el;
            }}
            className={`flex ${PANEL_HEIGHT} scroll-mt-2 flex-col items-center justify-start py-3`}
          >
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm landscape:p-6 sm:p-7">
              <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                {formatMessage(t.assessment.questionOf, {
                  n: index + 1,
                  total: CAT_PROM5_QUESTIONS.length,
                })}
              </p>
              <h2 className="mt-3 text-center text-[1.5rem] font-semibold leading-snug text-brand-navy sm:text-[1.62rem]">
                {letter}){" "}
                {copy.labelParts.map((part, i) =>
                  part.emphasize ? (
                    <span key={i} className="text-[1.1em] font-extrabold text-brand-teal">
                      {part.text}
                    </span>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )}
              </h2>
              <p className="mt-3 text-center text-[1.05rem] text-slate-500">
                {isFrontier ? t.assessment.frontierHint : t.assessment.adjustHint}
              </p>
              <p className="mt-1 text-center text-[0.9rem] text-slate-500">
                {copy.minLabel} → {copy.maxLabel}
              </p>
              <div className="mt-8">
                <GradientSlider
                  id={`cat-${q.id}`}
                  value={answers[q.id]}
                  min={q.min}
                  max={q.max}
                  onChange={(v) => onAnswer(q.id, v)}
                  onRelease={isFrontier ? onFrontierRelease : undefined}
                  minCaption={`${q.min} — ${copy.minLabel}`}
                  maxCaption={`${q.max} — ${copy.maxLabel}`}
                  valueCaption={formatMessage(t.assessment.selected, { value: answers[q.id] })}
                />
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
