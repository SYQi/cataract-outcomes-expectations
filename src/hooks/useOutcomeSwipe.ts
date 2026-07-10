"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseOutcomeSwipeArgs = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  enabled: boolean;
  minDistancePx?: number;
};

export function useOutcomeSwipe({
  onSwipeLeft,
  onSwipeRight,
  enabled,
  minDistancePx = 56,
}: UseOutcomeSwipeArgs) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [touchNav, setTouchNav] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const update = () => setTouchNav(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const active = enabled && touchNav;

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!active) return;
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    },
    [active],
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!active || !touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      touchStart.current = null;

      if (Math.abs(dx) < minDistancePx || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    },
    [active, minDistancePx, onSwipeLeft, onSwipeRight],
  );

  return { active, onTouchStart, onTouchEnd };
}
