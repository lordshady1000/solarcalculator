"use client";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  accent?: string;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, accent, className = "", hover }: CardProps) {
  return (
    <div
      className={`card ${hover ? "card--hover" : ""} ${className}`}
      style={accent ? { borderTop: `3px solid ${accent}` } : undefined}
    >
      {children}
    </div>
  );
}

export function CardIcon({ children, bg }: { children: React.ReactNode; bg: string }) {
  return <div className="card__icon-wrap" style={{ background: bg }}>{children}</div>;
}

export function CardValue({ children, color }: { children: React.ReactNode; color?: string }) {
  return <span className="card__value" style={color ? { color } : undefined}>{children}</span>;
}

export function CardLabel({ children }: { children: React.ReactNode }) {
  return <span className="card__label">{children}</span>;
}

export function CardSub({ children }: { children: React.ReactNode }) {
  return <span className="card__sub">{children}</span>;
}
