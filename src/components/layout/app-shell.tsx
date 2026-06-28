"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { AppHeader } from "./app-header";
import { PresentationView } from "@/components/decision/presentation-view";
import { useCaseStore } from "@/store/case-store";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const presentationMode = useCaseStore((s) => s.presentationMode);

  if (presentationMode) {
    return <PresentationView />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:block no-print">
        <Sidebar />
      </div>
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader onMenuClick={() => setMobileOpen(true)} />
        <main className={cn("flex-1 overflow-y-auto p-4 lg:p-6")}>{children}</main>
      </div>
    </div>
  );
}
