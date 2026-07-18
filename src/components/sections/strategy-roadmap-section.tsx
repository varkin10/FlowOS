import { SectionShell } from "@/components/section-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RoadmapItem {
  track: "OMS" | "Sourcing" | "EDD";
  title: string;
  rationale: string;
  outcome: string;
  signal?: { label: string; href: string };
}

interface Horizon {
  name: string;
  timeframe: string;
  emphasis: "solid" | "medium" | "faint";
  items: RoadmapItem[];
}

const horizons: Horizon[] = [
  {
    name: "Now",
    timeframe: "0–6 months",
    emphasis: "solid",
    items: [
      {
        track: "OMS",
        title: "Unify inventory into a single order-management view",
        rationale:
          "One system of record across web, app, and store POS is the prerequisite for any sourcing decision — without it, overselling and phantom stock are guaranteed.",
        outcome: "Fill rate",
      },
      {
        track: "Sourcing",
        title: "Baseline sourcing: nearest location with sufficient stock",
        rationale:
          "A simple, explainable rule ships fast and replaces manual or spreadsheet-driven sourcing immediately — using the store and DC network that already exists rather than waiting on new fulfillment infrastructure.",
        outcome: "Cost-to-serve",
        signal: { label: "Target — ship-from-store", href: "#industry-signals" },
      },
      {
        track: "EDD",
        title: "Basic EDD: carrier transit-time table by zone",
        rationale:
          "A static distance-to-transit-time table gives every customer a delivery estimate at checkout — an early, honest promise beats no promise at all.",
        outcome: "Guest trust",
      },
    ],
  },
  {
    name: "Next",
    timeframe: "6–12 months",
    emphasis: "medium",
    items: [
      {
        track: "OMS",
        title: "Real-time inventory sync from stores and DCs",
        rationale:
          "Moving from batch updates to event-driven stock sync closes the gap between what the OMS believes is on hand and what's physically on the shelf, directly cutting oversells.",
        outcome: "Fill rate",
      },
      {
        track: "Sourcing",
        title:
          "Cost-aware sourcing: balance distance, shipping cost, and warehouse capacity",
        rationale:
          "Nearest-location logic ignores cost and capacity; scoring locations on a weighted mix avoids overloading a single DC and reduces avoidable split shipments.",
        outcome: "Cost-to-serve",
      },
      {
        track: "EDD",
        title: "EDD accuracy using historical carrier performance",
        rationale:
          "Replacing a static zone table with actual carrier on-time performance by lane tightens the delivery window and shrinks the gap between promised and actual arrival.",
        outcome: "Delivery-promise accuracy",
      },
    ],
  },
  {
    name: "Later",
    timeframe: "12–24 months",
    emphasis: "faint",
    items: [
      {
        track: "OMS",
        title: "Real-time capacity signals feed the OMS (labor, dock, throughput)",
        rationale:
          "Sourcing can't just know what's in stock — it needs to know which locations can actually process the order right now, especially during demand spikes.",
        outcome: "Cost-to-serve",
      },
      {
        track: "Sourcing",
        title: "Predictive, dynamic sourcing for promo-driven demand spikes",
        rationale:
          "Static scoring breaks down during promotions or regional stockouts; a model that anticipates demand and capacity shifts keeps sourcing decisions good under stress, not just on a quiet Tuesday.",
        outcome: "Fill rate under load",
      },
      {
        track: "EDD",
        title: "Dynamic EDD that adjusts to real-time network conditions",
        rationale:
          "An estimate that updates with current capacity and carrier conditions, instead of a fixed table, keeps the promise honest even when the network is strained.",
        outcome: "Guest trust",
      },
    ],
  },
];

const emphasisDot: Record<Horizon["emphasis"], string> = {
  solid: "bg-foreground",
  medium: "bg-foreground/50",
  faint: "bg-foreground/25",
};

export function StrategyRoadmapSection() {
  return (
    <SectionShell
      id="strategy-roadmap"
      index={3}
      title="Strategy & Roadmap"
      description="A 12–24 month view, phased across three horizons, scoped to the three capabilities that make sourcing and delivery promising work: the OMS that unifies inventory, the sourcing logic that decides where an order ships from, and the EDD (estimated delivery date) shown to the customer."
    >
      <div className="space-y-12">
        <div className="rounded-lg border border-border/60 bg-secondary/30 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            What &ldquo;good&rdquo; looks like
          </p>
          <p className="mt-3 max-w-3xl text-base leading-relaxed sm:text-lg">
            Good omni-channel fulfillment means every order gets the right
            item, at the right cost, in the right amount of time — every
            time, regardless of which channel it came through. That means
            treating store and warehouse inventory as one shared pool
            instead of separate silos, choosing a fulfillment location
            based on real trade-offs between distance, cost, and capacity
            rather than a single fixed rule, and giving customers a delivery
            estimate that holds up because it&apos;s grounded in real
            network conditions rather than a static assumption. Done well,
            a retailer doesn&apos;t have to choose between fast, cheap, and
            accurate — and the customer can&apos;t tell, and doesn&apos;t
            need to know, which channel or location actually fulfilled the
            order.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {horizons.map((horizon) => (
            <Card key={horizon.name} className="flex flex-col border-border/60">
              <CardHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      emphasisDot[horizon.emphasis]
                    )}
                  />
                  <span className="text-base font-semibold tracking-tight">
                    {horizon.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {horizon.timeframe}
                </p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <div className="flex flex-1 flex-col divide-y divide-border/60">
                  {horizon.items.map((item) => (
                    <div key={item.track} className="space-y-2 py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="font-normal">
                          {item.track}
                        </Badge>
                        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
                          {item.outcome}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-snug">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.rationale}
                      </p>
                      {item.signal ? (
                        <a
                          href={item.signal.href}
                          className="inline-block text-xs font-medium text-foreground underline underline-offset-2 hover:no-underline"
                        >
                          ↳ Signal: {item.signal.label} →
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
