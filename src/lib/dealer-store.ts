import { getDealerProfile, getVehiclePresetsForDealer, type VehiclePreset } from "@/config/dealers/profiles";
import { APP_NAME, DEVELOPER_NAME, DEVELOPER_URL, type ExportBranding } from "@/lib/brand";

const STORAGE_KEY = "switchsave-dealer-settings";

export interface DealerSettings {
  dealerId: string | null;
  consultantName: string;
}

const DEFAULT_SETTINGS: DealerSettings = {
  dealerId: null,
  consultantName: "",
};

export function loadDealerSettings(): DealerSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<DealerSettings>;
    return {
      dealerId: parsed.dealerId ?? null,
      consultantName: parsed.consultantName ?? "",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveDealerSettings(settings: DealerSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent("switchsave:dealer-changed"));
}

export function setActiveDealerId(dealerId: string | null): void {
  const current = loadDealerSettings();
  saveDealerSettings({ ...current, dealerId });
}

export function setConsultantName(consultantName: string): void {
  const current = loadDealerSettings();
  saveDealerSettings({ ...current, consultantName });
}

export function getActiveVehiclePresets(): VehiclePreset[] {
  const { dealerId } = loadDealerSettings();
  return getVehiclePresetsForDealer(dealerId);
}

export function getExportBranding(): ExportBranding {
  const { dealerId, consultantName } = loadDealerSettings();
  const profile = dealerId ? getDealerProfile(dealerId) : undefined;
  return {
    appName: APP_NAME,
    developerName: DEVELOPER_NAME,
    developerUrl: DEVELOPER_URL,
    dealerName: profile?.name,
    dealerTagline: profile?.tagline,
    consultantName: consultantName.trim() || undefined,
  };
}
