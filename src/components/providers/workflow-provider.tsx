"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCaseStore, WIZARD_STEPS, type WizardStep } from "@/store/case-store";

const VALID_STEPS = new Set<WizardStep>(WIZARD_STEPS.map((s) => s.id));

function WorkflowSyncInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const activeStep = useCaseStore((s) => s.activeStep);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);

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
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return null;
}

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <WorkflowSyncInner />
      </Suspense>
      {children}
    </>
  );
}
