"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCaseStore, WIZARD_STEPS, type WizardStep } from "@/store/case-store";
import { getNextStep, getPrevStep } from "@/lib/wizard-steps";
import { useWizardStepAdvance } from "@/hooks/use-wizard-step-advance";
import { CaseRouteSync } from "@/components/providers/case-route-sync";

const VALID_STEPS = new Set<WizardStep>(WIZARD_STEPS.map((s) => s.id));

function WorkflowSyncInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeStep = useCaseStore((s) => s.activeStep);
  const workflowMode = useCaseStore((s) => s.workflowMode);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);
  const { advanceFromStep } = useWizardStepAdvance();

  useEffect(() => {
    const stepParam = searchParams.get("step") as WizardStep | null;
    if (stepParam && VALID_STEPS.has(stepParam)) {
      setActiveStep(stepParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate step from URL once on load
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("step") === activeStep) return;
    params.set("step", activeStep);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [activeStep, pathname, router]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("fleet-tco:save"));
        return;
      }
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowRight" || e.key === "]") {
        const next = getNextStep(activeStep, workflowMode);
        if (next) {
          e.preventDefault();
          void advanceFromStep(activeStep);
        }
      }
      if (e.key === "ArrowLeft" || e.key === "[") {
        const prev = getPrevStep(activeStep, workflowMode);
        if (prev) {
          e.preventDefault();
          setActiveStep(prev);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeStep, workflowMode, setActiveStep, advanceFromStep]);

  return null;
}

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CaseRouteSync />
      <Suspense fallback={null}>
        <WorkflowSyncInner />
      </Suspense>
      {children}
    </>
  );
}
