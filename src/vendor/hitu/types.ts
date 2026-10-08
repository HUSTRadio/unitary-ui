import type * as React from "react";

/** A React SVG asset with the intrinsic dimensions used by HiTu's layer engine. */
export type HituShapeSource = React.ComponentType<React.SVGProps<SVGSVGElement>> & {
  width: number;
  height: number;
};

export interface HituTransform {
  x?: number;
  y?: number;
  rotate?: number;
  scaleX?: number;
  scaleY?: number;
  /** Fraction of the asset width used as the transform origin. */
  originX?: number;
  /** Fraction of the asset height used as the transform origin. */
  originY?: number;
  opacity?: number;
}

export interface HituFrame extends HituTransform {
  frame: number;
  /** Cubic Bezier easing for the segment beginning at this keyframe. */
  cubic?: [number, number, number, number];
}

export interface HituShape extends HituTransform {
  source: HituShapeSource;
  frames?: readonly HituFrame[];
}
