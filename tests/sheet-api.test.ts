import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

/**
 * Sheet 官方 API contract（2026-08-15 live DOM 实测）。
 * 官方默认值来源：vercel.com/geist/sheet 的 With Side demo（SheetContent 无 className 覆盖）。
 */
describe("Sheet official API contract", () => {
  test("Sheet root defaults modal=false (official Best Practices)", async () => {
    const src = await read("src/components/ui/sheet.tsx");
    expect(src).toMatch(/modal\s*=\s*false/);
  });

  test("overlay uses official backdrop tokens, not black/50", async () => {
    const src = await read("src/components/ui/sheet.tsx");
    const line = src.split("\n").find((l) => l.includes('"fixed inset-0'));
    expect(line).toBeDefined();
    expect(line).toContain("bg-[var(--uni-overlay-backdrop-color)]");
    expect(line).toContain("opacity-[var(--uni-overlay-backdrop-opacity)]");
    expect(line).toContain("z-[var(--uni-z-drawer)]");
    expect(line).not.toContain("bg-black/50");
  });

  test("SheetContent public surface: bg-background-100 + p-6 + elevated shadow token", async () => {
    const src = await read("src/components/ui/sheet.tsx");
    expect(src).toContain("bg-background-100 p-6");
    expect(src).toContain("shadow-[var(--uni-shadow-modal-elevated)]");
    expect(src).toContain("z-[var(--uni-z-drawer)]");
    expect(src).toContain("ease-in-out");
  });

  test("side defaults match official (no demo-override m-3/rounded-16/w-512)", async () => {
    const src = await read("src/components/ui/sheet.tsx");
    // right/left: full height, 75% width, sm max 384px
    expect(src).toContain("inset-y-0 right-0 h-full w-3/4 sm:max-w-sm");
    expect(src).toContain("inset-y-0 left-0 h-full w-3/4 sm:max-w-sm");
    // top/bottom: full width, no height cap
    expect(src).toContain("inset-x-0 top-0");
    expect(src).toContain("inset-x-0 bottom-0");
    // old incorrect values (demo override mistaken for defaults) must be gone
    expect(src).not.toContain("m-3");
    expect(src).not.toContain("rounded-[16px]");
    expect(src).not.toContain("w-[512px]");
    expect(src).not.toContain("h-24");
  });

  test("side animations: slide-in -5 / slide-out -10 per official", async () => {
    const src = await read("src/components/ui/sheet.tsx");
    expect(src).toContain("slide-in-from-top-5");
    expect(src).toContain("slide-out-to-top-10");
    expect(src).toContain("slide-in-from-right-5");
    expect(src).toContain("slide-out-to-right-10");
    expect(src).toContain("slide-in-from-bottom-5");
    expect(src).toContain("slide-out-to-bottom-10");
    expect(src).toContain("slide-in-from-left-5");
    expect(src).toContain("slide-out-to-left-10");
  });

  test("SheetContent does not embed a built-in close button (official: consumer adds SheetClose)", async () => {
    const src = await read("src/components/ui/sheet.tsx");
    const contentFn = src.slice(src.indexOf("const SheetContent"));
    expect(contentFn).not.toContain("DialogPrimitive.Close");
  });

  test("supports noOverlay prop (official)", async () => {
    const src = await read("src/components/ui/sheet.tsx");
    expect(src).toMatch(/noOverlay\??:\s*boolean/);
    expect(src).toContain("!noOverlay && <SheetOverlay />");
  });

  test("exports full API surface", async () => {
    const src = await read("src/components/ui/sheet.tsx");
    expect(src).toMatch(
      /export\s*\{\s*Sheet,\s*SheetTrigger,\s*SheetPortal,\s*SheetOverlay,\s*SheetContent,\s*SheetHeader,\s*SheetTitle,\s*SheetDescription,\s*SheetFooter,\s*SheetClose,/,
    );
  });
});
