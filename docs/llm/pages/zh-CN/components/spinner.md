# 加载指示器

> Route: `/components/spinner`

表示操作正在进行。

[返回组件](#/components)

# 加载指示器

Spinner

表示操作正在进行。

## 何时使用

- 对没有明确进度信息的单次进行中操作使用 Spinner，此时无法提供确定的百分比或时长。
- 在按钮上使用 loading 状态而非替换为 Spinner，这样忙碌的元素仍然可聚焦且可以向辅助技术广播忙闲状态。
- 为独立的 Spinner 配上文字标签或 aria-label，让加载状态被辅助技术正确播报。

## 何时不应使用

- 已知持续时间或百分比的场景请使用 Progress 组件，而非 Spinner。
- 不要在同一行中将 Loading Dots 与其他动画指示器混用——这会造成视觉冲突并浪费资源。
- 部署生命周期的中间状态（BUILDING / QUEUED）应由 Status Dot 处理，不要额外添加 Spinner。

## 示例

### 颜色变体

展示 Spinner 的不同颜色变体，适配不同的背景和内容语境。

## 无障碍

- 独立的 Spinner 必须搭配 aria-label 或文字说明，告知用户当前在等待什么操作完成。
- Spinner 本身是装饰性的，其含义应由相邻的文字或 aria-live 区域承担，避免空转的轮子被误认为可交互元素。
- 尊重 prefers-reduced-motion 设置，在低强度模式下降低旋转频率或停止动画。

## 受控行为

不适用: Spinner 是无交互的展示型组件，没有受控行为或状态转换；它的显隐由父组件的状态驱动，自身不接受受控属性。

## 响应式行为

- Spinner 的尺寸通过 props 显式指定，在任何视口下都保持一致的视觉密度和可读性。
- Spinner 不自动选择大小：调用方通过 size prop（sm/md/lg/xl/2xl/3xl/4xl，对应 12–56px）显式指定，以匹配所在 UI 层级的密度。

## 主题行为

- Spinner 的颜色通过主题变量管理，暗色/亮色模式下自动选用合适的色彩保证对比度。
- 可通过 props 传入自定义颜色值，与品牌色系或特定语义保持一致。

## 实时示例

Default:加载中

Red:加载中

Green:加载中

Blue:加载中

```tsx
import { Spinner } from "@/components/ui/spinner";

export function SpinnerColors88C45D9EExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Default:</span>
        <Spinner />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Red:</span>
        <Spinner className="text-red-700" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Green:</span>
        <Spinner className="text-green-700" />
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-copy-14 text-muted-foreground">Blue:</span>
        <Spinner className="text-blue-700" />
      </div>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Spinner } from "@/components/ui/spinner";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">加载器尺寸预设。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"md"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">iconProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ComponentProps&lt;typeof Loader2&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SVG 图标专用覆盖属性。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-hidden</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean | "true" | "false"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">已有其他元素播报加载状态时隐藏 status 语义。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 单个进行中的动作或没有已知进度可显示的确定性等待用 Spinner。
- 有已知时长或百分比时用 Progress 而非 spinner。
- 优先在动作控件本身上使用 loading 状态（如 Button loading），让忙碌元素保持可聚焦。
- 独立 Spinner 配文字标签或 aria-label，让加载状态被播报给辅助技术。
