import { Device, DeviceScreen } from "@/components/ui/device";

export function DeviceSafariChrome0140AFFBExample() {
  return (
    <Device model="iphone-17" safari={{ layout: "compact", url: "example.com" }}>
      <DeviceScreen>
        <img src="/page.png" alt="Website shown in the Safari mockup" className="h-full w-full object-cover" />
      </DeviceScreen>
    </Device>
  );
}
