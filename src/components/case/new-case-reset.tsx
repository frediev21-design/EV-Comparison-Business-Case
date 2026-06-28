"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCaseStore } from "@/store/case-store";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { RotateCcw } from "lucide-react";

export function useIsNewCaseRoute(): boolean {
  const pathname = usePathname();
  return pathname.endsWith("/case/new");
}

export function resetNewComparison(options?: { confirm?: boolean }) {
  if (options?.confirm !== false) {
    const ok = window.confirm(
      "Clear all fields and start over? Any unsaved edits on this comparison will be lost."
    );
    if (!ok) return false;
  }

  const onNewRoute = window.location.pathname.endsWith("/case/new");
  if (!onNewRoute) {
    window.location.assign("/case/new?fresh=1&step=current");
    return true;
  }

  useCaseStore.getState().resetCase();
  window.dispatchEvent(new CustomEvent("fleet-tco:cancel-autosave"));
  showToast("All fields cleared", "success");
  return true;
}

export function NewCaseResetButton() {
  const router = useRouter();
  const isNewCase = useIsNewCaseRoute();

  if (!isNewCase) return null;

  const handleReset = () => {
    if (!resetNewComparison()) return;
    router.replace("/case/new?step=current", { scroll: false });
  };

  return (
    <Button variant="outline" size="sm" onClick={handleReset}>
      <RotateCcw className="mr-2 h-4 w-4" />
      Clear all fields
    </Button>
  );
}

export function NewCaseResetBar() {
  const isNewCase = useIsNewCaseRoute();

  if (!isNewCase) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3">
      <p className="text-sm text-muted-foreground">
        New comparison — enter your own vehicle details below. Clear anytime to start over.
      </p>
      <NewCaseResetButton />
    </div>
  );
}
