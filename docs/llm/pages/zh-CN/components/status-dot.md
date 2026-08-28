# 状态圆点

> Route: `/components/status-dot`

显示部署状态指示器。

[返回组件](#/components)

# 状态圆点

Status Dot

显示部署状态指示器。

## 何时使用

-   展示部署生命周期状态（QUEUED、BUILDING、READY、ERROR、CANCELED、DELETED）。
-   在表格行、列表卡片或命令面板中与文本状态标签并列使用。

## 何时不应使用

-   非部署类的状态标记应使用 Badge（如 Workflow run、Queue message）。
-   当文本已经清晰命名了状态时，不需要再添加额外的状态圆点造成重复。

## 示例

### 默认状态圆点

不带额外文字的默认状态圆点渲染效果。

### 带标签的状态圆点

状态圆点旁附带可读文本标签，提供双重信息通道。

## 无障碍

-   当状态圆点旁边已有文本命名状态时，标记为 aria-hidden 避免屏幕阅读器重复播报。
-   BUILDING / QUEUED 状态的动画圆点应配合 prefers-reduced-motion 尊重用户的无障碍偏好。

## 受控行为

-   通过 value prop 传入当前部署状态字符串；状态变更时圆点的颜色和动画会响应更新。

## 响应式行为

不适用: 状态圆点是纯装饰性微交互组件，不涉及响应式布局调整。

## 主题行为

-   状态圆点的颜色映射与主题联动：绿色表示就绪、红色表示错误、琥珀色表示警告、蓝色表示构建中等。

## 实时示例

```tsx
import { StatusDot } from "@/components/ui/status-dot";

<div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
  <StatusDot state="QUEUED" />
  <StatusDot state="BUILDING" />
  <StatusDot state="ERROR" />
  <StatusDot state="READY" />
  <StatusDot state="CANCELED" />
</div>
```

排队中构建中错误就绪已取消

```tsx
import { StatusDot } from "@/components/ui/status-dot";

<div className="flex flex-col items-stretch justify-start gap-6 flex-initial">
  <StatusDot label state="QUEUED" />
  <StatusDot label state="BUILDING" />
  <StatusDot label state="ERROR" />
  <StatusDot label state="READY" />
  <StatusDot label state="CANCELED" />
</div>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { StatusDot } from "@/components/ui/status-dot"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">state</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">StatusDotState</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">圆点表示的状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   仅对部署生命周期状态用 Status Dot：QUEUED | BUILDING | READY | ERROR | CANCELED | DELETED。
-   非部署状态（Workflow 运行、Queue 消息、Sandbox、Cron 作业）用规范状态词汇的 Badge，而不是挪用圆点。
-   BUILDING 或 QUEUED 时圆点动画，部署到达终态后静止。不要在旁边另加 spinner。
-   不要在轮询 tick 上让颜色闪遍每个过渡状态；仅当 readyState 变化时更新。
-   当圆点内联在已点名状态的文字旁时标记 aria-hidden 装饰性，避免屏幕阅读器重复播报。
