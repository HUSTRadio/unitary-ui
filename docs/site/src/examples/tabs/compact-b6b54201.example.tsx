import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsCompactB6B54201Example() {
  const [selected, setSelected] = useState("apple");

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        selected={selected}
        setSelected={setSelected}
        tabs={[
          { title: "Apple", value: "apple" },
          { title: "Orange", value: "orange" },
          { title: "Mango", value: "mango" },
        ]}
        compact
        ariaLabel="Compact tabs"
      />
      <Tabs
        selected={selected}
        setSelected={setSelected}
        tabs={[
          { title: "GitHub", value: "github" },
          { title: "GitLab", value: "gitlab" },
          { title: "Bitbucket", value: "bitbucket" },
        ]}
        variant="secondary"
        compact
        ariaLabel="Compact secondary tabs"
      />
    </div>
  );
}
