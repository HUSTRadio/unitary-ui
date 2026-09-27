// @vitest-environment jsdom
import { beforeEach, describe, expect, test } from "vitest";

import { readDocsLanguage } from "../docs/site/src/i18n/language";

const NEW_KEY = "unitary-docs-language";
const LEGACY_KEY = "geist-docs-language";

describe("文档站语言偏好键命名迁移", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  test("优先读取新键", () => {
    window.localStorage.setItem(NEW_KEY, "en-US");
    window.localStorage.setItem(LEGACY_KEY, "zh-CN");

    expect(readDocsLanguage()).toBe("en-US");
  });

  test("回退读取旧键并把语言迁移到新键", () => {
    window.localStorage.setItem(LEGACY_KEY, "en-US");

    expect(readDocsLanguage()).toBe("en-US");
    expect(window.localStorage.getItem(NEW_KEY)).toBe("en-US");
    expect(window.localStorage.getItem(LEGACY_KEY)).toBeNull();
  });

  test("无偏好时回退默认语言", () => {
    expect(readDocsLanguage()).toBe("zh-CN");
  });
});
