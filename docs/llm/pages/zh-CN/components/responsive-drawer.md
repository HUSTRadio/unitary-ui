# 响应式抽屉

> Route: `/components/responsive-drawer`

一个抽屉承载手机贴底与桌面贴右两种形态，可选底部拖拽档位。

[返回组件](#/components)

# 响应式抽屉

Responsive Drawer

一个抽屉承载手机贴底与桌面贴右两种形态，可选底部拖拽档位。

## 何时使用

- 同一条信息架构要在手机与桌面同时成立时——例如「部署操作」在手机上是从底部弹出的动作面板，在桌面上是右侧的详情抽屉。
- 需要浮动面板语义（遮罩、焦点陷阱、Esc 与外点关闭）但又不想在应用层写断点分支时，开启 responsive 由组件决定形态。
- 需要底部多档位拖拽（先看半屏摘要、再拉到全高看详情）时，用 detents 表达档位，档位吸附沿用 BottomSheet 的交互语义。

## 何时不应使用

- 需要官方镜像行为时不要替换：官方 Drawer 的固定/自适应高度与仅受控 show/onDismiss 契约由文档固定，本组件不改变它。
- 侧栏形态不需要拖拽档位；给 right / left 传 detents 不会生效，属于误用。
- 整页内容都放不下、且不需要遮罩与焦点陷阱时，用普通页面布局或 Scroller，不要把全站导航塞进抽屉。

## 示例

### 默认右侧面板

Header 内置关闭按钮、Body 独立滚动、Footer 右侧对齐；关闭后焦点回到触发器。

### 响应式形态切换

响应式开启后：<640px 从底部滑入，≥640px 从右侧滑入，应用层无需分支。

### 底部多档位拖拽

placement="bottom" + detents=\[0.4, 0.8, 1\]：指示条跟手拖动、松手吸附最近档位，拖过最低档收起关闭。

## 无障碍

- 基于 Radix Dialog：打开时焦点移入面板、Tab 循环限制在面板内、Esc 与外点关闭、关闭后焦点返还到打开按钮。
- ResponsiveDrawerTitle / ResponsiveDrawerDescription 通过 Radix 的 aria-labelledby / aria-describedby 关联到面板，保证读屏能播报名称与说明。
- Header 内置的关闭按钮带可访问名称（无可见文本时用本地化的 Close），图标 aria-hidden，不单独承载语义。
- 底部形态的拖拽指示条是 role="slider"，带 aria-valuemin/valuemax/valuenow，键盘用户可用左右方向键或 Enter 循环切换档位。

## 受控行为

- 支持受控（open + onOpenChange）与非受控（defaultOpen）两种模式，与其他浮层组件一致。
- onDetentChange 回报吸附后的档位索引，便于上层记录「用户上次停留在哪个高度」；拖拽跟手阶段不回报，避免高频回调。

## 响应式行为

- responsive 开启时以 640px 为断点：以下使用底部几何（顶缘圆角、safe-area 内边距、可选档位），以上使用右侧面板几何（四周 8px 留白、圆角、细边框、柔阴影）。
- placement 固定方位时，左右面板在窄屏退化为 3/4 宽的全高面板，避免小屏上面板过窄。
- Footer 在移动端纵向倒序（主操作在上），≥640px 变为右对齐横排；Body 始终独立滚动，Header/Footer 保持吸顶吸底。

## 主题行为

- 面板使用 bg-background 与 border-border 语义 token，明暗双主题下与 Drawer / Sheet 同族外观。
- 阴影走 --material-shadow-menu token（dark 主题内层近白环由 token 覆盖），不使用浅色字面量。
- 进出场动画使用 --uni-motion-expansive（500ms）+ ease-snap；拖拽跟手阶段零过渡，prefers-reduced-motion 下全部降级。

## 实时示例

```tsx
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  ResponsiveDrawer,
  ResponsiveDrawerBody,
  ResponsiveDrawerClose,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerFooter,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
} from "@/components/ui/responsive-drawer";

export function ResponsiveDrawerDefault9F2C7A41Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <ResponsiveDrawer open={open} onOpenChange={setOpen}>
        <ResponsiveDrawerContent>
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>Deployment Actions</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>
              Choose what to do with the current deployment.
            </ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
          <ResponsiveDrawerBody>
            <p className="text-copy-14 text-muted-foreground">
              The panel slides in from the right on desktop, keeps its own scrollable body, and
              returns focus to the trigger when closed.
            </p>
          </ResponsiveDrawerBody>
          <ResponsiveDrawerFooter>
            <ResponsiveDrawerClose asChild>
              <Button typeName="button" type="secondary">
                Cancel
              </Button>
            </ResponsiveDrawerClose>
            <Button typeName="button" type="error" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </ResponsiveDrawerFooter>
        </ResponsiveDrawerContent>
      </ResponsiveDrawer>
    </>
  );
}
```

## 响应式

```tsx
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  ResponsiveDrawer,
  ResponsiveDrawerBody,
  ResponsiveDrawerClose,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerFooter,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
} from "@/components/ui/responsive-drawer";

export function ResponsiveDrawerResponsive4B8E1D6CExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <ResponsiveDrawer open={open} onOpenChange={setOpen} responsive>
        <ResponsiveDrawerContent>
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>Deployment Actions</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>
              Choose what to do with the current deployment.
            </ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
          <ResponsiveDrawerBody>
            <p className="text-copy-14 text-muted-foreground">
              With responsive enabled the panel uses the bottom geometry below 640px and the side
              panel above it, so one drawer covers phone and desktop without branching in app code.
            </p>
          </ResponsiveDrawerBody>
          <ResponsiveDrawerFooter>
            <ResponsiveDrawerClose asChild>
              <Button typeName="button" type="secondary">
                Cancel
              </Button>
            </ResponsiveDrawerClose>
            <Button typeName="button" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </ResponsiveDrawerFooter>
        </ResponsiveDrawerContent>
      </ResponsiveDrawer>
    </>
  );
}
```

## 档位

```tsx
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  ResponsiveDrawer,
  ResponsiveDrawerBody,
  ResponsiveDrawerClose,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerFooter,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
} from "@/components/ui/responsive-drawer";

export function ResponsiveDrawerDetents7A3F5E92Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <ResponsiveDrawer
        open={open}
        onOpenChange={setOpen}
        placement="bottom"
        detents={[0.4, 0.8, 1]}
      >
        <ResponsiveDrawerContent>
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>Deployment Actions</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>
              Choose what to do with the current deployment.
            </ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
          <ResponsiveDrawerBody>
            <p className="text-copy-14 text-muted-foreground">
              Drag the indicator to move between the 40%, 80%, and full-height detents; dragging
              below the lowest detent dismisses the drawer. The snap uses the project ease-snap
              curve, and drag tracking itself has no transition so the panel stays under your
              finger.
            </p>
          </ResponsiveDrawerBody>
          <ResponsiveDrawerFooter>
            <ResponsiveDrawerClose asChild>
              <Button typeName="button" type="secondary">
                Cancel
              </Button>
            </ResponsiveDrawerClose>
          </ResponsiveDrawerFooter>
        </ResponsiveDrawerContent>
      </ResponsiveDrawer>
    </>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import {
  ResponsiveDrawer,
  ResponsiveDrawerTrigger,
  ResponsiveDrawerContent,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
  ResponsiveDrawerDescription,
  ResponsiveDrawerBody,
  ResponsiveDrawerFooter,
  ResponsiveDrawerClose,
} from "@/components/ui/responsive-drawer";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控打开状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultOpen</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">非受控初始状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">抽屉打开或关闭时调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">responsive</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">640px 以下用底部形态、以上用右侧面板；优先于 placement。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">placement</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"bottom" | "right" | "left" | "top"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">面板固定贴靠的边。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"right"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">detents</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">底部形态的高度档位（占视口比例）；侧栏形态忽略。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">[0.5, 1]</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showIndicator</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"automatic" | boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">拖拽指示条策略；automatic 在多档位时渲染。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"automatic"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">gestures</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ resize?: boolean; expandUp?: boolean; collapseDown?: boolean }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">底部拖拽手势开关。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"sm" | "md" | "lg"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">侧栏面板宽度档位。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"md"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onDetentChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(index: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">面板吸附到档位后调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 同一条信息架构要跨手机与桌面时使用响应式抽屉；官方镜像的 Drawer / Sheet / BottomSheet 保留各自固定契约，不要互相替换。
- 开启 responsive 而不是在应用层写断点分支：640px 以下用底部形态，以上贴右并留 8px 边距。
- detents 与自动指示条只对底部形态生效；侧栏面板按设计不提供拖拽。
- 用内置 Header 承载标题/说明与关闭按钮，把滚动交给 Body，保证 Footer 始终可达。
