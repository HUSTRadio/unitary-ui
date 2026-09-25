import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(
  new URL("../src/components/ui/menu-bar.tsx", import.meta.url),
  "utf8",
);

/** MenuBar —— HIG 菜单栏：基于 Radix Menubar（自带 ARIA menubar 键盘模型）。 */
describe("Menu Bar contract", () => {
  test("builds on the Radix Menubar primitive", () => {
    expect(source).toContain('import { Menubar as MenubarPrimitive } from "radix-ui"');
    expect(source).toContain("MenubarPrimitive.Root");
    expect(source).toContain("MenubarPrimitive.Trigger");
    expect(source).toContain("MenubarPrimitive.CheckboxItem");
    expect(source).toContain("MenubarPrimitive.SubTrigger");
  });

  test("exposes the full composition surface", () => {
    for (const name of [
      "MenuBar",
      "MenuBarMenu",
      "MenuBarTrigger",
      "MenuBarContent",
      "MenuBarItem",
      "MenuBarCheckboxItem",
      "MenuBarSeparator",
      "MenuBarSub",
      "MenuBarSubTrigger",
      "MenuBarSubContent",
    ]) {
      expect(source).toContain(name);
    }
  });

  test("right-aligns shortcut hints without binding keys", () => {
    expect(source).toContain("shortcut?: React.ReactNode");
    expect(source).toContain("ml-auto pl-4");
    expect(source).toContain("只做展示");
  });

  test("uses the menu surface tokens and reduced-motion fallback", () => {
    expect(source).toContain("rounded-overlay");
    expect(source).toContain("shadow-[var(--material-shadow-menu)]");
    expect(source).toContain("bg-surface");
    expect(source).toContain("motion-reduce:animate-none!");
  });

  test("HIG-AUD-011/012: mirrors zoom on exit and uses fast-tier duration", () => {
    expect(source).toContain("data-[state=closed]:zoom-out-95");
    expect(source).toContain("duration-(--uni-duration-fast)");
    expect(source).toContain("z-[var(--uni-z-popover)]");
  });

  test("documents the boundary against Navbar", () => {
    expect(source).toContain("Navbar");
    expect(source).toContain("应用级命令菜单");
  });
});
