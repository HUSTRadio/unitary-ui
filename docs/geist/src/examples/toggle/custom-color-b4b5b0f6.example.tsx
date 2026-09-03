import { Toggle } from "@/components/ui/toggle";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";

export function ToggleCustomColorB4B5B0F6Example() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col">
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="amber"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="red"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="amber"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
        size="large"
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="red"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
        size="large"
      />
    </div>
  );
}
