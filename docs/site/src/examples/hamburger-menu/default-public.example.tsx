import { useState } from "react";
import { HamburgerMenu } from "@hustradio/unitary-ui";

const items = [
  { label: "Overview", to: "/overview" },
  { label: "Projects", to: "/projects" },
  { label: "Settings", to: "/settings" },
];

export default function HamburgerMenuExample() {
  const [activeTo, setActiveTo] = useState("/overview");
  const [state, setState] = useState<"ready" | "empty" | "loading">("ready");
  return (
    <div className="flex min-h-72 w-full flex-col gap-4 rounded-xl border border-border bg-background p-5">
      <div className="flex items-center gap-4">
        <HamburgerMenu
          anchor="topbar"
          items={state === "ready" ? items : []}
          loading={state === "loading"}
          activeTo={activeTo}
          onNavigate={setActiveTo}
        />
        <span className="text-sm text-muted-foreground">Open the menu to explore the links or search for a missing item.</span>
      </div>
      <div className="flex flex-wrap gap-2" aria-label="Navigation data state">
        {(["ready", "empty", "loading"] as const).map((next) => (
          <button
            key={next}
            type="button"
            aria-pressed={state === next}
            onClick={() => setState(next)}
            className="rounded-md border border-border px-3 py-2 text-sm text-foreground aria-pressed:bg-gray-100"
          >
            {next === "ready" ? "Items" : next === "empty" ? "Empty" : "Loading"}
          </button>
        ))}
      </div>
    </div>
  );
}
