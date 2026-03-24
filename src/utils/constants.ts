export const PEAK_SUN_HOURS = 4.5;
export const BATTERY_DOD = 0.85;
export const SYSTEM_LOSSES = 1.2;
export const SURGE_FACTOR = 1.25;
export const EXPANSION_MULTIPLIER = 1.5;
export const EXPANSION_BATTERY_MULT = 1.25;
export const STANDARD_INVERTER_KVA = [1, 1.5, 2, 3, 3.5, 5, 6, 8, 10, 15, 20, 25, 30];
export const STANDARD_BATTERY_AH = [100, 200] as const;
export const STANDARD_PANEL_WATT = 500;
export const DEFAULT_HOURS_DAY = 4;
export const DEFAULT_HOURS_NIGHT = 2;
export const DEFAULT_QUANTITY = 1;

export const APPLIANCE_CATEGORIES = [
  "Lighting", "Cooling", "Kitchen", "Entertainment", "Office",
  "Laundry", "Utility", "Security", "Personal", "Business",
  "Medical", "Industrial",
] as const;
