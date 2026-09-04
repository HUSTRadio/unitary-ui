import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";

export function TabsDefault21B111CBExample() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="w-full max-w-xl">
      <Tabs
        tabs={[
          { value: "overview", title: "Overview" },
          { value: "usage", title: "Usage" },
          { value: "api", title: "API" },
        ]}
        selected={tab}
        setSelected={setTab}
        ariaLabel="Component documentation"
      />
    </div>
  );
}
