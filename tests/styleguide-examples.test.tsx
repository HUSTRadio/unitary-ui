// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import App from "@/App";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

vi.mock("@/lib/font-metrics", () => ({ useFontMetrics: () => {} }));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root.render(
      <ThemeProvider>
        <I18nProvider locale="zh-CN">
          <App />
        </I18nProvider>
      </ThemeProvider>,
    ),
  );
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  document.body.innerHTML = "";
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

const pageButton = (page: string) =>
  container.querySelector<HTMLButtonElement>(`button[data-styleguide-page="${page}"]`)!;

const clickPage = (page: string) => act(() => pageButton(page).click());

const click = (element: Element) => act(() => (element as HTMLElement).click());

const setInputValue = (input: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  act(() => {
    setter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
};

const buttonByType = (type: string) =>
  container.querySelector<HTMLButtonElement>(`button[data-slot="button"][data-type="${type}"]`);

describe("living styleguide examples track the current component contracts", () => {
  test("overview uses semantic action labels and current form components", () => {
    expect(buttonByType("default")?.textContent).toBe("部署项目");
    expect(buttonByType("secondary")?.textContent).toBe("查看日志");
    expect(buttonByType("tertiary")?.textContent).toBe("更多操作");
    expect(buttonByType("error")?.textContent).toBe("删除项目");
    expect(buttonByType("warning")?.textContent).toBe("覆盖部署");

    expect(container.querySelector('input[type="search"][aria-label="搜索资产"]')).toBeTruthy();
    expect(container.querySelectorAll('input[placeholder="禁用状态"]')).toHaveLength(1);
    expect(container.querySelector('input[value="hustradio"]')).toBeTruthy();

    const toggle = container.querySelector('input[type="checkbox"][aria-label="自动更新"]');
    expect(toggle?.closest("label")?.textContent).toContain("自动更新");
    expect(container.querySelector('[data-slot="badge"]')?.textContent).toBe("草稿");
    const steps = [...container.querySelectorAll("li")].filter((item) =>
      item.textContent?.match(/^第[一二三]步：/),
    );
    expect(steps).toHaveLength(3);
    expect(steps.every((step) => step.closest('ol[role="list"]') != null)).toBe(true);
    expect(
      container.querySelector<HTMLButtonElement>(
        'button[aria-label="查看 ThinkPad X1 Carbon"]',
      )?.textContent,
    ).toContain("查看资产");
    expect([...container.querySelectorAll("th")].map((cell) => cell.getAttribute("scope"))).toEqual([
      "col",
      "col",
      "col",
      "col",
    ]);
    expect(container.textContent).not.toContain("2026-08-08");
    expect(container.querySelector("footer")?.textContent).toContain("组件示例与当前组件 API 同步");
  });

  test("composite pages use current field, search, checkbox, and button APIs", () => {
    clickPage("form");
    expect(container.querySelector('[data-slot="input-label"]')?.textContent).toContain(
      "姓名（必填）",
    );
    expect(container.querySelector('[data-slot="select-label"]')?.textContent).toBe("部门");
    expect(container.querySelector('[data-slot="textarea-field"] label')?.textContent).toContain(
      "备注",
    );
    expect(container.querySelector('button[data-slot="button"]')?.textContent).toBe("提交成员信息");
    const termsLabel = [...container.querySelectorAll('input[type="checkbox"]')]
      .map((input) => input.closest("label"))
      .find((label) => label?.textContent?.includes("我已阅读并同意相关条款"));
    expect(termsLabel?.textContent).toContain("我已阅读并同意相关条款");

    clickPage("table");
    expect(
      container.querySelector('[data-slot="search-input"] input[aria-label="搜索资产"]'),
    ).toBeTruthy();
    expect(
      container.querySelector<HTMLButtonElement>(
        'button[data-type="tertiary"][aria-label="查看 ThinkPad X1 Carbon"]',
      )?.textContent,
    ).toBe("查看资产");

    clickPage("workflow");
    expect(container.querySelector('button[data-type="tertiary"]')?.textContent).toBe("重置流程");

    clickPage("settings");
    expect(container.querySelector('[data-slot="select-label"]')?.textContent).toBe("界面语言");
    expect(container.querySelector('[data-slot="input-label"]')?.textContent).toBe("组织名称");
  });

  test("form and settings reset actions restore every interactive default", () => {
    clickPage("form");
    const notify = container.querySelector<HTMLInputElement>('input[aria-label="邮件通知"]')!;
    const terms = [...container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].find(
      (input) => input.closest("label")?.textContent?.includes("我已阅读并同意相关条款"),
    )!;
    click(notify);
    click(terms);
    expect(notify.checked).toBe(false);
    expect(terms.checked).toBe(true);
    click([...container.querySelectorAll("button")].find((button) => button.textContent === "重置表单")!);
    expect(notify.checked).toBe(true);
    expect(terms.checked).toBe(false);

    clickPage("settings");
    const email = container.querySelector<HTMLInputElement>('input[aria-label="邮件通知"]')!;
    click(email);
    expect(email.checked).toBe(false);
    click(
      [...container.querySelectorAll("button")].find(
        (button) => button.textContent === "恢复默认设置",
      )!,
    );
    expect(email.checked).toBe(true);
  });

  test("filtered table selection only toggles visible rows and preserves hidden selections", () => {
    clickPage("table");
    click(container.querySelector('input[aria-label="选择 ThinkPad X1 Carbon"]')!);

    const search = container.querySelector<HTMLInputElement>('input[aria-label="搜索资产"]')!;
    setInputValue(search, "SIGLENT");
    const selectAll = container.querySelector<HTMLInputElement>('input[aria-label="全选"]')!;
    expect(selectAll.indeterminate).toBe(false);

    click(selectAll);
    expect(container.textContent).toContain("已选择 2 项");
    click(selectAll);
    expect(container.textContent).toContain("已选择 1 项");
  });
});
