import { Tabs } from "@hustradio/unitary-ui";
import { LayoutGrid } from "lucide-react";
import { useState } from "react";

export function TabsWithIcons1F71F4BCExample() {
  const [selected, setSelected] = useState("github");

  return (
    <Tabs
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "GitHub", value: "github", icon: <LayoutGrid className="size-4" aria-hidden /> },
        { title: "GitLab", value: "gitlab" },
        { title: "Bitbucket", value: "bitbucket" },
      ]}
      ariaLabel="Tabs with icons"
    />
  );
}
