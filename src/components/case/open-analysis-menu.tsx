"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { scenarioRepository } from "@/lib/db";
import type { ScenarioRecord } from "@/engine/types";
import { previewScenario, sortScenariosByUpdated } from "@/lib/scenario-preview";
import { useOpenScenario } from "@/hooks/use-open-scenario";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { FolderOpen, Plus, ChevronDown, LayoutGrid } from "lucide-react";

export function OpenAnalysisMenu() {
  const [open, setOpen] = useState(false);
  const [scenarios, setScenarios] = useState<ScenarioRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const openScenario = useOpenScenario();
  const containerRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await scenarioRepository.list();
    setScenarios(sortScenariosByUpdated(list).slice(0, 8));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    void refresh();
  }, [open, refresh]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleOpen = (record: ScenarioRecord) => {
    openScenario(record);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        size="sm"
        className="px-2 sm:px-3"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Open saved analysis"
      >
        <FolderOpen className="h-4 w-4 sm:mr-2" />
        <span className="hidden sm:inline">Open analysis</span>
        <ChevronDown className="ml-1 hidden h-4 w-4 opacity-60 sm:inline" />
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-border bg-card p-2 shadow-lg">
          <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Saved on this device
          </p>
          {loading ? (
            <p className="px-2 py-4 text-sm text-muted-foreground">Loading…</p>
          ) : scenarios.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground">
              <p>No saved analyses yet.</p>
              <Button asChild variant="ghost" size="sm" className="mt-2 h-auto justify-start px-0" onClick={() => setOpen(false)}>
                <Link href="/case/new?fresh=1">Start a new comparison</Link>
              </Button>
            </div>
          ) : (
            <ul className="max-h-72 overflow-y-auto" role="listbox">
              {scenarios.map((scenario) => {
                const preview = previewScenario(scenario.snapshot);
                return (
                  <li key={scenario.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      className="flex w-full flex-col gap-0.5 rounded-md px-2 py-2 text-left hover:bg-muted"
                      onClick={() => handleOpen(scenario)}
                    >
                      <span className="text-sm font-medium leading-snug">{scenario.name}</span>
                      <span className="text-xs text-muted-foreground">{preview.vehicleComparison}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(preview.monthlySaving)}/mo · Score {preview.investmentScore}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
            <Button asChild variant="ghost" size="sm" className="justify-start" onClick={() => setOpen(false)}>
              <Link href="/cases">
                <LayoutGrid className="mr-2 h-4 w-4" />
                View all analyses
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="justify-start" onClick={() => setOpen(false)}>
              <Link href="/case/new?fresh=1">
                <Plus className="mr-2 h-4 w-4" />
                New comparison
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
