import type { ComponentGuide, GuideLocale } from "../component-guide-schema";

type GuideContent = Omit<ComponentGuide, "slug" | "locale">;

const content: Record<GuideLocale, Record<string, GuideContent>> = {
  "zh-CN": {
    "sub-frame": {
      summary: "SubFrame 是一个局部浮层框架，把浮层限定在页面中的某一块区域内。",
      whenToUse: [
        "App Shell、设备预览或文档示例卡这类「页面中的页面」需要在自身范围内弹出 BottomSheet 或 HamburgerMenu 时。",
        "同一页面要并排演示多个互不干扰的浮层时。",
      ],
      whenNotToUse: [
        "浮层本来就该覆盖整个视口时，直接渲染 BottomSheet 即可，不要外包一层 SubFrame。",
        "只是需要滚动或裁剪内容时，普通 overflow 容器更直接。",
      ],
      examples: [{ id: "default", kind: "minimal", title: "局部浮层", description: "在框架内打开底部弹层，浮层不会离开框架。", demoKey: "default" }],
      accessibility: { status: "covered", content: ["SubFrame 只渲染一个 div，不引入任何语义；框架内的浮层仍各自负责焦点陷阱、Escape 关闭与焦点归还。"] },
      controlledBehavior: { status: "not-applicable", reason: "SubFrame 没有内部状态；它只把自身元素通过上下文提供给浮层。" },
      responsiveBehavior: { status: "covered", content: ["框架尺寸完全由调用方决定；浮层的档位比例与拖拽幅度改为按框架的 client 尺寸换算。"] },
      themeBehavior: { status: "covered", content: ["SubFrame 不设置视觉样式；颜色与材质由框架内的组件沿用语义 token 决定。"] },
    },
  },
  "en-US": {
    "sub-frame": {
      summary: "SubFrame scopes overlays to one region of a page instead of the whole viewport.",
      whenToUse: [
        "Use it inside app shells, device previews, or docs demo cards that need their own BottomSheet or HamburgerMenu.",
        "Use it when one page must demo several overlays that should not interfere with each other.",
      ],
      whenNotToUse: [
        "Skip it when an overlay should cover the whole viewport — render BottomSheet directly.",
        "Reach for a plain overflow container when you only need to scroll or clip content.",
      ],
      examples: [{ id: "default", kind: "minimal", title: "Local overlay", description: "Open a bottom sheet inside the frame; the overlay never leaves it.", demoKey: "default" }],
      accessibility: { status: "covered", content: ["SubFrame renders a plain div and adds no semantics; nested overlays keep their own focus trap, Escape handling, and focus return."] },
      controlledBehavior: { status: "not-applicable", reason: "SubFrame has no internal state; it only shares its own element with nested overlays." },
      responsiveBehavior: { status: "covered", content: ["The caller owns the frame size; detent ratios and drag distances are computed from the frame's client size."] },
      themeBehavior: { status: "covered", content: ["SubFrame sets no visual styles; nested components keep using semantic color and material tokens."] },
    },
  },
};

function guides(locale: GuideLocale): Record<string, ComponentGuide> {
  return Object.fromEntries(Object.entries(content[locale]).map(([slug, guide]) => [slug, { ...guide, slug, locale }]));
}

export const SUB_FRAME_GUIDES_ZH = guides("zh-CN");
export const SUB_FRAME_GUIDES_EN = guides("en-US");
