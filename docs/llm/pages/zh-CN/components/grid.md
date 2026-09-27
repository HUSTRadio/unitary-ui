# 栅格

> Route: `/components/grid`

以网格布局显示元素。

[返回组件](#/components)

# 栅格

grid

以网格布局显示元素。

## 何时使用

- 需要在营销页面、文档首页和功能分解图中实现二维的单元格加引导线布局，其中引导线和单元格边框本身就是设计的一部分。
- 希望在不增加复杂嵌套的情况下对齐多个项目并保持视觉层次。

## 何时不应使用

- 对于普通的 n 列响应式内容（卡片列表等），直接使用 Tailwind 的 grid-cols-\* 工具类即可；Grid 在没有引导线可见时属于过度设计。
- 不应嵌套超过一层 Grid，引导线的叠加会产生视觉噪音并破坏单元格的对齐计算。

## 示例

### 基础栅格

最简单的网格布局示例：定义几行几列，元素自动按网格填充，带有默认的引导线和间距。

### 实心单元格

为每个单元格添加实线边框以形成更强烈的分区感，适合需要对齐关系非常明确的数据面板展示。

### 响应式栅格

根据不同视口自动调整行列数量和尺寸，在小屏减少列数以保持可读性，在大屏充分利用横向空间。

### 虚线加十字的栅格

结合虚线引导线和交叉点装饰的高级用法，创造出具有设计感的结构网格，常用于技术文档或品牌页面的装饰性布局。

## 无障碍

不适用: Grid 是一个纯视觉布局组件，不包含可交互的元素或语义化的 ARIA 角色。内容的可访问性由网格内放置的实际组件（按钮、链接、标题等）决定。

## 受控行为

不适用: Grid 作为布局容器，不管理任何内部状态或用户交互数据。它的行为完全由传递给子元素的 props（行数、列数、对齐方式等）决定。

## 响应式行为

- Grid 组件内置响应式断点，在不同视口下自动调整列数和引导线的显示方式。
- 可以分别隐藏行引导线或列引导线以适应特定的布局需求，当两侧引导线都隐藏时通常意味着纯 Tailwind 网格更为合适。

## 主题行为

- 网格线颜色和单元格背景色从主题令牌获取，确保浅色模式和深色模式下的正确对比度。
- 引导线粗细和样式（实线、虚线）可通过 props 调整并与设计系统的 Token 保持一致。

## 实时示例

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridGrid0D7D12ACExample() {
  return (
    <GridSystem debug guideWidth={1} unstable_useContainer>
      <Grid columns={5} height="preserve-aspect-ratio" rows={2} />
    </GridSystem>
  );
}
```

## 基础网格

1

2

3

4

5

6

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridBasicGrid278AA3F9Example() {
  return (
    <GridSystem guideWidth={1} unstable_useContainer>
      <Grid columns={3} rows={2}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <GridCell key={n}>{n}</GridCell>
        ))}
      </Grid>
    </GridSystem>
  );
}
```

## 实心单元格

1 + 2

3

4

5 + 6

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridSolidCellsE676560CExample() {
  return (
    <GridSystem guideWidth={1} unstable_useContainer>
      <Grid columns={3} rows={2}>
        <GridCell column="1/3" row="1" solid>
          1 + 2
        </GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell column="2/4" row="2" solid>
          5 + 6
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 响应式网格

1

2

3

4

5

6

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridResponsiveGrid8DF1FB3EExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <GridCell key={n}>{n}</GridCell>
        ))}
      </Grid>
    </GridSystem>
  );
}
```

## 响应式参考线裁切

1 + 2

3

4

5 + 6

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridResponsiveGuideClippingA58874D5Example() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={{ sm: 1, md: 2, lg: 3 }} rows={{ sm: 6, md: 3, lg: 2 }}>
        <GridCell column={{ sm: "1", md: "1/3" }} row={{ sm: "1/3", md: 1 }} solid>
          1 + 2
        </GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell column={{ sm: 1, md: "1/3", lg: "2/4" }} row={{ sm: "5/7", md: 3, lg: 2 }} solid>
          5 + 6
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 隐藏行参考线

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridHiddenRowGuides59338B9FExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} height="preserve-aspect-ratio" hideGuides="row" rows={3} />
    </GridSystem>
  );
}
```

