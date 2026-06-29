"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import {
  DEALER_PROFILES,
  getDealerProfile,
  getVehiclePresetsForDealer,
  type DealerProfile,
  type VehiclePreset,
} from "@/config/dealers/profiles";
import {
  loadDealerSettings,
  saveDealerSettings,
  type DealerSettings,
} from "@/lib/dealer-store";

interface DealerContextValue {
  settings: DealerSettings;
  profile: DealerProfile | null;
  vehiclePresets: VehiclePreset[];
  setDealerId: (dealerId: string | null) => void;
  setConsultantName: (name: string) => void;
}

const DealerContext = createContext<DealerContextValue | null>(null);

function DealerProviderInner({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [settings, setSettings] = useState<DealerSettings>(() => loadDealerSettings());

  useEffect(() => {
    const dealerParam = searchParams.get("dealer");
    if (dealerParam && getDealerProfile(dealerParam)) {
      const next = { ...loadDealerSettings(), dealerId: dealerParam };
      saveDealerSettings(next);
      setSettings(next);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = () => setSettings(loadDealerSettings());
    window.addEventListener("switchsave:dealer-changed", handler);
    return () => window.removeEventListener("switchsave:dealer-changed", handler);
  }, []);

  const setDealerId = useCallback((dealerId: string | null) => {
    const next = { ...loadDealerSettings(), dealerId };
    saveDealerSettings(next);
    setSettings(next);
  }, []);

  const setConsultantName = useCallback((consultantName: string) => {
    const next = { ...loadDealerSettings(), consultantName };
    saveDealerSettings(next);
    setSettings(next);
  }, []);

  const value = useMemo<DealerContextValue>(() => {
    const profile = settings.dealerId ? getDealerProfile(settings.dealerId) ?? null : null;
    return {
      settings,
      profile,
      vehiclePresets: getVehiclePresetsForDealer(settings.dealerId),
      setDealerId,
      setConsultantName,
    };
  }, [settings, setDealerId, setConsultantName]);

  return <DealerContext.Provider value={value}>{children}</DealerContext.Provider>;
}

export function DealerProvider({ children }: { children: ReactNode }) {
  return <DealerProviderInner>{children}</DealerProviderInner>;
}

export function useDealer() {
  const ctx = useContext(DealerContext);
  if (!ctx) {
    throw new Error("useDealer must be used within DealerProvider");
  }
  return ctx;
}

export function useVehiclePresets(): VehiclePreset[] {
  const { vehiclePresets } = useDealer();
  return vehiclePresets;
}

export { DEALER_PROFILES };
