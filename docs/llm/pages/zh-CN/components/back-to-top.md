# 返回顶部

> Route: `/components/back-to-top`

Return to the top of a document or explicit scroll container.

[返回组件](#/components)

# 返回顶部

back-to-top

Return to the top of a document or explicit scroll container.

## 何时使用

- 根据绝对滚动位置显示返回顶部控件，支持文档与明确的滚动容器。

## 何时不应使用

- 不要用来劫持全站滚轮或触摸滚动。

## 示例

### 基础用法

根据绝对滚动位置显示返回顶部控件，支持文档与明确的滚动容器。

## 无障碍

- 提供可访问名称。可指定可聚焦的 focusTarget，减少动效使用立即滚动；onClick preventDefault 可取消默认操作。

## 受控行为

- root/target 明确指定滚动 owner；省略使用文档。

## 响应式行为

- 不修改页面布局或滚动惯性；由调用方决定区块和控件的摆放。

## 主题行为

- 使用共享语义颜色和动效 token；双主题保持同一交互契约。

## 实时示例

### Section start

Scroll down to reveal the return control.

```tsx
import { useRef, useState } from "react";
import { BackToTop } from "@/components/ui/back-to-top";

export default function BackToTopExample() {
  const [target, setTarget] = useState<HTMLDivElement | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  return (
    <div className="w-full">
      <div ref={setTarget} className="h-60 overflow-y-auto border border-gray-alpha-400 p-4">
        <h3 ref={heading} tabIndex={-1} className="text-heading-16">
          Section start
        </h3>
        <p className="min-h-[40rem] text-copy-14">Scroll down to reveal the return control.</p>
      </div>
      {target ? (
        <BackToTop target={target} focusTarget={heading.current} threshold={120}>
          Back to top
        </BackToTop>
      ) : null}
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { BackToTop } from "@/components/ui/back-to-top";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">target</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">滚动 owner；省略时使用文档。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">focusTarget</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">滚动前的可选焦点目标，需要时设置 tabIndex=-1。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">threshold</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示控件的绝对滚动距离，单位 px。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">640</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">提供本地化可见文字或为图标按钮设置 aria-label。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
