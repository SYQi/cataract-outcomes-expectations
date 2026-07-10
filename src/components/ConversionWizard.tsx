"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import { CareTeamPage } from "@/components/CareTeamPage";
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
import { EMPTY_PATIENT_INTAKE, type PatientIntake } from "@/lib/patientRegistry";
import { useOutcomeSwipe } from "@/hooks/useOutcomeSwipe";
import { useSessionTracker } from "@/hooks/useSessionTracker";
import type { TrackedPage } from "@/lib/sessionAnalytics";
import { VA_OPTIONS, type VisualAcuity } from "@/lib/va";

type Step =
  | "admin"
  | "details"
  | "assessment"
  | "va"
  | "refraction"
  | "complications"
  | "care-team"
  | "proms";

const OUTCOME_STEPS: Step[] = ["va", "refraction", "complications", "proms", "care-team"];

const PROGRESS_STEPS: Step[] = ["admin", "details", "assessment", ...OUTCOME_STEPS];

export function ConversionWizard() {
  const [step, setStep] = useState<Step>("admin");
  const [patient, setPatient] = useState<PatientIntake>({
    ...EMPTY_PATIENT_INTAKE,
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
  const verifyValid =
    patient.name.trim().length > 0 &&
    patient.nric.trim().length > 0 &&
    patient.insurer !== "" &&
    patient.consultant !== "";
  const isOutcome = OUTCOME_STEPS.includes(step);

  const { finalizeAndReset } = useSessionTracker({
    step: step as TrackedPage,
    patientName: patient.name,
    nric: patient.nric,
    formDateTime: patient.dateTime,
    insurer: patient.insurer,
    consultant: patient.consultant,
    catProm5Score: step === "admin" || step === "details" ? null : scores.score100,
    visualAcuity:
      step === "admin" || step === "details" || step === "assessment" ? null : visualAcuity,
  });

  const handleVaChange = (index: number) => {
    const clamped = Math.max(0, Math.min(VA_OPTIONS.length - 1, index));
    setVaSliderIndex(clamped);
    setVisualAcuity(VA_OPTIONS[clamped]);
  };

  const resetPatient = async () => {
    await finalizeAndReset();
    setStep("admin");
    setPatient({ ...EMPTY_PATIENT_INTAKE, dateTime: formatGmt8Timestamp() });
    setAnswers(DEFAULT_CAT_PROM5_ANSWERS);
    setVisualAcuity("6/24");
    setVaSliderIndex(4);
    setShowNewPatientGate(false);
  };

  const outcomeIndex = OUTCOME_STEPS.indexOf(step);
  const progressIndex = PROGRESS_STEPS.indexOf(step);

  const onSwipeLeft = useCallback(() => {
    if (step === "va") setStep("refraction");
    else if (step === "refraction") setStep("complications");
    else if (step === "complications") setStep("proms");
    else if (step === "proms") setStep("care-team");
  }, [step]);

  const onSwipeRight = useCallback(() => {
    if (step === "va") setStep("assessment");
    else if (step === "refraction") setStep("va");
    else if (step === "complications") setStep("refraction");
    else if (step === "proms") setStep("complications");
    else if (step === "care-team") setStep("proms");
  }, [step]);

  const { active: swipeNavActive, onTouchStart, onTouchEnd } = useOutcomeSwipe({
    enabled: isOutcome,
    onSwipeLeft,
    onSwipeRight,
  });

  const outcomeLabel =
    step === "va"
      ? "Visual acuity"
      : step === "refraction"
        ? "Refractive accuracy"
        : step === "complications"
          ? "Complications"
          : step === "proms"
            ? "PROMS"
            : "Your care team";

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
              Please verify your details before starting the assessment.
            </p>
          </>
        )}
        {step === "admin" && (
          <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Staff intake</h1>
        )}
        {step === "assessment" && (
          <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Assessment</h1>
        )}
        {step !== "admin" && (
          <div
            className={`flex justify-center gap-1 sm:gap-1.5 ${step === "details" ? "mt-3 sm:mt-4" : "mt-1"}`}
          >
            {PROGRESS_STEPS.map((s) => {
              const active = PROGRESS_STEPS.indexOf(s) <= progressIndex;
              return (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all sm:h-2 ${
                    active ? "w-6 bg-brand-navy sm:w-8" : "w-3 bg-slate-200 sm:w-4"
                  }`}
                  title={s}
                />
              );
            })}
          </div>
        )}
        {isOutcome && (
          <>
            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {outcomeIndex + 1} of {OUTCOME_STEPS.length} · {outcomeLabel}
            </p>
            {swipeNavActive && (
              <p className="mt-1 text-[10px] text-slate-400">Swipe left or right between outcome pages</p>
            )}
          </>
        )}
      </header>

      {step === "admin" && (
        <AdminPage
          patient={patient}
          onChange={setPatient}
          onContinue={() => setStep("details")}
        />
      )}

      {step === "details" && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold text-brand-navy">Verify your details</h2>
          <p className="mt-1 text-sm text-slate-500">
            These were entered by staff. Please confirm they are correct before continuing.
          </p>

          <div className="mt-6 space-y-5">
            {[
              { label: "Full name", value: patient.name },
              { label: "NRIC", value: patient.nric },
              { label: "Insurer", value: patient.insurer },
              { label: "Specialist consultant", value: patient.consultant },
              { label: "Date & time (GMT+8)", value: patient.dateTime },
            ].map((field) => (
              <div key={field.label} className="block">
                <span className="text-sm font-medium text-slate-700">{field.label}</span>
                <div className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800">
                  {field.value || "—"}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={() => setStep("admin")}
              className="flex-1 rounded-xl border border-slate-300 bg-white px-6 py-4 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to staff
            </button>
            <button
              type="button"
              disabled={!verifyValid}
              onClick={() => setStep("assessment")}
              className="flex-[2] rounded-xl bg-brand-navy px-6 py-4 text-base font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Confirm &amp; continue
            </button>
          </div>
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
              onNext={() => setStep("care-team")}
            />
          )}

          {step === "care-team" && (
            <CareTeamPage
              patient={patient}
              onBack={() => setStep("proms")}
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
