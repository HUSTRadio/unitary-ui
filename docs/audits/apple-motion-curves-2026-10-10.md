# 非线性动效曲线验收记录

[English](./apple-motion-curves-2026-10-10.en.md)

本次实现、完整统一验证与真实发布包检查均已通过。实现签名提交为 `a0760356c8377743949e6ed6aae2f43b2a24ada5`，签名检查为 `G`。设计参考为 [Apple 动效指南](https://developer.apple.com/design/human-interface-guidelines/motion)；曲线数值由本项目选择，不是 Apple 官方常量，也不声称复制平台弹簧物理。

## 实现契约

[src/styles/index.css](../../src/styles/index.css)是参数唯一来源。[token 生成器](../../scripts/generate-token-catalog.mjs)派生小型内部 JS 默认表，不增加公共入口，也不手工维护第二套项目默认值。完整契约见[曲线规范](../design/apple-motion-curves.md)与 [Hitu + Motion 指南](../guides/hitu-motion.md)。

| 用途 | 贝塞尔参数 | Token |
| --- | --- | --- |
| 快速响应、柔和收尾 | `(0.22, 1, 0.36, 1)` | `--ease-snap`、`--ease-pop`、`--ease-stagger`、`--ease-toast`、`--ease-out` |
| 平滑起止 | `(0.42, 0, 0.58, 1)` | `--ease-in-out` |
| 加速离场 | `(0.4, 0, 1, 1)` | `--ease-in` |

三种默认曲线均单调、无过冲、准确到达端点。feedback / state / overlay / expansive 四档时长保留为 150 / 250 / 350 / 500ms；延迟、编排、加载器循环周期与数据几何插值保持原义。

- **CSS / Motion**：[useMotionTransition](../../src/lib/motion.tsx)四档均读取作用域内的 `--ease-snap`，保留 `TokenOptions`、`ms` / `s` 转换与有效非线性覆盖。缺失、非法、线性、恒等贝塞尔、零时长或减少动画配置即时完成，不增加数字默认时长。CSS 默认 transition 使用快速收尾，已有独立退出阶段使用加速离场；匀速例外仅登记持续旋转的加载器用途。
- **Hitu**：[图层插值](../../src/vendor/hitu/interpolation.ts)缺省、非法或恒等线性 `cubic` 使用平滑起止，保留有效作者曲线与稀疏关键帧继承。Hitu 与滚动共用纯函数反解贝塞尔 x 时间轴再计算 y；Motion 从同一模块解析参数并由其引擎执行。SSR 默认值不读取浏览器对象。Motion 负责外围节点，Hitu 负责 SVG 内部图层。
- **Carousel / 图表**：[Carousel](../../src/components/ui/carousel.tsx)类型为 `"slide" | "fade" | "fade-scale"`，`fade-linear` 迁移为 `fade`；三种效果保留 500ms 并使用快速收尾。四类图表关闭 Recharts Tooltip 内建位移动画，wrapper 使用 feedback 时长与 `--ease-snap`，减少动画时关闭过渡，保留坐标和几何插值。
- **滚动 / 生命周期**：[共享 RAF 滚动](../../src/lib/scroll-animation.ts)供 Scroller、SidebarNav / Tabs 活动项跟踪、图表图例与官网锚点使用 state 时长和 `--ease-in-out`；同容器互斥、从当前位置替换、用户输入中断、动态减少动画直接到达目标、卸载清理。保留 RTL、边界、局部容器、锚点偏移，图例根据实际滚动更新状态。[Select](../../src/components/ui/select.tsx)减少动画时保留退出名称，以现有全局 `0.01ms` 时长完成 Presence 卸载和滚动锁释放，没有可见动效。[HamburgerMenu](../../src/components/ui/hamburger-menu.tsx)与 [ExpandPanel](../../src/components/ui/expand-panel.tsx)使用 `focus({ preventScroll: true })` 返回触发器焦点，禁止该操作带来的原生滚动。

已有动画引擎与焦点、presence、测量、回调流程保留。Hitu 的[固定来源及本地修改说明](../../src/vendor/hitu/SOURCE.md)和[完整 MIT 许可](../../src/vendor/hitu/LICENSE)继续保留，后续曲线维护归本项目负责。

## 实施中发现与修复

| 问题 | 修复与回归 |
| --- | --- |
| 取消回调同步发起新滚动时，较旧请求覆盖新请求并留下两个 RAF | 容器请求序号保证最新请求优先；回归检查单一 RAF、旧句柄隔离与准确终点。 |
| 原生锚点迁移漏读 `scroll-padding`，居中未考虑非对称边距 | 读取容器起止 padding、目标起止 margin 与边框，覆盖局部 start / center 定位。 |
| App Shell 内部锚点切换到外部 Sheet 居中时，不同容器的动画可能并行 | 替换命令前显式取消句柄，卸载清理，覆盖跨容器切换。 |
| 移动菜单区块锚点的默认导航改变文档 hash | 消费者拦截局部锚点默认跳转，保留文档路由与局部滚动。 |
| HamburgerMenu / ExpandPanel 焦点返回策略需要保证不滚动祖先 | 增加 `preventScroll` 策略回归；没有将该路径认定为本次浏览器外层跳动的根因。 |
| Playwright 在等待遮罩的点击重试中自动滚动，影响过早记录的外层基线 | 先 `navigation.click({ trial: true })` 完成可点击性检查与自动滚动，再记录基线并真实点击；仍严格检查 hash、局部目标偏移与祖先位置，四项最终均首轮通过。 |
| Select 退出期间开启减少动画，移除 animation-name 后 Presence 未结束，内容与滚动锁残留 | 保留退出名称并以 `0.01ms` 完成结束事件；真实浏览器验证卸载、焦点与锁释放。 |
| Drawer 即时状态改为 `transition: none` 后，时长账本仍登记已不存在的 `0s` | 清理残留例外，保留账本与代码一一对应检查。 |
| 新图表浏览器规格遗漏统一验证映射，完整验证 fail-closed 停止 | 登记四类图表、偏好模块与样式输入；35 项映射回归通过后重新执行完整验证。 |

曲线治理另覆盖 JSX、关键帧数组、恒等贝塞尔及 CSS 配置，保留静态渐变与数据几何插值的原义。

## 完整验证证据

`pnpm run verify -- --full` 在基线 `cf5da135b478ccab74773f82c2841f25b732cf19` 上验证最终待提交文件树。运行 `b49fa9a8` 为 `PASS`，退出码 0，`inputsChanged=false`，15 / 15 步均退出码 0，耗时 4,073,350ms。随后源码未变，签名提交为 `a0760356`；这份记录不声称提交后重新运行了完整验证。

| 检查 | 观察结果 |
| --- | --- |
| 单元测试 | 288 个文件、2092 项全部通过。 |
| lint | 退出码 0，20 条 warning：17 条既有；本次测试增加 2 条有意稀疏数组回归提示与 1 条无效转义风格提示。 |
| token / 类型 | token 检查、源码 typecheck、测试 typecheck 均退出码 0。 |
| 生产构建 | styleguide、官网、组件库均退出码 0。 |
| 包根检查 | 9 / 9 通过，退出码 0。 |
| 完整浏览器 | 48 个规格、516 项全部首轮通过；0 flaky、0 unexpected、0 skipped，无缺失或未完成项；耗时 2,928,731.815ms。 |
| 相关动效行为 | 包括 16 项图表、4 项锚点、4 项 Motion 中间进度、动态 Select 减少动画，以及 Hitu、轮播、滚动和焦点相关回归，均首轮通过。 |
| 性能 | 原有 20ms 滚动帧时间预算保留并通过；不据此保证其他设备的帧率。 |
| LLM corpus | 240 页双语语料，确定性检查退出码 0。 |
| README 截图 | 8 页 × 2 主题 = 16 张，漂移检查退出码 0；两个管理区引用完整。全部 1440×900 图片经实际视觉复查，无空白、破图或错误状态。 |

截图是固定视口捕获：组件页底部 Tabs 与分页媒体页后续内容自然延伸出底边。静态图复查不代替完整浏览器动画与交互证据。

环境：Node 24.21.0、pnpm 11.20.0、React / ReactDOM 19.2.8、Vite 8.2.1、Motion 14.0.0、Vitest 4.1.10、Playwright 1.62.1。

## 实际发布包

实际 pack 与归档检查均退出码 0。归档含 194 项，其中 186 个 dist 文件、16 个字体及 ESM / CJS 两个 lazy chunks；预期入口、声明、完整 Hitu MIT 许可与双语第三方说明齐全。归档内 dist 与已验证构建逐字节一致。解包后执行现有[包检查](../../scripts/test-package-imports.mjs)，9 / 9 通过，退出码 0，SSR / hydration 无错误。

- 归档大小：25,909,246 bytes。
- SHA256：`1d00d386e02688c9e8e153bfc4302bf3b233f004b0d2214a6ed1cfadb3c77767`。

## 消费构建测量

[measure-motion-bundles.mjs](../../scripts/measure-motion-bundles.mjs)构建真实包根入口消费者，不使用源码 alias；每个夹具包含 React、Button 和发布 CSS，再增加 Motion、Hitu 双资产或二者组合。最终命令 `node scripts/measure-motion-bundles.mjs` 退出码 0。

每个产出的 JS / CSS 文件分别以 gzip level 9 压缩后求和，包含 lazy chunks。仅不单独计入分离产出的字体、图片和 sourcemap 文件；嵌入 JS / CSS 的资源字节仍计入所属文件。这描述完整产物而非首屏传输量，统一根入口不保证所有消费者零成本。

| 消费者 | 最终 JS bytes | 基线 JS gzip bytes | 最终 JS gzip bytes | 同夹具改动前后差值 | 相对最终 Button 增量 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Button | 1,127,822 | 295,831 | 297,590 | +1,759 | 0 |
| Motion | 1,218,311 | 329,621 | 331,026 | +1,405 | +33,436 |
| Hitu，双资产 | 1,132,199 | 297,920 | 299,369 | +1,449 | +1,779 |
| Combined | 1,222,674 | 331,520 | 332,835 | +1,315 | +35,245 |

基线为改动前 `cf5da13` 已构建快照，使用相同消费夹具。最终所有夹具 CSS 为 648,483 bytes / 279,879 gzip bytes；基线 CSS gzip 为 279,845，改动前后均为 +34 bytes，相对最终 Button 的 CSS 增量均为 0。

主要复现命令：

```sh
pnpm run verify -- --full
pnpm run build:lib
pnpm run test:package
node scripts/measure-motion-bundles.mjs
```

本报告记录已获得的实现、验收、归档与消费构建证据；本地主线合并和原电源设置恢复的最终状态在交付时另行核对。
