import { AreaChart } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", desktop: 1243, mobile: 954, embedded: 312 },
  { month: "Feb", desktop: 1101, mobile: 1001, embedded: 367 },
  { month: "Mar", desktop: 1452, mobile: 1213, embedded: 420 },
  { month: "Apr", desktop: 1390, mobile: 1345, embedded: 452 },
  { month: "May", desktop: 1612, mobile: 1490, embedded: 511 },
  { month: "Jun", desktop: 1705, mobile: 1621, embedded: 598 },
];

export function AreaChartStacked5E4F2A9BExample() {
  return (
    <AreaChart
      className="h-72"
      data={chartData}
      index="month"
      categories={["desktop", "mobile", "embedded"]}
      type="stacked"
      valueFormatter={(value) => `${Intl.NumberFormat("us").format(value).toString()} visits`}
    />
  );
}
