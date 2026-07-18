# FlowOS

## What this is

FlowOS is a standalone portfolio case study — not a full application, not a
generic admin dashboard demo. It's a focused product management deep-dive on
one problem: **how an omni-channel retailer decides where an order ships from,
and how it generates a delivery estimate it can actually keep.**

The site is a single scrolling page. There is no product being sold, no
signup flow, no multi-page IA. The "product" is the case study itself: the
writing, the reasoning, the interactive demo, and the supporting data
visualizations.

## Audience

Write for a general professional audience evaluating product/technical case
studies — hiring managers, peers, collaborators. This is a **standalone
project**: do not reference any specific job posting, company, role, or
application in the visible content. It should read as something the author
built to demonstrate how they think, not as a cover letter.

## Site map (single page, eight sections, sticky nav)

Section order and intent — build content in this order, and don't add,
remove, split, or reorder sections without being asked:

1. **Problem** — the business problem in plain language: siloed inventory
   across channels leads to overselling, overstocking, and unreliable
   delivery promises.
2. **Industry Signals** — external evidence that this problem is real and
   widely faced (analyst commentary, public earnings-call remarks, published
   research). See the rule on real-company references below.
3. **Strategy & Roadmap** — how a PM would sequence solving this: phasing,
   sequencing rationale, what gets built first and why.
4. **Discovery & Prioritization** — the research and prioritization
   methodology behind the roadmap (e.g., interviews, data pulls, scoring
   frameworks like RICE/ICE, trade-off matrices).
5. **Interactive Demo** — a working, click-through simulation of order
   sourcing logic: given a sample order and a set of fulfillment locations
   with stock/proximity/cost, show which location gets picked and why, and
   the resulting delivery estimate.
6. **KPIs & Impact** — the metrics that would prove this worked (e.g.,
   oversell rate, fulfillment cost per order, delivery promise accuracy,
   split-shipment rate) and what directional impact looks like.
7. **Decision Journal** — a log of real product decisions made while
   building this case study: the options considered, what was chosen, and
   why. This is meta — it documents the author's own decision-making, not a
   fictional team's.
8. **Trade-offs & Lessons Learned** — honest retrospective: what was
   simplified for scope, what a real implementation would need that this
   doesn't have, what the author would do differently.

The sticky header nav uses short labels (Problem, Signals, Strategy,
Discovery, Demo, KPIs, Journal, Trade-offs) that scroll-link to the full
section titles above. Section shells, nav, and scroll-spy logic live in
`src/components/site-header.tsx`, `src/components/section-shell.tsx`, and
`src/lib/sections.ts` — add section body content inside the existing
`<SectionShell>` for each section rather than restructuring the shell.

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (`new-york` style, `neutral` base color,
  CSS variables in `src/app/globals.css` — note these are `oklch()` values
  used directly, not wrapped in `hsl()`)
- **Prisma** + **SQLite** (`prisma/schema.prisma`, `DATABASE_URL` in `.env`)
  — kept intentionally lightweight, no hosted Postgres. Add models only when
  a section actually needs persisted data (e.g., the Interactive Demo's
  fulfillment locations/inventory, or Decision Journal entries).
- **Framer Motion** for restrained scroll/entrance animation
  (`src/components/section-shell.tsx`)
- **Recharts** for KPI/data visualization (KPIs & Impact section)
- **next-themes** for dark/light mode (`src/components/theme-provider.tsx`,
  `src/components/theme-toggle.tsx`)

## Design language

Premium, minimal, enterprise SaaS feel — Stripe/Linear-level polish. Neutral
grayscale palette (no brand hue), generous whitespace, restrained motion,
strong typographic hierarchy. No specific retailer or company branding
anywhere in the visible content — this is a neutral case study, not a
whitepaper for any one business.

## Domain facts — stay consistent with these throughout

- **Omnichannel fulfillment** unifies inventory across channels (web, app,
  stores, marketplaces) into a single shared pool, instead of each channel
  holding its own siloed allocation of stock.
- Core fulfillment patterns:
  - **BOPIS** — Buy Online, Pick-up In Store.
  - **Ship-from-store** — a store's backroom/shelf stock fulfills an online
    order and ships to the customer.
  - **BORIS** — Buy Online, Return In Store.
- An **OMS (Order Management System)** paired with a **WMS (Warehouse
  Management System)** routes each order to the best fulfillment location,
  scored on proximity to the customer, available stock, and fulfillment
  cost.
- The goal of unifying inventory this way is eliminating the overselling and
  overstocking that siloed, per-channel inventory pools cause — not just
  "faster shipping" as an end in itself.

Any new content (copy, demo logic, KPI definitions) should be checked against
these facts rather than reinvented per-section.

## Content rules

- **No placeholder content.** Every section that gets built ships with real,
  specific content — real numbers, real reasoning, real trade-offs (a
  realistic fictional scenario is fine; "Lorem ipsum" or "content coming
  soon" copy is not). The current eight section shells are intentionally
  empty scaffolding from the initial foundation build — that's the one
  exception, and it ends as soon as a section is being built.
- **No claimed affiliation.** Nothing on this site claims affiliation with,
  endorsement by, or insider knowledge of any specific real company. Any
  reference to a real company (this will mostly come up in Industry
  Signals) must be clearly labeled as educational/analytical commentary
  based on publicly available information — not presented as insider
  knowledge, confidential data, or an official case study of that company.
