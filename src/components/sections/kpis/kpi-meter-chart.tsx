"use client";

import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useChartColors } from "@/hooks/use-chart-colors";

interface KpiMeterChartProps {
  label: string;
  valuePct: number;
  targetPct: number;
  direction: "higher-is-better" | "lower-is-better";
}

export function KpiMeterChart({
  label,
  valuePct,
  targetPct,
  direction,
}: KpiMeterChartProps) {
  const colors = useChartColors();
  const data = [{ name: label, value: valuePct }];
  const meetsTarget =
    direction === "higher-is-better" ? valuePct >= targetPct : valuePct <= targetPct;

  return (
    <div className="rounded-lg border border-border/60 p-5">
      <p className="text-4xl font-semibold tracking-tight">{valuePct}%</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Target: {direction === "higher-is-better" ? "≥" : "≤"}{" "}
        {targetPct}%
      </p>
      <div className="mt-5 h-8 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 8, bottom: 0, left: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              cursor={{ fill: colors.border }}
              contentStyle={{
                background: colors.tooltipBg,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) => [`${value}%`, label]}
            />
            <ReferenceLine
              x={targetPct}
              stroke={colors.mutedForeground}
              strokeDasharray="4 4"
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={16}>
              <Cell fill={meetsTarget ? colors.foreground : colors.mutedForeground} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
