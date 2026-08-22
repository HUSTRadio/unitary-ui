import type { DocsLanguage } from "../i18n/language";

import { DocArticle, type DocPageContent } from "../components/doc-content";

/**
 * 「生命周期与钩子」页面文案：结构化内容模型，中英双份同构，
 * 由 DocArticle 统一渲染（排版层级、行内代码样式集中在一处）。
 */

const zh: DocPageContent = {
  title: "生命周期与钩子",
  lead: [
    "先说结论：这套组件没有 ",
    { code: "componentDidMount" },
    "、",
    { code: "componentWillUnmount" },
    " 那种生命周期钩子。组件的全部行为都通过 props 和回调暴露——状态由谁保存、什么时候变、变了之后通知谁，都由你传入的 props 决定。这一页讲清楚这三件事怎么用。",
  ],
  sections: [
    {
      heading: "受控与非受控",
      blocks: [
        {
          p: [
            "凡是带状态的组件（",
            { code: "Input" },
            "、",
            { code: "Select" },
            "、",
            { code: "Combobox" },
            "、",
            { code: "Switch" },
            " 等）都支持两种用法，区别只在「状态存在谁那里」：",
          ],
        },
        {
          ul: [
            [
              { strong: "受控模式：" },
              "状态保存在你自己的 state 里。把当前值通过 ",
              { code: "value" },
              "、",
              { code: "open" },
              " 或 ",
              { code: "checked" },
              " 传给组件，同时传对应的 ",
              { code: "on…Change" },
              " 回调接收变化。用户每次操作都会触发回调，你必须把新值写回 state——不写回，界面就不会变，这相当于「否决」了这次操作。",
            ],
            [
              { strong: "非受控模式：" },
              "只传 ",
              { code: "defaultValue" },
              "、",
              { code: "defaultOpen" },
              " 或 ",
              { code: "defaultChecked" },
              " 设置初始值，之后组件自己在内部维护状态，不会再通知你变化。适合「我只关心初始是什么」的场景。",
            ],
          ],
        },
        {
          p: [
            "怎么选：需要在其他地方读写这个值、或想在变化时执行逻辑（发请求、联动其他控件），就用受控；只是渲染一个自管理的控件，非受控更省事。注意同一个状态只能选一种模式——既传 ",
            { code: "value" },
            " 又传 ",
            { code: "defaultValue" },
            " 是未定义行为。",
          ],
        },
      ],
    },
    {
      heading: "回调契约",
      blocks: [
        {
          ul: [
            [
              { code: "on…Change" },
              " 表示「用户或组件请求改变状态」，而不是「状态已经变了」。受控模式下，是否接受这次改变由你决定：写回新值就是接受，不写回就是拒绝。",
            ],
            [
              { code: "onSelect" },
              "、",
              { code: "onConfirm" },
              "、",
              { code: "onCopy" },
              " 这类具名回调各管各的意图，触发时机和参数见对应组件的文档页；它们不能当作通用的挂载/更新钩子来用。",
            ],
            [
              "部分点击回调支持取消后续动作：在回调里调用 ",
              { code: "event.preventDefault()" },
              " 即可。目前 ",
              { code: "CopyButton" },
              " 与 ",
              { code: "TextWithCopyButton" },
              " 遵循这一约定——阻止后不会真正复制，也不会弹反馈。",
            ],
          ],
        },
      ],
    },
    {
      heading: "组件特化的 API",
      blocks: [
        {
          p: [
            "少数组件提供了自己的 hooks 或依赖原生事件，这些不属于通用生命周期，因此直接写在各自的文档页里，例如 ",
            { link: ["Radio useRadio", "/components/radio"] },
            "、",
            { link: ["Toast useToasts", "/components/toast"] },
            " 以及媒体组件的原生播放事件。用到哪个组件时去那一页查即可，本页不需要重复。",
          ],
        },
      ],
    },
  ],
};

const en: DocPageContent = {
  title: "Lifecycle & Hooks",
  lead: [
    "The short version: these components have no lifecycle hooks like ",
    { code: "componentDidMount" },
    " or ",
    { code: "componentWillUnmount" },
    ". All behavior is exposed through props and callbacks — who owns the state, when it changes, and who gets notified are all decided by the props you pass. This page explains how the three mechanisms work.",
  ],
  sections: [
    {
      heading: "Controlled & uncontrolled",
      blocks: [
        {
          p: [
            "Every stateful component (",
            { code: "Input" },
            ", ",
            { code: "Select" },
            ", ",
            { code: "Combobox" },
            ", ",
            { code: "Switch" },
            ", …) supports two modes. The only question is where the state lives:",
          ],
        },
        {
          ul: [
            [
              { strong: "Controlled: " },
              "you own the state. Pass the current value via ",
              { code: "value" },
              ", ",
              { code: "open" },
              ", or ",
              { code: "checked" },
              ", plus the matching ",
              { code: "on…Change" },
              " callback. Every user interaction fires that callback; if you don't write the new value back to your state, the UI doesn't change — which amounts to rejecting the change.",
            ],
            [
              { strong: "Uncontrolled: " },
              "pass only ",
              { code: "defaultValue" },
              ", ",
              { code: "defaultOpen" },
              ", or ",
              { code: "defaultChecked" },
              " to set the initial value. After that the component keeps its own internal state and won't notify you of changes. Use this when you only care about the starting value.",
            ],
          ],
        },
        {
          p: [
            "How to choose: if you need to read or write the value elsewhere, or run logic on change (requests, linking controls), go controlled. If the control just manages itself, uncontrolled is simpler. Pick exactly one mode per state — passing both ",
            { code: "value" },
            " and ",
            { code: "defaultValue" },
            " is undefined behavior.",
          ],
        },
      ],
    },
    {
      heading: "Callback contracts",
      blocks: [
        {
          ul: [
            [
              { code: "on…Change" },
              " means “the user or component requests a state change”, not “the state has changed”. In controlled mode you decide whether to accept it: writing the new value back accepts; not writing it back rejects.",
            ],
            [
              "Intent-named callbacks like ",
              { code: "onSelect" },
              ", ",
              { code: "onConfirm" },
              ", and ",
              { code: "onCopy" },
              " each cover exactly their own intent; timing and arguments are documented on the component's page. None of them work as generic mount/update hooks.",
            ],
            [
              "Some click callbacks let you cancel the follow-up action by calling ",
              { code: "event.preventDefault()" },
              ". Currently ",
              { code: "CopyButton" },
              " and ",
              { code: "TextWithCopyButton" },
              " honor this — cancelling skips both the copy and its confirmation feedback.",
            ],
          ],
        },
      ],
    },
    {
      heading: "Component-specific APIs",
      blocks: [
        {
          p: [
            "A few components ship their own hooks or rely on native events. These are not part of any generic lifecycle, so they are documented on the component's own page — for example ",
            { link: ["Radio useRadio", "/components/radio"] },
            ", ",
            { link: ["Toast useToasts", "/components/toast"] },
            ", and the native media events on media components. Look them up on the relevant component page when you use that component.",
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
