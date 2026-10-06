import { describe, expect, it } from "vitest";

import { cn } from "../src/lib/utils.ts";

describe("cn typography utilities", () => {
  it("preserves named typography utilities alongside text colors", () => {
    expect(cn("text-copy-13", "text-foreground")).toBe("text-copy-13 text-foreground");
    expect(cn("text-label-14", "text-muted-foreground")).toBe(
      "text-label-14 text-muted-foreground",
    );
    expect(cn("text-heading-20", "text-foreground")).toBe("text-heading-20 text-foreground");
    // 侧栏三级标签 token（text-style-nav-*）同样不能被文本色兜底吃掉
    expect(cn("text-style-nav-heading", "text-gray-1000")).toBe(
      "text-style-nav-heading text-gray-1000",
    );
    expect(cn("text-style-nav-subheading", "text-gray-900")).toBe(
      "text-style-nav-subheading text-gray-900",
    );
    expect(cn("text-style-nav-item", "text-gray-900", "hover:text-gray-1000")).toBe(
      "text-style-nav-item text-gray-900 hover:text-gray-1000",
    );
  });

  it("keeps last-write-wins behavior within one typography family", () => {
    expect(cn("text-copy-13", "text-copy-14")).toBe("text-copy-14");
    expect(cn("text-label-12", "text-label-14")).toBe("text-label-14");
    expect(cn("text-style-nav-heading", "text-style-nav-item")).toBe("text-style-nav-item");
  });
});

describe("cn material shadow recipes", () => {
  it.each([
    "shadow-[var(--material-shadow-menu)]",
    "shadow-[var(--material-texture-shadow-tooltip)]",
    "shadow-[var(--material-texture-shadow-menu)]",
    "shadow-[var(--material-texture-shadow-modal)]",
    "shadow-[var(--uni-shadow-modal-elevated)]",
    "shadow-[var(--_uni-material-shadow,var(--_uni-tooltip-shadow))]",
    "shadow-(--material-shadow-base)",
    "shadow-(--material-texture-shadow-menu)",
  ])("recognizes %s as a shadow size that an author can replace", (materialShadow) => {
    expect(cn(materialShadow, "shadow-none")).toBe("shadow-none");
    expect(cn(materialShadow, "shadow-lg")).toBe("shadow-lg");
    expect(cn(materialShadow, "shadow-[0_2px_6px_black]")).toBe("shadow-[0_2px_6px_black]");
    expect(cn("shadow-none", materialShadow)).toBe(materialShadow);
    expect(cn("shadow-[var(--material-shadow-menu)]", materialShadow)).toBe(materialShadow);
    expect(cn(materialShadow, "shadow-red-500")).toBe(`${materialShadow} shadow-red-500`);
  });

  it("preserves modifier scopes and unknown shadow color variables", () => {
    expect(cn("hover:shadow-[var(--material-shadow-menu)]", "shadow-none"))
      .toBe("hover:shadow-[var(--material-shadow-menu)] shadow-none");
    expect(cn("shadow-[var(--custom-color)]", "shadow-none"))
      .toBe("shadow-[var(--custom-color)] shadow-none");
  });
});
