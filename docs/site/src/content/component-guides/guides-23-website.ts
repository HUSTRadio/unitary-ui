import type { ComponentGuide, GuideLocale } from "../component-guide-schema";

function guides(locale: GuideLocale): Record<string, ComponentGuide> {
  const chinese = locale === "zh-CN";
  return Object.fromEntries(
    ["site-navigation", "scroll-reveal", "back-to-top"].map((slug) => {
      const navigation = slug === "site-navigation";
      const reveal = slug === "scroll-reveal";
      const summary = navigation
        ? chinese
          ? "官网分组导航：桌面面板与移动模态目录共享链接数据。"
          : "Grouped website navigation sharing links between desktop panels and a modal mobile directory."
        : reveal
          ? chinese
            ? "保持原生滚动的区块显现；缺少观察器或减少动效时直接显示。"
            : "Section reveal preserving native scrolling; content remains visible without an observer or with reduced motion."
          : chinese
            ? "根据绝对滚动位置显示返回顶部控件，支持文档与明确的滚动容器。"
            : "A return control driven by absolute scroll position, supporting documents and explicit containers.";
      return [
        slug,
        {
          slug,
          locale,
          summary,
          whenToUse: [summary],
          whenNotToUse: [
            navigation
              ? chinese
                ? "应用命令使用 MenuBar；常驻侧栏使用 SidebarNav。"
                : "Use MenuBar for application commands and SidebarNav for persistent side navigation."
              : chinese
                ? "不要用来劫持全站滚轮或触摸滚动。"
                : "Do not use it to intercept global wheel or touch scrolling.",
          ],
          examples: [
            {
              id: "default",
              kind: "minimal",
              title: chinese ? "基础用法" : "Basic usage",
              description: summary,
              demoKey: "default",
            },
          ],
          accessibility: {
            status: "covered",
            content: [
              navigation
                ? chinese
                  ? "保持 nav、button、a 语义，Escape 关闭桌面面板并归还触发器焦点；移动使用模态 Sheet，具备关闭入口。"
                  : "Uses nav, button, and anchor semantics. Escape dismisses desktop panels and restores trigger focus; mobile uses a modal Sheet with an explicit close control."
                : reveal
                  ? chinese
                    ? "内容在服务端和无观察器环境中可见；减少动效直接呈现，键盘焦点进入内容时取消隐藏。"
                    : "Content is visible on the server and without observers. Reduced motion and keyboard focus reveal content directly."
                  : chinese
                    ? "提供可访问名称。可指定可聚焦的 focusTarget，减少动效使用立即滚动；onClick preventDefault 可取消默认操作。"
                    : "Supply an accessible name. A focusable focusTarget restores reading position; reduced motion uses immediate scrolling, and onClick preventDefault cancels the default action.",
            ],
          },
          controlledBehavior: {
            status: "covered",
            content: [
              navigation
                ? chinese
                  ? "组件管理打开状态；onOpenChange 用于协调 Navbar.forceVisible，activeHref 变化或跨断点时关闭。"
                  : "Open state is internal. onOpenChange coordinates Navbar.forceVisible; activeHref changes and breakpoint crossings dismiss navigation."
                : chinese
                  ? "root/target 明确指定滚动 owner；省略使用文档。"
                  : "Specify root/target to select a scroll owner; omission uses the document.",
            ],
          },
          responsiveBehavior: {
            status: "covered",
            content: [
              navigation
                ? chinese
                  ? "desktopBreakpoint 支持 768/1024/1280px。触屏使用点击，长移动目录单独滚动，底部操作可触达；桌面面板定位至最近的已定位祖先。"
                  : "desktopBreakpoint supports 768/1024/1280px. Touch uses activation, long mobile directories scroll separately with reachable actions; desktop panels align to the nearest positioned ancestor."
                : chinese
                  ? "不修改页面布局或滚动惯性；由调用方决定区块和控件的摆放。"
                  : "Does not change page layout or scrolling inertia; callers place sections and controls.",
            ],
          },
          themeBehavior: {
            status: "covered",
            content: [
              ...(navigation ? [chinese
                ? "Glass 下，Navbar 背景与前景分层，使用 Regular 填充与 24px 模糊；桌面 hover 面板使用独立的 Dense 透射与 20px 均匀模糊（--material-texture-glass-overlay-blur），不会错误复用顶栏范围。操作控件提供克制追光与 hover 过渡，不改变位置。作者 panelClassName 的背景、滤镜及局部 blur token 覆盖优先。"
                : "With Glass, Navbar separates its background and foreground using Regular fill and 24px blur. Desktop hover panels independently transmit with Dense fill and 20px uniform blur (--material-texture-glass-overlay-blur), rather than sharing the header's limited sampling area. Actions use restrained glints and hover transitions without moving. Authored panelClassName backgrounds, filters and local blur token overrides take precedence."] : []),
              chinese
                ? "使用共享语义颜色和动效 token；双主题保持同一交互契约。"
                : "Uses shared semantic colors and motion tokens with the same interaction contract in both themes.",
            ],
          },
        } satisfies ComponentGuide,
      ];
    }),
  );
}

export const WEBSITE_GUIDES_ZH = guides("zh-CN");
export const WEBSITE_GUIDES_EN = guides("en-US");
