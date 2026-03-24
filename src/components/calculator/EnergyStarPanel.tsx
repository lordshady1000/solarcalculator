"use client";
import { useState } from "react";
import { useEnergyStarLookup } from "@/hooks";
import { useSolarStore } from "@/store/solarStore";
import { ENERGY_STAR_ENDPOINTS, ES_CATEGORY_MAP, ES_ICON_MAP } from "@/config/energystar.config";
import Button from "@/components/common/Button";
import Loading from "@/components/common/Loading";
import type { EnergyStarResult, ApplianceCategory } from "@/types";

export default function EnergyStarPanel() {
  const [category, setCategory] = useState("Refrigerators");
  const [term, setTerm] = useState("");
  const { results, loading, error, search } = useEnergyStarLookup();
  const addAppliance = useSolarStore(s => s.addAppliance);

  const handleSearch = () => search(category, term);

  const handleAdd = (item: EnergyStarResult) => {
    addAppliance({
      id: `es_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: `${item.brand} ${item.model}`.slice(0, 50),
      defaultWattage: item.watts > 0 ? item.watts : 100,
      category: (ES_CATEGORY_MAP[category] || "Utility") as ApplianceCategory,
      icon: ES_ICON_MAP[category] || "⚡",
    }, "es");
  };

  return (
    <div className="lookup-panel fade-up">
      <div className="lookup-panel__header">
        <h3>ENERGY STAR® Lookup</h3>
        <span className="badge badge--green">EPA Certified</span>
      </div>
      <p className="lookup-panel__desc">
        Search the official ENERGY STAR database for certified products with verified energy ratings.
      </p>

      <div className="chip-row">
        {Object.keys(ENERGY_STAR_ENDPOINTS).map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`chip chip--sm ${category === c ? "chip--green" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="search-row">
        <input
          value={term}
          onChange={e => setTerm(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Brand or model (optional)..."
        />
        <Button variant="green" onClick={handleSearch} disabled={loading} loading={loading}>
          Search
        </Button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {loading && <Loading text="Querying ENERGY STAR..." />}

      {results.map((item, i) => (
        <div key={i} className="result-card fade-up">
          <div className="result-card__info">
            <strong>{item.brand}</strong>
            <span>{item.model}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            {item.annualKwh > 0 && <small style={{ color: "#10b981", display: "block", fontSize: 11 }}>{item.annualKwh.toFixed(0)} kWh/yr</small>}
            <div className="watt-badge">~{item.watts}W</div>
          </div>
          <Button variant="ghost" className="btn--green-ghost" size="sm" onClick={() => handleAdd(item)}>
            + Add
          </Button>
        </div>
      ))}

      {!loading && results.length === 0 && term && (
        <p className="empty-msg">No results. Try a different brand or category.</p>
      )}
    </div>
  );
}
