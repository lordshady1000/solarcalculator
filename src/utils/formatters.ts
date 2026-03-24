export function formatWattage(watts: number): string {
  return watts >= 1000 ? `${(watts / 1000).toFixed(1)} kW` : `${watts} W`;
}

export function formatWh(wh: number, decimals = 2): string {
  return `${(wh / 1000).toFixed(decimals)} kWh`;
}

export function formatAh(ah: number): string {
  return `${ah} Ah`;
}

export function formatKva(kva: number): string {
  return `${kva} kVA`;
}

export function formatBatteryConfig(parallel: number, series: number, total: number, ah: number): string {
  return `${parallel}P × ${series}S — ${total}× ${ah}Ah batteries`;
}

export function formatSolarArray(count: number, panelWatt: number): string {
  return `${count} × ${panelWatt}W (${(count * panelWatt).toLocaleString()}W total)`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString();
}
