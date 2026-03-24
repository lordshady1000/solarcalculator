"use client";
import { useState } from "react";
import { useSolarStore } from "@/store/solarStore";
import { useSolarLogic } from "@/hooks";
import { formatWh, formatWattage } from "@/utils/formatters";
import { Plus, Minus, Trash2, Zap, ChevronDown, ChevronUp } from "lucide-react";
import Button from "@/components/common/Button";
import TimeSchedule from "./TimeSchedule";
import type { TimeSlot } from "@/types";

interface SelectedAppliancesProps {
  onCalculate: () => void;
}

export default function SelectedAppliances({ onCalculate }: SelectedAppliancesProps) {
  const { selectedAppliances, liveLoad, hasAppliances } = useSolarLogic();
  const { removeAppliance, updateQuantity, updateSchedule, runCalculation } = useSolarStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleCalc = () => {
    runCalculation();
    onCalculate();
  };

  const handleScheduleUpdate = (id: string, slots: TimeSlot[], hoursDay: number, hoursNight: number) => {
    updateSchedule(id, slots, hoursDay, hoursNight);
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
          const hasSurge = (s.surgeMultiplier || 1) > 1.5;
          const surgeW = s.customWattage * s.quantity * (s.surgeMultiplier || 1);

          return (
            <div key={s.id} className={`sel-card ${isExpanded ? "sel-card--expanded" : ""}`}>
              {/* Main row */}
              <div className="sel-card__top">
                <span className="sel-card__icon">{s.icon}</span>
                <div className="sel-card__info">
                  <span className="sel-card__name">
                    {s.name}
                    {s.source === "ai" && <span className="src-tag src-tag--ai">AI</span>}
                    {s.source === "es" && <span className="src-tag src-tag--es">ES</span>}
                  </span>
                  <span className="sel-card__sub">
                    {s.customWattage * s.quantity}W
                    {hasSurge && <span className="surge-warn"> · ⚡ {(surgeW / 1000).toFixed(1)}kW surge</span>}
                    {totalHours > 0 && <> · {totalHours}h/day · {s.customWattage * s.quantity * totalHours}Wh/day</>}
                  </span>
                </div>

                {/* Quantity */}
                <div className="qty-ctrl">
                  <button onClick={() => updateQuantity(s.id, -1)} className="qty-btn"><Minus size={14} /></button>
                  <span className="qty-val">{s.quantity}</span>
                  <button onClick={() => updateQuantity(s.id, 1)} className="qty-btn"><Plus size={14} /></button>
                </div>

                {/* Schedule toggle */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                  className={`schedule-toggle ${isExpanded ? "schedule-toggle--active" : ""}`}
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span className="schedule-toggle__label">
                    {totalHours > 0 ? `${totalHours}h` : "Schedule"}
                  </span>
                </button>

                {/* Delete */}
                <button onClick={() => removeAppliance(s.id)} className="del-btn"><Trash2 size={15} /></button>
              </div>

              {/* Expanded: Time schedule */}
              {isExpanded && (
                <div className="sel-card__schedule fade-up">
                  <p className="sel-card__schedule-hint">
                    When do you use this appliance? We automatically split your hours into
                    <strong> solar</strong> (panels power it directly) and
                    <strong> battery</strong> (drains your batteries).
                  </p>
                  <TimeSchedule
                    timeSlots={s.timeSlots || [{ from: 8, to: 17 }]}
                    hoursDay={s.hoursDay}
                    hoursNight={s.hoursNight}
                    onUpdate={(slots, hD, hN) => handleScheduleUpdate(s.id, slots, hD, hN)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Live load summary */}
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
