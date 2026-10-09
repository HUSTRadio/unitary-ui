# 非线性动效曲线规范

[English](./apple-motion-curves.en.md)

组件库、官网、living styleguide 和 Hitu 插画使用一致的非线性时间曲线：控件快速响应，状态变化柔和收尾，往返动画平滑起止。设计参考为 [Apple Human Interface Guidelines: Motion](https://developer.apple.com/design/human-interface-guidelines/motion)；下列数值由本项目选择，不是 Apple 官方参数，也不声称复现平台的物理弹簧。

## 曲线与时长

`src/styles/index.css` 是参数唯一来源。现有 token 生成器从 CSS 派生内部 JS 默认表，供 Hitu 和共享时间轴求解使用；派生表不增加包根公共接口，不手工编辑。服务端读取生成值，无需浏览器全局对象。

| 语义 | 贝塞尔参数 | CSS token | 使用场景 |
| --- | --- | --- | --- |
| 快速响应、柔和收尾 | `(0.22, 1, 0.36, 1)` | `--ease-snap`、`--ease-pop`、`--ease-stagger`、`--ease-toast`、`--ease-out` | 控件反馈、进入、选中指示条、浮层开合 |
| 平滑起止 | `(0.42, 0, 0.58, 1)` | `--ease-in-out` | 程序滚动、Hitu 缺省片段、呼吸和流光 |
| 加速离场 | `(0.4, 0, 1, 1)` | `--ease-in` | 已有独立退出阶段 |

三条默认曲线单调、无过冲，准确到达起止值。时间进度由贝塞尔的 x 坐标反求参数，再计算 y 坐标；不能把时间直接当作贝塞尔参数。

| 档位 | 默认时长 | 语义 token |
| --- | --- | --- |
| feedback | 150ms | `--uni-motion-feedback` |
| state | 250ms | `--uni-motion-state` |
| overlay | 350ms | `--uni-motion-overlay` |
| expansive | 500ms | `--uni-motion-expansive` |

保留原有时长、延迟与编排。Tailwind 默认 transition 使用 feedback 时长与快速收尾曲线；进入、退出工具类显式选择对应 token。明暗主题使用相同参数，局部 CSS 级联仍可覆盖。

## 各动画实现的契约

- **CSS**：组件、CSS 模块和官网消费曲线 token，替换硬编码缓动。ProgressCircle 数值反馈、Avatar、Skeleton 和 CopyButton 等路径同样遵循规范。
- **Motion**：`useMotionTransition(tier, options)` 签名不变，四档均读取 `--ease-snap`，保留 `TokenOptions` 作用域和单位转换。有效的自定义非线性曲线继续生效；缺失、非法、线性、恒等贝塞尔、零时长或减少动画时即时完成，不新增数字默认时长。
- **Hitu**：缺省、非法或恒等线性 `HituFrame.cubic` 使用平滑起止曲线；有效的显式非线性配置保留，属于从当前关键帧开始的片段。稀疏变换继承前值，首末帧精确命中。Motion 控制外围节点，Hitu 控制 SVG 内部图层，分别拥有变换属性。
- **图表**：AreaChart、BarChart、LineChart、ComboChart 关闭 Recharts Tooltip 内建位移动画，包装层通过 CSS 使用 feedback 时长和 `--ease-snap`。减少动画时不设置该过渡，坐标、裁剪与内容交互保持原语义；数据线的几何插值不变。

没有更换现有 Modal、Drawer、Toast、Collapse 或 Tabs 动画实现，也没有增加第二套 UI 动画引擎。曲线变化保留各组件的焦点、presence、测量、回调和取消流程。

Select 的 CSS 退出动画保留名称，在减少动画时使用现有全局 `0.01ms` 时长完成，没有可见动效。这是生命周期所需的例外：退出期间动态开启减少动画时，Radix Presence 仍能收到 `animationend`，卸载内容并释放滚动锁；不能通过移除动画名称跳过该流程。

## 程序滚动与例外

Scroller 方向按钮、SidebarNav / Tabs 活动项跟踪、图表图例按钮和官网锚点共用 RAF 滚动能力，使用 state 时长与 `--ease-in-out`。

- 同一容器只保留一个动画；新请求从当前位置重新开始，目标受滚动边界限制。
- 滚轮、触摸、拖拽及相关键盘输入取消在途动画；直接操作保持原生跟手。
- 动态开启减少动画时直接到达目标；卸载清理 RAF 和监听器。
- 保留横纵轴、RTL、锚点偏移和局部滚动容器语义，禁止同时叠加原生 smooth。
- App Shell 移动端菜单的区块锚点由示例拦截默认跳转，保留文档 hash 路由，仅在局部容器内滚动。
- 图例按钮状态由实际滚动和完成事件更新，不使用固定等待时间估计位置。

持续旋转的加载指示器保留匀速，按用途登记治理例外；其余时序动画不得配置线性或恒等贝塞尔。静态渐变、数据几何插值和即时状态更新不是时间曲线，不按动画违规处理。曲线治理检查与时长治理互补，不改变既有循环时长。

## 迁移步骤

1. 将 `CarouselVariant` 和选择器中的 `fade-linear` 改为 `fade`。公共联合类型为 `"slide" | "fade" | "fade-scale"`；三种效果都用快速收尾曲线，默认仍为 `slide`，时长仍为 500ms。
2. 将消费 `useMotionTransition` 的局部 `linear` 或恒等贝塞尔覆盖改为有效的非线性 `cubic-bezier(...)`。这些旧覆盖现在即时完成；有意即时切换应明确使用零时长或减少动画策略。
3. Hitu 原先省略 `cubic` 的片段现在平滑起止。需要另一种曲线时提供显式非线性四元组；帧数、播放方式和 ref 接口不变。
4. 程序滚动改用共享能力；移除重复原生 smooth 和按固定时长等待的状态更新。原生用户输入无需改造。

真实用法见 [Hitu + Motion 指南](../guides/hitu-motion.md)、[轮播示例](../site/src/examples/carousel/variants.example.tsx)和[分页媒体展示页](../../src/examples/PagedMediaExample.tsx)。首次 Hitu 接入的包体与验收数据保存在[历史报告](../audits/hitu-motion-2026-10-08.md)，不据此宣称本次曲线迁移已通过检查。

## 验证要求

曲线测试检查端点、中间进度、单调性、CSS / JS 参数一致性、有效局部覆盖及非法配置。行为回归覆盖快速反向切换、重复滚动、用户中断、RTL、动态减少动画、StrictMode、卸载、SSR 与 hydration。浏览器检查保持明暗主题、桌面和移动视口、焦点及现有性能预算；消费构建分别测量普通组件、Motion 和 Hitu 的 gzip 增量。

生成或验收的成功结论必须依据本次命令退出码与产物，以下为必要命令，不是已通过声明：

```sh
pnpm run tokens:generate
pnpm run tokens:check
pnpm run docs:llm:generate
pnpm run docs:llm:check
pnpm run docs:readme:screenshots
pnpm run docs:readme:screenshots:check
pnpm run verify -- --full
```
