"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  POST_OP_VA_LABEL,
  POST_OP_VA_SHARPEN_FILTER,
  vaToBlurPx,
  type VisualAcuity,
} from "@/lib/va";

type VaPrePostCompareProps = {
  visualAcuity: VisualAcuity;
  animate?: boolean;
};

export function VaPrePostCompare({ visualAcuity, animate = true }: VaPrePostCompareProps) {
  const [phase, setPhase] = useState(animate ? 0 : 2);
  const currentBlur = vaToBlurPx(visualAcuity);

  useEffect(() => {
    if (!animate) return;
    const t1 = window.setTimeout(() => setPhase(1), 150);
    const t2 = window.setTimeout(() => setPhase(2), 700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [animate, visualAcuity]);

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
      <div
        className={`relative min-h-[120px] overflow-hidden rounded-xl border-2 bg-slate-100 sm:min-h-[160px] ${
          phase >= 1 ? "animate-scale-jump border-red-300 shadow-md" : "border-transparent opacity-0"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
          <Image
            src="/woodlands-hospital-logo.png"
            alt="Woodlands Hospital logo — as you see today"
            width={320}
            height={96}
            className="h-auto max-h-full w-full max-w-[220px] object-contain transition-[filter] duration-700 sm:max-w-[260px]"
            style={{ filter: `blur(${currentBlur}px)` }}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-red-950/10" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-950/85 to-transparent px-2 pb-2 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-red-100 sm:text-xs">
            How you see today
          </p>
          <p className="text-sm font-extrabold text-white sm:text-base">{visualAcuity}</p>
        </div>
      </div>

      <div
        className={`relative min-h-[120px] overflow-hidden rounded-xl border-2 bg-white sm:min-h-[160px] ${
          phase >= 2
            ? "animate-scale-jump border-green-400 shadow-md ring-2 ring-green-200/50"
            : "border-transparent opacity-30"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
          <Image
            src="/woodlands-hospital-logo.png"
            alt="Woodlands Hospital logo — after cataract surgery"
            width={340}
            height={102}
            className="h-auto max-h-full w-full max-w-[240px] object-contain transition-[filter,transform] duration-1000 sm:max-w-[280px]"
            style={{
              filter: phase >= 2 ? POST_OP_VA_SHARPEN_FILTER : `blur(${currentBlur}px)`,
              transform: phase >= 2 ? "scale(1.04)" : "scale(1)",
            }}
            priority
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-green-950/85 to-transparent px-2 pb-2 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-green-100 sm:text-xs">
            After cataract surgery
          </p>
          <p className="text-sm font-extrabold text-white sm:text-base">{POST_OP_VA_LABEL}</p>
        </div>
      </div>
    </div>
  );
}
