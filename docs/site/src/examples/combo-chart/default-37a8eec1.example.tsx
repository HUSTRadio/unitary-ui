import { ComboChart } from "@/components/ui/charts/combo-chart";

const chartData = [
  { month: "Jan", revenue: 4400, operatingCosts: 2205 },
  { month: "Feb", revenue: 4305, operatingCosts: 2310 },
  { month: "Mar", revenue: 5230, operatingCosts: 2144 },
  { month: "Apr", revenue: 5490, operatingCosts: 2360 },
  { month: "May", revenue: 6102, operatingCosts: 2278 },
  { month: "Jun", revenue: 6204, operatingCosts: 2465 },
];

export function ComboChartDefault37A8EEC1Example() {
  return (
    <ComboChart
      data={chartData}
      index="month"
      barSeries={{
        categories: ["revenue"],
        colors: ["blue"],
        valueFormatter: (value) => `$${Intl.NumberFormat("us").format(value).toString()}`,
      }}
      lineSeries={{
        categories: ["operatingCosts"],
        colors: ["amber"],
        valueFormatter: (value) => `$${Intl.NumberFormat("us").format(value).toString()}`,
      }}
    />
  );
}
