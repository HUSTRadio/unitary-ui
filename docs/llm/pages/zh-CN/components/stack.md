# 堆叠

> Route: `/components/stack`

按单一方向堆叠子元素并统一间距档的 flex 预设容器。

[返回组件](#/components)

# 堆叠

stack

按单一方向堆叠子元素并统一间距档的 flex 预设容器。

## 何时使用

- 需要把子元素按单一方向排列并统一间距时。
- 希望间距来自设计系统的档位而非临时数值时。

## 何时不应使用

- 需要栅格、列宽或不规则排布——用 Grid。
- 需要滚动、吸附或虚拟列表——用 Scroller。

## 示例

### 默认堆叠

纵向堆叠两组行：一组居中对齐，一组两端对齐。

## 无障碍

不适用: 纯布局容器：不改变内容的语义与可访问性树。

## 受控行为

不适用: 无状态：方向、间距与对齐均由 props 直接决定。

## 响应式行为

不适用: 方向固定，不随断点变化；需要响应式时由调用方传入 className 或断点类。

## 主题行为

不适用: 只输出 flex 与间距，不消费颜色 token，因此不随主题变化。

## 实时示例

Row group, centered

LeftRight

```tsx
import { Stack } from "@/components/ui/layout";

/**
 * Stack —— 方向 + 间距堆叠：语义化的 flex 预设，统一间距档，避免随机 gap 值。
 */
export function StackDefault7E1B84D3Example() {
  return (
    <Stack direction="column" gap="md" className="w-full">
      <Stack direction="row" gap="sm" align="center">
        <span aria-hidden="true" className="size-8 rounded-md bg-gray-alpha-400" />
        <span className="text-copy-13 text-gray-1000">Row group, centered</span>
      </Stack>
      <Stack direction="row" gap="sm" justify="between">
        <span className="text-copy-13 text-gray-1000">Left</span>
        <span className="text-copy-13 text-gray-900">Right</span>
      </Stack>
    </Stack>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Stack } from "@/components/ui/stack";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">direction</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"row" | "column"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">堆叠方向。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"column"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">gap</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">LayoutSpacing</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">子项之间的间距档。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"md"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">align</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"start" | "center" | "end" | "stretch" | "baseline"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">交叉轴对齐。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">justify</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"start" | "center" | "end" | "between"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">主轴分布。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">wrap</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">允许子项换行。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
