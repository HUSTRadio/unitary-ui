# 局部浮层框架

> Route: `/components/sub-frame`

把浮层限定在页面中的某一块区域内，弹层与面板因此不会盖住整页。

[返回组件](#/components)

# 局部浮层框架

sub-frame

把浮层限定在页面中的某一块区域内，弹层与面板因此不会盖住整页。

## 何时使用

- App Shell、设备预览或文档示例卡这类「页面中的页面」需要在自身范围内弹出 BottomSheet 或 HamburgerMenu 时。
- 同一页面要并排演示多个互不干扰的浮层时。

## 何时不应使用

- 浮层本来就该覆盖整个视口时，直接渲染 BottomSheet 即可，不要外包一层 SubFrame。
- 只是需要滚动或裁剪内容时，普通 overflow 容器更直接。

## 示例

### 局部浮层

在框架内打开底部弹层，浮层不会离开框架。

## 无障碍

- SubFrame 只渲染一个 div，不引入任何语义；框架内的浮层仍各自负责焦点陷阱、Escape 关闭与焦点归还。

## 受控行为

不适用: SubFrame 没有内部状态；它只把自身元素通过上下文提供给浮层。

## 响应式行为

- 框架尺寸完全由调用方决定；浮层的档位比例与拖拽幅度改为按框架的 client 尺寸换算。

## 主题行为

- SubFrame 不设置视觉样式；颜色与材质由框架内的组件沿用语义 token 决定。

## 实时示例

This frame owns the overlay: the sheet opens inside it instead of covering the whole page.

```tsx
import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { SubFrame } from "@/components/ui/sub-frame";

export default function SubFrameExample() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-col gap-4">
      <SubFrame className="flex h-80 flex-col justify-end gap-3 rounded-xl border border-border bg-background p-5">
        <span className="text-sm text-muted-foreground">
          This frame owns the overlay: the sheet opens inside it instead of covering the whole page.
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-fit rounded-md border border-border px-3 py-2 text-sm text-foreground"
        >
          Open the sheet inside the frame
        </button>
        <BottomSheet open={open} onOpenChange={setOpen} detents={[0.6]}>
          <div className="flex flex-col gap-2 px-6 pt-2 pb-8">
            <h4 className="text-label-16 font-medium text-foreground">Inside the frame</h4>
            <p className="text-copy-14 text-muted-foreground">
              Drag or dismiss it; it never leaves the frame.
            </p>
          </div>
        </BottomSheet>
      </SubFrame>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { SubFrame } from "@/components/ui/sub-frame";
```

原生属性：`React.HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">框架内渲染的内容；内部浮层会挂载到它上面。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">clip</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">裁剪会溢出框架的浮层；浮层需要溢出时关闭。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr></tbody></table>

## 最佳实践

- App Shell、设备预览或文档示例卡需要把浮层留在自身范围内时，用 Sub Frame 包住这一块。
- 内部的 Bottom Sheet、Expand Panel 与 Hamburger Menu 会自动继承框架，不要再手写 container ref。
- 确实该挂在 document.body 上的个别浮层，显式传 container={null}。
- Sub Frame 的作用域只是浮层；只需要滚动或裁剪时，普通 overflow 容器就够。
