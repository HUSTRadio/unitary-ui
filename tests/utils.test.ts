import { describe, expect, it } from "vitest";

import { cn } from "../src/lib/utils.ts";

describe("cn typography utilities", () => {
  it("preserves named typography utilities alongside text colors", () => {
    expect(cn("text-copy-13", "text-foreground")).toBe("text-copy-13 text-foreground");
    expect(cn("text-label-14", "text-muted-foreground")).toBe(
      "text-label-14 text-muted-foreground",
    );
    expect(cn("text-heading-20", "text-foreground")).toBe("text-heading-20 text-foreground");
  });

  it("keeps last-write-wins behavior within one typography family", () => {
    expect(cn("text-copy-13", "text-copy-14")).toBe("text-copy-14");
    expect(cn("text-label-12", "text-label-14")).toBe("text-label-14");
  });
});
