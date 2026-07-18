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
      description="An honest retrospective: what this scoped version deliberately leaves out and why, what a real implementation would need that this doesn't have, and what building it surfaced about the earlier phases of this project."
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
              Lessons learned building this
            </p>
          </div>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li>
              Writing the narrative sections before the engine existed
              created a real risk: Industry Signals and Discovery &amp;
              Prioritization describe the scoring model a bit more loosely
              (&ldquo;weighted proximity + stock + cost&rdquo;) than what got
              built (stock gates eligibility; the score is distance, cost,
              and capacity). Caught on review and logged honestly in the{" "}
              <a
                href="#decision-journal"
                className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
              >
                Decision Journal
              </a>{" "}
              rather than quietly patched.
            </li>
            <li>
              Computing the KPI section by actually re-running the real
              engine across hundreds of synthetic orders — instead of
              writing plausible-sounding stats — surfaced a genuine
              surprise: fill rate holds at a flat 100% given the seeded
              stock levels. That ended up making the case study&apos;s own
              point better than an invented number would have — steady
              state isn&apos;t the risk here; spikes and disruptions are.
            </li>
            <li>
              Testing the disruption toggle by hand found that the default
              demo scenario wasn&apos;t actually illustrating the feature
              well. A demo&apos;s default state is itself a product
              decision worth testing deliberately, not an afterthought —
              logged as its own entry in the{" "}
              <a
                href="#decision-journal"
                className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
              >
                Decision Journal
              </a>
              .
            </li>
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}
