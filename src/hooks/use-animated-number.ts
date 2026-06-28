"use client";

import { useEffect, useRef, useState } from "react";

export function useAnimatedNumber(value: number, durationMs = 450): number {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);

    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [value, durationMs]);

  useEffect(() => {
    if (Math.abs(display - value) < 0.01) {
      fromRef.current = value;
    }
  }, [display, value]);

  return display;
}
