"use client";

import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  format?: (value: number) => string;
  className?: string;
  durationMs?: number;
}

export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString("en-ZA"),
  className,
  durationMs,
}: AnimatedNumberProps) {
  const animated = useAnimatedNumber(value, durationMs);
  return <span className={cn("tabular-nums", className)}>{format(animated)}</span>;
}
