# 连续曲率容器

> Route: `/components/continuous-surface`

通过连续曲率路径裁切自适应尺寸的表面，并在路径不可用时保留普通圆角。

[返回组件](#/components)

# 连续曲率容器

Continuous Surface

通过连续曲率路径裁切自适应尺寸的表面，并在路径不可用时保留普通圆角。

## 何时使用

- 用于孤立卡片、磁贴或近方形品牌无关表面，且形状确实属于设计系统语义时。
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

- 组件保留 div 的原生属性；根据内容用途自行提供 landmark、heading 或可访问名称。
- 形状只提供视觉分组，不应成为传达状态或交互含义的唯一方式。

## 受控行为

不适用: ContinuousSurface 没有受控状态。

## 响应式行为

- ResizeObserver 观察本地 border-box，缩放父级不会改变路径坐标；radius 自动限制为短边的一半。
- SSR 或不支持 path() 时使用 border-radius；增强后将普通圆角置零，避免背景双重裁切。

## 主题行为

- 组件只负责裁切；颜色由调用方提供。CSS border 不会自动沿路径描边，有限采样折线也不等于严格连续曲率。
- 阴影必须放在外层 wrapper，因为 clip-path 会裁掉元素自身的 box-shadow。

## 实时示例

**Circular · p=2**Straight sides, measured corners

**Continuous · p=3**Straight sides, measured corners

**Emphasized · p=5**Straight sides, measured corners

**Superellipse · n=5**Full curve, near-square surfaces

```tsx
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
      <div className="rounded-3xl shadow-lg">
        <div
          data-curve="superellipse"
          aria-label="Superellipse tile"
          className="flex aspect-[4/3] flex-col justify-end bg-gradient-to-br from-teal-600 to-blue-700 p-5 text-white"
          style={{ clipPath: `url(#${clipId})` }}
        >
          <strong>Superellipse · n=5</strong>
          <span className="mt-1 text-sm text-white/80">Full curve, near-square surfaces</span>
        </div>
      </div>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { ContinuousSurface } from "@/components/ui/continuous-surface";
```

原生属性：`HTMLAttributes<HTMLDivElement>`

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">radius</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">以 CSS 像素表示的视觉圆角半径。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">12</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">exponent</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">曲线指数；2 表示圆弧。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">3</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">samples</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">每个非圆弧角的采样线段数。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">24</td></tr></tbody></table>

## 最佳实践

- 仅在连续曲率属于明确设计系统语义时用于孤立卡片或磁贴，不要把它机械应用到所有容器。
- 默认指数为 Unitary 团队值 3；指数 2 是精确圆弧基线，其他参数应有明确的 shape token 依据。
- 阴影放在外层 wrapper 上，因为 clip-path 会裁掉元素自身的 box-shadow。
- 矩形卡片保留直边；完整 superellipse 只用于近方形图标或头像表面。
- 保留 border-radius 降级，不使用平台品牌曲线名，也不复制平台资源中的精确 path。
