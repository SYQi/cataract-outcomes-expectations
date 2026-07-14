"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  POST_OP_VA_LABEL,
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
  const postOpRevealed = phase >= 2;

  useEffect(() => {
    if (!animate) return;
    setPhase(0);
    const t1 = window.setTimeout(() => setPhase(1), 150);
    const t2 = window.setTimeout(() => setPhase(2), 700);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [animate, visualAcuity]);

  return (
    <div className="grid min-h-0 grid-cols-1 gap-3 sm:grid-cols-2 landscape:grid-cols-1 landscape:gap-2.5 xl:landscape:grid-cols-2">
      <div
        className={`relative min-h-[120px] overflow-hidden rounded-xl border-2 bg-slate-100 transition-[border-color,box-shadow,opacity] duration-500 landscape:min-h-[110px] sm:min-h-[160px] landscape:sm:min-h-[120px] ${
          phase >= 1 ? "border-red-300 opacity-100 shadow-md" : "border-transparent opacity-0"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
          <div
            className="max-w-[200px] landscape:max-w-[180px] sm:max-w-[260px]"
            style={{ filter: `blur(${currentBlur}px)`, WebkitBackfaceVisibility: "hidden" }}
          >
            <Image
              src="/woodlands-hospital-logo.png"
              alt="Woodlands Hospital logo — as you see today"
              width={320}
              height={96}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
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
        className={`relative min-h-[120px] overflow-hidden rounded-xl border-2 bg-slate-100 transition-[border-color,box-shadow,opacity] duration-700 landscape:min-h-[110px] sm:min-h-[160px] landscape:sm:min-h-[120px] ${
          postOpRevealed
            ? "border-green-400 opacity-100 shadow-md ring-2 ring-green-200/50"
            : "border-slate-200 opacity-40"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
          <div
            className="max-w-[200px] transition-[filter,opacity] duration-700 landscape:max-w-[180px] sm:max-w-[280px]"
            style={{
              filter: postOpRevealed ? "blur(0px)" : `blur(${currentBlur}px)`,
              opacity: postOpRevealed ? 1 : 0.55,
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <Image
              src="/woodlands-hospital-logo.png"
              alt="Woodlands Hospital logo — after cataract surgery"
              width={340}
              height={102}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
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
