import { useId } from "react";
import { Avatar } from "@hustradio/unitary-ui";
import { ContinuousSurface } from "@hustradio/unitary-ui";
import { superellipsePath } from "@hustradio/unitary-ui";

const CURVATURE_VARIANTS = [
  { label: "Circular · p = 2", exponent: 2 },
  { label: "Continuous · p = 3", exponent: 3 },
  { label: "Emphasized · p = 5", exponent: 5 },
];

export function AvatarCurvature8D2F4A71Example() {
  const clipId = `avatar-superellipse-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const squareAvatar =
    "rounded-none after:rounded-none after:border-transparent";

  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col items-center gap-3">
        <Avatar size={80} username="evilrabbit" />
        <span className="text-label-13 text-muted-foreground">
          Default · circle
        </span>
      </div>
      {CURVATURE_VARIANTS.map((variant) => (
        <div key={variant.exponent} className="flex flex-col items-center gap-3">
          <ContinuousSurface
            radius={16}
            exponent={variant.exponent}
            className="size-20 overflow-hidden"
          >
            <Avatar size={80} username="evilrabbit" className={squareAvatar} />
          </ContinuousSurface>
          <span className="text-label-13 text-muted-foreground">
            {variant.label}
          </span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-3">
        <div
          className="size-20 overflow-hidden"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <Avatar size={80} username="evilrabbit" className={squareAvatar} />
        </div>
        <span className="text-label-13 text-muted-foreground">
          Superellipse · n = 5
        </span>
        <svg aria-hidden width="0" height="0">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path transform="scale(0.0125)" d={superellipsePath(80, 80, { exponent: 5 })} />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}
