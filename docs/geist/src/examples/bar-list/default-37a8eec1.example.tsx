import { BarList } from "@/components/ui/charts/bar-list";

const pagesData = [
  { name: "/home", value: 123456 },
  { name: "/discover", value: 98765 },
  { name: "/checkout", value: 76543 },
  { name: "/search", value: 54321 },
  { name: "/account", value: 23456 },
];

export function BarListDefault37A8EEC1Example() {
  return (
    <BarList
      data={pagesData}
      color="gray"
      valueFormatter={(value) => Intl.NumberFormat("us").format(value).toString()}
    />
  );
}
