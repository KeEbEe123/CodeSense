"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";
import { Card, cn } from "@heroui/react";

type ChartData = {
  name: string;
  value: number;
};

type ComponentProps = {
  platforms: {
    [key: string]: {
      username: string | null;
      score: number;
      total: number;
    };
  };
};

const formatTotal = (total: number) => {
  return total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total;
};

const colors = ["#FFA500", "#FF6347", "#4682B4", "#4d4d4d", "#FFD700"];

export default function Component({ platforms }: ComponentProps) {
  const chartData: ChartData[] = Object.keys(platforms).map((key) => ({
    name: key,
    value: platforms[key].score,
  }));

  const totalScore = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="pb-2 mx-3 bg-gradient-to-bl from-gray-800 to-background w-full md:w-1/2 p-5 pt-2 pl-2">
      <div className="flex flex-col gap-y-2 p-4 pb-0">
        <h3 className="font-medium font-pop text-2xl text-offwhite">
          Platform Scores
        </h3>
      </div>
      <div className="flex flex-col md:flex-row h-full items-center justify-center relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Tooltip
              content={({ label, payload }) => (
                <div className="flex h-8 min-w-[120px] items-center gap-x-2 rounded-medium bg-background px-1 text-tiny shadow-small">
                  <span className="font-medium text-white">{label}</span>
                  {payload?.map((p, index) => (
                    <div
                      key={`${index}-${p.name}`}
                      className="flex w-full items-center gap-x-2"
                    >
                      <span className="font-mono font-medium text-white">
                        {p.name}: {formatTotal(p.value as number)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              cursor={false}
            />
            <Pie
              animationDuration={1000}
              animationEasing="ease"
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius="58%"
              outerRadius="80%"
              strokeWidth={0}
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <text
              x="50%"
              y="45%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-sm font-bold fill-white font-pop"
            >
              Total:
            </text>
            <text
              x="50%"
              y="55%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xl font-bold fill-white font-pop"
            >
              {formatTotal(totalScore)}
            </text>
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 pl-4 mt-4 md:mt-0">
          {chartData.map((data, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="capitalize text-default-500">{data.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
