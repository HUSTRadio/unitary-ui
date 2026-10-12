import { ComboChart } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", revenue: 4400, margin: 0.18 },
  { month: "Feb", revenue: 4305, margin: 0.16 },
  { month: "Mar", revenue: 5230, margin: 0.21 },
  { month: "Apr", revenue: 5490, margin: 0.24 },
  { month: "May", revenue: 6102, margin: 0.26 },
  { month: "Jun", revenue: 6204, margin: 0.25 },
];

export function ComboChartBiaxial2A9F5C3EExample() {
  return (
    <ComboChart
      data={chartData}
      index="month"
      enableBiaxial
      barSeries={{
        categories: ["revenue"],
        colors: ["blue"],
        valueFormatter: (value) => `$${Intl.NumberFormat("us").format(value).toString()}`,
      }}
      lineSeries={{
        categories: ["margin"],
        colors: ["emerald"],
        valueFormatter: (value) => `${(value * 100).toFixed(0)}%`,
      }}
    />
  );
}
