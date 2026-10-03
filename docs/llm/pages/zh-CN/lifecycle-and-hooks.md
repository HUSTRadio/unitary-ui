# 生命周期与钩子

> Route: `/lifecycle-and-hooks`

# 生命周期与钩子

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
