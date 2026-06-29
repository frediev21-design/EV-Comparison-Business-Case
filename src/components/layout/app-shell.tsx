"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { AppHeader } from "./app-header";
import { SiteFooter } from "./site-footer";
import { DataPersistenceBanner } from "./data-persistence-banner";
import { CaseNotFoundBanner } from "@/components/case/case-not-found-banner";
import { PresentationView } from "@/components/decision/presentation-view";
import { useCaseStore } from "@/store/case-store";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  variant?: "default" | "embed";
}

export function AppShell({ children, variant = "default" }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const presentationMode = useCaseStore((s) => s.presentationMode);
  const embedSession = useCaseStore((s) => s.embedSession);
  const isEmbed = variant === "embed" || embedSession;

  if (presentationMode) {
    return <PresentationView />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden lg:block no-print">
        <Sidebar embed={isEmbed} />
      </div>
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar embed={isEmbed} onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader embed={isEmbed} onMenuClick={() => setMobileOpen(true)} />
        {!isEmbed && <DataPersistenceBanner />}
        <main className={cn("flex-1 overflow-y-auto p-4 lg:p-6")}>
          <CaseNotFoundBanner />
          {children}
        </main>
        {!isEmbed && <SiteFooter className="no-print" />}
      </div>
    </div>
  );
}
