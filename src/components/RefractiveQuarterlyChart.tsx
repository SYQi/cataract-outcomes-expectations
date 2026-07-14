"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  NHS_REFRACTIVE_REFERENCE_PERCENT,
  QUARTERLY_REFRACTIVE_1D_TREND,
} from "@/lib/whOutcomes";

const AXIS_TICK = { fontSize: 13, fill: "#0f172a", fontWeight: 700 as const };
const WH_COLOR = "#0d9488";
const NHS_COLOR = "#b45309";

function WoodlandsEndpointLabel(props: {
  x?: number | string;
  y?: number | string;
  index?: number;
}) {
  const { x, y, index } = props;
  if (index !== QUARTERLY_REFRACTIVE_1D_TREND.length - 1 || x == null || y == null) return null;
  return (
    <text
      x={Number(x)}
      y={Number(y) - 12}
      fill={WH_COLOR}
      fontSize={14}
      fontWeight={800}
      textAnchor="middle"
    >
      Woodlands
    </text>
  );
}

export function RefractiveQuarterlyChart() {
  const chartData = QUARTERLY_REFRACTIVE_1D_TREND.map((p) => ({
    label: p.label,
    rate: p.rate,
    cases: p.cases,
  }));

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-teal-50/40 p-2 shadow-sm sm:p-3">
      <p className="mb-1 shrink-0 text-xs font-bold leading-snug text-brand-navy sm:text-sm">
        Refractive accuracy (±1.0D) — quarterly specialist outcomes
      </p>

      <div className="h-[195px] w-full shrink-0 landscape:h-[182px] sm:h-[221px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 22, right: 14, left: 4, bottom: 4 }}>
            <defs>
              <linearGradient id="refractiveQuarterFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00205B" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0.05} />
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
              domain={[75, 100]}
              ticks={[75, 85, 95, 100]}
              tick={AXIS_TICK}
              tickLine={{ stroke: "#334155" }}
              axisLine={{ stroke: "#334155", strokeWidth: 1.5 }}
              tickFormatter={(v) => `${v}%`}
              width={42}
            />
            <ReferenceLine
              y={NHS_REFRACTIVE_REFERENCE_PERCENT}
              stroke={NHS_COLOR}
              strokeDasharray="6 4"
              strokeWidth={2.5}
              label={{
                value: "NHS",
                position: "insideTopRight",
                fill: NHS_COLOR,
                fontSize: 14,
                fontWeight: 800,
              }}
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
              fill="url(#refractiveQuarterFill)"
              isAnimationActive={false}
              dot={{
                r: 6,
                fill: "#00205B",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              activeDot={{ r: 8, fill: WH_COLOR, stroke: "#fff", strokeWidth: 2 }}
            >
              <LabelList dataKey="rate" content={WoodlandsEndpointLabel} />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 pb-1 text-[11px] font-bold sm:text-xs">
        <span className="inline-flex items-center gap-1.5 text-teal-800">
          <span className="inline-block h-0.5 w-5 rounded bg-teal-700" />
          Woodlands Health
        </span>
        <span className="inline-flex items-center gap-1.5 text-amber-800">
          <span
            className="inline-block h-0 w-5 border-t-2 border-dashed"
            style={{ borderColor: NHS_COLOR }}
          />
          NHS reference ({NHS_REFRACTIVE_REFERENCE_PERCENT}%)
        </span>
      </div>
    </div>
  );
}
