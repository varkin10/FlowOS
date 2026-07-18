export interface SectionDef {
  id: string;
  navLabel: string;
  title: string;
  index: number;
}

export const sections: SectionDef[] = [
  { id: "problem", navLabel: "Problem", title: "Problem", index: 1 },
  {
    id: "industry-signals",
    navLabel: "Signals",
    title: "Industry Signals",
    index: 2,
  },
  {
    id: "strategy-roadmap",
    navLabel: "Strategy",
    title: "Strategy & Roadmap",
    index: 3,
  },
  {
    id: "discovery-prioritization",
    navLabel: "Discovery",
    title: "Discovery & Prioritization",
    index: 4,
  },
  {
    id: "interactive-demo",
    navLabel: "Demo",
    title: "Interactive Demo",
    index: 5,
  },
  { id: "kpis-impact", navLabel: "KPIs", title: "KPIs & Impact", index: 6 },
  {
    id: "decision-journal",
    navLabel: "Journal",
    title: "Decision Journal",
    index: 7,
  },
  {
    id: "tradeoffs-lessons",
    navLabel: "Trade-offs",
    title: "Trade-offs & Lessons Learned",
    index: 8,
  },
];
