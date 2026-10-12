import { DonutChart } from "@hustradio/unitary-ui";

const cityData = [
  { name: "New York", value: 95574 },
  { name: "London", value: 53925 },
  { name: "Toronto", value: 40751 },
  { name: "Paris", value: 32457 },
];

export function DonutChartDefault37A8EEC1Example() {
  return (
    <DonutChart
      data={cityData}
      category="name"
      value="value"
      colors={["blue", "cyan", "violet", "amber"]}
    >
      <p className="text-copy-14 font-medium text-foreground">222,707</p>
      <p className="text-copy-13 text-muted-foreground">Total Visitors</p>
    </DonutChart>
  );
}
