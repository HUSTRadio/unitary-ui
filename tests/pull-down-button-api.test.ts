import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  new URL("../src/components/ui/split-button.tsx", import.meta.url),
  "utf8",
);

/**
 * Pull-down Button 是 split-button 的悬浮卡片变体：卡片锚定按钮的某个角，
 * 向对向展开。以源码契约覆盖（与 split-button-api.test.ts 一致的做法）。
 */
describe("SplitButton pull-down card variant", () => {
  test("adds variant and expandCorner without breaking the official API", () => {
    expect(source).toContain('variant = "split"');
    expect(source).toContain("variant?: SplitButtonVariant");
    expect(source).toContain("expandCorner?: SplitButtonExpandCorner");
    expect(source).toContain('menuAlignment = "bottom-start"');
  });

  test("maps every expand corner to a menu position and a transform origin", () => {
    expect(source).toContain('"top-left": { position: "bottom-start", origin: "origin-top-left" }');
    expect(source).toContain('"top-right": { position: "bottom-end", origin: "origin-top-right" }');
    expect(source).toContain('"bottom-left": { position: "top-start", origin: "origin-bottom-left" }');
    expect(source).toContain('"bottom-right": { position: "top-end", origin: "origin-bottom-right" }');
  });

  test("keeps the menu anchored to the main button for start alignment", () => {
    expect(source).toContain('position.endsWith("-end") ? 0 : -triggerWidth');
    expect(source).toContain("<MenuContainer position={position}>");
  });

  test("renders the pulldown card with card padding and a larger offset", () => {
    expect(source).toContain("sideOffset={isPulldown ? 6 : undefined}");
    expect(source).toContain('isPulldown && cn("p-2", EXPAND_CORNER_PROPS[expandCorner].origin)');
  });

  test("documents the difference between split and pulldown", () => {
    expect(source).toContain("悬浮卡片");
    expect(source).toContain("Pull-down Button");
  });
});
