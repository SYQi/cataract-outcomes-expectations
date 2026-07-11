"use client";

import { GradientSlider } from "@/components/GradientSlider";
import type { CatProm5Answers } from "@/lib/catProm5";
import { CAT_PROM5_QUESTIONS } from "@/lib/catProm5";

type CatProm5QuestionPageProps = {
  questionIndex: number;
  answers: CatProm5Answers;
  onAnswer: (questionId: keyof CatProm5Answers, value: number) => void;
  onRelease: () => void;
};

export function CatProm5QuestionPage({
  questionIndex,
  answers,
  onAnswer,
  onRelease,
}: CatProm5QuestionPageProps) {
  const q = CAT_PROM5_QUESTIONS[questionIndex];
  const letter = String.fromCharCode(65 + questionIndex);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
        Question {questionIndex + 1} of {CAT_PROM5_QUESTIONS.length}
      </p>
      <h2 className="mt-2 text-[1.35rem] font-semibold leading-snug text-brand-navy">
        {letter}) {q.label}
      </h2>
      <p className="mt-2 text-[1.05rem] text-slate-500">
        Slide the bar to indicate how your eyesight affects you today. Release to continue.
      </p>
      <p className="mt-1 text-[0.9rem] text-slate-500">
        {q.minLabel} → {q.maxLabel}
      </p>
      <div className="mt-6">
        <GradientSlider
          id={`cat-${q.id}`}
          value={answers[q.id]}
          min={q.min}
          max={q.max}
          onChange={(v) => onAnswer(q.id, v)}
          onRelease={onRelease}
          minCaption={`${q.min} — ${q.minLabel}`}
          maxCaption={`${q.max} — ${q.maxLabel}`}
        />
      </div>
    </section>
  );
}
