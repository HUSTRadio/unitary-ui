import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { COMPONENTS } from "../docs/site/src/data/components";
import { DOCS_ROUTE_GROUPS, DOCS_ROUTE_SEQUENCE } from "../docs/site/src/data/docs-routes";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function read(relativePath: string) {
  return readFile(path.join(root, relativePath), "utf8");
}

describe("Geist documentation coverage", () => {
  it("registers and renders every official component snapshot", async () => {
    const referenceFiles = await readdir(path.join(root, "docs/geist-markdown-refs/components"));
    const officialAliases = new Map([["phone", "device"]]);
    const official = new Set(
      referenceFiles
        .filter((file) => file.endsWith(".md"))
        .map((file) => file.slice(0, -3))
        .map((slug) => officialAliases.get(slug) ?? slug),
    );
    const registrySource = await read("docs/site/src/examples/registry.ts");
    const metadataNames = COMPONENTS.map((component) => component.name);
    const registryRecords = [...registrySource.matchAll(/slug:\s*"([^"]+)",\s*id:\s*"([^"]+)"/g)];
    const demoNames = registryRecords.map((match) => match[1]);
    const metadata = new Set(metadataNames);
    const demos = new Set(demoNames);

    expect(official.size).toBe(72);
    expect(metadata.size).toBe(metadataNames.length);
    expect(demos.size).toBe(metadata.size);
    expect([...official].filter((slug) => !metadata.has(slug))).toEqual([]);
    expect([...official].filter((slug) => !demos.has(slug))).toEqual([]);
    expect([...metadata].filter((slug) => !demos.has(slug))).toEqual([]);
    expect([...metadata].filter((slug) => !official.has(slug)).sort()).toEqual([
      "activity-view",
      "area-chart",
      "bar-chart",
      "bar-list",
      "bottom-sheet",
      "carousel",
      "category-bar",
      "combo-chart",
      "continuous-surface",
      "donut-chart",
      "edit-menu",
      "error-boundary",
      "footer",
      "full-page-scroller",
      "hamburger-menu",
      "lazy-load",
      "line-chart",
      "link",
      "menu-bar",
      "navbar",
      "progress-circle",
      "responsive-drawer",
      "safe-area",
      "side-panel",
      "sidebar-nav",
      "spark-chart",
      "stack",
      "step-point",
      "sub-frame",
      "toolbar",
      "tracker",
    ]);

    // 字母序只约束二级分类内部：布局原语（safe-area / stack）属于「排版与布局」分组，
    // 与 Typography / Grid 静态页同级，不参与该排序；「组件」区块先按功能域分类再按字母序。
    const componentsGroup = DOCS_ROUTE_GROUPS.find((group) => group.id === "components");
    const subgroups = componentsGroup?.subgroups ?? [];
    expect(subgroups.length).toBeGreaterThan(0);
    for (const subgroup of subgroups) {
      const labels = subgroup.items.map((route) => route.label);
      expect(labels, `${subgroup.id} 未按字母序排列`).toEqual(
        [...labels].sort((left, right) => left.localeCompare(right, "en")),
      );
    }
    // 分类只切分「组件」分组，不新增或遗漏组件页
    expect(subgroups.flatMap((subgroup) => subgroup.items)).toEqual(componentsGroup?.items);
  });

  it("uses Device as the canonical docs surface while preserving the Phone URL alias", async () => {
    const { canonicalDocsPath, getDocsRoute } = await import("../docs/site/src/data/docs-routes");
    const deviceRoute = getDocsRoute("/components/device");

    expect(deviceRoute?.renderer).toEqual({
      kind: "component-detail",
      componentName: "device",
    });
    expect(canonicalDocsPath("/components/phone")).toBe("/components/device");
    expect(getDocsRoute("/components/phone")).toBe(deviceRoute);
    expect(DOCS_ROUTE_SEQUENCE.filter((route) => route.to === "/components/phone")).toEqual([]);
  });

  it("does not retain removed component APIs", { timeout: 120000 }, async () => {
    const targets = [
      "README.md",
      "src/App.tsx",
      "src/examples/DataTableExample.tsx",
      "src/components/ui",
      "docs/site/src",
      "docs/site-docs-findings.md",
    ];
    const removedApiPatterns = [
      /@\/components\/ui\/(?:dropdown-menu|segmented-control)/,
      /\bSegmentedControl\b|\bThemeSwitch\b|@\/components\/ui\/theme-switch(?:"|')/,
      /\b(?:AvatarImage|AvatarFallback|BookPage)\b/,
      /\bBanner(?:Content|Close)\b/,
      /\bBreadcrumbs(?:Item|Link|Separator)\b|<Breadcrumbs(?:\s|>)/,
      /\bBrowser(?:Header|AddressBar|Content)\b/,
      /\bDescription(?:Item|Key|Value)\b/,
      /\bDestructiveActionModal(?:Close|Content|Description|Footer|Header|Title|Trigger)\b/,
      /\bDotsMenu(?:Content|Trigger)\b/,
      /\bDrawer(?:Close|Content|Footer|Header|Trigger)\b/,
      /\b(?:EmptyStateTitle|EmptyStateDescription|MultiSelectItem|RadioGroupLabel)\b/,
      /\bPagination(?:List|Item|Link|Previous|Next)\b/,
      /\bSelect(?:Content|Trigger|Value)\b/,
      /\bTabs(?:List|Trigger|Content)\b/,
      /\bToast(?:Provider|Viewport|Title|Description|Close|Action)\b/,
      /\bTooltip(?:Provider|Trigger|Content)\b|\bVideoControls\b/,
      /<Avatar[^>]*\bsize=["'](?:sm|default|lg)["']/,
      // outline 已是正式变体（2026-08-24 新增：仅框线无填充），故从废弃列表中移除
      /<Badge[^>]*\bvariant=["'](?:default|secondary|ghost|destructive|success|warning|danger|info)["']/,
      /<CopyButton[^>]*\btext=|<Grid[^>]*\bcols=|<MiddleTruncate[^>]*\btext=/,
      /<Gauge[^>]*\bsize=["'](?:sm|md|lg)["']/,
      /<Label(?:\s|\n)[^>]*\bhtmlFor=|<Note[^>]*\bvariant=["']destructive["']/,
      /<Snippet[^>]*\b(?:code|showCopy)=|<StatusDot[^>]*\bvariant=/,
      /<TextWithCopyButton[^>]*\btext=|<RelativeTimeCard\s+time=|<ShowMore\s+maxLength=/,
    ];

    async function collect(relativePath: string): Promise<string[]> {
      const absolutePath = path.join(root, relativePath);
      const entries = await readdir(absolutePath, { withFileTypes: true }).catch(() => []);
      if (entries.length === 0) return [relativePath];
      const nested = await Promise.all(
        entries.map((entry) => collect(path.join(relativePath, entry.name))),
      );
      return nested.flat();
    }

    const files = (await Promise.all(targets.map(collect))).flat();
    const violations: string[] = [];
    for (const file of files) {
      if (!/\.(?:md|ts|tsx)$/.test(file)) continue;
      const source = await read(file);
      if (removedApiPatterns.some((pattern) => pattern.test(source))) violations.push(file);
    }

    expect(violations).toEqual([]);
  });

  it("renders all three live Command Menu demo content contracts", async () => {
    const [defaultExample, withSuffixExample, withDividerExample] = await Promise.all([
      read("docs/site/src/examples/command-menu/default-37a8eec1.example.tsx"),
      read("docs/site/src/examples/command-menu/with-suffix-ed17650b.example.tsx"),
      read("docs/site/src/examples/command-menu/with-divider-5a6d5780.example.tsx"),
    ]);

    for (const text of ["Flags Explorer"]) {
      expect(defaultExample).toContain(text);
    }
    for (const text of [
      "Group 2",
      "United States of America",
      "Switzerland",
      "Germany",
      "USA",
      "ESP",
      "FRA",
      "AUT",
      "GER",
    ]) {
      expect(withSuffixExample).toContain(text);
    }
    for (const text of ["Item 1", "Item 2", "Item 3", "Grouped Item 1", "Grouped Item 2"]) {
      expect(withDividerExample).toContain(text);
    }
    expect(withDividerExample).toContain("<CommandMenuDivider />");
    expect(defaultExample).toContain('type="default"');
    expect(withSuffixExample).toContain('type="default"');
    expect(defaultExample).not.toContain('type="secondary"');
  });

  it("derives App rendering and titles from the canonical route registry", async () => {
    const source = await read("docs/site/src/App.tsx");

    expect(source).not.toContain("PAGE_TITLES");
    expect(source).not.toContain('"/introduction": IntroductionPage');
    expect(source).toContain("const canonicalPath = canonicalDocsPath(pathname);");
    expect(source).toContain("const route = getDocsRoute(canonicalPath);");
  });
});
