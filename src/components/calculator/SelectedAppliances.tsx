"use client";
import { useState } from "react";
import { useSolarStore } from "@/store/solarStore";
import { useSolarLogic } from "@/hooks";
import { formatWh, formatWattage } from "@/utils/formatters";
import { Plus, Minus, Trash2, Zap, ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/common/Button";
import TimeSchedule from "./TimeSchedule";

interface SelectedAppliancesProps {
  onCalculate: () => void;
}

export default function SelectedAppliances({ onCalculate }: SelectedAppliancesProps) {
  const { selectedAppliances, liveLoad, hasAppliances } = useSolarLogic();
  const { removeAppliance, updateQuantity, updateField, runCalculation } = useSolarStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCalc = () => {
    runCalculation();
    onCalculate();
  };

  const handleTimeUpdate = (id: string, hoursDay: number, hoursNight: number) => {
    updateField(id, "hoursDay", hoursDay);
    updateField(id, "hoursNight", hoursNight);
  };

  if (!hasAppliances) return null;

  return (
    <div className="selected-section fade-up">
      <h3 className="selected-section__title">
        <Zap size={20} className="text-primary" />
        Your Appliances
        <span className="badge">{selectedAppliances.length}</span>
      </h3>

      <div className="selected-list">
        {selectedAppliances.map(s => {
          const isExpanded = expandedId === s.id;
          const totalHours = s.hoursDay + s.hoursNight;
          return (
            <div key={s.id} className={`sel-card ${isExpanded ? "sel-card--expanded" : ""}`}>
              {/* Top row: icon, name, qty, summary, actions */}
              <div className="sel-card__top">
                <span className="sel-card__icon">{s.icon}</span>
                <div className="sel-card__info">
                  <span className="sel-card__name">
                    {s.name}
                    {s.source === "ai" && <span className="src-tag src-tag--ai">AI</span>}
                    {s.source === "es" && <span className="src-tag src-tag--es">ES</span>}
                  </span>
                  <span className="sel-card__sub">
                    {s.customWattage * s.quantity}W · {totalHours}h/day · {s.customWattage * s.quantity * totalHours}Wh/day
                  </span>
                </div>

                <div className="qty-ctrl">
                  <button onClick={() => updateQuantity(s.id, -1)} className="qty-btn"><Minus size={14} /></button>
                  <span className="qty-val">{s.quantity}</span>
                  <button onClick={() => updateQuantity(s.id, 1)} className="qty-btn"><Plus size={14} /></button>
                </div>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className="schedule-toggle"
                  title="Set usage schedule"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span className="schedule-toggle__label">Schedule</span>
                </button>

                <button onClick={() => removeAppliance(s.id)} className="del-btn"><Trash2 size={15} /></button>
              </div>

              {/* Expanded: Time schedule picker */}
              {isExpanded && (
                <div className="sel-card__schedule fade-up">
                  <p className="sel-card__schedule-hint">
                    When do you use this appliance? We&apos;ll automatically calculate solar vs battery hours.
                    <span className="sel-card__schedule-note">☀️ Solar window: 7am – 6pm</span>
                  </p>
                  <TimeSchedule
                    hoursDay={s.hoursDay}
                    hoursNight={s.hoursNight}
                    onUpdate={(hD, hN) => handleTimeUpdate(s.id, hD, hN)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {liveLoad && (
        <div className="load-bar">
          {[
            { l: "Peak Load", v: formatWattage(liveLoad.peakWatts) },
            { l: "Solar Hours", v: formatWh(liveLoad.dayWh), c: "#e67e22" },
            { l: "Battery Hours", v: formatWh(liveLoad.nightWh), c: "#6366f1" },
            { l: "Total Daily", v: formatWh(liveLoad.totalWh), c: "#e67e22" },
          ].map((item, i) => (
            <div key={i} className="load-bar__item">
              <span className="load-bar__label">{item.l}</span>
              <span className="load-bar__val" style={item.c ? { color: item.c } : {}}>{item.v}</span>
            </div>
          ))}
        </div>
      )}

      <Button onClick={handleCalc} size="lg" fullWidth glow icon={<Zap size={20} />}>
        Calculate My Solar Setup
      </Button>
    </div>
  );
}
