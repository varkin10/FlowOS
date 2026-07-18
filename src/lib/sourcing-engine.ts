"use server";

import { prisma } from "@/lib/prisma";
import { haversineMiles } from "@/lib/geo";

export type DisruptionType =
  | "none"
  | "nearest-out-of-stock"
  | "primary-dc-at-capacity";

export interface SimulationInput {
  skuId: string;
  quantity: number;
  customerLocationId: string;
  disruption: DisruptionType;
}

const WEIGHTS = { distance: 0.4, cost: 0.35, capacity: 0.25 };
const BASE_HANDLING_FEE = 4.25;
const BUFFER_DAYS = 0.5;
const DC_BASE_PROCESSING_HOURS = 4;
const STORE_BASE_PROCESSING_HOURS = 10;

interface CarrierBand {
  label: string;
  distanceBandMaxMi: number;
  transitDaysMin: number;
  transitDaysMax: number;
  costPerMile: number;
}

interface LocationRow {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  costMultiplier: number;
  capacityPerDay: number;
  currentLoad: number;
  stockLevels: { onHand: number; stockConfidence: number }[];
}

export interface StockCheckRow {
  locationId: string;
  name: string;
  type: string;
  distanceMiles: number;
  onHand: number;
  stockConfidence: number;
  effectiveStock: number;
  required: number;
  eligible: boolean;
  reason: string | null;
  disrupted: boolean;
}

export interface RankedCandidate {
  rank: number;
  locationId: string;
  name: string;
  type: string;
  distanceMiles: number;
  costToShip: number;
  capacityLoadPct: number;
  distanceScore: number;
  costScore: number;
  capacityScore: number;
  weightedTotal: number;
}

export interface EddBreakdown {
  locationName: string;
  baseProcessingHours: number;
  utilizationPct: number;
  loadPenaltyPct: number;
  effectiveProcessingHours: number;
  processingDays: number;
  distanceMiles: number;
  bandLabel: string;
  transitDaysMin: number;
  transitDaysMax: number;
  transitDays: number;
  bufferDays: number;
  totalDaysRaw: number;
  totalDaysRounded: number;
  eddDate: string;
  eddDateFormatted: string;
}

export interface ScenarioResult {
  disruption: DisruptionType;
  disruptionNote: string | null;
  stockCheck: StockCheckRow[];
  ranking: RankedCandidate[];
  winner: RankedCandidate | null;
  explanation: string;
  edd: EddBreakdown | null;
}

