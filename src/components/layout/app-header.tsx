"use client";

import { useCaseStore } from "@/store/case-store";
import { ThemeToggle } from "./theme-toggle";
import { Menu, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  onMenuClick?: () => void;
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const caseName = useCaseStore((s) => s.caseName);
  const tags = useCaseStore((s) => s.tags);
  const setPresentationMode = useCaseStore((s) => s.setPresentationMode);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6 no-print">
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
  );
}
