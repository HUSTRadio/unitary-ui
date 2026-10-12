import { AreaChart, type AreaChartTooltipProps as TooltipProps } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", sales: 2890, successfulPayments: 2453 },
  { month: "Feb", sales: 2756, successfulPayments: 2381 },
  { month: "Mar", sales: 3322, successfulPayments: 3052 },
  { month: "Apr", sales: 3410, successfulPayments: 3270 },
  { month: "May", sales: 3870, successfulPayments: 3621 },
  { month: "Jun", sales: 4012, successfulPayments: 3925 },
];

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const total = payload.reduce((sum, item) => sum + (item.value ?? 0), 0);
  return (
    <div className="rounded-overlay border border-border bg-background px-3 py-2 text-copy-14 shadow-(--material-shadow-base)">
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-muted-foreground tabular-nums">
        Total: <span className="font-medium text-foreground">{Intl.NumberFormat("us").format(total)}</span>
      </p>
    </div>
  );
}

export function AreaChartCustomTooltip8C1D4E7FExample() {
  return (
    <AreaChart
      data={chartData}
      index="month"
      categories={["sales", "successfulPayments"]}
      customTooltip={CustomTooltip}
    />
  );
}
