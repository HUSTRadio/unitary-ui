import { describe, expect, it } from "vitest";

import { LANGUAGE_OPTIONS, SHELL_COPY } from "../docs/geist/src/i18n/catalog";
import { DEMO_COPY, demoText } from "../docs/geist/src/i18n/components-demo";
import { readDocsLanguage } from "../docs/geist/src/i18n/language";

describe("docs language support", () => {
  it("defines Chinese as the default when no browser preference is available", () => {
    expect(readDocsLanguage()).toBe("zh-CN");
  });

  it("exposes exactly the supported Chinese and English options", () => {
    expect(LANGUAGE_OPTIONS.map((option) => option.value)).toEqual(["zh-CN", "en-US"]);
    expect(LANGUAGE_OPTIONS.map((option) => option.label)).toEqual(["中文", "English"]);
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

  it("does not put code identifiers into the demo catalog", () => {
    expect(DEMO_COPY["zh-CN"]["text-heading-40"]).toBeUndefined();
    expect(DEMO_COPY["zh-CN"]["/components/button"]).toBeUndefined();
  });
});
