import { useState } from "react";
import { Device, DeviceScreen } from "@/components/ui/device";

export function DeviceSafariChrome0140AFFBExample() {
  const [layout, setLayout] = useState<"compact" | "bottom" | "top">("compact");

  return (
    <Device model="iphone-17" safari={{ layout, url: "vercel.com/geist" }}>
      <DeviceScreen>
        <img src="/page.png" alt="Website shown in the Safari mockup" className="h-full w-full object-cover" />
      </DeviceScreen>
    </Device>
  );
}
