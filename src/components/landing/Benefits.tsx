"use client";
import { CircleDollarSign, Shield, TrendingDown, Leaf, Zap } from "lucide-react";

const BENEFITS = [
  { Icon: CircleDollarSign, title: "Save ₦200K+/Year", desc: "Eliminate monthly generator fuel costs. The average Nigerian household spends ₦15-25K/month on fuel alone. Solar pays for itself within 2-3 years.", color: "#e67e22" },
  { Icon: Shield, title: "24/7 Reliable Power", desc: "No more guessing when NEPA will restore power. Your batteries keep you running through the night, and panels recharge every morning automatically.", color: "#6366f1" },
  { Icon: TrendingDown, title: "Zero Running Costs", desc: "Unlike generators that need fuel, oil changes, and repairs, solar panels have no moving parts and last 25+ years with virtually zero maintenance.", color: "#10b981" },
  { Icon: Leaf, title: "Clean & Quiet", desc: "No fumes, no noise, no pollution. Unlike generators that disturb your neighbors and damage your health, solar is completely silent and clean.", color: "#22c55e" },
  { Icon: Zap, title: "Instant Switch", desc: "Modern hybrid inverters switch to battery power in under 20ms — so fast your devices don't even notice. No more restarting everything.", color: "#f59e0b" },
  { Icon: TrendingDown, title: "Property Value +15%", desc: "Homes with solar installations sell faster and at higher prices. A well-sized system is an investment that pays dividends when you sell.", color: "#8b5cf6" },
];

export default function Benefits() {
  return (
    <section id="benefits" className="section section--dark">
      <div className="container">
        <div className="section__header section__header--light">
          <span className="section__badge section__badge--dark">The Smart Choice</span>
          <h2 className="section__title">Why Go Solar in Nigeria?</h2>
          <p className="section__desc">Solar power isn&apos;t just clean energy — it&apos;s the most practical, economical choice for Nigerian homes and businesses.</p>
        </div>
        <div className="benefits-grid">
          {BENEFITS.map((b, i) => (
            <div key={i} className="benefit-card">
              <div className="benefit-card__icon" style={{ background: `${b.color}20` }}><b.Icon size={24} color={b.color} /></div>
              <h4 className="benefit-card__title">{b.title}</h4>
              <p className="benefit-card__desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
