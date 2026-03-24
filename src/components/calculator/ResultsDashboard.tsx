"use client";
import { useSolarLogic } from "@/hooks";
import { useSolarStore } from "@/store/solarStore";
import { PEAK_SUN_HOURS, BATTERY_DOD, SYSTEM_LOSSES, STANDARD_PANEL_WATT } from "@/utils/constants";
import { formatWh, formatWattage } from "@/utils/formatters";
import { Zap, BarChart3, Battery, Sun, Info, ShoppingCart, ArrowRight, AlertTriangle, CheckCircle } from "lucide-react";
import Button from "@/components/common/Button";

interface ResultsDashboardProps {
  onShopSetup: () => void;
}

export default function ResultsDashboard({ onShopSetup }: ResultsDashboardProps) {
  const { systemResults: r } = useSolarLogic();
  const expansion = useSolarStore(s => s.expansionMode);
  const appliances = useSolarStore(s => s.selectedAppliances);

  if (!r) return null;

  // Find motor loads for explanation
  const motorLoads = appliances.filter(a => (a.surgeMultiplier || 1) >= 2.0);
  const biggestMotor = motorLoads.length > 0
    ? motorLoads.reduce((prev, curr) => (curr.customWattage * curr.quantity * (curr.surgeMultiplier || 1)) > (prev.customWattage * prev.quantity * (prev.surgeMultiplier || 1)) ? curr : prev)
    : null;

  const totalRunning = appliances.reduce((sum, a) => sum + a.customWattage * a.quantity, 0);
  const biggestSurge = biggestMotor ? biggestMotor.customWattage * biggestMotor.quantity * (biggestMotor.surgeMultiplier || 1) : 0;

  const cards = [
    { Icon: Zap, label: "Total Load", value: formatWattage(r.load.peakWatts), sub: `${formatWh(r.load.totalWh)} per day`, color: "#e67e22" },
    { Icon: BarChart3, label: "Inverter", value: `${r.inverter.recommendedKva} kVA`, sub: r.inverter.type, color: "#6366f1" },
    { Icon: Battery, label: "Battery Bank", value: `${r.battery.totalBatteries}× ${r.battery.recommendedBatteryAh}Ah`, sub: `${r.battery.kwh} kWh · ${r.battery.voltage}V`, color: "#10b981" },
    { Icon: Sun, label: "Solar Panels", value: `${r.solar.panelCount}× ${STANDARD_PANEL_WATT}W`, sub: `${(r.solar.totalCapacity / 1000).toFixed(1)} kW array`, color: "#e67e22" },
  ];

  return (
    <div className="results fade-up">
      <h3 className="results__title">Your Solar <span className="text-gradient">Setup</span></h3>

      {/* Result Cards */}
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

      {/* ═══ DETAILED EXPLANATIONS ═══ */}
      <div className="explain-section">
        <h4 className="explain-section__title">
          <Info size={18} color="#e67e22" /> How We Calculated Each Component
        </h4>

        {/* ── INVERTER ── */}
        <div className="explain-card">
          <div className="explain-card__header">
            <BarChart3 size={18} color="#6366f1" />
            <h5>Why a {r.inverter.recommendedKva} kVA {r.inverter.type}?</h5>
          </div>
          <div className="explain-card__body">
            <p>
              Your appliances draw <strong>{formatWattage(totalRunning)}</strong> when running simultaneously.
              But that&apos;s not enough to size an inverter — we need to account for <strong>startup surges</strong>.
            </p>

            {biggestMotor && (
              <div className="explain-callout explain-callout--warn">
                <AlertTriangle size={14} />
                <span>
                  Your <strong>{biggestMotor.name}</strong> surges to <strong>{formatWattage(biggestSurge)}</strong> when
                  the {biggestMotor.category === "Cooling" ? "compressor" : "motor"} starts — that&apos;s{" "}
                  {(biggestMotor.surgeMultiplier || 1)}× its running wattage for 1-3 seconds.
                </span>
              </div>
            )}

            {motorLoads.length > 0 && (
              <p className="explain-detail">
                <strong>Motor loads in your system:</strong>{" "}
                {motorLoads.map(a => `${a.name} (${a.customWattage * a.quantity}W → ${formatWattage(a.customWattage * a.quantity * (a.surgeMultiplier || 1))} surge)`).join(", ")}.
              </p>
            )}

            <p>
              We size the inverter for the <strong>worst case</strong>: everything running + the biggest motor starting up.
              That&apos;s {formatWattage(totalRunning)} running + {formatWattage(biggestSurge - (biggestMotor ? biggestMotor.customWattage * biggestMotor.quantity : 0))} extra surge = <strong>{formatWattage(totalRunning + biggestSurge - (biggestMotor ? biggestMotor.customWattage * biggestMotor.quantity : 0))}</strong> peak demand.
            </p>

            <p>
              Converting to kVA (accounting for ~0.8 power factor), we get <strong>{r.inverter.calculatedKva} kVA</strong>.
              The nearest standard inverter size is <strong>{r.inverter.recommendedKva} kVA</strong>.
              {expansion && " With expansion mode on, we applied a 1.5× buffer for future appliances."}
            </p>

            {r.inverter.type === "Hybrid Inverter" && (
              <div className="explain-callout explain-callout--info">
                <CheckCircle size={14} />
                <span>
                  <strong>Hybrid inverter</strong> recommended because {expansion ? "expansion mode is on — hybrid inverters let you add more panels later without replacing the inverter" : motorLoads.length > 0 ? "you have motor loads that benefit from the superior surge handling of hybrid inverters" : "your load exceeds 3kW"}.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── BATTERIES ── */}
        <div className="explain-card">
          <div className="explain-card__header">
            <Battery size={18} color="#10b981" />
            <h5>Why {r.battery.totalBatteries}× {r.battery.recommendedBatteryAh}Ah batteries at {r.battery.voltage}V?</h5>
          </div>
          <div className="explain-card__body">
            <p>
              Batteries only need to power what runs <strong>outside solar hours</strong> (6pm – 7am).
              Your nighttime/battery usage is <strong>{formatWh(r.load.nightWh)}</strong>.
            </p>

            <div className="explain-steps">
              <div className="explain-step">
                <span className="explain-step__num">1</span>
                <span>Start with {formatWh(r.load.nightWh)} nighttime energy need</span>
              </div>
              <div className="explain-step">
                <span className="explain-step__num">2</span>
                <span>Add {((SYSTEM_LOSSES - 1) * 100).toFixed(0)}% for system losses (wiring, inverter conversion) → {formatWh(r.load.nightWh * SYSTEM_LOSSES)}</span>
              </div>
              {expansion && (
                <div className="explain-step">
                  <span className="explain-step__num">3</span>
                  <span>Add 25% expansion buffer → {formatWh(r.load.nightWh * SYSTEM_LOSSES * 1.25)}</span>
                </div>
              )}
              <div className="explain-step">
                <span className="explain-step__num">{expansion ? "4" : "3"}</span>
                <span>
                  Divide by {BATTERY_DOD * 100}% Depth of Discharge — we only use {BATTERY_DOD * 100}% of battery capacity
                  to {BATTERY_DOD >= 0.8 ? "maximize usable energy (suited for LiFePO4 lithium batteries)" : "protect battery longevity and ensure 3000+ charge cycles"}
                </span>
              </div>
              <div className="explain-step">
                <span className="explain-step__num">{expansion ? "5" : "4"}</span>
                <span>
                  Result: <strong>{r.battery.totalAh}Ah at {r.battery.voltage}V</strong> = {r.battery.kwh} kWh total capacity
                </span>
              </div>
            </div>

            <p>
              <strong>System voltage ({r.battery.voltage}V):</strong>{" "}
              {r.battery.voltage === 48
                ? "48V is used for larger systems — it's more efficient (less current = thinner cables, less heat loss) and is the standard for modern hybrid inverters."
                : r.battery.voltage === 24
                  ? "24V balances efficiency and cost for medium-sized systems."
                  : "12V is suitable for small systems and is the most affordable entry point."
              }
              {expansion && " Expansion mode forces 48V for maximum future scalability."}
            </p>

            <p>
              <strong>Configuration:</strong> Using {r.battery.recommendedBatteryAh}Ah batteries (Nigerian market standard),
              you need <strong>{r.battery.parallelStrings} parallel string{r.battery.parallelStrings > 1 ? "s" : ""}</strong> ×{" "}
              <strong>{r.battery.seriesCount} in series</strong> = <strong>{r.battery.totalBatteries} batteries total</strong>.
              {r.battery.seriesCount > 1 && ` (${r.battery.seriesCount} batteries wired in series to reach ${r.battery.voltage}V per string.)`}
            </p>
          </div>
        </div>

        {/* ── SOLAR PANELS ── */}
        <div className="explain-card">
          <div className="explain-card__header">
            <Sun size={18} color="#e67e22" />
            <h5>Why {r.solar.panelCount}× {STANDARD_PANEL_WATT}W panels ({(r.solar.totalCapacity / 1000).toFixed(1)} kW)?</h5>
          </div>
          <div className="explain-card__body">
            <p>
              Solar panels must produce enough energy each day to <strong>power your daytime appliances AND recharge batteries</strong> for the night.
              Your total daily consumption is <strong>{formatWh(r.load.totalWh)}</strong>.
            </p>

            <div className="explain-steps">
              <div className="explain-step">
                <span className="explain-step__num">1</span>
                <span>Total daily usage: {formatWh(r.load.dayWh)} (daytime) + {formatWh(r.load.nightWh)} (nighttime) = {formatWh(r.load.totalWh)}</span>
              </div>
              <div className="explain-step">
                <span className="explain-step__num">2</span>
                <span>Add {((SYSTEM_LOSSES - 1) * 100).toFixed(0)}% system losses → {formatWh(r.load.totalWh * SYSTEM_LOSSES)}</span>
              </div>
              {expansion && (
                <div className="explain-step">
                  <span className="explain-step__num">3</span>
                  <span>Add 25% expansion buffer → {formatWh(r.load.totalWh * SYSTEM_LOSSES * 1.25)}</span>
                </div>
              )}
              <div className="explain-step">
                <span className="explain-step__num">{expansion ? "4" : "3"}</span>
                <span>
                  Divide by <strong>{PEAK_SUN_HOURS} peak sun hours</strong> (the average daily window where panels produce near-full output in Nigeria — typically 10am to 3pm)
                </span>
              </div>
              <div className="explain-step">
                <span className="explain-step__num">{expansion ? "5" : "4"}</span>
                <span>
                  Required array: <strong>{formatWattage(r.solar.calculatedWatts)}</strong>
                </span>
              </div>
              <div className="explain-step">
                <span className="explain-step__num">{expansion ? "6" : "5"}</span>
                <span>
                  Using {STANDARD_PANEL_WATT}W panels (monocrystalline, current Nigerian market standard):
                  {r.solar.calculatedWatts} ÷ {STANDARD_PANEL_WATT} = <strong>{r.solar.panelCount} panels</strong> ({(r.solar.totalCapacity / 1000).toFixed(1)} kW installed)
                </span>
              </div>
            </div>

            <div className="explain-callout explain-callout--info">
              <Sun size={14} />
              <span>
                <strong>Why {PEAK_SUN_HOURS}h and not 12h?</strong> The sun is up ~12 hours in Nigeria, but panels only produce full power
                during strong midday sun. Early morning and late afternoon output is weak. {PEAK_SUN_HOURS}h is the energy-equivalent
                of running panels at 100% for {PEAK_SUN_HOURS} hours — a safe national average for Nigeria.
              </span>
            </div>

            <p>
              <strong>Daily production:</strong> Your {r.solar.panelCount} panels will generate approximately{" "}
              <strong>{formatWh(r.solar.totalCapacity * PEAK_SUN_HOURS)}</strong> per day
              — enough to cover your {formatWh(r.load.totalWh)} usage plus losses.
            </p>
          </div>
        </div>
      </div>

      {/* Shop CTA */}
      <Button onClick={onShopSetup} size="lg" fullWidth glow icon={<ShoppingCart size={20} />}>
        Shop This Setup <ArrowRight size={18} />
      </Button>

      <p className="results__disclaimer">
        * Based on {PEAK_SUN_HOURS}h peak sun, {SYSTEM_LOSSES}× system losses, {BATTERY_DOD * 100}% battery DoD (LiFePO4).
        Uses {r.battery.recommendedBatteryAh}Ah batteries and {STANDARD_PANEL_WATT}W panels. Actual needs may vary by location,
        weather, and usage patterns. Always verify with a certified solar installer before purchasing.
      </p>
    </div>
  );
}
