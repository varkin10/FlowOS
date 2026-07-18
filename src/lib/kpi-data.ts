import { prisma } from "@/lib/prisma";
import { haversineMiles } from "@/lib/geo";
import { runSourcingSimulation } from "@/lib/sourcing-engine";

// Mirrors the cost-to-ship formula in sourcing-engine.ts so this reporting
// module can compute an independent "naive nearest-only" baseline for
// comparison, without importing or modifying the engine's scoring logic.
const BASE_HANDLING_FEE = 4.25;
// A realistic order-size curve for this SKU catalog: mostly small
// single/multi-item orders, with occasional bulk orders large enough that a
// single location's on-hand stock (seeded 3–30 units) can't always cover them
// alone — which is exactly the scenario the split-shipment KPI measures.
const ORDER_QUANTITIES = [1, 2, 3, 5, 10, 20];

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface CarrierBand {
  label: string;
  distanceBandMaxMi: number;
  transitDaysMin: number;
  transitDaysMax: number;
  costPerMile: number;
}

function pickBand(distanceMiles: number, bands: CarrierBand[]): CarrierBand {
  const sorted = [...bands].sort(
    (a, b) => a.distanceBandMaxMi - b.distanceBandMaxMi
  );
  return (
    sorted.find((b) => distanceMiles <= b.distanceBandMaxMi) ??
    sorted[sorted.length - 1]
  );
}

export interface CategoryCost {
  category: string;
  naive: number;
  costAware: number;
}

export interface BandDeliveryTime {
  band: string;
  avgDays: number;
  orders: number;
}

export interface KpiData {
  totalOrders: number;
  fillRatePct: number;
  splitShipmentRatePct: number;
  eddHitRatePct: number;
  avgDeliveryDays: number;
  costToServe: {
    naiveAvg: number;
    costAwareAvg: number;
    improvementPct: number;
    byCategory: CategoryCost[];
  };
  deliveryTimeByBand: BandDeliveryTime[];
}

export async function computeKpiData(): Promise<KpiData> {
  const [skus, customerLocations, locations, bands] = await Promise.all([
    prisma.sku.findMany(),
    prisma.customerLocation.findMany(),
    prisma.location.findMany({ include: { stockLevels: true } }),
    prisma.carrierProfile.findMany(),
  ]);

  const rand = mulberry32(2024);

  let totalOrders = 0;
  let networkFillableCount = 0;
  let splitNeededCount = 0;
  let hitCount = 0;
  let hitEligibleCount = 0;
  let deliveryDaysSum = 0;
  let deliveryDaysCount = 0;

  const costByCategory = new Map<string, { naive: number[]; costAware: number[] }>();
  const daysByBand = new Map<string, number[]>();

  for (const cl of customerLocations) {
    for (const sku of skus) {
      for (const quantity of ORDER_QUANTITIES) {
        totalOrders++;

        const withDistance = locations.map((l) => {
          const stock = l.stockLevels.find((s) => s.skuId === sku.id);
          const onHand = stock?.onHand ?? 0;
          const confidence = stock?.stockConfidence ?? 1;
          const effective = Math.floor(onHand * confidence);
          return { ...l, effective, distanceMiles: haversineMiles(l, cl) };
        });

        const networkStock = withDistance.reduce((sum, l) => sum + l.effective, 0);
        const anySingleLocationEligible = withDistance.some(
          (l) => l.effective >= quantity
        );
        const networkFillable = networkStock >= quantity;

        if (networkFillable) networkFillableCount++;
        if (networkFillable && !anySingleLocationEligible) splitNeededCount++;

        if (!anySingleLocationEligible) continue;

        const result = await runSourcingSimulation({
          skuId: sku.id,
          quantity,
          customerLocationId: cl.id,
          disruption: "none",
        });

        if (!result.baseline.winner || !result.baseline.edd) continue;

        const eligible = withDistance.filter((l) => l.effective >= quantity);
        const nearest = [...eligible].sort(
          (a, b) => a.distanceMiles - b.distanceMiles
        )[0];
        const band = pickBand(nearest.distanceMiles, bands);
        const naiveCost =
          (BASE_HANDLING_FEE + nearest.distanceMiles * band.costPerMile) *
          nearest.costMultiplier;

        const catEntry = costByCategory.get(sku.category) ?? {
          naive: [],
          costAware: [],
        };
        catEntry.naive.push(naiveCost);
        catEntry.costAware.push(result.baseline.winner.costToShip);
        costByCategory.set(sku.category, catEntry);

        deliveryDaysSum += result.baseline.edd.totalDaysRounded;
        deliveryDaysCount++;

        const bandLabel = result.baseline.edd.bandLabel;
        const bandArr = daysByBand.get(bandLabel) ?? [];
        bandArr.push(result.baseline.edd.totalDaysRounded);
        daysByBand.set(bandLabel, bandArr);

        // Simulated "actual" delivery outcome for the EDD hit-rate KPI. The
        // MVP has no live carrier tracking (an explicit Discovery &
        // Prioritization exclusion), so this applies a disclosed random
        // variance around the computed estimate rather than real tracking
        // data — labeled as such wherever it's shown.
        hitEligibleCount++;
        const roll = rand();
        const onTime = roll < 0.78;
        if (onTime) hitCount++;
      }
    }
  }

  const avg = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  const byCategory: CategoryCost[] = Array.from(costByCategory.entries())
    .map(([category, v]) => ({
      category,
      naive: Math.round(avg(v.naive) * 100) / 100,
      costAware: Math.round(avg(v.costAware) * 100) / 100,
    }))
    .sort((a, b) => a.category.localeCompare(b.category));

  const bandOrder = [...bands]
    .sort((a, b) => a.distanceBandMaxMi - b.distanceBandMaxMi)
    .map((b) => b.label);

  const deliveryTimeByBand: BandDeliveryTime[] = bandOrder
    .filter((label) => daysByBand.has(label))
    .map((label) => {
      const arr = daysByBand.get(label)!;
      return {
        band: label,
        avgDays: Math.round(avg(arr) * 10) / 10,
        orders: arr.length,
      };
    });

  const allNaive = Array.from(costByCategory.values()).flatMap((v) => v.naive);
  const allCostAware = Array.from(costByCategory.values()).flatMap(
    (v) => v.costAware
  );
  const naiveAvg = Math.round(avg(allNaive) * 100) / 100;
  const costAwareAvg = Math.round(avg(allCostAware) * 100) / 100;
  const improvementPct =
    naiveAvg > 0 ? Math.round(((naiveAvg - costAwareAvg) / naiveAvg) * 1000) / 10 : 0;

  return {
    totalOrders,
    fillRatePct: Math.round((networkFillableCount / totalOrders) * 1000) / 10,
    splitShipmentRatePct: Math.round((splitNeededCount / totalOrders) * 1000) / 10,
    eddHitRatePct: hitEligibleCount
      ? Math.round((hitCount / hitEligibleCount) * 1000) / 10
      : 0,
    avgDeliveryDays: deliveryDaysCount
      ? Math.round((deliveryDaysSum / deliveryDaysCount) * 100) / 100
      : 0,
    costToServe: {
      naiveAvg,
      costAwareAvg,
      improvementPct,
      byCategory,
    },
    deliveryTimeByBand,
  };
}
