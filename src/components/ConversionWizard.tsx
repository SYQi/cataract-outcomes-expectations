"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import { CareTeamPage } from "@/components/CareTeamPage";
import { CatProm5QuestionPage } from "@/components/CatProm5QuestionPage";
import { ComplicationsOutcomePage } from "@/components/ComplicationsOutcomePage";
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
import type { VisualAcuity } from "@/lib/va";

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
  const [unlockedCount, setUnlockedCount] = useState(1);
  const [showNewPatientGate, setShowNewPatientGate] = useState(false);

  useEffect(() => {
    setPatient((p) => ({ ...p, dateTime: formatGmt8Timestamp() }));
  }, []);

  const scores = useMemo(() => computeCatProm5Score100(answers), [answers]);
  const verifyValid = patient.name.trim().length > 0 && patient.nric.trim().length > 0;
  const isOutcome = OUTCOME_STEPS.includes(step);
  const visualAcuity = patient.visualAcuity as VisualAcuity;

  const { finalizeAndReset } = useSessionTracker({
    step: step as TrackedPage,
    patientName: patient.name,
    nric: patient.nric,
    formDateTime: patient.dateTime,
    insurer: patient.insurer,
    consultant: patient.consultant,
    catProm5Score: step === "admin" || step === "details" || step === "assessment" ? null : scores.score100,
    visualAcuity:
      step === "admin" || step === "details" || step === "assessment" || !visualAcuity
        ? null
        : visualAcuity,
  });

  const resetPatient = async () => {
    await finalizeAndReset();
    setStep("admin");
    setPatient({ ...EMPTY_PATIENT_INTAKE, dateTime: formatGmt8Timestamp() });
    setAnswers(DEFAULT_CAT_PROM5_ANSWERS);
    setUnlockedCount(1);
    setShowNewPatientGate(false);
  };

  const handleCatAnswer = (questionId: keyof CatProm5Answers, value: number) => {
    setAnswers((a) => ({ ...a, [questionId]: value }));
  };

  const handleCatFrontierRelease = () => {
    if (unlockedCount < CAT_PROM5_QUESTIONS.length) {
      setUnlockedCount((c) => c + 1);
    } else {
      setStep("va");
    }
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

  const maxWidth = isOutcome
    ? "max-w-5xl landscape:max-w-6xl"
    : "max-w-2xl landscape:max-w-3xl";

  /** Assessment scrolls full-height panels; other steps center via my-auto wrappers or OutcomePageShell. */
  const mainClass = "flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain";

  return (
    <div
      className={`mx-auto flex min-h-[100dvh] flex-col px-4 py-3 sm:px-6 sm:py-4 ${maxWidth}`}
    >
      <header className="shrink-0 text-center">
        {step === "details" && (
          <>
            <div className="mb-2 flex justify-center sm:mb-3">
              <WhLogo size="lg" />
            </div>
            <h1 className="text-2xl font-bold leading-snug text-brand-navy landscape:text-xl sm:text-3xl">
              <span className="block">Cataract Surgery:</span>
              <span className="mt-1 block">Outcomes and Expectations</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600 landscape:mt-1">
              Please verify your details before starting the assessment.
            </p>
          </>
        )}
        {step === "admin" && (
          <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Staff intake</h1>
        )}
        {step === "assessment" && (
          <>
            <h1 className="text-xl font-bold text-brand-navy landscape:text-lg sm:text-2xl">
              Assessment
            </h1>
            <p className="mt-1 text-sm text-slate-500">CAT-PROM5 questionnaire</p>
          </>
        )}
        {step !== "admin" && (
          <div
            className={`flex justify-center gap-1 sm:gap-1.5 ${step === "details" ? "mt-2 sm:mt-3" : "mt-1"}`}
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
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              {outcomeIndex + 1} of {OUTCOME_STEPS.length} · {outcomeLabel}
            </p>
            {swipeNavActive && (
              <p className="mt-1 text-[10px] text-slate-400 landscape:hidden">
                Swipe left or right between outcome pages
              </p>
            )}
          </>
        )}
      </header>

      <main className={mainClass} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {step === "admin" && (
          <div className="my-auto w-full py-2">
            <AdminPage
              patient={patient}
              onChange={setPatient}
              onContinue={() => setStep("details")}
            />
          </div>
        )}

        {step === "details" && (
          <div className="my-auto w-full py-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm landscape:mx-auto landscape:max-w-xl sm:p-6">
              <h2 className="text-lg font-semibold text-brand-navy">Verify your details</h2>
              <p className="mt-1 text-sm text-slate-500">
                These were entered by staff. Please confirm they are correct before continuing.
              </p>

              <div className="mt-6 space-y-5 landscape:mt-4 landscape:grid landscape:grid-cols-2 landscape:gap-4 landscape:space-y-0">
                {[
                  { label: "Full name", value: patient.name },
                  { label: "NRIC", value: patient.nric },
                ].map((field) => (
                  <div key={field.label} className="block">
                    <span className="text-sm font-medium text-slate-700">{field.label}</span>
                    <div className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-800">
                      {field.value || "—"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-3 landscape:mt-5">
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
                  onClick={() => {
                    setUnlockedCount(1);
                    setStep("assessment");
                  }}
                  className="flex-[2] rounded-xl bg-brand-navy px-6 py-4 text-base font-semibold text-white transition hover:bg-brand-navy/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Confirm &amp; continue
                </button>
              </div>
            </section>
          </div>
        )}

        {step === "assessment" && (
          <div className="min-h-full">
            <CatProm5QuestionPage
              unlockedCount={unlockedCount}
              answers={answers}
              onAnswer={handleCatAnswer}
              onFrontierRelease={handleCatFrontierRelease}
            />
          </div>
        )}

        {isOutcome && visualAcuity && (
          <>
            {step === "va" && (
              <VaOutcomePage
                visualAcuity={visualAcuity}
                onBack={() => {
                  setUnlockedCount(CAT_PROM5_QUESTIONS.length);
                  setStep("assessment");
                }}
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
          </>
        )}
      </main>

      <NewPatientPasswordGate
        open={showNewPatientGate}
        onCancel={() => setShowNewPatientGate(false)}
        onSuccess={resetPatient}
      />
    </div>
  );
}
