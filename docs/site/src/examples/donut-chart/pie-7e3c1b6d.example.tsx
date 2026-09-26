import { DonutChart } from "@/components/ui/charts/donut-chart";

const cityData = [
  { name: "New York", value: 95574 },
  { name: "London", value: 53925 },
  { name: "Toronto", value: 40751 },
  { name: "Paris", value: 32457 },
];

export function DonutChartPie7E3C1B6DExample() {
  return (
    <DonutChart
      variant="pie"
      data={cityData}
      category="name"
      value="value"
      valueFormatter={(value) =>
        `$${Intl.NumberFormat("us").format(value).toString()}`
      }
      colors={["blue", "cyan", "violet", "amber"]}
    />
  );
}
