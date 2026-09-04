import { Device, DeviceScreen } from "@/components/ui/device";

export function DeviceStatusBar3EF6E901Example() {
  return (
    <>
    <Device model="iphone-17" statusBar={{ time: "9:41", battery: 72 }}>
      <DeviceScreen>{/* screenshot */}</DeviceScreen>
    </Device>
    <Device model="iphone-17" statusBar={{ appearance: "dark" }}>
      <DeviceScreen>{/* screenshot */}</DeviceScreen>
    </Device>
    </>
  );
}
