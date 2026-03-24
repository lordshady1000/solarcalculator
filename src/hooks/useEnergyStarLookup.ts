"use client";
import { useState } from "react";
import type { EnergyStarResult } from "@/types";

export function useEnergyStarLookup() {
  const [results, setResults] = useState<EnergyStarResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(category: string, term?: string) {
    setLoading(true); setError(""); setResults([]);
    try {
      const p = new URLSearchParams({ category });
      if (term?.trim()) p.set("term", term.trim());
      const r = await fetch(`/api/energystar?${p}`);
      const data = await r.json();
      if (!data.success) throw new Error(data.error);
      setResults(data.data);
    } catch (e: any) { setError(e.message || "ENERGY STAR lookup failed"); }
    setLoading(false);
  }

  function clear() { setResults([]); setError(""); }
  return { results, loading, error, search, clear };
}
