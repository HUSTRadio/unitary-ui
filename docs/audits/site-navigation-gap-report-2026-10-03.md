# 官网导航、页脚与滚动生态补齐报告

调查日期：2026-10-02 至 2026-10-03。实施分支：`codex/site-navigation-1003`。本报告讨论可复用的行为与模板，不声明四站逐像素复刻。

## 当前结论

项目已经有 Navbar、Footer、HamburgerMenu、SidebarNav、Collapse、Sheet、Scroller、Video 和语义颜色/材质/动效 token。缺口主要在官网导航的信息结构、跨端组合模板、页面滚动状态与叙事编排，而非重新创建这些基础组件。

现有 App Shell 是应用/文档站模板，不能直接代替内容型官网。MenuBar 是应用命令菜单，也不能承担官网多列链接导航的语义契约。

| 当前实现 | 已覆盖 | 调查时的缺口 |
| --- | --- | --- |
| [Navbar](../../src/components/ui/navbar.tsx) | static / pinned / auto-hide、透明与实色、高度配置 | 补色依赖滚动方向，上滚仍远离页首时失去底色；缺少打开导航时保持可见的协作接口 |
| [HamburgerMenu](../../src/components/ui/hamburger-menu.tsx) | 应用壳层的分组导航、搜索、展开面板、局部容器、空数据/加载反馈 | 缺少完整官网的桌面多触发器 mega menu、混合直接链接与目录、推荐内容栏和整屏移动目录配方 |
| [Footer](../../src/components/ui/footer.tsx) | 品牌插槽、链接网格、尾部插槽、sticky | 网格布局不能独立配置；没有单独版权/政策带；缺少可选移动折叠与外链属性 |
| [Sheet](../../src/components/ui/sheet.tsx)、[Collapse](../../src/components/ui/collapse.tsx) | 模态面板与分组折叠的交互基础 | 缺少官网组合中的断点切换、独立目录滚动、底部 CTA、链接导航后的焦点协调 |
| [Scroller](../../src/components/ui/scroller.tsx) | 原生横/纵滚动、滚至相邻直接子项的按钮 | 缺少官网内容轨道的 snap 配方；按钮未根据减少动效切换滚动方式 |
| [useScrollDirection](../../src/lib/use-scroll-direction.ts) | 文档垂直方向检测、24px 默认阈值、rAF 合并事件 | 不提供绝对位置、进度或明确的容器 owner；保留旧契约，官网组合使用新增状态接口 |
| [Video](../../src/components/ui/video.tsx)、[样式与 token](../../src/styles) | 视频与视觉基础、颜色、材质、动效体系 | 页面级滚动状态、一次性显现、返回顶部和 sticky 叙事仍需调用方反复实现 |

这些是调查开始时的缺口，下文对应实现已经补入本分支。布局、品牌字体、内容比例和媒体资产仍由使用方提供。

## 参考站与证据边界

