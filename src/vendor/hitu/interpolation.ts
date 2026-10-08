// Adapted from ant-design/HiTu (MIT). See SOURCE.md and LICENSE.
import type { HituFrame, HituShape, HituTransform } from "./types";

const defaults: Required<HituTransform> = {
  x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1,
  originX: 0.5, originY: 0.5, opacity: 1,
};
const keys = Object.keys(defaults) as (keyof HituTransform)[];

/** The upstream ten-step Bezier inversion, retaining non-linear HiTu easing. */
function cubicProgress(progress: number, cubic: NonNullable<HituFrame["cubic"]>) {
  if (progress <= 0 || progress >= 1) return progress;
  const [x1, y1, x2, y2] = cubic;
  const coordinate = (t: number) => {
    const inverse = 1 - t;
    const c1 = 3 * t * inverse ** 2;
    const c2 = 3 * inverse * t ** 2;
    const c3 = t ** 3;
    return [c1 * x1 + c2 * x2 + c3, c1 * y1 + c2 * y2 + c3];
  };
  let start = [0, 0, 0];
  let end = [1, 1, 1];
  for (let index = 0; index < 10; index += 1) {
    const middle = (start[0] + end[0]) / 2;
    const [x, y] = coordinate(middle);
    if (progress < x) end = [middle, x, y];
    else start = [middle, x, y];
  }
  const fraction = (progress - start[1]) / (end[1] - start[1]);
  return start[2] + fraction * (end[2] - start[2]);
}

function fill(base: Required<HituTransform>, value: HituTransform) {
  const result = { ...base };
  for (const key of keys) {
    if (value[key] !== undefined) result[key] = value[key];
  }
  return result;
}

/** Sparse frames inherit prior values, including the shape's initial transform. */
export function interpolateShape(shape: HituShape, frame: number): Required<HituTransform> {
  let start = fill(defaults, shape);
  const frames = shape.frames ?? [];
  for (let index = 0; index < frames.length; index += 1) {
    const keyframe = frames[index];
    const next = frames[index + 1];
    start = fill(start, keyframe);
    if (frame <= keyframe.frame || !next) return start;
    if (frame < next.frame) {
      const end = fill(start, next);
      const linear = (frame - keyframe.frame) / (next.frame - keyframe.frame);
      const progress = keyframe.cubic ? cubicProgress(linear, keyframe.cubic) : linear;
      const result = { ...start };
      for (const key of keys) result[key] = start[key] * (1 - progress) + end[key] * progress;
      return result;
    }
  }
  return start;
}
