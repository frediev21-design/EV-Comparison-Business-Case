# Fleet EV Business Case & TCO Platform

Enterprise-grade web application for comparing current fleet vehicles with EV, hybrid, and ICE replacements. Calculates complete financial business cases including financing, fuel/energy costs, maintenance, depreciation, ownership costs, solar savings, and ROI.

## Features

- **14-step business case workflow** — current vehicle, replacements, trade-in, finance, running costs, solar, ownership, risk, dashboard, charts, what-if, scenarios, reports, and executive recommendation
- **Modular calculation engine** — pure TypeScript, unit tested, extensible for future comparison types
- **Executive dashboard** — animated KPI cards with real-time recalculation
- **Interactive charts** — 10 Recharts visualisations
- **What-if analysis** — sliders for distance, fuel price, interest rate, solar %, and more
- **Scenario management** — save, duplicate, rename, delete via IndexedDB
- **Reports** — PDF (print), Excel, and print for 6 report types
- **Light/dark theme** — responsive desktop, tablet, and mobile

## Default Scenario

- Current: Ford Wildtrak Bi-Turbo (R620,000 value, R280,000 finance)
- Replacement: BYD Shark 6 (R960,000, 72 months, 10%)
- Trade-in: R340,000 equity + R200,000 cash = R540,000 deposit

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run test` | Run calculation engine tests |
| `npm run lint` | ESLint |

## Tech Stack

Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui · Zustand · Zod · Recharts · Dexie · ExcelJS · Framer Motion
