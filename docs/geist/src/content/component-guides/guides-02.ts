import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_02_ZH: Record<string, ComponentGuide> = {
  browser: {
    slug: "browser",
    locale: "zh-CN",
    summary: "把截图与演示装进逼真的浏览器窗口框架，用于落地页、文档与更新日志的营销展示。",
    whenToUse: [
      "在落地页、文档或 changelog 文章中展示产品截图、录屏与演示时，用 Browser 提供真实的浏览器窗框。",
      "需要让静态截图获得“可运行产品”的视觉语境，又不想引入真实交互组件时。",
    ],
    whenNotToUse: [
      "不要在 Browser 框架里渲染真实产品 UI——窗框暗示这是截图，不是可交互的界面。",
      "不要用 Browser 包裹需要用户操作的实时组件；真实交互请直接用组件本身。",
    ],
    examples: [
      {
        id: "browser-composition",
        kind: "minimal",
        title: "基本组合",
        description: "在浏览器窗口框架内放置截图或演示内容，展示标准的营销展示结构。",
        demoKey: "Composition",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "浏览器窗框是装饰性元素，应携带 aria-hidden；实际语义由内部图片或视频承载。",
        "内部截图必须提供描述产品状态的替代文本，而不是复述窗框装饰。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Browser 是纯展示型框架组件，不管理任何交互状态。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "窗框随容器宽度等比缩放，内部媒体保持自身宽高比。",
        "在窄视口下窗框装饰（地址栏等）随整体缩小，不单独换行。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "窗框背景与边框颜色跟随主题变量，暗色模式下呈现深色窗口外观。",
        "交通灯圆点等装饰色在两种主题下保持辨识度。",
      ],
    },
  },
  button: {
    slug: "button",
    locale: "zh-CN",
    summary: "触发一个改变状态的动作，支持多种视觉变体、尺寸、图标与加载态。",
    whenToUse: [
      "用于会改变状态的动作：部署、保存、删除、轮换密钥；需要改变 URL 的导航请用 ButtonLink。",
      '表单提交场景使用 typeName="submit"（注意 HTML type 属性在 typeName 上，而 type 控制视觉变体）。',
      "同一行有多个相关动作时，改由 Menu 或 Split Button 承载，而不是堆叠多个按钮。",
    ],
    whenNotToUse: [
      '不要用 type="success"/"ghost"/"violet" 这类不存在的取值；辅助动作用 secondary，危险确认用 error。',
      "不要在按钮动作确实不可能发生之外的场景禁用按钮；禁用时必须配 Tooltip 说明原因。",
      "纯图标按钮必须同时提供 svgOnly 与 aria-label；组件不会在运行时校验，调用方必须提供描述动作与目标（复制部署 URL）的标签，而不是只写图标名。",
    ],
    examples: [
      {
        id: "button-sizes",
        kind: "minimal",
        title: "尺寸",
        description: "展示按钮的全部尺寸档位，用于按上下文密度选择合适的规格。",
        demoKey: "sizes",
      },
      {
        id: "button-variants",
        kind: "variant",
        title: "全部变体对比",
        description: "把所有 type 与尺寸放在一起对比，作为选择视觉变体的参照表。",
        demoKey: "all-types-and-sizes-in-comparison",
      },
      {
        id: "button-loading",
        kind: "stateful",
        title: "加载态",
        description:
          "用 loading 属性替代手动换 spinner：原生按钮保留标签、显示加载图标，并在调用方清除 loading 前保持禁用。",
        demoKey: "loading",
      },
      {
        id: "button-disabled",
        kind: "stateful",
        title: "禁用态",
        description: "展示禁用外观；禁用仅用于动作此刻不可行的场景，并应附带解释原因。",
        demoKey: "disabled",
      },
      {
        id: "button-prefix-suffix",
        kind: "advanced",
        title: "前后缀图标",
        description: "在标签前后放置图标，增强动作识别度。",
        demoKey: "prefix-and-suffix",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "loading 态保留标签、显示加载图标并禁用原生按钮；调用方应在其他可读区域提供进度说明。",
        "已有可见文本的按钮不要再设置 aria-label——它会覆盖可见标签，造成屏幕阅读器不一致。",
        "禁用按钮必须配 Tooltip 说明原因，否则灰化按钮看起来像 bug。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "loading 与 disabled 由父组件完全受控，按钮自身不持有状态。",
        "点击回调触发后由调用方决定何时解除 loading。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "小视口下优先收窄按钮标签文本而非换行；长动作名考虑缩写或移至菜单。",
        "触摸场景选择更大的尺寸档位以保证命中区域。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "默认按钮即主要动作色；secondary 用于辅助动作，error 用于危险确认。",
        "危险按钮遵循“动词 + 名词”命名并与 toast 一一对应（删除项目 → 项目已删除）。",
      ],
    },
  },
  calendar: {
    slug: "calendar",
    locale: "zh-CN",
    summary: "展示月历供用户挑选日期，适合需要星期与月份上下文的日期选择场景。",
    whenToUse: [
      "分析报表的时间范围选择，以及任何需要看到星期与月份上下文的日期挑选场景。",
      "用 min/max 限定在数据保留窗口内，防止用户选到范围外的日期。",
      "默认使用用户的 locale 与时区；不要为太平洋时区的用户静默渲染 UTC。",
    ],
    whenNotToUse: [
      "只需要单个具体时刻且不需要月历上下文时，用更轻量的时间输入组件。",
      "不要把 Calendar 当作纯展示月历嵌入内容流——它的语义是选择器。",
    ],
    examples: [
      {
        id: "calendar-default",
        kind: "minimal",
        title: "默认日历",
        description: "标准单月日历选择器。",
        demoKey: "default",
      },
      {
        id: "calendar-presets",
        kind: "advanced",
        title: "快捷预设",
        description: "为常用范围提供预设项，减少重复选择成本。",
        demoKey: "presets",
      },
      {
        id: "calendar-min-max",
        kind: "stateful",
        title: "最小/最大范围",
        description: "用 min 与 max 把可选日期约束在数据窗口内。",
        demoKey: "min-max",
      },
      {
        id: "calendar-pinned-timezone",
        kind: "advanced",
        title: "固定时区",
        description: "把日历固定到指定时区展示，避免跨时区歧义。",
        demoKey: "pinned-timezone",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "日期格子必须可通过键盘遍历（方向键移动、Enter 确认），焦点顺序与视觉顺序一致。",
        "已选与今日状态不能只靠颜色传达，需附带可被屏幕阅读器识别的语义。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "选中日期由父组件受控，onChange 通知选择结果。",
        "月份翻页由组件内部视图状态管理，不影响受控的选中值。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "提供水平布局、紧凑与堆叠等版式，适配不同容器宽度。",
        "小视口下优先使用 compact 版式减少垂直占用。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "今日高亮、选中态与禁用日颜色均跟随主题变量。",
        "暗色模式下选中日期保持足够的对比度。",
      ],
    },
  },
  checkbox: {
    slug: "checkbox",
    locale: "zh-CN",
    summary: "允许用户从一组选项中选择一个或多个，覆盖多选、确认声明与表格行选择场景。",
    whenToUse: [
      "列表内多选：表格行选择器、多选筛选器、偏好勾选组。",
      "用户必须确认某个具体陈述的场景：服务条款、不可逆导出确认。",
      '表格行选择复选框没有可见标签时，设置 aria-label="选择 {行名称}"。',
    ],
    whenNotToUse: [
      "单个布尔开关（深色模式、密码保护）用 Toggle，开/关语义比孤立的复选框更清晰。",
      "不要为互斥选项使用复选框——那是 Radio/Choicebox 的职责。",
      "不要用自定义包裹层破坏 label/htmlFor 关联——点击目标本来就延伸到标签。",
    ],
    examples: [
      {
        id: "checkbox-default",
        kind: "minimal",
        title: "默认复选框",
        description: "基本的可勾选复选框与标签。",
        demoKey: "default",
      },
      {
        id: "checkbox-indeterminate",
        kind: "stateful",
        title: "半选态",
        description:
          "半选是视觉状态而非第三种取值：由知道部分选择情况的父组件驱动，子项全选或全不选时立即清除。",
        demoKey: "indeterminate",
      },
      {
        id: "checkbox-disabled",
        kind: "stateful",
        title: "禁用态",
        description: "禁用复选框仍需配 Tooltip 说明原因，否则灰化的盒子读起来像 bug。",
        demoKey: "disabled",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "相关复选框包在带 <legend> 的 <fieldset> 里，屏幕阅读器会在每个选项前播报组名。",
        "组标签是 Title Case 名词（通知、必需权限），不带冒号；确认声明是完整句子并以句号结尾。",
        "半选态的文案要在组标签旁标注部分数量（已选 3/5），不要留下没有说明的横杠状态。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "选中状态由父组件受控；必填确认的校验在提交时触发而非失焦时，避免反复勾选时闪错误。",
        "半选态由父组件根据子项状态计算并驱动。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: ["点击目标已延伸到标签文本，移动端无需额外扩大热区。", "长标签自动换行，不截断。"],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "勾选框选中色、焦点环与禁用灰度跟随主题变量。",
        "暗色模式下禁用态与可用态保持可区分。",
      ],
    },
  },
  choicebox: {
    slug: "choicebox",
    locale: "zh-CN",
    summary: "更大形态的 Radio，为需要更多细节的选项提供大点击目标与描述空间。",
    whenToUse: [
      "选项受益于更大的点击目标，并需要附带描述或图标时，用 Choicebox 替代普通 Radio。",
      "互斥选择用单选模式，可叠加的选择用多选模式——不要在同一组内混用。",
    ],
    whenNotToUse: [
      "选项超过 4–6 个时改用 Select 或 Combobox，避免单个字段让整页滚动。",
      "选项只有纯文本短标签且没有细节要展示时，普通 Radio 更紧凑。",
    ],
    examples: [
      {
        id: "choicebox-single",
        kind: "minimal",
        title: "单选",
        description: "互斥选项的单选卡片组。",
        demoKey: "single-select",
      },
      {
        id: "choicebox-multi",
        kind: "variant",
        title: "多选",
        description: "可叠加选择的多选卡片组。",
        demoKey: "multi-select",
      },
      {
        id: "choicebox-custom",
        kind: "advanced",
        title: "自定义内容",
        description: "在卡片内放置自定义内容（图标、描述、徽章等）。",
        demoKey: "custom-content",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "卡片整体是点击目标，但键盘语义仍是 radio/checkbox：方向键在组内移动，空格切换。",
        "选中态不能只靠边框颜色，需保留可被辅助技术读取的选中语义。",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "选中值由父组件受控；单选组内切换即时通知，多选组返回完整集合。",
        "禁用项保留在焦点序列之外，不参与键盘遍历。",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "卡片网格随容器宽度自动折行；窄视口下退化为单列堆叠。",
        "移动端保持足够卡片高度以充当舒适的大点击目标。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "选中边框、背景与描述文本颜色跟随主题变量。",
        "暗色模式下选中卡片与未选中卡片保持清晰的层级差。",
      ],
    },
  },
};

