import { Toggle } from "@hustradio/unitary-ui";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";

export function ToggleWithLabelBB9F6883Example() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle checked={checked} onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
        <Toggle checked={checked} direction="rtl" onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle checked={checked} size="large" onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle
          checked={checked}
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle
          checked={checked}
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
    </div>
  );
}
