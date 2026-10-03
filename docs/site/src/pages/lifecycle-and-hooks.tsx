import type { DocsLanguage } from "../i18n/language";

import { DocArticle, type DocPageContent } from "../components/doc-content";

/**
 * 「生命周期与钩子」页面文案：结构化内容模型，中英双份同构，
 * 由 DocArticle 统一渲染（排版层级、行内代码样式集中在一处）。
 */

const zh: DocPageContent = {
  title: "生命周期与钩子",
  lead: [
    "组件通过属性和回调提供状态控制，不提供 ",
    { code: "componentDidMount" },
    "、",
    { code: "componentWillUnmount" },
    " 这类通用生命周期接口。本页说明如何管理状态、接收变化和取消操作。",
  ],
  sections: [
    {
      heading: "受控与非受控",
      blocks: [
        {
          p: [
            "支持受控与非受控模式的组件（如 ",
            { code: "Input" },
            "、",
            { code: "Select" },
            "、",
            { code: "Combobox" },
            "、",
            { code: "Switch" },
            "）可以由父组件或组件自身保存状态：",
          ],
        },
        {
          ul: [
            [
              { strong: "受控模式：" },
              "父组件保存状态，通过 ",
              { code: "value" },
              "、",
              { code: "open" },
              " 或 ",
              { code: "checked" },
              " 传给组件，同时传对应的 ",
              { code: "on…Change" },
              " 回调接收新值。将新值写回状态后，界面才会更新。",
            ],
            [
              { strong: "非受控模式：" },
              "通过 ",
              { code: "defaultValue" },
              "、",
              { code: "defaultOpen" },
              " 或 ",
              { code: "defaultChecked" },
              " 设置初始值，之后由组件更新内部状态。是否提供变更回调，见对应组件的 API。",
            ],
          ],
        },
        {
          p: [
            "需要同步其他控件或从外部修改状态时，使用受控模式；只需设置初始值时，使用非受控模式。同一个状态不要同时传 ",
            { code: "value" },
            " 和 ",
            { code: "defaultValue" },
            "。具体支持哪些属性，以组件 API 为准。",
          ],
        },
      ],
    },
    {
      heading: "回调与取消操作",
      blocks: [
        {
          ul: [
            [
              { code: "on…Change" },
              " 通知状态变化请求。受控模式下，由父组件决定是否更新状态。",
            ],
            [
              { code: "onSelect" },
              "、",
              { code: "onConfirm" },
              "、",
              { code: "onCopy" },
              " 分别处理选择、确认和复制。触发时机和参数见各组件的 API。",
            ],
            [
              { strong: "取消后续操作：" },
              "部分组件先调用点击回调；在回调中调用 ",
              { code: "event.preventDefault()" },
              " 即取消。目前 ",
              { code: "CopyButton" },
              "、",
              { code: "TextWithCopyButton" },
              " 支持此用法，取消后不会复制或显示反馈。其他组件的取消方式见各自 API。",
            ],
            [
              "各组件的 API 表列出属性和回调签名。本库新增的属性（如 ",
              { code: "Checkbox.defaultChecked" },
              "）标有“框架扩展”。",
            ],
          ],
        },
      ],
    },
    {
      heading: "组件专用钩子与事件",
      blocks: [
        {
          p: [
            "组件专用钩子和事件见对应文档，例如 ",
            { link: ["Radio useRadio", "/components/radio"] },
            "、",
            { link: ["Toast useToasts", "/components/toast"] },
            "，以及 Video 的原生播放事件。",
          ],
        },
      ],
    },
  ],
};

const en: DocPageContent = {
  title: "Lifecycle & Hooks",
  lead: [
    "Components expose state control through props and callbacks, without general lifecycle APIs such as ",
    { code: "componentDidMount" },
    " or ",
    { code: "componentWillUnmount" },
    ". This page explains how to manage state, receive changes, and cancel actions.",
  ],
  sections: [
    {
      heading: "Controlled & uncontrolled",
      blocks: [
        {
          p: [
            "Components that support both controlled and uncontrolled modes, such as ",
            { code: "Input" },
            ", ",
            { code: "Select" },
            ", ",
            { code: "Combobox" },
            ", ",
            { code: "Switch" },
            ", can store state in the parent or in the component itself:",
          ],
        },
        {
          ul: [
            [
              { strong: "Controlled: " },
              "the parent stores state and passes the current value through ",
              { code: "value" },
              ", ",
              { code: "open" },
              ", or ",
              { code: "checked" },
              ", plus the matching ",
              { code: "on…Change" },
              " callback. Update the parent’s state with the new value to update the UI.",
            ],
            [
              { strong: "Uncontrolled: " },
              "use ",
              { code: "defaultValue" },
              ", ",
              { code: "defaultOpen" },
              ", or ",
              { code: "defaultChecked" },
              " to set the initial value, then let the component update its own state. Check its API for available change callbacks.",
            ],
          ],
        },
        {
          p: [
            "Use controlled mode to synchronize other controls or update state externally. Use uncontrolled mode when you only need an initial value. Do not pass both ",
            { code: "value" },
            " and ",
            { code: "defaultValue" },
            " for the same state. Check each component’s API for supported props.",
          ],
        },
      ],
    },
    {
      heading: "Callbacks and cancellation",
      blocks: [
        {
          ul: [
            [
              { code: "on…Change" },
              " reports a state change request. In controlled mode, the parent decides whether to update state.",
            ],
            [
              "Callbacks such as ",
              { code: "onSelect" },
              ", ",
              { code: "onConfirm" },
              ", and ",
              { code: "onCopy" },
              " handle selection, confirmation, and copying. Their timing and arguments are listed in each component’s API.",
            ],
            [
              { strong: "Cancel an action: " },
              "some components call your click callback before acting. Calling ",
              { code: "event.preventDefault()" },
              " cancels it. Currently ",
              { code: "CopyButton" },
              " and ",
              { code: "TextWithCopyButton" },
              " support this: cancellation skips copying and feedback. Check other components’ APIs for their cancellation behavior.",
            ],
            [
              "Each component’s API table lists its props and callback signatures. Props added by this library, such as ",
              { code: "Checkbox.defaultChecked" },
              ", have an “Extension” badge.",
            ],
          ],
        },
      ],
    },
    {
      heading: "Component hooks and events",
      blocks: [
        {
          p: [
            "See the relevant component page for its hooks and events, such as ",
            { link: ["Radio useRadio", "/components/radio"] },
            ", ",
            { link: ["Toast useToasts", "/components/toast"] },
            ", and Video’s native playback events.",
          ],
        },
      ],
    },
  ],
};

export const LIFECYCLE_CONTENT: Record<DocsLanguage, DocPageContent> = { "zh-CN": zh, "en-US": en };

export function LifecycleAndHooksPage({ language }: { language: DocsLanguage }) {
  return <DocArticle content={LIFECYCLE_CONTENT[language]} />;
}
