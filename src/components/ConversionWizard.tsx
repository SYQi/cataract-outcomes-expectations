"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ComplicationsOutcomePage } from "@/components/ComplicationsOutcomePage";
import { GradientSlider } from "@/components/GradientSlider";
import { NewPatientPasswordGate } from "@/components/NewPatientPasswordGate";
import { PromsOutcomePage } from "@/components/PromsOutcomePage";
import { RefractiveOutcomePage } from "@/components/RefractiveOutcomePage";
import { VaOutcomePage } from "@/components/VaOutcomePage";
import { WhLogo } from "@/components/WhLogo";
import {
  CAT_PROM5_QUESTIONS,
  computeCatProm5Score100,
  DEFAULT_CAT_PROM5_ANSWERS,
  type CatProm5Answers,
} from "@/lib/catProm5";
import { formatGmt8Timestamp } from "@/lib/datetime";
import { useOutcomeSwipe } from "@/hooks/useOutcomeSwipe";
import { useSessionTracker } from "@/hooks/useSessionTracker";
import type { TrackedPage } from "@/lib/sessionAnalytics";
import { VA_OPTIONS, type VisualAcuity } from "@/lib/va";

type Step = "details" | "assessment" | "va" | "refraction" | "complications" | "proms";

const OUTCOME_STEPS: Step[] = ["va", "refraction", "complications", "proms"];

type PatientDetails = {
  name: string;
  nric: string;
  dateTime: string;
};

