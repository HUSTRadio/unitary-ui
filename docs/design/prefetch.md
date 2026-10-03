# 预载设计 / Prefetch design

## 目标与边界 / Scope

在用户进入下一段内容前准备异步模块或只读数据，随后使用同一资源的结果。LazyLoad 管首次挂载，Prefetch 管资源准备；两者可以组合，现有 LazyLoad 行为保持不变。/ Prepare asynchronous modules or read-only data before the user enters the next content, then reuse the same resource result. LazyLoad controls first mounting; Prefetch prepares resources. They can be combined without changing LazyLoad behavior.

## 公共契约 / Public contract

- `createPrefetch<T>(loader)` 创建独立资源；loader 接收 `AbortSignal`，返回值或 Promise。创建资源本身不执行 loader。/ Creates an independent resource whose loader accepts an AbortSignal and returns a value or promise. Creation does not execute the loader.
- `resource.load()` 合并正在进行的请求，缓存成功 Promise，显式加载失败时拒绝；失败不会锁死后续重试。/ Deduplicates in-flight work, caches successful promises and rejects explicit loading errors. Failures do not prevent later retries.
- `resource.prefetch()` 在后台准备同一结果，错误记录在状态中并处理拒绝，调用方通过 `load()` 消费。/ Prepares the same result in the background, records errors in state and handles rejection; callers consume via load().
- `resource.invalidate()` 清除缓存并中止支持信号的旧请求；旧结果不得覆盖新状态。动态 import 的模块执行无法撤销。/ Clears the cache and aborts old work that honors the signal; stale results cannot overwrite current state. Dynamic module execution cannot be undone.
- `usePrefetchState(resource)` 订阅稳定的 `idle / loading / ready / error` 快照；服务端渲染提供 idle 快照且不启动工作。/ Subscribes to stable snapshots; SSR uses idle state and starts no work.
- `<Prefetch resource trigger="intent | viewport | idle">` 默认 `intent`：鼠标/笔进入、键盘聚焦或触摸按下时准备。`viewport` 使用 root、rootMargin（默认 200px）、threshold（默认 0）；无观察器时使用空闲调度。`idle` 使用 requestIdleCallback，缺少支持时使用定时器。/ Intent is the default, triggered by mouse/pen entry, keyboard focus or touch press. Viewport mode uses observer options and falls back to idle scheduling; idle mode uses requestIdleCallback with a timer fallback.
- `disabled` 只禁止自动预载；`respectDataSaver` 默认 true；`asChild` 将行为合并到一个现有元素，保留其事件与可访问语义。未卸载子元素；卸载组件只取消未执行的调度，不中止共享资源。/ Disabled suppresses automatic prefetch only. Data saver is respected by default. asChild merges behavior into an existing element while preserving events and semantics. Children stay mounted; unmounting cancels pending scheduling without aborting shared resources.

资源由调用方持有，不设全局数据缓存或自动过期。需针对参数创建稳定资源；身份、查询或内容变化后显式失效。只读数据、动态模块和浏览器图片解码可由 loader 表达；首屏必需内容继续按需求加载。/ Resources are caller-owned, with no global data cache or automatic expiry. Keep a stable resource per parameter set and invalidate when identity, queries or content change. Loaders may handle read-only data, modules or browser image decoding; required initial content still loads on demand.

## 落地顺序 / Implementation sequence

1. 实现资源状态机、Promise 去重、错误重试、失效和订阅，再测试并发及旧请求竞争。/ Implement and test the resource state machine, promise deduplication, retries, invalidation, subscriptions and stale completion races.
2. 实现三种触发和 asChild，覆盖键盘、触摸、省流量、SSR、观察器及空闲任务清理。/ Implement trigger modes and composition; test keyboard, touch, data saver, SSR and cleanup.
3. 将公共符号接入包根；文档站的页面与演示加载共用同一资源，导航按意图预载，不批量加载全站。/ Export the API; share resources between docs prefetch and navigation, without preloading the entire site.
4. 增加与 LazyLoad 同级的“异步加载”分类、双语元数据/API/指南、真实可运行示例及展示页，再生成 LLM 语料和截图。/ Add the sibling async-loading classification, bilingual metadata/API/guides and live examples, then generate corpus and screenshots.
5. 通过行为与浏览器回归、类型检查、生产及库构建、原生 ESM/CJS/SSR 消费、实际包内容与确定性文档校验。/ Validate behavior, browsers, types, builds, native package consumers, archive contents and deterministic docs.

## 参考 / References

实现按官方平台契约核对，Prefetch 为 Unitary 扩展。/ Implementation follows platform contracts; Prefetch is a Unitary extension.

- [React useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore): 快照稳定性与服务端快照 / snapshot stability and SSR snapshots.
- [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API): 视口与局部滚动容器 / viewport and local scroll roots.
- [requestIdleCallback](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback): 空闲调度与取消 / idle scheduling and cancellation.
- [NetworkInformation.saveData](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData): 可用时尊重省流量偏好 / data-saver preference when available.
