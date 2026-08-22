import { describe, expect, test } from "vitest";

import { FRAMEWORK_MESSAGES } from "@/lib/framework-messages";

describe("framework message catalog", () => {
  test("keeps every supported locale aligned with the English key set", () => {
    const englishKeys = Object.keys(FRAMEWORK_MESSAGES.en).sort();

    for (const [locale, messages] of Object.entries(FRAMEWORK_MESSAGES)) {
      expect(Object.keys(messages).sort(), locale).toEqual(englishKeys);
    }
  });
});
