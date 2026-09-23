import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

const overlayLine = (src: string) =>
  src.split("\n").find((line) => line.includes('"fixed inset-0'));

describe("Modal official API contract (G07-MODAL-01 fix)", () => {
  test("G07-MODAL-01: overlay uses official scrim — light #f2f2f2 / dark black at 0.8 opacity", async () => {
    const src = await read("src/components/ui/modal.tsx");
    const line = overlayLine(src);
    expect(line).toBeDefined();
    // official live metrics: light rgb(242,242,242) / dark rgb(0,0,0) @ opacity 0.8。
    // HIG-AUD-010 起该值由 backdrop 族 token 承载（token 逐值冻结在
    // tests/overlay-backdrop-tokens.test.ts），本测试只锁消费写法与「不得回落字面量」。
    // 消费 backdrop 族的合成色（= color × opacity）：Overlay 带 Content 子节点，
    // 不能用元素 opacity-*（内容会一起降透明）。族契约见 tests/overlay-backdrop-tokens.test.ts
    expect(line).toContain("bg-[var(--uni-overlay-backdrop)]");
    expect(line).toContain("z-[var(--uni-z-modal)]"); // Task 9 token form of the locked 300
    expect(line).not.toMatch(/bg-\[#|bg-black\//);
  });

  test("G07-MODAL-01: overlay has NO backdrop blur and no old black/50 z-50 scrim", async () => {
    const src = await read("src/components/ui/modal.tsx");
    const line = overlayLine(src);
    expect(line).toBeDefined();
    // 原意是「遮罩不得带模糊」：仍禁止 backdrop-blur，但族 token 名
    // （--uni-overlay-backdrop-color/-opacity）不算模糊
    expect(line).not.toContain("backdrop-blur");
    expect(line).not.toContain("bg-black/50");
    expect(line).not.toContain("z-50");
  });

  test("overlay fades with the official 300ms spring curve", async () => {
    const src = await read("src/components/ui/modal.tsx");
    expect(src).toContain("data-[state=open]:fade-in-0");
    expect(src).toContain("data-[state=closed]:fade-out-0");
    expect(src).toContain("duration-(--uni-duration-slow) ease-pop");
  });

  test("G07-MODAL-01: modal content keeps z-[300] so it stacks above the z-300 overlay", async () => {
    const src = await read("src/components/ui/modal.tsx");
    const contentLine = src
      .split("\n")
      .find((line) => line.includes('"fixed z-[var(--uni-z-modal)]'));
    expect(contentLine).toBeDefined(); // same stacking role as the overlay (300)
  });

  test("placement splits geometry and entrance direction (center zooms, top drops from the top edge)", async () => {
    const src = await read("src/components/ui/modal.tsx");
    // center：居中 + 中心缩放淡入（官方基线，既有观感不变）
    expect(src).toContain('"top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-xl"');
    expect(src).toContain("data-[state=open]:zoom-in-95");
    // top：吸顶（贴视口顶边、上圆角归零）+ 自顶部下落入场（macOS sheet 语义）
    expect(src).toContain('"top-0 left-1/2 -translate-x-1/2 rounded-t-none rounded-b-xl"');
    expect(src).toContain("data-[state=open]:slide-in-from-top-8");
    expect(src).toContain("data-[state=closed]:slide-out-to-top-8");
    // 手势与动效仍受 prefers-reduced-motion 降级
    expect(src).toContain("motion-reduce:animate-none!");
  });

  test("ModalContent forces aria-modal=true on the dialog content", async () => {
    const src = await read("src/components/ui/modal.tsx");
    expect(src).toMatch(/aria-modal="true"/);
  });

  test("modal content uses --uni-shadow-modal-elevated token (dual-theme border layer), not hardcoded black", async () => {
    const src = await read("src/components/ui/modal.tsx");
    expect(src).toContain("shadow-[var(--uni-shadow-modal-elevated)]");
    expect(src).not.toContain("MODAL_SHADOW");
    expect(src).not.toMatch(/boxShadow/);
  });

  test("modal content responsive max-width + scrollable overflow (official)", async () => {
    const src = await read("src/components/ui/modal.tsx");
    expect(src).toContain("max-modal:max-w-[calc(100vw-20px)]");
    expect(src).toContain("sm:overflow-hidden overflow-y-auto");
  });

  test("Modal exports full API surface", async () => {
    const src = await read("src/components/ui/modal.tsx");
    expect(src).toMatch(
      /export\s*\{\s*Modal,\s*ModalTrigger,\s*ModalPortal,\s*ModalOverlay,\s*ModalContent,\s*ModalHeader,\s*ModalTitle,\s*ModalDescription,\s*ModalFooter,\s*ModalClose,/,
    );
    expect(src).toMatch(/type ModalContentProps/);
  });
});
