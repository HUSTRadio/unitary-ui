import { Device, DeviceScreen } from "@hustradio/unitary-ui";

/** 屏幕占位层：亮/暗两套内容（示意壁纸，非官方素材） */
function Wallpaper({ dark }: { dark?: boolean }) {
  return (
    <div
      aria-hidden
      className={
        dark
          ? "h-full w-full bg-gradient-to-b from-[#1c1c1e] to-[#000000]"
          : "h-full w-full bg-gradient-to-b from-[#e8edf4] to-[#c9d6e6]"
      }
    />
  );
}

export function DeviceAppearance1C9D4B2EExample() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-10">
      <Device model="iphone-17" statusBar={{ time: "9:41", battery: 72 }}>
        <DeviceScreen>
          <Wallpaper />
        </DeviceScreen>
      </Device>
      <Device
        model="iphone-17"
        statusBar={{ time: "9:41", battery: 72, appearance: "dark" }}
      >
        <DeviceScreen>
          <Wallpaper dark />
        </DeviceScreen>
      </Device>
    </div>
  );
}
