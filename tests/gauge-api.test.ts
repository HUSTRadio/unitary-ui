import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Gauge } from "../src/components/ui/gauge";

// Official geometry (full-audit-20260809 G06):
// sizes 20/32/64/128, stroke-width px 3/3.2/6.4/12.8
const GAUGE_SIZE = { tiny: 20, small: 32, medium: 64, large: 128 } as const;
const GAUGE_STROKE = { tiny: 3, small: 3.2, medium: 6.4, large: 12.8 } as const;

function circumference(size: keyof typeof GAUGE_SIZE): number {
  return 2 * Math.PI * ((GAUGE_SIZE[size] - GAUGE_STROKE[size]) / 2);
}

const gauge = (props: React.ComponentProps<typeof Gauge>) =>
  renderToStaticMarkup(React.createElement(Gauge, props));

/** Extract ordered <circle> attribute maps from SSR markup */
function extractCircles(markup: string): Array<Record<string, string>> {
  const circles: Array<Record<string, string>> = [];
  const circleRe = /<circle\b([^>]*)\/?>/g;
  for (const match of markup.matchAll(circleRe)) {
    const attrs: Record<string, string> = {};
    for (const attr of match[1].matchAll(/([\w-]+)="([^"]*)"/g)) {
      attrs[attr[1]] = attr[2];
    }
    circles.push(attrs);
  }
  return circles;
}

/** First stroke-dasharray value (arc length in px) */
function dashFirst(attrs: Record<string, string>): number {
  const dash = attrs["stroke-dasharray"];
  expect(dash).toBeDefined();
  return Number(dash!.split(/\s+/)[0]);
}

function dashOffset(attrs: Record<string, string>): number {
  return Number(attrs["stroke-dashoffset"] ?? "0");
}

