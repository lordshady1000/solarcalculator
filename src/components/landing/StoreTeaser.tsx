"use client";
import Button from "@/components/common/Button";

const PRODUCTS = [
  { name: "5kVA Hybrid Inverter", brand: "Growatt / Deye", price: "₦850,000", img: "⚡", tag: "Best Seller", specs: "48V · MPPT · WiFi Monitoring · Pure Sine Wave" },
  { name: "200Ah Lithium Battery", brand: "Felicity / Ritar", price: "₦520,000", img: "🔋", tag: "Most Popular", specs: "LiFePO4 · 6000+ Cycles · 10yr Warranty · BMS Built-in" },
  { name: "500W Mono Solar Panel", brand: "Canadian Solar / JA", price: "₦165,000", img: "☀️", tag: "Premium", specs: "Monocrystalline · 25yr Warranty · Anti-PID · IP68 Junction" },
  { name: "3kVA Inverter Starter Kit", brand: "Complete Package", price: "₦1,200,000", img: "📦", tag: "Bundle Deal", specs: "Inverter + 2× Batteries + 4× Panels + Installation" },
  { name: "10kVA Business System", brand: "Commercial Grade", price: "₦3,500,000", img: "🏢", tag: "Enterprise", specs: "3-Phase · 8× Batteries + 12× Panels + Full Install" },
  { name: "Solar Installation Service", brand: "Certified Engineers", price: "From ₦50,000", img: "🔧", tag: "Service", specs: "Site Survey · Professional Install · 1yr Maintenance · Warranty" },
];

export default function StoreTeaser() {
  return (
    <section id="store" className="section section--light">
      <div className="container">
        <div className="section__header">
          <span className="section__badge">Coming Soon</span>
          <h2 className="section__title">Shop Solar <span className="text-gradient">Equipment</span></h2>
          <p className="section__desc">Buy the exact inverter, batteries, and panels recommended by your sizing calculation. Delivered to your doorstep.</p>
        </div>

        <div className="store-grid">
          {PRODUCTS.map((p, i) => (
            <div key={i} className="product-card">
              <div className="product-card__tag">{p.tag}</div>
              <div className="product-card__img">{p.img}</div>
              <h4 className="product-card__name">{p.name}</h4>
              <p className="product-card__brand">{p.brand}</p>
              <p className="product-card__specs">{p.specs}</p>
              <div className="product-card__footer">
                <span className="product-card__price">{p.price}</span>
                <Button size="sm" disabled>Coming Soon</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="store-cta">
          <div className="store-cta__inner">
            <div>
              <h3>Get Notified When the Store Launches</h3>
              <p>Be the first to know when you can buy equipment directly from SolarCalc at the best prices in Nigeria.</p>
            </div>
            <div className="store-cta__form">
              <input placeholder="Your email address" type="email" />
              <Button>Notify Me</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
