import type * as React from "react";

import { useContinuousCorners } from "@/lib/continuous-corner";
import { cn } from "@/lib/utils";

export interface ContinuousSurfaceProps extends React.ComponentPropsWithoutRef<"div"> {
  /** Continuous-corner visual radius in CSS pixels. @default 12 */
  radius?: number;
  /** Curve exponent: 2 is circular; values above 2 concentrate curvature toward the corner. @default 3 */
  exponent?: number;
  /** Line segments per corner. @default 24 */
  samples?: number;
}

/**
 * A measured surface with independently derived continuous corners.
 * Put shadows on a parent wrapper with the `surface-shadow` utility (drop-shadow):
 * clip-path clips the element's own box-shadow, and a box-shadow on the wrapper
 * would draw the wrapper's own rounded rectangle instead of the clipped shape.
 */
function ContinuousSurface({
  radius = 12,
  exponent = 3,
  samples = 24,
  className,
  style,
  ...props
}: ContinuousSurfaceProps) {
  const continuous = useContinuousCorners<HTMLDivElement>({ radius, exponent, samples });

  return (
    <div
      {...props}
      ref={continuous.ref}
      data-slot="continuous-surface"
      className={cn(className)}
      style={{ ...continuous.style, ...style }}
    />
  );
}

export { ContinuousSurface };
