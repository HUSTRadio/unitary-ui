# 按钮

> Route: `/components/button`

使用可配置的变体、尺寸和图标触发操作。

[返回组件](#/components)

# 按钮

Button

使用可配置的变体、尺寸和图标触发操作。

## 何时使用

- 用于会改变状态的动作：部署、保存、删除、轮换密钥；需要改变 URL 的导航请用 ButtonLink。
- 表单提交场景使用 typeName="submit"（注意 HTML type 属性在 typeName 上，而 type 控制视觉变体）。
- 同一行有多个相关动作时，改由 Menu 或 Split Button 承载，而不是堆叠多个按钮。

## 何时不应使用

- 不要用 type="success"/"ghost"/"violet" 这类不存在的取值；辅助动作用 secondary，危险确认用 error。
- 不要在按钮动作确实不可能发生之外的场景禁用按钮；禁用时必须配 Tooltip 说明原因。
- 纯图标按钮必须同时提供 svgOnly 与 aria-label；组件不会在运行时校验，调用方必须提供描述动作与目标（复制部署 URL）的标签，而不是只写图标名。

## 示例

### 尺寸

展示按钮的全部尺寸档位，用于按上下文密度选择合适的规格。

### 全部变体对比

把所有 type 与尺寸放在一起对比，作为选择视觉变体的参照表。

### 加载态

用 loading 属性替代手动换 spinner：原生按钮保留标签、显示加载图标，并在调用方清除 loading 前保持禁用。

### 禁用态

展示禁用外观；禁用仅用于动作此刻不可行的场景，并应附带解释原因。

### 前后缀图标

在标签前后放置图标，增强动作识别度。

## 无障碍

- loading 态保留标签、显示加载图标并禁用原生按钮；调用方应在其他可读区域提供进度说明。
- 已有可见文本的按钮不要再设置 aria-label——它会覆盖可见标签，造成屏幕阅读器不一致。
- 禁用按钮必须配 Tooltip 说明原因，否则灰化按钮看起来像 bug。

## 受控行为

- loading 与 disabled 由父组件完全受控，按钮自身不持有状态。
- 点击回调触发后由调用方决定何时解除 loading。

## 响应式行为

- 小视口下优先收窄按钮标签文本而非换行；长动作名考虑缩写或移至菜单。
- 触摸场景选择更大的尺寸档位以保证命中区域。

## 主题行为

- 默认按钮即主要动作色；secondary 用于辅助动作，error 用于危险确认。
- 危险按钮遵循“动词 + 名词”命名并与 toast 一一对应（删除项目 → 项目已删除）。

## 实时示例

```tsx
import { Button } from "@/components/ui/button";

export function ButtonSizes7C69F3FAExample() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button size="small" typeName="button">
        Upload
      </Button>
      <Button typeName="button">Upload</Button>
      <Button size="large" typeName="button">
        Upload
      </Button>
    </div>
  );
}
```

## 全部类型与尺寸对比

```tsx
import { Button } from "@/components/ui/button";

export function ButtonAllTypesAndSizesInComparisonF6E8021DExample() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button size="small" type="default" typeName="button">
          Upload
        </Button>
        <Button size="small" type="error" typeName="button">
          Upload
        </Button>
        <Button size="small" type="warning" typeName="button">
          Upload
        </Button>
        <Button size="small" type="secondary" typeName="button">
          Upload
        </Button>
        <Button size="small" type="tertiary" typeName="button">
          Upload
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button type="default" typeName="button">
          Upload
        </Button>
        <Button type="error" typeName="button">
          Upload
        </Button>
        <Button type="warning" typeName="button">
          Upload
        </Button>
        <Button type="secondary" typeName="button">
          Upload
        </Button>
        <Button type="tertiary" typeName="button">
          Upload
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button size="large" type="default" typeName="button">
          Upload
        </Button>
        <Button size="large" type="error" typeName="button">
          Upload
        </Button>
        <Button size="large" type="warning" typeName="button">
          Upload
        </Button>
        <Button size="large" type="secondary" typeName="button">
          Upload
        </Button>
        <Button size="large" type="tertiary" typeName="button">
          Upload
        </Button>
      </div>
    </div>
  );
}
```

## 形状

```tsx
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

export function ButtonShapesE729E861Example() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button aria-label="Upload" shape="square" size="tiny" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="square" size="small" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="square" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="square" size="large" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="circle" size="tiny" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="circle" size="small" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="circle" svgOnly typeName="button">
        <ArrowUp />
      </Button>
      <Button aria-label="Upload" shape="circle" size="large" svgOnly typeName="button">
        <ArrowUp />
      </Button>
    </div>
  );
}
```

## 前缀与后缀

```tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function ButtonPrefixAndSuffix99076368Example() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button prefix={<ArrowLeft />} typeName="button">
        Upload
      </Button>
      <Button suffix={<ArrowRight />} typeName="button">
        Upload
      </Button>
      <Button prefix={<ArrowLeft />} suffix={<ArrowRight />} typeName="button">
        Upload
      </Button>
    </div>
  );
}
```

## 圆角

```tsx
import { Button } from "@/components/ui/button";

export function ButtonRounded01024DEEExample() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button shadow shape="rounded" size="small" type="secondary" typeName="button">
        Upload
      </Button>
      <Button shadow shape="rounded" type="secondary" typeName="button">
        Upload
      </Button>
      <Button shadow shape="rounded" size="large" type="secondary" typeName="button">
        Upload
      </Button>
    </div>
  );
}
```

## 加载中

```tsx
import { Button } from "@/components/ui/button";

export function ButtonLoadingB4A070A2Example() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button loading size="small" typeName="button">
        Upload
      </Button>
      <Button loading typeName="button">
        Upload
      </Button>
      <Button loading size="large" typeName="button">
        Upload
      </Button>
    </div>
  );
}
```

## 禁用

```tsx
import { Button } from "@/components/ui/button";

export function ButtonDisabled17EB3C01Example() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button disabled size="small" typeName="button">
        Upload
      </Button>
      <Button disabled typeName="button">
        Upload
      </Button>
      <Button disabled size="large" typeName="button">
        Upload
      </Button>
    </div>
  );
}
```

## 各变体禁用态

```tsx
import { Button } from "@/components/ui/button";

export function ButtonDisabledVariantsCB2C3BEAExample() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <Button disabled typeName="button">
        Default
      </Button>
      <Button disabled type="secondary" typeName="button">
        Secondary
      </Button>
      <Button disabled type="tertiary" typeName="button">
        Tertiary
      </Button>
      <Button disabled type="error" typeName="button">
        Error
      </Button>
      <Button disabled type="warning" typeName="button">
        Warning
      </Button>
    </div>
  );
}
```

## 链接

[Sign Up](https://vercel.com/signup)

```tsx
import { ButtonLink } from "@/components/ui/button";

export function ButtonLinkB1B1BDB4Example() {
  return (
    <ButtonLink className="w-fit" href="https://vercel.com/signup">
      Sign Up
    </ButtonLink>
  );
}
```

## 自定义样式

```tsx
import { CustomButton } from "@/components/ui/button";

export function ButtonCustom6CDFD271Example() {
  return (
    <div className="flex flex-col items-start gap-4 md:flex-row">
      <CustomButton
        active={{
          foreground: "#fff",
          background: "var(--blue-700)",
          border: "var(--blue-700)",
        }}
        hover={{
          foreground: "#fff",
          background: "#0B7BFE",
          border: "var(--blue-700)",
        }}
        normal={{
          foreground: "#fff",
          background: "var(--blue-700)",
          border: "var(--blue-700)",
        }}
        width={160}
      >
        Upgrade to Pro
      </CustomButton>
    </div>
  );
}
```

## 变体

```tsx
import { Button } from "@/components/ui/button";

export function ButtonVariants63D2643BExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button typeName="button">Default</Button>
      <Button type="secondary" typeName="button">
        Secondary
      </Button>
      <Button type="tertiary" typeName="button">
        Outline
      </Button>
      <Button type="tertiary" typeName="button">
        Ghost
      </Button>
      <Button type="error" typeName="button">
        Destructive
      </Button>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Button, ButtonLink, CustomButton, buttonVariants } from "@/components/ui/button";
```

原生属性：`ButtonHTMLAttributes<HTMLButtonElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default" | "secondary" | "tertiary" | "error" | "warning"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">视觉变体。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">typeName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"submit" | "button" | "reset"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">原生按钮 type。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"submit"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示加载图标、保留标签，并禁用原生按钮。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"tiny" | "small" | "medium" | "large"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">控制高度与水平内边距。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"medium"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shape</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"square" | "circle" | "rounded"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">圆角形态；rounded 可配合 shadow 用于营销 CTA。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"square"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shadow</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">营销页阴影（配合 shape="rounded"）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">svgOnly</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">图标按钮模式：collapse padding，需配合 aria-label。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">前缀图标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">后缀图标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">asChild</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">以子元素渲染（Slot）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 改变状态的动作（部署、保存、删除）用 Button；改变 URL 的导航用 ButtonLink。一行放不下多个相关动作时改用 Menu 或 Split Button。
- 用 loading 而不是替换成 spinner，这样按钮保持可聚焦，并向辅助技术播报忙碌状态。
- 默认 Button 是 primary。支持动作传 type="secondary"，破坏性确认传 type="error"。primary、success、ghost 和 violet 不是合法 type 值。
- 表单提交用 typeName="submit"。HTML type 属性位于 typeName 上，而非控制视觉变体的 type 上。
- 仅当动作当前确实不可能时（缺输入、权限不足）才禁用按钮，并配一个解释原因的 Tooltip。
- 标签首字母大写并写明结果：Deploy Project、Invite Member、Rotate Key。避免裸动词（Submit）与通用确认（OK、Confirm）。
- 破坏性按钮遵循 动词 + 名词，并 1:1 配对 toast：Delete Project 然后 Project deleted。模式切换按钮追加 Instead：Use a Recovery Code Instead。
- 纯图标按钮必须同时有 svgOnly 与 aria-label；调用方必须提供可访问标签，组件不会在运行时校验。aria-label 命名动作与目标（Copy deployment URL），而不是图标（Copy）。
- 已有可见文字的按钮不要设置 aria-label；它会覆盖标签并造成读屏不一致。
