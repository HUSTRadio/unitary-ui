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
    expect(block.className).toContain("rounded-[6px]");
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

  test("renders a native select switcher and a tablist switcher", () => {
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
    const select = document.querySelector<HTMLSelectElement>("select")!;
    expect(select.className).toContain("opacity-0");
    act(() => {
      select.value = "TypeScript";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
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
    expect(document.querySelectorAll("[role='tab']")).toHaveLength(2);
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
