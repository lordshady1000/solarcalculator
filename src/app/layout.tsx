import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolarCalc — Free Solar System Sizing Calculator | Nigeria",
  description: "Calculate your exact solar setup — inverter, batteries, and panels. AI-powered appliance lookup. 40+ Nigerian-market appliances. 100% free.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
