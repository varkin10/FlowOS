import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Deterministic PRNG (mulberry32) so re-seeding produces the same demo data every time.
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
const rand = mulberry32(42);

const locations = [
  {
    name: "DC — Columbus",
    type: "DC",
    city: "Columbus",
    state: "OH",
    lat: 39.9612,
    lng: -82.9988,
    costMultiplier: 0.8,
    capacityPerDay: 900,
    currentLoad: 540,
  },
  {
    name: "DC — Newark",
    type: "DC",
    city: "Newark",
    state: "NJ",
    lat: 40.7357,
    lng: -74.1724,
    costMultiplier: 0.85,
    capacityPerDay: 800,
    currentLoad: 460,
  },
  {
    name: "DC — Reno",
    type: "DC",
    city: "Reno",
    state: "NV",
    lat: 39.5296,
    lng: -119.8138,
    costMultiplier: 0.88,
    capacityPerDay: 750,
    currentLoad: 405,
  },
  {
    name: "Store — Chicago",
    type: "STORE",
    city: "Chicago",
    state: "IL",
    lat: 41.8781,
    lng: -87.6298,
    costMultiplier: 1.15,
    capacityPerDay: 120,
    currentLoad: 78,
  },
  {
    name: "Store — Dallas",
    type: "STORE",
    city: "Dallas",
    state: "TX",
    lat: 32.7767,
    lng: -96.797,
    costMultiplier: 1.1,
    capacityPerDay: 110,
    currentLoad: 55,
  },
  {
    name: "Store — Atlanta",
    type: "STORE",
    city: "Atlanta",
    state: "GA",
    lat: 33.749,
    lng: -84.388,
    costMultiplier: 1.12,
    capacityPerDay: 100,
    currentLoad: 68,
  },
  {
    name: "Store — Seattle",
    type: "STORE",
    city: "Seattle",
    state: "WA",
    lat: 47.6062,
    lng: -122.3321,
    costMultiplier: 1.18,
    capacityPerDay: 95,
    currentLoad: 40,
  },
  {
    name: "Store — Denver",
    type: "STORE",
    city: "Denver",
    state: "CO",
    lat: 39.7392,
    lng: -104.9903,
    costMultiplier: 1.08,
    capacityPerDay: 105,
    currentLoad: 47,
  },
];

const skus = [
  { code: "SKU-1001", name: "Wireless Earbuds", category: "Electronics", unitWeightLb: 0.3 },
  { code: "SKU-1002", name: "Cotton Crew T-Shirt", category: "Apparel", unitWeightLb: 0.4 },
  { code: "SKU-1003", name: "Stainless Steel Water Bottle", category: "Home", unitWeightLb: 0.9 },
  { code: "SKU-1004", name: "Running Shoes", category: "Apparel", unitWeightLb: 1.8 },
  { code: "SKU-1005", name: "Cast Iron Skillet", category: "Home", unitWeightLb: 5.2 },
  { code: "SKU-1006", name: "Bluetooth Speaker", category: "Electronics", unitWeightLb: 1.1 },
  { code: "SKU-1007", name: "Yoga Mat", category: "Fitness", unitWeightLb: 2.4 },
  { code: "SKU-1008", name: "Ceramic Coffee Mug (Set of 2)", category: "Home", unitWeightLb: 1.6 },
  { code: "SKU-1009", name: "Backpack", category: "Accessories", unitWeightLb: 1.3 },
  { code: "SKU-1010", name: "LED Desk Lamp", category: "Home", unitWeightLb: 2.0 },
  { code: "SKU-1011", name: "Kids' Rain Jacket", category: "Apparel", unitWeightLb: 0.7 },
  { code: "SKU-1012", name: "Portable Phone Charger", category: "Electronics", unitWeightLb: 0.5 },
  { code: "SKU-1013", name: "Throw Blanket", category: "Home", unitWeightLb: 2.2 },
];

