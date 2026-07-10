"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  emptyPageSeconds,
  type PageDurationsSeconds,
  type PatientSessionRecord,
  type TrackedPage,
} from "@/lib/sessionAnalytics";

type UseSessionTrackerArgs = {
  step: TrackedPage;
  patientName: string;
  nric: string;
  formDateTime: string;
  insurer: string;
  consultant: string;
  catProm5Score: number | null;
  visualAcuity: string | null;
};

function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function postSession(record: PatientSessionRecord) {
  try {
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      keepalive: true,
    });
  } catch (error) {
    console.error("Session save failed", error);
  }
}

export function useSessionTracker({
  step,
  patientName,
  nric,
  formDateTime,
  insurer,
  consultant,
  catProm5Score,
  visualAcuity,
}: UseSessionTrackerArgs) {
  const sessionIdRef = useRef(newSessionId());
  const startedAtIsoRef = useRef(new Date().toISOString());
  const pageSecondsRef = useRef<PageDurationsSeconds>(emptyPageSeconds());
  const pageEnteredAtRef = useRef(Date.now());
  const currentPageRef = useRef<TrackedPage>(step);
  const latestMetaRef = useRef({
    patientName,
    nric,
    formDateTime,
    insurer,
    consultant,
    catProm5Score,
    visualAcuity,
  });

  useEffect(() => {
    latestMetaRef.current = {
      patientName,
      nric,
      formDateTime,
      insurer,
      consultant,
      catProm5Score,
      visualAcuity,
    };
  }, [patientName, nric, formDateTime, insurer, consultant, catProm5Score, visualAcuity]);

  const accumulateCurrentPage = useCallback(() => {
    const elapsedMs = Date.now() - pageEnteredAtRef.current;
    const seconds = Math.max(0, Math.round(elapsedMs / 1000));
    const page = currentPageRef.current;
    pageSecondsRef.current[page] += seconds;
    pageEnteredAtRef.current = Date.now();
  }, []);

  const buildRecord = useCallback(
    (completed: boolean): PatientSessionRecord => {
      accumulateCurrentPage();
      const pageSeconds = { ...pageSecondsRef.current };
      const totalSeconds = Object.values(pageSeconds).reduce((sum, n) => sum + n, 0);
      const meta = latestMetaRef.current;
      return {
        sessionId: sessionIdRef.current,
        patientName: meta.patientName,
        nric: meta.nric,
        formDateTime: meta.formDateTime,
        insurer: meta.insurer || undefined,
        consultant: meta.consultant || undefined,
        startedAtIso: startedAtIsoRef.current,
        endedAtIso: new Date().toISOString(),
        pageSeconds,
        totalSeconds,
        catProm5Score: meta.catProm5Score,
        visualAcuity: meta.visualAcuity,
        completed,
      };
    },
    [accumulateCurrentPage],
  );

  const flush = useCallback(
    async (completed: boolean) => {
      const record = buildRecord(completed);
      // Only persist once we have identifying details
      if (!record.patientName.trim() && !record.nric.trim()) return;
      await postSession(record);
    },
    [buildRecord],
  );

  // On step change: bank time for previous page
  useEffect(() => {
    if (step === currentPageRef.current) return;
    accumulateCurrentPage();
    currentPageRef.current = step;
    pageEnteredAtRef.current = Date.now();
    void flush(false);
  }, [step, accumulateCurrentPage, flush]);

  // Flush on tab hide / unload
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") void flush(false);
    };
    const onPageHide = () => {
      void flush(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [flush]);

  const finalizeAndReset = useCallback(async () => {
    await flush(true);
    sessionIdRef.current = newSessionId();
    startedAtIsoRef.current = new Date().toISOString();
    pageSecondsRef.current = emptyPageSeconds();
    pageEnteredAtRef.current = Date.now();
    currentPageRef.current = "admin";
  }, [flush]);

  return { flush, finalizeAndReset };
}
