import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

import { docsPageSource as source } from "./helpers/docs-page-source";

describe("Collapse official demo contract", () => {
  test("uses the official theme-sensitive divider color", () => {
    expect(source).toContain(
      'const COLLAPSE_DIVIDER_CLS = "border-[#eaeaea] dark:border-[#333333]";',
    );
    expect(source.match(/COLLAPSE_DIVIDER_CLS/g)).toHaveLength(6);
  });
});
