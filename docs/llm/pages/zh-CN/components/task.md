# 任务

> Route: `/components/task`

展示长时间运行的任务：状态、进度、当前阶段，以及取消或重试操作。

[返回组件](#/components)

# 任务

task

展示长时间运行的任务：状态、进度、当前阶段，以及取消或重试操作。

## 何时使用

- 导入、同步、构建等会持续数秒以上的操作，需要让用户看到当前进展与阶段。
- 需要在失败或部分完成后提供一次明确的重试入口。
- 状态由调用方或 \`taskReducer\` 推导，界面只负责呈现时。

## 何时不应使用

- 瞬时请求用按钮的 \`loading\` 状态即可，不需要整块任务区域。
- 只有一个 0–100 的读数、没有阶段与操作时用 Progress Circle。
- 构建与部署语义（QUEUED / BUILDING / READY）属于 StatusDot，不要用 Task 表达。

## 示例

### 进度、阶段与操作

用 taskReducer 推进进度；取消只在 running 出现，重试只在 failed/partial 出现。

## 无障碍

不适用: 本轮不含无障碍增强：Task 通过可见文案与 data-status 表达状态，进度不声明 ARIA 角色；播报策略由调用方决定。

## 受控行为

- 完全受控：status、progress、stage 全部由调用方传入，组件不持有状态、不设定时器、不发请求。
- 取消与重试只调用 onCancel / onRetry，真正的中止或重排由调用方执行。
- 仅在 running 时渲染取消，仅在 failed / partial 时渲染重试；状态与可用操作始终一致。

## 响应式行为

- 根容器使用 w-full min-w-0，宽度跟随外层布局，不会撑破栅格。
- 操作按钮通过 flex-wrap 在窄屏换行，不挤压进度条。
- 进度条按容器宽度伸缩，percentage 只影响填充宽度，不改变高度。

## 主题行为

- 进度轨道用 gray-alpha-300、填充用 primary、标题与说明用 gray-1000 / gray-700，深浅色主题自动跟随。
- 宽度过渡使用 --uni-motion-state 与 ease-snap，减少动态效果时由 motion-reduce 关闭。

## 实时示例

Import contacts

Reads a CSV from your device and uploads it in batches.

Uploading 4 of 12

```tsx
import { useState } from "react";
import { Button, Task, createTaskState, taskReducer } from "@hustradio/unitary-ui";

export function TaskProgress5C1D9A42Example() {
  const [state, setState] = useState(
    createTaskState({ status: "running", progress: 0.35, attempts: 1 }),
  );

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Task
        status={state.status}
        progress={state.progress}
        title="Import contacts"
        description={
          state.status === "failed"
            ? (state.error ?? "Upload failed.")
            : state.status === "succeeded"
              ? "12 contacts imported."
              : "Reads a CSV from your device and uploads it in batches."
        }
        stage={
          state.status === "running"
            ? `Uploading ${Math.round(state.progress * 12)} of 12`
            : undefined
        }
        onCancel={
          state.status === "running"
            ? () =>
                setState((current) => taskReducer(current, { type: "fail", error: "Canceled." }))
            : undefined
        }
        onRetry={
          state.status === "failed" || state.status === "partial"
            ? () => setState((current) => taskReducer(current, { type: "start" }))
            : undefined
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="secondary"
          size="small"
          disabled={state.status !== "running"}
          onClick={() =>
            setState((current) =>
              taskReducer(current, { type: "progress", value: current.progress + 0.2 }),
            )
          }
        >
          Advance
        </Button>
        <Button
          type="tertiary"
          size="small"
          disabled={state.status !== "running"}
          onClick={() => setState((current) => taskReducer(current, { type: "succeed" }))}
        >
          Finish
        </Button>
        <Button
          type="tertiary"
          size="small"
          onClick={() => setState(createTaskState({ status: "running", progress: 0, attempts: 1 }))}
        >
          Restart
        </Button>
      </div>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Task } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`ComponentProps<"div">`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">status</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"idle" | "running" | "partial" | "failed" | "succeeded"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">当前状态，通常由 taskReducer 推导。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">progress</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">0–1；running 与 partial 下渲染进度条。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">stage</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">当前阶段文案，例如 正在上传 3/12。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">任务名称。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">description</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">补充说明或失败原因。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCancel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅在 running 时渲染取消操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onRetry</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅在 failed 与 partial 下渲染重试操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">cancelLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">覆盖框架默认的取消文案。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">retryLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">覆盖框架默认的重试文案。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染在操作按钮上方的额外内容。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- Task 只渲染状态机给出的结果，自身不发起、不轮询、不取消任何请求。
- 只在 running 时提供取消、failed/partial 时提供重试，让可用操作与状态一致。
- 阶段文案面向用户（正在上传 3/12），不要暴露内部 id。
- 失败原因放进 description，由调用方撰写，Task 不改写文案。
- 不要复用 StatusDot 的构建状态：构建与部署语义仍由 StatusDot 承担。
