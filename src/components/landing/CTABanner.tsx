"use client";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";

interface CTABannerProps {
  onCalculate: () => void;
  onBrowseStore: () => void;
}

export default function CTABanner({ onCalculate, onBrowseStore }: CTABannerProps) {
  return (
    <section className="cta-section">
      <div className="container cta-section__inner">
        <h2 className="cta-section__title">Ready to Go Solar?</h2>
        <p className="cta-section__desc">Join thousands of Nigerians who&apos;ve already sized their solar systems with SolarCalc. It takes less than 2 minutes.</p>
        <div className="cta-section__btns">
          <Button onClick={onCalculate} size="lg" glow icon={<ArrowRight size={18} />}>Start Calculating</Button>
          <Button onClick={onBrowseStore} variant="outline-light" size="lg">Browse Equipment</Button>
        </div>
      </div>
    </section>
  );
}
