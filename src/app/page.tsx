"use client";
import { useState, useRef } from "react";
import { Settings2 } from "lucide-react";
import { useSolarStore } from "@/store/solarStore";

// Layout
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Landing sections
import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import HowItWorks from "@/components/landing/HowItWorks";
import Benefits from "@/components/landing/Benefits";
import StoreTeaser from "@/components/landing/StoreTeaser";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTABanner from "@/components/landing/CTABanner";

// Calculator
import ApplianceSelector from "@/components/calculator/ApplianceSelector";
import AiLookupPanel from "@/components/calculator/AiLookupPanel";
import EnergyStarPanel from "@/components/calculator/EnergyStarPanel";
import SelectedAppliances from "@/components/calculator/SelectedAppliances";
import ResultsDashboard from "@/components/calculator/ResultsDashboard";

type SourceTab = "db" | "ai" | "es";

export default function HomePage() {
  const [tab, setTab] = useState<SourceTab>("db");
  const [showResults, setShowResults] = useState(false);
  const { expansionMode, toggleExpansion } = useSolarStore();

  const calcRef = useRef<HTMLDivElement>(null);
  const resRef = useRef<HTMLDivElement>(null);
  const storeRef = useRef<HTMLDivElement>(null);

  const scrollCalc = () => calcRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollStore = () => storeRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollResults = () => {
    setShowResults(true);
    setTimeout(() => resRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  };

  return (
    <div className="page">
      <Navbar onGetStarted={scrollCalc} />
      <HeroSection onGetStarted={scrollCalc} onBrowseStore={scrollStore} />
      <StatsBar />
      <HowItWorks />

      {/* ═══ CALCULATOR SECTION ═══ */}
      <section ref={calcRef} id="calculator" className="section section--warm">
        <div className="container">
          <div className="section__header">
            <span className="section__badge">Free Tool</span>
            <h2 className="section__title">
              What Do You Need to <span className="text-gradient">Power?</span>
            </h2>
            <p className="section__desc">
              Select appliances, set quantities, and split usage between day &amp; night hours.
            </p>
          </div>

          {/* Expansion Toggle */}
          <div className="expansion-bar">
            <Settings2 size={16} color="#888" />
            <span className="expansion-bar__label">Room for Expansion</span>
            <button
              onClick={toggleExpansion}
              className={`toggle ${expansionMode ? "toggle--on" : ""}`}
            >
              <div className="toggle__knob" />
            </button>
            {expansionMode && (
              <span className="expansion-bar__badge">48V · Hybrid · 1.5×</span>
            )}
          </div>

          {/* Source Tabs */}
          <div className="source-tabs">
            {([
              { k: "db" as SourceTab, l: "📋 Appliances" },
              { k: "ai" as SourceTab, l: "🤖 AI Lookup" },
              { k: "es" as SourceTab, l: "⭐ ENERGY STAR" },
            ]).map(t => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={`source-tab ${tab === t.k ? "source-tab--active" : ""} ${
                  t.k === "ai" ? "source-tab--purple" : t.k === "es" ? "source-tab--green" : ""
                }`}
              >
                {t.l}
              </button>
            ))}
          </div>

          {/* Active Panel */}
          {tab === "db" && <ApplianceSelector />}
          {tab === "ai" && <AiLookupPanel />}
          {tab === "es" && <EnergyStarPanel />}

          {/* Selected + Calculate */}
          <SelectedAppliances onCalculate={scrollResults} />

          {/* Results */}
          {showResults && (
            <div ref={resRef}>
              <ResultsDashboard onShopSetup={scrollStore} />
            </div>
          )}
        </div>
      </section>

      <Benefits />
      <div ref={storeRef}><StoreTeaser /></div>
      <Testimonials />
      <FAQ />
      <CTABanner onCalculate={scrollCalc} onBrowseStore={scrollStore} />
      <Footer />
    </div>
  );
}