| 参考站 | 已取得证据 | 可提炼的模式 | 响应式重点 |
| --- | --- | --- | --- |
| [OpenAI 中文首页](https://openai.com/zh-Hans-CN/) | 公开网页正文：分组导航按钮、登录入口、多组页脚、社交/语言/Cookie 入口；直接 HTML 请求返回 403，浏览器显示 Cloudflare 验证页 | 内容官网导航、密集站点目录页脚、搜索与账号入口 | 本轮无法确认实际断点与滚动状态；不把文字抓取当作响应式证据 |
| [清华大学](https://www.tsinghua.edu.cn/) | 当前 HTML、index.css、phone.css、页面脚本；390px 与 768px 目录、1440px 首页截图 | 工具链接条 + 主导航 + 全站目录；联系方式/公众号/备案页脚；新闻与活动长页面 | phone.css 在 ≤800px 加载，≤550px 进一步调整；768px 实测已进入移动目录；目录转为整行分组折叠并自行滚动 |
| [Anthropic](https://www.anthropic.com/) | 当前 HTML/CSS/脚本及 390px 菜单、页脚截图 | 编辑式导航、链接与下拉并存、底部 CTA 的整屏移动导航；多组深色页脚 | CSS 含 991/767/479px 断点；移动菜单实际显示分组与底部操作；390px 页脚保留展开的链接列表，并非移动手风琴 |
| [腾讯](https://www.tencent.com/zh-cn/) | 当前 HTML/CSS/脚本及 390/1440px 页面；390px 页脚折叠前后截图 | 当前版全宽 mega menu、语言入口、多层目录、移动 accordion、分区页脚和叙事内容 | 导航源码采用 1279px 响应式分界；主题布局包含 375/640/1280/1920px；390px 实测点击页脚分组可展开，桌面采用多列 |

CSS 和脚本存在不等于动效验收通过。引用 Lenis 属性不证明启用了平滑滚动引擎；加载 ScrollTrigger 也不能单独证明某个区块使用 pin/scrub。官网将持续更新，以上是本次取证范围。

不能给四站统一套一个手机断点或同一种移动页脚：清华的导航收缩早于本模板默认 1024px，腾讯更早转入移动目录，Anthropic 的窄屏页脚仍以链接目录呈现。这里提炼可配置模式，而非把每站断点硬编码进基础组件。

## 组件与模板的边界

| 优先级 | 缺口 | 实施位置 | 验收条件 |
| --- | --- | --- | --- |
| P0 | 官网分组导航/mega menu | 新增 SiteNavigation，普通 nav/button/a 语义，复用 Sheet 与 Collapse | 点击、鼠标悬停意图、键盘 Escape/方向键；多列内容；触屏无需 hover；移动焦点归还、正文锁滚；跨断点关闭浮层 |
| P0 | 透明顶栏的位置与方向混用 | Navbar 及页面滚动 hook | solidOnScroll 按绝对距离保持底色，上滚到阈值外不变透明；刷新在页面中部也正确；菜单/焦点存在时 auto-hide 不隐藏 |
| P0 | 官网页脚重排 | 扩展 Footer，保持现有默认契约 | 可配置链接网格、底部版权/政策区；移动可选折叠；桌面全部展开；外链 target/rel；宽屏与窄屏不溢出 |
| P1 | 页面级滚动复用 | 页面滚动状态、ScrollReveal、BackToTop | 原生文档或明确的容器作为滚动 owner；减少动效降级；SSR 安全；无 IntersectionObserver 时内容仍可见 |
| P1 | 官网壳层 copy-and-paste | 双语 living pattern + 可复制源码 | 内容门户、编辑式官网、大学工具条、企业叙事四种配方；菜单与页脚共享数据；搜索、语言、社交/联系入口由站点配置 |
| P1 | 内容横向滑轨 | 复用 Scroller 的 CSS scroll-snap 配方，并修正按钮减少动效 | 不把横向 rail 误当页面滚动；键盘按钮可用；direct children 契约明确；移动保留原生触摸滚动 |
| P2 | 滚动叙事/首屏轮播/章节导航 | copy-and-paste 模板，避免默认全站滚动劫持 | sticky 内容与自然滚动共存；窄屏转正常流；轮播有显式前后控件、无强制自动播放；锚点避让顶栏 |

## 多端验收矩阵

尺寸覆盖 320、390、768、1024、1280、1440px，以及配置的导航断点两侧；同时覆盖鼠标与触屏、纵向与矮横屏。两种主题均检查：正文与浮层无横向溢出、移动入口可触达、长导航只由面板正文滚动、CTA 可到达、页脚链接可访问。

交互覆盖：Tab/Shift+Tab、Enter/Space、Escape、点击外部、修饰键打开链接、菜单打开后滚动与 resize、返回顶部后的焦点、系统减少动态效果。切换断点不能留下 body 锁滚或不可见的焦点陷阱。

## 已实施的配方与使用方式

- [SiteNavigation](../../src/components/ui/site-navigation.tsx)：共享链接数据，桌面提供多列分组与 featured 内容，移动复用模态 Sheet 和 Collapse。支持 768/1024/1280px 三个断点；实际面板高度按其位置和 visual viewport 计算。普通导航链接保持原生语义和外链属性，移动操作区的链接也会关闭目录。
- [页面滚动状态](../../src/lib/use-page-scroll.ts)：公开 `usePageScroll(threshold = 80, target?)`，分别返回绝对位置状态、累计方向和 0–1 进度；通过 rAF 合并事件。`target` 为明确的元素或文档，避免把横向轨道误当页面滚动。
- [ScrollReveal](../../src/components/ui/scroll-reveal.tsx)、[BackToTop](../../src/components/ui/back-to-top.tsx)：显现只执行一次；SSR、无观察器和减少动效保持内容可见。返回顶部支持独立容器和显式焦点目标。
- Navbar 仍保留原有默认值和定位契约；补色按绝对距离判断，`forceVisible` 协调导航/搜索，键盘焦点保持顶栏显示。Footer 的默认网格保持两列、sm 起三列；按需启用 `columnsClassName`、`slotBottom`、`collapseOnMobile`。移动折叠链接具备 44px 高度。
- [WebsiteShell 可复制源码](../site/src/templates/website-shell.tsx) 提供 portal / editorial / university / corporate 四种配方；[living pattern](../site/src/components/patterns/site-shell-demo.tsx) 提供双语说明、完整源码和独立 iframe 预览。独立预览使 fixed 顶栏和移动全屏目录按自身视口响应。

| 配方 | 导航与页脚 | 页面滚动 |
| --- | --- | --- |
| portal | 1024px 起桌面分组面板；密集目录页脚与政策/语言区 | 原生横向 Scroller + CSS snap，最后一项尾端对齐，避免轻微溢出时按钮被拉回起点 |
| editorial | 1024px 起桌面面板；多组展开页脚 | 衬线标题、阅读顺序、两列内容窄屏转单列、一次性显现 |
| university | 工具条、品牌主栏、1280px 起桌面面板；联系方式与目录 | 手动前后切换的首屏内容，禁用自动播放；新闻网格与章节锚点 |
| corporate | 1280px 起桌面面板；透明/自动隐藏顶栏；手机可折叠页脚 | sticky 说明 + 自然滚动的故事区，手机取消 sticky；显现和返回顶部 |

文档入口为 `/#/patterns/site-shell`，独立预览为 `/#/patterns/site-shell?preview=portal`（variant 可替换）。源码使用项目的 `@/lib` 导入，复制到其他工程时应改为实际包入口或对应本地组件路径。示例搜索只查询模板导航数据，实际站内搜索、语言路由、账户、社交账号、备案与 Cookie 偏好须接入站点真实数据/服务。

未声称已经补齐的高保真能力包括品牌视频首屏、二维码与品牌素材、精确的 pin/scrub 时间轴、自动播放策略及 consent 服务。这些没有充分的四站跨端运行证据，不默认封装进通用组件；已有 Video、Sheet、Collapse 和 Footer 插槽可作为后续配方基础。

## 执行与证据记录

实施和验证使用独立 worktree，初始版本为 `77edb98`；原主工作树与已有 ux-parity 工作树的修改不属于本次变更。未提交或推送。截图和运行日志保留在当前工作树的忽略目录 `.scratch/site-audit`、`.scratch/site-browser-results`、`.scratch/site-webkit-results` 与 `.scratch/site-*.log`，不进入发布内容。

| 验证 | 结果 |
| --- | --- |
| 相关行为与文档测试 | 5 个文件、41 项通过，退出码 0；包括顶栏距离/方向、菜单关闭与焦点、页脚折叠、容器返回和无观察器回退 |
| 全量单元测试 | `pnpm exec vitest run --maxWorkers=4`：249 文件、1640 项通过，退出码 0 |
| 类型与 lint | `pnpm run typecheck` 退出码 0；lint 退出码 0，既有警告单独保留 |
| 新增页面浏览器矩阵 | Chromium 的 20 项通过，退出码 0：四种配方 × 六种宽度 × 两种主题；另有矮横屏触屏、断点边界、文档页、搜索/hover、原生轨道与动效回退；追加桌面链接激活后切到手机的焦点回归通过 |
| 跨引擎复核 | WebKit 的 7 项通过，退出码 0：四配方的 390px 深色/1280px 浅色、触屏矮横屏、企业滚动与显现、1280px 边界、hover/搜索/滑轨及焦点回归 |
| 构建、包内容与 SSR | `pnpm run build`、`pnpm run test:package` 退出码 0；原生 ESM/CJS 导入与 SSR 通过；打包检查包含新增类型、字体、许可证、OFL 和 notices，不包含 demo 媒体与应用入口 |
| 双语 LLM 文档生成/确定性检查 | `pnpm run docs:llm:generate` 与 `pnpm run docs:llm:check` 均退出码 0；114 路由 × 2 语言，228 页，无漂移；官网 pattern 正文已确认没有错误边界占位 |
| README 截图生成/检查 | 5 页 × 2 主题，两个命令均退出码 0；未产生截图或 README 漂移 |

全量测试初次受默认 Python shim 与旧 Pillow 影响；图片比较器使用的 `get_flattened_data` 自 [Pillow 12.1.0](https://pillow.readthedocs.io/en/stable/releasenotes/12.1.0.html) 新增。本轮用忽略目录下的临时 Python 环境和 Pillow 12.1.0 验证，未改系统 Python 或审计脚本。高并发全量运行曾使源文件扫描测试达到 15s 超时，限制为 4 个 worker 后全量通过。

跨引擎检查先发现测试在切换预览 query 时继承了上一配方的页脚滚动位置；测试现明确等待目标配方渲染，并回到页首建立初始条件。修正测试条件后 WebKit 的 7 项全部通过。上述多端证据来自 Windows 上的 Chromium/WebKit 与触屏模拟；不等同于 iOS/Android 真机、系统浏览器工具条或实体刘海安全区验收。

`pnpm run typecheck:tests` 退出码 1（内部 tsc 报告 2 项错误）：`tests/audit/run-showcode-audit.mts:5` 引用不存在的 `docs/site/src/data/demo-code`，以及 `tests/llm-task-runner.test.ts:227` 的参数类型问题。已核对初始 HEAD 中同样保留这些引用/未标注参数；涉及文件不属于本次修改，记录为未处理的仓库检查问题。

## 复跑与接入

在本分支安装锁文件依赖后，以下命令可独立复跑。浏览器测试由仓库已有 Playwright 配置托管 docs 服务；确认其固定端口空闲，或按该配置的 `PW_REUSE_SERVER` 机制复用当前工作树的服务。本轮为了避开其他工作树的服务，使用忽略目录中的配置连到本工作树专用 docs 服务。

```sh
pnpm run typecheck
pnpm exec vitest run tests/website-navigation.test.tsx tests/navbar-api.test.tsx tests/footer.test.tsx
pnpm exec playwright test -c playwright.config.ts tests/e2e/website-shell.spec.ts
pnpm run test:package
pnpm run docs:llm:check
pnpm run docs:readme:screenshots:check
```

接入时先选 WebsiteShell 配方，再替换导航数据与正文；用 `onOpenChange` 协调顶栏 `forceVisible`，为返回位置提供可聚焦的 `focusTarget`，最后接入搜索、真实语言路由和页脚信息。布局与交互可直接复用；品牌资产和业务服务需由站点配置。
