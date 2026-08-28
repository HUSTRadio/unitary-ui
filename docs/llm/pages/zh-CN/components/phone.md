# 手机外框

> Route: `/components/phone`

将移动端截图置于逼真的手机外框中。

[返回组件](#/components)

# 手机外框

Phone

将移动端截图置于逼真的手机外框中。

## 何时使用

- 在着陆页、文档和介绍页面中，围绕移动截图、录屏和演示图像使用 Phone 作为营销 chrome 框架。
- 需要向读者展示移动应用的实际外观和设计效果时，Phone 外框提供了逼真的模拟效果。

## 何时不应使用

- 不要在外框内渲染真实的移动产品界面——chrome 暗示这是一个截图而非可交互的界面，误导用户以为可以点击操作。
- 如果只需要展示网页响应式效果，请使用 Browser 组件而非 Phone——Browser 更适合网页截图的展示。

## 示例

### 组合结构

展示 Phone 组件的基本组合：一个 realistic 的手机外壳框架内嵌一张图片，包括状态栏、圆角和边框装饰。

### 颜色变体

Phone 外框提供多种配色方案，可根据页面主题选择合适的色调来增强整体设计的一致性。

### 灵动岛

启用 Dynamic Island 变体以展示最新款 iPhone 的灵动岛特征，适合面向现代 iOS 设备的营销材料。

## 无障碍

- Phone 的外壳部分被标记为装饰性元素（aria-hidden），真正的可访问命名归属于内部的截图——屏幕阅读器会读取截图的替代文本。
- 为内部的移动截图设置有意义的 alt 文本，确保屏幕阅读器用户了解截图的内容和意义。

## 受控行为

不适用: Phone 是一个纯展示型 chrome 组件，没有内部交互状态或用户交互能力。它负责提供手机外框的视觉效果，所有内容完全由传入的子元素和 props 决定。

## 响应式行为

- Phone 外框的比例在不同视口下保持不变，确保手机形状的视觉效果始终如一。
- 内部的截图区域会根据容器大小自动缩放，但在宽屏上通常建议限制最大宽度以避免过度拉伸。

## 主题行为

- Phone 外框的颜色、阴影和圆角均从主题令牌获取，自动适配浅色和深色模式的对比度要求。
- Safari Chrome 变体中的浏览器 UI 颜色也跟随主题，保持一致的视觉风格。

## 实时示例

08:00

![Vercel dashboard on iPhone](https://picsum.photos/seed/geist-phone/393/852)

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

<div className="w-full max-w-xs">
  <Phone>
    <PhoneScreen>
      {/* 截图/录屏承担可访问名称 */}
      <img
        src="/dashboard.png"
        alt="Vercel dashboard on iPhone"
        className="h-full w-full object-cover"
      />
    </PhoneScreen>
  </Phone>
</div>;
```

black

white

mist-blue

cosmic-orange

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

<div className="flex flex-wrap gap-6">
  {(["black", "white", "mist-blue", "cosmic-orange"] as const).map((color) => (
    <Phone key={color} color={color} statusBar={false} className="w-[140px]">
      <PhoneScreen>
        <div className="h-full w-full bg-gray-alpha-100" />
      </PhoneScreen>
    </Phone>
  ))}
</div>;
```

08:00

Mobile screenshot

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

<Phone dynamicIsland className="w-[260px]">
  <PhoneScreen>
    <div className="flex h-full items-center justify-center bg-gray-alpha-100" />
  </PhoneScreen>
</Phone>;
```

9:41

Custom status

08:00

Dark appearance

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

<Phone statusBar={{ time: "9:41", battery: 72 }}>
  <PhoneScreen>{/* screenshot */}</PhoneScreen>
</Phone>
<Phone statusBar={{ appearance: "dark" }}>
  <PhoneScreen>{/* screenshot */}</PhoneScreen>
</Phone>
```

08:00

vercel.com/geist↻

![Website shown in the Safari mockup](https://picsum.photos/seed/geist-safari/393/852)

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

const [layout, setLayout] = useState<"compact" | "bottom" | "top">("compact");

<Phone safari={{ layout, url: "vercel.com/geist" }}>
  <PhoneScreen>
    <img
      src="/page.png"
      alt="Website shown in the Safari mockup"
      className="h-full w-full object-cover"
    />
  </PhoneScreen>
</Phone>;
```

08:00

Landscape screenshot

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";

<Phone landscape>
  <PhoneScreen>{/* landscape screenshot */}</PhoneScreen>
</Phone>;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Phone, PhoneScreen } from "@/components/ui/phone";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">屏幕内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

Phone 是包裹手机截图与录屏的营销外框，并非移动端专属 UI。

## 最佳实践

- 落地页与文档里移动端截图、录屏与 demo 图周围的营销 chrome 用 Phone。
- 不要在框内渲染实时移动产品 UI；chrome 暗示的是捕获的屏幕，而非可交互界面。
- 把 chrome 视为装饰性（aria-hidden）；可访问命名属于内部截图。
