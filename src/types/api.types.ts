export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AiLookupResult {
  name: string;
  wattage: number;
  category: string;
  icon: string;
  notes: string;
}

export interface EnergyStarResult {
  brand: string;
  model: string;
  annualKwh: number;
  watts: number;
}
