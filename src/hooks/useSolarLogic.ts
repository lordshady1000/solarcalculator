"use client";
import { useMemo } from "react";
import { useSolarStore } from "@/store/solarStore";
import { calculateTotalLoad } from "@/utils/calculator";

export function useSolarLogic() {
  const selectedAppliances = useSolarStore(s => s.selectedAppliances);
  const expansionMode = useSolarStore(s => s.expansionMode);
  const systemResults = useSolarStore(s => s.systemResults);
  const runCalculation = useSolarStore(s => s.runCalculation);

  const liveLoad = useMemo(() => {
    if (!selectedAppliances.length) return null;
    return calculateTotalLoad(selectedAppliances);
  }, [selectedAppliances]);

  return { selectedAppliances, expansionMode, systemResults, liveLoad, hasAppliances: selectedAppliances.length > 0, hasResults: !!systemResults, runCalculation };
}