export const GUIDES_02_EN: Record<string, ComponentGuide> = {
  browser: {
    slug: "browser",
    locale: "en-US",
    summary:
      "Frames screenshots and demos inside a realistic browser window for marketing use on landing pages, docs, and changelog posts.",
    whenToUse: [
      "Use Browser as marketing chrome around screenshots, demos, and recordings shown on landing pages, docs, and changelog posts.",
      "Use it when a static screenshot needs the visual context of a running product without embedding live components.",
    ],
    whenNotToUse: [
      "Don't render real product UI inside a Browser frame; the chrome implies a screenshot, not a live surface.",
      "Don't wrap interactive, user-operated components in a Browser frame — render those components directly.",
    ],
    examples: [
      {
        id: "browser-composition",
        kind: "minimal",
        title: "Composition",
        description:
          "Places a screenshot or demo inside the browser window frame, showing the standard marketing composition.",
        demoKey: "Composition",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The browser chrome is decorative and should carry aria-hidden; meaning lives on the inner image or video.",
        "Inner screenshots need alt text describing the product state, not restating the decorative frame.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason:
        "Browser is a purely presentational frame component and manages no interaction state.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "The frame scales proportionally with container width while inner media keeps its own aspect ratio.",
        "On narrow viewports the chrome decorations shrink with the whole frame rather than wrapping separately.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Frame background and border colors follow theme variables; dark mode renders a dark window appearance.",
        "Traffic-light dot decorations stay recognizable under both themes.",
      ],
    },
  },
  button: {
    slug: "button",
    locale: "en-US",
    summary:
      "Triggers an action that mutates state, with configurable variants, sizes, icons, and a loading state.",
    whenToUse: [
      "Use Button for actions that mutate state (deploy, save, delete); use ButtonLink for navigation that changes the URL.",
      'For form submits use typeName="submit" — the HTML type attribute lives on typeName, while type controls the visual variant.',
      "When more than one related action shares a row, switch to a Menu or Split Button instead of stacking buttons.",
    ],
    whenNotToUse: [
      "Don't use nonexistent type values like success/ghost/violet; pass secondary for supporting actions and error for destructive confirmations.",
      "Disable a button only when the action is impossible right now; pair disabling with a Tooltip that explains why.",
      "Icon-only buttons require both svgOnly and aria-label. The component does not validate this at runtime, so callers must supply a label naming the action and target (Copy deployment URL), not only the icon.",
    ],
    examples: [
      {
        id: "button-sizes",
        kind: "minimal",
        title: "Sizes",
        description: "Shows every size tier so you can pick the right one for the context density.",
        demoKey: "sizes",
      },
      {
        id: "button-variants",
        kind: "variant",
        title: "All types and sizes in comparison",
        description:
          "Places every type and size side by side as a reference table for choosing variants.",
        demoKey: "all-types-and-sizes-in-comparison",
      },
      {
        id: "button-loading",
        kind: "stateful",
        title: "Loading",
        description:
          "Pass loading instead of swapping in a spinner: the native button keeps its label, shows the loading icon, and stays disabled until the caller clears loading.",
        demoKey: "loading",
      },
      {
        id: "button-disabled",
        kind: "stateful",
        title: "Disabled",
        description:
          "Shows the disabled appearance; reserve it for actions that are currently impossible and explain why.",
        demoKey: "disabled",
      },
      {
        id: "button-prefix-suffix",
        kind: "advanced",
        title: "Prefix and suffix icons",
        description: "Places icons before or after the label to strengthen action recognition.",
        demoKey: "prefix-and-suffix",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The loading state preserves the label, shows the loading icon, and disables the native button; expose progress through another readable status surface when needed.",
        "Don't set aria-label on a button that already has visible text; it overrides the label and creates a screen-reader mismatch.",
        "Disabled buttons need a Tooltip naming the reason; a greyed button without explanation reads as a bug.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "loading and disabled are fully controlled by the parent; the button holds no internal state.",
        "The caller decides when to clear loading after the click callback fires.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "On small viewports prefer shortening the label over wrapping; consider abbreviations or moving long actions into a menu.",
        "Pick a larger size tier for touch contexts to keep hit areas comfortable.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Default Button is primary; secondary serves supporting actions and error serves destructive confirmations.",
        "Destructive buttons follow Verb + Noun and pair 1:1 with their toast: Delete Project then Project deleted.",
      ],
    },
  },
  calendar: {
    slug: "calendar",
    locale: "en-US",
    summary:
      "Displays a month calendar from which users can pick a date — the right picker when day-of-week and month context matter.",
    whenToUse: [
      "Pick Calendar for analytics ranges and any picker where day-of-week and month context matter.",
      "Set min and max to the data window so users can't pick outside the retention range.",
      "Default to the user's locale and timezone; never silently render UTC for a US-Pacific viewer.",
    ],
    whenNotToUse: [
      "For a single time-of-day pick without month context, use a lighter time input instead.",
      "Don't embed Calendar as a read-only monthly display in content flow — its semantic role is a picker.",
    ],
    examples: [
      {
        id: "calendar-default",
        kind: "minimal",
        title: "Default calendar",
        description: "A standard single-month date picker.",
        demoKey: "default",
      },
      {
        id: "calendar-presets",
        kind: "advanced",
        title: "Presets",
        description: "Offers preset entries for common ranges to cut repetitive selection cost.",
        demoKey: "presets",
      },
      {
        id: "calendar-min-max",
        kind: "stateful",
        title: "Min/max range",
        description: "Constrains selectable dates to the data window via min and max.",
        demoKey: "min-max",
      },
      {
        id: "calendar-pinned-timezone",
        kind: "advanced",
        title: "Pinned timezone",
        description: "Pins the calendar to a specific timezone to avoid cross-timezone ambiguity.",
        demoKey: "pinned-timezone",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Date cells must be keyboard-traversable (arrow keys to move, Enter to confirm) with focus order matching visual order.",
        "Selected and today states can't rely on color alone; they need screen-reader-detectable semantics.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "The selected date is controlled by the parent; onChange reports the pick.",
        "Month paging is internal view state and does not affect the controlled selection.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Horizontal, compact, and stacked layouts adapt the calendar to different container widths.",
        "Prefer the compact layout on small viewports to reduce vertical footprint.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Today highlight, selection, and disabled-day colors all follow theme variables.",
        "Selected dates keep sufficient contrast in dark mode.",
      ],
    },
  },
  checkbox: {
    slug: "checkbox",
    locale: "en-US",
    summary:
      "Allows users to select one or more items from a group — covering multi-select, acknowledgments, and table row pickers.",
    whenToUse: [
      "Multi-select inside a list: table-row pickers, multi-pick filters, and opt-in preference groups.",
      "Acknowledgments where the user must affirm a specific statement (terms of service, irreversible export).",
      'A row-select checkbox with no visible label needs aria-label="Select {row name}" so the row stays identifiable out of context.',
    ],
    whenNotToUse: [
      "For a single boolean setting like dark mode or password protection, use Toggle — the on/off mechanic is clearer than a lone checkbox.",
      "Don't use checkboxes for mutually exclusive options; that's Radio/Choicebox territory.",
      "Don't override the label/htmlFor association with a custom wrapper — the click target already extends to the label.",
    ],
    examples: [
      {
        id: "checkbox-default",
        kind: "minimal",
        title: "Default checkbox",
        description: "A basic checkable checkbox with its label.",
        demoKey: "default",
      },
      {
        id: "checkbox-indeterminate",
        kind: "stateful",
        title: "Indeterminate",
        description:
          "Indeterminate is a visual state, not a third value: drive it from a parent that knows partial selection and clear it when children are fully checked or unchecked.",
        demoKey: "indeterminate",
      },
      {
        id: "checkbox-disabled",
        kind: "stateful",
        title: "Disabled",
        description:
          "Disabled checkboxes still need a Tooltip naming the reason; a greyed box with no explanation reads as a bug.",
        demoKey: "disabled",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Wrap related checkboxes in a <fieldset> with a <legend> so screen readers announce the group name before each option.",
        "Group label is a Title Case noun (Notifications, Required Permissions) without a trailing colon; acknowledgment labels are full sentences ending in a period.",
        "Indeterminate copy names the partial count next to the group label (3 of 5 selected); never leave the dash state unlabeled.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Checked state is controlled by the parent; validation on required acknowledgments fires on submit, not on blur, so checking and unchecking shouldn't flash an error.",
        "The parent computes and drives the indeterminate state from child selections.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "The click target already extends to the label, so no extra hit area is needed on mobile.",
        "Long labels wrap instead of truncating.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Checked fill, focus ring, and disabled greys follow theme variables.",
        "Disabled and enabled states remain distinguishable in dark mode.",
      ],
    },
  },
  choicebox: {
    slug: "choicebox",
    locale: "en-US",
    summary:
      "A larger form of Radio for choices with more detail — big tap targets plus room for descriptions and icons.",
    whenToUse: [
      "Use Choicebox when a choice benefits from a larger tap target plus a description or icon.",
      "Single-select for mutually exclusive choices, multi-select for additive ones — don't mix the two within one group.",
    ],
    whenNotToUse: [
      "Past 4-6 tiles, switch to Select or Combobox so the page doesn't scroll for a single field.",
      "When options are plain short text labels with no detail to show, a regular Radio is more compact.",
    ],
    examples: [
      {
        id: "choicebox-single",
        kind: "minimal",
        title: "Single-select",
        description: "A single-select tile group for mutually exclusive choices.",
        demoKey: "single-select",
      },
      {
        id: "choicebox-multi",
        kind: "variant",
        title: "Multi-select",
        description: "A multi-select tile group for additive choices.",
        demoKey: "multi-select",
      },
      {
        id: "choicebox-custom",
        kind: "advanced",
        title: "Custom content",
        description: "Places custom content (icons, descriptions, badges) inside the tiles.",
        demoKey: "custom-content",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The whole tile is the click target, but keyboard semantics stay radio/checkbox: arrow keys move within the group, Space toggles.",
        "Selection can't rely on border color alone; keep a selected state that assistive tech can read.",
      ],
    },
    controlledBehavior: {
      status: "covered",
      content: [
        "Selection is controlled by the parent; single-select reports the switch immediately, multi-select returns the full set.",
        "Disabled items stay out of the focus order and keyboard traversal.",
      ],
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "The tile grid wraps with container width and degrades to a single stacked column on narrow viewports.",
        "Tiles keep comfortable heights on mobile to serve as large tap targets.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Selected border, background, and description text colors follow theme variables.",
        "Selected and unselected tiles keep a clear hierarchy difference in dark mode.",
      ],
    },
  },
};
