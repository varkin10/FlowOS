"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useChartColors } from "@/hooks/use-chart-colors";
import type { BandDeliveryTime } from "@/lib/kpi-data";

interface DeliveryTimeChartProps {
  data: BandDeliveryTime[];
}

export function DeliveryTimeChart({ data }: DeliveryTimeChartProps) {
  const colors = useChartColors();
  const chartData = data.map((d) => ({
    ...d,
    shortBand: d.band.replace(/\s*\(.*\)/, ""),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 16, left: 4 }}>
          <CartesianGrid vertical={false} stroke={colors.border} />
          <XAxis
            dataKey="shortBand"
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
            tickFormatter={(v) => `${v}d`}
            width={32}
          />
          <Tooltip
            cursor={{ fill: colors.border, opacity: 0.4 }}
            contentStyle={{
              background: colors.tooltipBg,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value, _name, props) => [
              `${value} days avg (${props.payload.orders} orders)`,
              props.payload.band,
            ]}
          />
          <Bar
            dataKey="avgDays"
            fill={colors.foreground}
            radius={[4, 4, 0, 0]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
