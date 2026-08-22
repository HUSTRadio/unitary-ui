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
    expect(source).toContain("rounded-t-[10px]");
    expect(source).toContain("border-t");
    expect(source).toContain("bg-background");
    expect(source).toContain("max-h-[90dvh]");
  });

  test("has overlay, bottom enter/exit motion, and swipe state hooks", () => {
    expect(source).toContain("bg-black/40");
    expect(source).toContain("slide-in-from-bottom");
    expect(source).toContain("slide-out-to-bottom");
    expect(source).toContain('data-swipe-direction="down"');
    expect(source).toContain("--drawer-swipe-movement-y");
  });

  test("lifts overlay and panel to the shared drawer z-index (official z=200)", () => {
    expect(source).toContain('z-[var(--ds-z-drawer)]');
    const overlay = source.match(/Overlay className="([^"]*)"/);
    expect(overlay?.[1]).toContain("z-[var(--ds-z-drawer)]");
    const content = source.match(/"fixed inset-x-0 bottom-0 ([^"]*)"/);
    expect(content?.[1]).toContain("z-[var(--ds-z-drawer)]");
  });
});
