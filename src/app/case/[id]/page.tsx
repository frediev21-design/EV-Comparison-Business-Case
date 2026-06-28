"use client";

import { AppShell } from "@/components/layout/app-shell";
import { CaseWorkspace } from "@/components/case-workspace";

export default function CasePage() {
  return (
    <AppShell>
      <CaseWorkspace />
    </AppShell>
  );
}
