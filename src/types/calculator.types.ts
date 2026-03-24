export interface LoadResult {
  peakWatts: number;
  dayWh: number;
  nightWh: number;
  totalWh: number;
}

export interface InverterResult {
  calculatedKva: number;
  recommendedKva: number;
  type: "Hybrid Inverter" | "Standard Inverter";
  reason: string;
}

export interface BatteryResult {
  voltage: 12 | 24 | 48;
  totalAh: number;
  kwh: number;
  recommendedBatteryAh: 100 | 200;
  parallelStrings: number;
  seriesCount: number;
  totalBatteries: number;
  reason: string;
}

export interface SolarResult {
  calculatedWatts: number;
  recommendedPanelWatt: number;
  panelCount: number;
  totalCapacity: number;
  reason: string;
}

export interface SystemResult {
  load: LoadResult;
  inverter: InverterResult;
  battery: BatteryResult;
  solar: SolarResult;
}

export interface SystemTemplate {
  _id?: string;
  name: string;
  inverterRating: number;
  batteryVoltage: 12 | 24 | 48;
  panelEfficiencyFactor: number;
  peakSunHours: number;
  batteryDoD: number;
}
