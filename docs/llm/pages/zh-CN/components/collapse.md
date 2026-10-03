# 折叠面板

> Route: `/components/collapse`

按标题展开或收起补充内容，如常见问题和高级设置。

[返回组件](#/components)

# 折叠面板

collapse

按标题展开或收起补充内容，如常见问题和高级设置。

## 何时使用

- 可选的、高级的或重复出现的内容——常见问题解答、高级设置、请求负载预览——大多数用户在首次访问时会跳过这些内容。
- 需要在同一个页面中容纳大量信息，但又不想一开始就淹没主要内容，可以使用 Collapse 进行按需展开。

## 何时不应使用

- 当内容对每个用户都至关重要时；应使用页面章节和普通标题，把核心内容折叠起来等于隐藏了页面的主旨。
- 不要在封闭的 Collapse 内部放置主要的危险操作；用户需要两次点击才能到达警告信息，降低了安全性。

## 示例

### 默认折叠面板

初始状态为关闭的 Collapse，标题采用 Title Case 命名主题而非动作。

### 展开状态的折叠面板

演示 Collapse 打开后的状态及内容区域的平滑过渡动画。

### 允许多个面板同时展开的折叠面板

multiple 模式允许同时展开多个面板，适合常见问题列表。

### 紧凑尺寸的折叠面板

小尺寸变体，适用于密集布局或侧边栏等空间受限的场景。

### 加号图标的折叠面板

icon="plus" 时指示图标展开逆时针旋转 45° 变成 ×（高频微反馈档位），适合 FAQ 这类「展开更多」的语义。

### 禁用状态的折叠面板

disabled 时整行（文本与图标）降不透明度并切换 not-allowed 光标，aria-disabled 与阻止展开的语义保持不变。

## 无障碍

- 触发器是 <button> 元素，配有 aria-expanded 属性在切换时翻转，以及 aria-controls 指向内容区域的 ID。
- 关闭状态下面板内容仍然存在于 DOM 中（通过 hidden 或 visibility 隐藏），这样搜索和查找仍能命中。

## 受控行为

- Collapse 支持通过 open 受控模式和 onOpenChange 回调实现外部状态管理，开发者可以在父组件中控制面板是否展开。
- 未受控使用时，内部状态自行维护开/关切换；推荐在有多个 Collapse 时使用受控模式以精确管理展开集合。

## 响应式行为

- 折叠面板在小视口上自动增大触控目标尺寸，确保触摸设备的可操作性。
- 多面板模式在不同屏幕宽度下保持一致的多选行为，不会因布局变化而改变交互逻辑。

## 主题行为

- 展开/收起的过渡动画速度、箭头方向图标等视觉细节随设计系统令牌变量一致。
- 分隔线和边框颜色在不同主题下自动适配。

## 实时示例

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseDefault37A8EEC1Example() {
  return (
    <>
      <Collapse className="border-b">
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question A</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </CollapseContent>
      </Collapse>
      <Collapse className="border-b">
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question B</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur.
          </p>
        </CollapseContent>
      </Collapse>
    </>
  );
}
```

## 加号

Plus 图标展开时逆时针旋转 45° 变成 ×，收起时回到加号，适合 FAQ 这类「展开更多」的语义。

旋转走高频微反馈档位（--uni-motion-feedback），与悬停、颜色变化保持同一节奏。

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapsePlus9C4E1A7BExample() {
  return (
    <>
      <Collapse icon="plus" className="border-b">
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question A</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            Plus 图标展开时逆时针旋转 45° 变成 ×，收起时回到加号，适合 FAQ 这类「展开更多」的语义。
          </p>
        </CollapseContent>
      </Collapse>
      <Collapse icon="plus" className="border-b" defaultOpen>
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question B</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            旋转走高频微反馈档位（--uni-motion-feedback），与悬停、颜色变化保持同一节奏。
          </p>
        </CollapseContent>
      </Collapse>
    </>
  );
}
```

## 禁用

正常状态：触发器可聚焦、可点击，键盘聚焦时显示内嵌焦点环。

不可达内容：禁用态触发器整体降不透明度并切换为 not-allowed 光标，点击不会展开。

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseDisabled2F7D5B6EExample() {
  return (
    <>
      <Collapse className="border-b">
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question A</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            正常状态：触发器可聚焦、可点击，键盘聚焦时显示内嵌焦点环。
          </p>
        </CollapseContent>
      </Collapse>
      <Collapse className="border-b" disabled>
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question B</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            不可达内容：禁用态触发器整体降不透明度并切换为 not-allowed 光标，点击不会展开。
          </p>
        </CollapseContent>
      </Collapse>
    </>
  );
}
```

## 展开

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseExpandedE72D5D8DExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Collapse size="small" className="rounded-[8px] border border-gray-alpha-400 p-4">
        <CollapseTrigger className="text-label-14 text-foreground">Question A</CollapseTrigger>
        <CollapseContent className="pt-2 text-copy-14 text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </CollapseContent>
      </Collapse>
      <Collapse size="small" defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
        <CollapseTrigger className="text-label-14 text-foreground">Question B</CollapseTrigger>
        <CollapseContent className="pt-2 text-copy-14 text-muted-foreground">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </CollapseContent>
      </Collapse>
    </div>
  );
}
```

## 多项

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseMultiple14070FDBExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Collapse size="small" defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
        <CollapseTrigger className="text-label-14 text-foreground">Question A</CollapseTrigger>
        <CollapseContent className="pt-2 text-copy-14 text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </CollapseContent>
      </Collapse>
      <Collapse size="small" defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
        <CollapseTrigger className="text-label-14 text-foreground">Question B</CollapseTrigger>
        <CollapseContent className="pt-2 text-copy-14 text-muted-foreground">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </CollapseContent>
      </Collapse>
    </div>
  );
}
```

## 小

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

```tsx
import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseSmall5263293FExample() {
  return (
    <Collapse
      size="small"
      className="w-full max-w-sm rounded-[8px] border border-gray-alpha-400 p-3"
    >
      <CollapseTrigger className="text-label-13 text-foreground">Question A</CollapseTrigger>
      <CollapseContent className="pt-1.5 text-copy-13 text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </CollapseContent>
    </Collapse>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Collapse, CollapseTrigger, CollapseContent } from "@/components/ui/collapse";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控展开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultOpen</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">非受控初始状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">展开状态变化时调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default" | "small" | "bare"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">触发器内边距档位。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"chevron" | "plus"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">指示图标；plus 展开时旋转 45° 变 ×。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"chevron"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">indicatorAlign</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"inline" | "end"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">指示图标位置：inline 紧跟标题，end 推到行尾右对齐。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"end"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">as</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ElementType</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">触发元素类型。非按钮元素不使用按钮样式，并通过 role=button 支持 Enter/Space 操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">阻止展开并整行变淡。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 对大多数用户多数访问都会跳过的可选、高级或重复内容使用 Collapse（FAQ、高级设置、请求体预览）。
- 顶层结构且每个用户都会读的内容用带常规标题的页面分区；折叠主要内容会隐藏页面主题。
- 默认关闭，除非首次访问者必须读到内容才能操作。
- 展开/收起要有动画；生硬切换会让页面像瞬移。
- Collapse 嵌套不超过一层；两层隐藏太多并破坏键盘 Tab 路径。
- 标题首字母大写并命名主题而非动作（Advanced Settings，而非 Show Advanced Settings）。
- 不要把主破坏性动作放进折叠的 Collapse 里；用户要点两次才能看到警告。
- 触发器是带 aria-expanded 的 button，切换时翻转，并用 aria-controls 指向面板 id。
- 关闭时也要在 DOM 中渲染面板内容（用 hidden 或 visibility），让搜索和页内查找仍能命中；仅在内容昂贵时惰性渲染。
