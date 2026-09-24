import { useState } from "react";
import { SidebarNav } from "@/components/ui/sidebar-nav";

const groups = [{
  label: "Workspace",
  items: [
    { label: "Overview", to: "/overview" },
    { label: "Projects", to: "/projects" },
  ],
}];

export default function SidebarNavExample() {
  const [activeTo, setActiveTo] = useState("/overview");
  return (
    <div className="w-full max-w-64 rounded-xl border border-border bg-background p-3">
      <SidebarNav groups={groups} activeTo={activeTo} onNavigate={setActiveTo} collapsible />
    </div>
  );
}
