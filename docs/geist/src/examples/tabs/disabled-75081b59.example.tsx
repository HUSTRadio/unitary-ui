import { Tabs } from "@/components/ui/tabs";

export function TabsDisabled75081B59Example() {
  return (
    <Tabs
      disabled
      selected="apple"
      setSelected={() => {}}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        { title: "Mango", value: "mango" },
      ]}
      ariaLabel="Disabled tabs"
    />
  );
}
