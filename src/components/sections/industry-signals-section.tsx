import { Info } from "lucide-react";

import { SectionShell } from "@/components/section-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Signal {
  company: string;
  tag: string;
  challenge: string;
  approach: string;
  lesson: string;
  linkLabel: string;
  linkHref: string;
}

const signals: Signal[] = [
  {
    company: "Target",
    tag: "Ship-from-store",
    challenge:
      "Target's stores held far more inventory, in far more locations, than its online-only fulfillment centers — but that stock wasn't usable for online orders.",
    approach:
      "Target has publicly described turning the large majority of its store fleet into fulfillment nodes: using in-store staff and existing stock to pick, pack, and ship (or hand off) online orders, rather than building new fulfillment infrastructure first.",
    lesson:
      "Informed a decision in Strategy & Roadmap: phase 1 leans on fulfillment capacity a retailer already has (its stores) before investing in new infrastructure.",
    linkLabel: "See Strategy & Roadmap",
    linkHref: "#strategy-roadmap",
  },
  {
    company: "Walmart",
    tag: "Inventory visibility",
    challenge:
      "With thousands of stores plus e-commerce and marketplace channels, Walmart's hardest problem wasn't shipping speed — it was knowing, in real time, what was actually on the shelf at each location.",
    approach:
      "Walmart has publicly discussed investment in real-time inventory-tracking and in-store scanning to close the gap between recorded stock and physical stock, so sourcing decisions reflect what's really available.",
    lesson:
      "Informed a decision in the Interactive Demo: each fulfillment location carries a stock-confidence factor, not just a raw on-hand count, so a location with less reliable inventory data scores lower.",
    linkLabel: "See Interactive Demo",
    linkHref: "#interactive-demo",
  },
  {
    company: "Amazon",
    tag: "Network-scale routing",
    challenge:
      "At Amazon's scale, \"which location fulfills this order\" can't be a lookup table — across a vast fulfillment network, it's a constant, algorithmic trade-off between distance, stock placement, and shipping cost or speed.",
    approach:
      "Amazon has publicly described automated, algorithmic selection of fulfillment nodes and forecasting-driven inventory placement, rather than static, hand-written routing rules.",
    lesson:
      "Informed a decision in the Interactive Demo: sourcing is scored as a weighted combination of proximity, stock, and cost — not a single hard-coded rule like \"always ship from the nearest location.\"",
    linkLabel: "See Interactive Demo",
    linkHref: "#interactive-demo",
  },
];

export function IndustrySignalsSection() {
  return (
    <SectionShell
      id="industry-signals"
      index={2}
      title="Industry Signals"
      description="This isn't a novel problem. Large omni-channel retailers have described, in public reporting, how they've approached the same sourcing and visibility challenges — a few of those signals are below, alongside the specific design decision each one informed elsewhere in this project."
    >
      <div className="space-y-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {signals.map((signal) => (
            <Card key={signal.company} className="flex flex-col border-border/60">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{signal.company}</CardTitle>
                  <Badge variant="secondary" className="whitespace-nowrap font-normal">
                    {signal.tag}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Challenge — </span>
                  {signal.challenge}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Approach — </span>
                  {signal.approach}
                </p>
                <p className="mt-auto border-t border-border/60 pt-3 text-muted-foreground">
                  {signal.lesson}{" "}
                  <a
                    href={signal.linkHref}
                    className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
                  >
                    {signal.linkLabel} →
                  </a>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/40 p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-foreground">
            Educational references based on publicly available reporting; not
            affiliated with or endorsed by these companies. No non-public
            information is used or implied.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
