# 错误卡片

> Route: `/components/error-card`

包含恢复指引的封闭错误状态。

[返回组件](#/components)

# 错误卡片

Error Card

包含恢复指引的封闭错误状态。

## 何时使用

-   当某个有界面板或卡片区域因错误无法正常渲染时，使用 Error Card 展示具体的错误信息和恢复建议。
-   需要一个包含清晰标题、描述和恢复操作的容器化错误提示，且错误范围限定在单个 UI 区块内。
-   当错误发生时需要提供具体的恢复动作（如重试、联系支持）而非仅显示通用错误消息。

## 何时不应使用

-   不要用于字段级别的表单验证错误——使用 ErrorText 或 Input 的 error 属性更合适。
-   不要用于全页面级的系统错误——全屏错误更适合使用独立的 Error 组件或 Empty State 的错误变体。
-   不要用笼统的 Try again 消息代替具体的恢复操作指导，应该明确说明哪里出了问题及如何解决。

## 示例

### 默认错误卡片

展示默认的 Error Card 结构，包含错误标题、描述和一个恢复操作按钮。

## 无障碍

-   错误卡片应在打开时通过 aria-live="polite" 向屏幕阅读器播报错误信息。
-   恢复操作按钮应有清晰的 aria-label 描述具体执行的动作（如 Retry deployment）。
-   错误图标为装饰性元素，使用 aria-hidden 隐藏以避免重复朗读。

## 受控行为

不适用: Error Card 是展示型组件，由调用方通过 props 控制内容显示；组件自身不管理打开/关闭或受控状态。

## 响应式行为

-   Error Card 在有界容器内自适应宽度，在小屏幕上内部元素自动换行排列。
-   恢复操作按钮在全宽容器中占满可用空间，确保移动端触摸目标的可达性。

## 主题行为

-   错误状态的红色语义配色在暗色/亮色模式下均有对应的色调对，确保可读性和视觉一致性。
-   卡片背景和边框颜色跟随主题变量，支持通过 CSS 变量覆盖自定义外观。

## 实时示例

### No Credits Left

Add credits to continue deploying projects.

```tsx
import { Button } from "@/components/ui/button";
import {
  ErrorCard,
  ErrorCardAction,
  ErrorCardDescription,
  ErrorCardTitle,
} from "@/components/ui/error-card";
import { Trash2 } from "lucide-react";

<ErrorCard className="w-full max-w-md" icon={<Trash2 className="size-6" />}>
  <ErrorCardTitle>No Credits Left</ErrorCardTitle>
  <ErrorCardDescription>Add credits to continue deploying projects.</ErrorCardDescription>
  <ErrorCardAction>
    <Button>Add Credits</Button>
  </ErrorCardAction>
</ErrorCard>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { ErrorCard, ErrorCardTitle, ErrorCardDescription, ErrorCardAction } from "@/components/ui/error-card"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可组合的错误内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   有界面板无法渲染时用 Error Card；校验用字段错误，瞬态动作失败用 Toast。
-   说明什么失败并提供具体恢复动作，而非通用的 Try again 消息。
