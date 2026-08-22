// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { IconsPage } from "../docs/geist/src/components/docs-icons";
import { LanguageProvider } from "../docs/geist/src/i18n/language";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
});

async function render() {
  await act(async () => {
    root.render(
      <LanguageProvider>
        <IconsPage />
      </LanguageProvider>,
    );
  });
}

function portalContent(): Element | null {
  // Radix Dialog renders into a portal appended to <body>; find the dialog content.
  return document.querySelector('[data-slot="modal-content"]');
}

describe("IconsPage detail panel (shard-C item 22)", () => {
  test("renders external library links in the title area", async () => {
    await render();

    const links = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toContain("https://lucide.dev");
    expect(links).toContain("https://simpleicons.org");
  });

  test("clicking an icon opens the detail panel instead of copying", async () => {
    await render();

    const gridButtons = Array.from(container.querySelectorAll("button"));
    const iconButton = gridButtons.find((b) => b.getAttribute("aria-label") === "Search");
    expect(iconButton).toBeTruthy();

    await act(async () => {
      iconButton!.click();
      await Promise.resolve();
    });

    expect(portalContent()).not.toBeNull();
    const text = portalContent()!.textContent ?? "";
    expect(text).toContain("Search");
    // 面板内提供复制名称（默认 zh-CN 文案 复制名称），而非点击网格即复制
    const copyName = portalContent()!.querySelector<HTMLButtonElement>(
      '[data-slot="copy-button"][aria-label="复制名称"]',
    );
    expect(copyName).not.toBeNull();
  });

  test("changing size updates the preview and generated code", async () => {
    await render();

    const iconButton = Array.from(container.querySelectorAll("button")).find(
      (b) => b.getAttribute("aria-label") === "Star",
    );
    await act(async () => {
      iconButton!.click();
      await Promise.resolve();
    });

    const content = portalContent()!;
    const sizeInput = content.querySelector<HTMLInputElement>("#icon-size")!;
    expect(sizeInput).toBeTruthy();

    await act(async () => {
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )!.set!;
      setter.call(sizeInput, "48");
      sizeInput.dispatchEvent(new Event("input", { bubbles: true }));
      await Promise.resolve();
    });

    // 生成的示例代码反映新 size（CodeBlock 内文本）
    expect(content.textContent ?? "").toContain("size={48}");
  });

  test("stroke width settings only render for lucide icons", async () => {
    await render();

    const lucideButton = Array.from(container.querySelectorAll("button")).find(
      (b) => b.getAttribute("aria-label") === "Search",
    );
    await act(async () => {
      lucideButton!.click();
      await Promise.resolve();
    });
    expect(portalContent()!.querySelector("#icon-stroke-width")).not.toBeNull();

    // 关闭面板：走 Modal 的 onOpenChange(false)（Escape/外点同路径）
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await Promise.resolve();
    });
    expect(portalContent()).toBeNull();

    // 打开 simple-icons 条目：不应有 stroke width 设置
    const simpleButton = Array.from(container.querySelectorAll("button")).find(
      (b) => b.getAttribute("aria-label") === "GitHub (simple-icons)",
    );
    expect(simpleButton).toBeTruthy();
    await act(async () => {
      simpleButton!.click();
      await Promise.resolve();
    });
    expect(portalContent()).not.toBeNull();
    expect(portalContent()!.querySelector("#icon-stroke-width")).toBeNull();
  });
});
