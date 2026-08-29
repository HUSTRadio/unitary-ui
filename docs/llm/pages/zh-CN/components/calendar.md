# 日历

> Route: `/components/calendar`

显示可供用户选择日期的月历。

[返回组件](#/components)

# 日历

Calendar

显示可供用户选择日期的月历。

## 何时使用

- 分析报表的时间范围选择，以及任何需要看到星期与月份上下文的日期挑选场景。
- 用 min/max 限定在数据保留窗口内，防止用户选到范围外的日期。
- 默认使用用户的 locale 与时区；不要为太平洋时区的用户静默渲染 UTC。

## 何时不应使用

- 只需要单个具体时刻且不需要月历上下文时，用更轻量的时间输入组件。
- 不要把 Calendar 当作纯展示月历嵌入内容流——它的语义是选择器。

## 示例

### 默认日历

标准单月日历选择器。

### 快捷预设

为常用范围提供预设项，减少重复选择成本。

### 最小/最大范围

用 min 与 max 把可选日期约束在数据窗口内。

### 固定时区

把日历固定到指定时区展示，避免跨时区歧义。

## 无障碍

- 日期格子必须可通过键盘遍历（方向键移动、Enter 确认），焦点顺序与视觉顺序一致。
- 已选与今日状态不能只靠颜色传达，需附带可被屏幕阅读器识别的语义。

## 受控行为

- 选中日期由父组件受控，onChange 通知选择结果。
- 月份翻页由组件内部视图状态管理，不影响受控的选中值。

## 响应式行为

- 提供水平布局、紧凑与堆叠等版式，适配不同容器宽度。
- 小视口下优先使用 compact 版式减少垂直占用。

## 主题行为

- 今日高亮、选中态与禁用日颜色均跟随主题变量。
- 暗色模式下选中日期保持足够的对比度。

## 实时示例

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" />;
```

## 横向布局

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" horizontalLayout />;
```

## 尺寸

small

组合框菜单

组合框菜单

组合框菜单

default / medium

组合框菜单

组合框菜单

组合框菜单

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" size="small" />
<Calendar label="Select Date Range" />
```

## 预设范围

组合框菜单

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  showCombobox
  comboboxFirst
  comboboxFull
  comboboxWide
  comboboxLabel="Combobox Menu"
  comboboxPlaceholder="Select Period"
  presets={{
    "last-7-days": {
      text: "Last 7 Days",
      start: new Date(2026, 7, 14),
      end: new Date(2026, 7, 21),
    },
  }}
/>;
```

## 紧凑布局

组合框菜单

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  compact
  comboboxLabel="Combobox Menu"
  presets={{
    "last-7-days": {
      text: "Last 7 Days",
      start: new Date(2026, 7, 14),
      end: new Date(2026, 7, 21),
    },
  }}
/>;
```

## 堆叠布局

组合框菜单

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  stacked
  comboboxLabel="Combobox Menu"
  comboboxPlaceholder="Select Period"
  presets={{
    "last-7-days": {
      text: "Last 7 Days",
      start: new Date(2026, 7, 14),
      end: new Date(2026, 7, 21),
    },
  }}
/>;
```

## 默认预设

组合框菜单

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  showCombobox
  comboboxFirst
  comboboxFull
  comboboxWide
  comboboxLabel="Combobox Menu"
  comboboxPlaceholder="Select Period"
  presets={{
    "last-7-days": {
      text: "Last 7 Days",
      start: new Date(2026, 7, 14),
      end: new Date(2026, 7, 21),
    },
  }}
  presetIndex={0}
/>;
```

## 日期边界

```tsx
import { Calendar } from "@/components/ui/calendar";

const now = new Date();
const minDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
const maxDate = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

<Calendar label="Select Date Range" minValue={minDate} maxValue={maxDate} />;
```

## 固定时区

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" pinnedTimezone="America/Los_Angeles" />;
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Calendar } from "@/components/ui/calendar";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(range: CalendarDateRange) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">有效日期范围选择变化后调用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">presets</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, CalendarPreset&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可选预设选择器的命名日期范围。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">horizontalLayout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">在宽屏上把范围输入框放在月历旁。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## 最佳实践

- 分析类日期范围和任何需要星期、月份上下文的选择器选 Calendar。
- 把 min 和 max 设为数据窗口，避免用户选到保留期之外。
- 默认使用用户的语言环境与时区；绝不为美西用户静默渲染 UTC。
