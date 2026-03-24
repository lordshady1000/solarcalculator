"use client";
import { Sun, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__logo"><Sun size={24} color="#e67e22" /> <span>SolarCalc</span></div>
          <p>Nigeria&apos;s most accurate free solar system sizing calculator. Powered by AI and real engineering formulas.</p>
        </div>
        <div className="footer__col">
          <h4>Product</h4>
          <a href="#calculator">Calculator</a>
          <a href="#store">Equipment Store</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="footer__col">
          <h4>Resources</h4>
          <a href="#how">How It Works</a>
          <a href="#benefits">Why Solar</a>
          <a href="#">Solar Guide (PDF)</a>
        </div>
        <div className="footer__col">
          <h4>Contact</h4>
          <a href="#"><Mail size={14} /> hello@solarcalc.ng</a>
          <a href="#"><Phone size={14} /> +234 800 SOLAR</a>
          <a href="#"><MapPin size={14} /> Lagos, Nigeria</a>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; 2026 SolarCalc. Built for Nigeria. All rights reserved.</p>
      </div>
    </footer>
  );
}
