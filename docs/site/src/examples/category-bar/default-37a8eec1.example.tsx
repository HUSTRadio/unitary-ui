import { CategoryBar } from "@/components/ui/charts/category-bar";

export function CategoryBarDefault37A8EEC1Example() {
  return (
    <CategoryBar
      values={[62, 18, 20]}
      colors={["blue", "cyan", "gray"]}
      marker={{ value: 78, tooltip: "Target: 78%" }}
    />
  );
}
