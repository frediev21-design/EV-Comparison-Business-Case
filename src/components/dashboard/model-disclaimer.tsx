import { cn } from "@/lib/utils";
import { MODEL_DISCLAIMER, MODEL_DISCLAIMER_SHORT } from "@/lib/model-disclaimer";

interface ModelDisclaimerProps {
  variant?: "full" | "short";
  className?: string;
}

export function ModelDisclaimer({ variant = "full", className }: ModelDisclaimerProps) {
  const text = variant === "short" ? MODEL_DISCLAIMER_SHORT : MODEL_DISCLAIMER;
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>{text}</p>
  );
}