export interface SimulationResult {
  skuName: string;
  skuCode: string;
  quantity: number;
  customerLabel: string;
  weights: typeof WEIGHTS;
  baseline: ScenarioResult;
  scenario: ScenarioResult | null;
  diff: string | null;
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

function normalizeInverse(value: number, min: number, max: number): number {
  if (max === min) return 100;
  return Math.round((100 * (max - value)) / (max - min));
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

function buildExplanation(ranking: RankedCandidate[]): string {
  if (ranking.length === 0) {
    return "No location currently has enough confirmed stock to fill this order — see the stock check above for why each location was excluded.";
  }
  if (ranking.length === 1) {
    const w = ranking[0];
    return `${w.name} is the only location with enough confirmed stock for this order, so it wins by default — ${w.distanceMiles.toFixed(
      0
    )} mi from the delivery address, at an estimated $${w.costToShip.toFixed(
      2
    )} to ship, with ${w.capacityLoadPct.toFixed(0)}% of daily capacity in use.`;
  }

  const [winner, runnerUp] = ranking;
  const winsDistance = winner.distanceMiles <= runnerUp.distanceMiles;
  const winsCost = winner.costToShip <= runnerUp.costToShip;
  const winsCapacity = winner.capacityLoadPct <= runnerUp.capacityLoadPct;

  if (winsDistance && winsCost && winsCapacity) {
    return `${winner.name} wins outright with a weighted score of ${winner.weightedTotal}/100 — it beats ${runnerUp.name} on every factor: distance (${winner.distanceMiles.toFixed(
      0
    )} vs ${runnerUp.distanceMiles.toFixed(0)} mi), cost-to-ship ($${winner.costToShip.toFixed(
      2
    )} vs $${runnerUp.costToShip.toFixed(
      2
    )}), and capacity load (${winner.capacityLoadPct.toFixed(
      0
    )}% vs ${runnerUp.capacityLoadPct.toFixed(0)}%).`;
  }

  const tradeOffs: string[] = [];
  if (!winsDistance) {
    tradeOffs.push(
      `it's farther than ${runnerUp.name} (${winner.distanceMiles.toFixed(
        0
      )} mi vs ${runnerUp.distanceMiles.toFixed(0)} mi)`
    );
  }
  if (!winsCost) {
    tradeOffs.push(
      `it costs more to ship ($${winner.costToShip.toFixed(
        2
      )} vs $${runnerUp.costToShip.toFixed(2)})`
    );
  }
  if (!winsCapacity) {
    tradeOffs.push(
      `it's running a higher capacity load (${winner.capacityLoadPct.toFixed(
        0
      )}% vs ${runnerUp.capacityLoadPct.toFixed(0)}%)`
    );
  }

  return `${winner.name} wins with a weighted score of ${winner.weightedTotal}/100 vs ${runnerUp.weightedTotal}/100 for ${runnerUp.name} — even though ${tradeOffs.join(
    " and "
  )}, its advantage on the remaining factor(s) is large enough to tip the weighted score (distance ${Math.round(
    WEIGHTS.distance * 100
  )}% · cost ${Math.round(WEIGHTS.cost * 100)}% · capacity ${Math.round(
    WEIGHTS.capacity * 100
  )}%).`;
}

function computeScenario(
  locations: LocationRow[],
  bands: CarrierBand[],
  customer: { lat: number; lng: number },
  quantity: number,
  disruption: DisruptionType
): ScenarioResult {
  const withDistance = locations.map((l) => ({
    ...l,
    distanceMiles: haversineMiles(l, customer),
  }));

  const nearest = [...withDistance].sort(
    (a, b) => a.distanceMiles - b.distanceMiles
  )[0];
  const primaryDc = [...withDistance]
    .filter((l) => l.type === "DC")
    .sort((a, b) => b.capacityPerDay - a.capacityPerDay)[0];

  let disruptionNote: string | null = null;

  // Working set with any disruption override applied — the single source of
  // truth both the public stock-check table and the scoring step read from.
  const working = withDistance.map((l) => {
    const stock = l.stockLevels[0] ?? { onHand: 0, stockConfidence: 1 };
    let onHand = stock.onHand;
    let currentLoad = l.currentLoad;
    let disrupted = false;

    if (disruption === "nearest-out-of-stock" && l.id === nearest.id) {
      onHand = 0;
      disrupted = true;
      disruptionNote = `${nearest.name} — the nearest location at ${nearest.distanceMiles.toFixed(
        0
      )} mi — was forced to 0 stock for this SKU.`;
    }
    if (
      disruption === "primary-dc-at-capacity" &&
      primaryDc &&
      l.id === primaryDc.id
    ) {
      currentLoad = l.capacityPerDay;
      disrupted = true;
      disruptionNote = `${primaryDc.name} — the largest DC by capacity — was forced to 100% utilization (${primaryDc.capacityPerDay}/${primaryDc.capacityPerDay} orders).`;
    }

    const effectiveStock = Math.floor(onHand * stock.stockConfidence);
    const eligible = effectiveStock >= quantity;
    const reason = eligible
      ? null
      : onHand === 0
        ? "No units on hand for this SKU."
        : `Only ~${effectiveStock} confidently in stock (of ${onHand} on hand at ${Math.round(
            stock.stockConfidence * 100
          )}% confidence) — need ${quantity}.`;

    return {
      ...l,
      onHand,
      stockConfidence: stock.stockConfidence,
      effectiveStock,
      currentLoad,
      eligible,
      disrupted,
      reason,
    };
  });

  const stockCheck: StockCheckRow[] = working.map((w) => ({
    locationId: w.id,
    name: w.name,
    type: w.type,
    distanceMiles: w.distanceMiles,
    onHand: w.onHand,
    stockConfidence: w.stockConfidence,
    effectiveStock: w.effectiveStock,
    required: quantity,
    eligible: w.eligible,
    reason: w.reason,
    disrupted: w.disrupted,
  }));

  const eligibleWorking = working.filter((w) => w.eligible);

  const scored = eligibleWorking.map((w) => {
    const band = pickBand(w.distanceMiles, bands);
    const costToShip =
      (BASE_HANDLING_FEE + w.distanceMiles * band.costPerMile) *
      w.costMultiplier;
    const capacityLoadPct = (w.currentLoad / w.capacityPerDay) * 100;

    return {
      locationId: w.id,
      name: w.name,
      type: w.type,
      distanceMiles: w.distanceMiles,
      costToShip,
      capacityLoadPct,
      band,
      capacityPerDay: w.capacityPerDay,
      currentLoad: w.currentLoad,
    };
  });

  const distances = scored.map((s) => s.distanceMiles);
  const costs = scored.map((s) => s.costToShip);
  const loads = scored.map((s) => s.capacityLoadPct);
  const minD = Math.min(...distances);
  const maxD = Math.max(...distances);
  const minC = Math.min(...costs);
  const maxC = Math.max(...costs);
  const minL = Math.min(...loads);
  const maxL = Math.max(...loads);

  const ranked: RankedCandidate[] = scored
    .map((s) => {
      const distanceScore = normalizeInverse(s.distanceMiles, minD, maxD);
      const costScore = normalizeInverse(s.costToShip, minC, maxC);
      const capacityScore = normalizeInverse(s.capacityLoadPct, minL, maxL);
      const weightedTotal = Math.round(
        distanceScore * WEIGHTS.distance +
          costScore * WEIGHTS.cost +
          capacityScore * WEIGHTS.capacity
      );
      return {
        rank: 0,
        locationId: s.locationId,
        name: s.name,
        type: s.type,
        distanceMiles: s.distanceMiles,
        costToShip: s.costToShip,
        capacityLoadPct: s.capacityLoadPct,
        distanceScore,
        costScore,
        capacityScore,
        weightedTotal,
      };
    })
    .sort((a, b) => b.weightedTotal - a.weightedTotal)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  const winner = ranked[0] ?? null;
  const explanation = buildExplanation(ranked);

  let edd: EddBreakdown | null = null;
  if (winner) {
    const winnerFull = scored.find((s) => s.locationId === winner.locationId)!;
    const baseProcessingHours =
      winner.type === "DC"
        ? DC_BASE_PROCESSING_HOURS
        : STORE_BASE_PROCESSING_HOURS;
    const utilization = Math.min(
      1,
      winnerFull.currentLoad / winnerFull.capacityPerDay
    );
    const loadPenalty = utilization > 0.5 ? utilization - 0.5 : 0;
    const effectiveProcessingHours = baseProcessingHours * (1 + loadPenalty);
    const processingDays = effectiveProcessingHours / 24;
    const transitDays =
      (winnerFull.band.transitDaysMin + winnerFull.band.transitDaysMax) / 2;
    const totalDaysRaw = processingDays + transitDays + BUFFER_DAYS;
    const totalDaysRounded = Math.ceil(totalDaysRaw);
    const eddDate = new Date();
    eddDate.setDate(eddDate.getDate() + totalDaysRounded);

    edd = {
      locationName: winner.name,
      baseProcessingHours,
      utilizationPct: Math.round(utilization * 100),
      loadPenaltyPct: Math.round(loadPenalty * 100),
      effectiveProcessingHours: Math.round(effectiveProcessingHours * 10) / 10,
      processingDays: Math.round(processingDays * 100) / 100,
      distanceMiles: winnerFull.distanceMiles,
      bandLabel: winnerFull.band.label,
      transitDaysMin: winnerFull.band.transitDaysMin,
      transitDaysMax: winnerFull.band.transitDaysMax,
      transitDays,
      bufferDays: BUFFER_DAYS,
      totalDaysRaw: Math.round(totalDaysRaw * 100) / 100,
      totalDaysRounded,
      eddDate: eddDate.toISOString(),
      eddDateFormatted: formatDate(eddDate),
    };
  }

  return {
    disruption,
    disruptionNote,
    stockCheck,
    ranking: ranked.slice(0, 3),
    winner,
    explanation,
    edd,
  };
}

export async function runSourcingSimulation(
  input: SimulationInput
): Promise<SimulationResult> {
  const quantity = Math.max(1, Math.min(50, Math.floor(input.quantity)));

  const [sku, customer, locations, bands] = await Promise.all([
    prisma.sku.findUniqueOrThrow({ where: { id: input.skuId } }),
    prisma.customerLocation.findUniqueOrThrow({
      where: { id: input.customerLocationId },
    }),
    prisma.location.findMany({
      include: {
        stockLevels: { where: { skuId: input.skuId } },
      },
    }),
    prisma.carrierProfile.findMany(),
  ]);

  const baseline = computeScenario(locations, bands, customer, quantity, "none");
  const scenario =
    input.disruption !== "none"
      ? computeScenario(locations, bands, customer, quantity, input.disruption)
      : null;

  let diff: string | null = null;
  if (scenario) {
    const baselineWinner = baseline.winner?.name ?? "no location";
    const scenarioWinner = scenario.winner?.name ?? "no location";
    const baselineDays = baseline.edd?.totalDaysRounded;
    const scenarioDays = scenario.edd?.totalDaysRounded;

    if (baselineWinner !== scenarioWinner) {
      diff = `The winning location changes from ${baselineWinner} to ${scenarioWinner}. EDD moves from ${
        baseline.edd?.eddDateFormatted ?? "n/a"
      } (${baselineDays ?? "n/a"}d) to ${
        scenario.edd?.eddDateFormatted ?? "n/a"
      } (${scenarioDays ?? "n/a"}d).`;
    } else if (baselineDays !== scenarioDays) {
      diff = `${scenarioWinner} still wins, but the EDD shifts from ${
        baseline.edd?.eddDateFormatted ?? "n/a"
      } (${baselineDays ?? "n/a"}d) to ${
        scenario.edd?.eddDateFormatted ?? "n/a"
      } (${scenarioDays ?? "n/a"}d) because of the disruption.`;
    } else {
      diff = `${scenarioWinner} still wins and the EDD is unchanged — the disruption affected other candidates but not enough to change this outcome.`;
    }
  }

  return {
    skuName: sku.name,
    skuCode: sku.code,
    quantity,
    customerLabel: customer.label,
    weights: WEIGHTS,
    baseline,
    scenario,
    diff,
  };
}
