import { Tabs } from "@/components/ui/tabs";
import { LayoutGrid } from "lucide-react";

export function TabsWithIcons1F71F4BCExample() {
  return (
    <Tabs
      selected="github"
      setSelected={() => {}}
      tabs={[
        { title: "GitHub", value: "github", icon: <LayoutGrid className="size-4" aria-hidden /> },
        { title: "GitLab", value: "gitlab" },
        { title: "Bitbucket", value: "bitbucket" },
      ]}
      ariaLabel="Tabs with icons"
    />
  );
}
