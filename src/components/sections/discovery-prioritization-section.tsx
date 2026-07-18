import { XCircle } from "lucide-react";

import { SectionShell } from "@/components/section-shell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Hypothesis {
  track: "OMS" | "Sourcing" | "EDD";
  text: string;
}

const hypotheses: Hypothesis[] = [
  {
    track: "OMS",
    text: "Stock visibility, not sourcing logic, may be the bigger problem — if on-hand data is stale or wrong, even a good sourcing rule will pick a location that can't actually fulfill the order.",
  },
  {
    track: "Sourcing",
    text: "A single-factor rule (always nearest, or always the cheapest DC) is quietly picking worse locations than a multi-factor score would, especially when stock is uneven across nearby locations.",
  },
  {
    track: "EDD",
    text: "The delivery estimate shown at checkout is calculated independently of the sourcing decision, so it doesn't reflect the fulfillment path actually chosen — the promise can be wrong even when sourcing itself is right.",
  },
];

interface Candidate {
  name: string;
  reach: string;
  impact: number;
  impactLabel: string;
  confidence: string;
  effort: number;
  score: number;
  winner?: boolean;
}

const candidates: Candidate[] = [
  {
    name: "Cost-aware sourcing",
    reach: "100%",
    impact: 3,
    impactLabel: "Massive",
    confidence: "90%",
    effort: 2,
    score: 135,
    winner: true,
  },
  {
    name: "Dynamic EDD",
    reach: "100%",
    impact: 2,
    impactLabel: "High",
    confidence: "70%",
    effort: 4,
    score: 35,
  },
  {
    name: "Real-time capacity checks",
    reach: "100%",
    impact: 2,
    impactLabel: "High",
    confidence: "60%",
    effort: 5,
    score: 24,
  },
  {
    name: "Split-shipment logic",
    reach: "~25%",
    impact: 1,
    impactLabel: "Medium",
    confidence: "80%",
    effort: 3,
    score: 7,
  },
];

interface ExclusionItem {
  title: string;
  reason: string;
}

const exclusions: ExclusionItem[] = [
  {
    title: "No live carrier API integration",
    reason:
      "EDD in the MVP uses a static, zone-based transit-time table, not real-time carrier tracking data. Wiring up carrier APIs is a Next-horizon investment (Strategy & Roadmap) once the baseline estimate is proven.",
  },
  {
    title: "No promo-driven demand forecasting",
    reason:
      "Sourcing reacts to current stock and cost, not predicted demand spikes. Forecasting-informed sourcing is a Later-horizon capability that depends on having a reliable baseline first.",
  },
  {
    title: "No live capacity or labor signals",
    reason:
      "The MVP assumes a location with stock can process the order. Real-time throughput, dock, and labor capacity checks scored lowest of the higher-effort candidates below and are deferred to Later.",
  },
  {
    title: "No split-shipment optimization",
    reason:
      "The MVP always picks a single best location per order. Deciding when splitting an order across two locations is worth the extra shipping cost had the lowest RICE score of the candidates considered — see Trade-offs & Lessons Learned.",
  },
];

export function DiscoveryPrioritizationSection() {
  return (
    <SectionShell
      id="discovery-prioritization"
      index={4}
      title="Discovery & Prioritization"
      description="Before scoring anything, discovery narrowed the question from “how do we fix omni-channel fulfillment” to something testable: for the orders that cost too much or arrive late today, where does the process actually break?"
    >
      <div className="space-y-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Discovery
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Three hypotheses came out of that framing, each pointing at a
            different one of the OMS, Sourcing, and EDD tracks from Strategy
            &amp; Roadmap:
          </p>

          <div className="mt-6 flex flex-col divide-y divide-border/60 rounded-lg border border-border/60">
            {hypotheses.map((h) => (
              <div key={h.track} className="flex items-start gap-4 p-4 sm:p-5">
                <Badge variant="outline" className="mt-0.5 shrink-0 font-normal">
                  {h.track}
                </Badge>
                <p className="text-sm text-muted-foreground">{h.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-l-2 border-foreground/20 pl-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Job to be done — Operations / Fulfillment stakeholder
            </p>
            <p className="mt-2 max-w-2xl text-base leading-relaxed sm:text-lg">
              &ldquo;When an order comes in during a demand spike, I want the
              system to route it to a location that can fulfill it profitably
              and on time, so that I&apos;m not manually re-routing orders and
              absorbing customer complaints during the exact moments my team
              has the least slack to handle them.&rdquo;
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Prioritization
          </p>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Four candidate capabilities, scored with RICE (Reach × Impact ×
            Confidence ÷ Effort), to decide what to build first:
          </p>

          <div className="mt-6 overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Capability</th>
                  <th className="px-4 py-3 font-medium">Reach</th>
                  <th className="px-4 py-3 font-medium">Impact</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium">Effort</th>
                  <th className="px-4 py-3 font-medium">RICE score</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => (
                  <tr
                    key={c.name}
                    className={cn(
                      "border-b border-border/60 last:border-b-0",
                      c.winner && "bg-secondary/40"
                    )}
                  >
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-2">
                        {c.name}
                        {c.winner ? (
                          <Badge className="font-normal">Built first</Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.reach}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.impact} ({c.impactLabel})
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.confidence}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.effort} person-mo
                    </td>
                    <td className="px-4 py-3 font-semibold">{c.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground/70">
            Illustrative RICE inputs for this case study — reach, confidence,
            and effort are directional estimates, not measurements from a
            real system. Impact uses the standard RICE scale (3 = massive,
            2 = high, 1 = medium).
          </p>

          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Cost-aware sourcing scored highest by a wide margin
            </span>{" "}
            — it reuses data the OMS already holds (distance, on-hand stock,
            cost) instead of requiring new live integrations, so it clears
            the bar on effort as well as impact. That&apos;s the exact
            scoring logic the{" "}
            <a
              href="#interactive-demo"
              className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
            >
              Interactive Demo →
            </a>{" "}
            puts on screen: a transparent, weighted proximity + stock + cost
            score for every order.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            MVP definition
          </p>
          <div className="mt-4 rounded-lg border border-border/60 bg-secondary/30 p-6 sm:p-8">
            <p className="max-w-2xl text-base leading-relaxed sm:text-lg">
              The MVP scope is{" "}
              <span className="font-semibold">
                the sourcing decision plus the EDD calculation
              </span>{" "}
              — explainable, and driven by real inputs, not hardcoded demo
              data.
            </p>
          </div>

          <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
            Deliberately left out of that scope, and why:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {exclusions.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-lg border border-border/60 p-4"
              >
                <XCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.reason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
