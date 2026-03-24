"use client";
import { useSolarLogic } from "@/hooks";
import { useSolarStore } from "@/store/solarStore";
import { PEAK_SUN_HOURS, BATTERY_DOD, SYSTEM_LOSSES, SURGE_FACTOR, EXPANSION_BATTERY_MULT } from "@/utils/constants";
import { Zap, BarChart3, Battery, Sun, Info, ShoppingCart, ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";

interface ResultsDashboardProps {
  onShopSetup: () => void;
}

export default function ResultsDashboard({ onShopSetup }: ResultsDashboardProps) {
  const { systemResults: r } = useSolarLogic();
  const expansion = useSolarStore(s => s.expansionMode);

  if (!r) return null;

  const cards = [
    { Icon: Zap, label: "Total Load", value: `${(r.load.peakWatts / 1000).toFixed(1)} kW`, sub: `${(r.load.totalWh / 1000).toFixed(1)} kWh/day`, color: "#e67e22" },
    { Icon: BarChart3, label: "Inverter", value: `${r.inverter.recommendedKva} kVA`, sub: r.inverter.type, color: "#6366f1" },
    { Icon: Battery, label: "Battery Bank", value: `${r.battery.totalBatteries}× ${r.battery.recommendedBatteryAh}Ah`, sub: `${r.battery.kwh}kWh · ${r.battery.voltage}V · ${r.battery.parallelStrings}P×${r.battery.seriesCount}S`, color: "#10b981" },
    { Icon: Sun, label: "Solar Panels", value: `${r.solar.panelCount}× 500W`, sub: `${(r.solar.totalCapacity / 1000).toFixed(1)}kW system`, color: "#e67e22" },
  ];

  return (
    <div className="results fade-up">
      <h3 className="results__title">Your Solar <span className="text-gradient">Setup</span></h3>

      <div className="results__grid">
        {cards.map((c, i) => (
          <div key={i} className="result-box">
            <div className="result-box__icon" style={{ background: `${c.color}12` }}>
              <c.Icon size={24} color={c.color} />
            </div>
            <span className="result-box__label">{c.label}</span>
            <span className="result-box__value">{c.value}</span>
            <span className="result-box__sub">{c.sub}</span>
          </div>
        ))}
      </div>

      <div className="why-box">
        <div className="why-box__header">
          <Info size={16} color="#e67e22" /> Why this recommendation?
        </div>
        <ul className="why-box__list">
          <li>
            <b>Inverter:</b> {r.inverter.recommendedKva} kVA ({r.inverter.type}) — {SURGE_FACTOR}× peak load
            {expansion ? " with 1.5× expansion buffer" : ""}, snapped to nearest standard size.
          </li>
          <li>
            <b>Batteries:</b> {r.battery.totalBatteries}× {r.battery.recommendedBatteryAh}Ah ({r.battery.voltage}V) — {BATTERY_DOD * 100}% DoD on{" "}
            {(r.load.nightWh / 1000).toFixed(1)}kWh night usage{expansion ? " + 1.25× headroom" : ""}.
          </li>
          <li>
            <b>Panels:</b> {r.solar.panelCount}× 500W — recharges batteries and powers daytime loads within {PEAK_SUN_HOURS}h peak sun
            {expansion ? " + expansion buffer" : ""}.
          </li>
        </ul>
      </div>

      <Button onClick={onShopSetup} size="lg" fullWidth glow icon={<ShoppingCart size={20} />}>
        Shop This Setup <ArrowRight size={18} />
      </Button>

      <p className="results__disclaimer">
        * Estimates based on {PEAK_SUN_HOURS} peak sun hours, {SYSTEM_LOSSES}× system losses, {BATTERY_DOD * 100}% battery DoD.
        Uses 100Ah/200Ah batteries and 500W panels (Nigerian market). Actual needs may vary.
      </p>
    </div>
  );
}
