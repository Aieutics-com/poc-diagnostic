"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { DimensionResult } from "@/lib/diagnostic-data";

interface RadarChartProps {
  results: DimensionResult[];
}

export default function RadarChart({ results }: RadarChartProps) {
  const data = results.map((r) => ({
    dimension: r.dimension.name.replace(" ", "\n"),
    score: r.percentage,
    fullMark: 100,
  }));

  return (
    <div className="w-full h-[350px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e0dbd5" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{
              fontSize: 11,
              fill: "#4a4a4a",
              fontFamily: "'Lato', Arial, sans-serif",
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#4a4a4a" }}
            tickCount={4}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#E8713A"
            fill="#E8713A"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