## 隐藏列参考线

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridHiddenColumnGuidesE1033A1BExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} height="preserve-aspect-ratio" hideGuides="column" rows={3} />
    </GridSystem>
  );
}
```

## 重叠单元格

1

2

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at felis

3

4

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridOverlayingCellsB9F603D6Example() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} rows={3}>
        <GridCell column="1/3" row="1/3" solid>
          1
        </GridCell>
        <GridCell column="2/4" row="2/4">
          2
        </GridCell>
        <GridCell column="3/10" row="2/4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at felis
        </GridCell>
        <GridCell column="7/12" row="1/-1" solid>
          3
        </GridCell>
        <GridCell column="11/13" row="1/3" solid>
          4
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 特定参考线裁切

1

2

3

4

5

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridSpecificGuideClipping4F529B64Example() {
  return (
    <GridSystem guideWidth={1} unstable_useContainer>
      <Grid columns={3} rows={4}>
        <GridCell column="1/2" row="1/3" solid>
          1
        </GridCell>
        <GridCell column="3/4" row="1/2" solid>
          2
        </GridCell>
        <GridCell column="2/3" row="2/4">
          3
        </GridCell>
        <GridCell column="1/2" row="4/5" solid>
          4
        </GridCell>
        <GridCell column="3/4" row="3/5" solid>
          5
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 带十字的网格

1

2

3

4

5

6

```tsx
import { Grid, GridCell, GridCross, GridSystem } from "@/components/ui/grid";

export function GridGridWithCross6A783E1BExample() {
  return (
    <GridSystem guideWidth={1} unstable_useContainer>
      <Grid columns={3} rows={2}>
        <GridCross column={1} row={1} />
        <GridCross column={4} row={1} />
        <GridCross column={4} row={3} />
        <GridCross column={1} row={3} />
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <GridCell key={n}>{n}</GridCell>
        ))}
      </Grid>
    </GridSystem>
  );
}
```

## 带十字的虚线网格

Content here

```tsx
import { Grid, GridCell, GridCross, GridSystem } from "@/components/ui/grid";

export function GridDashedGridWithCrossB76B6591Example() {
  return (
    <GridSystem dashedGuides guideWidth={1} unstable_useContainer>
      <Grid columns={1} rows={1}>
        <GridCross column={1} row={1} />
        <GridCross column={2} row={2} />
        <GridCross column={2} row={1} />
        <GridCross column={1} row={2} />
        <GridCell>Content here</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 带页面的虚线网格

Content here

```tsx
import { Grid, GridCell, GridCross, GridPage, GridSystem } from "@/components/ui/grid";

export function GridDashedGridWithGridPageFA2E79AFExample() {
  return (
    <GridPage>
      <GridSystem dashedGuides guideWidth={1}>
        <Grid columns={1} rows={1}>
          <GridCross column={1} row={1} />
          <GridCross column={2} row={2} />
          <GridCross column={2} row={1} />
          <GridCross column={1} row={2} />
          <GridCell>Content here</GridCell>
        </Grid>
      </GridSystem>
    </GridPage>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Grid, GridCell, GridCross, GridPage, GridSystem } from "@/components/ui/grid";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columns</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridColumns</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可见参考列数量。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rows</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridRows</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可见参考行数量。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridHeight</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">栅格高度或响应式宽高比行为。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">hideGuides</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridHideGuides</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">隐藏行或列参考线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">column</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridCellPosition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">GridCell 的列位置。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">row</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridCellPosition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">GridCell 的行位置。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">solid</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染实心 GridCell 表面。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">debug</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示 GridSystem 调试参考线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dashedGuides</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">使用虚线 GridSystem 参考线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">guideWidth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">设置 GridSystem 参考线宽度。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">unstable_useContainer</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">启用实验性的容器查询包装器。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 营销页、文档落地页和功能分解中的二维单元格与引导线布局（网格线、单元格边框是设计的一部分）用 Grid。
- 普通 n 列响应式内容（卡片、列表）直接用 Tailwind 的 grid grid-cols-\* 工具类；引导线不可见时 Grid 是过度设计。
- Grid 嵌套不超过一层；引导线重叠看起来像视觉噪音并破坏单元格数学。
- 仅当隐藏行或列引导线确实提升清晰度时（单轴布局、hero 行）才隐藏。两者都隐藏通常说明用普通 Tailwind grid 才对。
