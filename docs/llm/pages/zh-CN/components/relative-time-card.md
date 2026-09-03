# 相对时间卡片

> Route: `/components/relative-time-card`

显示带时间上下文的相对时间戳。

[返回组件](#/components)

# 相对时间卡片

Relative Time Card

显示带时间上下文的相对时间戳。

## 何时使用

- 近期活动展示时使用相对时间格式（如「3 分钟前」「2 小时前」），让用户快速理解事件的新鲜度。
- 在表格单元格中展示最近的操作记录时间，结合表格里其他行进行快速比较。
- 在 hover 或 focus 时暴露精确的时间戳，让需要具体日期的用户仍能获取完整信息。

## 何时不应使用

- 当事件距今较久，相对表述不再有助于用户比较时（超过一周），应切换为绝对日期格式。
- 不要将 Relative Time Card 用作重要的日期凭证或法律时间线——它不适合对时间精度有严格要求的场景。
- 不要在同一界面混合使用多种时间格式展示同一数据源——要么全部使用相对时间，要么全部转换为绝对时间。

## 示例

### 默认卡片

展示默认的相对时间卡片外观，自动计算并格式化时间差。

### 悬停精确时间

演示在 hover 时从相对表达式切换到精确时间戳的浮层气泡交互效果。

## 无障碍

- 默认触发器只显示相对时间，精确的 UTC 与本地时间位于 HoverCard 中；关键时间信息不能只依赖悬停发现。
- 需要键盘访问精确时间时，应传入可聚焦的 children，并在邻近文本中提供等价信息。
- 组件不会自动刷新或创建实时播报区域；时间推进时由父组件更新 date 并重新渲染。

## 受控行为

不适用: Relative Time Card 在渲染时格式化传入的 date，没有内部计时器或受控状态；需要刷新时由父组件重新渲染。

## 响应式行为

- 相对时间表达式在不同视口下保持一致的紧凑排版，窄屏上不会因空间限制而截断。
- 鼠标悬停显示的精确时间戳采用浮层气泡形式，不受 viewport 大小的影响。

## 主题行为

- 时间文本颜色和背景色跟随主题变量，确保在暗色和亮色模式下都有足够的可读对比度。
- 悬浮气泡的时间戳背景与主题一致，并应用适当的阴影以区别于底层内容。

## 实时示例

5分钟前

```tsx
import { RelativeTimeCard } from "@/components/ui/relative-time-card";

export function RelativeTimeCardDefault21B111CBExample() {
  return <RelativeTimeCard date={Date.now() - 5 * 60 * 1000} />;
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { RelativeTimeCard } from "@/components/ui/relative-time-card";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">date</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">相对当前时间格式化的 Unix 毫秒时间戳。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top" | "right" | "bottom" | "left"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">悬浮卡片的优先方位。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">locale</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">相对与绝对时间使用的 BCP 47 语言标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 近期活动用相对时间，并在用户悬停或聚焦时暴露精确时间戳。
- 相对措辞不再帮助用户比较事件时切换为绝对日期。
