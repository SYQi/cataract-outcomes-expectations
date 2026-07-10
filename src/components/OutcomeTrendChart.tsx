"use client";

import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyRatePoint } from "@/lib/whOutcomes";
import { REPORTING_WINDOW_LABEL } from "@/lib/whOutcomes";
import { SPECIALIST_CARE_FOOTNOTE } from "@/lib/messaging";

type ReferenceMark = {
  value: number;
  label: string;
  stroke?: string;
};

type OutcomeTrendChartProps = {
  title: string;
  seriesLabel: string;
  data: MonthlyRatePoint[];
  stroke?: string;
  dotFill?: string;
  reference?: ReferenceMark;
};

export function OutcomeTrendChart({
  title,
  seriesLabel,
  data,
  stroke = "#00205B",
  dotFill = "#0d9488",
  reference,
}: OutcomeTrendChartProps) {
  const chartData = data.map((p) => ({
    label: p.label.replace(" 20", " '"),
    rate: p.rate,
    cases: p.cases,
  }));

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl border border-slate-200 bg-white p-2 sm:p-3">
      <div className="mb-1 shrink-0">
        <p className="text-xs font-bold text-brand-navy sm:text-sm">{title}</p>
        <p className="text-[10px] text-slate-500 sm:text-[11px]">
          {SPECIALIST_CARE_FOOTNOTE} · {REPORTING_WINDOW_LABEL}
        </p>
      </div>
      <div className="min-h-0 flex-1" style={{ minHeight: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 12, left: -4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1" }}
              interval="preserveStartEnd"
              minTickGap={8}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: 10, fill: "#64748b" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
              width={40}
              allowDataOverflow
            />
            {reference && (
              <ReferenceLine
                y={reference.value}
                stroke={reference.stroke ?? "#94a3b8"}
                strokeDasharray="5 4"
                strokeWidth={1.5}
              >
                <Label
                  value={reference.label}
                  position="insideTopRight"
                  fill={reference.stroke ?? "#64748b"}
                  fontSize={10}
                  offset={6}
                />
              </ReferenceLine>
            )}
            <Tooltip
              formatter={(value: number) => [`${value}%`, seriesLabel]}
              labelFormatter={(label) => String(label)}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke={stroke}
              strokeWidth={2.5}
              dot={{ r: 3, fill: dotFill, stroke: "#fff", strokeWidth: 1.5 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
