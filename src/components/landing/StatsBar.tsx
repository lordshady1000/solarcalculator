"use client";
import { Calculator, CircleDollarSign, Zap, Sparkles } from "lucide-react";

const STATS = [
  { val: "2,400+", label: "Systems Sized", Icon: Calculator },
  { val: "₦850M+", label: "Customer Savings", Icon: CircleDollarSign },
  { val: "40+", label: "Appliance Database", Icon: Zap },
  { val: "AI", label: "Powered Lookup", Icon: Sparkles },
];

export default function StatsBar() {
  return (
    <section className="stats">
      <div className="container stats__inner">
        {STATS.map((s, i) => (
          <div key={i} className="stats__item">
            <s.Icon size={20} className="text-primary" />
            <span className="stats__val">{s.val}</span>
            <span className="stats__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
