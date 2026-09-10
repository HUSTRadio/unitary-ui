import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Breadcrumb, BreadcrumbItem } from "../src/components/ui/breadcrumbs";

describe("Breadcrumbs official API contract", () => {
  it("menu variant renders a flex button group without nav/ol/li and without chevron separators", () => {
    const markup = renderToStaticMarkup(
      <Breadcrumb type="menu">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbItem active>Overview</BreadcrumbItem>
      </Breadcrumb>,
    );

    // 官方 menu 变体是 div（role=navigation）+ 按钮组，不用 nav/ol/li
    expect(markup).toContain('role="navigation"');
    expect(markup).not.toContain("<nav");
    expect(markup).not.toContain("<ol");
    expect(markup).not.toContain("<li");
    // 按钮之间无 chevron 分隔符（官方 menu 变体不含 svg）
    expect(markup).not.toContain("<svg");
    // 根容器 gap-2（8px 间距）
    expect(markup).toContain("gap-2");
    // 按钮有 cursor-pointer + text-label-12
    expect(markup).toContain("cursor-pointer");
    expect(markup).toContain("text-label-12");
  });

  it("menu items with href render functional chip links", () => {
    const markup = renderToStaticMarkup(
      <Breadcrumb type="menu">
        <BreadcrumbItem href="#/components">Components</BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(markup).toContain('<a href="#/components"');
    expect(markup).toContain('data-slot="breadcrumb-item"');
    expect(markup).not.toContain("<button");
  });

  it("types menu and text root props against their actual DOM elements without casts", async () => {
    const source = await import("node:fs/promises").then(({ readFile }) =>
      readFile(new URL("../src/components/ui/breadcrumbs.tsx", import.meta.url), "utf8"),
    );

    expect(source).toContain("type BreadcrumbProps = BreadcrumbTextProps | BreadcrumbMenuProps");
    expect(source).not.toContain("props as BreadcrumbMenuProps");
  });

  it("menu variant forwards root DOM props and allows an explicit accessible name", () => {
    const markup = renderToStaticMarkup(
      <Breadcrumb type="menu" aria-label="Project path" data-testid="project-path">
        <BreadcrumbItem>Home</BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(markup).toContain('aria-label="Project path"');
    expect(markup).toContain('data-testid="project-path"');
  });

  it("text variant renders nav > ol > li with cursor-pointer and chevron separators", () => {
    const markup = renderToStaticMarkup(
      <Breadcrumb type="text">
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbItem active>Overview</BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(markup).toContain("<nav");
    expect(markup).toContain("<ol");
    expect(markup).toContain("<li");
    // li 有 cursor-pointer（官方 text 变体可点击）
    expect(markup).toContain("cursor-pointer");
    // 16px chevron 分隔符
    expect(markup).toContain("size-4");
    // href 渲染 <a>（可点击链接）
    expect(markup).toContain("<a href");
    expect(markup).toContain("text-label-14");
  });

  it("disabled item uses cursor-not-allowed and muted text in both variants", () => {
    const textMarkup = renderToStaticMarkup(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem disabled>Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Overview</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(textMarkup).toContain("cursor-not-allowed");
    expect(textMarkup).toContain("text-gray-700");

    const menuMarkup = renderToStaticMarkup(
      <Breadcrumb type="menu">
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem disabled>Dashboard</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(menuMarkup).toContain("cursor-not-allowed");
    expect(menuMarkup).toContain("disabled");
  });

  it("active item marks aria-current page and deepens text color", () => {
    const markup = renderToStaticMarkup(
      <Breadcrumb>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem active>Dashboard</BreadcrumbItem>
      </Breadcrumb>,
    );
    expect(markup).toContain('aria-current="page"');
    expect(markup).toContain("text-gray-1000");
  });
});
