"use client";
import { Sun } from "lucide-react";
import Button from "@/components/common/Button";

interface NavbarProps {
  onGetStarted: () => void;
}

export default function Navbar({ onGetStarted }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <div className="navbar__brand">
          <Sun size={22} className="text-primary" />
          <span>SolarCalc</span>
        </div>
        <div className="navbar__links">
          <a href="#how" className="navbar__link">How It Works</a>
          <a href="#benefits" className="navbar__link">Why Solar</a>
          <a href="#store" className="navbar__link">Equipment</a>
          <a href="#faq" className="navbar__link">FAQ</a>
        </div>
        <Button onClick={onGetStarted} size="sm">Get Started</Button>
      </div>
    </nav>
  );
}
