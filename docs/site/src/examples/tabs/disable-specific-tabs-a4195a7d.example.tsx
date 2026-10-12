import { Tabs } from "@hustradio/unitary-ui";
import { useState } from "react";

export function TabsDisableSpecificTabsA4195A7DExample() {
  const [selected, setSelected] = useState("apple");

  return (
    <Tabs
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        { title: "Mango", value: "mango", disabled: true, tooltip: "Mangos are not allowed" },
      ]}
      ariaLabel="Tabs with disabled tab"
    />
  );
}
