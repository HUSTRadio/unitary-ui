import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export function ToggleDefault37A8EEC1Example() {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <div className="flex flex-col">
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked2}
        onChange={() => setChecked2(!checked2)}
      />
    </div>
  );
}
