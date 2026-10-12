# 设备外框

> Route: `/components/device`

用指定型号的手机或平板外框展示截图和录屏。

[返回组件](#/components)

# 设备外框

device

用指定型号的手机或平板外框展示截图和录屏。

## 何时使用

- 在着陆页、文档和介绍页面中，用 Device 包裹手机或平板截图、录屏和演示图像。
- 同一套展示需要覆盖 iPhone、Pixel、Galaxy 或 iPad 等已注册设备型号时。

## 何时不应使用

- 不要在外框内渲染实时产品界面；设备外框表达的是捕获画面，而非可交互界面。
- 如果只需要展示网页响应式效果，请使用 Browser 组件；它更适合网页截图。

## 示例

### 组合结构

使用必填 model 选择 iPhone 17，并用 DeviceScreen 包裹承担无障碍名称的截图内容。

### 设备型号

展示当前注册表中的 iPhone 17、Pixel 10、Galaxy S25 与 iPad Pro；非 iOS 型号关闭 iOS 专属状态栏。

### 灵动岛

仅在具备 notch 能力的型号上启用 dynamicIsland；不支持的型号会在开发环境告警并忽略。

## 无障碍

- 设备外框、状态栏和 Safari chrome 是装饰层；真正的无障碍名称由 DeviceScreen 内部的截图或录屏承担。
- 为内部截图设置有意义的 alt 文本，说明画面内容和用途。

## 受控行为

不适用: Device 是展示型组件；model、color、chrome 选项和屏幕内容全部由 props 决定，不管理业务交互状态。

## 响应式行为

- autoFit 默认开启，通过 ResizeObserver 只缩小外框以适配窄容器，不会把设备放大到超过原始比例。
- 显式 zoom 优先于 autoFit；landscape 会交换外框宽高。

## 主题行为

- 机身颜色来自所选 model 的注册表，不会随明暗主题自动切换。
- 支持的状态栏和 Safari chrome 可通过各自的 appearance 选项显式选择明暗外观。

## 实时示例

08:00

![Unitary dashboard on iPhone](/dashboard.png)

```tsx
import { Device, DeviceScreen } from "@hustradio/unitary-ui";

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

## 设备型号

08:00

```tsx
import { Device, DeviceScreen } from "@hustradio/unitary-ui";

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

## 灵动岛

08:00

```tsx
import { Device, DeviceScreen } from "@hustradio/unitary-ui";

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

## 设备状态栏

9:41

08:00

```tsx
import { Device, DeviceScreen } from "@hustradio/unitary-ui";

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

## Safari 与 Chrome

08:00

example.com↻

![Website shown in the Safari mockup](/page.png)

```tsx
import { Device, DeviceScreen } from "@hustradio/unitary-ui";

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

## 横屏

08:00

```tsx
import { Device, DeviceScreen } from "@hustradio/unitary-ui";

export function DeviceLandscapeE658D3AEExample() {
  return (
    <Device model="iphone-17" landscape dynamicIsland>
      <DeviceScreen>{/* landscape screenshot */}</DeviceScreen>
    </Device>
  );
}
```

## 外观

9:41

9:41

```tsx
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
      <Device model="iphone-17" statusBar={{ time: "9:41", battery: 72, appearance: "dark" }}>
        <DeviceScreen>
          <Wallpaper dark />
        </DeviceScreen>
      </Device>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Device, DeviceScreen } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">model</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">DeviceModelId</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">已注册的设备型号。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">color</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">DeviceColor&lt;M&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">所选型号支持的机身颜色。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">landscape</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">将支持横屏的设备旋转为横向。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dynamicIsland</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ChromeGate&lt;M, "notch", boolean&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在支持的型号上显示灵动岛装饰。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">statusBar</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ChromeGate&lt;M, "status-bar", boolean | PhoneStatusBarOptions&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在支持的型号上显示或配置装饰性状态栏。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">safari</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ChromeGate&lt;M, "safari", boolean | PhoneSafariOptions&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在支持的型号上显示或配置装饰性 Safari 外观。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">autoFit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">缩小外框以适配窄容器，但不会放大。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">zoom</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">优先于 autoFit 的显式缩放比例。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">animated</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在未请求减少动效时启用短促的外框变换过渡。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">frameClassName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">透传给 MockFrame 根元素的类名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">屏幕内容，通常包裹在 DeviceScreen 中。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 在落地页和文档中，用 Device 包裹手机或平板截图、录屏与 demo 图。
- 显式选择已注册的 model，并传入与截图设备一致的型号 id。
- 不要在外框内渲染实时产品 UI；设备外框表达的是捕获画面，而非可交互界面。
- 把设备 chrome 视为装饰层；无障碍名称由内部截图或录屏承担。
- 仅对具备相应 chrome 能力的 model 使用 statusBar、safari 和 dynamicIsland。
