"use client";
import { useState, useEffect } from "react";
import { Plus, X, Sun, Moon, Clock } from "lucide-react";
import type { TimeSlot } from "@/types";

// Solar window
const SOLAR_START = 7;
const SOLAR_END = 18;

// Hour options
const HOURS = Array.from({ length: 25 }, (_, i) => {
  if (i === 24) return { value: 24, label: "12:00 AM (next day)" };
  const ampm = i < 12 ? "AM" : "PM";
  const h = i === 0 ? 12 : i > 12 ? i - 12 : i;
  return { value: i, label: `${h}:00 ${ampm}` };
});

// Presets
const PRESETS = [
  { id: "day",     label: "Daytime",     icon: "☀️", desc: "7am – 6pm",           slots: [{ from: 7, to: 18 }] },
  { id: "evening", label: "Evening",     icon: "🌆", desc: "6pm – 11pm",          slots: [{ from: 18, to: 23 }] },
  { id: "night",   label: "Overnight",   icon: "🌙", desc: "9pm – 7am",           slots: [{ from: 21, to: 31 }] }, // 31 = 7am next day
  { id: "allday",  label: "24/7",        icon: "🔄", desc: "Always on",           slots: [{ from: 0, to: 24 }] },
  { id: "split",   label: "Morning + Eve", icon: "🔀", desc: "7–10am & 7–10pm", slots: [{ from: 7, to: 10 }, { from: 19, to: 22 }] },
];

/**
 * Splits time slots into solar (7am-6pm) and battery (6pm-7am) hours.
 * Uses a 24-hour set to handle overlaps between multiple slots.
 */
function splitDayNight(slots: TimeSlot[]): { day: number; night: number } {
  const hourSet = new Set<number>();

  for (const slot of slots) {
    const from = slot.from;
    const to = slot.to;

    if (to > from) {
      // Normal range or wrapping range using >24 notation
      for (let h = from; h < to; h++) {
        hourSet.add(h % 24);
      }
    } else if (to < from) {
      // Wraps past midnight (e.g., 21 to 7)
      for (let h = from; h < 24; h++) hourSet.add(h);
      for (let h = 0; h < to; h++) hourSet.add(h);
    }
    // from === to means 0 hours
  }

  let day = 0, night = 0;
  for (const h of hourSet) {
    if (h >= SOLAR_START && h < SOLAR_END) day++;
    else night++;
  }
  return { day, night };
}

interface TimeScheduleProps {
  timeSlots: TimeSlot[];
  hoursDay: number;
  hoursNight: number;
  onUpdate: (slots: TimeSlot[], hoursDay: number, hoursNight: number) => void;
}

export default function TimeSchedule({ timeSlots, hoursDay, hoursNight, onUpdate }: TimeScheduleProps) {
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [localSlots, setLocalSlots] = useState<TimeSlot[]>(timeSlots);

  // Sync local state when props change externally
  useEffect(() => {
    setLocalSlots(timeSlots);
  }, [timeSlots]);

  // Apply slots: update local + push to parent
  const applySlots = (newSlots: TimeSlot[]) => {
    setLocalSlots(newSlots);
    const { day, night } = splitDayNight(newSlots);
    onUpdate(newSlots, day, night);
  };

  // Preset click
  const handlePreset = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.id);
    applySlots([...preset.slots]);
  };

  // Custom: change a slot
  const updateSlot = (idx: number, field: "from" | "to", value: number) => {
    const updated = localSlots.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    setActivePreset("custom");
    applySlots(updated);
  };

  // Custom: add slot
  const addSlot = () => {
    const updated = [...localSlots, { from: 19, to: 22 }];
    setActivePreset("custom");
    applySlots(updated);
  };

  // Custom: remove slot
  const removeSlot = (idx: number) => {
    const updated = localSlots.filter((_, i) => i !== idx);
    if (updated.length === 0) {
      applySlots([{ from: 8, to: 17 }]);
    } else {
      applySlots(updated);
    }
    setActivePreset("custom");
  };

  const totalHours = hoursDay + hoursNight;

  return (
    <div className="time-schedule">
      {/* ── Presets ── */}
      <div className="time-schedule__presets">
        {PRESETS.map(p => (
          <button
            key={p.id}
            onClick={() => handlePreset(p)}
            className={`time-preset ${activePreset === p.id ? "time-preset--active" : ""}`}
          >
            <span className="time-preset__icon">{p.icon}</span>
            <span className="time-preset__label">{p.label}</span>
            <span className="time-preset__desc">{p.desc}</span>
          </button>
        ))}
      </div>

      {/* ── Time Slot Editors ── */}
      <div className="time-slots">
        {localSlots.map((slot, idx) => (
          <div key={idx} className="time-slot">
            <div className="time-slot__header">
              <span className="time-slot__label">
                {localSlots.length > 1 ? `Period ${idx + 1}` : "Usage period"}
              </span>
              {localSlots.length > 1 && (
                <button onClick={() => removeSlot(idx)} className="time-slot__remove" title="Remove this period">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="time-slot__pickers">
              <div className="time-slot__field">
                <label>From</label>
                <select
                  value={slot.from}
                  onChange={e => updateSlot(idx, "from", Number(e.target.value))}
                  className="time-select__dropdown"
                >
                  {HOURS.filter(h => h.value < 24).map(h => (
                    <option key={h.value} value={h.value}>{h.label}</option>
                  ))}
                </select>
              </div>
              <span className="time-slot__arrow">→</span>
              <div className="time-slot__field">
                <label>To</label>
                <select
                  value={slot.to}
                  onChange={e => updateSlot(idx, "to", Number(e.target.value))}
                  className="time-select__dropdown"
                >
                  {HOURS.map(h => (
                    <option key={h.value} value={h.value}>{h.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        <button onClick={addSlot} className="time-slot__add">
          <Plus size={14} /> Add another time period
        </button>
      </div>

      {/* ── Summary ── */}
      <div className="time-schedule__summary">
        <div className="time-split">
          <Sun size={14} color="#e67e22" />
          <span className="time-split__val">{hoursDay}h solar</span>
          <span className="time-split__hint">(7am–6pm)</span>
        </div>
        <div className="time-split">
          <Moon size={14} color="#6366f1" />
          <span className="time-split__val">{hoursNight}h battery</span>
          <span className="time-split__hint">(6pm–7am)</span>
        </div>
        <div className="time-split time-split--total">
          <Clock size={14} color="#888" />
          <span className="time-split__val">{totalHours}h/day</span>
        </div>
      </div>
    </div>
  );
}
