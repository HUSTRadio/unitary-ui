import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { DonutChart } from "@/components/ui/charts/donut-chart";
import { SparkAreaChart, SparkBarChart } from "@/components/ui/charts/spark-chart";
import { cn } from "@/lib/utils";

/**
 * KPI 统计卡模式：指标值大字号 + 趋势微图 + 涨跌标注。
 * 只借鉴组合模式，容器与排版全部走本项目 token 与语义类。
 */

const REVENUE = [
  { week: "W1", revenue: 3980 },
  { week: "W2", revenue: 4210 },
  { week: "W3", revenue: 4090 },
  { week: "W4", revenue: 4460 },
  { week: "W5", revenue: 4720 },
  { week: "W6", revenue: 4812 },
];

const SIGNUPS = [
  { week: "W1", signups: 212 },
  { week: "W2", signups: 268 },
  { week: "W3", signups: 241 },
  { week: "W4", signups: 296 },
  { week: "W5", signups: 322 },
  { week: "W6", signups: 351 },
];

const STORAGE = [
  { name: "Compute", value: 62 },
  { name: "Storage", value: 38 },
];

function Trend({ delta }: { delta: number }) {
  const positive = delta >= 0;
  return (
    <p
      className={cn(
        "mt-1 inline-flex items-center gap-1 text-copy-13 font-medium",
        positive ? "text-success" : "text-danger",
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-4" aria-hidden />
      ) : (
        <ArrowDownRight className="size-4" aria-hidden />
      )}
      <span className="tabular-nums">
        {positive ? "+" : "−"}
        {Math.abs(delta)}%
      </span>
      <span className="font-normal text-muted-foreground">vs. last month</span>
    </p>
  );
}

export function SparkChartKpiCardC3F1A8D4Example() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <article className="rounded-lg border border-border bg-background-100 p-4">
        <p className="text-copy-13 text-muted-foreground">Monthly recurring revenue</p>
        <p className="mt-1 text-heading-24 font-semibold tabular-nums text-foreground">$48,120</p>
        <Trend delta={12.4} />
        <div className="mt-3 h-12">
          <SparkAreaChart data={REVENUE} index="week" categories={["revenue"]} colors={["blue"]} />
        </div>
      </article>

      <article className="rounded-lg border border-border bg-background-100 p-4">
        <p className="text-copy-13 text-muted-foreground">New signups</p>
        <p className="mt-1 text-heading-24 font-semibold tabular-nums text-foreground">351</p>
        <Trend delta={9.1} />
        <div className="mt-3 h-12">
          <SparkBarChart data={SIGNUPS} index="week" categories={["signups"]} colors={["violet"]} />
        </div>
      </article>

      <article className="rounded-lg border border-border bg-background-100 p-4">
        <p className="text-copy-13 text-muted-foreground">Spend by service</p>
        <div className="mt-2 flex items-center gap-4">
          <DonutChart
            data={STORAGE}
            category="name"
            value="value"
            colors={["blue", "violet"]}
            showTooltip={false}
            className="h-20 w-20 shrink-0"
          />
          <ul className="min-w-0 space-y-1 text-copy-13">
            {STORAGE.map((slice, index) => (
              <li key={slice.name} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    index === 0 ? "bg-blue-500" : "bg-violet-500",
                  )}
                />
                <span className="truncate text-muted-foreground">{slice.name}</span>
                <span className="ml-auto tabular-nums text-foreground">{slice.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
