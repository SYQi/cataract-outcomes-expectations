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
    <div className="grid h-full min-h-0 grid-cols-2 gap-2 landscape:gap-2.5 sm:gap-3">
      <div
        className={`relative min-h-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition-[border-color,box-shadow,opacity] duration-500 ${
          phase >= 1 ? "border-red-300 opacity-100 shadow-md" : "border-transparent opacity-0"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
          <div
            className="max-h-[70%] max-w-[90%]"
            style={{ filter: `blur(${currentBlur}px)`, WebkitBackfaceVisibility: "hidden" }}
          >
            <Image
              src="/woodlands-hospital-logo.png"
              alt="Woodlands Hospital logo — as you see today"
              width={320}
              height={96}
              className="h-auto max-h-full w-full object-contain"
              priority
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-red-950/10" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-950/85 to-transparent px-2 pb-1.5 pt-4">
          <p className="text-[9px] font-bold uppercase tracking-wide text-red-100 sm:text-[10px]">
            How you see today
          </p>
          <p className="text-xs font-extrabold text-white sm:text-sm">{visualAcuity}</p>
        </div>
      </div>

      <div
        className={`relative min-h-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition-[border-color,box-shadow,opacity] duration-700 ${
          postOpRevealed
            ? "border-green-400 opacity-100 shadow-md ring-2 ring-green-200/50"
            : "border-slate-200 opacity-40"
        }`}
      >
        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
          <div
            className="max-h-[70%] max-w-[90%] transition-[filter,opacity] duration-700"
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
              className="h-auto max-h-full w-full object-contain"
              priority
            />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-green-950/85 to-transparent px-2 pb-1.5 pt-4">
          <p className="text-[9px] font-bold uppercase tracking-wide text-green-100 sm:text-[10px]">
            After cataract surgery
          </p>
          <p className="text-xs font-extrabold text-white sm:text-sm">{POST_OP_VA_LABEL}</p>
        </div>
      </div>
    </div>
  );
}
