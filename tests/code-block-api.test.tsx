// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { CodeBlock } from "@/components/ui/code-block";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const cleanups: Array<() => void> = [];
afterEach(() => {
  while (cleanups.length) cleanups.pop()?.();
  document.body.innerHTML = "";
});

function render(node: React.ReactNode) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(node));
  cleanups.push(() => act(() => root.unmount()));
  return container;
}

const code = ["const one = 1;", "const two = 2;", "return one + two;"].join("\n");

describe("CodeBlock official API contract", () => {
  test("renders the official six-pixel surface, header, and language semantics", () => {
    render(
      <CodeBlock filename="example.ts" language="typescript">
        {code}
      </CodeBlock>,
    );
    const block = document.querySelector<HTMLElement>("[data-slot='code-block']")!;
    const header = document.querySelector<HTMLElement>("[data-slot='code-block-header']")!;
    expect(block.className).toContain("rounded-md");
    expect(header.className).toContain("h-12");
    expect(header.textContent).toContain("example.ts");
    expect(header.textContent).not.toContain("typescript");
    expect(block.querySelector(".prism-code")).toBeTruthy();
  });

  test("renders line numbers and official highlighted, added, and removed states", () => {
    render(
      <CodeBlock
        language="typescript"
        highlightedLinesNumbers={[1]}
        addedLinesNumbers={[2]}
        removedLinesNumbers={[3]}
      >
        {code}
      </CodeBlock>,
    );
    const lines = [...document.querySelectorAll<HTMLElement>("[data-code-line]")];
    expect(lines).toHaveLength(3);
    expect(lines[0].getAttribute("data-highlighted")).toBe("true");
    expect(lines[1].getAttribute("data-added")).toBe("true");
    expect(lines[2].getAttribute("data-removed")).toBe("true");
    const number = lines[0].querySelector<HTMLButtonElement>("button");
    expect(number?.getAttribute("aria-label")).toBe("Add line anchor to the URL");
    expect(number?.tabIndex).toBe(-1);
  });

  test("supports referenced lines and hiding line numbers", () => {
    const { rerender } = (() => {
      const container = document.createElement("div");
      document.body.append(container);
      const root = createRoot(container);
      act(() => root.render(<CodeBlock referencedLinesNumbers={[2]}>{code}</CodeBlock>));
      cleanups.push(() => act(() => root.unmount()));
      return { rerender: (node: React.ReactNode) => act(() => root.render(node)) };
    })();
    expect(document.querySelector("[data-code-line='2']")?.getAttribute("data-referenced")).toBe(
      "true",
    );
    rerender(<CodeBlock hideLineNumbers>{code}</CodeBlock>);
    expect(document.querySelector("[data-code-line] button")).toBeNull();
  });

  test("renders a themed menu switcher and a tablist switcher", () => {
    const onSelect = vi.fn();
    const { unmount } = (() => {
      const container = render(
        <CodeBlock
          switcher={{
            options: ["JavaScript", "TypeScript"],
            value: "JavaScript",
            onChange: onSelect,
          }}
        >
          {code}
        </CodeBlock>,
      );
      return { unmount: () => container.remove() };
    })();
    const trigger = document.querySelector<HTMLButtonElement>("[data-slot='code-block-switcher']")!;
    expect(trigger.textContent).toContain("JavaScript");
    act(() => {
      trigger.dispatchEvent(
        new MouseEvent("pointerdown", { bubbles: true, button: 0, ctrlKey: false }),
      );
    });
    const option = [...document.querySelectorAll<HTMLElement>("[data-slot='menu-item']")].find(
      (item) => item.textContent === "TypeScript",
    )!;
    expect(option).toBeTruthy();
    act(() => option.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(onSelect).toHaveBeenCalledWith("TypeScript");
    unmount();

    render(
      <CodeBlock
        tabs={{ options: ["JavaScript", "TypeScript"], value: "JavaScript", onChange: onSelect }}
      >
        {code}
      </CodeBlock>,
    );
    expect(document.querySelector("[role='tablist']")).toBeTruthy();
    const tabs = [...document.querySelectorAll<HTMLButtonElement>("[role='tab']")];
    expect(tabs).toHaveLength(2);
    // 代码面板是 tabpanel，且与激活 tab 通过 id 关联（此前选项卡与内容完全没有关联）。
    const panel = document.querySelector<HTMLElement>("[role='tabpanel']")!;
    expect(panel.getAttribute("aria-labelledby")).toBe(tabs[0].id);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    // roving tabindex：只有激活 tab 可 Tab 聚焦，其余走方向键。
    expect(tabs[0].getAttribute("tabindex")).toBe("0");
    expect(tabs[1].getAttribute("tabindex")).toBe("-1");
    act(() => tabs[1].dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(onSelect).toHaveBeenCalledWith("TypeScript");
  });

  test("tabs accept the official {label, value} options and switch with arrow keys", () => {
    const onSelect = vi.fn();
    render(
      <CodeBlock
        filename="language-switcher.tsx"
        tabs={{
          options: [
            { label: "JavaScript", value: "jsx" },
            { label: "TypeScript", value: "tsx" },
          ],
          value: "jsx",
          onChange: onSelect,
        }}
      >
        {code}
      </CodeBlock>,
    );
    const tabs = [...document.querySelectorAll<HTMLButtonElement>("[role='tab']")];
    // 官方形态：label 用于展示，value 用于匹配与回调，两者可以不同。
    expect(tabs.map((tab) => tab.textContent)).toEqual(["JavaScript", "TypeScript"]);
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    act(() => tabs[0].dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(onSelect).toHaveBeenCalledWith("jsx");
    act(() => {
      tabs[0].focus();
      tabs[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }),
      );
    });
    expect(onSelect).toHaveBeenCalledWith("tsx");
    expect(document.activeElement).toBe(tabs[1]);
  });

  test("renders headerless floating copy and v0 actions", () => {
    render(<CodeBlock v0="ask">{code}</CodeBlock>);
    const block = document.querySelector<HTMLElement>("[data-slot='code-block']")!;
    expect(block.querySelector("[data-slot='code-block-header']")).toBeNull();
    expect(block.querySelector("button[aria-label='Copy to clipboard']")).toBeTruthy();
    // 官方实测（2026-08-15）：v0 链接可见 "Ask"（aria-hidden）+ sr-only "Ask v0"，
    // textContent 为 "AskAsk v0"，与本地一致。
    expect(block.querySelector("a")?.textContent).toBe("AskAsk v0");
  });
});
