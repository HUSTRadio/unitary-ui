# Unitary 圆角与混排排版规范

> 状态：实现规范。适用于 `feat/corner-typography-alignment` 起的公共 token 与组件。

## 1. 资料与归属边界

本规范只采用通用几何、公开排版规范与 Unitary 自有参数，不复制 Apple Design Resources 中的模板、mask、精确 path 或其他高识别轮廓，也不捆绑 SF 字体。

| 项目 | 值或机制 | 归属 |
| --- | --- | --- |
| 同心嵌套 | $r_i \approx r_o-d$ | Apple 官方机制；公式和具体参数由 Unitary 实现 |
| radius scale | 4/6/8/12/16/20/24/28px | Unitary 团队值，源自项目研究报告建议 |
| circular exponent | $p=2$ | 通用数学性质 |
| continuous exponent | 默认 $p=3$ | Unitary 团队值 |
| mixed-script UI gap | 0.125em | Unitary 团队值；参考 W3C CLReq 的 1/8 em 下限讨论 |
| mixed-script prose gap | 0.25em | Unitary 团队值；参考 W3C CLReq 常见 1/4 em 间距 |
| compact/prose/reading leading | 1.35 / 1.55 / 1.7 | Unitary 团队值，源自项目研究报告建议区间 |
| `text-autospace` | 支持时渐进增强 | CSS 浏览器机制，不归因为 Apple HIG |

Apple HIG 没有给出可直接移植到 Web 的统一圆角 token 表，也没有规定 CJK 与 Latin 的固定间距；不得把上表的 Unitary 参数写成 Apple 官方值。

## 2. Shape token

### 2.1 固定 radius scale

沿用现有稳定命名，不新增与 `sm=4px` 重复的 `xs`：

| Token | px | 典型用途 |
| --- | ---: | --- |
| `--radius-sm` | 4 | 紧凑高亮项 |
| `--radius-md` / `--radius` | 6 | 基础表面、overlay |
| `--radius-lg` | 8 | 控件、卡片 |
| `--radius-xl` | 12 | modal、较大表面 |
| `--radius-2xl` | 16 | 大卡片 |
| `--radius-3xl` | 20 | 展示表面 |
| `--radius-4xl` | 24 | 大型展示表面 |
| `--radius-5xl` | 28 | 超大型展示表面 |

派生语义：

- `concentric`：内层半径约为外层半径减去实际 inset；已有 overlay 6/4px 对使用 2px 光学差。
- `circular`：`--radius-circle: 50%`，只在等宽高表面形成圆。
- `capsule`：`--radius-capsule` 复用无穷大 pill 半径，视觉结果等价于 $h/2$。
- `continuous`：由运行时数学 path 实现，不能用普通 `border-radius` 假装。

### 2.2 Continuous corner 数学

单角局部坐标系以角点为原点、两条直边为轴：

$$
(1-x/r)^p+(1-y/r)^p=1,\quad p>1
$$

采样参数式：

$$
x=r(1-\cos^{2/p}\varphi),\qquad
y=r(1-\sin^{2/p}\varphi),\qquad
\varphi\in[0,\pi/2]
$$

- $p=2$ 精确退化为半径 $r$ 的普通圆弧；实现使用 SVG arc 命令，作为圆弧基准。
- $p>2$ 与相邻直边保持 G1 切线连续，角部曲率向角点集中。
- 默认 $p=3$ 是 Unitary 团队值；调用方可显式传参，但不应使用品牌化命名。
- 整体 superellipse 只用于近方形 icon tile/avatar/logo 框。长宽比悬殊的卡片应使用带直边的 continuous corner，避免长边桶形。

`ContinuousSurface` 用 `ResizeObserver` 生成 `clip-path: path(...)`。不支持或尚未测得尺寸时保留普通 `border-radius` 降级。`clip-path` 会裁掉元素自身阴影，所以阴影必须放在外层 wrapper。

## 3. CJK / Latin 混排与行高

- UI 内联混排的手动间距 token 为 `--uni-mixed-script-gap-ui: 0.125em`。
- 正文混排的手动间距 token 为 `--uni-mixed-script-gap-prose: 0.25em`。
- 支持 `text-autospace: normal` 的浏览器由 `.text-autospace` 渐进增强；不支持时维持原文本和人工空格，不做脚本改写。
- CJK 正文保持 `letter-spacing: normal`；不得把 heading 的负 tracking 传播到 body/prose。
- 长文本行高分层为 compact 1.35、prose 1.55、reading 1.7；现有 11 级控件/标题 token 保持兼容，不批量迁移现有 demo。
- Latin 单词内部不参与 CJK 均排。页面应设置正确 `lang`，让字体 fallback 与换行规则按语言工作。

## 4. 验证

1. 数学测试验证 $p=2$ 圆弧退化、端点、边界、单调性和非法参数。
2. 组件测试验证 SSR 降级、data-slot 与 style 合并。
3. 浏览器测试验证 p=2/circular、p=3/p=5 与 superellipse 示例均渲染且 path 生效。
4. token 测试限制新增 block 中不得出现品牌联想命名。
