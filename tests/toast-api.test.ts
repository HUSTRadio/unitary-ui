import { describe, expect, test } from "vitest";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EXAMPLE_SOURCE } from "../docs/geist/src/examples/registry";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFile(path.join(root, relativePath), "utf8");

describe("Toast official API contract (G12 audit fixes)", () => {
  test("G12-TOAST-01: success/warning/error kinds use semantic status backgrounds", async () => {
    const src = await read("src/components/ui/toast.tsx");
    expect(src).toContain('toast.kind === "success" && "bg-link text-white"');
    expect(src).toContain(
      'toast.kind === "warning" && "bg-button-warning text-button-warning-foreground"',
    );
    expect(src).toContain('toast.kind === "error" && "bg-danger text-danger-foreground"');
    expect(src).not.toMatch(/bg-\[#(?:0072f5|ff990a|e5484d)\]/);
  });

  test("G12-TOAST-01: message kind keeps the neutral bg-background-100 surface", async () => {
    const src = await read("src/components/ui/toast.tsx");
    expect(src).toMatch(/bg-background-100/);
    // the neutral surface must be the base class, kinds only add on top
    const baseIndex = src.indexOf("bg-background-100");
    const successIndex = src.indexOf("bg-link");
    expect(baseIndex).toBeGreaterThan(-1);
    expect(successIndex).toBeGreaterThan(baseIndex);
  });

  test("G12-TOAST-01: kind icons inherit the toast foreground instead of being tinted", async () => {
    const src = await read("src/components/ui/toast.tsx");
    // No leftover per-kind icon tint classes (colors now live on the container background)
    expect(src).not.toMatch(/text-success/);
    expect(src).not.toMatch(/text-warning/);
    expect(src).not.toMatch(/text-destructive/);
    // Icon renders with a fixed size and inherits color from the li
    expect(src).toMatch(/<Icon aria-hidden className="mt-0\.5 size-4 shrink-0" \/>/);
  });

  test("Toast exports Toasts and useToasts", async () => {
    const src = await read("src/components/ui/toast.tsx");
    expect(src).toMatch(/export\s*\{\s*Toasts,\s*useToasts\s*\}/);
  });

  test("useToasts exposes message/success/warning/error/dismiss", async () => {
    const src = await read("src/components/ui/toast.tsx");
    expect(src).toMatch(/message:\s*\(options: ToastOptions\) => addToast\("message", options\)/);
    expect(src).toMatch(/success:\s*\(text: React\.ReactNode\) => addToast\("success", text\)/);
    expect(src).toMatch(/warning:\s*\(text: React\.ReactNode\) => addToast\("warning", text\)/);
    expect(src).toMatch(/error:\s*\(text: React\.ReactNode\) => addToast\("error", text\)/);
    expect(src).toMatch(/dismiss,/);
  });

  test("ToastOptions supports text/preserve/action/onAction/onUndoAction/duration", async () => {
    const src = await read("src/components/ui/toast.tsx");
    expect(src).toMatch(/interface ToastOptions\s*\{/);
    expect(src).toMatch(/text: React\.ReactNode;/);
    expect(src).toMatch(/preserve\??:/);
    expect(src).toMatch(/action\??:/);
    expect(src).toMatch(/onAction\??:/);
    expect(src).toMatch(/onUndoAction\??:/);
    expect(src).toMatch(/duration\??:/);
    // undo toasts stay longer (5-10s family), default auto-dismiss ~3.5s
    expect(src).toMatch(/toast\.onUndoAction \? 7000 : 3500/);
  });

  test("Toast container/close-button a11y contract", async () => {
    const src = await read("src/components/ui/toast.tsx");
    // live region + per-toast status role
    expect(src).toMatch(/aria-live="polite"/);
    expect(src).toMatch(/aria-relevant="additions text"/);
    expect(src).toMatch(/role="status"/);
    // close button with data-slot + dismiss wiring
    expect(src).toMatch(/data-slot="toast-close"/);
    expect(src).toMatch(/aria-label=\{t\("Dismiss notification"\)\}/);
    expect(src).toMatch(/onClick=\{\(\) => dismiss\(toast\.id\)\}/);
  });

  test("default demo keeps the official neutral message instead of claiming an unrelated result", async () => {
    const docs = await read("docs/geist/src/components/docs-components-page.tsx");
    const example = EXAMPLE_SOURCE.toast.Default;
    expect(example).toContain("The Evil Rabbit jumped over the fence.");
    expect(example).not.toContain("Project deleted");
    expect(docs).toContain("EXAMPLE_REGISTRY[name]");
    expect(docs).toContain("code={record.source}");
  });

  test("toast action has a stable slot, compact geometry, and dismisses after invocation", async () => {
    const src = await read("src/components/ui/toast.tsx");
    expect(src).toMatch(/const action = toast\.onUndoAction \?\? toast\.onAction/);
    expect(src).toMatch(
      // pointer-coarse:* 为 HIG-AUD-013 的触屏命中区声明（桌面维持 32px 视觉）
      /<button[\s\S]*?data-slot="toast-action"[\s\S]*?className="inline-flex h-8 items-center justify-center px-2\.5 py-0 text-label-14 leading-5 font-medium shrink-0 rounded-lg outline-none hover:bg-gray-alpha-200 focus-ring pointer-coarse:min-h-11 pointer-coarse:min-w-11"[\s\S]*?onClick=\{\(\) => \{[\s\S]*?action\?\.\(\);[\s\S]*?dismiss\(toast\.id\);[\s\S]*?\}\}[\s\S]*?\{actionLabel\}[\s\S]*?<\/button>/,
    );
  });
});
