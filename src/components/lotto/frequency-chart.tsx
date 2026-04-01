"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from "chart.js";
import { Bar } from "react-chartjs-2";

import type { FrequencyStat } from "@/types/lotto";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface FrequencyChartProps {
  title: string;
  stats: FrequencyStat[];
  color: string;
}

export function FrequencyChart({ title, stats, color }: FrequencyChartProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5">
      <p className="text-sm font-medium text-white">{title}</p>
      <div className="mt-4 h-64">
        <Bar
          data={{
            labels: stats.map((item) => `${item.number}`),
            datasets: [
              {
                label: "출현 횟수",
                data: stats.map((item) => item.frequency),
                backgroundColor: color,
                borderRadius: 10,
                maxBarThickness: 28
              }
            ]
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: (context) => `출현 ${context.parsed.y}회`
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                ticks: {
                  color: "#94a3b8"
                }
              },
              y: {
                beginAtZero: true,
                border: {
                  display: false
                },
                grid: {
                  color: "rgba(148, 163, 184, 0.12)"
                },
                ticks: {
                  color: "#94a3b8",
                  precision: 0
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}
