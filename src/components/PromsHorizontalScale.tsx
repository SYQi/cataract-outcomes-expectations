"use client";

import { useEffect, useState } from "react";
import {
  POST_OP_CAT_PROM5_AVERAGE,
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
  /** Where the label sits relative to the bar to avoid overlap. */
  placement: "above" | "below";
};

function clampMarkerLeft(score: number): number {
  return Math.max(6, Math.min(94, score));
}

function MarkerLabel({
  marker,
  visible,
  anchor = "top",
}: {
  marker: Marker;
  visible: boolean;
  anchor?: "top" | "bottom";
}) {
  const left = clampMarkerLeft(marker.score);
  return (
    <div
      className={`absolute flex w-0 -translate-x-1/2 flex-col items-center ${
        anchor === "bottom" ? "bottom-0" : "top-0"
      } ${visible ? "animate-fade-up" : "opacity-0"}`}
      style={{ left: `${left}%`, animationDelay: `${marker.delayMs}ms` }}
    >
      <p
        className={`max-w-[6.5rem] text-center text-[13px] font-bold leading-tight sm:max-w-[7.5rem] sm:text-[15px] ${
          marker.emphasis ? "text-red-700" : "text-slate-800"
        }`}
      >
        {marker.label}
      </p>
      <p
        className={`text-sm font-black sm:text-base ${
          marker.emphasis ? "text-red-600" : "text-brand-navy"
        }`}
      >
        {marker.score}
      </p>
    </div>
  );
}

function MarkerDot({
  marker,
  visible,
  className = "top-1/2 -translate-y-1/2",
}: {
  marker: Marker;
  visible: boolean;
  className?: string;
}) {
  const left = clampMarkerLeft(marker.score);
  return (
    <div
      className={`absolute -translate-x-1/2 ${className}`}
      style={{ left: `${left}%` }}
    >
      <div
        className={`h-5 w-5 rounded-full border-[3px] border-white shadow-lg sm:h-6 sm:w-6 ${
          visible ? "animate-scale-jump" : "scale-0 opacity-0"
        } ${marker.emphasis ? "animate-pulse-glow" : ""}`}
        style={{ backgroundColor: marker.color, animationDelay: `${marker.delayMs}ms` }}
      />
    </div>
  );
}

/** +30% on top of surrounding sentence size for highlighted scores. */
const SCORE_NUM = "text-[1.3em] font-extrabold leading-none";

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
      placement: "below",
    },
    {
      id: "first",
      score: POST_OP_CAT_PROM5_FIRST_EYE,
      label: "1st Eye Surgery",
      color: "#0d9488",
      delayMs: 450,
      placement: "below",
    },
    {
      id: "second",
      score: POST_OP_CAT_PROM5_SECOND_EYE,
      label: "2nd Eye Surgery",
      color: "#22c55e",
      delayMs: 900,
      placement: "above",
    },
  ];

  const aboveMarkers = markers.filter((m) => m.placement === "above");
  const belowMarkers = markers.filter((m) => m.placement === "below");

  return (
    <div className="flex min-h-0 flex-col justify-center px-1 sm:px-2">
      <p className="mb-3 text-center text-[1.1375rem] font-bold text-brand-navy sm:text-[1.3rem]">
        Quality of Vision and Life
      </p>

      <div className="relative mx-1 sm:mx-4">
        <div className="mb-2 flex justify-between text-xs font-semibold sm:text-sm">
          <span className="text-red-600">Poor</span>
          <span className="text-green-600">Great</span>
        </div>

        <div className="relative mb-2 h-14 sm:mb-3 sm:h-16">
          {aboveMarkers.map((m) => (
            <MarkerLabel key={`above-${m.id}`} marker={m} visible={visible} anchor="bottom" />
          ))}
        </div>

        <div className="relative mx-1 h-7 sm:mx-2 sm:h-8">
          <div
            className="absolute inset-0 rounded-full shadow-inner"
            style={{
              background:
                "linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #22c55e 100%)",
            }}
          />
          {markers.map((m) => (
            <MarkerDot key={`dot-${m.id}`} marker={m} visible={visible} />
          ))}
        </div>

        <div className="relative mt-1 h-14 sm:h-16">
          {belowMarkers.map((m) => (
            <MarkerLabel key={`below-${m.id}`} marker={m} visible={visible} />
          ))}
        </div>
      </div>

      {visible && (
        <p
          className="mt-3 animate-fade-up text-center text-[1.17rem] font-bold leading-snug text-slate-700 sm:mt-4 sm:text-[1.365rem]"
          style={{ animationDelay: "1.2s" }}
        >
          <span className="block">Quality of life is expected to increase from</span>
          <span className="mt-1 block">
            <span className={`${SCORE_NUM} text-brand-red`}>{patientScore}</span>
            {" to an average score of "}
            <span className={`${SCORE_NUM} text-[#2dd4bf]`}>{POST_OP_CAT_PROM5_AVERAGE}</span>
          </span>
          <span className="mt-1 block">after cataract surgery</span>
        </p>
      )}
    </div>
  );
}
