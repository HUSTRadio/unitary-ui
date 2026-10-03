import type { ComponentGuide } from "../component-guide-schema";

export const PREFETCH_GUIDES_ZH: Record<string, ComponentGuide> = {
  prefetch: {
    slug: "prefetch", locale: "zh-CN",
    summary: "Prefetch 在进入内容前准备异步资源；同一资源的 load() 复用进行中请求或已缓存结果。LazyLoad 控制首次挂载，两者可组合。",
    whenToUse: ["预览按钮、下一页链接或即将进入视口的区域，有明确的后续访问可能。", "动态模块、只读数据或图片准备希望提前完成，实际操作随后复用结果。"],
    whenNotToUse: ["首屏必要内容应按需加载；不必等待预载触发。", "不要为所有链接批量下载，也不用于提交、删除等写操作。"],
    examples: [
      { id: "default", kind: "minimal", title: "意图预载与缓存复用", description: "先悬停、聚焦或触摸“打开预览”，观察请求次数变为 1；点击后显示同一结果。清除缓存后可再次请求。", demoKey: "default" },
      { id: "strategies", kind: "variant", title: "视口与空闲触发", description: "视口方式向下滚动接近目标；空闲方式无需滚动。重新演示会失效资源并重挂载触发器。", demoKey: "strategies", showDescriptionInDemo: true },
    ],
    accessibility: { status: "covered", content: ["intent 同时支持键盘聚焦与触摸按下；asChild 保留子元素的链接、按钮和事件语义。", "预载不抢焦点、不替换子内容，也不默认播报状态。需要反馈时用 usePrefetchState 配合有说明的状态区。"] },
    controlledBehavior: { status: "covered", content: ["调用方创建稳定资源；多处触发与实际加载共享同一 Promise。成功结果保留至 invalidate()；错误不缓存为永久失败。", "后台 prefetch() 处理拒绝；显式 load() 仍拒绝错误，调用方负责显示或处理。", "invalidate() 中止支持 AbortSignal 的旧请求，旧结果不更新缓存；动态模块执行不能撤销。", "SSR 不自动启动工作，快照为 idle；私有数据资源应按服务端请求隔离，数据不自动序列化。"] },
    responsiveBehavior: { status: "covered", content: ["trigger 默认为 intent；viewport 使用 root、rootMargin（默认 200px）与 threshold（默认 0）；idle 在浏览器空闲时准备。", "省流量设置可用且开启时默认跳过自动预载；disabled 也只影响自动触发，load() 仍可用。", "视口与空闲调度每次设置触发一次。失效不会自动重新调度；可再次调用 prefetch()、使用新的触发设置或重挂载。卸载取消调度，保留共享的进行中资源。"] },
    themeBehavior: { status: "covered", content: ["Prefetch 不添加颜色、尺寸或动画；演示使用现有 Button、边框和文字 token 适配明暗主题。"] },
  },
};

export const PREFETCH_GUIDES_EN: Record<string, ComponentGuide> = {
  prefetch: {
    slug: "prefetch", locale: "en-US",
    summary: "Prefetch prepares async resources before entering content; load() reuses pending work or cached results. LazyLoad controls first mounting, and the two can be combined.",
    whenToUse: ["Preview buttons, next-page links or approaching regions with a likely follow-up visit.", "Prepare dynamic modules, read-only data or images before the eventual operation consumes them."],
    whenNotToUse: ["Required initial content should load on demand without waiting for a prefetch trigger.", "Do not download every link or use prefetch for writes such as submitting or deleting."],
    examples: [
      { id: "default", kind: "minimal", title: "Intent and cache reuse", description: "Hover, focus or touch Open preview and observe one request; clicking displays the same result. Clearing the cache allows another request.", demoKey: "default" },
      { id: "strategies", kind: "variant", title: "Viewport and idle triggers", description: "Scroll toward the target in viewport mode; idle mode needs no scrolling. Restart invalidates the resource and remounts the trigger.", demoKey: "strategies", showDescriptionInDemo: true },
    ],
    accessibility: { status: "covered", content: ["Intent supports keyboard focus and touch press; asChild preserves the existing link/button and event semantics.", "Prefetch does not move focus, replace children or announce status. Use usePrefetchState with a meaningful status region when feedback is needed."] },
    controlledBehavior: { status: "covered", content: ["Create stable resources; multiple triggers and actual loading share one promise. Success stays cached until invalidate(); errors can be retried.", "Background prefetch() handles rejection; explicit load() still rejects and callers handle the error.", "Invalidate aborts old work honoring AbortSignal and stale results do not update the cache; module execution cannot be undone.", "SSR starts no automatic work and returns idle snapshots. Isolate private resources per server request; data is not serialized automatically."] },
    responsiveBehavior: { status: "covered", content: ["Intent is the default; viewport uses root, rootMargin (200px) and threshold (0), while idle prepares during browser idle time.", "Available active data-saver preferences suppress automatic work by default. Disabled also affects automatic triggers only; load() remains available.", "Viewport and idle run once per setup. Invalidation does not reschedule them; call prefetch(), change the trigger setup or remount. Unmounting cancels scheduling while keeping shared in-flight resources."] },
    themeBehavior: { status: "covered", content: ["Prefetch adds no colors, dimensions or animations; demos reuse Button, border and text tokens for both themes."] },
  },
};
