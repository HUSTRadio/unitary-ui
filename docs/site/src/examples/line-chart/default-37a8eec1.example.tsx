import { LineChart } from "@/components/ui/charts/line-chart";

const chartData = [
  { month: "Jan", temperature: 4.5, precipitation: 68 },
  { month: "Feb", temperature: 5.2, precipitation: 61 },
  { month: "Mar", temperature: 9.1, precipitation: 72 },
  { month: "Apr", temperature: 13.4, precipitation: 88 },
  { month: "May", temperature: 17.8, precipitation: 95 },
  { month: "Jun", temperature: 21.9, precipitation: 82 },
];

export function LineChartDefault37A8EEC1Example() {
  return (
    <LineChart
      data={chartData}
      index="month"
      categories={["temperature", "precipitation"]}
      valueFormatter={(value) => `${value.toFixed(1)} units`}
      xAxisLabel="Month"
      yAxisLabel="Measurement"
    />
  );
}
