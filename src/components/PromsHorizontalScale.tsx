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
  /** Where the label sits relative to the bar to avoid overlap. */
  placement: "above" | "below";
};

function clampMarkerLeft(score: number): number {
  return Math.max(6, Math.min(94, score));
}

function MarkerLabel({
  marker,
  visible,
}: {
  marker: Marker;
  visible: boolean;
}) {
  const left = clampMarkerLeft(marker.score);
  return (
    <div
      className={`absolute top-0 flex w-0 -translate-x-1/2 flex-col items-center ${
        visible ? "animate-fade-up" : "opacity-0"
      }`}
      style={{ left: `${left}%`, animationDelay: `${marker.delayMs}ms` }}
    >
      <p
        className={`max-w-[5.5rem] text-center text-[10px] font-bold leading-tight sm:max-w-[6.5rem] sm:text-[11px] ${
          marker.emphasis ? "text-red-700" : "text-slate-800"
        }`}
      >
        {marker.label}
      </p>
      <p
        className={`text-xs font-black sm:text-sm ${
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
      <p className="mb-3 text-center text-sm font-bold text-brand-navy sm:text-base">
        Quality of Vision and Life
      </p>

      <div className="relative mx-1 sm:mx-4">
        <div className="mb-2 flex justify-between text-xs font-semibold sm:text-sm">
          <span className="text-red-600">Poor</span>
          <span className="text-green-600">Great</span>
        </div>

        {/* Labels above bar (2nd eye surgery) */}
        <div className="relative h-11 sm:h-12">
          {aboveMarkers.map((m) => (
            <MarkerLabel key={`above-${m.id}`} marker={m} visible={visible} />
          ))}
        </div>

        {/* Gradient bar + dots */}
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

        {/* Labels below bar (you today + 1st eye surgery) */}
        <div className="relative mt-1 h-12 sm:h-14">
          {belowMarkers.map((m) => (
            <MarkerLabel key={`below-${m.id}`} marker={m} visible={visible} />
          ))}
        </div>
      </div>

      {patientScore < POST_OP_CAT_PROM5_FIRST_EYE && visible && (
        <p
          className="mt-3 animate-fade-up text-center text-xs font-medium leading-snug text-teal-800 sm:mt-4 sm:text-sm"
          style={{ animationDelay: "1.2s" }}
        >
          Many patients climb toward <strong>{POST_OP_CAT_PROM5_FIRST_EYE}</strong> after 1st eye
          surgery and <strong>{POST_OP_CAT_PROM5_SECOND_EYE}</strong> after 2nd eye surgery.
        </p>
      )}
    </div>
  );
}
