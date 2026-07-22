"use client";

import { useEffect, useState } from "react";
import {
  POST_OP_CAT_PROM5_AVERAGE,
  POST_OP_CAT_PROM5_FIRST_EYE,
  POST_OP_CAT_PROM5_SECOND_EYE,
} from "@/lib/catProm5";
import { useLocale, useMessages } from "@/lib/i18n";

type PromsHorizontalScaleProps = {
  patientScore: number;
  animate?: boolean;
  /** Hide Poor / Great end labels. */
  hideEndLabels?: boolean;
  /** Hide the quality-of-life sentence under the bar. */
  hideQolCopy?: boolean;
  /** Tighter vertical footprint for the outcomes overview. */
  compact?: boolean;
  /** +50% QoL sentence size (outcomes overview emphasis). */
  emphasizeQolCopy?: boolean;
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

function clampMarkerLeft(score: number, compact: boolean): number {
  const lo = compact ? 14 : 6;
  const hi = compact ? 86 : 94;
  return Math.max(lo, Math.min(hi, score));
}

function MarkerLabel({
  marker,
  visible,
  anchor = "top",
  compact = false,
  numbersOnly = false,
}: {
  marker: Marker;
  visible: boolean;
  anchor?: "top" | "bottom";
  compact?: boolean;
  numbersOnly?: boolean;
}) {
  const left = clampMarkerLeft(marker.score, compact);
  return (
    <div
      className={`absolute flex w-0 -translate-x-1/2 flex-col items-center ${
        anchor === "bottom" ? "bottom-0" : "top-0"
      } ${visible ? "animate-fade-up" : "opacity-0"}`}
      style={{ left: `${left}%`, animationDelay: `${marker.delayMs}ms` }}
    >
      {!numbersOnly && (
        <p
          className={`text-center font-bold leading-tight ${
            compact
              ? "max-w-[6.5rem] text-[16.5px] sm:max-w-[7.5rem] sm:text-[18px]"
              : "max-w-[6.5rem] text-[13px] sm:max-w-[7.5rem] sm:text-[15px]"
          } ${marker.emphasis ? "text-red-700" : "text-slate-800"}`}
        >
          {marker.label}
        </p>
      )}
      <p
        className={`font-black ${
          compact ? "text-[1.125rem] sm:text-[1.3125rem]" : "text-sm sm:text-base"
        } ${marker.emphasis ? "text-red-600" : "text-brand-navy"}`}
      >
        {marker.score}
      </p>
    </div>
  );
}

function MarkerDot({
  marker,
  visible,
  compact = false,
  className = "top-1/2 -translate-y-1/2",
}: {
  marker: Marker;
  visible: boolean;
  compact?: boolean;
  className?: string;
}) {
  const left = clampMarkerLeft(marker.score, compact);
  return (
    <div
      className={`absolute -translate-x-1/2 ${className}`}
      style={{ left: `${left}%` }}
    >
      <div
        className={`rounded-full border-[3px] border-white shadow-lg ${
          compact ? "h-4 w-4 sm:h-5 sm:w-5" : "h-5 w-5 sm:h-6 sm:w-6"
        } ${visible ? "animate-scale-jump" : "scale-0 opacity-0"} ${
          marker.emphasis ? "animate-pulse-glow" : ""
        }`}
        style={{ backgroundColor: marker.color, animationDelay: `${marker.delayMs}ms` }}
      />
    </div>
  );
}

/** +30% on top of surrounding sentence size for highlighted scores. */
const SCORE_NUM = "text-[1.3em] font-extrabold leading-none";

export function PromsHorizontalScale({
  patientScore,
  animate = true,
  hideEndLabels = false,
  hideQolCopy = false,
  compact = false,
  emphasizeQolCopy = false,
}: PromsHorizontalScaleProps) {
  const t = useMessages();
  const { locale } = useLocale();
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const timer = window.setTimeout(() => setVisible(true), 100);
    return () => window.clearTimeout(timer);
  }, [animate]);

  const markers: Marker[] = [
    {
      id: "patient",
      score: patientScore,
      label: t.proms.youToday,
      color: "#D31145",
      delayMs: 0,
      emphasis: true,
      // Compact overview: sit with the eye markers above the bar.
      placement: compact ? "above" : "below",
    },
    {
      id: "first",
      score: POST_OP_CAT_PROM5_FIRST_EYE,
      label: t.proms.firstEye,
      color: "#0d9488",
      delayMs: compact ? 200 : 450,
      // Compact overview: keep both eye markers above so the QoL line has a clear lane below.
      placement: compact || locale === "zh-CN" ? "above" : "below",
    },
    {
      id: "second",
      score: POST_OP_CAT_PROM5_SECOND_EYE,
      label: t.proms.secondEye,
      color: "#22c55e",
      delayMs: compact ? 350 : 900,
      placement: "above",
    },
  ];

  const aboveMarkers = markers.filter((m) => m.placement === "above");
  const belowMarkers = markers.filter((m) => m.placement === "below");
  // Outcomes overview (compact) in Chinese: show score numbers only — no Chinese labels.
  const numbersOnly = compact && locale === "zh-CN";
  const markerLane = compact
    ? numbersOnly
      ? "relative mb-1 h-8 overflow-visible landscape:mb-0.5 landscape:h-7 sm:mb-1 sm:h-9"
      : "relative mb-1 h-14 overflow-visible landscape:mb-0.5 landscape:h-12 sm:mb-1 sm:h-16"
    : "relative mb-2 h-14 sm:mb-3 sm:h-16";
  const belowLane = compact
    ? numbersOnly
      ? "relative mt-0.5 h-8 overflow-visible landscape:h-7 sm:h-9"
      : "relative mt-0.5 h-14 overflow-visible landscape:h-12 sm:h-16"
    : "relative mt-1 h-14 sm:h-16";
  const barHeight = compact
    ? "relative mx-2 h-6 sm:mx-3 sm:h-7"
    : "relative mx-1 h-7 sm:mx-2 sm:h-8";

  const qolClass = emphasizeQolCopy
    ? "mt-2 text-[2.1rem] leading-snug landscape:mt-1.5 landscape:text-[1.96rem] sm:mt-2.5 sm:text-[2.415rem]"
    : compact
      ? "mt-2 text-[1rem] landscape:mt-1.5 landscape:text-[0.95rem] sm:mt-3 sm:text-[1.15rem]"
      : "mt-8 text-[1.17rem] sm:mt-8 sm:text-[1.365rem]";

  return (
    <div
      className={`flex min-h-0 flex-col justify-center overflow-x-clip ${
        compact ? "px-1 sm:px-2" : "px-1 sm:px-2"
      }`}
    >
      <div className={`relative overflow-x-clip ${compact ? "mx-1 sm:mx-3" : "mx-1 sm:mx-4"}`}>
        {!hideEndLabels && (
          <div className="mb-2 flex justify-between text-xs font-semibold sm:text-sm">
            <span className="text-red-600">{t.proms.poor}</span>
            <span className="text-green-600">{t.proms.great}</span>
          </div>
        )}

        <div className={markerLane}>
          {aboveMarkers.map((m) => (
            <MarkerLabel
              key={`above-${m.id}`}
              marker={m}
              visible={visible}
              anchor="bottom"
              compact={compact}
              numbersOnly={numbersOnly}
            />
          ))}
        </div>

        <div className={barHeight}>
          <div
            className="absolute inset-0 rounded-full shadow-inner"
            style={{
              background:
                "linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #22c55e 100%)",
            }}
          />
          {markers.map((m) => (
            <MarkerDot key={`dot-${m.id}`} marker={m} visible={visible} compact={compact} />
          ))}
        </div>

        {belowMarkers.length > 0 && (
          <div className={belowLane}>
            {belowMarkers.map((m) => (
              <MarkerLabel
                key={`below-${m.id}`}
                marker={m}
                visible={visible}
                compact={compact}
                numbersOnly={numbersOnly}
              />
            ))}
          </div>
        )}
      </div>

      {!hideQolCopy && visible && (
        <p
          className={`animate-fade-up px-2 text-center font-bold text-slate-700 ${qolClass}`}
          style={{ animationDelay: compact || emphasizeQolCopy ? "0.35s" : "1.2s" }}
        >
          <span className="block">{t.proms.qolLine1}</span>
          <span className="mt-0.5 block">
            <span className={`${SCORE_NUM} text-brand-red`}>{patientScore}</span>
            {t.proms.qolLine2Before ? ` ${t.proms.qolLine2Before} ` : " "}
            {t.proms.qolLine2Mid}{" "}
            <span className={`${SCORE_NUM} text-green-600`}>{POST_OP_CAT_PROM5_AVERAGE}</span>
          </span>
          <span className="mt-0.5 block">{t.proms.qolLine3}</span>
        </p>
      )}
    </div>
  );
}
