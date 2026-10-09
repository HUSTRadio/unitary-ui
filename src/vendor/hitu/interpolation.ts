// Adapted from ant-design/HiTu (MIT). See SOURCE.md and LICENSE.
import type { HituShape, HituTransform } from "./types";
import { cubicProgress, isNonlinearCubic } from "../../lib/motion-easing";
import { MOTION_EASINGS } from "../../lib/motion-easing-defaults";

const defaults: Required<HituTransform> = {
  x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1,
  originX: 0.5, originY: 0.5, opacity: 1,
};
const keys = Object.keys(defaults) as (keyof HituTransform)[];

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
      const elapsed = (frame - keyframe.frame) / (next.frame - keyframe.frame);
      const curve = keyframe.cubic && isNonlinearCubic(keyframe.cubic)
        ? keyframe.cubic : MOTION_EASINGS["--ease-in-out"];
      const progress = cubicProgress(elapsed, curve);
      const result = { ...start };
      for (const key of keys) result[key] = start[key] * (1 - progress) + end[key] * progress;
      return result;
    }
  }
  return start;
}
