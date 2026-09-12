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

  // cos(pi/2) is not exactly zero in floating point; small powers amplify it.
  points[0] = [0, r];
  points[steps] = [r, 0];
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
  const steps = segmentCount("samples", samples, 2);
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

  const points = cornerCurvePoints(r, p, steps);
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

/**
 * Generates a full superellipse |x/a|^n + |y/b|^n = 1 as a closed polyline.
 *
 * 参数化：对每个采样角 t 取 (a·|cos t|^(2/n)·sgn(cos t), b·|sin t|^(2/n)·sgn(sin t))。
 * 采样按**角度均匀**，因此非方形（w≠h）时点的**分布**会随长宽比变化，但点始终落在
 * 同一条超椭圆上；需要点沿弧长均匀时应改用弧长重参数化。方形 surface（图标、头像、
 * logo）不受此影响。
 */
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
  const perQuadrant = steps / 4;

  for (let index = 0; index < steps; index += 1) {
    const angle = (index / steps) * Math.PI * 2;
    /*
     * 只在真实经过四个象限轴（0 / 90 / 180 / 270 度）时把 cos/sin 钉成精确的
     * 0 / ±1，其余角度交给 Math.cos / Math.sin。
     *
     * 此前用 `Number.isInteger(index * 4 / steps)` 判定，该写法依赖浮点精确性：
     * samples=96 时第 24 个采样点的商是 0.9999999999999999 而不是 1，判定失败，
     * 于是本该精确落在 (a, 0) / (0, b) 等端点上的采样点被 Math.cos(π/2)≈6.1e-17
     * 取代，端点坐标在指数放大后出现可测量的偏移。取模判断不受浮点误差影响；
     * segmentCount 保证 steps ≥ 8 且为整数，因此 perQuadrant 整除且非零。
     */
    const onAxis = index % perQuadrant === 0;
    const quadrant = onAxis ? (index / perQuadrant) % 4 : -1;
    const cosine =
      quadrant === 0 ? 1 : quadrant === 1 ? 0 : quadrant === 2 ? -1 : quadrant === 3 ? 0 : Math.cos(angle);
    const sine =
      quadrant === 0 ? 0 : quadrant === 1 ? 1 : quadrant === 2 ? 0 : quadrant === 3 ? -1 : Math.sin(angle);
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
      // clip-path coordinates are local CSS pixels, not transformed viewport bounds.
      const computed = getComputedStyle(element);
      const px = (value: string) => Number.parseFloat(value) || 0;
      const extra = computed.boxSizing === "border-box" ? 0 : 1;
      const width = px(computed.width) + extra * (
        px(computed.paddingLeft) + px(computed.paddingRight) +
        px(computed.borderLeftWidth) + px(computed.borderRightWidth)
      );
      const height = px(computed.height) + extra * (
        px(computed.paddingTop) + px(computed.paddingBottom) +
        px(computed.borderTopWidth) + px(computed.borderBottomWidth)
      );
      const next = width > 0 && height > 0 ? { width, height } : null;
      setSize((previous) => previous?.width === next?.width && previous?.height === next?.height
        ? previous : next);
    };
    measure();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element, { box: "border-box" });
    return () => observer.disconnect();
  }, []);

  const style = React.useMemo<React.CSSProperties>(() => {
    const fallback: React.CSSProperties = { borderRadius: radius };
    if (!size || typeof CSS === "undefined" || !CSS.supports("clip-path", 'path("M 0 0 H 1 V 1 Z")')) {
      return fallback;
    }
    return {
      // A fallback radius would independently round the painted background,
      // hiding the extra corner area supplied by the continuous path.
      borderRadius: 0,
      clipPath: `path("${continuousCornerPath(size.width, size.height, {
        radius,
        exponent,
        samples,
      })}")`,
    };
  }, [exponent, radius, samples, size]);

  return { ref, style };
}
