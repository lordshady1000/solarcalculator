import { APPLIANCE_CATEGORIES } from "./constants";

export function validateApplianceInput(input: {
  wattage?: number; quantity?: number; hoursDay?: number; hoursNight?: number;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (input.wattage !== undefined) {
    if (input.wattage < 0) errors.push("Wattage cannot be negative");
    if (input.wattage > 50000) errors.push("Wattage exceeds maximum (50,000W)");
  }
  if (input.quantity !== undefined) {
    if (input.quantity < 0) errors.push("Quantity cannot be negative");
    if (input.quantity > 100) errors.push("Quantity exceeds maximum (100)");
    if (!Number.isInteger(input.quantity)) errors.push("Quantity must be a whole number");
  }
  if (input.hoursDay !== undefined) {
    if (input.hoursDay < 0) errors.push("Day hours cannot be negative");
    if (input.hoursDay > 16) errors.push("Day hours cannot exceed 16");
  }
  if (input.hoursNight !== undefined) {
    if (input.hoursNight < 0) errors.push("Night hours cannot be negative");
    if (input.hoursNight > 12) errors.push("Night hours cannot exceed 12");
  }
  if (input.hoursDay !== undefined && input.hoursNight !== undefined && input.hoursDay + input.hoursNight > 24) {
    errors.push("Total hours (day + night) cannot exceed 24");
  }
  return { valid: errors.length === 0, errors };
}

export function isValidCategory(category: string): boolean {
  return (APPLIANCE_CATEGORIES as readonly string[]).includes(category);
}

export function sanitizeSearch(query: string): string {
  return query.trim().replace(/[^\w\s.-]/g, "").slice(0, 100);
}
