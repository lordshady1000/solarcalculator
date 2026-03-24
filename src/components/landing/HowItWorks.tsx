"use client";
import { Plus, Clock, BarChart3 } from "lucide-react";

const STEPS = [
  { num: "01", title: "Add Your Appliances", desc: "Select from our database of 40+ Nigerian-market appliances, use AI to look up any device, or search ENERGY STAR certified products.", Icon: Plus, color: "#e67e22" },
  { num: "02", title: "Set Day & Night Hours", desc: "Tell us how many hours each appliance runs during the day (solar hours) vs night (battery hours). This is key to accurate battery sizing.", Icon: Clock, color: "#6366f1" },
  { num: "03", title: "Get Your Solar Blueprint", desc: "Instantly receive your recommended inverter size, battery bank configuration, and solar panel count — with clear explanations for each.", Icon: BarChart3, color: "#10b981" },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section section--light">
      <div className="container">
        <div className="section__header">
          <span className="section__badge">Simple Process</span>
          <h2 className="section__title">How It Works</h2>
          <p className="section__desc">Three simple steps to find your perfect solar system. No engineering degree required.</p>
        </div>
        <div className="steps">
          {STEPS.map((step, i) => (
            <div key={i} className="step">
              <div className="step__num" style={{ background: `${step.color}15`, color: step.color }}>{step.num}</div>
              <div className="step__icon" style={{ background: `${step.color}12` }}><step.Icon size={24} color={step.color} /></div>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
