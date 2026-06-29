"use client";

import { AppShell } from "@/components/layout/app-shell";
import { CaseWorkspace } from "@/components/case-workspace";
import { WorkflowProvider } from "@/components/providers/workflow-provider";

export default function EmbedCasePage() {
  return (
    <WorkflowProvider>
      <AppShell variant="embed">
        <CaseWorkspace />
      </AppShell>
    </WorkflowProvider>
  );
}
