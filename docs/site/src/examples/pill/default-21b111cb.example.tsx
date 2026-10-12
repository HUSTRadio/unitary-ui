import { Pill } from "@hustradio/unitary-ui";
import { useState } from "react";

export function PillDefault21B111CBExample() {
  const [active, setActive] = useState("all");

  return (
    <div className="flex flex-wrap gap-2">
      {(["all", "ready", "error"] as const).map((value) => (
        <Pill
          key={value}
          variant={active === value ? "active" : "default"}
          aria-pressed={active === value}
          onClick={() => setActive(value)}
        >
          {value}
        </Pill>
      ))}
    </div>
  );
}
