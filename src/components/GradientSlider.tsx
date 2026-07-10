"use client";

import { useCallback, useRef } from "react";

type GradientSliderProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  id?: string;
  minCaption?: string;
  maxCaption?: string;
  valueCaption?: string;
  hideValue?: boolean;
};

function valueFromClientX(
  clientX: number,
  rect: DOMRect,
  min: number,
  max: number,
): number {
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return Math.round(min + ratio * (max - min));
}

export function GradientSlider({
  value,
  min,
  max,
  onChange,
  id,
  minCaption,
  maxCaption,
  valueCaption,
  hideValue = false,
}: GradientSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromEvent = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return;
      onChange(valueFromClientX(clientX, track.getBoundingClientRect(), min, max));
    },
    [min, max, onChange],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromEvent(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromEvent(e.clientX);
  };

  const handlePointerUp = () => {
    dragging.current = false;
  };

  const percent = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full select-none touch-none">
      <div
        ref={trackRef}
        id={id}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        className="relative h-12 cursor-pointer rounded-full"
        style={{
          background: "linear-gradient(to right, #22c55e, #eab308, #ef4444)",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(min, value - 1));
          } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            onChange(Math.min(max, value + 1));
          }
        }}
      >
        <div
          className="absolute top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-brand-navy shadow-lg"
          style={{ left: `${percent}%` }}
        />
      </div>
      <div className="mt-2 flex flex-col gap-1.5 text-[13px] leading-snug sm:flex-row sm:justify-between sm:gap-2 sm:text-[14px]">
        <span className="break-words text-green-700">{minCaption ?? `${min} — no impairment`}</span>
        <span className="break-words text-right text-red-700 sm:max-w-[45%]">
          {maxCaption ?? `${max} — worst`}
        </span>
      </div>
      {!hideValue && (
        <p className="mt-1 text-center text-[1.05rem] font-semibold text-brand-navy">
          {valueCaption ?? `Selected: ${value}`}
        </p>
      )}
    </div>
  );
}
