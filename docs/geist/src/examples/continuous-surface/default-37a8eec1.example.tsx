import { useId } from "react";

import { ContinuousSurface } from "@/components/ui/continuous-surface";
import { superellipsePath } from "@/lib/continuous-corner";

const curves = [
  { label: "Circular · p=2", exponent: 2 },
  { label: "Continuous · p=3", exponent: 3 },
  { label: "Emphasized · p=5", exponent: 5 },
] as const;

export function ContinuousSurfaceDefault37A8EEC1Example() {
  const clipId = useId();
  return (
    <div className="grid gap-6 sm:grid-cols-4">
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={superellipsePath(1, 1, { exponent: 5 })} />
          </clipPath>
        </defs>
      </svg>
      {curves.map((curve) => (
        <div key={curve.exponent} className="rounded-3xl shadow-lg">
          <ContinuousSurface
            data-curve={curve.exponent}
            radius={24}
            exponent={curve.exponent}
            className="flex aspect-[4/3] flex-col justify-end bg-gradient-to-br from-blue-600 to-purple-700 p-5 text-white"
          >
            <strong>{curve.label}</strong>
            <span className="mt-1 text-sm text-white/80">Straight sides, measured corners</span>
          </ContinuousSurface>
        </div>
      ))}
      {/*
       * Superellipse 用 aspect-square：它是 |x/a|^n + |y/b|^n = 1 的整周采样，
       * 采样按角度均匀，非方形时点的分布会被长宽比拉伸，整条曲线随之变形；
       * 方形 surface 才让 n 只控制"角落有多圆"这一个变量。这里与其它三块的
       * 对比是「整条曲线 vs 四面直边 + 圆角」，因此不强行统一宽高比。
       */}
      <div className="rounded-3xl shadow-lg">
        <div
          data-curve="superellipse"
          aria-label="Superellipse tile"
          className="flex aspect-square flex-col justify-end bg-gradient-to-br from-teal-600 to-blue-700 p-5 text-white"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <strong>Superellipse · n=5</strong>
          <span className="mt-1 text-sm text-white/80">Full curve, square surfaces</span>
        </div>
      </div>
    </div>
  );
}
