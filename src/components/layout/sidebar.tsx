"use client";

import { cn } from "@/lib/utils";
import { WIZARD_STEPS, useCaseStore, type WizardStep } from "@/store/case-store";
import {
  BarChart3,
  Calculator,
  Car,
  FileText,
  Gauge,
  LayoutDashboard,
  LineChart,
  Shield,
  SlidersHorizontal,
  Sun,
  Wallet,
  ArrowLeftRight,
  FolderOpen,
  Brain,
  Globe,
} from "lucide-react";

const STEP_ICONS: Record<WizardStep, React.ComponentType<{ className?: string }>> = {
  current: Car,
  replacement: Car,
  "trade-in": ArrowLeftRight,
  finance: Wallet,
  "running-costs": Calculator,
  solar: Sun,
  ownership: Gauge,
  risk: Shield,
  dashboard: LayoutDashboard,
  decision: Brain,
  market: Globe,
  charts: LineChart,
  "what-if": SlidersHorizontal,
  scenarios: FolderOpen,
  reports: FileText,
};

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const activeStep = useCaseStore((s) => s.activeStep);
  const setActiveStep = useCaseStore((s) => s.setActiveStep);

  const groups = [
    { label: "Data Entry", steps: WIZARD_STEPS.slice(0, 8) },
    { label: "Analysis", steps: WIZARD_STEPS.filter((s) => ["dashboard", "decision", "market", "charts", "what-if"].includes(s.id)) },
    { label: "Management", steps: WIZARD_STEPS.filter((s) => ["scenarios", "reports"].includes(s.id)) },
  ];

  return (
    <aside className={cn("flex h-full w-64 flex-col border-r border-border bg-card", className)}>
      <div className="border-b border-border p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Fleet EV TCO</p>
            <p className="text-xs text-muted-foreground">Business Case Platform</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        {groups.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-1">
              {group.steps.map((step) => {
                const Icon = STEP_ICONS[step.id];
                const isActive = activeStep === step.id;
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveStep(step.id);
                        onNavigate?.();
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-accent/10 text-accent font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="truncate">{step.label}</span>
                      {step.step <= 8 && (
                        <span className="ml-auto text-xs opacity-60">{step.step}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
