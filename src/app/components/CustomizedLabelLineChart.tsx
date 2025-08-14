"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export type SeriesPoint = { date: string; rank: number };

type CustomizedLabelLineChartProps = {
  data: SeriesPoint[];
  height?: number;
  yDomain?: [number, number];
};

export function CustomizedLabelLineChart({
  data,
  height = 250,
  yDomain = [1, 100],
}: CustomizedLabelLineChartProps) {
  // Y축은 순위라서 1이 상단에 오도록 설정
  const yTicks = useMemo(() => {
    // 임의로 1 ~ 100위를 설정
    const ticks = [1, 5, 10, 20, 30, 50, 70, 100].filter(
      (t) => t >= yDomain[0] && t <= yDomain[1]
    );
    return ticks;
  }, [yDomain]);

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={20} />
          <YAxis
            type="number"
            domain={yDomain}
            tick={{ fontSize: 12 }}
            tickCount={yTicks.length}
            ticks={yTicks}
            reversed
          />
          <Tooltip
            formatter={(value: number | string) => [`${value}`, "순위"]}
            labelFormatter={(label: string) => {
              try {
                return format(new Date(label), "MM/dd (EEE)");
              } catch {
                return label;
              }
            }}
          />
          <Line
            type="monotone"
            dataKey="rank"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
