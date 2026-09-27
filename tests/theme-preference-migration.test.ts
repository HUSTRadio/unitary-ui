// @vitest-environment jsdom
import { beforeEach, describe, expect, test } from "vitest";

import { readStoredPreference } from "../src/lib/theme";

const NEW_KEY = "unitary-theme-preference";
const LEGACY_KEY = "geist-theme-preference";

describe("主题偏好键命名迁移", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("优先读取新键", () => {
    window.localStorage.setItem(NEW_KEY, "dark");
    window.localStorage.setItem(LEGACY_KEY, "light");

    expect(readStoredPreference()).toBe("dark");
  });

  test("回退读取旧键并把偏好迁移到新键", () => {
    window.localStorage.setItem(LEGACY_KEY, "light");

    expect(readStoredPreference()).toBe("light");
    expect(window.localStorage.getItem(NEW_KEY)).toBe("light");
    expect(window.localStorage.getItem(LEGACY_KEY)).toBeNull();
  });

  test("旧键内容非法时不迁移", () => {
    window.localStorage.setItem(LEGACY_KEY, "unsupported");

    expect(readStoredPreference()).toBe("system");
    expect(window.localStorage.getItem(NEW_KEY)).toBeNull();
    expect(window.localStorage.getItem(LEGACY_KEY)).toBe("unsupported");
  });
});
