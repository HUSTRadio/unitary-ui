import * as React from "react";

export const CIRCULAR_CORNER_EXPONENT = 2;
export const CONTINUOUS_CORNER_EXPONENT = 3;

export interface ContinuousCornerOptions {
  /** Visual radius in CSS pixels. Clamped to half the shorter side. */
  radius: number;
  /** Curve exponent: 2 is circular; values above 2 concentrate curvature toward the corner. */
  exponent?: number;
  /** Number of line segments per corner for non-circular curves. */
  samples?: number;
}

export interface SuperellipseOptions {
  /** Superellipse exponent. Must be at least 2. */
  exponent?: number;
  /** Number of segments around the full perimeter. */
  samples?: number;
}

function finite(name: string, value: number): number {
  if (!Number.isFinite(value)) throw new RangeError(`${name} must be finite`);
  return value;
}

function positive(name: string, value: number): number {
  finite(name, value);
  if (value <= 0) throw new RangeError(`${name} must be greater than 0`);
  return value;
}

function nonNegative(name: string, value: number): number {
  finite(name, value);
  if (value < 0) throw new RangeError(`${name} must not be negative`);
  return value;
}

function segmentCount(name: string, value: number, minimum: number): number {
  finite(name, value);
  if (!Number.isInteger(value) || value < minimum) {
    throw new RangeError(`${name} must be an integer of at least ${minimum}`);
  }
  return value;
}

function exponentAboveOne(value: number): number {
  finite("exponent", value);
  if (value <= 1) throw new RangeError("exponent must be greater than 1");
  return value;
}

function formatNumber(value: number): string {
  const normalized = Math.abs(value) < 1e-10 ? 0 : value;
  return Number(normalized.toFixed(3)).toString();
}

/**
 * Samples one local corner from the y-axis point (0, radius) to the
 * x-axis point (radius, 0).
 *
 * The independent Unitary construction is
 * (1 - x/r)^p + (1 - y/r)^p = 1, p > 1.
 * p=2 is exactly circular; the default p=3 is a Unitary team value.
 */
export function cornerCurvePoints(
  radius: number,
  exponent: number,
  samples: number,
): Array<[number, number]> {
  const r = nonNegative("radius", radius);
  const p = exponentAboveOne(exponent);
  const steps = segmentCount("samples", samples, 2);
  const points: Array<[number, number]> = [];

  for (let index = 0; index <= steps; index += 1) {
    const angle = (index / steps) * (Math.PI / 2);
    points.push([
      r * (1 - Math.cos(angle) ** (2 / p)),
      r * (1 - Math.sin(angle) ** (2 / p)),
    ]);
  }

  return points;
}

/** Generates a rounded-rectangle path with straight sides and continuous corners. */
export function continuousCornerPath(
  width: number,
  height: number,
  {
    radius,
    exponent = CONTINUOUS_CORNER_EXPONENT,
    samples = 24,
  }: ContinuousCornerOptions,
): string {
  const w = positive("width", width);
  const h = positive("height", height);
  const requestedRadius = nonNegative("radius", radius);
  const p = exponentAboveOne(exponent);
  const r = Math.min(requestedRadius, w / 2, h / 2);

  if (r === 0) {
    return `M 0 0 H ${formatNumber(w)} V ${formatNumber(h)} H 0 Z`;
  }

  if (p === CIRCULAR_CORNER_EXPONENT) {
    const fr = formatNumber(r);
    return [
      `M ${fr} 0`,
      `H ${formatNumber(w - r)}`,
      `A ${fr} ${fr} 0 0 1 ${formatNumber(w)} ${fr}`,
      `V ${formatNumber(h - r)}`,
      `A ${fr} ${fr} 0 0 1 ${formatNumber(w - r)} ${formatNumber(h)}`,
      `H ${fr}`,
      `A ${fr} ${fr} 0 0 1 0 ${formatNumber(h - r)}`,
      `V ${fr}`,
      `A ${fr} ${fr} 0 0 1 ${fr} 0`,
      "Z",
    ].join(" ");
  }

  const points = cornerCurvePoints(r, p, segmentCount("samples", samples, 2));
  const topLeft = points;
  const topRight = points.map(([x, y]) => [w - x, y] as [number, number]).reverse();
  const bottomRight = points.map(([x, y]) => [w - x, h - y] as [number, number]);
  const bottomLeft = points.map(([x, y]) => [x, h - y] as [number, number]).reverse();
  const lines = (curve: Array<[number, number]>) =>
    curve
      .slice(1)
      .map(([x, y]) => `L ${formatNumber(x)} ${formatNumber(y)}`)
      .join(" ");

  return [
    `M ${formatNumber(r)} 0`,
    `L ${formatNumber(w - r)} 0`,
    lines(topRight),
    `L ${formatNumber(w)} ${formatNumber(h - r)}`,
    lines(bottomRight),
    `L ${formatNumber(r)} ${formatNumber(h)}`,
    lines(bottomLeft),
    `L 0 ${formatNumber(r)}`,
    lines(topLeft),
    "Z",
  ].join(" ");
}

/** Generates a full superellipse path for near-square icon, avatar, or logo surfaces. */
export function superellipsePath(
  width: number,
  height: number,
  { exponent = 5, samples = 96 }: SuperellipseOptions = {},
): string {
  const w = positive("width", width);
  const h = positive("height", height);
  const n = finite("exponent", exponent);
  if (n < 2) throw new RangeError("exponent must be at least 2");
  const steps = segmentCount("samples", samples, 8);
  const halfWidth = w / 2;
  const halfHeight = h / 2;
  const points: Array<[number, number]> = [];

  for (let index = 0; index < steps; index += 1) {
    const angle = (index / steps) * Math.PI * 2;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    points.push([
      halfWidth + halfWidth * Math.sign(cosine) * Math.abs(cosine) ** (2 / n),
      halfHeight + halfHeight * Math.sign(sine) * Math.abs(sine) ** (2 / n),
    ]);
  }

  const [first, ...rest] = points;
  return [
    `M ${formatNumber(first![0])} ${formatNumber(first![1])}`,
    ...rest.map(([x, y]) => `L ${formatNumber(x)} ${formatNumber(y)}`),
    "Z",
  ].join(" ");
}

/** Measures an element and returns an adaptive clip path with a circular fallback. */
export function useContinuousCorners<T extends HTMLElement>(options: ContinuousCornerOptions): {
  ref: React.RefObject<T | null>;
  style: React.CSSProperties;
} {
  const ref = React.useRef<T | null>(null);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
  const { radius, exponent, samples } = options;

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const bounds = element.getBoundingClientRect();
      if (bounds.width > 0 && bounds.height > 0) {
        setSize({ width: bounds.width, height: bounds.height });
      }
    };
    measure();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = React.useMemo<React.CSSProperties>(() => {
    const fallback: React.CSSProperties = { borderRadius: radius };
    if (!size) return fallback;
    return {
      ...fallback,
      clipPath: `path("${continuousCornerPath(size.width, size.height, {
        radius,
        exponent,
        samples,
      })}")`,
    };
  }, [exponent, radius, samples, size]);

  return { ref, style };
}
