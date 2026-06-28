"use client";

import { useEffect, useState } from "react";
import { useCaseStore } from "@/store/case-store";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Car, X } from "lucide-react";

const STORAGE_KEY = "fleet-ev-tco-onboarded";

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(false);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);
  const setWorkflowMode = useCaseStore((s) => s.setWorkflowMode);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  const startQuick = () => {
    setWorkflowMode("quick");
    useCaseStore.getState().resetCase();
    setActiveStep("current");
    dismiss();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <h2 className="text-xl font-bold">Welcome to Fleet EV TCO</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Compare your current vehicle with EV or hybrid replacements in a few steps.
        </p>
        <ol className="mt-6 space-y-4">
          {[
            { icon: Car, title: "Enter your current vehicle", text: "Loan instalment, fuel use, and trade value." },
            { icon: BarChart3, title: "Pick a replacement", text: "BYD Shark 6 is pre-loaded — or add your own." },
            { icon: ArrowRight, title: "Review the dashboard", text: "Monthly savings, payback, and investment score." },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">
          Your analysis saves on this device. Export from Scenarios to back up or switch browsers.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={startQuick}>
            Get started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={dismiss}>
            Skip tour
          </Button>
        </div>
      </div>
    </div>
  );
}
