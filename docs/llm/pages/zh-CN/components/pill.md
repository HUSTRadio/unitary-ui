# 胶囊标签

> Route: `/components/pill`

用于切换查询或选择的可点击筛选标签。

[返回组件](#/components)

# 胶囊标签

Pill

用于切换查询或选择的可点击筛选标签。

## 何时使用

- 需要可点击的筛选芯片来切换过滤条件时，使用 Pill 而非静态 Badge。
- 通过 variant="active" 高亮当前已选中的筛选器，让视觉用户无需依赖颜色即可感知激活状态。
- 将 onClick 绑定到真正能触发过滤行为的场景，确保交互有意义。

## 何时不应使用

- 不要将 Pill 用于纯展示的状态标签——如果不需要点击交互，改用 Badge。
- 不要在没有实际过滤功能的元素上绑定 onClick；若只能展示不能操作，应提升为 Badge。
- 不要在同一个容器中堆叠超过四个 Pill，超过后应考虑切换到下拉选择器或组合框。

## 示例

### 默认胶囊

展示默认的 Pill 外观，包含基础文本标签和可选的变体。

### 激活状态

演示使用 variant="active" 高亮当前已选中的筛选器，区分当前与非当前筛选条件。

## 无障碍

- Pill 作为可交互按钮渲染时应有清晰的焦点指示，键盘用户可通过 Tab 键导航并回车激活。
- variant="active" 只改变视觉样式；调用方应同步传入 aria-pressed 或等效属性，让屏幕阅读器获知选中状态。
- 图标化的 Pill（仅有图标无文字）必须设置 aria-label，否则屏幕阅读器无法获知其用途。

## 受控行为

不适用: Pill 本身是无受控属性的展示型组件，选中状态由外部 onClick 回调管理；组件内部不维护独立的状态机。

## 响应式行为

- Pill 的内边距和字号在不同视口下保持一致的紧凑比例，窄屏上不溢出容器边界。
- Pill 只负责单个按钮；一排 Pill 的水平滚动或换行应由调用方容器实现。

## 主题行为

- Pill 的 active 变体与默认变体各自拥有独立的深色/浅色模式配色，跟随主题变量同步更新。
- 背景色和边框色均使用主题色板中的语义色值，确保品牌一致性。

## 实时示例

```tsx
import { Pill } from "@/components/ui/pill";
import { useState } from "react";

export function PillDefault21B111CBExample() {
  const [active, setActive] = useState("all");

  return (
    <div className="flex flex-wrap gap-2">
      {(["all", "ready", "error"] as const).map((value) => (
        <Pill
          key={value}
          variant={active === value ? "active" : "default"}
          aria-pressed={active === value}
          onClick={() => setActive(value)}
        >
          {value}
        </Pill>
      ))}
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Pill } from "@/components/ui/pill";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">胶囊标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 可点击、切换查询的过滤 chip 用 Pill；静态状态标签用 Badge。
- 仅当 pill 确实可以过滤时接 onClick；否则升级为 Badge。
- 传 variant="active" 高亮当前选中的过滤器，让视觉用户看到选择状态。
