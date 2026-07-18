"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useChartColors } from "@/hooks/use-chart-colors";
import type { CategoryCost } from "@/lib/kpi-data";

interface CostToServeChartProps {
  data: CategoryCost[];
}

export function CostToServeChart({ data }: CostToServeChartProps) {
  const colors = useChartColors();

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 12, bottom: 16, left: 4 }}>
          <CartesianGrid vertical={false} stroke={colors.border} />
          <XAxis
            dataKey="category"
            tick={{ fill: colors.mutedForeground, fontSize: 10 }}
            axisLine={{ stroke: colors.border }}
            tickLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={40}
          />
          <YAxis
            tick={{ fill: colors.mutedForeground, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
            width={44}
          />
          <Tooltip
            cursor={{ fill: colors.border, opacity: 0.4 }}
            contentStyle={{
              background: colors.tooltipBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value) => `$${Number(value).toFixed(2)}`}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: colors.mutedForeground }}
            iconType="circle"
            iconSize={8}
          />
          <Bar
            dataKey="naive"
            name="Naive nearest-only"
            fill={colors.mutedForeground}
            radius={[4, 4, 0, 0]}
            barSize={16}
          />
          <Bar
            dataKey="costAware"
            name="Cost-aware sourcing"
            fill={colors.foreground}
            radius={[4, 4, 0, 0]}
            barSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
