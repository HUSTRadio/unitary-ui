export type CubicBezier = readonly [number, number, number, number];

export function isNonlinearCubic(points: readonly number[]): points is CubicBezier {
  return points.length === 4 && Array.from(points).every(Number.isFinite)
    && points[0] >= 0 && points[0] <= 1 && points[2] >= 0 && points[2] <= 1
    && !(points[0] === points[1] && points[2] === points[3]);
}

// CSS keyword coordinates describe the CSS specification, not project defaults.
const cssKeywords: Record<string, CubicBezier> = {
  ease: [0.25, 0.1, 0.25, 1], "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1], "ease-in-out": [0.42, 0, 0.58, 1],
};

/** Parse the cascaded timing function; constant-speed motion is unsupported here. */
export function parseEasing(value: string): CubicBezier | null {
  const trimmed = value.trim().toLowerCase();
  if (Object.hasOwn(cssKeywords, trimmed)) return cssKeywords[trimmed];
  const match = trimmed.match(/^cubic-bezier\(\s*([^)]*)\)$/);
  const parts = match?.[1].split(",").map((part) => part.trim());
  if (!parts?.every(part => /^[+-]?(?:\d*\.\d+|\d+)(?:e[+-]?\d+)?$/i.test(part))) return null;
  const points = parts.map(Number);
  return isNonlinearCubic(points) ? points : null;
}

/** Solve the Bezier time coordinate before evaluating displacement. Endpoints stay exact. */
export function cubicProgress(progress: number, cubic: readonly number[]): number {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  const coordinate = (time: number, first: number, second: number) =>
    3 * (1 - time) ** 2 * time * first + 3 * (1 - time) * time ** 2 * second + time ** 3;
  let low = 0;
  let high = 1;
  for (let iteration = 0; iteration < 20; iteration += 1) {
    const middle = (low + high) / 2;
    const time = coordinate(middle, cubic[0], cubic[2]);
    if (time === progress) return coordinate(middle, cubic[1], cubic[3]);
    if (time < progress) low = middle;
    else high = middle;
  }
  return coordinate((low + high) / 2, cubic[1], cubic[3]);
}

export function milliseconds(value: string): number {
  const match = value.trim().match(/^(\d*\.?\d+)(ms|s)$/);
  const result = match ? Number(match[1]) * (match[2] === "s" ? 1000 : 1) : 0;
  return Number.isFinite(result) && result > 0 ? result : 0;
}
