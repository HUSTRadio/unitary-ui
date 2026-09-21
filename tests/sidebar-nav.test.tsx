import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { LucideIcon } from "lucide-react";

import { SidebarNav } from "../src/components/ui/sidebar-nav";

const groups = [
  {
    label: "Getting started",
    items: [
      { label: "Introduction", to: "/introduction" },
      { label: "Installation", to: "/installation" },
    ],
  },
  {
    label: "Components",
    items: [{ label: "Button", to: "/button" }],
  },
];

/** Extract the rendered <nav …>…</nav> substring from static markup. */
function navMarkup(props: Record<string, unknown>): string {
  const markup = renderToStaticMarkup(
    <SidebarNav groups={groups} {...(props as never)} />,
  );
  const start = markup.indexOf("<nav");
  const end = markup.lastIndexOf("</nav>");
  return markup.slice(start, end + 6);
}

describe("SidebarNav", () => {
  it("renders nav[aria-label] > ul > li > a structure", () => {
    const markup = navMarkup({});

    expect(markup).toMatch(/<nav [^>]*aria-label="[^"]+"/);
    expect(markup).toContain("<ul");
    expect(markup).toContain("<li>");
    expect(markup).toContain('href="/introduction"');
    expect(markup).toContain('<span class="truncate ink-shift-cjk">Introduction</span>');
  });

  it("renders group labels", () => {
    const markup = navMarkup({});
    expect(markup).toContain("Getting started");
    expect(markup).toContain("Components");
  });

  it("默认不折叠：标题是静态 heading，不引入 button / aria-expanded", () => {
    const markup = navMarkup({});
    expect(markup).toContain('data-slot="sidebar-nav-heading"');
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("aria-expanded");
    expect(markup).not.toContain('data-slot="sidebar-nav-content"');
  });

  it("collapsible 开启后标题不是 button：普通标题 + disclosure 语义，无按钮外观", () => {
    const markup = navMarkup({ collapsible: true });
    const heading = markup.match(/<div[^>]*data-slot="sidebar-nav-heading"[^>]*>/)?.[0];

    expect(heading).toBeDefined();
    // 折叠开关不再是按钮元素，也没有按钮外观（无悬停底色/边框/药丸）
    expect(markup).not.toContain("<button");
    expect(heading).not.toContain("hover:bg-");
    expect(heading).not.toContain("border");
    // 但 disclosure 语义与键盘可达性保留
    expect(heading).toContain('role="button"');
    expect(heading).toContain('tabindex="0"');
    expect(heading).toContain('aria-expanded="true"');
    expect(heading).toMatch(/aria-controls="([^"]+)"/);
    expect(markup).toContain(`id="${heading?.match(/aria-controls="([^"]+)"/)?.[1]}"`);
    // 折叠行为来自标准 Collapse（内容常驻 + 标准高度过渡），侧栏不再自持技法
    expect(markup).toContain('data-icon="chevron"');
    expect(markup).toContain('data-indicator-align="inline"');
    expect(markup).toContain("collapse-content-motion");
    expect(markup).toContain("data-[state=open]:h-[var(--collapse-content-height)]");
  });

  it("marks the active item with aria-current=page and the shared highlight contract", () => {
    const markup = navMarkup({ activeTo: "/button" });

    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain("bg-gray-100");
    expect(markup).toContain("text-gray-1000");
    expect(markup).toContain("font-medium");
    // 选中态相对悬停的唯一几何差异：左侧 2×16px 指示条
    expect(markup.split('data-slot="sidebar-nav-indicator"').length - 1).toBe(1);
  });

  it("non-active items use text-gray-900 hover:bg-gray-100 and carry no indicator", () => {
    const markup = navMarkup({ activeTo: "/button" });

    expect(markup).toContain("text-gray-900");
    expect(markup).toContain("hover:bg-gray-100");
    // Exactly one active item
    expect(markup.split('aria-current="page"').length - 1).toBe(1);
    expect(markup.split('data-slot="sidebar-nav-heading"').length - 1).toBe(2);
  });

  it("side=left renders no own divider (aside 持有定线), side=right renders border-l on the container", () => {
    // sidebar 右分割线由 aside（sticky 定线）持有；SidebarNav 不再自带 border-r，
    // 否则与 aside border-r 形成双线重叠且随内容滚动（回归修复 2026-08-25）
    expect(navMarkup({ side: "left" })).not.toContain("border-r");

    expect(navMarkup({ side: "right" })).toContain("border-l");
    expect(navMarkup({ side: "right" })).not.toContain("border-r");
  });

  it("aligns headings to the item pill's left edge while items keep the 14px inset", () => {
    const markup = navMarkup({});
    expect(markup).toMatch(
      /data-slot="sidebar-nav-heading"[^>]*class="[^"]*nav-space-parent[^"]*text-style-nav-heading[^"]*font-semibold[^"]*text-gray-1000/,
    );
    expect(markup).toMatch(
      /data-slot="sidebar-nav-item"[^>]*class="[^"]*-mx-1 px-3\.5[^"]*nav-item-row[^"]*text-style-nav-item/,
    );
    // 一级小标题不做行内缩（与 px-1 包裹里的药丸左缘同轴），条目才内缩 14px
    expect(markup).not.toMatch(/data-slot="sidebar-nav-heading"[^>]*class="[^"]*px-3\.5/);
    expect(markup).not.toMatch(/data-slot="sidebar-nav-heading"[^>]*class="[^"]*-mx-1/);
    // 分组内容统一包裹 px-1：抵消条目的 -mx-1（药丸左缘 = 内容盒边缘，且不横向溢出）
    expect(markup).toContain('<div class="px-1">');
  });

  it("separates second-level groups with a short divider and breathing room, no indentation", () => {
    const markup = renderToStaticMarkup(
      <SidebarNav
        groups={[
          {
            label: "Components",
            items: [{ label: "Button", to: "/components/button" }],
            subgroups: [
              { label: "Actions", items: [{ label: "Button", to: "/components/button" }] },
              { label: "Navigation", items: [{ label: "Tabs", to: "/components/tabs" }] },
            ],
          },
        ]}
      />,
    );

    // 组间恰好一条 40×1 短分割线（首组之前没有）：复用标准 Separator 的 length="short"
    expect(markup.split('data-slot="sidebar-nav-subgroup-divider"').length - 1).toBe(1);
    const divider =
      markup.match(/<div[^>]*data-slot="sidebar-nav-subgroup-divider"[^>]*>/)?.[0] ?? "";
    expect(divider).toContain('data-length="short"');
    expect(divider).toContain("shrink-0");
    for (const utility of ["h-px", "w-10", "-ml-1", "nav-space-sibling", "bg-gray-alpha-400"]) {
      expect(divider).toContain(utility);
    }
    // 节奏走 token：一级标题 → 第一个小组 6px（nav-space-parent）；组间 4+1+4 = 9px
    expect(markup).toMatch(/data-slot="sidebar-nav-heading"[^>]*class="[^"]*nav-space-parent/);
    expect(markup).toMatch(
      /data-slot="sidebar-nav-subheading"[^>]*class="[^"]*-mx-1[^"]*text-style-nav-subheading/,
    );
    expect(markup.indexOf("Actions")).toBeLessThan(
      markup.indexOf('data-slot="sidebar-nav-subgroup-divider"'),
    );

    // 小标题不做文字缩进（无 pl-*）；条目的 14px 内缩由药丸 padding 承担
    expect(markup).not.toMatch(/\bpl-[0-9]/);
    expect(markup).toContain('<span class="truncate ink-shift-cjk">Actions</span>');
    expect(markup).toContain('<span class="truncate ink-shift-cjk">Button</span>');
  });

  it("keeps the HIG item row geometry (token height) and the rounded-md pill", () => {
    // 行高走 token：桌面 36px（--uni-nav-item-height）；圆角 6px 不变；行距放宽到 4px
    const markup = navMarkup({});
    expect(markup).toMatch(
      /data-slot="sidebar-nav-item"[^>]*class="[^"]*nav-item-row[^"]*rounded-md[^"]*text-style-nav-item/,
    );
    expect(markup).toMatch(/data-slot="sidebar-nav-heading"[^>]*class="[^"]*h-8/);
    expect(markup).toContain('<ul class="space-y-1">');
  });

  it("does not constrain width (outer layer controls width; only the 2px indicator has a width)", () => {
    const markup = navMarkup({ activeTo: "/button" });
    const navTag = markup.slice(0, markup.indexOf(">"));
    expect(navTag).not.toMatch(/\bw-/);
    expect(markup).not.toContain("w-full");
    // 除指示条 h-4 w-0.5 外不得出现其它宽度工具类
    expect(markup.match(/\bw-[^\s"]+/g)).toEqual(["w-0.5"]);
  });

  it("renders an optional lucide icon per item", () => {
    const Icon = vi.fn() as unknown as LucideIcon;
    const iconGroups = [
      {
        label: "Nav",
        items: [{ label: "Home", to: "/home", icon: Icon }],
      },
    ];
    const markup = renderToStaticMarkup(
      <SidebarNav groups={iconGroups} />,
    );
    // The icon component is rendered inside the link
    expect(Icon).toHaveBeenCalled();
    expect(markup).toMatch(/<a [^>]*>.*<\/a>/);
    // 图标本身占住标签列（14 + 16 + 8 = 38px），有图标条目不再给文字补缩进
    expect(markup).toContain('<span class="truncate ink-shift-cjk">Home</span>');
  });

  it("renders the item status badge with its tone (default new) pushed to the row end", () => {
    const markup = renderToStaticMarkup(
      <SidebarNav
        groups={[
          {
            label: "Nav",
            items: [
              { label: "Home", to: "/home", badge: { label: "New" } },
              { label: "Docs", to: "/docs", badge: { label: "Updated", tone: "updated" } },
            ],
          },
        ]}
      />,
    );

    // 状态标记 = 标准 Badge（圆角矩形 + compact + soft），侧栏不再自持样式
    expect(markup.split('data-slot="badge"').length - 1).toBe(2);
    expect(markup).toContain('data-tone="new"');
    expect(markup).toContain('data-tone="updated"');
    expect(markup).toContain('data-shape="rounded"');
    expect(markup).toContain('data-variant="blue"');
    expect(markup).toContain('data-variant="gray"');
    expect(markup).toMatch(/data-slot="badge"[^>]*class="[^"]*rounded-sm[^"]*h-5[^"]*px-1\.5/);
    expect(markup).toMatch(/class="[^"]*bg-blue-100[^"]*text-blue-900/);
    expect(markup).toMatch(/class="[^"]*bg-gray-100[^"]*text-gray-900/);
    expect(markup).toContain(">New</span>");
    expect(markup).toContain(">Updated</span>");
    // 拉丁标签走 Badge 默认（拉丁折中）档，不切中文字形档
    expect(markup).not.toContain("[--uni-ink-shift:var(--uni-ink-shift-cjk)]");
    // 胶囊推到行尾（右缘对齐）
    expect(markup).toContain("ml-auto");
  });

  it("switches the nav badge to the CJK ink token when its label is Chinese", () => {
    const markup = renderToStaticMarkup(
      <SidebarNav
        groups={[
          {
            label: "导航",
            items: [{ label: "首页", to: "/home", badge: { label: "新增" } }],
          },
        ]}
      />,
    );

    // 中文字形墨迹几乎铺满 em，需要中文字形档补偿；同一 Badge 的拉丁标签不切档
    expect(markup).toContain("[--uni-ink-shift:var(--uni-ink-shift-cjk)]");
  });

  it("omits the badge entirely when no item declares one", () => {
    expect(navMarkup({})).not.toContain('data-slot="badge"');
  });

  it("leaves native anchor navigation intact when onNavigate is omitted", async () => {
    const { createNavigateHandler } = await import(
      "../src/components/ui/sidebar-nav"
    );
    const preventDefault = vi.fn();
    const handler = createNavigateHandler(undefined, "/button");
    handler({
      preventDefault,
    } as unknown as React.MouseEvent<HTMLAnchorElement>);
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("keeps modifier-click native (new tab / window) even when onNavigate is provided", async () => {
    const { createNavigateHandler } = await import(
      "../src/components/ui/sidebar-nav"
    );
    const onNavigate = vi.fn();
    for (const modifier of ["metaKey", "ctrlKey", "shiftKey", "altKey"] as const) {
      const preventDefault = vi.fn();
      const handler = createNavigateHandler(onNavigate, "/button");
      handler({
        preventDefault,
        [modifier]: true,
      } as unknown as React.MouseEvent<HTMLAnchorElement>);
      expect(preventDefault).not.toHaveBeenCalled();
      expect(onNavigate).not.toHaveBeenCalled();
    }
  });

  it("applies the library focus-ring so keyboard focus is visible on items", () => {
    const markup = renderToStaticMarkup(
      <SidebarNav groups={[{ label: "Nav", items: [{ label: "Home", to: "/home" }] }]} />,
    );
    const item = markup.match(/data-slot="sidebar-nav-item"[^>]*class="([^"]+)"/)?.[1] ?? "";
    expect(item).toContain("focus-ring");
    expect(item).toContain("text-style-nav-item");
    expect(item).toContain("nav-item-row");
  });

  it("onNavigate receives the target `to` when an item is clicked", async () => {
    // renderToStaticMarkup cannot dispatch events; the module exports its
    // shared click-handler factory so the wiring stays unit-testable.
    const { createNavigateHandler } = await import(
      "../src/components/ui/sidebar-nav"
    );
    const onNavigate = vi.fn();
    const preventDefault = vi.fn();
    const handler = createNavigateHandler(onNavigate, "/button");
    handler({
      preventDefault,
    } as unknown as React.MouseEvent<HTMLAnchorElement>);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(onNavigate).toHaveBeenCalledWith("/button");
  });

  it("renders second-level categories with their own headings and keeps item geometry", () => {
    const subgroups = [
      {
        label: "Actions",
        items: [{ label: "Button", to: "/components/button" }],
      },
      {
        label: "Mobile only",
        items: [{ label: "Bottom Sheet", to: "/components/bottom-sheet" }],
      },
    ];
    const markup = renderToStaticMarkup(
      <SidebarNav
        groups={[
          {
            label: "Components",
            items: [...subgroups[0].items, ...subgroups[1].items],
            subgroups,
          },
        ]}
        activeTo="/components/bottom-sheet"
      />,
    );

    // 一级 heading 仍在，二级小标题逐个渲染
    expect(markup).toContain('data-slot="sidebar-nav-heading"');
    expect(markup.match(/data-slot="sidebar-nav-subgroup"/g)).toHaveLength(2);
    expect(markup.match(/data-slot="sidebar-nav-subheading"/g)).toHaveLength(2);
    expect(markup.indexOf("Actions")).toBeLessThan(markup.indexOf("Mobile only"));

    // 二级小标题与一级 heading 同字号（统一字号）、同左缘对齐，靠字重 + 次级色分层；
    // 宽度约束只有选中指示条 2px 与二级小组短分割线 40px
    expect(markup).toMatch(
      /data-slot="sidebar-nav-subheading"[^>]*class="[^"]*-mx-1[^"]*text-style-nav-subheading[^"]*font-medium/,
    );
    expect([...(markup.match(/\bw-[^\s"]+/g) ?? [])].sort()).toEqual(["w-0.5", "w-10"]);

    // 条目顺序按二级分类拼接，active 态照旧生效
    const links = Array.from(markup.matchAll(/href="([^"]+)"/g)).map((match) => match[1]);
    expect(links).toEqual(["/components/button", "/components/bottom-sheet"]);
    expect(markup.split('aria-current="page"').length - 1).toBe(1);
  });

  it("keeps the single-level structure when subgroups are absent", () => {
    const markup = navMarkup({});
    expect(markup).not.toContain('data-slot="sidebar-nav-subgroup"');
    expect(markup.match(/data-slot="sidebar-nav-item"/g)).toHaveLength(3);
  });
});
