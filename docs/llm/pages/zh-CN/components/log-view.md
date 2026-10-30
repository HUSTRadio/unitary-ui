# 日志视图

> Route: `/components/log-view`

展示调用方传入的日志：按级别过滤、复制与导出，并在用户上滚前持续跟随最新一行。

[返回组件](#/components)

# 日志视图

log-view

展示调用方传入的日志：按级别过滤、复制与导出，并在用户上滚前持续跟随最新一行。

## 何时使用

- 构建、部署或任务输出需要逐行查看，并希望按级别快速收窄。
- 需要把当前可见日志复制走或导出成文本文件交给别人。
- 日志总量可控（数百行级），首版不做虚拟化。

## 何时不应使用

- 结构化事件、可排序可筛选的表格用 DataTable。
- 单个任务的进度与状态用 Task；构建状态徽标用 StatusDot。
- 需要虚拟滚动的十万行级日志，等待后续专项。

## 示例

### 跟随与暂停

追加日志时自动贴底；手动上滚后暂停跟随并出现「跳到最新」，过滤按最低级别生效。

## 无障碍

不适用: 本轮不含无障碍增强：LogView 不声明日志区域的 ARIA 角色与 aria-live 播报，按级别过滤与跟随状态以可见控件与 data-\* 表达，播报策略由调用方决定。

## 受控行为

- entries 完全受控：组件不排序、不合并、不追加，也不发起请求。
- level 支持受控与非受控：传 level 时以它为准并通过 onLevelChange 报告；不传时用 defaultLevel 与内部状态。
- 复制与导出都在可见行上执行；提供 onExport 时由调用方接手文本，否则下载文本文件。
- 跟随由滚动位置推导：贴底即跟随，上滚即暂停，点击「跳到最新」恢复。

## 响应式行为

- 头部标题与操作区使用 flex-wrap，窄屏下操作换行而不挤压标题。
- 滚动视口高度固定（默认 320px，可传数字或 CSS 长度），行内容在视口内滚动。
- 消息列使用 whitespace-pre-wrap + break-words：长行换行而非截断，也保留原始缩进。

## 主题行为

- 视口使用 background-200 与 gray-alpha-300 边线，级别颜色复用 text-gray-1000 / gray-700 / button-warning / error-foreground 语义色。
- 级别筛选按钮的激活态用 gray-alpha-300，深浅色主题自动跟随，不新增颜色 token。

## 实时示例

Build log

- 10:00:01inforequest 1 completed
- 10:00:02inforequest 2 completed
- 10:00:03debugrequest 3 completed
- 10:00:04warnrequest 4 completed
- 10:00:05inforequest 5 completed
- 10:00:06debugrequest 6 completed
- 10:00:07errorrequest 7 failed: upstream timeout
- 10:00:08warnrequest 8 completed
- 10:00:09debugrequest 9 completed
- 10:00:10inforequest 10 completed
- 10:00:11inforequest 11 completed
- 10:00:12warnrequest 12 completed
- 10:00:13inforequest 13 completed
- 10:00:14errorrequest 14 failed: upstream timeout
- 10:00:15debugrequest 15 completed
- 10:00:16warnrequest 16 completed
- 10:00:17inforequest 17 completed
- 10:00:18debugrequest 18 completed
- 10:00:19inforequest 19 completed
- 10:00:20warnrequest 20 completed
- 10:00:21errorrequest 21 failed: upstream timeout
- 10:00:22inforequest 22 completed
- 10:00:23inforequest 23 completed
- 10:00:24warnrequest 24 completed
- 10:00:25inforequest 25 completed
- 10:00:26inforequest 26 completed
- 10:00:27debugrequest 27 completed
- 10:00:28errorrequest 28 failed: upstream timeout
- 10:00:29inforequest 29 completed
- 10:00:30debugrequest 30 completed
- 10:00:31inforequest 31 completed
- 10:00:32warnrequest 32 completed
- 10:00:33debugrequest 33 completed
- 10:00:34inforequest 34 completed
- 10:00:35errorrequest 35 failed: upstream timeout
- 10:00:36warnrequest 36 completed
- 10:00:37inforequest 37 completed
- 10:00:38inforequest 38 completed
- 10:00:39debugrequest 39 completed
- 10:00:40warnrequest 40 completed

```tsx
import { useState } from "react";
import { Button, LogView, type LogEntry } from "@hustradio/unitary-ui";

const seed: LogEntry[] = Array.from({ length: 40 }, (_, index) => {
  const step = index + 1;
  const level =
    step % 7 === 0 ? "error" : step % 4 === 0 ? "warn" : step % 3 === 0 ? "debug" : "info";
  return {
    id: String(step),
    level,
    time: `10:00:${String(step).padStart(2, "0")}`,
    message:
      level === "error" ? `request ${step} failed: upstream timeout` : `request ${step} completed`,
  } as LogEntry;
});

export function LogViewFollowA17B53C9Example() {
  const [entries, setEntries] = useState(seed);

  const append = () =>
    setEntries((previous) => {
      const step = previous.length + 1;
      return [
        ...previous,
        {
          id: String(step),
          level: step % 5 === 0 ? "error" : "info",
          time: `10:00:${String(step).padStart(2, "0")}`,
          message:
            step % 5 === 0
              ? `request ${step} failed: upstream timeout`
              : `request ${step} completed`,
        },
      ];
    });

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button type="secondary" size="small" onClick={append}>
          Append log
        </Button>
        <Button type="tertiary" size="small" onClick={() => setEntries(seed)}>
          Reset
        </Button>
      </div>
      <LogView
        entries={entries}
        title="Build log"
        height={200}
        emptyLabel="No build output yet"
        onExport={(text) => {
          void text;
        }}
      />
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { LogView, LOG_LEVELS, formatLogLine, logEntriesToText } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`ComponentProps<"div">`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">entries</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">LogEntry[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">调用方持有的行，按给定顺序渲染。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">level</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"all" | LogLevel</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控的最低级别过滤。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultLevel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"all" | LogLevel</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">未传 level 时的初始过滤。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"all"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onLevelChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(level) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">内置控件触发的过滤变更回调。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">视口高度；数字按 px 处理。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">320</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">查看器标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">emptyLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">无可见行时的文案。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">clipboard</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ writeText }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">复制实现的注入点；默认 navigator.clipboard。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onExport</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text, entries) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接手导出文本，替代下载文件。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">exportFileName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">未提供 onExport 时的下载文件名。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"logs.txt"</td></tr></tbody></table>

## 最佳实践

- entries 按你期望的展示顺序传入；LogView 不排序、不合并、不发请求。
- 每行 id 保持稳定，新日志才会追加而不是整列表重挂载。
- 过滤按最低级别生效：选 Warn 会保留 warn 与 error。
- 用户上滚后立即暂停自动跟随，不要在他们回看历史时把视口拽回底部。
- 条目总量由调用方控制；首版渲染全部可见行，不做虚拟化。
