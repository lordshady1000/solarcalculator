# ☀️ SolarCalc — Nigeria's Free Solar System Sizing Calculator

Full-stack Next.js 14 solar system sizing app with AI-powered appliance lookup, ENERGY STAR integration, rich 10-section landing page, and upcoming equipment store.

## Quick Start

```bash
npm install
cp .env.example .env.local
# Add your free Gemini API key (https://aistudio.google.com/apikey)
npm run dev
```

Open http://localhost:3000

## Project Structure (Modular Architecture)

```
src/
├── app/
│   ├── layout.tsx                    # Root layout + metadata
│   ├── page.tsx                      # Main page (composes all components)
│   ├── error.tsx                     # Error boundary
│   ├── globals.css                   # Full BEM design system
│   └── api/
│       ├── appliances/route.ts       # MongoDB CRUD for appliances
│       ├── ai-lookup/route.ts        # Gemini/Groq/Claude smart fallback
│       ├── energystar/route.ts       # EPA ENERGY STAR proxy
│       ├── system-templates/route.ts # System config templates
│       └── health/route.ts           # Health check
├── components/
│   ├── common/                       # Atomic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Loading.tsx
│   ├── layout/                       # Page-level layout
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── landing/                      # Marketing sections
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Benefits.tsx
│   │   ├── StoreTeaser.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQ.tsx
│   │   └── CTABanner.tsx
│   └── calculator/                   # Core calculator features
│       ├── ApplianceSelector.tsx
│       ├── AiLookupPanel.tsx
│       ├── EnergyStarPanel.tsx
│       ├── SelectedAppliances.tsx
│       └── ResultsDashboard.tsx
├── hooks/
│   ├── index.ts
│   ├── useSolarLogic.ts
│   ├── useAiLookup.ts
│   └── useEnergyStarLookup.ts
├── models/
│   ├── Appliance.ts                  # Mongoose schema
│   └── SystemTemplate.ts            # Mongoose schema
├── store/
│   └── solarStore.ts                # Zustand global state
├── types/
│   ├── index.ts
│   ├── appliance.types.ts
│   ├── calculator.types.ts
│   └── api.types.ts
├── utils/
│   ├── calculator.ts                # Pure calculation engine
│   ├── constants.ts                 # System parameters
│   ├── db.ts                        # MongoDB connection
│   ├── formatters.ts                # Display formatting
│   ├── validators.ts                # Input validation
│   ├── fallbackData.ts             # Offline appliance catalog
│   └── seed.ts                      # Database seeder
└── config/
    ├── environment.ts
    └── energystar.config.ts
```

## Landing Page Sections (10)

1. **Navbar** — Fixed glassmorphism nav with links + CTA
2. **Hero** — Dark gradient with floating stat cards, dual CTAs, trust stars
3. **Stats Bar** — 2,400+ systems, ₦850M+ savings, 40+ appliances, AI powered
4. **How It Works** — 3-step visual process cards
5. **Calculator** — Full tool: 3 source tabs, expansion toggle, day/night split, results
6. **Why Go Solar** — 6 benefit cards with Nigerian context
7. **Store Teaser** — 6 product cards with ₦ pricing + email signup
8. **Testimonials** — 4 customer reviews from Lagos, Abuja, Kano, PH
9. **FAQ** — 8 expandable questions
10. **CTA + Footer** — Final conversion + 4-column footer

## AI Provider Setup (FREE)

| Provider | Cost | Get Key |
|----------|------|---------|
| Google Gemini | FREE | https://aistudio.google.com/apikey |
| Groq | FREE | https://console.groq.com/keys |
| Claude | Paid | https://console.anthropic.com |

Smart fallback: Gemini → Groq → Claude. Just set `GEMINI_API_KEY`.

## Tech Stack

Next.js 14 (App Router) · TypeScript (Strict) · Zustand · Mongoose · Lucide React · Vanilla CSS (BEM)
