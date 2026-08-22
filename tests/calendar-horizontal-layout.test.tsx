// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vitest";

import { Calendar } from "@/components/ui/calendar";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

class ResizeObserverStub implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub;
HTMLElement.prototype.scrollIntoView = vi.fn();

let container: HTMLDivElement;
let root: Root;

afterEach(() => {
  if (root) act(() => root.unmount());
  container?.remove();
  document.body.innerHTML = "";
});

function mountCalendar() {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() => root.render(<Calendar horizontalLayout label="Select Date Range" />));

  const trigger = container.querySelector<HTMLButtonElement>(
    '[data-testid="calendar/trigger/button"]',
  )!;
  act(() => trigger.click());
}

describe("Calendar horizontal layout", () => {
  test("anchors Apply and timezone to the bottom of the horizontal controls column", () => {
    mountCalendar();

    const controls = document.querySelector('[data-slot="calendar-range-controls"]');
    const actions = document.querySelector('[data-slot="calendar-range-actions"]');
    const apply = [...document.querySelectorAll<HTMLButtonElement>("button")].find((button) =>
      button.textContent?.includes("Apply"),
    );

    expect(controls).not.toBeNull();
    expect(controls?.className).toContain("self-stretch");
    expect(actions?.className).toContain("mt-auto");
    expect(apply).toBeDefined();
    expect(controls?.contains(apply!)).toBe(true);

    const start = controls?.querySelector('input[aria-label="Start date"]');
    const end = controls?.querySelector('input[aria-label="End date"]');
    expect(start).not.toBeNull();
    expect(end).not.toBeNull();
    expect(start!.compareDocumentPosition(apply!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(end!.compareDocumentPosition(apply!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});
