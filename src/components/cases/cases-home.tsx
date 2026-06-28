"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { scenarioRepository } from "@/lib/db";
import type { ScenarioRecord } from "@/engine/types";
import { sortScenariosByUpdated } from "@/lib/scenario-preview";
import { CaseCard } from "./case-card";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { showToast } from "@/lib/toast";
import { ArrowRight, FolderOpen, Plus } from "lucide-react";

export function CasesHome() {
  const [scenarios, setScenarios] = useState<ScenarioRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await scenarioRepository.list();
    setScenarios(sortScenariosByUpdated(list));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await scenarioRepository.delete(id);
    showToast("Analysis deleted", "success");
    await refresh();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 lg:px-6">
          <Link href="/" className="font-semibold tracking-tight hover:opacity-80">
            Fleet EV TCO
          </Link>
          <Button asChild>
            <Link href="/case/new?fresh=1">
              <Plus className="mr-2 h-4 w-4" />
              New analysis
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 lg:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">My analyses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved on this device. Resume where you left off or start a new comparison.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading saved analyses…</p>
        ) : scenarios.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
            <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">No saved analyses yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Start a new comparison — your progress saves automatically as you complete each step.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/case/new?fresh=1">
                Start free analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {scenarios.map((scenario) => (
              <CaseCard key={scenario.id} scenario={scenario} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
