import { useState } from "react";
import { HamburgerMenu } from "@/components/ui/hamburger-menu";

const items = [
  { label: "Overview", to: "/overview" },
  { label: "Projects", to: "/projects" },
  { label: "Settings", to: "/settings" },
];

export default function HamburgerMenuExample() {
  const [activeTo, setActiveTo] = useState("/overview");
  return (
    <div className="flex min-h-72 w-full items-start rounded-xl border border-border bg-background p-5">
      <HamburgerMenu anchor="topbar" items={items} activeTo={activeTo} onNavigate={setActiveTo} />
      <span className="ml-4 text-sm text-muted-foreground">Open the menu to explore the links.</span>
    </div>
  );
}
