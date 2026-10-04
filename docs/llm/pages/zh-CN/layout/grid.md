# 栅格

> Route: `/layout/grid`

# 网格

由辅助线、单元格、十字标记与断点组成的二维布局系统。

## 最佳实践

- 当辅助线本身是设计的一部分时才使用 Grid——它是可见的二维布局，不是通用间距工具。
- 没有辅助线的普通卡片列表，请改用普通的 CSS/Tailwind grid 布局。
- 尽量避免超过一层 Grid 嵌套。
- 为全部三个支持断点（sm、md、lg）显式给出 rows 和 columns，让每个视口都有明确的布局。
- solid 单元格会遮挡其严格覆盖的辅助线边框——debug 模式下以虚线显示。
- 只有为了可读性才隐藏单轴辅助线（hideGuides="row" 或 "column"）。
- 交互语义放在单元格内容上——辅助线、十字与页面装饰对辅助技术隐藏。
- 在浅色与深色主题下检查辅助线与单元格背景的对比度。

## 空辅助线

没有单元格的 Grid 只渲染辅助线。设置 height 让空表面保持可见。

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridGrid0D7D12ACExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={6} rows={3} height={180} />
    </GridSystem>
  );
}
```

## 基础自动排布

未显式定位的单元格按 DOM 顺序流入轨道。

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
    <GridSystem unstable_useContainer>
      <Grid columns={3} rows={2}>
        <GridCell>1</GridCell>
        <GridCell>2</GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 实心单元格

solid 单元格会盖住自己的区域，并隐藏严格位于其跨度内部的辅助线边框。

A

B

C

D

E

F

G

H

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridSolidCellsE676560CExample() {
  return (
    <GridSystem unstable_useContainer>
      {/* A 跨 2 列 + B..H 共 7 个 = 9 个格位，正好铺满 3×3；
          rows 也必须写 3，否则第 3 行整行没有辅助线。 */}
      <Grid columns={3} rows={3}>
        <GridCell column="1/3" row="1" solid>
          A
        </GridCell>
        <GridCell>B</GridCell>
        <GridCell>C</GridCell>
        <GridCell>D</GridCell>
        <GridCell>E</GridCell>
        <GridCell>F</GridCell>
        <GridCell>G</GridCell>
        <GridCell>H</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 响应式断点

columns 和 rows 接受响应式对象；请为 sm、md、lg 显式给值。

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
        <GridCell>1</GridCell>
        <GridCell>2</GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 响应式裁剪

单元格定位同样接受响应式对象——solid 单元格会裁剪它覆盖的每个断点层的辅助线。

Feature

3

4

5

6

7

8

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridResponsiveGuideClippingA58874D5Example() {
  return (
    <GridSystem unstable_useContainer>
      {/* rows 要给“该断点下内容实际占用的行数”，否则辅助线只画到一半、底部几行没有网格线：
          sm 1 列 → Feature 占 2 行 + 其余 6 格各 1 行 = 8；md 2 列 → 4；lg 4 列 → 2。 */}
      <Grid columns={{ sm: 1, md: 2, lg: 4 }} rows={{ sm: 8, md: 4, lg: 2 }}>
        <GridCell column={{ sm: "1", md: "1/3", lg: "1/3" }} row={{ sm: "1/3", md: 1 }} solid>
          Feature
        </GridCell>
        {/* 编号按“格位”算：Feature 占了前两个格位（1、2），所以其余从 3 起，
            与 specific-clipping 的 1 + 2 / 3 / 4 / 5 + 6 同一套规则。 */}
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
        <GridCell>7</GridCell>
        <GridCell>8</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 隐藏行辅助线

hideGuides="row" 移除水平方向的辅助线边框。

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridHiddenRowGuides59338B9FExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} rows={3} height="preserve-aspect-ratio" hideGuides="row" />
    </GridSystem>
  );
}
```

## 隐藏列辅助线

hideGuides="column" 移除垂直方向的辅助线边框。

```tsx
import { Grid, GridSystem } from "@/components/ui/grid";

export function GridHiddenColumnGuidesE1033A1BExample() {
  return (
    <GridSystem unstable_useContainer>
      <Grid columns={12} rows={3} height="preserve-aspect-ratio" hideGuides="column" />
    </GridSystem>
  );
}
```

