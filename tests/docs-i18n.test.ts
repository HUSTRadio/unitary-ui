import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { LANGUAGE_OPTIONS, SHELL_COPY } from "../docs/site/src/i18n/catalog";
import {
  DEMO_COPY,
  demoSectionTitle,
  demoText,
  demoTextWithValues,
} from "../docs/site/src/i18n/components-demo";
import { readDocsLanguage } from "../docs/site/src/i18n/language";

describe("docs language support", () => {
  it("defines Chinese as the default when no browser preference is available", () => {
    expect(readDocsLanguage()).toBe("zh-CN");
  });

  it("exposes exactly the supported Chinese and English options", () => {
    expect(LANGUAGE_OPTIONS.map((option) => option.value)).toEqual(["zh-CN", "en-US"]);
    expect(LANGUAGE_OPTIONS.map((option) => option.label)).toEqual(["中文", "English"]);
  });

  it("bridges the docs language state into framework component translations", () => {
    const source = readFileSync(resolve(process.cwd(), "docs/site/src/i18n/language.tsx"), "utf8");

    expect(source).toContain('import { I18nProvider } from "@/lib/i18n"');
    expect(source).toContain('<I18nProvider locale={language === "zh-CN" ? "zh-CN" : "en"}>');
  });

  it("keeps shell copy complete in both locales", () => {
    const keys = Object.keys(SHELL_COPY["zh-CN"]);
    expect(keys).toEqual(Object.keys(SHELL_COPY["en-US"]));
    expect(keys).toContain("searchPlaceholder");
    expect(keys).toContain("languageAria");
  });

  it("falls back to the English source string", () => {
    expect(demoText("en-US", "A new untranslated demo string")).toBe(
      "A new untranslated demo string",
    );
  });

  it("translates shared demo labels from one catalog", () => {
    expect(demoText("zh-CN", "Show code")).toBe("显示代码");
    expect(demoText("zh-CN", "Delete Project")).toBe("删除项目");
    expect(demoText("zh-CN", "Select a framework")).toBe("选择框架");
  });

  it("turns registry ids into readable, translated section titles", () => {
    expect(demoSectionTitle("zh-CN", "horizontal-layout")).toBe("横向布局");
    expect(demoSectionTitle("en-US", "with-icons")).toBe("With icons");
    expect(demoSectionTitle("en-US", "custom-empty-message")).toBe("Custom empty message");
  });

  it("localizes every registry section id shown in the Chinese docs", () => {
    const source = readFileSync(
      resolve(process.cwd(), "docs/site/src/examples/registry.ts"),
      "utf8",
    );
    const ids = new Set([...source.matchAll(/\bid:\s*"([^"]+)"/gu)].map((match) => match[1]));
    const intentionallyUntranslated = new Set(["Git"]);

    expect(ids.size).toBeGreaterThan(100);
    for (const id of ids) {
      if (!intentionallyUntranslated.has(id)) {
        expect(demoSectionTitle("zh-CN", id), id).not.toBe(demoSectionTitle("en-US", id));
      }
    }
  });

  it("does not put code identifiers into the demo catalog", () => {
    expect(DEMO_COPY["zh-CN"]["text-heading-40"]).toBeUndefined();
    expect(DEMO_COPY["zh-CN"]["/components/button"]).toBeUndefined();
  });

  it("uses the language catalog instead of duplicate component-page maps", () => {
    const source = readFileSync(
      resolve(process.cwd(), "docs/site/src/components/docs-components-page.tsx"),
      "utf8",
    );
    expect(source).not.toContain("isChinese()");
    expect(source).not.toContain("useIsChinese()");
    expect(source).not.toContain("SECTION_TITLES_ZH");
  });

  it("does not hardcode Chinese accessible names in the component demos", () => {
    const source = readFileSync(
      resolve(process.cwd(), "docs/site/src/components/docs-components-page.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(/aria-label="[^"]*[\u3400-\u9fff][^"]*"/u);
  });

  it("translates every user-facing section title from the shared catalog", () => {
    const source = readFileSync(
      resolve(process.cwd(), "docs/site/src/components/docs-components-page.tsx"),
      "utf8",
    );
    const titles = [...source.matchAll(/<Section title="([^"]+)"/gu)].map((match) => match[1]);
    const intentionalEnglish = new Set(["Git"]);

    for (const title of new Set(titles)) {
      if (!intentionalEnglish.has(title)) {
        expect(demoText("zh-CN", title), title).not.toBe(title);
      }
    }
  });

  it("covers P0 headings and assistive labels that bypass Section", () => {
    for (const source of [
      "Custom color",
      "Responsive and textured",
      "More deployment actions",
      "Select save method",
      "project name",
    ]) {
      expect(demoText("zh-CN", source), source).not.toBe(source);
    }
  });

  it("covers P1 interactive demo copy", () => {
    for (const source of [
      "Actions",
      "Default",
      "Secondary",
      "Outline",
      "Ghost",
      "Destructive",
      "Search",
      "Copy",
      "Loading",
      "Disabled",
      "Edit Project",
      "Duplicate Project",
      "Delete Project",
      "Open Modal",
      "Open Sheet",
      "Open Command Menu",
      "Cancel",
      "Delete",
      "Apply",
      "Close",
      "Send",
      "Sent",
      "Deploy Project",
      "Deploy to Preview",
      "Deploy to Production",
      "Save",
      "Save + Redeploy",
      "Copy page",
      "No results",
      "Read more",
      "Show Toast",
      "Load More",
      "All",
      "Ready",
      "Error",
      "On",
      "Off",
      "Overview",
      "Usage",
    ]) {
      expect(demoText("zh-CN", source), source).not.toBe(source);
    }
  });

  it("interpolates localized runtime values without changing the source fallback", () => {
    expect(demoTextWithValues("zh-CN", "{count} items loaded", { count: 3 })).toBe(
      "已加载 3 个项目",
    );
    expect(demoTextWithValues("en-US", "{count} items loaded", { count: 3 })).toBe(
      "3 items loaded",
    );
  });

  it("consumes the catalog in interactive and feedback demos", () => {
    const source = readFileSync(
      resolve(process.cwd(), "docs/site/src/components/docs-components-page.tsx"),
      "utf8",
    );

    expect(source).toContain("demoTextWithValues(language");
    expect(source).not.toContain('text: "Project deleted"');
    expect(source).not.toContain('title="Delete Project"');
    expect(source).not.toMatch(
      />\s*(Show Toast|Open Drawer|Filter Logs|Load More|Right click here|View Project)\s*</,
    );
  });

  it("localizes the remaining P1 control and status demos", () => {
    const source = readFileSync(
      resolve(process.cwd(), "docs/site/src/components/docs-components-page.tsx"),
      "utf8",
    );

    // live demos now render from physical example modules; the page keeps the
    // shared localized labels and never hardcodes the pre-i18n English strings.
    expect(readFileSync(resolve(process.cwd(), "docs/site/src/components/demo-show-code.tsx"), "utf8")).toContain('demoText(language, "Show code")');
    expect(source).not.toContain("{selected.length} selected");
    expect(source).not.toContain("Loading deployment <LoadingDots />");
    expect(source).not.toContain("Enable Firewall\\n        </Toggle>");
  });

  it("does not use scattered language ternaries inside component demos", () => {
    const source = readFileSync(
      resolve(process.cwd(), "docs/site/src/components/docs-components-page.tsx"),
      "utf8",
    );
    const demos = source.split("/* ---------- 总览模式 ---------- */", 1)[0];

    expect(demos).not.toMatch(/const zh = language === "zh-CN"/u);
    expect(demos).not.toMatch(/\bzh \?/u);
  });

  it("eliminates zh ternaries from the entire docs site source", () => {
    const files = [
      "docs/site/src/components/docs-components-page.tsx",
      "docs/site/src/components/docs-pages.tsx",
      "docs/site/src/components/docs-cards.tsx",
      "docs/site/src/App.tsx",
    ];
    for (const file of files) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(source, file).not.toMatch(/const zh = language === "zh-CN"/u);
      expect(source, file).not.toMatch(/\bzh \?/u);
    }
  });

  it("does not contain zhTitles or SECTION_TITLES_ZH maps in any docs file", () => {
    const files = [
      "docs/site/src/components/docs-components-page.tsx",
      "docs/site/src/components/docs-pages.tsx",
      "docs/site/src/components/docs-cards.tsx",
      "docs/site/src/App.tsx",
    ];
    for (const file of files) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(source, file).not.toContain("zhTitles");
      expect(source, file).not.toContain("SECTION_TITLES_ZH");
    }
  });

  it("translates Foundations page headings from the catalog", () => {
    for (const source of [
      "Colors",
      "Typography",
      "Materials",
      "Grid",
      "Scales",
      "Semantic Tokens",
      "Headings",
      "Buttons",
      "Label",
      "Copy",
      "Empty Guides",
      "Responsive Breakpoints",
    ]) {
      expect(demoText("zh-CN", source), source).not.toBe(source);
    }
  });

  it("translates page shell headings from the catalog", () => {
    for (const source of [
      "Live Demo",
      "Usage",
      "Best Practices",
      "Back to Components",
      "Component not found",
      "Page Not Found",
    ]) {
      expect(demoText("zh-CN", source), source).not.toBe(source);
    }
  });
});