describe("Gauge official API contract (G06)", () => {
  it("G06-GAUGE-01: default (no colors prop) applies the value threshold scale", () => {
    const cases: Array<[number, string]> = [
      [0, "#da2f35"],
      [14, "#da2f35"],
      [19, "#da2f35"],
      [20, "#ffb224"],
      [34, "#ffb224"],
      [50, "#ffb224"],
      [59, "#ffb224"],
      [60, "#45a557"],
      [68, "#45a557"],
      [100, "#45a557"],
    ];
    for (const [value, expected] of cases) {
      const circles = extractCircles(gauge({ size: "small", value }));
      // circle[0] = track, circle[1] = primary arc
      expect(circles).toHaveLength(2);
      expect(circles[1].stroke).toBe(expected);
    }
  });

  it("G06-GAUGE-01: custom colors threshold map still resolves <= value", () => {
    const colors = { "0": "#111111", "50": "#222222", "80": "#333333" };
    expect(extractCircles(gauge({ size: "small", value: 10, colors }))[1].stroke).toBe("#111111");
    expect(extractCircles(gauge({ size: "small", value: 50, colors }))[1].stroke).toBe("#222222");
    expect(extractCircles(gauge({ size: "small", value: 90, colors }))[1].stroke).toBe("#333333");
  });

  it("G06-GAUGE-01: colors {primary, secondary} pair is honored", () => {
    const markup = gauge({
      size: "medium",
      value: 50,
      colors: { primary: "#006efe", secondary: "#a8c9f9" },
    });
    const circles = extractCircles(markup);
    expect(circles[0].stroke).toBe("#a8c9f9"); // track = secondary
    expect(circles[1].stroke).toBe("#006efe"); // arc = primary
  });

  it("G06-GAUGE-02: track is a PARTIAL arc with dasharray (50% primary + 40% track + ~10% gap @50)", () => {
    const C = circumference("medium");
    const circles = extractCircles(gauge({ size: "medium", value: 50 }));
    expect(circles).toHaveLength(2);

    // primary arc = 50% of C, starting at top (offset 0)
    expect(dashFirst(circles[1]) / C).toBeCloseTo(0.5, 10);
    expect(dashOffset(circles[1]) / C).toBeCloseTo(0, 10);

    // track = 40% of C, starts 5% after primary end -> ends at 95%, leaving ~10% gap
    expect(dashFirst(circles[0]) / C).toBeCloseTo(0.4, 10);
    expect(dashOffset(circles[0]) / C).toBeCloseTo(-0.55, 10);

    // arcs + gap = 100%
    expect(dashFirst(circles[0]) / C + dashFirst(circles[1]) / C).toBeCloseTo(0.9, 10);
  });

  it("G06-GAUGE-02: track dash scales with value (0.9 - p)", () => {
    const C = circumference("medium");
    const at = (value: number) => {
      const circles = extractCircles(gauge({ size: "medium", value }));
      return dashFirst(circles[0]) / C;
    };
    expect(at(0)).toBeCloseTo(0.9, 10);
    expect(at(25)).toBeCloseTo(0.65, 10);
    expect(at(90)).toBeCloseTo(0, 10);
    expect(at(100)).toBeCloseTo(0, 10); // full value -> no track
  });

  it("G06-GAUGE-03: arcPriority=equal @50 -> both arcs 45% each with ~10% gap", () => {
    const C = circumference("medium");
    const markup = gauge({
      arcPriority: "equal",
      colors: { primary: "#006efe", secondary: "#e5484d" },
      showValue: true,
      size: "medium",
      value: 50,
    });
    const circles = extractCircles(markup);
    expect(circles).toHaveLength(2); // no full track ring behind equal arcs

    expect(circles[0].stroke).toBe("#e5484d"); // secondary
    expect(circles[1].stroke).toBe("#006efe"); // primary

    // both arcs 45% (official ratio 127.235px / 282.743px)
    expect(dashFirst(circles[0]) / C).toBeCloseTo(0.45, 10);
    expect(dashFirst(circles[1]) / C).toBeCloseTo(0.45, 10);
    expect(dashFirst(circles[0]) / C + dashFirst(circles[1]) / C).toBeCloseTo(0.9, 10);

    // secondary starts right after primary ends (2.5% gap each side)
    expect(dashOffset(circles[0]) / C).toBeCloseTo(-0.525, 10);
    expect(dashOffset(circles[1]) / C).toBeCloseTo(-0.025, 10);
  });

  it("G06-GAUGE-05: stroke-width px = 3 / 3.2 / 6.4 / 12.8 (no sub-pixel truncation)", () => {
    const sizes = ["tiny", "small", "medium", "large"] as const;
    for (const size of sizes) {
      const markup = gauge({ size, value: 50 });
      expect(markup).toContain(`width="${GAUGE_SIZE[size]}"`);
      expect(markup).toContain(`height="${GAUGE_SIZE[size]}"`);
      expect(markup).toContain(`viewBox="0 0 ${GAUGE_SIZE[size]} ${GAUGE_SIZE[size]}"`);
      const circles = extractCircles(markup);
      for (const circle of circles) {
        expect(circle["stroke-width"]).toBe(String(GAUGE_STROKE[size]));
      }
    }
  });

  it("G06-GAUGE-06: tiny (20px) renders NO center value even with showValue", () => {
    const tiny = gauge({ size: "tiny", showValue: true, value: 80 });
    expect(tiny).not.toContain("<span");

    const small = gauge({ size: "small", showValue: true, value: 80 });
    expect(small).toContain(">80<");
    expect(small).not.toContain(">80%<"); // number only, no unit

    // rounds the displayed value
    expect(gauge({ size: "small", showValue: true, value: 80.6 })).toContain(">81<");
  });

  it("ARIA: role=progressbar with min/max/now (clamped); omitted when indeterminate", () => {
    const markup = gauge({ size: "small", value: 150 });
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-valuemin="0"');
    expect(markup).toContain('aria-valuemax="100"');
    expect(markup).toContain('aria-valuenow="100"'); // clamped

    expect(gauge({ size: "small", value: -5 })).toContain('aria-valuenow="0"');

    const indet = gauge({ size: "small", indeterminate: true, value: 25 });
    expect(indet).not.toContain("aria-valuenow");
  });
});
