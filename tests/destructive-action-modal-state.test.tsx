// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

function renderModal(open: boolean) {
  act(() =>
    root.render(
      <DestructiveActionModal
        open={open}
        title="Delete project"
        confirmLabel="Delete"
        verificationPhrase="unitary"
      />,
    ),
  );
}

function setInputValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

describe("DestructiveActionModal verification gate", () => {
  test("requires the verification phrase again after reopening", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);

    renderModal(true);
    const input = document.querySelector<HTMLInputElement>('input[aria-labelledby$="-label"]')!;
    act(() => setInputValue(input, "unitary"));
    expect(document.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(false);

    renderModal(false);
    renderModal(true);

    expect(document.querySelector<HTMLInputElement>('input[aria-labelledby$="-label"]')!.value).toBe("");
    expect(document.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(true);
  });
});

describe("DestructiveActionModal layers and motion (HIG-AUD-009/012)", () => {
  // jsdom 环境下 import.meta.url 非 file: 协议，源码读取走 cwd 相对路径
  const source = readFileSync(
    path.join(process.cwd(), "src/components/ui/destructive-action-modal.tsx"),
    "utf8",
  );

  test("overlay and content ride the modal band with mirrored, tokenized motion", () => {
    // 遮罩与内容同为 modal 带（与 modal.tsx 同族，HIG-AUD-012 台账的「左右不一致」项）
    expect(source.match(/z-\[var\(--uni-z-modal\)\]/g)?.length).toBe(2);
    expect(source).toContain("duration-(--uni-motion-overlay) ease-pop");
    expect(source).toContain("max-h-[min(800px,80vh)] supports-[height:100dvh]:max-h-[min(800px,80dvh)] overflow-y-auto");
    expect(source).toContain("data-[state=closed]:zoom-out-95");
    expect(source).not.toMatch(/(^|[\s"'])z-50(?=[\s"'(]|$)/m);
  });
});
