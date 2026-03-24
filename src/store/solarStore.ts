"use client";
import { create } from "zustand";
import type { ISelectedAppliance, IAppliance, SystemResult } from "@/types";
import { calculateSystem } from "@/utils/calculator";
import { DEFAULT_HOURS_DAY, DEFAULT_HOURS_NIGHT, DEFAULT_QUANTITY } from "@/utils/constants";

interface SolarStore {
  selectedAppliances: ISelectedAppliance[];
  expansionMode: boolean;
  systemResults: SystemResult | null;
  addAppliance: (appliance: IAppliance, source?: "db" | "ai" | "es") => void;
  removeAppliance: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateField: (id: string, field: keyof ISelectedAppliance, value: number) => void;
  toggleExpansion: () => void;
  runCalculation: () => void;
  clearAll: () => void;
}

export const useSolarStore = create<SolarStore>((set, get) => ({
  selectedAppliances: [],
  expansionMode: false,
  systemResults: null,

  addAppliance: (appliance, source = "db") => {
    const { selectedAppliances } = get();
    const exists = selectedAppliances.find(s => s.id === appliance.id);
    if (exists) {
      set({ selectedAppliances: selectedAppliances.map(s =>
        s.id === appliance.id ? { ...s, quantity: s.quantity + 1 } : s
      )});
      return;
    }
    set({ selectedAppliances: [...selectedAppliances, {
      id: appliance.id, name: appliance.name, icon: appliance.icon,
      category: appliance.category, quantity: DEFAULT_QUANTITY,
      hoursDay: DEFAULT_HOURS_DAY, hoursNight: DEFAULT_HOURS_NIGHT,
      customWattage: appliance.defaultWattage, defaultWattage: appliance.defaultWattage,
      source,
    }]});
  },

  removeAppliance: (id) => set(s => ({ selectedAppliances: s.selectedAppliances.filter(x => x.id !== id) })),

  updateQuantity: (id, delta) => set(s => ({
    selectedAppliances: s.selectedAppliances.map(x => x.id === id ? { ...x, quantity: Math.max(1, x.quantity + delta) } : x)
  })),

  updateField: (id, field, value) => set(s => ({
    selectedAppliances: s.selectedAppliances.map(x => x.id === id ? { ...x, [field]: Math.max(0, value) } : x)
  })),

  toggleExpansion: () => set(s => ({ expansionMode: !s.expansionMode })),

  runCalculation: () => {
    const { selectedAppliances, expansionMode } = get();
    if (!selectedAppliances.length) { set({ systemResults: null }); return; }
    set({ systemResults: calculateSystem(selectedAppliances, expansionMode) });
  },

  clearAll: () => set({ selectedAppliances: [], systemResults: null }),
}));
