# 徽章

> Route: `/components/badge`

用于状态、计数和元数据的简短标签。

[返回组件](#/components)

# 徽章

badge

用于状态、计数和元数据的简短标签。

## 何时使用

- 在描述对象的旁边放置简短、可快速扫描的元数据标签：状态、计划层级、环境或角色。
- 展示生命周期阶段标签（Alpha、Beta、Early Access），并配合 Tooltip 注明限制信息。
- 用颜色映射表达含义：绿色表示健康，红色表示错误，琥珀色表示警告，蓝色表示信息或生产环境。

## 何时不应使用

- 不要让 Badge 成为可点击元素；如果用户需要操作该值，提升为 Button 或链接。
- 不要在 Badge 内嵌套另一个 Badge 或多个图标——每行只放一个 Badge。
- 不要在 Badge 中塞入整句文案（如 Currently Active），周围行已经提供了上下文。

## 示例

### 变体

展示 gray、blue、purple、amber、red、pink、green、teal 等颜色及其低对比度样式，以及 inverted、trial、turbo、outline 变体。

### 尺寸

展示 compact、sm、md 和 lg 四种尺寸，适用于不同密度的布局。

### 圆角矩形与紧凑档

shape="rounded"（4px 圆角矩形）+ size="compact"（20px 高）+ contrast="soft"（柔和底色）的组合，用于导航状态标记等密集场景。

### 带图标

展示图标加文字的 Badge，以及纯圆点变体（Status Dot）。

## 无障碍

- 仅靠图标或颜色模糊不清的 Badge 应设置 title 属性，以便屏幕阅读器朗读其含义。
- 不要仅仅依赖颜色传递信息——文本必须在没有颜色的情况下也可读。
- 对于含敏感状态的 Badge（如 Error），避免将其放在低对比度表面上。

## 受控行为

不适用: Badge 是静态标签，不支持受控行为或交互状态；内容通过 props 直接渲染。

## 响应式行为

- Badge 采用紧凑的内联排版，在窄屏和宽屏上保持一致的视觉密度。
- 长文本在窄屏上自动换行或通过省略号截断，不会溢出父容器边界。

## 主题行为

- 每个变体对应一套深色/浅色模式下的颜色对，跟随主题变量的更新。
- \-subtle 后缀色调可在密集表面上调低任何变体的饱和度，减少视觉干扰。

## 实时示例

GrayGray Subtle

BlueBlue Subtle

PurplePurple Subtle

AmberAmber Subtle

RedRed Subtle

PinkPink Subtle

GreenGreen Subtle

TealTeal Subtle

InvertedTrialTurborepoOutline

```tsx
import { Badge } from "@/components/ui/badge";

export function BadgeVariants63D2643BExample() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="gray">Gray</Badge>
        <Badge variant="gray" contrast="low">
          Gray Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="blue">Blue</Badge>
        <Badge variant="blue" contrast="low">
          Blue Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="purple">Purple</Badge>
        <Badge variant="purple" contrast="low">
          Purple Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="amber">Amber</Badge>
        <Badge variant="amber" contrast="low">
          Amber Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="red">Red</Badge>
        <Badge variant="red" contrast="low">
          Red Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="pink">Pink</Badge>
        <Badge variant="pink" contrast="low">
          Pink Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="green">Green</Badge>
        <Badge variant="green" contrast="low">
          Green Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="teal">Teal</Badge>
        <Badge variant="teal" contrast="low">
          Teal Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="inverted">Inverted</Badge>
        <Badge variant="trial">Trial</Badge>
        <Badge variant="turbo">Turborepo</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </div>
  );
}
```

## 尺寸

CompactSmallMediumLarge

```tsx
import { Badge } from "@/components/ui/badge";

export function BadgeSizes74A3978DExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="compact">Compact</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  );
}
```

## 带图标

GrayGrayGrayGrayGrayGray

BlueBlueBlueBlueBlueBlue

GreenGreenGreenGreenGreenGreen

```tsx
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export function BadgeWithIcons1F71F4BCExample() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge icon={<Shield aria-hidden />} size="lg" variant="gray">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="gray">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="gray">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="lg" variant="gray" contrast="low">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="gray" contrast="low">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="gray" contrast="low">
          Gray
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge icon={<Shield aria-hidden />} size="lg" variant="blue">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="blue">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="blue">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="lg" variant="blue" contrast="low">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="blue" contrast="low">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="blue" contrast="low">
          Blue
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge icon={<Shield aria-hidden />} size="lg" variant="green">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="green">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="green">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="lg" variant="green" contrast="low">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="green" contrast="low">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="green" contrast="low">
          Green
        </Badge>
      </div>
    </div>
  );
}
```

## 胶囊

LabelLabelLabel

LabelLabelLabel

```tsx
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export function BadgePill9945C78BExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="pill" size="sm">
          Label
        </Badge>
        <Badge variant="pill" size="md">
          Label
        </Badge>
        <Badge variant="pill" size="lg">
          Label
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="pill" size="sm" icon={<Shield aria-hidden />}>
          Label
        </Badge>
        <Badge variant="pill" size="md" icon={<Shield aria-hidden />}>
          Label
        </Badge>
        <Badge variant="pill" size="lg" icon={<Shield aria-hidden />}>
          Label
        </Badge>
      </div>
    </div>
  );
}
```

## 圆角矩形与紧凑档

UpdatedNewHealthyWarningFailed

Pill compactRounded compactRounded mdWith icon

```tsx
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

/**
 * 圆角矩形 + compact（+ soft 底色）：导航状态标记这类密集场景的标准组合。
 * 与全圆胶囊（默认）对照，几何只有圆角与内边距两处差异。
 */
export function BadgeCompactRounded7C41E2A8Example() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge shape="rounded" size="compact" variant="gray" contrast="soft">
          Updated
        </Badge>
        <Badge shape="rounded" size="compact" variant="blue" contrast="soft">
          New
        </Badge>
        <Badge shape="rounded" size="compact" variant="green" contrast="soft">
          Healthy
        </Badge>
        <Badge shape="rounded" size="compact" variant="amber" contrast="soft">
          Warning
        </Badge>
        <Badge shape="rounded" size="compact" variant="red" contrast="soft">
          Failed
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge shape="pill" size="compact" variant="blue" contrast="soft">
          Pill compact
        </Badge>
        <Badge shape="rounded" size="compact" variant="blue">
          Rounded compact
        </Badge>
        <Badge shape="rounded" variant="blue" contrast="soft">
          Rounded md
        </Badge>
        <Badge
          shape="rounded"
          size="compact"
          variant="blue"
          contrast="soft"
          icon={<Bell aria-hidden />}
        >
          With icon
        </Badge>
      </div>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Badge, badgeVariants } from "@/components/ui/badge";
```

原生属性：`HTMLAttributes<HTMLSpanElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">BadgeVariant</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">徽章视觉变体。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"gray"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shape</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"pill" | "rounded"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">全圆胶囊或圆角矩形（4px 半径）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"pill"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"compact" | "sm" | "md" | "lg"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">徽章尺寸。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"md"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">contrast</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"low" | "soft"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">低对比度文字样式，或柔和底色档。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选的前置图标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">asChild</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">通过子元素渲染。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 对紧邻所描述对象（状态、计划层级、环境或角色）的简短、可扫读元数据使用 Badge。一行一个；并排两个说明该行需要第二列。
- 无文字的彩色圆点用 Status Dot；可点击、切换查询的过滤 chip 用 pill 变体或小型 Button。
- Badge 是静态标签。不要给它挂 onClick；当用户可以对值采取操作时，升级为 Button 或链接。
- Badge 内容保持文字或图标 + 文字。绝不在 Badge 内堆叠两个图标或嵌套子 Badge。
- 生命周期 Badge（Alpha、Beta、Early Access）配一个说明限制的 Tooltip，如 Alpha：API 在 GA 前可能变更。
- 首字母大写，尽量一个词，最多两个：Active、Pending、Pro、Enterprise Trial。与规范 API 或日志术语一致：Production 而非 Prod、Deployed 而非 Live、Canceled 而非 Cancelled（与规范 API 的单 L 拼写一致）。
- 成功状态不加对勾图标、错误不加 X；由变体传达信号。把含义映射到颜色：绿色健康、红色错误、琥珀警告、蓝色信息或生产、灰色中性。-subtle 后缀可在密集表面弱化任一颜色。
- 不要往里面塞完整句子（Currently Active、You are on Pro）；周围的行已提供上下文。
- 对纯图标或含义模糊的 Badge 设置 title，让屏幕阅读器播报含义。不要只依赖颜色；没有它文字也必须可读。
