# Device

> Route: `/components/device`

Frames screenshots inside realistic phone and tablet shells.

[Back to Components](#/components)

# Device

device

Frames screenshots inside realistic phone and tablet shells.

## When to use

- Around phone or tablet screenshots, recordings, and demo images on landing pages, docs, and introduction pages.
- When one showcase must cover registered iPhone, Pixel, Galaxy, or iPad models through the same component contract.

## When not to use

- Don't render live product UI inside the frame; device chrome implies a captured surface, not an interactive one.
- Use Browser instead when the goal is to demonstrate responsive web pages.

## Examples

### Composition

Selects iPhone 17 through the required model prop and wraps the accessibly named screenshot in DeviceScreen.

### Device models

Shows the registered iPhone 17, Pixel 10, Galaxy S25, and iPad Pro models; non-iOS models disable the iOS-only status bar.

### Dynamic Island

Enables dynamicIsland only on models with notch capability; unsupported models warn in development and ignore it.

## Accessibility

- The device frame, status bar, and Safari chrome are decorative; accessible naming belongs on the screenshot or recording inside DeviceScreen.
- Set meaningful alt text on inner screenshots so screen reader users understand the captured content and purpose.

## Controlled behavior

Not applicable: Device is presentational. Its model, color, chrome options, and screen content are all determined by props rather than internal product state.

## Responsive behavior

- autoFit uses ResizeObserver to shrink the frame for narrow containers without enlarging it beyond its original scale.
- An explicit zoom takes precedence over autoFit; landscape swaps the frame dimensions.

## Theme behavior

- Body colors come from the selected model registry and do not switch automatically with the page theme.
- Supported status-bar and Safari chrome can select light or dark appearance explicitly through their options.

## Live Demo

08:00

![Unitary dashboard on iPhone](/dashboard.png)

```tsx
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
```

## Models

08:00

```tsx
import { Device, DeviceScreen } from "@/components/ui/device";

export function DeviceModelsD17D2D78Example() {
  const models = ["iphone-17", "pixel-10", "galaxy-s25", "ipad-pro"] as const;

  return (
    <div className="flex flex-wrap gap-6">
      {models.map((model) => (
        <Device key={model} model={model} statusBar={model === "iphone-17"} className="w-[140px]">
          <DeviceScreen>
            <div className="h-full w-full bg-gray-alpha-100" />
          </DeviceScreen>
        </Device>
      ))}
    </div>
  );
}
```

## Dynamic Island

08:00

```tsx
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
```

## Status Bar

9:41

08:00

```tsx
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
```

## Safari Chrome

08:00

example.com↻

![Website shown in the Safari mockup](/page.png)

```tsx
import { Device, DeviceScreen } from "@/components/ui/device";

export function DeviceSafariChrome0140AFFBExample() {
  return (
    <Device model="iphone-17" safari={{ layout: "compact", url: "example.com" }}>
      <DeviceScreen>
        <img
          src="/page.png"
          alt="Website shown in the Safari mockup"
          className="h-full w-full object-cover"
        />
      </DeviceScreen>
    </Device>
  );
}
```

## Landscape

08:00

```tsx
import { Device, DeviceScreen } from "@/components/ui/device";

export function DeviceLandscapeE658D3AEExample() {
  return (
    <Device model="iphone-17" landscape dynamicIsland>
      <DeviceScreen>{/* landscape screenshot */}</DeviceScreen>
    </Device>
  );
}
```

## Appearance

9:41

9:41

```tsx
import { Device, DeviceScreen } from "@/components/ui/device";

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
      <Device model="iphone-17" statusBar={{ time: "9:41", battery: 72, appearance: "dark" }}>
        <DeviceScreen>
          <Wallpaper dark />
        </DeviceScreen>
      </Device>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Device, DeviceScreen } from "@/components/ui/device";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">model</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">DeviceModelId</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Registered device model.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">color</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">DeviceColor&lt;M&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Body color supported by the selected model.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">landscape</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Rotates devices that support landscape.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dynamicIsland</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ChromeGate&lt;M, "notch", boolean&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows the notch treatment on supported models.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">statusBar</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ChromeGate&lt;M, "status-bar", boolean | PhoneStatusBarOptions&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows or configures the decorative status bar on supported models.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">safari</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ChromeGate&lt;M, "safari", boolean | PhoneSafariOptions&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows or configures decorative Safari chrome on supported models.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">autoFit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shrinks the frame to fit narrow containers without enlarging it.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">zoom</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Explicit scale that takes precedence over autoFit.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">animated</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Enables the short frame transform transition unless reduced motion is requested.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">frameClassName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Class name forwarded to the MockFrame root.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Screen content, normally wrapped in DeviceScreen.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Device as marketing chrome around phone or tablet screenshots, recordings, and demo images on landing pages and docs.
- Choose a registered model explicitly; pass the model id that matches the screenshot's device.
- Don't render live product UI inside the frame; the chrome implies a captured screen, not an interactive surface.
- Treat the device chrome as decorative; accessible naming belongs on the inner screenshot or recording.
- Use statusBar, safari, and dynamicIsland only with models whose chrome capability supports them.
