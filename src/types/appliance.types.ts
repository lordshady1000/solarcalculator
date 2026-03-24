export interface IAppliance {
  _id?: string;
  id: string;
  name: string;
  defaultWattage: number;
  category: ApplianceCategory;
  icon: string;
  surgeMultiplier?: number; // Motor loads: 3-5x. Default 1.0 for resistive loads.
}

export interface TimeSlot {
  from: number; // Hour 0-23
  to: number;   // Hour 0-23 (wraps past midnight if to < from)
}

export interface ISelectedAppliance {
  id: string;
  name: string;
  icon: string;
  category: string;
  quantity: number;
  hoursDay: number;
  hoursNight: number;
  customWattage: number;
  defaultWattage: number;
  surgeMultiplier: number;
  timeSlots: TimeSlot[];
  source?: "db" | "ai" | "es";
}

export type ApplianceCategory =
  | "Lighting" | "Cooling" | "Kitchen" | "Entertainment"
  | "Office" | "Laundry" | "Utility" | "Security"
  | "Personal" | "Business" | "Medical" | "Industrial";
