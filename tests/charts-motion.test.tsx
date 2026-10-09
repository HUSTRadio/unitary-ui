// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AreaChart } from "../src/components/ui/charts/area-chart";
import { BarChart } from "../src/components/ui/charts/bar-chart";
import { LineChart } from "../src/components/ui/charts/line-chart";
import { ComboChart } from "../src/components/ui/charts/combo-chart";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Leave the library's real legend and hooks intact; avoid Recharts SVG measurement in jsdom.
vi.mock("recharts", () => {
  const Box = ({ children }: { children?: React.ReactNode }) => <div>{React.Children.map(children, child =>
    React.isValidElement(child) && child.type === "defs" ? <svg>{child}</svg> : child)}</div>;
  const Empty = () => null;
  return {
    AreaChart: Box, BarChart: Box, LineChart: Box, ComposedChart: Box,
    ResponsiveContainer: Box, XAxis: Box, YAxis: Box,
    Area: Empty, Bar: Empty, Line: Empty, Dot: Empty, Cell: Empty,
    Label: Empty, CartesianGrid: Empty,
    Tooltip: ({ wrapperStyle, isAnimationActive }: { wrapperStyle: React.CSSProperties; isAnimationActive: boolean }) => (
      <div data-test-tooltip data-animation-active={String(isAnimationActive)} style={wrapperStyle} />
    ),
    Legend: ({ content }: { content: (props: { payload: { value: string; type: string }[] }) => React.ReactNode }) => (
      <div>{content({ payload: [{ value: "sales", type: "rect" }, { value: "profit", type: "line" }] })}</div>
    ),
  };
});

let container: HTMLDivElement;
let root: Root;
let reduced: boolean;
let mediaListeners: Set<() => void>;
let frames: Map<number, FrameRequestCallback>;
let now: number;
let nextFrame: number;

const chartCases = [
  ["Area", () => <AreaChart data={[]} index="month" categories={["sales", "profit"]} enableLegendSlider />],
  ["Bar", () => <BarChart data={[]} index="month" categories={["sales", "profit"]} enableLegendSlider />],
  ["Line", () => <LineChart data={[]} index="month" categories={["sales", "profit"]} enableLegendSlider />],
  ["Combo", () => <ComboChart data={[]} index="month" barSeries={{ categories: ["sales"] }} lineSeries={{ categories: ["profit"] }} enableLegendSlider />],
] as const;

function frame(elapsed = 0) {
  now += elapsed;
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach((callback) => callback(now)));
}

function renderChart(element: React.ReactElement) {
  act(() => root.render(element));
  return container.querySelector<HTMLElement>("ol > div[tabindex]")!;
}

beforeEach(() => {
  reduced = false;
  mediaListeners = new Set();
  frames = new Map();
  now = 0;
  nextFrame = 0;
  vi.stubGlobal("matchMedia", vi.fn(() => ({
    get matches() { return reduced; },
    addEventListener: (_event: string, listener: () => void) => { mediaListeners.add(listener); },
    removeEventListener: (_event: string, listener: () => void) => { mediaListeners.delete(listener); },
  })));
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => { frames.delete(id); });
  vi.spyOn(window.performance, "now").mockImplementation(() => now);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) { return this.tabIndex === 0 ? 100 : 0; });
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (this: HTMLElement) { return this.tabIndex === 0 ? 300 : 0; });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  expect(frames.size).toBe(0);
  expect(mediaListeners.size).toBe(0);
  container.remove();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe.each(chartCases)("%s chart motion", (_name, fixture) => {
  it("delegates Tooltip movement to scoped CSS tokens and dynamically removes that transition", () => {
    renderChart(fixture());
    const tooltip = container.querySelector<HTMLElement>("[data-test-tooltip]")!;
    expect(tooltip.dataset.animationActive).toBe("false");
    expect(tooltip.style.transition).toBe("transform var(--uni-motion-feedback) var(--ease-snap)");
    act(() => {
      reduced = true;
      [...mediaListeners].forEach((listener) => listener());
    });
    expect(tooltip.style.transition).toBe("none");
    act(() => {
      reduced = false;
      [...mediaListeners].forEach((listener) => listener());
    });
    expect(tooltip.style.transition).toBe("transform var(--uni-motion-feedback) var(--ease-snap)");
  });

  it("updates legend buttons from actual scrolling and completes without a fixed waiting timer", () => {
    const scroll = renderChart(fixture());
    scroll.style.setProperty("--uni-motion-state", "300ms");
    scroll.style.setProperty("--ease-in-out", "cubic-bezier(0.42, 0, 0.58, 1)");
    const buttons = container.querySelectorAll<HTMLButtonElement>("ol button");
    expect(buttons[0].disabled).toBe(true);
    expect(buttons[1].disabled).toBe(false);
    scroll.scrollLeft = 200;
    act(() => scroll.dispatchEvent(new Event("scroll")));
    expect(buttons[0].disabled).toBe(false);
    expect(buttons[1].disabled).toBe(true);
    act(() => buttons[0].click());
    frame();
    expect(scroll.scrollLeft).toBe(200);
    frame(150);
    expect(scroll.scrollLeft).toBeCloseTo(150, 5);
    frame(150);
    expect(scroll.scrollLeft).toBe(100);
    expect(buttons[1].disabled).toBe(false);
    expect(frames.size).toBe(0);
  });

  it("cancels an active legend scroll on unmount", () => {
    const scroll = renderChart(fixture());
    scroll.style.setProperty("--uni-motion-state", "300ms");
    scroll.style.setProperty("--ease-in-out", "cubic-bezier(0.42, 0, 0.58, 1)");
    const buttons = container.querySelectorAll<HTMLButtonElement>("ol button");
    act(() => buttons[1].click());
    frame();
    frame(75);
    const stoppedAt = scroll.scrollLeft;
    act(() => root.unmount());
    frame(600);
    expect(scroll.scrollLeft).toBe(stoppedAt);
    expect(frames.size).toBe(0);
  });
});
