# 预载

> Route: `/components/prefetch`

在用户有操作意图、接近视口或浏览器空闲时准备可复用的模块或数据。

[返回组件](#/components)

# 预载

prefetch

在用户有操作意图、接近视口或浏览器空闲时准备可复用的模块或数据。

## 何时使用

- 预览按钮、下一页链接或即将进入视口的区域，有明确的后续访问可能。
- 动态模块、只读数据或图片准备希望提前完成，实际操作随后复用结果。

## 何时不应使用

- 首屏必要内容应按需加载；不必等待预载触发。
- 不要为所有链接批量下载，也不用于提交、删除等写操作。

## 示例

### 意图预载与缓存复用

先悬停、聚焦或触摸“打开预览”，观察请求次数变为 1；点击后显示同一结果。清除缓存后可再次请求。

### 视口与空闲触发

视口方式向下滚动接近目标；空闲方式无需滚动。重新演示会失效资源并重挂载触发器。

## 无障碍

- intent 同时支持键盘聚焦与触摸按下；asChild 保留子元素的链接、按钮和事件语义。
- 预载不抢焦点、不替换子内容，也不默认播报状态。需要反馈时用 usePrefetchState 配合有说明的状态区。

## 受控行为

- 调用方创建稳定资源；多处触发与实际加载共享同一 Promise。成功结果保留至 invalidate()；错误不缓存为永久失败。
- 后台 prefetch() 处理拒绝；显式 load() 仍拒绝错误，调用方负责显示或处理。
- invalidate() 中止支持 AbortSignal 的旧请求，旧结果不更新缓存；动态模块执行不能撤销。
- SSR 不自动启动工作，快照为 idle；私有数据资源应按服务端请求隔离，数据不自动序列化。

## 响应式行为

- trigger 默认为 intent；viewport 使用 root、rootMargin（默认 200px）与 threshold（默认 0）；idle 在浏览器空闲时准备。
- 省流量设置可用且开启时默认跳过自动预载；disabled 也只影响自动触发，load() 仍可用。
- 视口与空闲调度每次设置触发一次。失效不会自动重新调度；可再次调用 prefetch()、使用新的触发设置或重挂载。卸载取消调度，保留共享的进行中资源。

## 主题行为

- Prefetch 不添加颜色、尺寸或动画；演示使用现有 Button、边框和文字 token 适配明暗主题。

## 实时示例

悬停、聚焦或触摸按钮会预载；点击后复用同一结果。

状态：尚未开始；请求次数：0

```tsx
import { useState } from "react";
import { Prefetch, usePrefetchState } from "@/components/ui/prefetch";
import { createPrefetch } from "@/lib/prefetch";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export default function PrefetchExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [requests, setRequests] = useState(0);
  const [open, setOpen] = useState(false);
  const [resource] = useState(() =>
    createPrefetch(async (signal) => {
      setRequests((count) => count + 1);
      const response = await fetch("/prefetch-preview.json", { signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return (await response.json()) as {
        title: string;
        titleZh: string;
        body: string;
        bodyZh: string;
      };
    }),
  );
  const state = usePrefetchState(resource);
  const labels = zh
    ? { idle: "尚未开始", loading: "准备中", ready: "已就绪", error: "失败，可重试" }
    : {
        idle: "Not started",
        loading: "Preparing",
        ready: "Ready",
        error: "Failed; retry available",
      };
  return (
    <div className="w-full space-y-4" data-slot="prefetch-demo">
      <p className="text-copy-14 text-muted-foreground">
        {zh
          ? "悬停、聚焦或触摸按钮会预载；点击后复用同一结果。"
          : "Hover, focus or touch the button to prepare; clicking reuses the result."}
      </p>
      <div className="flex flex-wrap gap-3">
        <Prefetch resource={resource} asChild>
          <Button
            typeName="button"
            onClick={async () => {
              try {
                await resource.load();
                setOpen(true);
              } catch {
                /* 状态包含错误。 / State exposes the error. */
              }
            }}
          >
            {zh ? "打开预览" : "Open preview"}
          </Button>
        </Prefetch>
        <Button
          typeName="button"
          type="secondary"
          onClick={() => {
            resource.invalidate();
            setOpen(false);
          }}
        >
          {zh ? "清除缓存" : "Clear cache"}
        </Button>
      </div>
      <p role="status" data-slot="prefetch-demo-status" className="text-copy-14">
        {zh
          ? `状态：${labels[state.status]}；请求次数：${requests}`
          : `Status: ${labels[state.status]}; Requests: ${requests}`}
      </p>
      {open && state.status === "ready" ? (
        <div data-slot="prefetch-preview" className="space-y-2 rounded-lg border border-border p-4">
          <h3 className="text-heading-16">{zh ? state.data.titleZh : state.data.title}</h3>
          <p className="text-copy-14">{zh ? state.data.bodyZh : state.data.body}</p>
        </div>
      ) : null}
    </div>
  );
}
```

## 触发方式

视口方式向下滚动接近目标；空闲方式无需滚动。重新演示会失效资源并重挂载触发器。

状态：idle；请求次数：0

向下滚动，让目标接近容器底边。空闲方式无需滚动。

这个目标始终挂载；只提前准备资源。

```tsx
import { useState } from "react";
import { Prefetch, usePrefetchState, type PrefetchTrigger } from "@/components/ui/prefetch";
import { createPrefetch } from "@/lib/prefetch";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

export default function PrefetchStrategiesExample() {
  const { locale } = useI18n();
  const zh = locale === "zh-CN";
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const [trigger, setTrigger] = useState<PrefetchTrigger>("viewport");
  const [attempt, setAttempt] = useState(0);
  const [requests, setRequests] = useState(0);
  const [resource] = useState(() =>
    createPrefetch(async (signal) => {
      setRequests((count) => count + 1);
      const response = await fetch("/prefetch-preview.json", { signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    }),
  );
  const state = usePrefetchState(resource);
  const reset = () => {
    resource.invalidate();
    setAttempt((value) => value + 1);
    viewport?.scrollTo({ top: 0 });
  };
  return (
    <div className="w-full space-y-4" data-slot="prefetch-strategies-demo">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          aria-label={zh ? "预载触发方式" : "Prefetch trigger"}
          value={trigger}
          onValueChange={(value) => {
            setTrigger(value as PrefetchTrigger);
            reset();
          }}
        >
          <SelectItem value="viewport">{zh ? "接近视口" : "Near viewport"}</SelectItem>
          <SelectItem value="idle">{zh ? "浏览器空闲" : "Browser idle"}</SelectItem>
        </Select>
        <Button typeName="button" type="secondary" onClick={reset}>
          {zh ? "重新演示" : "Restart demo"}
        </Button>
      </div>
      <p role="status" className="text-copy-14">
        {zh
          ? `状态：${state.status}；请求次数：${requests}`
          : `Status: ${state.status}; Requests: ${requests}`}
      </p>
      <div
        ref={setViewport}
        data-slot="prefetch-demo-viewport"
        tabIndex={0}
        aria-label={zh ? "预载滚动演示" : "Prefetch scroll demo"}
        className="h-48 overflow-y-auto rounded-lg border border-border p-4 focus-ring"
      >
        <p className="text-copy-14 text-muted-foreground">
          {zh
            ? "向下滚动，让目标接近容器底边。空闲方式无需滚动。"
            : "Scroll down until the target approaches the container. Idle mode needs no scrolling."}
        </p>
        <Prefetch
          key={`${trigger}-${attempt}`}
          resource={resource}
          trigger={trigger}
          root={viewport}
          rootMargin="40px"
          className="mt-80 rounded-md border border-border p-4"
        >
          {zh
            ? "这个目标始终挂载；只提前准备资源。"
            : "This target stays mounted; its resource is prepared ahead of use."}
        </Prefetch>
      </div>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Prefetch, createPrefetch, usePrefetchState } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`Omit<ComponentPropsWithoutRef<"div">, "resource">`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource</code><span class="ml-1 text-destructive">*</span><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">PrefetchResource&lt;unknown&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">createPrefetch 创建的共享资源；创建时不启动工作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">trigger</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"intent" | "viewport" | "idle"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">意图模式响应鼠标/笔进入、键盘聚焦与触摸按下；视口与空闲模式每次设置调度一次。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"intent"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">asChild</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">将行为合并到一个现有元素，不额外添加包装层。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">禁止自动预载；显式 resource.load() 仍可用。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">respectDataSaver</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">navigator.connection.saveData 可用且为 true 时跳过自动预载。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">root</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Element | Document | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">视口模式的 IntersectionObserver 根节点。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">null</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rootMargin</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">视口模式的相交边距。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"200px"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">threshold</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">视口模式要求的最小相交比例。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">createPrefetch</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">&lt;T&gt;(loader: (signal: AbortSignal) =&gt; T | PromiseLike&lt;T&gt;) =&gt; PrefetchResource&lt;T&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">创建由调用方持有的资源；保持实例稳定，私有数据在 SSR 中每个请求使用独立实例。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource.load</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; Promise&lt;T&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">返回同一个进行中或成功的 Promise；错误会拒绝，下一次调用可重试。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource.prefetch</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; Promise&lt;void&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">预热 load 缓存；处理后台拒绝，错误通过快照提供。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource.invalidate</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">清除缓存，中止支持信号的进行中工作，并忽略旧结果。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource.getSnapshot</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; PrefetchSnapshot&lt;T&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">稳定的只读 idle/loading/ready/error 快照；ready 提供 data，error 提供失败原因。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource.subscribe</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(listener: () =&gt; void) =&gt; () =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">订阅状态变化，返回取消订阅函数。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">usePrefetchState</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">框架扩展</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">&lt;T&gt;(resource: PrefetchResource&lt;T&gt;) =&gt; PrefetchSnapshot&lt;T&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">只订阅状态，不启动加载；SSR 与首次水合使用 idle。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

Prefetch 是 Unitary 扩展。它保留已挂载子元素，不设置视觉样式；动态 import 会执行模块。缺少观察器时使用空闲调度，缺少空闲 API 时使用 200ms 定时器；卸载只取消尚未执行的调度。

## 最佳实践

- 每组加载器与参数使用一个稳定资源，通过 load() 消费同一结果。
- 输入变化后显式失效；只为可能接着访问的内容预载，不预载所有页面。
