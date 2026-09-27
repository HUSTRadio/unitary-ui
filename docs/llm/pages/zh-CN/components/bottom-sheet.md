# 底部弹层

> Route: `/components/bottom-sheet`

以可拖拽高度档位展示移动端操作或辅助内容。

[返回组件](#/components)

# 底部弹层

bottom-sheet

以可拖拽高度档位展示移动端操作或辅助内容。

## 何时使用

- 移动端需要在不离开当前页面的前提下展示相关操作、筛选项或辅助详情。
- 内容需要在少量明确高度档位之间展开，且用户可以通过拖拽调整可见范围。

## 何时不应使用

- 需要阻断式确认或完整桌面表单时使用 Modal；Bottom Sheet 是移动端的上下文辅助层。
- 仅需从侧边进入、且不依赖垂直高度档位时使用 Sheet。

## 示例

### 受控多档弹层

使用 open、onOpenChange 与 detents 管理弹层，并在内容区提供明确的关闭操作。

## 无障碍

- 组件基于 Radix Dialog，打开后由对话框原语管理焦点范围，并支持 Escape 与遮罩点击关闭。
- 内容开头应提供清晰的可见标题和说明，主要操作不能只依赖拖拽手势。
- 多档位指示条使用垂直 slider 语义：ArrowUp / ArrowRight 增一档，ArrowDown / ArrowLeft 减一档，Home / End 跳到首尾；边界钳制而不循环。Enter / Space 与点击保持循环切档。
- prefers-reduced-motion: reduce 下会移除高度与进出场过渡。

## 受控行为

- 传入 open 时由外部完全控制开关状态；省略 open 时组件内部管理状态，两种模式都会调用 onOpenChange。
- 松开拖拽、点击循环或键盘调档都会以目标下标调用 onDetentChange；detent 受控时必须由调用方回灌，非受控时组件同步更新高度。向下拖过最低档会按 collapseDown 配置决定是否关闭。

## 响应式行为

- 默认贴合移动视口底边，用 detent × 100dvh 计算高度；传入已定位的 container 时面板与遮罩限定在容器内，档位按容器高度计算。桌面宽屏流程应改用 Modal 或 Sheet。
- 底部内边距包含 safe-area-inset-bottom，避免操作被设备安全区遮挡。

## 主题行为

- 面板使用背景与边框主题 token，遮罩保持半透明黑色；亮暗主题下无需传入单独配色。

## 实时示例

```tsx
import * as React from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";

export function BottomSheetDefault37A8EEC1Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <BottomSheet open={open} onOpenChange={setOpen} detents={[0.45, 0.8]}>
        <div className="space-y-4 p-6">
          <div>
            <h2 className="font-semibold">Deployment Actions</h2>
            <p className="text-sm text-muted-foreground">
              Choose what to do with the current deployment.
            </p>
          </div>
          <Button typeName="button" onClick={() => setOpen(false)}>
            Close Actions
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { BottomSheet } from "@/components/ui/bottom-sheet";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">container</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">面板与遮罩的可选定位容器；提供时档位按容器高度计算。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">detents</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">高度档位（占视口高度比例）；档位少于 2 个时不渲染指示条（HIG automatic）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">[0.5, 1]</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showIndicator</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"automatic" | boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">拖拽指示条显隐策略；automatic 仅在多档位时渲染。指示条是垂直 slider，支持方向键与 Home/End。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"automatic"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">gestures</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ resize?: boolean; expandUp?: boolean; collapseDown?: boolean }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">手势开关：拖拽调高 / 上拉越过最高档 / 低于最低档下拉关闭。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">全开</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控打开状态（不传则非受控）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">开关回调。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">detent</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控档位下标（对应 detents 数组；不传则非受控）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onDetentChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(index: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">拖拽、点击或键盘调档后以目标档位下标调用；受控模式须由调用方通过 detent 回灌。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">无可见标题时提供面板的可访问名称。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-labelledby</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">关联外部元素命名面板（如内容层渲染的标题所带的 id）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 移动端操作或辅助内容需要保留当前页面上下文时使用 Bottom Sheet。
- 只设置少量有意义的高度档位，并让初始档位足以展示弹层用途。
- 无需拖拽即可看见主要操作，并允许 Escape、遮罩点击或向下拖动关闭弹层。
- 阻断式桌面决策使用 Modal；不依赖垂直档位的边缘面板使用 Sheet。
- 分享目标网格或一次性操作列表使用 ActivityView——它基于本组件构建，固定单个 0.6 档位。
