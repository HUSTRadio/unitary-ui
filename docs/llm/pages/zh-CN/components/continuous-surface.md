# 连续曲率容器

> Route: `/components/continuous-surface`

按元素尺寸生成连续圆角裁切；无法生成路径时使用普通圆角。

[返回组件](#/components)

# 连续曲率容器

continuous-surface

按元素尺寸生成连续圆角裁切；无法生成路径时使用普通圆角。

## 何时使用

- 用于需要连续圆角的独立卡片、磁贴或近方形容器。
- 矩形卡片使用保留直边的 continuousCornerPath；完整 superellipse 只用于近方形图标或头像。
- 需要在响应式尺寸变化后保持同一视觉半径和曲线家族时。

## 何时不应使用

- 不要机械应用到所有容器；普通 border-radius 更轻、更稳定。
- 不要给长宽比悬殊的表面使用完整 superellipse，避免长边出现桶形观感。
- 不要复制平台资源中的精确 path，也不要使用平台品牌曲线名。

## 示例

### 曲率对比

对比精确圆弧 p=2、默认连续曲率 p=3 和强调曲率 p=5。

## 无障碍

- 组件支持 div 属性。需要说明区域用途时，添加合适的 role、标题或无障碍名称。
- 形状只提供视觉分组，不应成为传达状态或交互含义的唯一方式。

## 受控行为

不适用: ContinuousSurface 没有受控状态。

## 响应式行为

- ResizeObserver 观察本地 border-box，缩放父级不会改变路径坐标；radius 自动限制为短边的一半。
- SSR 或不支持 path() 时使用 border-radius；增强后将普通圆角置零，避免背景双重裁切。

## 主题行为

- 组件只负责裁切；颜色由调用方提供。CSS border 不会自动沿路径描边，有限采样折线也不等于严格连续曲率。
- 阴影放到外层 wrapper 并用 surface-shadow（drop-shadow），不要用 box-shadow：box-shadow 画的是包装自己的圆角矩形，与裁切后的形状脱节。

## 实时示例

**Circular · p=2**Straight sides, measured corners

**Continuous · p=3**Straight sides, measured corners

**Emphasized · p=5**Straight sides, measured corners

**Superellipse · n=5**Full curve, square surfaces

```tsx
import { useId } from "react";

import { ContinuousSurface } from "@hustradio/unitary-ui";
import { superellipsePath } from "@hustradio/unitary-ui";

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
        /*
         * 阴影用 surface-shadow（drop-shadow）而不是 shadow-*：box-shadow 会画成
         * 本包装的圆角矩形，与 ContinuousSurface 裁切后的形状脱节。
         */
        <div key={curve.exponent} className="surface-shadow">
          <ContinuousSurface
            data-curve={curve.exponent}
            radius={24}
            exponent={curve.exponent}
            className="flex aspect-[4/3] flex-col justify-end bg-gradient-to-br from-blue-700 to-purple-700 p-5 text-white"
          >
            <strong>{curve.label}</strong>
            <span className="mt-1 text-sm text-white/80">Straight sides, measured corners</span>
          </ContinuousSurface>
        </div>
      ))}
      {/*
       * Superellipse 取正方形，且边长 = 其它卡片的**高度**（aspect-[4/3] 下为 0.75 列宽）：
       * 这样四块高度一致、同时保持 1:1，让 n 只控制"角落有多圆"。
       * 外层 aspect-[4/3] 负责对齐行高，内层 h-full + aspect-square 负责取正方形。
       */}
      <div className="surface-shadow flex aspect-[4/3] items-center justify-center">
        <div
          data-curve="superellipse"
          aria-label="Superellipse tile"
          className="flex aspect-square h-full shrink-0 flex-col justify-end bg-gradient-to-br from-teal-700 to-blue-700 p-5 text-white"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <strong>Superellipse · n=5</strong>
          <span className="mt-1 text-sm text-white/80">Full curve, square surfaces</span>
        </div>
      </div>
    </div>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { ContinuousSurface } from "@hustradio/unitary-ui";
```

还支持以下类型中定义的属性：`HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">radius</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">以 CSS 像素表示的视觉圆角半径。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">12</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">exponent</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">曲线指数；2 表示圆弧。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">3</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">samples</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">每个非圆弧角的采样线段数。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">24</td></tr></tbody></table>

## 最佳实践

- 仅在连续曲率属于明确设计系统语义时用于孤立卡片或磁贴，不要把它机械应用到所有容器。
- 默认指数为 Unitary 团队值 3；指数 2 是精确圆弧基线，其他参数应有明确的 shape token 依据。
- 阴影放在外层 wrapper 上并用 surface-shadow（drop-shadow），因为 clip-path 会裁掉元素自身的 box-shadow，而包装的 box-shadow 又会画成矩形盒。
- 矩形卡片保留直边；完整 superellipse 只用于近方形图标或头像表面。
- 保留 border-radius 降级，不使用平台品牌曲线名，也不复制平台资源中的精确 path。
