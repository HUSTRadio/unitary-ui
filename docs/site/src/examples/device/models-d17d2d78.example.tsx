import { Device, DeviceScreen } from "@/components/ui/device";

export function DeviceModelsD17D2D78Example() {
  const models = ["iphone-17", "pixel-10", "galaxy-s25", "ipad-pro"] as const;

  return (
    <div className="flex flex-wrap gap-6">
      {models.map((model) => (
        <Device
          key={model}
          model={model}
          statusBar={model === "iphone-17"}
          className="w-[140px]"
        >
          <DeviceScreen>
            <div className="h-full w-full bg-gray-alpha-100" />
          </DeviceScreen>
        </Device>
      ))}
    </div>
  );
}
