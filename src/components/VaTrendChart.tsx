"use client";

import { OutcomeTrendChart } from "@/components/OutcomeTrendChart";
import {
  BLUE_MOUNTAINS_VA_REFERENCE_PERCENT,
  MONTHLY_VA_612_TREND,
} from "@/lib/whOutcomes";

export function VaTrendChart() {
  return (
    <OutcomeTrendChart
      title="VA 6/12+ — Woodlands specialist trend"
      seriesLabel="6/12 or better"
      data={MONTHLY_VA_612_TREND}
      reference={{
        value: BLUE_MOUNTAINS_VA_REFERENCE_PERCENT,
        label: "Sydney Blue Mountains Study",
        stroke: "#b45309",
      }}
    />
  );
}
