import { SectionShell } from "@/components/section-shell";
import { SourcingSimulator } from "@/components/sections/demo/sourcing-simulator";
import { prisma } from "@/lib/prisma";

export async function InteractiveDemoSection() {
  const [skus, customerLocations] = await Promise.all([
    prisma.sku.findMany({ orderBy: { code: "asc" } }),
    prisma.customerLocation.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <SectionShell
      id="interactive-demo"
      index={5}
      title="Interactive Demo"
      description="This is the sourcing engine the Discovery & Prioritization section scored highest: pick a SKU, a quantity, and a delivery address, and it runs the same logic an OMS would — filter by stock, rank by a weighted score of distance, cost-to-ship, and capacity load, then calculate an EDD from the winner. Every number below is computed from the seeded data live, and every step shows its math."
    >
      <SourcingSimulator
        skus={skus.map((s) => ({
          id: s.id,
          code: s.code,
          name: s.name,
          category: s.category,
        }))}
        customerLocations={customerLocations.map((c) => ({
          id: c.id,
          label: c.label,
        }))}
      />
    </SectionShell>
  );
}
