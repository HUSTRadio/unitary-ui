import { AreaChart } from "@hustradio/unitary-ui";

const chartData = [
  { month: "Jan", sales: 2890, successfulPayments: 2453 },
  { month: "Feb", sales: 2756, successfulPayments: 2381 },
  { month: "Mar", sales: 3322, successfulPayments: 3052 },
  { month: "Apr", sales: 3410, successfulPayments: 3270 },
  { month: "May", sales: 3870, successfulPayments: 3621 },
  { month: "Jun", sales: 4012, successfulPayments: 3925 },
];

export function AreaChartDefault37A8EEC1Example() {
  return (
    <AreaChart
      data={chartData}
      index="month"
      categories={["sales", "successfulPayments"]}
      valueFormatter={(value) => `$${Intl.NumberFormat("us").format(value).toString()}`}
    />
  );
}
