"use client";

import { useEffect, useState, useCallback } from "react";
import { useCaseStore } from "@/store/case-store";
import { scenarioRepository } from "@/lib/db";
import type { ScenarioRecord } from "@/engine/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SCENARIO_TAGS } from "@/store/defaults";
import { Copy, Trash2, FolderOpen, Save } from "lucide-react";
import { ScenarioComparisonTable } from "./scenario-comparison-table";

export function ScenarioManager() {
  const [scenarios, setScenarios] = useState<ScenarioRecord[]>([]);
  const input = useCaseStore((s) => s.input);
  const caseId = useCaseStore((s) => s.caseId);
  const caseName = useCaseStore((s) => s.caseName);
  const tags = useCaseStore((s) => s.tags);
  const setCaseId = useCaseStore((s) => s.setCaseId);
  const setCaseName = useCaseStore((s) => s.setCaseName);
  const setTags = useCaseStore((s) => s.setTags);
  const loadCase = useCaseStore((s) => s.loadCase);

  const refresh = useCallback(async () => {
    const list = await scenarioRepository.list();
    setScenarios(list);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleSave = async () => {
    const now = new Date().toISOString();
    const id = caseId ?? crypto.randomUUID();
    const record: ScenarioRecord = {
      id,
      name: caseName,
      tags,
      createdAt: scenarios.find((s) => s.id === id)?.createdAt ?? now,
      updatedAt: now,
      snapshot: input,
    };
    await scenarioRepository.save(record);
    setCaseId(id);
    await refresh();
  };

  const handleLoad = async (id: string) => {
    const record = await scenarioRepository.get(id);
    if (record) {
      loadCase(record.snapshot, { id: record.id, name: record.name, tags: record.tags });
    }
  };

  const handleDuplicate = async (id: string) => {
    const original = scenarios.find((s) => s.id === id);
    const duplicate = await scenarioRepository.duplicate(id, `${original?.name ?? "Scenario"} (Copy)`);
    await refresh();
    loadCase(duplicate.snapshot, { id: duplicate.id, name: duplicate.name, tags: duplicate.tags });
  };

  const handleDelete = async (id: string) => {
    await scenarioRepository.delete(id);
    if (caseId === id) setCaseId(null);
    await refresh();
  };

  const toggleTag = (tag: string) => {
    setTags(tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Scenario Comparison</h2>
        <p className="text-sm text-muted-foreground">Save, duplicate, and manage business case scenarios.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Scenario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={caseName} onChange={(e) => setCaseName(e.target.value)} placeholder="Scenario name" />
          <div className="flex flex-wrap gap-2">
            {SCENARIO_TAGS.map((tag) => (
              <button key={tag} type="button" onClick={() => toggleTag(tag)}>
                <Badge variant={tags.includes(tag) ? "default" : "outline"}>{tag}</Badge>
              </button>
            ))}
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Scenario
          </Button>
        </CardContent>
      </Card>

      <ScenarioComparisonTable />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className={caseId === scenario.id ? "border-accent" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{scenario.name}</CardTitle>
              <p className="text-xs text-muted-foreground">
                Updated {new Date(scenario.updatedAt).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {scenario.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleLoad(scenario.id)}>
                  <FolderOpen className="mr-1 h-3 w-3" /> Load
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDuplicate(scenario.id)}>
                  <Copy className="mr-1 h-3 w-3" /> Duplicate
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(scenario.id)}>
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {scenarios.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">No saved scenarios yet. Save your current case to get started.</p>
        )}
      </div>
    </div>
  );
}
