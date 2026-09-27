# 工具提示

> Route: `/components/tooltip`

在悬停或聚焦时显示的浮动标签。

[返回组件](#/components)

# 工具提示

tooltip

在悬停或聚焦时显示的浮动标签。

## 何时使用

- 需要解释某事物的存在原因，而非事物本身是什么：可见标签命名该对象，工具提示补充限制条件、作用范围或数量上限。
- 图标按钮等小触发器需要额外的语境说明时，通过 Tooltip 在不扩展 UI 的前提下提供解释。

## 何时不应使用

- 不要将带有标签的 Input 包裹在 Tooltip 中——触发器落在 <label> 上，工具提示文本会成为屏幕阅读器的第二个不可见标签。应将帮助内容放在兄弟图标按钮上。
- 不要在工具提示中包含主要操作；触屏用户无法触及悬停显示的控件。主要操作应在可见 UI 中。

## 示例

### 无延迟显示

展示如何通过 delay={false} 去除默认 400ms 入场延迟，使 Tooltip 立即响应悬停。

### 对齐方式

演示 Tooltip 相对于触发器的位置排列（Box align），确保提示在视口内完整可见。

### 自定义内容

在 Tooltip 中渲染富文本或其他 React 组件，突破纯文本的限制。

## 无障碍

- Tooltip 在悬停和键盘焦点时打开；默认入场延迟为 400ms，可通过 delay={false} 取消或传入数字覆盖。
- Escape 键关闭 Tooltip 并将焦点返回到触发器；仅图标的触发器需配备命名操作的 aria-label。

## 受控行为

不适用: Tooltip 由 hover 和 focus 触发，当前封装不暴露 open/onOpenChange；可通过 children 传入自定义触发元素。

## 响应式行为

不适用: Tooltip 的弹出位置和尺寸不依赖视口断点；它始终围绕触发器定位并在超出视口边界时自动翻转方向。

## 主题行为

- Tooltip 的背景和文字颜色跟随全局主题，支持深色/浅色模式切换；高亮类型可通过 type prop 覆盖。

## 实时示例

Top

Bottom

Left

Right

```tsx
import { Tooltip } from "@/components/ui/tooltip";

export function TooltipNoDelay1EEF43B1Example() {
  return (
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip delay={false} text="The Evil Rabbit Jumped over the Fence">
          <span>Top</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip delay={false} position="bottom" text="The Evil Rabbit Jumped over the Fence">
          <span>Bottom</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip delay={false} position="left" text="The Evil Rabbit Jumped over the Fence">
          <span>Left</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip delay={false} position="right" text="The Evil Rabbit Jumped over the Fence">
          <span>Right</span>
        </Tooltip>
      </div>
    </div>
  );
}
```

## 盒模型对齐

Bottom/Left

Bottom/Center

Bottom/Right

Left/Left

Left/Center

Left/Right

Right/Left

Right/Center

Right/Right

```tsx
import { Tooltip } from "@/components/ui/tooltip";

export function TooltipBoxAlign42ACE5E0Example() {
  return (
    <>
      <div className="flex w-full flex-row flex-wrap">
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <Tooltip boxAlign="left" position="bottom" text="The Evil Rabbit Jumped over the Fence">
            <span>Bottom/Left</span>
          </Tooltip>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
            <span>Bottom/Center</span>
          </Tooltip>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <Tooltip boxAlign="right" position="bottom" text="The Evil Rabbit Jumped over the Fence">
            <span>Bottom/Right</span>
          </Tooltip>
        </div>
      </div>
      <div className="flex w-full flex-row flex-wrap">
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <Tooltip boxAlign="left" position="left" text="The Evil Rabbit Jumped over the Fence">
            <span>Left/Left</span>
          </Tooltip>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
            <span>Left/Center</span>
          </Tooltip>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <Tooltip boxAlign="right" position="left" text="The Evil Rabbit Jumped over the Fence">
            <span>Left/Right</span>
          </Tooltip>
        </div>
      </div>
      <div className="flex w-full flex-row flex-wrap">
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <Tooltip boxAlign="left" position="right" text="The Evil Rabbit Jumped over the Fence">
            <span>Right/Left</span>
          </Tooltip>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
            <span>Right/Center</span>
          </Tooltip>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center py-2">
          <Tooltip boxAlign="right" position="right" text="The Evil Rabbit Jumped over the Fence">
            <span>Right/Right</span>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
```

## 自定义内容

Top

Bottom

Left

Right

```tsx
import { Tooltip } from "@/components/ui/tooltip";

export function TooltipCustomContent61146064Example() {
  return (
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip
          text={
            <>
              The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
            </>
          }
        >
          <span>Top</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip
          position="bottom"
          text={
            <>
              The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
            </>
          }
        >
          <span>Bottom</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip
          position="left"
          text={
            <>
              The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
            </>
          }
        >
          <span>Left</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip
          position="right"
          text={
            <>
              The <b>Evil Rabbit</b> Jumped over the <i>Fence</i>.
            </>
          }
        >
          <span>Right</span>
        </Tooltip>
      </div>
    </div>
  );
}
```

## 自定义类型

Top

Bottom

Left

Right

```tsx
import { Tooltip } from "@/components/ui/tooltip";

export function TooltipCustomType2E67D6C7Example() {
  return (
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip text="The Evil Rabbit Jumped over the Fence" type="success">
          <span>Top</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence" type="error">
          <span>Bottom</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence" type="warning">
          <span>Left</span>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence" type="violet">
          <span>Right</span>
        </Tooltip>
      </div>
    </div>
  );
}
```

## 组件

LEFT

加载中

Shortcut

```tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/keyboard-input";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";

export function TooltipComponentsA150CE22Example() {
  return (
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="bottom" text="The Evil Rabbit Jumped over the Fence">
          <Button size="small" typeName="button">
            Bottom
          </Button>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="left" text="The Evil Rabbit Jumped over the Fence">
          <Badge size="sm">LEFT</Badge>
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip position="right" text="The Evil Rabbit Jumped over the Fence">
          <Spinner />
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip
          text={
            /* 键帽用 small 档（20px/12px）：tooltip 正文 13px，默认 24px 键帽比例失衡；
               flex + gap-1.5 提供受控间距，ml-0 中和 Kbd 内联流的 ml-0.5，避免双重间隙。 */
            <span className="inline-flex items-center gap-1.5">
              Search
              <Kbd small className="ml-0">
                /
              </Kbd>
            </span>
          }
        >
          <span>Shortcut</span>
        </Tooltip>
      </div>
    </div>
  );
}
```

## 其他

No tip indicator

No center text

```tsx
import { Tooltip } from "@/components/ui/tooltip";

export function TooltipOtherF97E9DA0Example() {
  return (
    <div className="flex w-full flex-row flex-wrap">
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip text="The Evil Rabbit Jumped over the Fence" tip={false}>
          No tip indicator
        </Tooltip>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-2">
        <Tooltip center={false} text="The Evil Rabbit Jumped over the Fence multiple times.">
          No center text
        </Tooltip>
      </div>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Tooltip } from "@/components/ui/tooltip";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">提示触发器。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">text</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">补充说明。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">position</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top" | "bottom" | "left" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">优先放置方向。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">boxAlign</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"left" | "center" | "right"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">提示框对齐方式。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"center"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">delay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean | number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">是否延迟打开，或自定义毫秒延迟。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">tip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示箭头。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">center</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">居中提示文字。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">TooltipType</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">语义提示颜色。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr></tbody></table>

## 最佳实践

- 用 Tooltip 解释事物为何存在，而非它是什么。可见标签命名事物；tooltip 补充约束、范围或限制。
- Tooltip 在悬停与键盘聚焦时打开。默认进入延迟为 400ms；delay={false} 可取消，数字值可覆盖。
- 不要用 Tooltip 包裹带标签的 Input。触发器落在 <label> 而非字段上，tooltip 文本成为屏幕阅读器的第二个隐形标签。把帮助放在兄弟图标按钮上。
- 把主动作留在 Tooltip 之外；触屏用户够不到悬停揭示的控件。
- 文本是一句或短语。句首大写；单一短语无句号。
- 纯图标触发器需要命名动作的 aria-label；Tooltip 正文补充上下文，不替代标签。
- 跳过复述可见标签的 tooltip（如 Rate Limit 按钮上的 text="Rate Limit"）；只会重复而不会补充。
- Escape 关闭 tooltip 并把焦点还给触发器。
