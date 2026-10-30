# 状态与事件

> Route: `/api/state-and-events`

# 状态与事件

组件通过属性和回调提供状态控制，不提供 `componentDidMount`、`componentWillUnmount` 这类通用生命周期接口。本页说明如何管理状态、接收变化和取消操作。

## 受控与非受控

支持受控与非受控模式的组件（如 `Input`、`Select`、`Combobox`、`Switch`）可以由父组件或组件自身保存状态：

- **受控模式：**父组件保存状态，通过 `value`、`open` 或 `checked` 传给组件，同时传对应的 `on…Change` 回调接收新值。将新值写回状态后，界面才会更新。
- **非受控模式：**通过 `defaultValue`、`defaultOpen` 或 `defaultChecked` 设置初始值，之后由组件更新内部状态。是否提供变更回调，见对应组件的 API。

需要同步其他控件或从外部修改状态时，使用受控模式；只需设置初始值时，使用非受控模式。同一个状态不要同时传 `value` 和 `defaultValue`。具体支持哪些属性，以组件 API 为准。

## 回调与取消操作

- `on…Change` 通知状态变化请求。受控模式下，由父组件决定是否更新状态。
- `onSelect`、`onConfirm`、`onCopy` 分别处理选择、确认和复制。触发时机和参数见各组件的 API。
- **取消后续操作：**部分组件先调用点击回调；在回调中调用 `event.preventDefault()` 即取消。目前 `CopyButton`、`TextWithCopyButton` 支持此用法，取消后不会复制或显示反馈。其他组件的取消方式见各自 API。
- 各组件的 API 表列出属性和回调签名。本库新增的属性（如 `Checkbox.defaultChecked`）标有“框架扩展”。

## 组件专用钩子与事件

组件专用钩子和事件见对应文档，例如 [Radio useRadio](#/components/radio)、[Toast useToasts](#/components/toast)，以及 Video 的原生播放事件。

## 草稿持久化

useDraft(options) 把表单草稿存进一个带命名空间与 schema 版本的存储键（`unitary-draft/v<version>/<key>`）：只在当前值与基线不同时写入，回到基线即删除记录，因此未编辑的表单不会留下存储痕迹。

- 不传 `key` 时完全不触碰存储；`storage` 传 `null` 或不可用（服务端渲染、隐私模式）时退化为普通 state。
- 服务端渲染返回 `initial`，`isHydrated` 只在客户端恢复完成后为 true，恢复前不会把默认值写回存储。
- `reset()` 回到基线并清理本命名空间的旧版本残留，不会碰其它命名空间或无关的存储键。
- 损坏的 JSON、旧版本记录、配额异常与存储禁用都只影响持久化，不抛给调用方；`serialize` / `deserialize` 可替换序列化方式。

## 任务数据适配器

usePolling 与 useEventStream 只负责「怎么拿数据」：前者按间隔轮询、后者订阅事件流。两者都不缓存、不共享状态，也不提供通用 async store——每个实例只管理自己的一次订阅。

- 失败后统一走 `nextBackoffDelay(attempt, options)` 指数退避（默认 1s 起、2 倍增长、30s 封顶），两个适配器共用同一套参数。
- `usePolling` 单飞请求：上一次未完成时不会叠加新请求；`isDone(value)` 返回 true（例如已到终态）后停止调度。
- 卸载、`stop()`、`close()` 以及参数变化都会清理定时器并 abort 或 close 当前连接，不残留订阅。
- `useEventStream` 在 `error` 后关闭旧连接并按退避重连；解析失败只上报 `onError`，连接保持。
- 两者都接受 `enabled` 以按条件挂起；`fetcher` 应尊重传入的 AbortSignal。
