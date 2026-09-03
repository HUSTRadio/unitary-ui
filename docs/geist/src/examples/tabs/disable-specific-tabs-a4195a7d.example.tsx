import { Tabs } from "@/components/ui/tabs";

export function TabsDisableSpecificTabsA4195A7DExample() {
  return (
    <Tabs
      selected="apple"
      setSelected={() => {}}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        { title: "Mango", value: "mango", disabled: true, tooltip: "Mangos are not allowed" },
      ]}
      ariaLabel="Tabs with disabled tab"
    />
  );
}
