import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_17_ZH: Record<string, ComponentGuide> = {
  link: {
    slug: "link",
    locale: "zh-CN",
    summary: "导航到站内页面或外部目标，并以平台品牌或通用外链图标传达目的地类型。",
    whenToUse: [
      "在段落、说明文字或导航列表中提供行内跳转。",
      "链接 GitHub、GitLab、Gitee 等受支持的代码托管平台时，让平台品牌图标帮助用户识别目的地。",
    ],
    whenNotToUse: [
      "会改变应用状态的操作应使用 Button；需要按钮外观的导航应使用 ButtonLink。",
      "不要把仅靠图标表达、没有可见文案的链接交给 Link；此组件面向文本链接。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "站内、平台与普通外链",
        description:
          "站内链接不附图标；代码托管平台把品牌图标放在左侧且不显示 ExternalLink；其他 HTTP(S) 外链在右侧显示通用外链指示符。",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "使用能独立说明目的地的可见文案，避免“点击这里”等脱离上下文后失去意义的标签。",
        "外链图标均为 aria-hidden；屏幕阅读器仍以链接文案作为无障碍名称。",
        "组件保留键盘 focus-visible 双环和原生锚点语义。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Link 是无内部状态的原生锚点包装；导航由 href 与浏览器处理。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Link 采用 inline-flex，使图标与文案在窄视口中保持同一链接单元。",
        "长链接文案的换行由所在文本容器控制，不设置固定宽度或断点。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "文字、下划线和图标均使用语义颜色 token，随浅色/深色主题切换。",
        "品牌图标通过 simpleicons mask + currentColor 呈现，不嵌入厂商固定色。",
      ],
    },
  },
};

export const GUIDES_17_EN: Record<string, ComponentGuide> = {
  link: {
    slug: "link",
    locale: "en-US",
    summary:
      "Navigates to internal pages or external destinations while identifying the destination with a platform brand or generic external-link icon.",
    whenToUse: [
      "Use for inline navigation inside prose, descriptions, or navigation lists.",
      "Use supported forge destinations such as GitHub, GitLab, or Gitee when a brand icon helps identify where the link leads.",
    ],
    whenNotToUse: [
      "Use Button for actions that mutate state; use ButtonLink when navigation needs a button treatment.",
      "Do not use Link as an icon-only control without a visible label; this component is designed for text links.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Internal, forge, and generic external links",
        description:
          "Internal links have no icon; forge links put the brand before the label and omit ExternalLink; other HTTP(S) links keep a generic trailing indicator.",
        demoKey: "default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "Use visible copy that identifies the destination without surrounding context; avoid labels such as Click here.",
        "External icons are aria-hidden, so the visible label remains the accessible name.",
        "The component preserves native anchor semantics and the shared keyboard focus-visible ring.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "Link is a stateless native-anchor wrapper; href and the browser own navigation.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "Inline-flex keeps the icon and label in one link unit on narrow viewports.",
        "The surrounding text container owns wrapping; Link adds no fixed width or breakpoint behavior.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "Text, underline, and icon colors use semantic tokens and adapt to light and dark themes.",
        "Forge brands render through a simpleicons mask with currentColor rather than embedding vendor colors.",
      ],
    },
  },
};
