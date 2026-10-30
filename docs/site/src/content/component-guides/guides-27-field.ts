import type { ComponentGuide } from "../component-guide-schema";

const FIELD_ZH: ComponentGuide = {
  slug: "field",
  locale: "zh-CN",
  summary: "把标签、控件、说明和错误消息组合成一个字段，取值与校验仍由控件和调用方负责。",
  whenToUse: [
    "自定义控件或第三方控件需要与 Input / Select / Textarea 一致的标签与错误排版时。",
    "一个字段需要同时显示辅助说明和错误消息，且希望两者的间距、字号统一。",
    "希望字段整体参与外层布局（宽度、flex 排列）时，Field 作为容器承担 className。",
  ],
  whenNotToUse: [
    "Input / Select / Textarea 已内置 label 与 error；再包一层 Field 会出现两个标签。",
    "需要校验规则、异步校验或表单状态时使用表单库；Field 不接管控件状态。",
    "需要卡片式的分组标题、页脚操作与整体错误态时使用 Fieldset。",
  ],
  examples: [
    {
      id: "field-basic",
      kind: "minimal",
      title: "标签、说明与错误",
      description:
        "Field 组合标签、说明与错误消息；控件本身保持受控，错误文案由调用方决定。",
      demoKey: "basic",
      showDescriptionInDemo: true,
    },
  ],
  accessibility: {
    status: "not-applicable",
    reason:
      "本轮不含无障碍增强：Field 只提供 label 与 htmlFor 的关联，aria-describedby / aria-invalid 由调用方自行接线，错误消息经 FieldError 的 role=\"alert\" 播报。",
  },
  controlledBehavior: {
    status: "not-applicable",
    reason: "Field 不持状态也不读控件值；value / onChange 直接由调用方与控件约定。",
  },
  responsiveBehavior: {
    status: "covered",
    content: [
      "根容器使用 w-full min-w-0，宽度跟随外层布局，不会撑破栅格或窄屏容器。",
      "说明与错误文案按控件宽度换行；错误消息在 FieldError 内已声明 break-words。",
      "没有断点分支：字段在不同视口下的排版差异只来自外层布局，不来自 Field 本身。",
    ],
  },
  themeBehavior: {
    status: "covered",
    content: [
      "标签使用 text-gray-900，说明使用 text-gray-700，错误使用 --error-foreground 语义 token，深浅色主题自动跟随。",
      "Field 不定义新的颜色或间距 token，因此不会与主题切换产生额外状态。",
    ],
  },
};

const FIELD_EN: ComponentGuide = {
  slug: "field",
  locale: "en-US",
  summary:
    "Compose a label, control, helper text and error message into one field while the control keeps its own value and validation.",
  whenToUse: [
    "A custom or third-party control needs the same label and error typography as Input, Select and Textarea.",
    "One field must show helper text and an error message with consistent spacing and size.",
    "The field as a whole should take part in the surrounding layout, so the container carries the caller className.",
  ],
  whenNotToUse: [
    "Input, Select and Textarea already render their own label and error; wrapping them in Field produces two labels.",
    "Validation rules, async checks or form state belong to a form library; Field does not own control state.",
    "Card-style grouping with a heading, footer actions and a shared error state belongs to Fieldset.",
  ],
  examples: [
    {
      id: "field-basic",
      kind: "minimal",
      title: "Label, helper text and error",
      description:
        "Field composes the label, helper text and error message; the control stays controlled and the caller decides the copy.",
      demoKey: "basic",
      showDescriptionInDemo: true,
    },
  ],
  accessibility: {
    status: "not-applicable",
    reason:
      "Accessibility work is out of scope this round: Field only provides the label/htmlFor association. Callers wire aria-describedby and aria-invalid themselves, and FieldError announces through role=\"alert\".",
  },
  controlledBehavior: {
    status: "not-applicable",
    reason: "Field holds no state and never reads the control value; value and onChange stay between the caller and the control.",
  },
  responsiveBehavior: {
    status: "covered",
    content: [
      "The root uses w-full min-w-0, so width follows the surrounding layout instead of overflowing grids or narrow containers.",
      "Helper text and error copy wrap at the control width; FieldError already declares break-words.",
      "There are no breakpoint branches: viewport differences come from the outer layout, not from Field.",
    ],
  },
  themeBehavior: {
    status: "covered",
    content: [
      "The label uses text-gray-900, helper text uses text-gray-700 and the error uses the --error-foreground semantic token, so both themes follow automatically.",
      "Field introduces no new color or spacing tokens, so theme switching adds no extra state.",
    ],
  },
};

export const FIELD_GUIDES_ZH: Record<string, ComponentGuide> = { field: FIELD_ZH };
export const FIELD_GUIDES_EN: Record<string, ComponentGuide> = { field: FIELD_EN };
