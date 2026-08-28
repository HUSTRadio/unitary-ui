# 生命周期与钩子

> Route: `/lifecycle-and-hooks`

# 生命周期与钩子

先说结论：这套组件没有 `componentDidMount`、`componentWillUnmount` 那种生命周期钩子。组件的全部行为都通过 props 和回调暴露——状态由谁保存、什么时候变、变了之后通知谁，都由你传入的 props 决定。这一页讲清楚这三件事怎么用。

## 受控与非受控

凡是带状态的组件（`Input`、`Select`、`Combobox`、`Switch` 等）都支持两种用法，区别只在「状态存在谁那里」：

- **受控模式：**状态保存在你自己的 state 里。把当前值通过 `value`、`open` 或 `checked` 传给组件，同时传对应的 `on…Change` 回调接收变化。用户每次操作都会触发回调，你必须把新值写回 state——不写回，界面就不会变，这相当于「否决」了这次操作。
- **非受控模式：**只传 `defaultValue`、`defaultOpen` 或 `defaultChecked` 设置初始值，之后组件自己在内部维护状态，不会再通知你变化。适合「我只关心初始是什么」的场景。

怎么选：需要在其他地方读写这个值、或想在变化时执行逻辑（发请求、联动其他控件），就用受控；只是渲染一个自管理的控件，非受控更省事。注意同一个状态只能选一种模式——既传 `value` 又传 `defaultValue` 是未定义行为。

## 回调契约

- `on…Change` 表示「用户或组件请求改变状态」，而不是「状态已经变了」。受控模式下，是否接受这次改变由你决定：写回新值就是接受，不写回就是拒绝。
- `onSelect`、`onConfirm`、`onCopy` 这类具名回调各管各的意图，触发时机和参数见对应组件的文档页；它们不能当作通用的挂载/更新钩子来用。
- **Cancelled-Action Contract（取消约定）：**部分点击回调支持取消后续动作——组件先调用你的回调，回调里调用 `event.preventDefault()` 即取消。目前 `CopyButton`、`TextWithCopyButton` 遵循此约定（阻止后不会真正复制，也不会弹反馈），由共享工具 `callWithCancelGuard` 统一实现并有契约测试锁定。该约定只适用于「点击触发一个明确后续动作」的组件，不适用于开关类状态切换——那些走各自文档里说明的取消机制。
- 回调契约的解释权和具体签名都列在对应组件文档的 API 参考表里：官方 API 原样列出；框架扩展项（如 `Checkbox.defaultChecked`）标注「框架扩展」徽标，便于与官方表面区分。

## 组件特化的 API

少数组件提供了自己的 hooks 或依赖原生事件，这些不属于通用生命周期，因此直接写在各自的文档页里，例如 [Radio useRadio](#/components/radio)、[Toast useToasts](#/components/toast) 以及媒体组件的原生播放事件。用到哪个组件时去那一页查即可，本页不需要重复。
