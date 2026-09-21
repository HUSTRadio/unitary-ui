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
    expect(markup).toContain('<span class="truncate">Introduction</span>');
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

  it("collapsible 开启后标题是真实 button，首帧全展开且带 chevron 与 aria 接线", () => {
    const markup = navMarkup({ collapsible: true });
    const heading = markup.match(/<button[^>]*data-slot="sidebar-nav-heading"[^>]*>/)?.[0];

    expect(heading).toBeDefined();
    expect(heading).toContain('aria-expanded="true"');
    // Radix 仅在展开态挂 aria-controls，指向内容区 id
    expect(heading).toMatch(/aria-controls="([^"]+)"/);
    expect(markup).toContain(`id="${heading?.match(/aria-controls="([^"]+)"/)?.[1]}"`);
    expect(markup).toContain("grid-rows-[1fr]");
    // 展开态不得把内容 inert 掉（首帧静态渲染 = 全展开）
    expect(markup).not.toContain("inert");
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

  it("uses one shared semantic typography role and one inset contract for headings and items", () => {
    const markup = navMarkup({});
    expect(markup).toMatch(
      /data-slot="sidebar-nav-heading"[^>]*class="[^"]*-mx-1 px-3\.5[^"]*text-style-subhead[^"]*font-semibold[^"]*text-gray-1000/,
    );
    expect(markup).toMatch(
      /data-slot="sidebar-nav-item"[^>]*class="[^"]*-mx-1 px-3\.5[^"]*text-style-subhead/,
    );
  });

  it("keeps the measured 32px row rhythm and the rounded-md item pill", () => {
    // Tremor 文档站侧栏实测：行高 = py-1.5(6px) × 2 + 行高 20px = 32px；圆角 6px
    const markup = navMarkup({});
    expect(markup).toMatch(/data-slot="sidebar-nav-item"[^>]*class="[^"]*rounded-md py-1\.5/);
    expect(markup).toMatch(/data-slot="sidebar-nav-heading"[^>]*class="[^"]*h-8/);
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

    expect(markup.split('data-slot="nav-status-badge"').length - 1).toBe(2);
    expect(markup).toContain('data-tone="new"');
    expect(markup).toContain('data-tone="updated"');
    expect(markup).toContain(">New</span>");
    expect(markup).toContain(">Updated</span>");
    // 胶囊推到行尾（右缘对齐）
    expect(markup).toContain("ml-auto");
  });

  it("omits the badge entirely when no item declares one", () => {
    expect(navMarkup({})).not.toContain('data-slot="nav-status-badge"');
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
    expect(item).toContain("text-style-subhead");
    expect(item).toContain("py-1.5");
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

    // 二级小标题比一级 heading 低一档字号，且不引入宽度约束（仅选中指示条自带 2px 宽）
    expect(markup).toMatch(
      /data-slot="sidebar-nav-subheading"[^>]*class="[^"]*-mx-1 px-3\.5[^"]*text-style-footnote[^"]*font-medium/,
    );
    expect(markup.match(/\bw-[^\s"]+/g)).toEqual(["w-0.5"]);

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
