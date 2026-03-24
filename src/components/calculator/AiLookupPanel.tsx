"use client";
import { useState } from "react";
import { useAiLookup } from "@/hooks";
import { useSolarStore } from "@/store/solarStore";
import Button from "@/components/common/Button";
import Loading from "@/components/common/Loading";
import type { AiLookupResult, ApplianceCategory } from "@/types";

const EXAMPLES = [
  "Thermocool 1.5HP inverter AC",
  "Commercial bread oven",
  "Hisense 43\" TV",
  "Industrial sewing machine",
  "50 gallon aquarium pump",
  "Gaming PC setup",
  "Salon hair dryer",
];

export default function AiLookupPanel() {
  const [query, setQuery] = useState("");
  const { results, loading, error, search } = useAiLookup();
  const addAppliance = useSolarStore(s => s.addAppliance);

  const handleSearch = () => { if (query.trim()) search(query); };

  const handleAdd = (item: AiLookupResult) => {
    addAppliance({
      id: `ai_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: item.name,
      defaultWattage: item.wattage,
      category: item.category as ApplianceCategory,
      icon: item.icon,
    }, "ai");
  };

  return (
    <div className="lookup-panel fade-up">
      <div className="lookup-panel__header">
        <h3>AI Appliance Lookup</h3>
        <span className="badge badge--purple">Powered by Gemini / Claude</span>
      </div>
      <p className="lookup-panel__desc">
        Describe any appliance — brand, model, or what it does — and AI will estimate its wattage accurately.
      </p>

      <div className="chip-row">
        {EXAMPLES.map(ex => (
          <button key={ex} onClick={() => setQuery(ex)} className="chip chip--sm">{ex}</button>
        ))}
      </div>

      <div className="search-row">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="e.g. Samsung 1.5HP split AC..."
        />
        <Button variant="purple" onClick={handleSearch} disabled={loading || !query.trim()} loading={loading}>
          Ask AI
        </Button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {loading && <Loading text={`Analyzing "${query}"...`} />}

      {results.map((item, i) => (
        <div key={i} className="result-card fade-up">
          <span className="result-card__icon">{item.icon}</span>
          <div className="result-card__info">
            <strong>{item.name}</strong>
            <span>{item.category}{item.notes && ` · ${item.notes}`}</span>
          </div>
          <div className="watt-badge">{item.wattage}W</div>
          <Button variant="ghost" className="btn--purple-ghost" size="sm" onClick={() => handleAdd(item)}>
            + Add
          </Button>
        </div>
      ))}
    </div>
  );
}
