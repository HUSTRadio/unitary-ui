// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";
import { Calendar } from "@/components/ui/calendar";
import { I18nProvider } from "@/lib/i18n";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as typeof ResizeObserver;
HTMLElement.prototype.scrollIntoView = vi.fn();

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(props: Record<string, unknown> = {}, localized = false) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root.render(
      localized ? (
        <I18nProvider locale="zh-CN">
          <Calendar horizontalLayout {...props} />
        </I18nProvider>
      ) : (
        <Calendar horizontalLayout {...props} />
      ),
    ),
  );
  const trigger = container.querySelector<HTMLButtonElement>(
    '[data-testid="calendar/trigger/button"]',
  )!;
  act(() => trigger.click());
  return trigger;
}

function setInputValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("calendar enhancements", () => {
  test("multiple calendar comboboxes keep label and input ids instance-local", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    const presets = {
      recent: { text: "Recent", start: new Date(2026, 0, 1), end: new Date(2026, 0, 7) },
    };
    act(() =>
      root.render(
        <>
          <Calendar showCombobox presets={presets} comboboxLabel="First period" />
          <Calendar showCombobox presets={presets} comboboxLabel="Second period" />
        </>,
      ),
    );

    const inputs = [...container.querySelectorAll<HTMLInputElement>('[data-testid="calendar/combobox-input"]')];
    const labels = inputs.map((input) => document.getElementById(input.getAttribute("aria-labelledby")!));
    expect(new Set(inputs.map((input) => input.id)).size).toBe(2);
    expect(new Set(labels.map((label) => label?.id)).size).toBe(2);
    expect(labels.map((label) => label?.textContent)).toEqual(["First period", "Second period"]);
    expect(labels.every((label, index) => label?.getAttribute("for") === inputs[index]?.id)).toBe(true);
  });

  test("calendar trigger does not submit an enclosing form", () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root.render(
        <form onSubmit={onSubmit}>
          <Calendar />
        </form>,
      ),
    );

    act(() =>
      container.querySelector<HTMLButtonElement>('[data-testid="calendar/trigger/button"]')!.click(),
    );
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("open trigger controls the mounted calendar dialog", () => {
    const trigger = mount();
    const controlledId = trigger.getAttribute("aria-controls");
    expect(controlledId).toBeTruthy();
    expect(document.getElementById(controlledId!)).not.toBeNull();
  });

  test("wrap keeps date objects atomic and publishes all bounds", () => {
    const trigger = mount({
      wrap: true,
      wrapMinRows: 2,
      wrapMaxRows: 4,
      wrapMinHeight: 50,
      wrapMaxHeight: 100,
    });
    const calendar = container.querySelector<HTMLElement>("[data-geist-calendar]")!;
    expect(trigger.className).not.toContain("whitespace-nowrap");
    expect(calendar.style.getPropertyValue("--wrap-min-rows")).toBe("2");
    expect(calendar.style.getPropertyValue("--wrap-max-rows")).toBe("4");
    expect(calendar.style.getPropertyValue("--wrap-min-height")).toBe("50px");
  });

  test("date inputs are editable, centered and explain their format", () => {
    mount({ locale: "zh-CN", timeZone: "Asia/Shanghai" });
    const input = document.querySelector<HTMLInputElement>('input[aria-label="Start date"]')!;
    expect(input.readOnly).toBe(false);
    expect(input.placeholder).toBe("yyyy/MM/dd");
    expect(input.className).toContain("text-center");
  });

  test("invalid editable input keeps its value and exposes an accessible error", () => {
    mount({ locale: "zh-CN", timeZone: "Asia/Shanghai" });
    const input = document.querySelector<HTMLInputElement>('input[aria-label="Start date"]')!;
    act(() => {
      setInputValue(input, "2026/13/40");
      input.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    });
    expect(input.value).toBe("2026/13/40");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.className).toContain("--danger");
  });

  test("unpadded date input is parsed then rendered in the declared format", () => {
    mount({ locale: "zh-CN", timeZone: "Asia/Shanghai" });
    const input = document.querySelector<HTMLInputElement>('input[aria-label="Start date"]')!;
    act(() => {
      setInputValue(input, "2026/8/5");
      input.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    });
    expect(input.value).toBe("2026/08/05");
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  test("framework i18n localizes calendar UI without changing its default English API", () => {
    mount({}, true);
    expect(document.body.textContent).toContain("开始");
    expect(document.body.textContent).toContain("应用");
    expect(document.querySelector('input[aria-label="开始日期"]')).not.toBeNull();
    expect(document.querySelector('input[aria-label="结束时间"]')).not.toBeNull();
    expect(document.querySelector('[aria-label="上一月"]')).not.toBeNull();
    expect(document.body.textContent).toMatch(/\d{4}年\d{1,2}月/u);
  });

  test("uses an explicit calendar locale over the framework locale", () => {
    mount({ locale: "en-US" }, true);
    expect(document.body.textContent).toMatch(/[A-Z][a-z]+ \d{4}/u);
  });
});
