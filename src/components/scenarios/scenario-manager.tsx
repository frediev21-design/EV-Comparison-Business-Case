"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useCaseStore } from "@/store/case-store";
import { scenarioRepository } from "@/lib/db";
import type { ScenarioRecord } from "@/engine/types";
import { exportCaseToJson, downloadCaseJson, parseCaseImport, exportScenarioBundle, downloadScenarioBundle, parseScenarioBundle } from "@/lib/scenario-io";
import { useScenarioSave } from "@/hooks/use-scenario-save";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SCENARIO_TAGS } from "@/store/defaults";
import { Copy, Trash2, FolderOpen, Save, Download, Upload } from "lucide-react";
import { ScenarioComparisonTable } from "./scenario-comparison-table";
import { showToast } from "@/lib/toast";

export function ScenarioManager() {
  const [scenarios, setScenarios] = useState<ScenarioRecord[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bundleInputRef = useRef<HTMLInputElement>(null);
  const input = useCaseStore((s) => s.input);
  const caseId = useCaseStore((s) => s.caseId);
  const caseName = useCaseStore((s) => s.caseName);
  const tags = useCaseStore((s) => s.tags);
  const setCaseId = useCaseStore((s) => s.setCaseId);
  const setCaseName = useCaseStore((s) => s.setCaseName);
  const setTags = useCaseStore((s) => s.setTags);
  const loadCase = useCaseStore((s) => s.loadCase);
  const saveScenario = useScenarioSave();

  const refresh = useCallback(async () => {
    const list = await scenarioRepository.list();
    setScenarios(list);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => {
      saveScenario({ message: "Scenario saved" }).then(() => refresh());
    };
    window.addEventListener("fleet-tco:save", handler);
    return () => window.removeEventListener("fleet-tco:save", handler);
  }, [saveScenario, refresh]);

  const handleSave = async () => {
    setSaving(true);
    setImportError(null);
    try {
      await saveScenario({ message: "Scenario saved" });
      await refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    setImportError(null);
    const data = exportCaseToJson(caseName, tags, input);
    downloadCaseJson(data, `${caseName.replace(/\s+/g, "-")}-export`);
    showToast("Export downloaded", "success");
  };

  const handleImport = async (file: File) => {
    try {
      setImportError(null);
      const text = await file.text();
      const data = parseCaseImport(text);
      loadCase(data.snapshot, { name: data.name, tags: data.tags });
      await refresh();
      showToast("Scenario imported", "success");
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Could not import file — check the JSON format.");
      showToast("Import failed", "error");
    }
  };

  const handleExportBundle = async () => {
    const saved = await scenarioRepository.list();
    const bundle = exportScenarioBundle(
      saved.map((s) => exportCaseToJson(s.name, s.tags, s.snapshot))
    );
    downloadScenarioBundle(bundle, "fleet-ev-scenarios-backup");
    showToast("Backup downloaded", "success");
  };

  const handleImportBundle = async (file: File) => {
    try {
      setImportError(null);
      const text = await file.text();
      const bundle = parseScenarioBundle(text);
      for (const scenario of bundle.scenarios) {
        const now = new Date().toISOString();
        await scenarioRepository.save({
          id: crypto.randomUUID(),
          name: scenario.name,
          tags: scenario.tags,
          createdAt: now,
          updatedAt: now,
          snapshot: {
            ...scenario.snapshot,
            assumptions: {
              ...scenario.snapshot.assumptions,
              fleetVehicleCount: scenario.snapshot.assumptions.fleetVehicleCount ?? 1,
            },
          },
        });
      }
      await refresh();
      showToast(`${bundle.scenarios.length} scenarios imported`, "success");
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Could not import bundle — check the JSON format.");
      showToast("Import failed", "error");
    }
  };

  const handleLoad = async (id: string) => {
    const record = await scenarioRepository.get(id);
    if (record) {
      loadCase(record.snapshot, {
        id: record.id,
        name: record.name,
        tags: record.tags,
        workflowMode: record.workflowMode ?? "full",
      });
    }
  };

  const handleDuplicate = async (id: string) => {
    const original = scenarios.find((s) => s.id === id);
    const duplicate = await scenarioRepository.duplicate(id, `${original?.name ?? "Scenario"} (Copy)`);
    await refresh();
    loadCase(duplicate.snapshot, { id: duplicate.id, name: duplicate.name, tags: duplicate.tags });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
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
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving…" : "Save Scenario"}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import JSON
          </Button>
          <Button variant="outline" onClick={handleExportBundle} disabled={scenarios.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button variant="outline" onClick={() => bundleInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Import All
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = "";
            }}
          />
          <input
            ref={bundleInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImportBundle(file);
              e.target.value = "";
            }}
          />
          <p className="text-xs text-muted-foreground">Tip: press Ctrl+S to save quickly.</p>
          {importError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {importError}
            </p>
          )}
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(scenario.id, scenario.name)}
                  aria-label={`Delete ${scenario.name}`}
                >
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
