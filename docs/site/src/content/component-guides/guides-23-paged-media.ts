import type { ComponentGuide, GuideLocale } from "../component-guide-schema";

const content = {
  "zh-CN": {
    carousel: {
      summary: "Carousel 是图片轮播扩展，支持方向按钮、图片指示器、键盘、水平滑动和滚轮翻页。",
      whenToUse: ["商品图片、文章插图或风景图集需要逐张浏览时。"],
      whenNotToUse: ["用户必须同时比较多张图片时使用网格。"],
      examples: [
        {
          id: "default",
          kind: "minimal",
          title: "图片图集",
          description: "浏览本地图片，使用指示器、按钮或横向手势切换。",
          demoKey: "default",
        },
      ],
      accessibility: {
        status: "covered",
        content: [
          "每张图片必须提供 alt；当前图片指示器带有 aria-current；进度通过礼貌播报更新。",
          "在图片区域聚焦后使用左右方向键、Home 和 End；非当前图片不可聚焦。",
        ],
      },
      controlledBehavior: {
        status: "covered",
        content: [
          "index 是零起始索引；省略时使用 defaultIndex 和内部状态；onIndexChange 报告按钮、键盘和手势选择。",
          "loop 仅使方向按钮在首尾循环；手势会停在边界。没有自动播放。",
        ],
      },
      responsiveBehavior: {
        status: "covered",
        content: ["图片区域保持 16:9 并使用 object-cover；控制按钮为 44px，空间不足时换行。"],
      },
      themeBehavior: {
        status: "covered",
        content: ["边框、图片说明、按钮和指示器使用主题 token。"],
      },
    },
    "full-page-scroller": {
      summary:
        "FullPageScroller 是带触发阈值的整屏滚动扩展；小幅手势不移动，达到阈值后切换一整屏。",
      whenToUse: ["演示、分屏叙事和一次浏览一个区块的页面。"],
      whenNotToUse: ["长文档、表格和普通网页内容应使用原生滚动或 Scroller。"],
      examples: [
        {
          id: "default",
          kind: "minimal",
          title: "整屏滚动与全屏体验",
          description: "鼠标累计 80px 或手指滑动 50px 后切屏；可进入浏览器全屏，Escape 退出。",
          demoKey: "default",
        },
      ],
      accessibility: {
        status: "covered",
        content: [
          "聚焦容器后使用方向键、PageUp/PageDown、Home/End；各屏具有序号标签。",
          "非当前屏设置 inert 与 aria-hidden；内部输入控件保留自己的键盘行为；减少动态效果偏好关闭过渡。",
        ],
      },
      controlledBehavior: {
        status: "covered",
        content: [
          "index 是零起始索引；defaultIndex 初始化非受控状态；onIndexChange 报告请求的下一屏。",
          "一次滚轮手势及其惯性尾部只翻一屏；新手势需要等待过渡结束和 160ms 静默。多指和缩放手势不触发翻屏。",
        ],
      },
      responsiveBehavior: {
        status: "covered",
        content: [
          "默认高度是 100dvh；预览可覆盖为固定高度。orientation 支持 vertical/horizontal。",
          "各屏溢出内容先在内部滚动，首尾边界允许页面继续滚动。",
        ],
      },
      themeBehavior: {
        status: "covered",
        content: ["容器不强制背景；演示使用共享主题 token，过渡使用 slower 时长和 ease-snap。"],
      },
    },
    "lazy-load": {
      summary: "LazyLoad 是基于 IntersectionObserver 的延迟挂载扩展，适用于图片及较重的内容子树。",
      whenToUse: ["长列表、屏外图表或媒体希望在接近视口时才挂载。"],
      whenNotToUse: ['首屏关键内容应立即显示；简单图片优先使用原生 loading="lazy"。'],
      examples: [
        {
          id: "default",
          kind: "minimal",
          title: "局部滚动容器中的图片",
          description: "占位骨架保留图片宽高比；滚动后观察已挂载数量增加，离开视口后仍保持挂载。",
          demoKey: "default",
        },
      ],
      accessibility: {
        status: "covered",
        content: ["为加载后的图片提供 alt；占位尺寸由调用方预留；LazyLoad 不默认播报每次挂载。"],
      },
      controlledBehavior: {
        status: "covered",
        content: [
          "首次达到 rootMargin 与 threshold 条件时挂载一次；之后保留内容及其内部状态。",
          "onLoad 表示挂载而非网络请求完成；disabled 或缺少 IntersectionObserver 时立即渲染。",
          "延迟内容不包含在服务端 HTML 中；需要立即服务端渲染时使用 disabled。",
        ],
      },
      responsiveBehavior: {
        status: "covered",
        content: [
          "root 可以是局部滚动容器；默认 null 表示浏览器视口，rootMargin 默认 200px。",
          "通过宽高、min-height 或 aspect-ratio 保留占位尺寸，避免观察器目标没有高度及布局跳动。",
        ],
      },
      themeBehavior: {
        status: "covered",
        content: ["组件不设置视觉主题；演示通过 Skeleton 和背景 token 适配主题。"],
      },
    },
  },
  "en-US": {
    carousel: {
      summary:
        "Carousel is an image gallery extension with arrow controls, indicators, keyboard navigation, horizontal swipes and wheel paging.",
      whenToUse: [
        "Browse product images, article illustrations or a landscape gallery one image at a time.",
      ],
      whenNotToUse: ["Use a grid when users need to compare multiple images simultaneously."],
      examples: [
        {
          id: "default",
          kind: "minimal",
          title: "Image gallery",
          description: "Browse local images using indicators, arrows or horizontal gestures.",
          demoKey: "default",
        },
      ],
      accessibility: {
        status: "covered",
        content: [
          "Every image requires alt text; the current indicator has aria-current and progress is announced politely.",
          "Focus the image region to use Left/Right, Home and End; inactive images cannot receive focus.",
        ],
      },
      controlledBehavior: {
        status: "covered",
        content: [
          "index is zero-based; omit it to use defaultIndex and internal state. onIndexChange reports control, keyboard and gesture selection.",
          "loop wraps arrow controls only; gestures stop at the boundary. There is no autoplay.",
        ],
      },
      responsiveBehavior: {
        status: "covered",
        content: [
          "The image region uses a 16:9 aspect ratio and object-cover. Controls are 44px and wrap when space is limited.",
        ],
      },
      themeBehavior: {
        status: "covered",
        content: ["Borders, captions, controls and indicators use theme tokens."],
      },
    },
    "full-page-scroller": {
      summary:
        "FullPageScroller is a threshold-based paging extension: small gestures leave the view still, and deliberate gestures change one complete section.",
      whenToUse: [
        "Presentations, section-based storytelling and pages that show one section at a time.",
      ],
      whenNotToUse: [
        "Use native scrolling or Scroller for long documents, tables and ordinary page content.",
      ],
      examples: [
        {
          id: "default",
          kind: "minimal",
          title: "Full page scrolling and fullscreen",
          description:
            "Accumulate 80px of wheel input or swipe 50px to change sections; enter browser fullscreen and exit with Escape.",
          demoKey: "default",
        },
      ],
      accessibility: {
        status: "covered",
        content: [
          "Focus the region to use arrows, PageUp/PageDown, Home and End. Each section has an ordinal label.",
          "Inactive sections are inert and aria-hidden. Nested controls retain their keyboard behavior; reduced motion disables transitions.",
        ],
      },
      controlledBehavior: {
        status: "covered",
        content: [
          "index is zero-based; defaultIndex initializes uncontrolled state. onIndexChange reports the requested section.",
          "One wheel gesture and its momentum advance one section; a new gesture waits for the transition and a 160ms quiet gap. Multi-touch and zoom gestures do not page.",
        ],
      },
      responsiveBehavior: {
        status: "covered",
        content: [
          "Default height is 100dvh; previews can override it with a fixed height. orientation accepts vertical/horizontal.",
          "Overflowing section content scrolls internally first. At the first and last boundaries, page scrolling continues.",
        ],
      },
      themeBehavior: {
        status: "covered",
        content: [
          "The region imposes no background; demos use shared tokens and transitions use the slower duration and ease-snap.",
        ],
      },
    },
    "lazy-load": {
      summary:
        "LazyLoad is an IntersectionObserver extension that defers mounting images and expensive content subtrees.",
      whenToUse: [
        "Mount long-list content, offscreen charts or media as they approach the viewport.",
      ],
      whenNotToUse: [
        'Render critical initial content eagerly; prefer native loading="lazy" for simple images.',
      ],
      examples: [
        {
          id: "default",
          kind: "minimal",
          title: "Images in a local scroll container",
          description:
            "Skeletons preserve image aspect ratios; scrolling increases the mounted count and content stays mounted after leaving view.",
          demoKey: "default",
        },
      ],
      accessibility: {
        status: "covered",
        content: [
          "Provide alt text on revealed images and reserve placeholder dimensions. LazyLoad does not announce every mount by default.",
        ],
      },
      controlledBehavior: {
        status: "covered",
        content: [
          "Mounts once after the rootMargin and threshold conditions are met; content and internal state then remain mounted.",
          "onLoad reports mounting, not network completion. disabled or missing IntersectionObserver renders eagerly.",
          "Deferred children are absent from server HTML; use disabled when eager server rendering is required.",
        ],
      },
      responsiveBehavior: {
        status: "covered",
        content: [
          "root can be a local scroll container; null means the browser viewport and rootMargin defaults to 200px.",
          "Reserve dimensions with width/height, min-height or aspect-ratio to avoid a zero-height observer target and layout shifts.",
        ],
      },
      themeBehavior: {
        status: "covered",
        content: [
          "The component adds no visual theme; the demo uses Skeleton and background tokens.",
        ],
      },
    },
  },
};

function guides(locale: GuideLocale): Record<string, ComponentGuide> {
  return Object.fromEntries(
    Object.entries(content[locale]).map(([slug, guide]) => [
      slug,
      { ...guide, slug, locale } as ComponentGuide,
    ]),
  );
}
export const PAGED_MEDIA_GUIDES_ZH = guides("zh-CN");
export const PAGED_MEDIA_GUIDES_EN = guides("en-US");
