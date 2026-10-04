# 安全区

> Route: `/layout/safe-area`

用内边距避开刘海、圆角和系统栏，并保留指定的最小间距。

# 安全区

safe-area

用内边距避开刘海、圆角和系统栏，并保留指定的最小间距。

## 何时使用

- 内容需要避开圆角、刘海或系统栏时。
- 需要为页面四周统一最小内边距时。

## 何时不应使用

- 需要栅格或多列布局——用 Grid。
- 需要滚动容器或吸附行为——用 Scroller。

## 示例

### 默认安全区

上下两边应用安全区边距，内容不被系统栏遮挡。

## 无障碍

不适用: 纯布局容器：不含交互与 ARIA 角色，可访问性由内部内容决定。

## 受控行为

不适用: 无状态：只输出内边距，不接收也不持有任何状态。

## 响应式行为

- 内边距与设备安全区取较大值，设备旋转或系统栏变化时自动跟随。
- 可按边启用：只给需要的边（如仅上下）应用安全区。
- \`style\` 之后展开、优先级更高：传入 \`padding\` 或 \`paddingTop\` 等会覆盖组件计算的安全区内边距（两者不合并）。需要保留安全区时不要用 style 覆盖内边距。

## 主题行为

不适用: 只输出内边距，不使用颜色变量，因此不随主题变化。

## 实时示例

Content stays clear of rounded corners, notches, and system bars.

```tsx
import { SafeArea } from "@/components/ui/layout";

/**
 * SafeArea —— 安全区边距容器：内边距取「间距档」与设备安全区 env() 的较大值，
 * 内容因此不会被圆角、刘海或系统栏遮挡。
 */
export function SafeAreaDefault2C9F5A41Example() {
  return (
    <SafeArea
      edges={["top", "bottom"]}
      padding="md"
      className="w-full rounded-lg bg-gray-alpha-100"
    >
      <div className="rounded-md bg-background p-3 text-copy-13 text-gray-1000">
        Content stays clear of rounded corners, notches, and system bars.
      </div>
    </SafeArea>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { SafeArea } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">edges</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SafeAreaEdge | readonly SafeAreaEdge[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">应用安全区边距的边；all 表示四边。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"all"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">padding</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">LayoutSpacing</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">作为最小内边距的间距档，与 env(safe-area-inset-*) 取较大值。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"md"</td></tr></tbody></table>
