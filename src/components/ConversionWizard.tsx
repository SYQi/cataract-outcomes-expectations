"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminPage } from "@/components/AdminPage";
import { CareTeamPage } from "@/components/CareTeamPage";
import { CatProm5QuestionPage } from "@/components/CatProm5QuestionPage";
import { ComplicationsOutcomePage } from "@/components/ComplicationsOutcomePage";
import { NewPatientPasswordGate } from "@/components/NewPatientPasswordGate";
import { OutcomesSummaryPage } from "@/components/OutcomesSummaryPage";
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
import {
  DEFAULT_LOCALE,
  formatMessage,
  LocaleProvider,
  useLocale,
  useMessages,
  type Locale,
} from "@/lib/i18n";
import { resetPageScroll, resetPageScrollAfterPaint } from "@/lib/scrollReset";
import { EMPTY_PATIENT_INTAKE, type PatientIntake } from "@/lib/patientRegistry";
import { useOutcomeSwipe } from "@/hooks/useOutcomeSwipe";
import { useSessionTracker } from "@/hooks/useSessionTracker";
import type { TrackedPage } from "@/lib/sessionAnalytics";
import type { VisualAcuity } from "@/lib/va";

type Step =
  | "admin"
  | "details"
  | "assessment"
  | "outcomes-summary"
  | "va"
  | "refraction"
  | "complications"
  | "proms"
  | "care-team";

/** Primary patient path after CAT-PROM5. */
const PRIMARY_OUTCOME_STEPS: Step[] = ["outcomes-summary", "care-team"];

/** Optional detail pages reached from the summary. */
const DETAIL_STEPS: Step[] = ["va", "refraction", "complications", "proms"];

const OUTCOME_STEPS: Step[] = [...PRIMARY_OUTCOME_STEPS, ...DETAIL_STEPS];

/** Progress chrome: summary stands in for all detail drills. */
const PROGRESS_STEPS: Step[] = ["admin", "details", "assessment", "outcomes-summary", "care-team"];

