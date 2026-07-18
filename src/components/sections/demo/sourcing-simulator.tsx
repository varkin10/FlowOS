"use client";

import * as React from "react";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  runSourcingSimulation,
  type DisruptionType,
  type ScenarioResult,
  type SimulationResult,
} from "@/lib/sourcing-engine";

interface SkuOption {
  id: string;
  code: string;
  name: string;
  category: string;
}

interface CustomerLocationOption {
  id: string;
  label: string;
}

interface SourcingSimulatorProps {
  skus: SkuOption[];
  customerLocations: CustomerLocationOption[];
}

const disruptionOptions: { value: DisruptionType; label: string; description: string }[] = [
  {
    value: "none",
    label: "No disruption",
    description: "Baseline network conditions",
  },
  {
    value: "nearest-out-of-stock",
    label: "Nearest location out of stock",
    description: "Force the closest location's stock to zero",
  },
  {
    value: "primary-dc-at-capacity",
    label: "Primary DC at capacity",
    description: "Force the largest DC to 100% utilization",
  },
];

export function SourcingSimulator({ skus, customerLocations }: SourcingSimulatorProps) {
  const [skuId, setSkuId] = React.useState(skus[0]?.id ?? "");
  const [quantity, setQuantity] = React.useState(2);
  const [customerLocationId, setCustomerLocationId] = React.useState(
    customerLocations[0]?.id ?? ""
  );
  const [disruption, setDisruption] = React.useState<DisruptionType>("none");
  const [result, setResult] = React.useState<SimulationResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await runSourcingSimulation({
          skuId,
          quantity,
          customerLocationId,
          disruption,
        });
        setResult(res);
      } catch {
        setError("Couldn't run the simulation — try a different SKU or address.");
      }
    });
  }

  return (
    <div className="space-y-10">
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-lg border border-border/60 bg-secondary/30 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4"
      >
        <div className="space-y-1.5">
          <Label htmlFor="sku">SKU</Label>
          <Select value={skuId} onValueChange={setSkuId}>
            <SelectTrigger id="sku">
              <SelectValue placeholder="Choose a SKU" />
            </SelectTrigger>
            <SelectContent>
              {skus.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}{" "}
                  <span className="text-muted-foreground">({s.code})</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="customer-location">Delivery address</Label>
          <Select value={customerLocationId} onValueChange={setCustomerLocationId}>
            <SelectTrigger id="customer-location">
              <SelectValue placeholder="Choose a delivery address" />
            </SelectTrigger>
            <SelectContent>
              {customerLocations.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Running…
              </>
            ) : (
              "Run sourcing decision"
            )}
          </Button>
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <Label className="mb-2 block">Simulate a disruption</Label>
          <div className="flex flex-col gap-2 sm:flex-row">
            {disruptionOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDisruption(opt.value)}
                className={cn(
                  "flex-1 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                  disruption === opt.value
                    ? "border-foreground/30 bg-secondary"
                    : "border-border/60 hover:bg-secondary/50"
                )}
              >
                <span className="block font-medium">{opt.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {opt.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </form>

      {error ? (
        <p className="flex items-center gap-2 text-sm text-destructive">
          <AlertTriangle className="size-4" /> {error}
        </p>
      ) : null}

      {result ? <SimulationOutput result={result} /> : null}
    </div>
  );
}

function SimulationOutput({ result }: { result: SimulationResult }) {
  const current = result.scenario ?? result.baseline;

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          1. Stock check — {result.skuName}{" "}
          <span className="normal-case text-muted-foreground/70">
            ({result.skuCode}), qty {result.quantity}, shipping to{" "}
            {result.customerLabel}
          </span>
        </p>
        <StockCheckTable rows={current.stockCheck} />
      </div>

      {result.scenario ? (
        <div className="rounded-lg border border-foreground/20 bg-secondary/40 p-4">
          <p className="text-sm font-medium">
            {result.scenario.disruptionNote}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{result.diff}</p>
        </div>
      ) : null}

      <div
        className={cn(
          "grid gap-6",
          result.scenario ? "lg:grid-cols-2" : "lg:grid-cols-1"
        )}
      >
        <ScenarioPanel
          heading={result.scenario ? "Baseline — no disruption" : "2–3. Sourcing decision & EDD"}
          scenario={result.baseline}
          weights={result.weights}
        />
        {result.scenario ? (
          <ScenarioPanel
            heading={`With disruption — ${
              disruptionOptions.find((o) => o.value === result.scenario!.disruption)
                ?.label
            }`}
            scenario={result.scenario}
            weights={result.weights}
            emphasize
          />
        ) : null}
      </div>
    </div>
  );
}

