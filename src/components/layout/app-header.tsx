"use client";

import { useCaseStore } from "@/store/case-store";
import { ThemeToggle } from "./theme-toggle";
import { Menu, Presentation, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasWhatIfOverrides } from "@/lib/wizard-steps";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const caseName = useCaseStore((s) => s.caseName);
  const tags = useCaseStore((s) => s.tags);
  const whatIf = useCaseStore((s) => s.input.whatIf);
  const resetWhatIf = useCaseStore((s) => s.resetWhatIf);
  const setPresentationMode = useCaseStore((s) => s.setPresentationMode);

  const whatIfActive = hasWhatIfOverrides(whatIf);

  return (
    <div className="sticky top-0 z-30 no-print">
      {whatIfActive && (
        <div className="flex items-center justify-between gap-2 border-b border-warning/30 bg-warning/10 px-4 py-1.5 text-sm lg:px-6">
          <div className="flex items-center gap-2 text-warning-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>What-If overrides active — KPIs reflect adjusted assumptions</span>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetWhatIf}>
            <X className="mr-1 h-3 w-3" />
            Reset All
          </Button>
        </div>
      )}
      <header className="flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-sm font-semibold lg:text-base">{caseName}</h1>
            <p className="text-xs text-muted-foreground">{tags.join(" · ")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => setPresentationMode(true)}>
            <Presentation className="mr-2 h-4 w-4" />
            Present
          </Button>
          <ThemeToggle />
        </div>
      </header>
    </div>
  );
}