function ConversionWizardInner() {
  const t = useMessages();
  const { locale, setLocale } = useLocale();
  const zhTitle = locale === "zh-CN";
  const [step, setStep] = useState<Step>("admin");
  const [patient, setPatient] = useState<PatientIntake>({
    ...EMPTY_PATIENT_INTAKE,
    dateTime: "",
  });
  const [answers, setAnswers] = useState<CatProm5Answers>(DEFAULT_CAT_PROM5_ANSWERS);
  const [unlockedCount, setUnlockedCount] = useState(1);
  const [showNewPatientGate, setShowNewPatientGate] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Keep the admin clock live while waiting on the intake screen. Without this,
  // a tablet left open from morning freezes formDateTime at first page load /
  // last "new patient" reset (seen as ~10:xx for afternoon visits).
  useEffect(() => {
    if (step !== "admin") return;
    const tick = () => setPatient((p) => ({ ...p, dateTime: formatGmt8Timestamp() }));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [step]);

  useEffect(() => {
    if (step !== "details" && step !== "outcomes-summary" && step !== "va") return;
    resetPageScrollAfterPaint(mainRef.current);
  }, [step]);

  const scores = useMemo(() => computeCatProm5Score100(answers), [answers]);
  const verifyValid = patient.name.trim().length > 0 && patient.nric.trim().length > 0;
  const isOutcome = OUTCOME_STEPS.includes(step);
  const isDetail = DETAIL_STEPS.includes(step);
  const visualAcuity = patient.visualAcuity as VisualAcuity;

  const { finalizeAndReset, beginPatientSession, recordDetailDrill } = useSessionTracker({
    step: step as TrackedPage,
    patientName: patient.name,
    nric: patient.nric,
    formDateTime: patient.dateTime,
    insurer: patient.insurer,
    consultant: patient.consultant,
    roomAssistant: patient.roomAssistant,
    catProm5Score: step === "admin" || step === "details" || step === "assessment" ? null : scores.score100,
    visualAcuity:
      step === "admin" || step === "details" || step === "assessment" || !visualAcuity
        ? null
        : visualAcuity,
  });

  const resetPatient = async () => {
    await finalizeAndReset();
    setLocale(DEFAULT_LOCALE);
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
      resetPageScroll(mainRef.current);
      setStep("outcomes-summary");
    }
  };

  const goToSummary = useCallback(() => {
    resetPageScroll(mainRef.current);
    setStep("outcomes-summary");
  }, []);

  const progressStep: Step =
    step === "va" || step === "refraction" || step === "complications" || step === "proms"
      ? "outcomes-summary"
      : step;
  const progressIndex = PROGRESS_STEPS.indexOf(progressStep);
  const outcomeIndex = PRIMARY_OUTCOME_STEPS.indexOf(
    step === "care-team" ? "care-team" : "outcomes-summary",
  );

  const onSwipeLeft = useCallback(() => {
    if (step === "outcomes-summary") setStep("care-team");
    else if (isDetail) setStep("care-team");
  }, [step, isDetail]);

  const onSwipeRight = useCallback(() => {
    if (step === "outcomes-summary") setStep("assessment");
    else if (step === "care-team") setStep("outcomes-summary");
    else if (isDetail) setStep("outcomes-summary");
  }, [step, isDetail]);

  const { active: swipeNavActive, onTouchStart, onTouchEnd } = useOutcomeSwipe({
    enabled: isOutcome,
    onSwipeLeft,
    onSwipeRight,
  });

  const outcomeLabel =
    step === "outcomes-summary"
      ? t.wizard.outcomeSummary
      : step === "va"
        ? t.wizard.outcomeVa
        : step === "refraction"
          ? t.wizard.outcomeRefraction
          : step === "complications"
            ? t.wizard.outcomeComplications
            : step === "proms"
              ? t.wizard.outcomeProms
              : t.wizard.outcomeCareTeam;

  const maxWidth = isOutcome
    ? "max-w-5xl landscape:max-w-6xl"
    : "max-w-2xl landscape:max-w-3xl";

  const lockToViewport = step === "details" || isOutcome;
  const mainClass =
    step === "assessment"
      ? "flex min-h-0 flex-1 flex-col justify-start overflow-y-auto overscroll-contain"
      : step === "va" || step === "outcomes-summary"
        ? "flex min-h-0 flex-1 flex-col justify-start overflow-hidden overscroll-contain"
        : "flex min-h-0 flex-1 flex-col justify-start overflow-y-auto overscroll-contain";

  return (
    <div
      className={`mx-auto flex flex-col px-4 sm:px-6 ${maxWidth} ${
        lockToViewport
          ? "h-[100dvh] max-h-[100dvh] overflow-hidden"
          : "min-h-[100dvh]"
      } ${
        step === "details"
          ? "pb-4 pt-4 sm:pb-5 sm:pt-5"
          : "py-3 sm:py-4"
      }`}
    >
      <header className="shrink-0 text-center">
        {step === "details" && (
          <>
            <div className="mb-2 flex justify-center sm:mb-3">
              <WhLogo size="lg" />
            </div>
            <h1
              className={`font-bold leading-snug text-brand-navy ${
                zhTitle
                  ? "text-[1.8rem] landscape:text-[1.5rem] sm:text-[2.25rem]"
                  : "text-2xl landscape:text-xl sm:text-3xl"
              }`}
            >
              <span className="block">{t.wizard.titleLine1}</span>
              <span className="mt-1 block">{t.wizard.titleLine2}</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600 landscape:mt-1">{t.wizard.verifyIntro}</p>
          </>
        )}
        {step === "admin" && (
          <h1 className="text-xl font-bold text-brand-navy sm:text-2xl">Staff intake</h1>
        )}
        {step === "assessment" && (
          <>
            <h1
              className={`font-bold text-brand-navy ${
                zhTitle
                  ? "text-[1.5rem] landscape:text-[1.35rem] sm:text-[1.8rem]"
                  : "text-xl landscape:text-lg sm:text-2xl"
              }`}
            >
              {t.wizard.assessmentTitle}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{t.wizard.assessmentSubtitle}</p>
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
              {formatMessage(t.wizard.outcomeOf, {
                current: Math.max(1, outcomeIndex + 1),
                total: PRIMARY_OUTCOME_STEPS.length,
                label: outcomeLabel,
              })}
            </p>
            {swipeNavActive && (
              <p className="mt-1 text-[10px] text-slate-400 landscape:hidden">{t.wizard.swipeHint}</p>
            )}
          </>
        )}
      </header>

      <main
        ref={mainRef}
        className={mainClass}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {step === "admin" && (
          <div className="my-auto w-full py-2">
            <AdminPage
              patient={patient}
              onChange={setPatient}
              locale={locale}
              onLocaleChange={setLocale}
              onContinue={() => {
                const stamped = formatGmt8Timestamp();
                setPatient((p) => ({ ...p, dateTime: stamped }));
                beginPatientSession(stamped);
                resetPageScrollAfterPaint(mainRef.current);
                setStep("details");
              }}
            />
          </div>
        )}

        {step === "details" && (
          <div className="w-full pt-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm landscape:mx-auto landscape:max-w-xl sm:p-6">
              <h2 className="text-lg font-semibold text-brand-navy">{t.details.heading}</h2>
              <p className="mt-1 text-sm text-slate-500">{t.details.intro}</p>

              <div className="mt-6 space-y-5 landscape:mt-4 landscape:grid landscape:grid-cols-2 landscape:gap-4 landscape:space-y-0">
                {[
                  { label: t.details.fullName, value: patient.name },
                  { label: t.details.nric, value: patient.nric },
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
                  {t.details.backToStaff}
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
                  {t.details.confirmContinue}
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
            {step === "outcomes-summary" && (
              <OutcomesSummaryPage
                patientScore={scores.score100}
                onBack={() => {
                  setUnlockedCount(CAT_PROM5_QUESTIONS.length);
                  setStep("assessment");
                }}
                onNext={() => setStep("care-team")}
                onOpenVa={() => {
                  recordDetailDrill("va");
                  setStep("va");
                }}
                onOpenRefraction={() => {
                  recordDetailDrill("refraction");
                  setStep("refraction");
                }}
                onOpenComplications={() => {
                  recordDetailDrill("complications");
                  setStep("complications");
                }}
                onOpenProms={() => {
                  recordDetailDrill("proms");
                  setStep("proms");
                }}
              />
            )}

            {step === "va" && (
              <VaOutcomePage
                visualAcuity={visualAcuity}
                onBack={goToSummary}
                onNext={() => setStep("care-team")}
              />
            )}

            {step === "refraction" && (
              <RefractiveOutcomePage
                onBack={goToSummary}
                onNext={() => setStep("care-team")}
              />
            )}

            {step === "complications" && (
              <ComplicationsOutcomePage
                onBack={goToSummary}
                onNext={() => setStep("care-team")}
              />
            )}

            {step === "proms" && (
              <PromsOutcomePage
                patientScore={scores.score100}
                onBack={goToSummary}
                onNext={() => setStep("care-team")}
              />
            )}

            {step === "care-team" && (
              <CareTeamPage
                patient={patient}
                onBack={() => setStep("outcomes-summary")}
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

export function ConversionWizard() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  return (
    <LocaleProvider locale={locale} setLocale={setLocale}>
      <ConversionWizardInner />
    </LocaleProvider>
  );
}
