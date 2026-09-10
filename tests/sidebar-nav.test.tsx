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
    expect(markup).toContain(">Introduction</a>");
  });

  it("renders group labels", () => {
    const markup = navMarkup({});
    expect(markup).toContain("Getting started");
    expect(markup).toContain("Components");
  });

  it("marks the active item with aria-current=page and highlight classes", () => {
    const markup = navMarkup({ activeTo: "/button" });

    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain("bg-gray-alpha-100");
    expect(markup).toContain("text-gray-1000");
  });

  it("non-active items use text-gray-900 hover:bg-gray-100 and no aria-current", () => {
    const markup = navMarkup({ activeTo: "/button" });

    expect(markup).toContain("text-gray-900");
    expect(markup).toContain("hover:bg-gray-100");
    // Exactly one active item
    expect(markup.split('aria-current="page"').length - 1).toBe(1);
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
    expect(markup).toContain('data-slot="sidebar-nav-heading"');
    expect(markup).toContain('data-slot="sidebar-nav-item"');
    expect(markup).toMatch(/data-slot="sidebar-nav-heading"[^>]*class="[^"]*-mx-1[^"]*px-3[^"]*text-style-subhead[^"]*font-semibold/);
    expect(markup).toMatch(/data-slot="sidebar-nav-item"[^>]*class="[^"]*-mx-1[^"]*px-3[^"]*text-style-subhead[^"]*font-normal/);
  });

  it("does not constrain width (outer layer controls width)", () => {
    const markup = navMarkup({});
    expect(markup).not.toMatch(/\bw-\d+\b/);
    expect(markup).not.toContain("w-full");
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
    expect(markup).toContain('class="-mx-1 px-3 flex h-10 items-center gap-2 rounded-md py-0 text-style-subhead font-normal focus-ring');
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
});
