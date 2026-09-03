import { Tabs } from "@/components/ui/tabs";

export function TabsSecondary62F2CCFFExample() {
  return (
    <Tabs
      variant="secondary"
      selected="github"
      setSelected={() => {}}
      tabs={[
        { title: "GitHub", value: "github" },
        { title: "GitLab", value: "gitlab" },
        { title: "Bitbucket", value: "bitbucket", disabled: true },
      ]}
      ariaLabel="Secondary tabs"
    />
  );
}
