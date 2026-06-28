"use client";

import { AlertTriangle } from "lucide-react";
import type { ValidationMessage } from "@/lib/wizard-validation";
import type { WizardStep } from "@/store/case-store";
import { cn } from "@/lib/utils";

interface ValidationAlertsProps {
  messages: ValidationMessage[];
  step?: WizardStep;
  className?: string;
}

export function ValidationAlerts({ messages, step, className }: ValidationAlertsProps) {
  const filtered = step ? messages.filter((m) => !m.step || m.step === step) : messages;
  if (filtered.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {filtered.map((msg) => (
        <div
          key={msg.id}
          className={cn(
            "flex gap-2 rounded-lg border px-3 py-2 text-sm",
            msg.severity === "error"
              ? "border-destructive/40 bg-destructive/10 text-destructive"
              : "border-warning/40 bg-warning/10 text-warning-foreground"
          )}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{msg.message}</p>
        </div>
      ))}
    </div>
  );
}
