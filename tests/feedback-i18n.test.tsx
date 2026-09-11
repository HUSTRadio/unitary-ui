// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { Feedback } from "@/components/ui/feedback";
import { I18nProvider } from "@/lib/i18n";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(localized = false) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root.render(
      localized ? (
        <I18nProvider locale="zh-CN">
          <Feedback showTopics />
        </I18nProvider>
      ) : (
        <Feedback showTopics />
      ),
    ),
  );
  // 默认变体先点击次级按钮，再在 portal 中呈现反馈表单。
  const trigger = container.querySelector<HTMLButtonElement>('[data-slot="feedback-trigger"]')!;
  act(() => trigger.click());
}

describe("Feedback i18n", () => {
  test("keeps English defaults without an I18nProvider", () => {
    mount();

    expect(container.textContent).toContain("Feedback");
    expect(document.body.textContent).toContain("Select a topic...");
    expect(document.querySelector<HTMLTextAreaElement>("textarea")?.placeholder).toBe(
      "Your feedback...",
    );
    expect(document.querySelector<HTMLButtonElement>('[role="radio"]')?.ariaLabel).toBe(
      "Select Hate it emoji",
    );
    expect(document.querySelector('[data-slot="feedback-support"]')?.textContent).toBe(
      "Markdown supported.",
    );
  });

  test("localizes component-owned labels, topics, prompts, and aria text", () => {
    mount(true);

    expect(container.textContent).toContain("反馈");
    expect(document.body.textContent).toContain("选择主题…");
    expect(document.body.textContent).toContain("账户与访问控制");
    expect(document.body.textContent).toContain("发送");
    expect(document.querySelector<HTMLTextAreaElement>("textarea")?.placeholder).toBe(
      "请输入反馈…",
    );
    expect(document.querySelector<HTMLSelectElement>("select")?.ariaLabel).toBe("产品主题选择");
    expect(document.querySelector<HTMLButtonElement>('[role="radio"]')?.ariaLabel).toBe(
      "选择“很不喜欢”表情",
    );
    expect(document.querySelector('[data-slot="feedback-support"]')?.textContent).toBe(
      "支持 Markdown。",
    );
  });

  test("does not translate caller-provided content", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root.render(
        <I18nProvider locale="zh-CN">
          <Feedback label="Report a bug" copy="Tell us what happened" />
        </I18nProvider>,
      ),
    );
    // label 在触发器内，copy 在打开 Popover 后出现。
    expect(container.textContent).toContain("Report a bug");
    const trigger = container.querySelector<HTMLButtonElement>('[data-slot="feedback-trigger"]')!;
    act(() => trigger.click());
    expect(document.body.textContent).toContain("Tell us what happened");
  });
});