export function ConversionWizard() {
  const [step, setStep] = useState<Step>("details");
  const [patient, setPatient] = useState<PatientDetails>({
    name: "",
    nric: "",
    dateTime: "",
  });
  const [answers, setAnswers] = useState<CatProm5Answers>(DEFAULT_CAT_PROM5_ANSWERS);
  const [visualAcuity, setVisualAcuity] = useState<VisualAcuity>("6/24");
  const [vaSliderIndex, setVaSliderIndex] = useState(4);
  const [showNewPatientGate, setShowNewPatientGate] = useState(false);

  useEffect(() => {
    setPatient((p) => ({ ...p, dateTime: formatGmt8Timestamp() }));
  }, []);

  const scores = useMemo(() => computeCatProm5Score100(answers), [answers]);
  const step1Valid = patient.name.trim().length > 0 && patient.nric.trim().length > 0;
  const isOutcome = OUTCOME_STEPS.includes(step);

  const { finalizeAndReset } = useSessionTracker({
    step: step as TrackedPage,
    patientName: patient.name,
    nric: patient.nric,
    formDateTime: patient.dateTime,
    catProm5Score: step === "details" ? null : scores.score100,
    visualAcuity: step === "details" || step === "assessment" ? null : visualAcuity,
  });

  const handleVaChange = (index: number) => {
    const clamped = Math.max(0, Math.min(VA_OPTIONS.length - 1, index));
    setVaSliderIndex(clamped);
    setVisualAcuity(VA_OPTIONS[clamped]);
  };

  const resetPatient = async () => {
    await finalizeAndReset();
    setStep("details");
    setPatient({ name: "", nric: "", dateTime: formatGmt8Timestamp() });
    setAnswers(DEFAULT_CAT_PROM5_ANSWERS);
    setVisualAcuity("6/24");
    setVaSliderIndex(4);
    setShowNewPatientGate(false);
  };

  const outcomeIndex = OUTCOME_STEPS.indexOf(step);

  const onSwipeLeft = useCallback(() => {
    if (step === "va") setStep("refraction");
    else if (step === "refraction") setStep("complications");
    else if (step === "complications") setStep("proms");
  }, [step]);

  const onSwipeRight = useCallback(() => {
    if (step === "va") setStep("assessment");
    else if (step === "refraction") setStep("va");
    else if (step === "complications") setStep("refraction");
    else if (step === "proms") setStep("complications");
  }, [step]);

  const { active: swipeNavActive, onTouchStart, onTouchEnd } = useOutcomeSwipe({
    enabled: isOutcome,
    onSwipeLeft,
    onSwipeRight,
  });

  return (
    <div
      className={`mx-auto min-h-screen px-4 py-6 sm:px-6 sm:py-8 ${
        isOutcome ? "max-w-5xl" : "max-w-2xl"
      }`}
    >
      <header className={`text-center ${isOutcome ? "mb-3" : "mb-8"}`}>
        {step === "details" && (
          <>
            <div className="mb-4 flex justify-center">
              <WhLogo size="lg" />
            </div>
            <h1 className="mt-1 text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">
              <span className="block">Cataract Surgery:</span>
              <span className="mt-1 block">Outcomes and Expectations</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              See how your vision and quality of life may improve after cataract surgery.
            </p>
          </>
        )}
        {step !== "details" && !isOutcome && (
          <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Assessment</h1>
        )}
        <div className={`flex justify-center gap-1.5 sm:gap-2 ${step === "details" ? "mt-3 sm:mt-4" : "mt-1"}`}>
          {(["details", "assessment", ...OUTCOME_STEPS] as Step[]).map((s) => {
            const active =
              s === step ||
              (isOutcome && OUTCOME_STEPS.includes(s) && OUTCOME_STEPS.indexOf(s) <= outcomeIndex) ||
              (step === "assessment" && s === "details") ||
              (isOutcome && (s === "details" || s === "assessment"));
            return (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all sm:h-2 ${
                  active ? "w-8 bg-brand-navy sm:w-10" : "w-5 bg-slate-200 sm:w-6"
                }`}
                title={s}
              />
            );
          })}
        </div>
        {isOutcome && (
          <>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {outcomeIndex + 1} of {OUTCOME_STEPS.length} ·{" "}
              {step === "va"
                ? "Visual acuity"
                : step === "refraction"
                  ? "Refractive accuracy"
                  : step === "complications"
                    ? "Complications"
                    : "PROMS"}
            </p>
            {swipeNavActive && (
              <p className="mt-1 text-[10px] text-slate-400">Swipe left or right between outcome pages</p>
            )}
          </>
        )}
      </header>

      {step === "details" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Patient details</h2>
          <p className="mt-1 text-sm text-slate-500">
            Please enter your details to begin the assessment.
          </p>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Full name</span>
              <input
                type="text"
                value={patient.name}
                onChange={(e) => setPatient((p) => ({ ...p, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                placeholder="Enter patient name"
                autoComplete="name"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">NRIC</span>
              <input
                type="text"
                value={patient.nric}
                onChange={(e) => setPatient((p) => ({ ...p, nric: e.target.value.toUpperCase() }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-3 text-base uppercase focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
                placeholder="e.g. S1234567A"
                autoComplete="off"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Date &amp; time (GMT+8)</span>
              <input
                type="text"
                readOnly
                value={patient.dateTime}
                className="mt-1 w-full cursor-default rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-600"
              />
            </label>
          </div>

          <button
            type="button"
            disabled={!step1Valid}
            onClick={() => setStep("assessment")}
            className="mt-8 w-full rounded-xl bg-brand-navy px-6 py-4 text-base font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue to assessment
          </button>
        </section>
      )}

      {step === "assessment" && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="text-[1.35rem] font-semibold text-brand-navy">CAT-PROM5 questionnaire</h2>
            <p className="mt-1 text-[1.05rem] text-slate-500">
              Slide each bar to indicate how your eyesight affects you today. Green = no
              impairment; red = worst impairment.
            </p>
          </div>

          {CAT_PROM5_QUESTIONS.map((q, i) => (
            <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-[1.05rem] font-medium text-brand-navy">
                {String.fromCharCode(65 + i)}) {q.label}
              </p>
              <p className="mt-1 text-[0.9rem] text-slate-500">
                {q.minLabel} → {q.maxLabel}
              </p>
              <div className="mt-4">
                <GradientSlider
                  id={`cat-${q.id}`}
                  value={answers[q.id]}
                  min={q.min}
                  max={q.max}
                  onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
                  minCaption={`${q.min} — ${q.minLabel}`}
                  maxCaption={`${q.max} — ${q.maxLabel}`}
                />
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="text-[1.35rem] font-semibold text-brand-navy">Current visual acuity</h3>
            <p className="mt-1 text-[1.05rem] text-slate-500">
              Select your current vision in the affected eye (with glasses if worn).
            </p>
            <div className="mt-4">
              <GradientSlider
                id="va-slider"
                value={vaSliderIndex}
                min={0}
                max={VA_OPTIONS.length - 1}
                onChange={handleVaChange}
                minCaption="6/9 — best"
                maxCaption="Worse than 6/60"
                hideValue
              />
            </div>
            <p className="mt-3 text-center text-[1.5rem] font-bold text-brand-navy">{visualAcuity}</p>
            <div className="mt-2 grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:justify-center">
              {VA_OPTIONS.map((va, i) => (
                <button
                  key={va}
                  type="button"
                  onClick={() => handleVaChange(i)}
                  className={`rounded-full px-2 py-1 text-[0.9rem] ${
                    i === vaSliderIndex
                      ? "bg-brand-navy text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {va}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-slate-100 px-4 py-3">
            <div className="flex flex-col gap-1 text-center text-[1.05rem] text-slate-600 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-3">
              <span>
                Raw score: <strong>{scores.raw}</strong>
              </span>
              <span className="hidden sm:inline">·</span>
              <span>
                Logit: <strong>{scores.logit}</strong>
              </span>
              <span className="hidden sm:inline">·</span>
              <span>
                CAT-PROM5 (0–100): <strong>{scores.score100}</strong>
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("details")}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-6 py-4 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep("va")}
              className="flex-[2] rounded-xl bg-brand-navy px-6 py-4 font-semibold text-white hover:bg-brand-navy/90"
            >
              View projected outcomes
            </button>
          </div>
        </section>
      )}

      {isOutcome && (
        <div className="touch-pan-y" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {step === "va" && (
            <VaOutcomePage
              visualAcuity={visualAcuity}
              onBack={() => setStep("assessment")}
              onNext={() => setStep("refraction")}
            />
          )}

          {step === "refraction" && (
            <RefractiveOutcomePage
              onBack={() => setStep("va")}
              onNext={() => setStep("complications")}
            />
          )}

          {step === "complications" && (
            <ComplicationsOutcomePage
              onBack={() => setStep("refraction")}
              onNext={() => setStep("proms")}
            />
          )}

          {step === "proms" && (
            <PromsOutcomePage
              patientScore={scores.score100}
              onBack={() => setStep("complications")}
              onNewPatient={() => setShowNewPatientGate(true)}
            />
          )}
        </div>
      )}

      <NewPatientPasswordGate
        open={showNewPatientGate}
        onCancel={() => setShowNewPatientGate(false)}
        onSuccess={resetPatient}
      />
    </div>
  );
}
