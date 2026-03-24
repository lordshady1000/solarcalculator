import type { ISelectedAppliance, LoadResult, InverterResult, BatteryResult, SolarResult, SystemResult } from "@/types";
import {
  PEAK_SUN_HOURS, BATTERY_DOD, SYSTEM_LOSSES, SURGE_FACTOR,
  EXPANSION_MULTIPLIER, EXPANSION_BATTERY_MULT,
  STANDARD_INVERTER_KVA, STANDARD_PANEL_WATT,
} from "./constants";

export function calculateTotalLoad(appliances: ISelectedAppliance[]): LoadResult {
  let peakWatts = 0, dayWh = 0, nightWh = 0;
  for (const a of appliances) {
    const watts = a.customWattage * a.quantity;
    peakWatts += watts;
    dayWh += watts * a.hoursDay;
    nightWh += watts * a.hoursNight;
  }
  return { peakWatts, dayWh, nightWh, totalWh: dayWh + nightWh };
}

export function sizeInverter(peakWatts: number, expansionMode: boolean): InverterResult {
  const withSurge = peakWatts * SURGE_FACTOR;
  const withExpansion = expansionMode ? withSurge * EXPANSION_MULTIPLIER : withSurge;
  const kva = Math.ceil((withExpansion / 1000) * 10) / 10;
  const recommendedKva = STANDARD_INVERTER_KVA.find(s => s >= kva) || STANDARD_INVERTER_KVA[STANDARD_INVERTER_KVA.length - 1];
  const type: InverterResult["type"] = expansionMode || peakWatts > 3000 ? "Hybrid Inverter" : "Standard Inverter";
  const reason = expansionMode
    ? "Hybrid inverter selected for expansion compatibility. 1.5x capacity buffer applied for future loads."
    : "Standard inverter sized at 1.25x peak load to handle surge currents safely.";
  return { calculatedKva: kva, recommendedKva, type, reason };
}

export function sizeBatteryBank(nightWh: number, expansionMode: boolean): BatteryResult {
  const voltage: BatteryResult["voltage"] = expansionMode ? 48 : nightWh > 3000 ? 48 : nightWh > 1500 ? 24 : 12;
  const withLosses = nightWh * SYSTEM_LOSSES;
  const withExpansion = expansionMode ? withLosses * EXPANSION_BATTERY_MULT : withLosses;
  const totalAh = Math.ceil(withExpansion / (voltage * BATTERY_DOD));
  const recommendedBatteryAh: 100 | 200 = totalAh > 100 ? 200 : 100;
  const parallelStrings = Math.ceil(totalAh / recommendedBatteryAh);
  const seriesCount = voltage === 48 ? 4 : voltage === 24 ? 2 : 1;
  const kwh = Math.round((totalAh * voltage) / 1000 * 10) / 10;
  const reason = expansionMode
    ? `48V architecture chosen for scalability. ${EXPANSION_BATTERY_MULT}x buffer for future nighttime loads. ${BATTERY_DOD * 100}% DoD protects battery longevity.`
    : `${voltage}V system optimized for your load size. ${BATTERY_DOD * 100}% Depth of Discharge ensures 3000+ cycle battery life.`;
  return { voltage, totalAh, kwh, recommendedBatteryAh, parallelStrings, seriesCount, totalBatteries: parallelStrings * seriesCount, reason };
}

export function sizeSolarArray(dayWh: number, nightWh: number, expansionMode: boolean): SolarResult {
  const totalDaily = (dayWh + nightWh) * SYSTEM_LOSSES;
  const withExpansion = expansionMode ? totalDaily * EXPANSION_BATTERY_MULT : totalDaily;
  const calculatedWatts = Math.ceil(withExpansion / PEAK_SUN_HOURS);
  const panelCount = Math.ceil(calculatedWatts / STANDARD_PANEL_WATT);
  const totalCapacity = panelCount * STANDARD_PANEL_WATT;
  const reason = expansionMode
    ? `Array sized with ${EXPANSION_BATTERY_MULT}x expansion headroom. Based on ${PEAK_SUN_HOURS}h peak sun.`
    : `Panels sized to recharge batteries and sustain daytime loads within ${PEAK_SUN_HOURS} peak sun hours.`;
  return { calculatedWatts, recommendedPanelWatt: STANDARD_PANEL_WATT, panelCount, totalCapacity, reason };
}

export function calculateSystem(appliances: ISelectedAppliance[], expansionMode: boolean): SystemResult {
  const load = calculateTotalLoad(appliances);
  return {
    load,
    inverter: sizeInverter(load.peakWatts, expansionMode),
    battery: sizeBatteryBank(load.nightWh, expansionMode),
    solar: sizeSolarArray(load.dayWh, load.nightWh, expansionMode),
  };
}
