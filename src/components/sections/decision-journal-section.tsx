import { SectionShell } from "@/components/section-shell";
import { Badge } from "@/components/ui/badge";

interface DecisionField {
  label: string;
  text: string;
}

interface DecisionEntry {
  id: string;
  phaseLabel: string;
  phaseHref?: string;
  decision: string;
  why: string;
  alternatives: string;
  tradeoff: string;
  impact: string;
}

const decisions: DecisionEntry[] = [
  {
    id: "01",
    phaseLabel: "Phase 4 → 5",
    phaseHref: "#interactive-demo",
    decision:
      "Weighting cost-to-ship and capacity load alongside distance, not routing to the nearest location with stock",
    why: "A pure nearest-location rule regularly picks an available location while ignoring everything else that determines whether it's actually the right one — it optimizes for distance and nothing else.",
    alternatives:
      "Nearest-location-with-stock only — this is literally the Strategy & Roadmap “Now”-horizon baseline; a fixed priority order (always the regional DC, or always the closest store).",
    tradeoff:
      "A fixed-weight formula (distance 40% / cost 35% / capacity 25%) is fully explainable to a stakeholder in one sentence, but it can't learn from outcomes or flex by SKU or season the way a model-based approach eventually could.",
    impact:
      "Cuts average cost-to-serve by 4.5% against the naive nearest-only baseline across the full simulated order set ($100.68 → $96.12) — the number the roadmap bet on.",
  },
  {
    id: "02",
    phaseLabel: "Phase 4",
    phaseHref: "#discovery-prioritization",
    decision: "Scoping the MVP to sourcing decision + EDD only",
    why: "Split-shipment logic, live carrier APIs, real-time capacity signals, and demand forecasting each depend on something that doesn't exist yet — a carrier integration, a demand history to forecast from, or a live network-state feed. Building any of them first means building on an unproven foundation.",
    alternatives:
      "Ship split-shipment logic in the same release, since some orders genuinely need it; hold the release entirely until a carrier integration exists so EDD would be accurate from day one.",
    tradeoff:
      "Operationally: an order that would ideally split across two nearby locations instead sources from a single location that may cost more or sit farther away, and in the rare case no single location has enough stock, it can't be sourced automatically at all — quantified at a 1.3% split-shipment rate across simulated orders, with EDD capped by a static transit-time table instead of real carrier data.",
    impact:
      "Split-shipment logic scored lowest of four RICE-scored candidates (RICE 7 vs. 135 for cost-aware sourcing) — deferring it was the correct sequencing call, not a corner cut, and both costs above are small and directly measured, not hidden.",
  },
  {
    id: "03",
    phaseLabel: "Phase 5",
    phaseHref: "#interactive-demo",
    decision: "Weighting store stock less confidently than DC stock",
    why: "Store counts drift from manual handling and foot traffic between cycle counts; DCs are more automated and counted more often. Trusting every location's raw on-hand number equally would let a store with stale, optimistic stock data still “win” a sourcing decision it can't actually fulfill.",
    alternatives:
      "Trust every location's on-hand count equally regardless of type — the industry pattern Walmart's public investment in real-time inventory visibility (Industry Signals) was a direct reaction against.",
    tradeoff:
      "Stores are seeded with a lower stock-confidence factor (~82–94%) than DCs (~93–99%), applied before comparing on-hand stock to the requested quantity. A store that genuinely has enough stock can still get excluded if its confidence-adjusted effective stock dips just under what's needed — a deliberately conservative bias toward avoiding oversells over maximizing store utilization.",
    impact:
      "Directly protects fill rate and reduces the oversell risk the Problem section opens with, at the cost of occasionally under-using real, available store inventory.",
  },
  {
    id: "04",
    phaseLabel: "Phase 3",
    phaseHref: "#strategy-roadmap",
    decision:
      "Sequencing cost-aware sourcing before predictive, demand-aware sourcing",
    why: "Cost-aware sourcing only needs data the OMS already holds — distance, on-hand stock, cost. Predictive sourcing needs a real demand-forecasting signal, which needs historical order and promotion data a first release doesn't have yet.",
    alternatives:
      "Build the promo-aware, demand-forecasting version first, since it's the more sophisticated answer and the more impressive one to point to.",
    tradeoff:
      "Until the Later horizon ships, sourcing reacts to today's stock and capacity only — it can't get ahead of a known future demand spike the way a forecasting-informed system eventually will.",
    impact:
      "Ships real cost-to-serve savings in the Next horizon (6–12 months) instead of betting the first release on a forecasting model with no historical data to train on yet.",
  },
  {
    id: "05",
    phaseLabel: "Phase 6",
    phaseHref: "#kpis-impact",
    decision:
      "Delivery-promise accuracy was the hardest KPI to define cleanly",
    why: "This MVP has no live carrier integration (a deliberate scope decision — see above), so there's no ground truth to compare the promised EDD against. Every other KPI here is computed directly from the sourcing engine's own outputs; this one required assuming an “actual” delivery outcome that doesn't otherwise exist.",
    alternatives:
      "Omit the KPI entirely until real tracking data exists; report a static illustrative number instead of running it through the simulation.",
    tradeoff:
      "EDD hit rate is reported as a modeled estimate (80.3%) — actual delivery outcomes are simulated with a disclosed on-time/late variance distribution. It's directionally reasonable but exactly as trustworthy as the assumed distribution feeding it, and that's disclosed directly in the KPI section rather than buried.",
    impact:
      "Keeps the KPI framework ready to plug in real carrier tracking the moment that integration ships, without pretending this release already has it.",
  },
  {
    id: "06",
    phaseLabel: "Phase 5",
    phaseHref: "#interactive-demo",
    decision:
      "Weighting distance slightly higher than cost, not the other way around",
    why: "Both are defensible fulfillment strategies. Weighting cost highest would maximize margin per order; weighting distance highest favors a faster, more consistent delivery experience — closer to what Strategy & Roadmap's vision statement actually promises: the right item, at the right cost, in the right amount of time.",
    alternatives:
      "Weight cost-to-ship highest — a margin-first posture that would route more orders to cheaper, more distant DCs even when a nearby store is only marginally more expensive.",
    tradeoff:
      "Distance is weighted highest (40%), ahead of cost-to-ship (35%) and capacity load (25%). A margin-first weighting would likely lower cost-to-serve further, but at the cost of average delivery time and, by extension, delivery-promise accuracy.",
    impact:
      "Keeps average delivery time and EDD hit rate as first-class outcomes rather than whatever falls out of a pure cost-minimization score — protects speed and reliability slightly ahead of squeezing the last few points of cost-to-serve.",
  },
];

function Field({ label, text }: DecisionField) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
        {label}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

export function DecisionJournalSection() {
  return (
    <SectionShell
      id="decision-journal"
      index={7}
      title="Decision Journal"
      description="A log of the significant fulfillment-product decisions made while designing this project's sourcing and EDD logic — the kind of calls a PM owning OMS/Sourcing/EDD would make and defend to stakeholders, pulled from what was actually designed in Phases 3–6."
    >
      <div className="flex flex-col divide-y divide-border/60 rounded-lg border border-border/60">
        {decisions.map((d) => (
          <div key={d.id} className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground/70">
                {d.id}
              </span>
              {d.phaseHref ? (
                <a href={d.phaseHref}>
                  <Badge variant="outline" className="font-normal hover:bg-secondary">
                    {d.phaseLabel}
                  </Badge>
                </a>
              ) : (
                <Badge variant="outline" className="font-normal">
                  {d.phaseLabel}
                </Badge>
              )}
              <h3 className="text-base font-semibold leading-snug">
                {d.decision}
              </h3>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Why" text={d.why} />
              <Field label="Alternatives considered" text={d.alternatives} />
              <Field label="Trade-off accepted" text={d.tradeoff} />
              <Field label="Business impact" text={d.impact} />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
