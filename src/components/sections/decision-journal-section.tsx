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
    phaseLabel: "Foundation",
    decision: "Single-page scroll site with sticky nav, not a multi-page app",
    why: "This is a narrative case study meant to be read start-to-finish, not a product with distinct destinations to navigate between.",
    alternatives:
      "A multi-page site with one route per section — more typical for an actual product.",
    tradeoff:
      "Everything renders on one route, so there's no per-section code-splitting — the page gets heavier as more interactive sections (Demo, KPIs) are added.",
    impact:
      "A cohesive, skimmable reading experience via the sticky nav; first-load JS has grown to ~283KB by Phase 6, worth watching as more sections ship.",
  },
  {
    id: "02",
    phaseLabel: "Foundation",
    decision: "SQLite instead of a hosted Postgres instance",
    why: "A portfolio case study doesn't need an always-on hosted database or multi-user concurrency — SQLite is a single file, zero-config, and fully reproducible.",
    alternatives:
      "Postgres on a hosted provider (Vercel/Supabase/Neon) for closer-to-production realism.",
    tradeoff:
      "Not concurrency-safe and not how a real OMS would be deployed — acceptable because this is a single-visitor demo, not a live multi-tenant system.",
    impact:
      "Zero external services or secrets to configure; db:push + db:seed fully reproduce the dataset from scratch on any machine.",
  },
  {
    id: "03",
    phaseLabel: "Phase 4 → 5",
    phaseHref: "#interactive-demo",
    decision:
      "Weighted-score sourcing (distance + cost + capacity) over a simple nearest-location rule",
    why: "A single hard-coded rule can't represent real trade-offs — Amazon's network-scale routing (Industry Signals) and the RICE scoring both pointed at a multi-factor score instead.",
    alternatives:
      "Nearest-location-with-stock only (the actual “Now”-horizon baseline in Strategy & Roadmap); a fixed priority order (always cheapest DC, or always nearest store).",
    tradeoff:
      "A fixed-weight formula (distance 40% / cost 35% / capacity 25%) is fully explainable but not adaptive — it can't learn from outcomes or vary by SKU or season.",
    impact:
      "Became the literal Interactive Demo scoring logic, and the source of the KPI section's quantified cost-to-serve improvement (4.5% vs. the naive baseline).",
  },
  {
    id: "04",
    phaseLabel: "Phase 4",
    phaseHref: "#discovery-prioritization",
    decision:
      "Prioritizing cost-aware sourcing over three other RICE candidates",
    why: "It scored highest by a wide margin (RICE 135 vs. 35 / 24 / 7) because it reuses data the OMS already holds — no new live integrations required.",
    alternatives:
      "Real-time capacity checks (RICE 24), dynamic EDD (RICE 35), and split-shipment logic (RICE 7) — all deferred, not rejected.",
    tradeoff:
      "Those three capabilities address real problems (stale capacity data, a static EDD table, no split-shipment optimization) that are simply out of scope until this baseline is proven.",
    impact:
      "Set the entire Phase 5 build scope — the Interactive Demo builds exactly the RICE winner, nothing else.",
  },
  {
    id: "05",
    phaseLabel: "Phase 4",
    phaseHref: "#discovery-prioritization",
    decision: "Scoping the MVP to sourcing + EDD only",
    why: "An explainable sourcing decision plus an EDD calculation is a complete, defensible loop on its own — a live carrier integration or a demand-forecasting model each add a dependency that isn't ready yet.",
    alternatives:
      "A thinner sourcing-only demo with no EDD; a fuller build with live carrier API integration for real transit times.",
    tradeoff:
      "EDD uses a static, zone-based transit-time table rather than real carrier performance data — less accurate than production would need, but fully auditable.",
    impact:
      "Kept Phase 5 achievable with one Prisma schema and no external API keys, while still shipping a complete sourcing-to-promise flow.",
  },
  {
    id: "06",
    phaseLabel: "Phase 5",
    phaseHref: "#interactive-demo",
    decision:
      "Showing the full score breakdown for the top 2–3 candidates, not just the winner",
    why: "The whole premise of this case study is that a sourcing decision should be explainable to a stakeholder — a single winning location with no reasoning is a black box.",
    alternatives:
      "Show only the winning location and the final EDD date; a one-sentence explanation with no numeric breakdown.",
    tradeoff:
      "More UI surface area and cognitive load per result than a clean, consumer-style “here's your delivery date” screen.",
    impact:
      "Set the design language for the rest of the site — every section that makes a claim (the RICE table, roadmap rationale, KPI “why it matters” fields) shows its reasoning, not just its conclusion.",
  },
  {
    id: "07",
    phaseLabel: "Phase 5",
    phaseHref: "#interactive-demo",
    decision: "Stock as a hard eligibility filter, not a weighted score input",
    why: "A location either can or can't fulfill an order — folding stock into a soft-weighted score could let an under-stocked location still “win” on paper.",
    alternatives:
      "Scoring stock depth/confidence as a fourth weighted factor alongside distance, cost, and capacity — closer to how the Industry Signals and Discovery & Prioritization sections describe it in prose.",
    tradeoff:
      "Created a minor wording mismatch between those earlier narrative sections (“weighted proximity + stock + cost”) and the actual engine (stock gates eligibility; the score is distance/cost/capacity) — caught on review, left as-is since the engine's weights and logic are intentionally frozen.",
    impact:
      "The engine never recommends a location that can't actually fulfill the order, at the cost of that one cross-section wording inconsistency.",
  },
  {
    id: "08",
    phaseLabel: "Phase 5",
    phaseHref: "#interactive-demo",
    decision: "Retuning the default demo scenario instead of the sourcing engine",
    why: "Testing the disruption toggles found the original default address (Charlotte, NC) didn't visibly demonstrate the “nearest location out of stock” toggle — the engine's weights weren't wrong, the default preset just wasn't illustrative.",
    alternatives:
      "Adjusting the engine's weights or seed stock levels so more scenarios show a visible change.",
    tradeoff:
      "About half of all SKU/address combinations still show “no visible change” for a given toggle — correct, realistic behavior, just not the default experience anymore.",
    impact:
      "A first-time visitor now sees a real winner + EDD change without touching any inputs; the underlying engine was never modified.",
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
      description="A log of the significant product and technical decisions made while building this project, pulled from what was actually decided in Phases 1–6 — not a fictional team's, this one's the author's own."
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
              <Field label="Impact" text={d.impact} />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
