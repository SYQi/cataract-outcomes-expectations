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
  BLUE_MOUNTAINS_CITATION,
  BLUE_MOUNTAINS_VA_REFERENCE_PERCENT,
  QUARTERLY_VA_612_TREND,
} from "@/lib/whOutcomes";

const AXIS_TICK = { fontSize: 13, fill: "#0f172a", fontWeight: 700 as const };
const WH_COLOR = "#00205B";
const SYDNEY_COLOR = "#b45309";

export function VaQuarterlyChart() {
  const chartData = QUARTERLY_VA_612_TREND.map((p) => ({
    label: p.label,
    rate: p.rate,
    cases: p.cases,
  }));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/80 p-2 shadow-sm sm:p-3">
      <p className="mb-1 shrink-0 text-xs font-bold leading-snug text-brand-navy sm:text-sm">
        Good vision (6/12+) — quarterly specialist outcomes
      </p>

      <div className="min-h-[200px] w-full flex-1 landscape:min-h-[170px] sm:min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
            <defs>
              <linearGradient id="vaQuarterFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeWidth={1} />
            <XAxis
              dataKey="label"
              tick={AXIS_TICK}
              tickLine={{ stroke: "#334155" }}
              axisLine={{ stroke: "#334155", strokeWidth: 1.5 }}
              dy={4}
            />
            <YAxis
              domain={[60, 100]}
              ticks={[60, 75, 90, 100]}
              tick={AXIS_TICK}
              tickLine={{ stroke: "#334155" }}
              axisLine={{ stroke: "#334155", strokeWidth: 1.5 }}
              tickFormatter={(v) => `${v}%`}
              width={42}
            />
            <ReferenceLine
              y={BLUE_MOUNTAINS_VA_REFERENCE_PERCENT}
              stroke={SYDNEY_COLOR}
              strokeDasharray="6 4"
              strokeWidth={2.5}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "Woodlands Health"]}
              labelFormatter={(label) => String(label)}
              contentStyle={{ fontSize: 13, borderRadius: 10, border: "1px solid #cbd5e1" }}
            />
            <Area
              type="monotone"
              name="Woodlands Health"
              dataKey="rate"
              stroke={WH_COLOR}
              strokeWidth={3}
              fill="url(#vaQuarterFill)"
              isAnimationActive={false}
              dot={{
                r: 6,
                fill: "#0d9488",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{ r: 8, fill: WH_COLOR, stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-1.5 flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[14px] font-bold sm:text-[16px]">
        <span className="inline-flex items-center gap-1.5 text-brand-navy">
          <span className="inline-block h-1 w-6 rounded bg-brand-navy" />
          Woodlands Health
        </span>
        <span className="inline-flex items-center gap-1.5 text-amber-800">
          <span
            className="inline-block h-0 w-6 border-t-[3px] border-dashed"
            style={{ borderColor: SYDNEY_COLOR }}
          />
          Sydney Blue Mountains ({BLUE_MOUNTAINS_VA_REFERENCE_PERCENT}%)
        </span>
      </div>

      <p className="mt-2 shrink-0 border-t border-slate-100 pt-2 text-left text-[9px] leading-snug text-slate-500 sm:text-[10px]">
        <span className="font-semibold text-slate-600">Reference (Sydney Blue Mountains): </span>
        {BLUE_MOUNTAINS_CITATION}
      </p>
    </div>
  );
}
