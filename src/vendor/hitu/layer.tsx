// Adapted from ant-design/HiTu's Chip (MIT). See SOURCE.md and LICENSE.
import type { HituShape } from "./types";
import { interpolateShape } from "./interpolation";

export function HituLayer({ shape, frame, index }: {
  shape: HituShape;
  frame: number;
  index: number;
}) {
  const Source = shape.source;
  const { x, y, rotate, scaleX, scaleY, originX, originY, opacity } = interpolateShape(shape, frame);
  const centerX = Source.width * originX;
  const centerY = Source.height * originY;
  return (
    <g data-hitu-layer={index} transform={`translate(${x - centerX}, ${y - centerY})`} opacity={opacity}>
      <g transform={`matrix(${scaleX}, 0, 0, ${scaleY}, ${centerX - scaleX * centerX}, ${centerY - scaleY * centerY})`}>
        <g transform={`rotate(${rotate}, ${centerX}, ${centerY})`}>
          <Source />
        </g>
      </g>
    </g>
  );
}
