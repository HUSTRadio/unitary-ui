import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsDisabled75081B59Example() {
  const [selected, setSelected] = useState("apple");

  return (
    <Tabs
      disabled
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        { title: "Mango", value: "mango" },
      ]}
      ariaLabel="Disabled tabs"
    />
  );
}
