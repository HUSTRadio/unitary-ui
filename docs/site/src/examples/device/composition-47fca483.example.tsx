import { Device, DeviceScreen } from "@/components/ui/device";

export function DeviceComposition47FCA483Example() {
  return (
    <div className="w-full max-w-xs">
      <Device model="iphone-17">
        <DeviceScreen>
          {/* 截图/录屏承担可访问名称 */}
          <img
            src="/dashboard.png"
            alt="Unitary dashboard on iPhone"
            className="h-full w-full object-cover"
          />
        </DeviceScreen>
      </Device>
    </div>
  );
}
