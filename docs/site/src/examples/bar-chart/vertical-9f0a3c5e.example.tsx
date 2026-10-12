import { BarChart } from "@hustradio/unitary-ui";

const verticalData = [
  { browser: "Chrome", visits: 4245 },
  { browser: "Safari", visits: 2100 },
  { browser: "Firefox", visits: 1301 },
  { browser: "Edge", visits: 876 },
];

export function BarChartVertical9F0A3C5EExample() {
  return (
    <BarChart
      className="h-64"
      data={verticalData}
      index="browser"
      categories={["visits"]}
      layout="vertical"
      valueFormatter={(value) => `${Intl.NumberFormat("us").format(value).toString()} visits`}
    />
  );
}
