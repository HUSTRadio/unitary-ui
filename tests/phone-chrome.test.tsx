// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Phone, PhoneScreen } from "@/components/ui/phone";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
HTMLElement.prototype.scrollIntoView = vi.fn();

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mount(node: React.ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(node));
}

describe("Phone status bar & Safari chrome", () => {
  test("default status bar renders 08:00 with full meters and is aria-hidden", () => {
    mount(
      <Phone>
        <PhoneScreen />
      </Phone>,
    );
    const bar = container.querySelector('[data-slot="phone-status-bar"]')!;
    expect(bar.getAttribute("aria-hidden")).toBe("true");
    expect(bar.textContent).toContain("08:00");
    // battery icon present
    expect(bar.querySelectorAll("svg").length).toBeGreaterThanOrEqual(3);
  });

  test("statusBar={false} removes the bar", () => {
    mount(
      <Phone statusBar={false}>
        <PhoneScreen />
      </Phone>,
    );
    expect(container.querySelector('[data-slot="phone-status-bar"]')).toBeNull();
  });

  test("custom levels and battery clamping are applied", () => {
    mount(
      <Phone statusBar={{ time: "9:41", cellular: 2, wifi: 1, battery: 150, appearance: "dark" }}>
        <PhoneScreen />
      </Phone>,
    );
    const bar = container.querySelector('[data-slot="phone-status-bar"]')!;
    expect(bar.textContent).toContain("9:41");
    expect(bar.className).toContain("text-white");
    // battery fill width clamped: 150% input must not exceed the full-width rect (18 units at 100%)
    const batteryRect = container.querySelector<SVGRectElement>(
      "[data-battery-icon] rect:nth-child(2)",
    )!;
    expect(Number(batteryRect.getAttribute("width"))).toBeLessThanOrEqual(18);
  });

  test("safari defaults to compact/example.com; three layouts render", () => {
    for (const layout of ["compact", "bottom", "top"] as const) {
      mount(
        <Phone safari={{ layout }}>
          <PhoneScreen />
        </Phone>,
      );
      const chrome = container.querySelector('[data-slot="phone-safari"]')!;
      expect(chrome.getAttribute("aria-hidden")).toBe("true");
      expect(chrome.textContent).toContain("example.com");
    }
  });

  test("safari={false} (default) renders no chrome; controlled url updates and truncates", () => {
    mount(
      <Phone>
        <PhoneScreen />
      </Phone>,
    );
    expect(container.querySelector('[data-slot="phone-safari"]')).toBeNull();

    const Rerender = ({ url }: { url: string }) => (
      <Phone safari={{ url }}>
        <PhoneScreen />
      </Phone>
    );
    mount(<Rerender url="https://vercel.com/geist/phone/docs" />);
    let chrome = container.querySelector('[data-slot="phone-safari"]')!;
    expect(chrome.textContent).not.toContain("https://vercel.com/geist/phone/docs");

    act(() =>
      root.render(<Rerender url="  https://very-long.example.com/a/b/c/d/e/f/g/h/i/j/k  " />),
    );
    chrome = container.querySelector('[data-slot="phone-safari"]')!;
    expect(chrome.textContent).toContain("…");
  });

  test("chrome elements are not focusable (no button/a/input inside chrome)", () => {
    mount(
      <Phone safari={{ layout: "top" }} statusBar>
        <PhoneScreen />
      </Phone>,
    );
    const interactive = container
      .querySelector('[data-slot="phone-safari"]')
      ?.querySelectorAll("button, a, input, [tabindex]");
    expect(interactive?.length ?? 0).toBe(0);
  });
});
