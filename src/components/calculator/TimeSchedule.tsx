"use client";
import { useState } from "react";
import { Clock, Sun, Moon, Zap } from "lucide-react";

// Solar window: 7am to 6pm (panels producing meaningful output)
const SOLAR_START = 7;  // 7:00 AM
const SOLAR_END = 18;   // 6:00 PM

interface TimeScheduleProps {
  hoursDay: number;
  hoursNight: number;
  onUpdate: (hoursDay: number, hoursNight: number) => void;
}

// Preset usage patterns that cover 90% of cases
const PRESETS = [
  { id: "day", label: "Daytime", desc: "7am – 6pm", icon: "☀️", fromH: 7, toH: 18 },
  { id: "evening", label: "Evening", desc: "6pm – 11pm", icon: "🌆", fromH: 18, toH: 23 },
  { id: "night", label: "Overnight", desc: "9pm – 7am", icon: "🌙", fromH: 21, toH: 7 },
  { id: "allday", label: "24/7 Always On", desc: "Runs all day", icon: "🔄", fromH: 0, toH: 24 },
  { id: "custom", label: "Custom", desc: "Pick times", icon: "⚙️", fromH: -1, toH: -1 },
];

// Generate hour options for dropdowns
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const ampm = i < 12 ? "AM" : "PM";
  const h = i === 0 ? 12 : i > 12 ? i - 12 : i;
  return { value: i, label: `${h}:00 ${ampm}` };
});

/**
 * Calculates how many hours of a given time range fall within the solar window
 * vs the battery (night) window.
 */
function splitDayNight(fromH: number, toH: number): { day: number; night: number } {
  if (fromH === 0 && toH === 24) {
    // 24/7 — 11 solar hours (7am-6pm), 13 battery hours
    return { day: SOLAR_END - SOLAR_START, night: 24 - (SOLAR_END - SOLAR_START) };
  }

  let day = 0;
  let night = 0;

  // Handle wrapping (e.g., 9pm to 7am = fromH:21, toH:7)
  const hours: number[] = [];
  if (fromH < toH) {
    for (let h = fromH; h < toH; h++) hours.push(h);
  } else {
    // Wraps past midnight
    for (let h = fromH; h < 24; h++) hours.push(h);
    for (let h = 0; h < toH; h++) hours.push(h);
  }

  for (const h of hours) {
    if (h >= SOLAR_START && h < SOLAR_END) {
      day++;
    } else {
      night++;
    }
  }

  return { day, night };
}

export default function TimeSchedule({ hoursDay, hoursNight, onUpdate }: TimeScheduleProps) {
  // Determine which preset matches current values
  const total = hoursDay + hoursNight;
  const initialPreset = total === 0 ? "day" : 
    (hoursDay === 11 && hoursNight === 13) ? "allday" :
    (hoursNight === 0) ? "day" :
    (hoursDay === 0) ? (hoursNight <= 5 ? "evening" : "night") :
    "custom";

  const [activePreset, setActivePreset] = useState(initialPreset);
  const [customFrom, setCustomFrom] = useState(8);
  const [customTo, setCustomTo] = useState(17);

  const handlePreset = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset.id);
    if (preset.id === "custom") return; // Don't update yet, wait for custom selection

    if (preset.id === "allday") {
      onUpdate(SOLAR_END - SOLAR_START, 24 - (SOLAR_END - SOLAR_START));
      return;
    }

    const { day, night } = splitDayNight(preset.fromH, preset.toH);
    onUpdate(day, night);
  };

  const handleCustomChange = (from: number, to: number) => {
    setCustomFrom(from);
    setCustomTo(to);
    const totalHours = from < to ? to - from : (24 - from) + to;
    if (totalHours > 0 && totalHours <= 24) {
      const { day, night } = splitDayNight(from, to);
      onUpdate(day, night);
    }
  };

  return (
    <div className="time-schedule">
      {/* Preset buttons */}
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

      {/* Custom time range picker */}
      {activePreset === "custom" && (
        <div className="time-schedule__custom">
          <div className="time-select">
            <label className="time-select__label">From</label>
            <select
              value={customFrom}
              onChange={e => handleCustomChange(Number(e.target.value), customTo)}
              className="time-select__dropdown"
            >
              {HOURS.map(h => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>
          <span className="time-schedule__arrow">→</span>
          <div className="time-select">
            <label className="time-select__label">To</label>
            <select
              value={customTo}
              onChange={e => handleCustomChange(customFrom, Number(e.target.value))}
              className="time-select__dropdown"
            >
              {HOURS.map(h => (
                <option key={h.value} value={h.value}>{h.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Visual breakdown */}
      <div className="time-schedule__summary">
        <div className="time-split">
          <Sun size={13} color="#e67e22" />
          <span className="time-split__val">{hoursDay}h solar</span>
        </div>
        <div className="time-split">
          <Moon size={13} color="#6366f1" />
          <span className="time-split__val">{hoursNight}h battery</span>
        </div>
        <div className="time-split time-split--total">
          <Clock size={13} color="#888" />
          <span className="time-split__val">{hoursDay + hoursNight}h total</span>
        </div>
      </div>
    </div>
  );
}
