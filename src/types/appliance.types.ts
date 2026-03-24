export interface IAppliance {
  _id?: string;
  id: string;
  name: string;
  defaultWattage: number;
  category: ApplianceCategory;
  icon: string;
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
  source?: "db" | "ai" | "es";
}

export type ApplianceCategory =
  | "Lighting" | "Cooling" | "Kitchen" | "Entertainment"
  | "Office" | "Laundry" | "Utility" | "Security"
  | "Personal" | "Business" | "Medical" | "Industrial";
