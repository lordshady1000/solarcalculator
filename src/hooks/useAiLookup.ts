"use client";
import { useState } from "react";
import type { AiLookupResult } from "@/types";

export function useAiLookup() {
  const [results, setResults] = useState<AiLookupResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function search(query: string) {
    if (!query.trim()) return;
    setLoading(true); setError(""); setResults([]);
    try {
      const r = await fetch("/api/ai-lookup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await r.json();
      if (!data.success) throw new Error(data.error);
      setResults(data.data);
    } catch (e: any) { setError(e.message || "AI lookup failed"); }
    setLoading(false);
  }

  function clear() { setResults([]); setError(""); }
  return { results, loading, error, search, clear };
}
