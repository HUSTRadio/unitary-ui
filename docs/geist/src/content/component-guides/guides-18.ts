import type { ComponentGuide } from "../component-guide-schema";

export const GUIDES_18_ZH: Record<string, ComponentGuide> = {
  "continuous-surface": {
    slug: "continuous-surface",
    locale: "zh-CN",
    summary:
      "ContinuousSurface 根据元素实时尺寸生成连续曲率裁切路径，并在 JavaScript 或 clip-path 不可用时保留普通圆角。",
    whenToUse: [
      "用于孤立卡片、磁贴或近方形品牌无关表面，且形状确实属于设计系统语义时。",
      "矩形卡片使用保留直边的 continuousCornerPath；完整 superellipse 只用于近方形图标或头像。",
      "需要在响应式尺寸变化后保持同一视觉半径和曲线家族时。",
    ],
    whenNotToUse: [
      "不要机械应用到所有容器；普通 border-radius 更轻、更稳定。",
      "不要给长宽比悬殊的表面使用完整 superellipse，避免长边出现桶形观感。",
      "不要复制平台资源中的精确 path，也不要使用平台品牌曲线名。",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "曲率对比",
        description: "对比精确圆弧 p=2、默认连续曲率 p=3 和强调曲率 p=5。",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "组件保留 div 的原生属性；根据内容用途自行提供 landmark、heading 或可访问名称。",
        "形状只提供视觉分组，不应成为传达状态或交互含义的唯一方式。",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "ContinuousSurface 没有受控状态。",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "ResizeObserver 观察本地 border-box，缩放父级不会改变路径坐标；radius 自动限制为短边的一半。",
        "SSR 或不支持 path() 时使用 border-radius；增强后将普通圆角置零，避免背景双重裁切。",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "组件只负责裁切；颜色由调用方提供。CSS border 不会自动沿路径描边，有限采样折线也不等于严格连续曲率。",
        "阴影必须放在外层 wrapper，因为 clip-path 会裁掉元素自身的 box-shadow。",
      ],
    },
  },
};

export const GUIDES_18_EN: Record<string, ComponentGuide> = {
  "continuous-surface": {
    slug: "continuous-surface",
    locale: "en-US",
    summary:
      "ContinuousSurface measures its element and applies an independently derived continuous-corner clip path, retaining a circular fallback when JavaScript or clip-path is unavailable.",
    whenToUse: [
      "Use it for isolated cards, tiles, or near-square brand-neutral surfaces when shape is an intentional design-system semantic.",
      "Use continuousCornerPath with straight sides for rectangular cards; reserve a full superellipse for near-square icons or avatars.",
      "Use it when a responsive surface must preserve one visual radius and curve family after resizing.",
    ],
    whenNotToUse: [
      "Do not apply it mechanically to every container; ordinary border-radius is lighter and more stable.",
      "Do not use a full superellipse on a high-aspect-ratio surface because the long sides can look barrel-shaped.",
      "Do not copy exact paths from platform resources or use platform-brand names for the curve.",
    ],
    examples: [
      {
        id: "default",
        kind: "minimal",
        title: "Curve comparison",
        description: "Compares the exact circular p=2 baseline, default p=3 continuous curve, and emphasized p=5 curve.",
        demoKey: "Default",
      },
    ],
    accessibility: {
      status: "covered",
      content: [
        "The component preserves native div attributes; add a landmark, heading, or accessible name when the content requires one.",
        "Shape is only a visual grouping cue and must not be the sole carrier of state or interactive meaning.",
      ],
    },
    controlledBehavior: {
      status: "not-applicable",
      reason: "ContinuousSurface has no controlled state.",
    },
    responsiveBehavior: {
      status: "covered",
      content: [
        "ResizeObserver watches the local border-box, independent of ancestor transforms; the radius is capped at half the shorter side.",
        "SSR and browsers without path() support use border-radius; enhancement resets that radius to avoid clipping the painted background twice.",
      ],
    },
    themeBehavior: {
      status: "covered",
      content: [
        "The component owns clipping; callers provide color. CSS borders do not trace the path, and finite line-segment sampling is not strictly continuous curvature.",
        "Place shadows on a parent wrapper because clip-path clips the surface's own box-shadow.",
      ],
    },
  },
};
