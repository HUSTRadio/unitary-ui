import { BarChart } from "@/components/ui/charts/bar-chart";

const chartData = [
  { month: "Jan", sales: 4400, profit: 2605 },
  { month: "Feb", sales: 4305, profit: 2410 },
  { month: "Mar", sales: 5230, profit: 3215 },
  { month: "Apr", sales: 5490, profit: 3460 },
  { month: "May", sales: 6102, profit: 3922 },
  { month: "Jun", sales: 6204, profit: 4015 },
];

export function BarChartDefault37A8EEC1Example() {
  return (
    <BarChart
      data={chartData}
      index="month"
      categories={["sales", "profit"]}
      valueFormatter={(value) => `$${Intl.NumberFormat("us").format(value).toString()}`}
    />
  );
}
