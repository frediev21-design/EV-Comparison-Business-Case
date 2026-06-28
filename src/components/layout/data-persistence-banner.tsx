"use client";

import { useEffect, useState } from "react";
import { useCaseStore } from "@/store/case-store";
import { HardDrive, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "fleet-tco-data-banner-dismissed";

export function DataPersistenceBanner() {
  const caseId = useCaseStore((s) => s.caseId);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div className="flex items-start justify-between gap-3 border-b border-border bg-muted/40 px-4 py-2 text-xs lg:px-6">
      <div className="flex items-start gap-2 text-muted-foreground">
        <HardDrive className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>
          {caseId ? (
            <>
              Saved on this device. Export from{" "}
              <button
                type="button"
                className="font-medium text-foreground underline"
                onClick={() => useCaseStore.getState().setActiveStep("scenarios")}
              >
                Scenarios
              </button>{" "}
              to back up or move browsers.
            </>
          ) : (
            <>
              Your analysis saves to this browser when you complete a setup step. Use{" "}
              <strong className="font-medium text-foreground">Scenarios → Export</strong> to back up.
            </>
          )}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        aria-label="Dismiss"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setDismissed(true);
        }}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
