import Dexie, { type EntityTable } from "dexie";
import type { BusinessCaseInput, ScenarioRecord } from "@/engine/types";

export interface ScenarioEntity {
  id: string;
  name: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  snapshot: BusinessCaseInput;
  workflowMode?: "quick" | "full";
}

class FinCompDatabase extends Dexie {
  scenarios!: EntityTable<ScenarioEntity, "id">;

  constructor() {
    super("FinCompDB");
    this.version(1).stores({
      scenarios: "id, name, updatedAt",
    });
  }
}

export const db = typeof window !== "undefined" ? new FinCompDatabase() : null;

export interface IScenarioRepository {
  list(): Promise<ScenarioRecord[]>;
  get(id: string): Promise<ScenarioRecord | undefined>;
  save(record: ScenarioRecord): Promise<void>;
  delete(id: string): Promise<void>;
  duplicate(id: string, newName: string): Promise<ScenarioRecord>;
}

class DexieScenarioRepository implements IScenarioRepository {
  async list(): Promise<ScenarioRecord[]> {
    if (!db) return [];
    const rows = await db.scenarios.orderBy("updatedAt").reverse().toArray();
    return rows.map(toRecord);
  }

  async get(id: string): Promise<ScenarioRecord | undefined> {
    if (!db) return undefined;
    const row = await db.scenarios.get(id);
    return row ? toRecord(row) : undefined;
  }

  async save(record: ScenarioRecord): Promise<void> {
    if (!db) return;
    await db.scenarios.put({
      id: record.id,
      name: record.name,
      tags: record.tags,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      snapshot: record.snapshot,
      workflowMode: record.workflowMode,
    });
  }

  async delete(id: string): Promise<void> {
    if (!db) return;
    await db.scenarios.delete(id);
  }

  async duplicate(id: string, newName: string): Promise<ScenarioRecord> {
    const original = await this.get(id);
    if (!original) throw new Error("Scenario not found");
    const now = new Date().toISOString();
    const duplicate: ScenarioRecord = {
      ...original,
      id: crypto.randomUUID(),
      name: newName,
      createdAt: now,
      updatedAt: now,
    };
    await this.save(duplicate);
    return duplicate;
  }
}

function toRecord(entity: ScenarioEntity): ScenarioRecord {
  return {
    id: entity.id,
    name: entity.name,
    tags: entity.tags,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    snapshot: entity.snapshot,
    workflowMode: entity.workflowMode,
  };
}

export const scenarioRepository: IScenarioRepository = new DexieScenarioRepository();
