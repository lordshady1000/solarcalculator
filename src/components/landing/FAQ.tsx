"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How accurate is this calculator?", a: "Very accurate for initial sizing. We use industry-standard formulas: 1.25× surge factor for inverters, 50% Depth of Discharge for batteries (ensuring 3000+ cycles), and 4.5 peak sun hours for Nigeria. Final installation should always be verified by a certified installer." },
  { q: "Why do I need to split hours into day and night?", a: "This is critical for proper battery sizing. Daytime appliances can run directly from solar panels, but nighttime usage must come from batteries. A fridge running 24/7 has very different battery needs than a TV used only 4 hours at night." },
  { q: "What does 'Room for Expansion' do?", a: "When enabled, it forces a 48V system architecture (more scalable), recommends only Hybrid inverters (can add more panels later), and applies a 1.5× buffer to inverter capacity and 1.25× to battery/solar sizing — giving you headroom to add more appliances without replacing equipment." },
  { q: "Why only 100Ah and 200Ah batteries?", a: "These are the standard sizes available in the Nigerian solar market. 200Ah batteries are most common and cost-effective. We size your bank using parallel strings of these standard units so you can actually buy what we recommend." },
  { q: "Why 500W panels specifically?", a: "500W monocrystalline panels are the current sweet spot in Nigeria — best watts-per-naira ratio, widely available, and optimal for roof space. They've replaced 300-350W panels as the market standard." },
  { q: "How does the AI appliance lookup work?", a: "You describe any appliance (brand, model, or just what it does) and our AI analyzes it to return accurate wattage estimates. It works with Nigerian brands like Thermocool, Hisense, Scanfrost, etc. We use Google Gemini (free) as the primary AI, with Groq and Claude as fallbacks." },
  { q: "Is this tool really free?", a: "Yes, 100% free with no signup required. The appliance database and ENERGY STAR lookup work without any API keys. The AI lookup requires a free Google Gemini API key (takes 30 seconds to get, no credit card needed)." },
  { q: "Can I buy the recommended equipment from you?", a: "Not yet, but our store is coming soon! We'll offer inverters, batteries, and panels at competitive prices, delivered to your doorstep anywhere in Nigeria. Sign up to be notified when we launch." },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="section section--light">
      <div className="container">
        <div className="section__header">
          <span className="section__badge">Support</span>
          <h2 className="section__title">Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item ${openIdx === i ? "faq-item--open" : ""}`}>
              <button className="faq-item__q" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`faq-item__arrow ${openIdx === i ? "faq-item__arrow--open" : ""}`} />
              </button>
              {openIdx === i && <div className="faq-item__a fade-up">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
