"use client";

import { useEffect, useState } from "react";
import {
  POST_OP_CAT_PROM5_FIRST_EYE,
  POST_OP_CAT_PROM5_SECOND_EYE,
} from "@/lib/catProm5";

type PromsHorizontalScaleProps = {
  patientScore: number;
  animate?: boolean;
};

type Marker = {
  id: string;
  score: number;
  label: string;
  color: string;
  delayMs: number;
  emphasis?: boolean;
};

export function PromsHorizontalScale({ patientScore, animate = true }: PromsHorizontalScaleProps) {
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const t = window.setTimeout(() => setVisible(true), 100);
    return () => window.clearTimeout(t);
  }, [animate]);

  const markers: Marker[] = [
    {
      id: "patient",
      score: patientScore,
      label: "You today",
      color: "#D31145",
      delayMs: 0,
      emphasis: true,
    },
    {
      id: "first",
      score: POST_OP_CAT_PROM5_FIRST_EYE,
      label: "1st Eye Surgery",
      color: "#0d9488",
      delayMs: 450,
    },
    {
      id: "second",
      score: POST_OP_CAT_PROM5_SECOND_EYE,
      label: "2nd Eye Surgery",
      color: "#22c55e",
      delayMs: 900,
    },
  ];

  return (
    <div className="flex h-full min-h-0 flex-col justify-center px-1 sm:px-2">
      <p className="mb-3 text-center text-sm font-bold text-brand-navy sm:text-base">
        Quality of Vision and Life
      </p>

      <div className="relative mx-2 sm:mx-4">
        <div className="mb-2 flex justify-between text-xs font-semibold sm:text-sm">
          <span className="text-red-600">Poor</span>
          <span className="text-green-600">Great</span>
        </div>

        {/* Single positioning context: marker + label share the same left % */}
        <div className="relative h-[5.5rem] sm:h-24">
          <div
            className="absolute inset-x-0 top-3 h-6 rounded-full shadow-inner sm:top-3.5 sm:h-7"
            style={{
              background:
                "linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #22c55e 100%)",
            }}
          />

          {markers.map((m) => {
            const left = Math.max(0, Math.min(100, m.score));
            return (
              <div
                key={m.id}
                className="absolute top-0 flex w-0 flex-col items-center"
                style={{ left: `${left}%` }}
              >
                <div
                  className={`mt-3 h-5 w-5 shrink-0 rounded-full border-[3px] border-white shadow-lg sm:mt-3.5 sm:h-6 sm:w-6 ${
                    visible ? "animate-scale-jump" : "scale-0 opacity-0"
                  } ${m.emphasis ? "animate-pulse-glow" : ""}`}
                  style={{ backgroundColor: m.color, animationDelay: `${m.delayMs}ms` }}
                />
                <div
                  className={`mt-1.5 w-max max-w-[5.5rem] text-center sm:max-w-[7rem] ${
                    visible ? "animate-fade-up" : "opacity-0"
                  }`}
                  style={{ animationDelay: `${m.delayMs}ms` }}
                >
                  <p
                    className={`text-[10px] font-bold leading-tight sm:text-[11px] ${
                      m.emphasis ? "text-red-700" : "text-slate-800"
                    }`}
                  >
                    {m.label}
                  </p>
                  <p
                    className={`text-xs font-black sm:text-sm ${
                      m.emphasis ? "text-red-600" : "text-brand-navy"
                    }`}
                  >
                    {m.score}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {patientScore < POST_OP_CAT_PROM5_FIRST_EYE && visible && (
        <p
          className="mt-2 animate-fade-up text-center text-xs font-medium text-teal-800 sm:text-sm"
          style={{ animationDelay: "1.2s" }}
        >
          Many patients climb toward <strong>{POST_OP_CAT_PROM5_FIRST_EYE}</strong> after 1st eye
          surgery and <strong>{POST_OP_CAT_PROM5_SECOND_EYE}</strong> after 2nd eye surgery.
        </p>
      )}
    </div>
  );
}
