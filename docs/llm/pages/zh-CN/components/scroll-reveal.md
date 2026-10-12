# 滚动显现

> Route: `/components/scroll-reveal`

Progressive section reveal with native scrolling and reduced-motion fallback.

[返回组件](#/components)

# 滚动显现

scroll-reveal

Progressive section reveal with native scrolling and reduced-motion fallback.

## 何时使用

- 保持原生滚动的区块显现；缺少观察器或减少动效时直接显示。

## 何时不应使用

- 不要用来劫持全站滚轮或触摸滚动。

## 示例

### 基础用法

保持原生滚动的区块显现；缺少观察器或减少动效时直接显示。

## 无障碍

- 内容在服务端和无观察器环境中可见；减少动效直接呈现，键盘焦点进入内容时取消隐藏。

## 受控行为

- root/target 明确指定滚动 owner；省略使用文档。

## 响应式行为

- 不修改页面布局或滚动惯性；由调用方决定区块和控件的摆放。

## 主题行为

- 使用共享语义颜色和动效 token；双主题保持同一交互契约。

## 实时示例

Scroll this container to reveal the next section.

Revealed content stays visible.

```tsx
import { useState } from "react";
import { ScrollReveal } from "@hustradio/unitary-ui";

export default function ScrollRevealExample() {
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setRoot} className="h-60 w-full overflow-y-auto border border-gray-alpha-400 p-4">
      <p className="min-h-64 text-copy-14">Scroll this container to reveal the next section.</p>
      {root ? (
        <ScrollReveal root={root}>
          <p className="rounded-md bg-gray-alpha-100 p-8">Revealed content stays visible.</p>
        </ScrollReveal>
      ) : null}
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { ScrollReveal } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">root</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">相交观察视口；null 观察文档视口，其余为 div 原生属性。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">null</td></tr></tbody></table>