function StockCheckTable({ rows }: { rows: ScenarioResult["stockCheck"] }) {
  const sorted = [...rows].sort((a, b) => a.distanceMiles - b.distanceMiles);
  return (
    <div className="mt-4 overflow-x-auto rounded-lg border border-border/60">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Location</th>
            <th className="px-4 py-3 font-medium">Distance</th>
            <th className="px-4 py-3 font-medium">On hand</th>
            <th className="px-4 py-3 font-medium">Confidence</th>
            <th className="px-4 py-3 font-medium">Effective stock</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.locationId}
              className={cn(
                "border-b border-border/60 last:border-b-0",
                row.disrupted && "bg-destructive/5"
              )}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 font-medium">
                  {row.name}
                  <Badge variant="outline" className="font-normal">
                    {row.type}
                  </Badge>
                  {row.disrupted ? (
                    <Badge variant="destructive" className="font-normal">
                      Disrupted
                    </Badge>
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.distanceMiles.toFixed(0)} mi
              </td>
              <td className="px-4 py-3 text-muted-foreground">{row.onHand}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {Math.round(row.stockConfidence * 100)}%
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {row.effectiveStock}{" "}
                <span className="text-xs">(need {row.required})</span>
              </td>
              <td className="px-4 py-3">
                {row.eligible ? (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    <CheckCircle2 className="size-4" /> Eligible
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground"
                    title={row.reason ?? undefined}
                  >
                    <XCircle className="size-4" /> {row.reason}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScenarioPanel({
  heading,
  scenario,
  weights,
  emphasize,
}: {
  heading: string;
  scenario: ScenarioResult;
  weights: SimulationResult["weights"];
  emphasize?: boolean;
}) {
  return (
    <div
      className={cn(
        "space-y-6 rounded-lg border p-5",
        emphasize ? "border-foreground/20 bg-secondary/20" : "border-border/60"
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {heading}
      </p>

      <div>
        <p className="text-sm font-medium">
          Sourcing ranking{" "}
          <span className="font-normal text-muted-foreground">
            (weights: distance {Math.round(weights.distance * 100)}% · cost{" "}
            {Math.round(weights.cost * 100)}% · capacity{" "}
            {Math.round(weights.capacity * 100)}%)
          </span>
        </p>
        {scenario.ranking.length > 0 ? (
          <div className="mt-3 overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">#</th>
                  <th className="px-3 py-2 font-medium">Location</th>
                  <th className="px-3 py-2 font-medium">Distance</th>
                  <th className="px-3 py-2 font-medium">Cost</th>
                  <th className="px-3 py-2 font-medium">Capacity</th>
                  <th className="px-3 py-2 font-medium">Score</th>
                </tr>
              </thead>
              <tbody>
                {scenario.ranking.map((c) => (
                  <tr
                    key={c.locationId}
                    className={cn(
                      "border-b border-border/60 last:border-b-0",
                      c.rank === 1 && "bg-secondary/40"
                    )}
                  >
                    <td className="px-3 py-2 text-muted-foreground">{c.rank}</td>
                    <td className="px-3 py-2 font-medium">
                      <div className="flex items-center gap-2">
                        {c.name}
                        {c.rank === 1 ? (
                          <Badge className="font-normal">Winner</Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {c.distanceMiles.toFixed(0)} mi
                      <span className="ml-1 text-xs">({c.distanceScore})</span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      ${c.costToShip.toFixed(2)}
                      <span className="ml-1 text-xs">({c.costScore})</span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {c.capacityLoadPct.toFixed(0)}%
                      <span className="ml-1 text-xs">({c.capacityScore})</span>
                    </td>
                    <td className="px-3 py-2 font-semibold">
                      {c.weightedTotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        <p className="mt-3 text-sm text-muted-foreground">
          {scenario.explanation}
        </p>
      </div>

      {scenario.edd ? (
        <div>
          <p className="text-sm font-medium">EDD from {scenario.edd.locationName}</p>
          <div className="mt-3 space-y-1.5 rounded-lg border border-border/60 bg-background p-4 font-mono text-xs sm:text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Processing ({scenario.edd.baseProcessingHours}h base × load
                penalty {scenario.edd.loadPenaltyPct}%, {scenario.edd.utilizationPct}%
                utilized)
              </span>
              <span>{scenario.edd.effectiveProcessingHours}h → {scenario.edd.processingDays}d</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Carrier transit ({scenario.edd.distanceMiles.toFixed(0)} mi →{" "}
                {scenario.edd.bandLabel})
              </span>
              <span>
                {scenario.edd.transitDaysMin}–{scenario.edd.transitDaysMax}d → {scenario.edd.transitDays}d
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">
                Buffer (carrier pickup / cutoff variance)
              </span>
              <span>+{scenario.edd.bufferDays}d</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-border/60 pt-1.5 font-semibold">
              <span>Total</span>
              <span>
                {scenario.edd.totalDaysRaw}d → rounds up to {scenario.edd.totalDaysRounded}d
              </span>
            </div>
            <div className="flex justify-between gap-4 pt-1.5 text-sm font-semibold">
              <span>Estimated delivery</span>
              <span>{scenario.edd.eddDateFormatted}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
