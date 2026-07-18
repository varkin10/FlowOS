import { SiteHeader } from "@/components/site-header";
import { ProblemSection } from "@/components/sections/problem-section";
import { IndustrySignalsSection } from "@/components/sections/industry-signals-section";
import { StrategyRoadmapSection } from "@/components/sections/strategy-roadmap-section";
import { DiscoveryPrioritizationSection } from "@/components/sections/discovery-prioritization-section";
import { InteractiveDemoSection } from "@/components/sections/interactive-demo-section";
import { KpisImpactSection } from "@/components/sections/kpis-impact-section";
import { DecisionJournalSection } from "@/components/sections/decision-journal-section";
import { TradeoffsLessonsSection } from "@/components/sections/tradeoffs-lessons-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <section className="border-b border-border/60 py-28 sm:py-36">
          <div className="mx-auto max-w-6xl px-6">
            <p className="font-mono text-sm text-muted-foreground/70">
              FlowOS
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Smarter Sourcing. Reliable Delivery Promises.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              A product case study on how omni-channel retailers decide where
              an order ships from — and how confidently they can promise when
              it&apos;ll arrive.
            </p>
          </div>
        </section>

        <ProblemSection />
        <IndustrySignalsSection />
        <StrategyRoadmapSection />
        <DiscoveryPrioritizationSection />
        <InteractiveDemoSection />
        <KpisImpactSection />
        <DecisionJournalSection />
        <TradeoffsLessonsSection />
      </main>
      <footer className="py-10">
        <div className="mx-auto max-w-6xl px-6 text-sm text-muted-foreground">
          FlowOS is an independent case study built for portfolio purposes.
        </div>
      </footer>
    </>
  );
}