## 叠放单元格

单元格可以共用轨道并叠放；堆叠顺序跟随 DOM 顺序。

A

B

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridOverlayingCellsB9F603D6Example() {
  return (
    <GridSystem unstable_useContainer>
      {/* 必须显式给 height：不给 height 时行高是 auto，跨行单元格的内容高度
          会被均摊到它跨越的每一行（约 52px），小于单元格的 cell-padding(40px)，
          文字就被 padding-top 顶到行线上。
          315 / 3 行 = 105px，与本页其它示例的自动行高（cell-padding×2 + 文本行高）
          一致；行高一致，标签才会像其它示例那样落在所在行的垂直中部。 */}
      <Grid columns={4} rows={3} height={315}>
        <GridCell column="1/3" row="1/3">
          A
        </GridCell>
        <GridCell column="2/5" row="2/4">
          B
        </GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 精确裁剪

使用显式线号区间（"a/b"）精确裁剪某个跨度下的辅助线。

1 + 2

3

4

5 + 6

```tsx
import { Grid, GridCell, GridSystem } from "@/components/ui/grid";

export function GridSpecificGuideClipping4F529B64Example() {
  return (
    <GridSystem unstable_useContainer>
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

## 十字标记

GridCross 标记网格线的交点。

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
    <GridSystem unstable_useContainer>
      <Grid columns={3} rows={2}>
        {/* 标上该网格的全部交点：4 条列线（columns+1）× 3 条行线（rows+1）= 12 个。
            十字以交点为中心跨骑网格线（inset 为负），最外圈的会探出网格盒，
            由 docs-local-scroll 的 padding 留出可见空间。 */}
        {[1, 2, 3, 4].flatMap((column) =>
          [1, 2, 3].map((row) => <GridCross key={`${column}-${row}`} column={column} row={row} />),
        )}
        <GridCell>1</GridCell>
        <GridCell>2</GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 虚线十字

在开启 dashedGuides 的 GridSystem 内，十字同样以虚线渲染。

1

2

3

4

5

6

```tsx
import { Grid, GridCell, GridCross, GridSystem } from "@/components/ui/grid";

export function GridDashedGridWithCrossB76B6591Example() {
  return (
    <GridSystem dashedGuides unstable_useContainer>
      <Grid columns={3} rows={2}>
        {/* 与 Cross 示例对齐：同样标上全部 12 个交点，这里用于对比虚线渲染 */}
        {[1, 2, 3, 4].flatMap((column) =>
          [1, 2, 3].map((row) => <GridCross key={`${column}-${row}`} column={column} row={row} />),
        )}
        <GridCell>1</GridCell>
        <GridCell>2</GridCell>
        <GridCell>3</GridCell>
        <GridCell>4</GridCell>
        <GridCell>5</GridCell>
        <GridCell>6</GridCell>
      </Grid>
    </GridSystem>
  );
}
```

## 虚线 GridPage

GridPage 给网格套一层页面级背景（background-200）并水平居中——配合 dashedGuides 时辅助线以虚线绘制。

```tsx
import { Grid, GridPage as GridPageFrame, GridSystem } from "@/components/ui/grid";

export function GridDashedGridWithGridPageFA2E79AFExample() {
  return (
    <GridPageFrame>
      <GridSystem dashedGuides unstable_useContainer>
        <Grid columns={4} rows={2} height={140} />
      </GridSystem>
    </GridPageFrame>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { Grid, GridCell, GridCross, GridPage, GridSystem } from "@/components/ui/grid";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columns</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridColumns</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可见参考列数量。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rows</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridRows</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可见参考行数量。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridHeight</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">栅格高度或响应式宽高比行为。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">hideGuides</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridHideGuides</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">隐藏行或列参考线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">column</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridCellPosition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">GridCell 的列位置。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">row</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">GridCellPosition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">GridCell 的行位置。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">solid</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">渲染实心 GridCell 表面。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">debug</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">显示 GridSystem 调试参考线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dashedGuides</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">使用虚线 GridSystem 参考线。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">guideWidth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">设置 GridSystem 参考线宽度。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">unstable_useContainer</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">启用实验性的容器查询包装器。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
