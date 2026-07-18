import {
  BrainCircuit,
  FlaskConical,
  Network,
  Truck,
} from "lucide-react";

import { SectionShell } from "@/components/section-shell";
import { Badge } from "@/components/ui/badge";

interface LeftOutItem {
  icon: React.ElementType;
  title: string;
  missing: string;
  why: string;
  cost: string;
}

const leftOut: LeftOutItem[] = [
  {
    icon: Truck,
    title: "Live carrier API integration",
    missing:
      "Real-time carrier rate quotes and tracking (a FedEx/UPS/USPS-style API) in place of the static zone-based transit-time table used everywhere in this project.",
    why: "This was built solo, on a fixed timeline, without a real retailer's carrier contracts or API credentials. There's no live data to integrate with — mocking a \"live\" integration convincingly would just be more static data with extra steps.",
    cost: "EDD accuracy is capped at what the static distance-band model can represent, and the Delivery-promise accuracy KPI's \"hit rate\" had to be simulated with a disclosed variance rather than measured against real tracking events.",
  },
  {
    icon: BrainCircuit,
    title: "ML-based demand forecasting",
    missing:
      "Predictive, promo-aware sourcing that anticipates a demand spike before it hits — the Later-horizon roadmap item — instead of reacting to today's stock and cost.",
    why: "Forecasting needs a real historical time series of orders and promotions to train against. This project has a seeded snapshot of inventory, not order history — building a forecasting model on top of already-synthetic data would compound the \"not real\" problem, not demonstrate anything.",
    cost: "The sourcing engine treats current conditions as the only signal that matters. It can't get ahead of a known future spike (a flash sale, a holiday weekend) the way a forecasting-informed system would.",
  },
  {
    icon: Network,
    title: "Multi-warehouse network optimization at scale",
    missing:
      "Jointly solving where every order in a batch should source from — accounting for cross-order capacity, in-transit inventory, and split-shipment trade-offs across the whole network — instead of this project's greedy, one-order-at-a-time scoring.",
    why: "That's a genuinely different class of problem (operations research / mixed-integer programming, not a scoring formula). Solving it well needs a dedicated optimization engineer and a live feed of network-wide state — neither fits a single-developer case study.",
    cost: "The demo's scoring is locally optimal per order but not globally optimal across a batch — it can't see that sourcing order A from Location X will starve Location X's capacity for order B a moment later.",
  },
];

interface NextItem {
  title: string;
  detail: string;
  roles: string[];
}

const buildNext: NextItem[] = [
  {
    title: "Real carrier integration, feeding real EDD accuracy",
    detail:
      "Replace the static zone table with a multi-carrier rate-and-transit API, and pipe actual delivery events back into the EDD hit-rate KPI so it measures reality instead of a simulated variance.",
    roles: ["Platform/data engineer"],
  },
  {
    title: "A real demand-forecasting signal",
    detail:
      "Train a promo- and seasonality-aware demand model on real historical order data, then feed its output into the sourcing score as a genuine fourth factor alongside distance, cost, and capacity.",
    roles: ["ML engineer", "Data scientist"],
  },
  {
    title: "A true network-optimization solver",
    detail:
      "Replace greedy per-order scoring with a batch solver that jointly optimizes sourcing and split-shipment decisions across the whole network in near-real-time.",
    roles: ["Operations research engineer"],
  },
  {
    title: "Real experimentation, not just simulation",
    detail:
      "Everything in this project is backtested against synthetic orders. A real rollout needs A/B infrastructure to confirm cost-aware sourcing (or any new capability) actually moves fill rate, cost-to-serve, and EDD accuracy against a live control group.",
    roles: ["Analytics/experimentation"],
  },
];

export function TradeoffsLessonsSection() {
  return (
    <SectionShell
      id="tradeoffs-lessons"
      index={8}
      title="Trade-offs & Lessons Learned"
      description="An honest retrospective: what this scoped version deliberately leaves out and why, what a real implementation would need that this doesn't have, and what modeling the problem concretely surfaced about fulfillment itself."
    >
      <div className="space-y-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What this scoped version deliberately left out
          </p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {leftOut.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-4 rounded-lg border border-border/60 p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <item.icon className="size-4" />
                  </span>
                  <h3 className="text-sm font-semibold leading-snug">
                    {item.title}
                  </h3>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                    What&apos;s missing
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.missing}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                    Why, given real constraints
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.why}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                    What it costs
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.cost}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What I&apos;d build next, with a real engineering team
          </p>
          <div className="mt-6 flex flex-col divide-y divide-border/60 rounded-lg border border-border/60">
            {buildNext.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
              >
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5 sm:justify-end">
                  {item.roles.map((role) => (
                    <Badge key={role} variant="outline" className="font-normal">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-l-2 border-foreground/20 pl-5">
          <div className="flex items-center gap-2">
            <FlaskConical className="size-4 text-muted-foreground" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              What modeling this concretely surfaced
            </p>
          </div>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">
                What a real implementation would still need:
              </span>{" "}
              actual carrier performance data to replace the assumed
              transit-time bands, real historical order volume to fit the
              demand-forecasting model the roadmap defers to Later — and,
              less technical but just as necessary, explicit sign-off from
              Ops and Finance on the sourcing formula itself before it
              ships. A scoring model that trades cost against speed is a
              policy decision, not just an engineering one.
            </li>
            <li>
              <span className="font-medium text-foreground">
                What I&apos;d do differently with more time:
              </span>{" "}
              the distance/cost/capacity weights (40% / 35% / 25%) are
              asserted, not fit. With real historical order data, they
              should be backtested against actual outcomes before being
              locked in — the same way the 0.5-day EDD buffer is an
              estimate that should be validated against real carrier
              on-time performance rather than assumed.
            </li>
            <li>
              <span className="font-medium text-foreground">
                What surprised me about the problem itself:
              </span>{" "}
              cost-to-serve turns out to be driven far more by which type
              of location fulfills an order than by fine differences in
              distance — a store&apos;s manual-handling cost premium
              (roughly 8–18% above a DC&apos;s) routinely outweighs a
              location being tens of miles closer. The second surprise came
              from the disruption toggle: the sourcing decision is stable
              under normal conditions but genuinely fragile the moment a
              real contender — the nearest store, or the busiest DC — gets
              knocked out. EDD can swing a full day on a single node going
              down.
            </li>
            <li>
              <span className="font-medium text-foreground">
                What I&apos;d want to validate with Ops and Finance before
                shipping this:
              </span>{" "}
              whether the stock-confidence gap between stores and DCs
              (~82–94% vs. ~93–99%) matches Ops&apos;s actual cycle-count
              variance, not an assumed split; whether the carrier
              cost-per-mile and handling-fee assumptions behind the
              quantified 4.5% cost-to-serve improvement hold up against
              Finance&apos;s real contracted rates before that number is
              treated as a savings projection; and whether both teams
              actually agree that distance should outweigh cost in the
              scoring — that&apos;s a speed-versus-margin trade-off worth a
              real conversation, not a default.
            </li>
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
