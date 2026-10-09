// @vitest-environment jsdom
import * as React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vitest";

import { AreaChart } from "../src/components/ui/charts/area-chart";
import { BarChart } from "../src/components/ui/charts/bar-chart";
import { BarList } from "../src/components/ui/charts/bar-list";
import { CategoryBar } from "../src/components/ui/charts/category-bar";
import { ComboChart } from "../src/components/ui/charts/combo-chart";
import { DonutChart } from "../src/components/ui/charts/donut-chart";
import { LineChart } from "../src/components/ui/charts/line-chart";
import { ProgressCircle } from "../src/components/ui/charts/progress-circle";
import {
  SparkAreaChart,
  SparkBarChart,
  SparkLineChart,
} from "../src/components/ui/charts/spark-chart";
import { Tracker } from "../src/components/ui/charts/tracker";

// recharts ResponsiveContainer needs ResizeObserver, which jsdom does not provide.
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let reactRoot: Root;

function render(element: React.ReactElement) {
  container = document.createElement("div");
  document.body.appendChild(container);
  reactRoot = createRoot(container);
  act(() => reactRoot.render(element));
}

afterEach(() => {
  if (reactRoot) act(() => reactRoot.unmount());
  container?.remove();
});

const chartData = [
  { month: "Jan", sales: 42, profit: 12 },
  { month: "Feb", sales: 55, profit: 18 },
  { month: "Mar", sales: 47, profit: 15 },
];

describe("recharts-based charts render their slot container", () => {
  test("AreaChart exposes data-slot and fixed-height layout", () => {
    render(<AreaChart data={chartData} index="month" categories={["sales"]} />);
    const el = container.querySelector('[data-slot="area-chart"]')!;
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.className).toContain("h-80");
    expect(el.className).toContain("w-full");
  });

  test("BarChart exposes data-slot and fixed-height layout", () => {
    render(<BarChart data={chartData} index="month" categories={["sales"]} />);
    const el = container.querySelector('[data-slot="bar-chart"]')!;
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.className).toContain("h-80");
  });

  test("LineChart exposes data-slot and fixed-height layout", () => {
    render(<LineChart data={chartData} index="month" categories={["sales"]} />);
    const el = container.querySelector('[data-slot="line-chart"]')!;
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.className).toContain("h-80");
  });

  test("ComboChart renders with bar and line series", () => {
    render(
      <ComboChart
        data={chartData}
        index="month"
        barSeries={{ categories: ["sales"] }}
        lineSeries={{ categories: ["profit"] }}
      />,
    );
    const el = container.querySelector('[data-slot="combo-chart"]')!;
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.className).toContain("h-80");
  });

  test("DonutChart exposes data-slot with category/value mapping", () => {
    render(
      <DonutChart data={[{ name: "A", value: 30 }]} category="name" value="value" />,
    );
    const el = container.querySelector('[data-slot="donut-chart"]')!;
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.className).toContain("h-40");
  });

  test("spark charts render compact containers", () => {
    render(<SparkAreaChart data={chartData} index="month" categories={["sales"]} />);
    expect(container.querySelector('[data-slot="spark-area-chart"]')).toBeInstanceOf(
      HTMLElement,
    );
    render(<SparkLineChart data={chartData} index="month" categories={["sales"]} />);
    expect(
      container.querySelector('[data-slot="spark-line-chart"]'),
    ).toBeInstanceOf(HTMLElement);
    render(<SparkBarChart data={chartData} index="month" categories={["sales"]} />);
    expect(container.querySelector('[data-slot="spark-bar-chart"]')).toBeInstanceOf(
      HTMLElement,
    );
  });
});

describe("non-recharts micro visualizations", () => {
  test("BarList renders entries with names and formatted values", () => {
    render(
      <BarList
        data={[
          { name: "Twitter", value: 456 },
          { name: "GitHub", value: 352 },
          { name: "Figma", value: 148 },
        ]}
      />,
    );
    expect(container.textContent).toContain("Twitter");
    expect(container.textContent).toContain("456");
    expect(container.textContent).toContain("GitHub");
    expect(container.textContent).toContain("Figma");
  });

  test("Tracker renders one block per data entry", () => {
    render(
      <Tracker
        data={[
          { color: "emerald", tooltip: "Success" },
          { color: "amber", tooltip: "Warning" },
          { color: "rose", tooltip: "Failure" },
        ]}
      />,
    );
    expect(container.querySelector('[data-slot="tracker"]')).toBeInstanceOf(
      HTMLElement,
    );
    expect(
      container.querySelectorAll('[data-slot="tracker"] > div'),
    ).toHaveLength(3);
  });

  test("ProgressCircle renders an svg and value label", () => {
    render(
      <ProgressCircle value={75} max={100} radius={40} strokeWidth={6}>
        <span>75%</span>
      </ProgressCircle>,
    );
    expect(container.querySelector("svg")).toBeInstanceOf(SVGSVGElement);
    expect(container.textContent).toContain("75%");
  });

  test("ProgressCircle settles color and value changes without a linear curve", () => {
    render(<ProgressCircle value={25} radius={40} strokeWidth={6} />);
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(2);
    for (const circle of circles) {
      expect(circle.getAttribute("class")).toContain("ease-snap");
      expect(circle.getAttribute("class")).not.toContain("ease-linear");
    }
    const initialOffset = Number(circles[1].getAttribute("stroke-dashoffset"));

    act(() => reactRoot.render(<ProgressCircle value={75} radius={40} strokeWidth={6} />));
    expect(Number(circles[1].getAttribute("stroke-dashoffset"))).toBeCloseTo(initialOffset / 3);
    expect(circles[1].getAttribute("class")).toContain("transition-all");

    act(() => reactRoot.render(<ProgressCircle value={75} radius={40} strokeWidth={6} showAnimation={false} />));
    expect(circles[1].getAttribute("class")).not.toContain("transition-all");
    expect(circles[1].getAttribute("class")).toContain("ease-snap");
  });

  test("CategoryBar renders segments with cumulative value labels", () => {
    render(<CategoryBar values={[30, 30, 40]} />);
    expect(container.textContent).toContain("30");
    expect(container.textContent).toContain("60");
    expect(container.textContent).toContain("100");
  });
});
