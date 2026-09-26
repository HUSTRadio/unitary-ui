import {
  SparkAreaChart,
  SparkBarChart,
  SparkLineChart,
} from "@/components/ui/charts/spark-chart";

const visitorsData = [
  { month: "Jan", visitors: 3911 },
  { month: "Feb", visitors: 4011 },
  { month: "Mar", visitors: 4120 },
  { month: "Apr", visitors: 3890 },
  { month: "May", visitors: 4321 },
  { month: "Jun", visitors: 4510 },
];

const revenueData = [
  { month: "Jan", revenue: 2900 },
  { month: "Feb", revenue: 2755 },
  { month: "Mar", revenue: 3322 },
  { month: "Apr", revenue: 3410 },
  { month: "May", revenue: 3870 },
  { month: "Jun", revenue: 4012 },
];

const ordersData = [
  { month: "Jan", orders: 1243 },
  { month: "Feb", orders: 1101 },
  { month: "Mar", orders: 1452 },
  { month: "Apr", orders: 1390 },
  { month: "May", orders: 1612 },
  { month: "Jun", orders: 1705 },
];

export function SparkChartDefault37A8EEC1Example() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      <div className="flex flex-col gap-1">
        <p className="text-copy-13 font-medium text-foreground">Visitors</p>
        <SparkAreaChart data={visitorsData} index="month" categories={["visitors"]} colors={["blue"]} />
        <p className="text-copy-13 text-muted-foreground tabular-nums">+15.3% vs last half</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-copy-13 font-medium text-foreground">Revenue</p>
        <SparkLineChart data={revenueData} index="month" categories={["revenue"]} colors={["emerald"]} />
        <p className="text-copy-13 text-muted-foreground tabular-nums">$4,012 this month</p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-copy-13 font-medium text-foreground">Orders</p>
        <SparkBarChart data={ordersData} index="month" categories={["orders"]} colors={["violet"]} />
        <p className="text-copy-13 text-muted-foreground tabular-nums">1,705 orders</p>
      </div>
    </div>
  );
}
