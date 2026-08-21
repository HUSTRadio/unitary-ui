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

describe("calendar enhancements", () => {
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
    const input = document.querySelector<HTMLInputElement>('input[aria-labelledby="start-date"]')!;
    expect(input.readOnly).toBe(false);
    expect(input.placeholder).toBe("yyyy/MM/dd");
    expect(input.className).toContain("text-center");
  });

  test("invalid editable input keeps its value and exposes an accessible error", () => {
    mount({ locale: "zh-CN", timeZone: "Asia/Shanghai" });
    const input = document.querySelector<HTMLInputElement>('input[aria-labelledby="start-date"]')!;
    act(() => {
      input.value = "2026/13/40";
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
    });
    expect(input.value).toBe("2026/13/40");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.className).toContain("--danger");
  });

  test("framework i18n localizes calendar UI without changing its default English API", () => {
    mount({}, true);
    expect(document.body.textContent).toContain("开始");
    expect(document.body.textContent).toContain("应用");
  });
});
