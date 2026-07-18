import { Boxes, DollarSign, Gauge, ShieldAlert } from "lucide-react";

import { SectionShell } from "@/components/section-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FulfillmentFlowDiagram } from "@/components/sections/fulfillment-flow-diagram";

const reasons = [
  {
    icon: Boxes,
    title: "Siloed inventory causes overselling and overstock",
    description:
      "When web, app, and store channels each hold their own slice of inventory, a store can sell out online while units sit unsold on a nearby shelf — or the reverse, where the system oversells stock that already moved.",
  },
  {
    icon: DollarSign,
    title: "Wrong sourcing decisions raise cost-to-serve",
    description:
      "Fulfilling from a distant DC instead of a nearby store means longer, more expensive shipping — and if one location can't cover the full order, it splits into multiple shipments, multiplying box, label, and carrier cost.",
  },
  {
    icon: ShieldAlert,
    title: "Inaccurate delivery promises erode trust",
    description:
      "A delivery estimate that turns out to be wrong doesn't just disappoint one order — it teaches customers not to trust the date at checkout, which shows up as cart abandonment and avoidable support contacts.",
  },
  {
    icon: Gauge,
    title: "Manual or rules-only sourcing can't keep up",
    description:
      "Static rules (\"always prefer the regional DC\") work fine on a quiet Tuesday. They break down during promotions, regional stockouts, or capacity spikes, when the best fulfillment location is changing hour to hour.",
  },
];

const stats = [
  {
    value: "~30–40%",
    label:
      "of online orders could plausibly ship from a closer, cheaper location than a static rules engine would pick",
  },
  {
    value: "2–4×",
    label:
      "higher shipping cost is typical when an order ships from a distant DC or splits across multiple packages",
  },
  {
    value: "~20%",
    label:
      "of shoppers abandon a purchase or contact support after a delivery estimate turns out to be wrong",
  },
];

export function ProblemSection() {
  return (
    <SectionShell
      id="problem"
      index={1}
      title="Problem"
      description="Every order an omni-channel retailer receives has to answer one question before anything else happens: where does this actually ship from? At the scale of a real retail network, that question is harder than it looks."
    >
      <div className="space-y-16">
        <div>
          <p className="mb-6 text-sm font-medium text-muted-foreground">
            The order flow looks simple from the outside
          </p>
          <FulfillmentFlowDiagram />
        </div>

        <div>
          <p className="mb-6 max-w-2xl text-sm font-medium text-muted-foreground">
            But the sourcing decision in the middle of that flow is where
            omni-channel fulfillment gets hard — for four compounding reasons
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((reason) => (
              <Card key={reason.title} className="border-border/60">
                <CardHeader className="flex-row items-start gap-3 space-y-0">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary">
                    <reason.icon className="size-4" />
                  </span>
                  <CardTitle className="text-base leading-snug">
                    {reason.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {reason.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="grid gap-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.value} className="border-t border-border pt-4">
                <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground/70">
            Illustrative estimates for this portfolio project — directionally
            realistic for omni-channel retail, but not sourced from any
            specific company&apos;s reported data.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
