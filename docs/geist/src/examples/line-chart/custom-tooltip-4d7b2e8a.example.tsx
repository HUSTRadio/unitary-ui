import { LineChart, type TooltipProps } from "@/components/ui/charts/line-chart";

const chartData = [
  { month: "Jan", temperature: 4.5, precipitation: 68 },
  { month: "Feb", temperature: 5.2, precipitation: 61 },
  { month: "Mar", temperature: 9.1, precipitation: 72 },
  { month: "Apr", temperature: 13.4, precipitation: 88 },
  { month: "May", temperature: 17.8, precipitation: 95 },
  { month: "Jun", temperature: 21.9, precipitation: 82 },
];

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-overlay border border-border bg-background px-3 py-2 text-copy-14 shadow-(--material-shadow-base)">
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((item) => (
        <p key={item.category} className="mt-1 flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-xs bg-blue-500" aria-hidden="true" />
          {item.category}:{" "}
          <span className="font-medium text-foreground tabular-nums">{item.value?.toFixed(1)}</span>
        </p>
      ))}
    </div>
  );
}

export function LineChartCustomTooltip4D7B2E8AExample() {
  return (
    <LineChart
      data={chartData}
      index="month"
      categories={["temperature", "precipitation"]}
      customTooltip={CustomTooltip}
    />
  );
}
