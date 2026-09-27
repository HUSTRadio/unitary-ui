import { Device, DeviceScreen } from "@/components/ui/device";

export function DeviceDynamicIsland8E97BE46Example() {
  return (
    <Device model="iphone-17" dynamicIsland className="w-[260px]">
      <DeviceScreen>
        <div className="flex h-full items-center justify-center bg-gray-alpha-100" />
      </DeviceScreen>
    </Device>
  );
}
