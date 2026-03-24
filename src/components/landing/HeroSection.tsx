"use client";
import { Sun, Battery, Zap, ArrowRight, Star } from "lucide-react";
import Button from "@/components/common/Button";

interface HeroProps {
  onGetStarted: () => void;
  onBrowseStore: () => void;
}

export default function HeroSection({ onGetStarted, onBrowseStore }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero__glow" />
      <div className="hero__glow2" />
      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__badge"><Sun size={14} /> Solar Power Calculator — 100% Free</div>
          <h1 className="hero__title">Power Your Home<br /><span className="text-gradient">With Sunshine</span></h1>
          <p className="hero__desc">
            Add your household appliances, set daytime &amp; nighttime usage, and we&apos;ll calculate your exact solar setup — inverter, batteries, and panels. Works for homes, offices, and businesses across Nigeria.
          </p>
          <div className="hero__ctas">
            <Button onClick={onGetStarted} size="lg" glow icon={<Sun size={20} />}>Calculate My Solar Needs</Button>
            <Button onClick={onBrowseStore} variant="outline" size="lg" icon={<ArrowRight size={18} />}>Browse Equipment</Button>
          </div>
          <div className="hero__trust">
            <div className="hero__trust-stars">{[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#f39c12" color="#f39c12" />)}</div>
            <span>Trusted by 2,000+ homeowners &amp; solar installers</span>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__card hero__card--1">
            <Sun size={28} color="#f39c12" /><div><span className="hero__card-val">4.5h</span><span className="hero__card-label">Avg. Peak Sun</span></div>
          </div>
          <div className="hero__card hero__card--2">
            <Zap size={28} color="#6366f1" /><div><span className="hero__card-val">500W</span><span className="hero__card-label">Panel Standard</span></div>
          </div>
          <div className="hero__card hero__card--3">
            <Battery size={28} color="#10b981" /><div><span className="hero__card-val">200Ah</span><span className="hero__card-label">Battery Size</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
