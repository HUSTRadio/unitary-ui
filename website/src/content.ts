export const SECTION_IDS = ["hero", "interact", "appearance", "motion", "start"] as const;

export const WEBSITE_COPY = {
  "en-US": {
    start: "Get Started", docs: "Docs", home: "Back to the first screen", skip: "Skip to content",
    next: "Next screen", previous: "Previous screen", navigation: "Screen navigation", scrollProgress: "Page scroll progress", loading: "Loading demo…",
    language: "Language", completeGuide: "Read the full guide", install: "Install the library", example: "Your first component",
    sections: ["Create", "Interaction", "Appearance", "Motion", "Get started"],
    headings: ["Create the One.", "Every detail, interactive.", "One system. Your expression.", "Motion with purpose.", "Start creating."],
    descriptions: ["", "Real components. Real states. Try the details that make an interface feel right.", "Semantic colors, light and dark themes, and materials that respond together.", "State transitions and controllable SVG illustrations, with respect for your motion preferences.", "A package, a stylesheet, and your first component. Take it from here."],
  },
  "zh-CN": {
    start: "开始使用", docs: "文档", home: "返回首屏", skip: "跳到内容",
    next: "下一屏", previous: "上一屏", navigation: "屏幕导航", scrollProgress: "页面滚动进度", loading: "正在加载演示…",
    language: "语言", completeGuide: "阅读完整指南", install: "安装组件库", example: "你的第一个组件",
    sections: ["创造", "交互", "外观", "动效", "开始使用"],
    headings: ["Create the One.", "每个细节，都能交互。", "同一体系，不同表达。", "有目的的动效。", "开始创造。"],
    descriptions: ["", "真实组件，真实状态。亲手体验让界面自然顺手的每个细节。", "语义颜色、深浅主题与材质，共同构成一致的界面。", "状态切换与可控制的 SVG 插画，始终尊重你的动画偏好。", "安装组件库，引入样式，写下第一个组件。从这里开始。"],
  },
} as const;
