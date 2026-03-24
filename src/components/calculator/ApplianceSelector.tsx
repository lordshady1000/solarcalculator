"use client";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useSolarStore } from "@/store/solarStore";
import { FALLBACK_APPLIANCES, APPLIANCE_CATEGORIES_LIST } from "@/utils/fallbackData";

export default function ApplianceSelector() {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const addAppliance = useSolarStore(s => s.addAppliance);
  const selectedIds = useSolarStore(s => s.selectedAppliances.map(a => a.id));

  const filtered = useMemo(() => {
    return FALLBACK_APPLIANCES.filter(a => {
      const ms = a.name.toLowerCase().includes(search.toLowerCase());
      const mc = activeCat === "All" || a.category === activeCat;
      return ms && mc;
    });
  }, [search, activeCat]);

  return (
    <div className="calc-panel fade-up">
      <div className="search-box">
        <Search size={16} color="#aaa" />
        <input
          placeholder="Search appliances..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="cat-tabs">
        {["All", ...APPLIANCE_CATEGORIES_LIST].map(c => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`chip ${activeCat === c ? "chip--active" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="appliance-grid">
        {filtered.map(a => {
          const isSel = selectedIds.includes(a.id);
          const selItem = useSolarStore.getState().selectedAppliances.find(s => s.id === a.id);
          return (
            <button
              key={a.id}
              onClick={() => addAppliance(a)}
              className={`app-card ${isSel ? "app-card--sel" : ""}`}
            >
              {isSel && <span className="app-card__qty">{selItem?.quantity}</span>}
              <span className="app-card__icon">{a.icon}</span>
              <span className="app-card__name">{a.name}</span>
              <span className="app-card__watt">{a.defaultWattage}W</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="empty-msg">No appliances match your search.</p>
        )}
      </div>
    </div>
  );
}
