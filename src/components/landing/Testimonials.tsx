"use client";
import { Star } from "lucide-react";

const REVIEWS = [
  { name: "Chioma A.", loc: "Lagos", text: "This calculator saved me from buying an oversized system. My installer wanted to sell me a 10kVA but SolarCalc showed I only needed 5kVA. Saved me ₦400K!", avatar: "👩🏾" },
  { name: "Emeka O.", loc: "Abuja", text: "The day/night split feature is genius. I didn't realize my battery bank was undersized until I properly separated my evening usage. Now my system lasts through the night.", avatar: "👨🏾" },
  { name: "Fatima M.", loc: "Kano", text: "I used the AI lookup to find the exact wattage of my commercial grinding machine. No other calculator could do that. Recommended to all my business friends.", avatar: "👩🏾‍💼" },
  { name: "David K.", loc: "Port Harcourt", text: "Finally, a solar calculator that understands Nigerian appliances and market. The 200Ah battery and 500W panel sizing matches exactly what's available here.", avatar: "👨🏾‍🔧" },
];

export default function Testimonials() {
  return (
    <section className="section section--warm">
      <div className="container">
        <div className="section__header">
          <span className="section__badge">Happy Customers</span>
          <h2 className="section__title">What People Are Saying</h2>
        </div>
        <div className="testimonials">
          {REVIEWS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-card__stars">
                {[1,2,3,4,5].map(j => <Star key={j} size={14} fill="#f39c12" color="#f39c12" />)}
              </div>
              <p className="testimonial-card__text">&ldquo;{t.text}&rdquo;</p>
              <div className="testimonial-card__author">
                <span className="testimonial-card__avatar">{t.avatar}</span>
                <div><strong>{t.name}</strong><span>{t.loc}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
