import { Tabs } from "@hustradio/unitary-ui";
import { useState } from "react";

export function TabsSecondary62F2CCFFExample() {
  const [selected, setSelected] = useState("github");

  return (
    <Tabs
      variant="secondary"
      selected={selected}
      setSelected={setSelected}
      tabs={[
        { title: "GitHub", value: "github" },
        { title: "GitLab", value: "gitlab" },
        { title: "Bitbucket", value: "bitbucket", disabled: true },
      ]}
      ariaLabel="Secondary tabs"
    />
  );
}
