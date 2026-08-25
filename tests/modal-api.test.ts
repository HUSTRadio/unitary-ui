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
    // official live metrics: light rgb(242,242,242) / dark rgb(0,0,0) @ opacity 0.8
    expect(line).toContain("bg-[#f2f2f2]/80");
    expect(line).toContain("dark:bg-black/80");
    expect(line).toContain("z-[300]");
  });

  test("G07-MODAL-01: overlay has NO backdrop blur and no old black/50 z-50 scrim", async () => {
    const src = await read("src/components/ui/modal.tsx");
    const line = overlayLine(src);
    expect(line).toBeDefined();
    expect(line).not.toMatch(/backdrop-/);
    expect(line).not.toContain("bg-black/50");
    expect(line).not.toContain("z-50");
  });

  test("overlay fades with the official 300ms spring curve", async () => {
    const src = await read("src/components/ui/modal.tsx");
    expect(src).toContain("data-[state=open]:fade-in-0");
    expect(src).toContain("data-[state=closed]:fade-out-0");
    expect(src).toContain("duration-(--uni-duration-slow) ease-[cubic-bezier(0.175,0.885,0.32,1.1)]");
  });

  test("G07-MODAL-01: modal content keeps z-[300] so it stacks above the z-300 overlay", async () => {
    const src = await read("src/components/ui/modal.tsx");
    const contentLine = src
      .split("\n")
      .find((line) => line.includes('"fixed top-[50%] left-[50%]'));
    expect(contentLine).toBeDefined();
    expect(contentLine).toContain("z-[300]");
  });

  test("ModalContent forces aria-modal=true on the dialog content", async () => {
    const src = await read("src/components/ui/modal.tsx");
    expect(src).toMatch(/aria-modal="true"/);
  });

  test("modal content uses --ds-shadow-modal-elevated token (dual-theme border layer), not hardcoded black", async () => {
    const src = await read("src/components/ui/modal.tsx");
    expect(src).toContain("shadow-[var(--ds-shadow-modal-elevated)]");
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
