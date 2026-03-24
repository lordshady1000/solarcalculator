"use client";
import { useEffect } from "react";
import Button from "@/components/common/Button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error("SolarCalc Error:", error); }, [error]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, padding: 40 }}>
      <span style={{ fontSize: 48 }}>⚠️</span>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>Something went wrong</h2>
      <p style={{ color: "#888", fontSize: 14 }}>{error.message}</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
