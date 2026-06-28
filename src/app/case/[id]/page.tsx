"use client";

import { AppShell } from "@/components/layout/app-shell";
import { CaseWorkspace } from "@/components/case-workspace";
import { WorkflowProvider } from "@/components/providers/workflow-provider";
import { OnboardingOverlay } from "@/components/onboarding/onboarding-overlay";

export default function CasePage() {
  return (
    <WorkflowProvider>
      <AppShell>
        <CaseWorkspace />
      </AppShell>
      <OnboardingOverlay />
    </WorkflowProvider>
  );
}
