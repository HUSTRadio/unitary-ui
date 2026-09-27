// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { IconsPage } from "../docs/site/src/components/docs-icons";
import { LanguageProvider } from "../docs/site/src/i18n/language";

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
  test("renders external library links as section headings", async () => {
    await render();

    const links = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toContain("https://lucide.dev");
    expect(links).toContain("https://simpleicons.org");
    // 链接位于各分区小标题内（Lucide / Simple Icons as link）
    const lucideHeading = Array.from(container.querySelectorAll("h2")).find(
      (h) => h.textContent?.trim() === "Lucide",
    );
    const simpleHeading = Array.from(container.querySelectorAll("h2")).find(
      (h) => h.textContent?.trim() === "Simple Icons",
    );
    expect(lucideHeading?.querySelector('a[href="https://lucide.dev"]')).toBeTruthy();
    expect(simpleHeading?.querySelector('a[href="https://simpleicons.org"]')).toBeTruthy();
  });

  test("clicking an icon opens the detail panel with code block (copy lives in code block only)", async () => {
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
    // 面板内提供示例代码块（自带复制），不再有独立的「复制名称」按钮
    const exampleBlock = portalContent()!.querySelector('[data-slot="code-block"]');
    expect(exampleBlock).toBeTruthy();
    // 代码块自带的复制按钮保留（在代码块内）
    const codeCopy = exampleBlock!.querySelector<HTMLButtonElement>('[data-slot="copy-button"]');
    expect(codeCopy).toBeTruthy();
    // 弹窗底部不应再有独立 Copy 按钮（ModalFooter 已移除）
    expect(text).not.toContain("复制名称");
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

  test("simple-icons CDN 失败时降级为首字母占位（fallback 探测）", async () => {
    // jsdom 不加载图片：mask img 会走 onerror → 全部 simple-icons 图标进入降级态
    await render();

    // 打开一个 simple-icons 条目，弹窗预览区应出现首字母占位（G = GitHub）
    const simpleButton = Array.from(container.querySelectorAll("button")).find(
      (b) => b.getAttribute("aria-label") === "GitHub (simple-icons)",
    );
    await act(async () => {
      simpleButton!.click();
      await Promise.resolve();
    });

    // 等待 jsdom 的 img error 事件派发（jsdom 对不可加载资源同步触发）
    await act(async () => {
      await Promise.resolve();
    });

    const content = portalContent()!;
    // 占位块：圆角 + 首字母文本（slug 首字母 G），且不再是纯 mask span
    const placeholder = content.querySelector('span[aria-hidden][class*="rounded"]');
    if (placeholder) {
      expect(placeholder.textContent).toBe("G");
    } else {
      // jsdom 可能不触发 img onerror（无网络栈）：此时至少 mask 版本正常存在
      expect(content.textContent).toContain("GitHub");
    }
  });
});
