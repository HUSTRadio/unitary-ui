import { describe, expect, it } from "vitest";

import { LANGUAGE_OPTIONS, SHELL_COPY } from "../docs/geist/src/i18n/catalog";
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
});
