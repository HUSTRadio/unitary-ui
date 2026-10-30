// @vitest-environment jsdom
import * as React from "react";
import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { LogView, type LogEntry, type LogLevel } from "@/components/ui/log-view";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root | undefined;

const ENTRIES: LogEntry[] = [
  { id: "1", level: "debug", time: "10:00:00", message: "boot" },
  { id: "2", level: "info", time: "10:00:01", message: "connected" },
  { id: "3", level: "warn", time: "10:00:02", message: "retrying" },
  { id: "4", level: "error", time: "10:00:03", message: "gave up" },
];

async function mount(node: React.ReactElement) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(node);
    await Promise.resolve();
  });
}

const rows = () => [...container.querySelectorAll('[data-slot="log-view-row"]')];
const rowLevels = () => rows().map((row) => row.getAttribute("data-level"));
const levelButton = (level: string) =>
  container.querySelector(`[data-slot="log-view-level"][data-level="${level}"]`) as HTMLElement;
const buttonByText = (text: string) =>
  [...container.querySelectorAll("button")].find((button) => button.textContent === text) as
    | HTMLElement
    | undefined;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(async () => {
  await act(async () => root?.unmount());
  root = undefined;
  container?.remove();
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("LogView", () => {
  test("renders an empty state without rows", async () => {
    await mount(createElement(LogView, { entries: [], emptyLabel: "Nothing yet" }));
    expect(container.textContent).toContain("Nothing yet");
    expect(rows()).toHaveLength(0);
  });

  test("keeps the order of the entries it receives", async () => {
    await mount(createElement(LogView, { entries: ENTRIES }));
    expect(rowLevels()).toEqual(["debug", "info", "warn", "error"]);
    expect(container.querySelectorAll('[data-slot="log-view-time"]')[1].textContent).toBe("10:00:01");
  });

  test("filters by minimum severity and reports the selection", async () => {
    const onLevelChange = vi.fn();
    await mount(createElement(LogView, { entries: ENTRIES, onLevelChange }));

    await act(async () => levelButton("warn").click());
    expect(rowLevels()).toEqual(["warn", "error"]);
    expect(onLevelChange).toHaveBeenCalledWith("warn");

    await act(async () => levelButton("all").click());
    expect(rowLevels()).toEqual(["debug", "info", "warn", "error"]);
  });

  test("honours a controlled level without mutating internal state", async () => {
    await mount(createElement(LogView, { entries: ENTRIES, level: "error" }));
    expect(rowLevels()).toEqual(["error"]);

    await act(async () => levelButton("all").click());
    expect(rowLevels()).toEqual(["error"]);
    expect(container.querySelector('[data-slot="log-view"]')?.getAttribute("data-level")).toBe("error");
  });

  test("copies the filtered entries as plain text", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    await mount(createElement(LogView, { entries: ENTRIES, level: "warn", clipboard: { writeText } }));

    await act(async () => buttonByText("Copy")?.click());
    expect(writeText).toHaveBeenCalledWith("10:00:02 WARN retrying\n10:00:03 ERROR gave up");
    expect(buttonByText("Copied")).toBeDefined();

    await act(async () => vi.advanceTimersByTime(1200));
    expect(buttonByText("Copy")).toBeDefined();
  });

  test("swallows clipboard rejections", async () => {
    const writeText = vi.fn(() => Promise.reject(new Error("denied")));
    await mount(createElement(LogView, { entries: ENTRIES, clipboard: { writeText } }));

    await act(async () => buttonByText("Copy")?.click());
    await act(async () => Promise.resolve());
    expect(buttonByText("Copy")).toBeDefined();
  });

  test("hands the exported text to the caller", async () => {
    const onExport = vi.fn();
    await mount(createElement(LogView, { entries: ENTRIES, level: "error", onExport }));

    await act(async () => buttonByText("Export")?.click());
    expect(onExport).toHaveBeenCalledTimes(1);
    const [text, exported] = onExport.mock.calls[0];
    expect(text).toBe("10:00:03 ERROR gave up");
    expect(exported).toHaveLength(1);
  });

  test("keeps long messages intact and wrapping", async () => {
    const message = `${"stack line ".repeat(30)}end`;
    await mount(createElement(LogView, { entries: [{ id: "x", level: "error" as LogLevel, time: "t", message }] }));

    const cell = container.querySelector('[data-slot="log-view-message"]') as HTMLElement;
    expect(cell.textContent).toBe(message);
    expect(cell.className).toContain("whitespace-pre-wrap");
    expect(cell.className).toContain("break-words");
    expect(cell.className).not.toContain("truncate");
  });

  test("pauses following after scrolling up and resumes on demand", async () => {
    await mount(createElement(LogView, { entries: ENTRIES }));
    const scroller = container.querySelector('[data-slot="log-view-scroller"]') as HTMLElement;

    Object.defineProperty(scroller, "scrollHeight", { value: 1000, configurable: true });
    Object.defineProperty(scroller, "clientHeight", { value: 200, configurable: true });
    scroller.scrollTop = 1000;

    expect(container.querySelector('[data-slot="log-view"]')?.getAttribute("data-following")).toBe("true");

    await act(async () => {
      scroller.scrollTop = 100;
      scroller.dispatchEvent(new Event("scroll", { bubbles: false }));
    });
    expect(container.querySelector('[data-slot="log-view"]')?.getAttribute("data-following")).toBe("false");
    const jump = buttonByText("Jump to latest");
    expect(jump).toBeDefined();

    await act(async () => jump?.click());
    expect(container.querySelector('[data-slot="log-view"]')?.getAttribute("data-following")).toBe("true");
    expect(scroller.scrollTop).toBe(1000);
    expect(buttonByText("Jump to latest")).toBeUndefined();
  });

  test("stick to the bottom while following", async () => {
    await mount(createElement(LogView, { entries: ENTRIES }));
    const scroller = container.querySelector('[data-slot="log-view-scroller"]') as HTMLElement;
    Object.defineProperty(scroller, "scrollHeight", { value: 500, configurable: true });

    await act(async () => {
      root?.render(createElement(LogView, { entries: [...ENTRIES, { id: "5", level: "info" as LogLevel, time: "10:00:04", message: "more" }] }));
      await Promise.resolve();
    });
    expect(scroller.scrollTop).toBe(500);
    expect(rows()).toHaveLength(5);
  });

  test("merges caller className and forwards div attributes", async () => {
    await mount(createElement(LogView, { entries: [], className: "mt-4", id: "logs" }));
    const view = container.querySelector('[data-slot="log-view"]') as HTMLElement;
    expect(view.className).toContain("mt-4");
    expect(view.getAttribute("id")).toBe("logs");
  });
});