const carrierProfiles = [
  { label: "Local (0–50 mi)", distanceBandMaxMi: 50, transitDaysMin: 1, transitDaysMax: 1, costPerMile: 0.55 },
  { label: "Regional (50–300 mi)", distanceBandMaxMi: 300, transitDaysMin: 1, transitDaysMax: 2, costPerMile: 0.35 },
  { label: "Mid-range (300–800 mi)", distanceBandMaxMi: 800, transitDaysMin: 2, transitDaysMax: 3, costPerMile: 0.22 },
  { label: "Long-haul (800–1,600 mi)", distanceBandMaxMi: 1600, transitDaysMin: 3, transitDaysMax: 4, costPerMile: 0.15 },
  { label: "Cross-country (1,600–3,000 mi)", distanceBandMaxMi: 3000, transitDaysMin: 4, transitDaysMax: 6, costPerMile: 0.1 },
];

const customerLocations = [
  {
    label: "Naperville, IL",
    city: "Naperville",
    state: "IL",
    lat: 41.7508,
    lng: -88.1535,
    sortOrder: 0,
  },
  { label: "Indianapolis, IN", city: "Indianapolis", state: "IN", lat: 39.7684, lng: -86.1581, sortOrder: 1 },
  { label: "Charlotte, NC", city: "Charlotte", state: "NC", lat: 35.2271, lng: -80.8431, sortOrder: 2 },
  { label: "Minneapolis, MN", city: "Minneapolis", state: "MN", lat: 44.9778, lng: -93.265, sortOrder: 3 },
  { label: "Phoenix, AZ", city: "Phoenix", state: "AZ", lat: 33.4484, lng: -112.074, sortOrder: 4 },
];

async function main() {
  await prisma.stockLevel.deleteMany();
  await prisma.location.deleteMany();
  await prisma.sku.deleteMany();
  await prisma.carrierProfile.deleteMany();
  await prisma.customerLocation.deleteMany();

  const createdLocations = await Promise.all(
    locations.map((l) => prisma.location.create({ data: l }))
  );
  const createdSkus = await Promise.all(
    skus.map((s) => prisma.sku.create({ data: s }))
  );
  await Promise.all(
    carrierProfiles.map((c) => prisma.carrierProfile.create({ data: c }))
  );
  await Promise.all(
    customerLocations.map((c) => prisma.customerLocation.create({ data: c }))
  );

  const stockRows: {
    locationId: string;
    skuId: string;
    onHand: number;
    stockConfidence: number;
  }[] = [];

  for (const location of createdLocations) {
    for (const sku of createdSkus) {
      const stockRoll = rand();
      // ~18% chance a given location is out of stock on a given SKU.
      const onHand = stockRoll < 0.18 ? 0 : Math.floor(rand() * 28) + 3;
      // DCs are cycle-counted more often and trend more accurate than manual store counts.
      const confidenceBase = location.type === "DC" ? 0.93 : 0.82;
      const stockConfidence = Math.min(
        0.99,
        Math.round((confidenceBase + rand() * 0.12) * 100) / 100
      );
      stockRows.push({
        locationId: location.id,
        skuId: sku.id,
        onHand,
        stockConfidence,
      });
    }
  }

  // Hand-tune the default demo scenario (first SKU, first customer location) so
  // both disruption toggles visibly change the outcome rather than being a no-op.
  const earbuds = createdSkus.find((s) => s.code === "SKU-1001")!;
  const denver = createdLocations.find((l) => l.name === "Store — Denver")!;
  const columbus = createdLocations.find((l) => l.name === "DC — Columbus")!;
  const chicago = createdLocations.find((l) => l.name === "Store — Chicago")!;

  for (const row of stockRows) {
    if (row.skuId !== earbuds.id) continue;
    if (row.locationId === denver.id) {
      row.onHand = 24;
      row.stockConfidence = 0.86;
    }
    if (row.locationId === columbus.id) {
      row.onHand = 40;
      row.stockConfidence = 0.97;
    }
    if (row.locationId === chicago.id) {
      row.onHand = 18;
      row.stockConfidence = 0.88;
    }
  }

  await prisma.stockLevel.createMany({ data: stockRows });

  console.log(
    `Seeded ${createdLocations.length} locations, ${createdSkus.length} SKUs, ` +
      `${carrierProfiles.length} carrier bands, ${customerLocations.length} customer locations, ` +
      `${stockRows.length} stock rows.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
