"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BLUE_MOUNTAINS_VA_REFERENCE_PERCENT,
  QUARTERLY_VA_612_TREND,
} from "@/lib/whOutcomes";

export function VaQuarterlyChart() {
  const chartData = QUARTERLY_VA_612_TREND.map((p) => ({
    label: p.label,
    rate: p.rate,
    cases: p.cases,
  }));

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-2 shadow-sm sm:p-3">
      <p className="mb-1 shrink-0 text-[10px] font-bold leading-snug text-brand-navy sm:text-xs">
        Good vision (6/12+) — quarterly specialist outcomes
      </p>

      <div className="min-h-0 flex-1" style={{ minHeight: 88 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="vaQuarterFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 6" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#475569", fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1" }}
            />
            <YAxis
              domain={[60, 100]}
              ticks={[60, 75, 90, 100]}
              tick={{ fontSize: 9, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              width={30}
            />
            <ReferenceLine
              y={BLUE_MOUNTAINS_VA_REFERENCE_PERCENT}
              stroke="#b45309"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "6/12 or better"]}
              labelFormatter={(label) => String(label)}
              contentStyle={{ fontSize: 12, borderRadius: 10, border: "1px solid #e2e8f0" }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#00205B"
              strokeWidth={2.5}
              fill="url(#vaQuarterFill)"
              dot={{
                r: 5,
                fill: "#0d9488",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{ r: 7, fill: "#00205B", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-1 shrink-0 text-center text-[8px] font-medium text-slate-500 sm:text-[9px]">
        <span
          className="mr-1 inline-block h-0 w-3 border-t-2 border-dashed align-middle"
          style={{ borderColor: "#b45309" }}
        />
        Reference: Sydney Blue Mountains Study ({BLUE_MOUNTAINS_VA_REFERENCE_PERCENT}%)
      </p>
    </div>
  );
}
