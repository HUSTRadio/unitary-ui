# Prefetch

> Route: `/components/prefetch`

Prepares reusable modules or data on intent, near a viewport, or while idle.

[Back to Components](#/components)

# Prefetch

prefetch

Prepares reusable modules or data on intent, near a viewport, or while idle.

## When to use

- Preview buttons, next-page links or approaching regions with a likely follow-up visit.
- Prepare dynamic modules, read-only data or images before the eventual operation consumes them.

## When not to use

- Required initial content should load on demand without waiting for a prefetch trigger.
- Do not download every link or use prefetch for writes such as submitting or deleting.

## Examples

### Intent and cache reuse

Hover, focus or touch Open preview and observe one request; clicking displays the same result. Clearing the cache allows another request.

### Viewport and idle triggers

Scroll toward the target in viewport mode; idle mode needs no scrolling. Restart invalidates the resource and remounts the trigger.

## Accessibility

- Intent supports keyboard focus and touch press; asChild preserves the existing link/button and event semantics.
- Prefetch does not move focus, replace children or announce status. Use usePrefetchState with a meaningful status region when feedback is needed.

## Controlled behavior

- Create stable resources; multiple triggers and actual loading share one promise. Success stays cached until invalidate(); errors can be retried.
- Background prefetch() handles rejection; explicit load() still rejects and callers handle the error.
- Invalidate aborts old work honoring AbortSignal and stale results do not update the cache; module execution cannot be undone.
- SSR starts no automatic work and returns idle snapshots. Isolate private resources per server request; data is not serialized automatically.

## Responsive behavior

- Intent is the default; viewport uses root, rootMargin (200px) and threshold (0), while idle prepares during browser idle time.
- Available active data-saver preferences suppress automatic work by default. Disabled also affects automatic triggers only; load() remains available.
- Viewport and idle run once per setup. Invalidation does not reschedule them; call prefetch(), change the trigger setup or remount. Unmounting cancels scheduling while keeping shared in-flight resources.

## Theme behavior

- Prefetch adds no colors, dimensions or animations; demos reuse Button, border and text tokens for both themes.

## Live Demo

Hover, focus or touch the button to prepare; clicking reuses the result.

Status: Not started; Requests: 0

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

## Strategies

Scroll toward the target in viewport mode; idle mode needs no scrolling. Restart invalidates the resource and remounts the trigger.

Status: idle; Requests: 0

Scroll down until the target approaches the container. Idle mode needs no scrolling.

This target stays mounted; its resource is prepared ahead of use.

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

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Prefetch, createPrefetch, usePrefetchState } from "@hustradio/unitary-ui";
```

Also accepts props defined by: `Omit<ComponentPropsWithoutRef<"div">, "resource">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource</code><span class="ml-1 text-destructive">*</span><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">PrefetchResource&lt;unknown&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shared resource created with createPrefetch; creation starts no work.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">trigger</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"intent" | "viewport" | "idle"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Intent uses mouse/pen entry, keyboard focus and touch press; viewport and idle schedule once per setup.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"intent"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">asChild</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Merges behavior into one existing element without adding a wrapper.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Suppresses automatic prefetch; explicit resource.load() remains available.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">respectDataSaver</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Skips automatic prefetch when navigator.connection.saveData is available and true.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">root</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Element | Document | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">IntersectionObserver root for viewport mode.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">null</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rootMargin</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Viewport-mode intersection margin.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"200px"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">threshold</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Minimum intersection ratio in viewport mode.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">createPrefetch</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">&lt;T&gt;(loader: (signal: AbortSignal) =&gt; T | PromiseLike&lt;T&gt;) =&gt; PrefetchResource&lt;T&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Creates a caller-owned resource; use stable instances, or one instance per SSR request for private data.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource.load</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; Promise&lt;T&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Returns the same in-flight or successful promise; errors reject and the next call can retry.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource.prefetch</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; Promise&lt;void&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Warms the load cache; handles background rejection and exposes errors in the snapshot.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource.invalidate</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Clears the cache, aborts pending work honoring its signal and ignores stale completions.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource.getSnapshot</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; PrefetchSnapshot&lt;T&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Stable readonly idle/loading/ready/error snapshot; ready contains data and error contains the failure.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">resource.subscribe</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(listener: () =&gt; void) =&gt; () =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Subscribes to changes and returns an unsubscribe function.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">usePrefetchState</code><span class="ml-2 rounded-sm border border-gray-alpha-400 px-1 text-label-12 text-muted-foreground">Extension</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">&lt;T&gt;(resource: PrefetchResource&lt;T&gt;) =&gt; PrefetchSnapshot&lt;T&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Observes state without loading; SSR and initial hydration use idle.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

Prefetch is a Unitary extension. Children remain mounted and no visual styles are added; dynamic import executes modules. Missing observers fall back to idle scheduling, and missing idle APIs use a 200ms timer. Unmounting cancels pending scheduling only.

## Best Practices

- Keep one stable resource per loader and parameter set; consume it through load().
- Invalidate when inputs change. Use prefetch for likely next content, not every page.
