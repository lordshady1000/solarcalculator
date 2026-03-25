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

/**
 * Calculates the maximum possible surge wattage.
 * This is the worst-case scenario where all motor loads start simultaneously.
 * We use the HIGHEST single-appliance surge + running watts of everything else,
 * which is more realistic than assuming all motors start at the exact same moment.
 */
function calculateSurgeWatts(appliances: ISelectedAppliance[]): number {
  if (appliances.length === 0) return 0;

  // Calculate total running watts
  const totalRunning = appliances.reduce((sum, a) => sum + a.customWattage * a.quantity, 0);

  // Find the highest single-appliance surge ABOVE its running watts
  let maxSurgeExtra = 0;
  for (const a of appliances) {
    const running = a.customWattage * a.quantity;
    const surgeTotal = running * (a.surgeMultiplier || 1.0);
    const surgeExtra = surgeTotal - running; // The extra watts needed on startup
    if (surgeExtra > maxSurgeExtra) {
      maxSurgeExtra = surgeExtra;
    }
  }

  // Worst case: everything running + biggest motor starting up
  return totalRunning + maxSurgeExtra;
}

/**
 * Sizes the inverter using SURGE watts (not just running watts).
 * This ensures the inverter can handle motor startup surges from ACs, pumps, etc.
 */
export function sizeInverter(appliances: ISelectedAppliance[], expansionMode: boolean): InverterResult {
  const runningWatts = appliances.reduce((sum, a) => sum + a.customWattage * a.quantity, 0);
  const surgeWatts = calculateSurgeWatts(appliances);

  // Use the higher of: surge watts OR running watts × generic surge factor
  const effectivePeak = Math.max(surgeWatts, runningWatts * SURGE_FACTOR);
  const withExpansion = expansionMode ? effectivePeak * EXPANSION_MULTIPLIER : effectivePeak;

  // Convert watts to kVA (assuming power factor ~0.8 for mixed loads)
  const kva = Math.ceil((withExpansion / 800) * 10) / 10;

  const recommendedKva = STANDARD_INVERTER_KVA.find(s => s >= kva) || STANDARD_INVERTER_KVA[STANDARD_INVERTER_KVA.length - 1];

  const hasMotorLoads = appliances.some(a => (a.surgeMultiplier || 1) >= 2.5);
  const type: InverterResult["type"] = expansionMode || hasMotorLoads || runningWatts > 3000 ? "Hybrid Inverter" : "Standard Inverter";

  const reason = expansionMode
    ? `Hybrid inverter sized for ${(surgeWatts/1000).toFixed(1)}kW surge (motor startups) with 1.5× expansion buffer.`
    : `Sized for ${(surgeWatts/1000).toFixed(1)}kW peak surge — accounts for motor startup currents (ACs: 4×, pumps: 4×, fridges: 3.5×).`;

  return { calculatedKva: kva, recommendedKva, type, reason };
}

export function sizeBatteryBank(nightWh: number, peakWatts: number, expansionMode: boolean): BatteryResult {
  // Minimum buffer: 2 hours of peak load — covers morning ramp-up,
  // afternoon decline, and cloud cover dips even for daytime-only setups.
  const BUFFER_HOURS = 2;
  const minimumWh = peakWatts * BUFFER_HOURS;

  // Use the greater of: actual night usage OR minimum daytime buffer
  const effectiveWh = Math.max(nightWh, minimumWh);
  const isDaytimeBuffer = nightWh < minimumWh;

  const voltage: BatteryResult["voltage"] = expansionMode ? 48 : effectiveWh > 3000 ? 48 : effectiveWh > 1500 ? 24 : 12;
  const withLosses = effectiveWh * SYSTEM_LOSSES;
  const withExpansion = expansionMode ? withLosses * EXPANSION_BATTERY_MULT : withLosses;
  const totalAh = Math.ceil(withExpansion / (voltage * BATTERY_DOD));
  const recommendedBatteryAh: 100 | 200 = totalAh > 100 ? 200 : 100;
  const parallelStrings = Math.ceil(totalAh / recommendedBatteryAh);
  const seriesCount = voltage === 48 ? 4 : voltage === 24 ? 2 : 1;
  const kwh = Math.round((totalAh * voltage) / 1000 * 10) / 10;

  let reason: string;
  if (isDaytimeBuffer) {
    reason = `Even with daytime-only usage, batteries are essential. Solar panels don't produce full power before 10am, after 3pm, or during cloud cover. This ${kwh}kWh bank provides a ${BUFFER_HOURS}-hour buffer (${(minimumWh/1000).toFixed(1)}kWh) so your ${(peakWatts/1000).toFixed(1)}kW load runs smoothly all day — the inverter pulls from batteries when panel output dips and recharges them when the sun is strong.`;
  } else {
    reason = expansionMode
      ? `48V architecture for scalability. ${EXPANSION_BATTERY_MULT}× buffer. ${BATTERY_DOD * 100}% DoD (LiFePO4).`
      : `${voltage}V system for your load. ${BATTERY_DOD * 100}% DoD ensures long cycle life with LiFePO4 batteries. Covers ${(nightWh/1000).toFixed(1)}kWh night usage.`;
  }

  return { voltage, totalAh, kwh, recommendedBatteryAh, parallelStrings, seriesCount, totalBatteries: parallelStrings * seriesCount, reason };
}

export function sizeSolarArray(dayWh: number, nightWh: number, expansionMode: boolean): SolarResult {
  const totalDaily = (dayWh + nightWh) * SYSTEM_LOSSES;
  const withExpansion = expansionMode ? totalDaily * EXPANSION_BATTERY_MULT : totalDaily;
  const calculatedWatts = Math.ceil(withExpansion / PEAK_SUN_HOURS);
  const panelCount = Math.ceil(calculatedWatts / STANDARD_PANEL_WATT);
  const totalCapacity = panelCount * STANDARD_PANEL_WATT;
  const reason = expansionMode
    ? `Array sized with ${EXPANSION_BATTERY_MULT}× expansion headroom. Based on ${PEAK_SUN_HOURS}h peak sun.`
    : `Panels sized to recharge batteries and sustain daytime loads within ${PEAK_SUN_HOURS} peak sun hours.`;
  return { calculatedWatts, recommendedPanelWatt: STANDARD_PANEL_WATT, panelCount, totalCapacity, reason };
}

export function calculateSystem(appliances: ISelectedAppliance[], expansionMode: boolean): SystemResult {
  const load = calculateTotalLoad(appliances);
  return {
    load,
    inverter: sizeInverter(appliances, expansionMode),
    battery: sizeBatteryBank(load.nightWh, load.peakWatts, expansionMode),
    solar: sizeSolarArray(load.dayWh, load.nightWh, expansionMode),
  };
}