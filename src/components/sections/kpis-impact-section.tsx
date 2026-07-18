import { SectionShell } from "@/components/section-shell";
import { Badge } from "@/components/ui/badge";
import { KpiMeterChart } from "@/components/sections/kpis/kpi-meter-chart";
import { CostToServeChart } from "@/components/sections/kpis/cost-to-serve-chart";
import { DeliveryTimeChart } from "@/components/sections/kpis/delivery-time-chart";
import { computeKpiData } from "@/lib/kpi-data";

function Field({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
        {label}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

function WhoBadges({ who }: { who: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {who.map((w) => (
        <Badge key={w} variant="outline" className="font-normal">
          {w}
        </Badge>
      ))}
    </div>
  );
}

export async function KpisImpactSection() {
  const data = await computeKpiData();

  return (
    <SectionShell
      id="kpis-impact"
      index={6}
      title="KPIs & Impact"
      description={`Five metrics an Ops/Product/Finance team would actually track for sourcing and EDD ownership — computed live by running the Interactive Demo's real sourcing engine across ${data.totalOrders} synthetic orders (every SKU, every delivery address, order sizes from 1 to 20 units), not invented figures.`}
    >
      <div className="space-y-16">
        {/* 1. Fill rate */}
        <div className="border-b border-border/60 pb-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-lg font-semibold tracking-tight">Fill rate</h3>
                <span className="text-2xl font-semibold">{data.fillRatePct}%</span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="What it measures"
                  text="The share of orders where the fulfillment network has enough total stock, across all locations combined, to cover the requested quantity without a full backorder."
                />
                <Field
                  label="Why it matters"
                  text="The sharpest measure of the Problem section's core failure mode — siloed inventory pools that oversell or leave stock stranded. A low fill rate means promises break before an order even ships."
                />
                <Field
                  label="Decisions it influences"
                  text="Whether to invest in real-time inventory sync (Strategy & Roadmap's Next-horizon OMS item), adjust safety-stock policy, or expand the fulfillment footprint."
                />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                    Who uses it
                  </p>
                  <div className="mt-1.5">
                    <WhoBadges who={["Ops", "Product", "Finance"]} />
                  </div>
                </div>
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground/70">
                Calculation: Σ(effective stock across all locations) ≥ requested
                quantity, as a % of simulated orders.
              </p>
              <p className="mt-4 max-w-xl text-sm text-muted-foreground">
                In this simulation, fill rate holds at {data.fillRatePct}% — the
                current 8-location network has enough redundancy for this
                catalog at everyday order sizes. That headroom is exactly what
                the{" "}
                <a
                  href="#strategy-roadmap"
                  className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
                >
                  Later-horizon roadmap item
                </a>{" "}
                (predictive, dynamic sourcing for promo-driven demand spikes)
                is built to protect — baseline conditions aren&apos;t the risk,
                demand spikes and disruptions are.
              </p>
            </div>
            <div>
              <KpiMeterChart
                label="Fill rate"
                valuePct={data.fillRatePct}
                targetPct={98}
                direction="higher-is-better"
              />
            </div>
          </div>
        </div>

        {/* 2. Cost-to-serve — the explicit Strategy & Roadmap / Discovery & Prioritization tie-back */}
        <div className="border-b border-border/60 pb-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  Cost-to-serve
                </h3>
                <span className="text-2xl font-semibold">
                  ${data.costToServe.costAwareAvg} avg
                </span>
                <Badge className="font-normal">
                  -{data.costToServe.improvementPct}% vs naive
                </Badge>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="What it measures"
                  text="Average shipping + handling cost per order, from whichever location actually fulfills it."
                />
                <Field
                  label="Why it matters"
                  text="Directly determines per-order margin. Sourcing from a distant or expensive location quietly erodes profitability even when the delivery experience looks fine to the customer."
                />
                <Field
                  label="Decisions it influences"
                  text="Which sourcing capability to build first — the exact metric Discovery & Prioritization's RICE scoring optimized for when it ranked cost-aware sourcing above the other three candidates."
                />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                    Who uses it
                  </p>
                  <div className="mt-1.5">
                    <WhoBadges who={["Finance", "Ops", "Product"]} />
                  </div>
                </div>
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground/70">
                Calculation: (base handling fee + distance × carrier
                cost-per-mile) × location cost multiplier, averaged across
                simulated orders and compared against a naive
                nearest-location-only baseline.
              </p>

              <div className="mt-6 rounded-lg border border-foreground/20 bg-secondary/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Connected to Strategy &amp; Roadmap and Discovery &amp;
                  Prioritization
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <a
                    href="#strategy-roadmap"
                    className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
                  >
                    Strategy &amp; Roadmap&apos;s
                  </a>{" "}
                  &ldquo;Now&rdquo; horizon defines the baseline as
                  nearest-location-with-stock sourcing — no cost awareness.{" "}
                  <a
                    href="#discovery-prioritization"
                    className="font-medium text-foreground underline underline-offset-2 hover:no-underline"
                  >
                    Discovery &amp; Prioritization&apos;s
                  </a>{" "}
                  RICE table scored cost-aware sourcing highest specifically
                  because it improves this metric without new integrations.
                  Run across all {data.totalOrders} simulated orders, the
                  Interactive Demo&apos;s actual cost-aware logic cuts average
                  cost-to-serve by{" "}
                  <span className="font-semibold text-foreground">
                    {data.costToServe.improvementPct}%
                  </span>{" "}
                  vs that naive baseline (${data.costToServe.naiveAvg} → $
                  {data.costToServe.costAwareAvg}) — the roadmap bet,
                  quantified.
                </p>
              </div>
            </div>
            <div>
              <CostToServeChart data={data.costToServe.byCategory} />
            </div>
          </div>
        </div>

        {/* 3. Delivery-promise accuracy / EDD hit rate */}
        <div className="border-b border-border/60 pb-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  Delivery-promise accuracy (EDD hit rate)
                </h3>
                <span className="text-2xl font-semibold">
                  {data.eddHitRatePct}%
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="What it measures"
                  text="The share of orders that arrive on or before the delivery date promised at checkout."
                />
                <Field
                  label="Why it matters"
                  text="Ties directly to the Problem section's “inaccurate delivery promises erode trust” — a wrong promise doesn't just disappoint one order, it teaches customers not to trust the date at checkout."
                />
                <Field
                  label="Decisions it influences"
                  text="Whether to invest in EDD accuracy using real carrier performance data (Strategy & Roadmap's Next-horizon EDD item) instead of the static zone-based transit table used today."
                />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                    Who uses it
                  </p>
                  <div className="mt-1.5">
                    <WhoBadges who={["Product", "Ops"]} />
                  </div>
                </div>
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground/70">
                Calculation: % of simulated orders where the actual delivery
                time is at or before the promised EDD.
              </p>
              <p className="mt-4 max-w-xl text-sm text-muted-foreground">
                Disclosed: this MVP has no live carrier tracking yet (an
                explicit Discovery &amp; Prioritization exclusion), so
                &ldquo;actual&rdquo; delivery outcomes here are modeled with a
                realistic on-time/late variance distribution, not real
                tracking data.
              </p>
            </div>
            <div>
              <KpiMeterChart
                label="EDD hit rate"
                valuePct={data.eddHitRatePct}
                targetPct={90}
                direction="higher-is-better"
              />
            </div>
          </div>
        </div>

        {/* 4. Average delivery time */}
        <div className="border-b border-border/60 pb-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  Average delivery time
                </h3>
                <span className="text-2xl font-semibold">
                  {data.avgDeliveryDays}d avg
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="What it measures"
                  text="Mean number of days from order to estimated delivery, across all fulfilled orders."
                />
                <Field
                  label="Why it matters"
                  text="A direct lever on customer experience and competitiveness, and a proxy for how well sourcing minimizes unnecessary distance and processing delay."
                />
                <Field
                  label="Decisions it influences"
                  text="Whether faster local fulfillment — the ship-from-store pattern behind the Target signal — is worth its cost premium for a given SKU or region."
                />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                    Who uses it
                  </p>
                  <div className="mt-1.5">
                    <WhoBadges who={["Product", "Ops"]} />
                  </div>
                </div>
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground/70">
                Calculation: average of (processing time + carrier transit
                time + buffer) across simulated orders, broken out by carrier
                distance band.
              </p>
            </div>
            <div>
              <DeliveryTimeChart data={data.deliveryTimeByBand} />
            </div>
          </div>
        </div>

        {/* 5. Split-shipment rate */}
        <div>
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex items-baseline gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  Split-shipment rate
                </h3>
                <span className="text-2xl font-semibold">
                  {data.splitShipmentRatePct}%
                </span>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field
                  label="What it measures"
                  text="The share of orders where no single location has enough stock alone — fulfilling them without a backorder would require splitting the order across two or more locations."
                />
                <Field
                  label="Why it matters"
                  text="Split shipments multiply box, label, and carrier cost per order (the Problem section's #2 reason sourcing mistakes raise cost-to-serve) and complicate the delivery promise, since each leg can arrive on a different day."
                />
                <Field
                  label="Decisions it influences"
                  text="Whether to prioritize split-shipment optimization — currently the lowest-scoring candidate (RICE score 7) in Discovery & Prioritization's table. If this rate climbed meaningfully, that scoring would be worth revisiting."
                />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">
                    Who uses it
                  </p>
                  <div className="mt-1.5">
                    <WhoBadges who={["Ops", "Finance", "Product"]} />
                  </div>
                </div>
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground/70">
                Calculation: % of simulated orders where total network-wide
                stock covers the order but no single location&apos;s stock
                does.
              </p>
            </div>
            <div>
              <KpiMeterChart
                label="Split-shipment rate"
                valuePct={data.splitShipmentRatePct}
                targetPct={5}
                direction="lower-is-better"
              />
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
