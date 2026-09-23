import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";

const source = readFileSync(new URL("../src/components/ui/drawer.tsx", import.meta.url), "utf8");

describe("Drawer official contract", () => {
  test("supports controlled visibility, dismiss, custom height, and scrolling", () => {
    expect(source).toContain("show?: boolean");
    expect(source).toContain("onDismiss?: () => void");
    expect(source).toContain("height?: number");
    expect(source).toContain("verticalScroll?: boolean");
    expect(source).toContain("open={show}");
    expect(source).toContain("onOpenChange");
  });

  test("uses the official full-width bottom sheet surface", () => {
    expect(source).toContain("inset-x-0 bottom-0");
    expect(source).toContain("w-full");
    expect(source).toContain("rounded-t-xl");
    expect(source).toContain("border-t");
    expect(source).toContain("bg-background");
    expect(source).toContain('"max-h-[80dvh] overscroll-none"');
  });

  test("has overlay, bottom enter/exit motion, and swipe state hooks", () => {
    // HIG-AUD-010：遮罩写法收敛为暗化族 token（官方实测 rgba(0,0,0,.4) 的登记值）
    expect(source).toContain("bg-[var(--uni-overlay-scrim-color)]");
    expect(source).not.toMatch(/bg-black\/\d/);
    expect(source).toContain("slide-in-from-bottom");
    expect(source).toContain("slide-out-to-bottom");
    expect(source).toContain('data-swipe-direction="down"');
    expect(source).toContain("--drawer-swipe-movement-y");
  });

  test("lifts overlay and panel to the shared drawer z-index (official z=200)", () => {
    expect(source).toContain('z-[var(--uni-z-drawer)]');
    const overlay = source.match(/Overlay className="([^"]*)"/);
    expect(overlay?.[1]).toContain("z-[var(--uni-z-drawer)]");
    const content = source.match(/"fixed inset-x-0 bottom-0 ([^"]*)"/);
    expect(content?.[1]).toContain("z-[var(--uni-z-drawer)]");
  });

  test("consumes the shared material shadow token so the dark ring override applies", () => {
    // --material-shadow-menu 在 :root 定义 light 内层近白环，在 .dark 覆盖为
    // rgba(255,255,255,0.145) + rgb(0,0,0)。内联 light 字面量会绕过 .dark 覆盖，
    // 使暗色主题的面板带上亮白 1px 描边（本次修复的回归守卫）。
    const content = source.match(/"fixed inset-x-0 bottom-0 ([^"]*)"/);
    expect(content?.[1]).toContain("shadow-[var(--material-shadow-menu)]");
    expect(source).not.toMatch(/boxShadow/);
    expect(source).not.toMatch(/rgb\(250,\s*250,\s*250\)/);
  });
});
