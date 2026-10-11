# Changelog

[English version → CHANGELOG.en.md](./CHANGELOG.en.md)

本项目所有值得注意的变更都记录在本文件中。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循语义化版本。

## [Unreleased]

### Changed

- **npm 发布准备**：在独立 TypeScript 和浏览器消费项目中验证真实 pnpm 压缩包，构建前清除旧库产物，并准备无需 GitHub Release、手动发布 `0.1.0-beta.0` 到 `beta` 的工作流。保留后续正式 Release 发布及首个包临时 Token 后续切换 OIDC；补齐双语发布指南和 Material Symbols 键帽字体许可登记。准备阶段尚未发布 npm 版本。

- **非线性动效曲线**：组件库、官网、styleguide 与 Hitu 插画统一使用快速响应、柔和收尾或平滑起止的曲线；三组贝塞尔参数由本项目选择，不是 Apple 官方数值，也不引入弹簧引擎。保留 150 / 250 / 350 / 500ms 四档时长，CSS 是参数唯一来源，JS 默认表由 token 生成器派生；进入和已有独立退出阶段分别消费语义曲线。持续旋转的加载器仍匀速，原生手势保持跟手，数据几何插值不变。
- **Motion 与 Hitu 曲线契约**：`useMotionTransition` 四档统一读取 `--ease-snap`，有效的局部非线性覆盖继续生效；线性或恒等贝塞尔配置即时完成。Hitu 省略 `HituFrame.cubic` 时由原先的线性插值改为 `[0.42, 0, 0.58, 1]`，显式非线性配置仍可使用；共享时间轴求解保留端点和稀疏变换继承。
- **轮播与程序滚动迁移**：`CarouselVariant` 收敛为 `"slide" | "fade" | "fade-scale"`，删除 `fade-linear`，迁移为 `fade`；全部效果使用快速收尾曲线。Scroller 方向按钮、四类图表图例和官网锚点使用 state 时长与平滑起止曲线，同一容器的新请求从当前位置重新开始，用户输入取消在途动画。AreaChart、BarChart、LineChart、ComboChart 的 Tooltip 位移使用反馈时长与快速收尾曲线；减少动画即时定位，图例状态按实际滚动更新。
- **双语动效规范与示例**：新增[非线性动效规范](./docs/design/apple-motion-curves.md)，记录曲线来源、非线性治理例外与迁移步骤；同步 Motion / Hitu、Carousel、Scroller、图表的 API、指南和真实示例。历史 Hitu 接入审计保留原样。

### Fixed

- **npm 11 压缩包发布**：从 runner 临时目录发布已验证压缩包，避免仓库限定 pnpm 的 `devEngines` 检查阻止 npm 发布；项目包管理器约束保持不变，发布时不重新构建。

- **README 截图字体一致性**：截图使用随包提供的字体子集，避免本机已安装的完整字体改变排版，使 Windows CI 与维护者截图可直接比较；组件库的字体优先级和像素容差保持不变。

- **跨平台 CI 一致性**：仓库任务路径在所有平台拒绝 Windows、UNC 与 POSIX 绝对路径，并保留相对路径和真实路径边界检查。LLM 语料从真实 HTML 中保留 MiddleTruncate 的完整原值，排除图表随悬停变化的 Tooltip；演示代码、图例、标题和 API 保持完整，避免运行时测量或交互状态影响生成结果。

- **README 生产截图稳定性**：每次捕获从当前真实 styleguide 源码创建独立临时生产构建，再通过 preview 生成截图，避免截图就绪依赖开发服务按需转译。生成、只读检查及 pre-push 门禁共用此路径；构建或启动失败阻止捕获与推送，临时产物清理且不覆盖组件库发布输出。保留导航动态发现、每页双主题、1440×900、减少动画偏好与原有严格像素比较规则。

- **Select 动态减少动画退出**：退出期间开启减少动画时，保留 CSS 动画名称并用现有全局 `0.01ms` 时长完成，让 Radix Presence 正常卸载内容、释放滚动锁并保留焦点流程，没有可见动效；修复移除动画名称后内容和滚动锁残留的问题。
- **App Shell 移动端锚点**：示例阻止菜单区块锚点的默认跳转，保持文档 hash 路由，并在局部容器中执行统一曲线的滚动；HamburgerMenu / ExpandPanel 归还焦点时使用 `preventScroll`，保留外层容器位置。

- **统一验证的生产构建环境**：测试关联发现结束后恢复工具链临时修改的环境变量，避免 `NODE_ENV=development` 泄漏到后续库构建，导致发布入口包含生产 React 无法执行的 `jsxDEV`；保留原始环境、完整验证范围和 hydration 断言。

- **中性遮罩与 Glass 控件**：Hybrid 与 Glass 的弹窗、抽屉遮罩统一采用轻微中性颜色、背景模糊与适度降低饱和度，减少历史洗淡与暗化造成的明暗差异；新增共享透明度与饱和度 token，保留旧透明度名称的兼容别名。Glass 的次要 Button、ButtonLink 和卡片式 Radio 选项使用透光填充、窄高光、柔和羽化、底部暗边与中性轮廓；功能层也补充底部暗边。这些静态照明提示采用预计算的 Schlick 数值作项目校准，不模拟真实场景的反射或折射。有填充的功能层内部使用独立控件三分之一的填充，避免叠加成近乎实色的中心；仅位于遮罩内时保留完整膜厚。次要按钮在材质切换时不再对背景模糊做插值过渡；独立控件轻微模糊，嵌套于功能层时不重复采样；主要操作、状态色、输入区域和单选指示器保持原有语义，选中轮廓与键盘焦点提示保持清晰，Solid 的默认填充、描边和阴影保持不变。小型状态与数量控件保留清晰的语义前景与必要的局部填充，并在摄影背景的功能层中通过真实 Badge 示例说明。

- **材质结构线**：Hybrid 与 Glass 浮层及导航内的默认分隔线和控件已有边框按所在配色派生中性透光颜色，避免与表面同色或反向发白；独立强度 token 支持统一调整，并保留 Solid、自定义颜色和无障碍回退。

- **Radio 焦点指示**：焦点圈仅在 `:focus-visible` 时显示，鼠标或触摸选中后保留圆点，不额外显示蓝圈；方向键与 Tab 导航仍有清晰的焦点提示。

- **材质页与单选焦点**：全局外观统一为 Solid / Hybrid / Glass，接口值使用 `solid` / `hybrid` / `glass`。Radio 标签点击保持当前滚动位置，保留原生选择和键盘行为；材质页接入共享块间距与照片小字署名。Mask 场景共用圆角裁切，Hybrid / Glass 的功能层改用透光细边和柔和投影，带箭头的提示保持稳定填充。

- **文档导航分类**：将 LazyLoad 与 Prefetch 从“组件 / 异步加载”移至 API 下方独立的“网络与异步”栏目；侧栏、移动导航、搜索及上下页顺序同步调整，机器可读索引归类为 `network`，现有页面链接保持兼容。

- **API 表格扩展标记**：全表均为框架扩展时改为表格前的一次说明，移除逐行重复标签；官方与扩展 API 混合的表格保留逐行标记，必填提示保持可见。

- **文档首屏与直接访问**：按页面、按组件加载演示及配对源码，加载演示时先显示标题和说明；隔离文档站与展示页的开发依赖缓存，避免互相替换导致加载失败。移除正文和侧栏重复的顶栏偏移，正文滚动区紧接顶栏下沿；语料生成等待异步页面和演示完成。

- **pre-push 截图误阻塞**：检查与漂移更新复用同一份浏览器截图，等待视口内图片解码，并以严格像素阈值容许圆角抗锯齿微差；只在受管文件确实产生改动时要求提交。无改动时只读复核，持续不稳定则报告原因，避免“工作区干净却要求提交”的死循环。受影响 refs 必须对应当前 HEAD，执行前检查未提交输入，补齐公共图片资源的截图触发范围。

- **Token 构建证据与 Grid 断点**：Grid 视口查询从四个档位上界 token 构建展开，保留原有视口/容器边界及历史 1280px 工具类；双语文档明确档位与工具类条件差异。圆角回归改为验证真实 Tailwind 输出和发布 CSS 的计算样式，增加包级响应式与容器查询覆盖。

- **Token 消费与生命周期**：Menu / ContextMenu 接入默认 36px 的行高变量，Menu 保留 44px 的触控最小高度；目录修正 Drawer 宽度分组，并从 CSS 定义生成受支持、预留、弃用状态和推荐替代名称。历史形状名与 Tooltip 反转色保留兼容，文档明确其状态及组件实际控制入口。

- **Token 运行时契约**：七个 `--breakpoint-*` 保留为可发现的构建配置，从可写类型和写入/恢复 API 中排除；局部动画演示直接消费所编辑的时长变量，500ms 选择实际作用于预览且不影响外部按钮。默认断点与视觉值保持一致。

- **文档布局与 token 消费**：集中管理文档站外壳宽度和反馈页脚的 480px 断点，复用圆角与有标记列表缩进 token；Menu / ContextMenu 内边距接入 `--uni-popover-padding`（默认 6px）。补齐英文 Feedback 的 12px 圆角说明，修正中文 Avatar 数字尺寸与无障碍建议，并增加双语规格和浏览器回归检查。

- **文档可读性**：精简中英文组件概述、使用指南、基础页面、应用壳层说明和 README；用具体操作替换内部术语，说明 API 必填标记与继承属性类型，并修正非受控模式的回调说明。

- **移动导航与快速点击**: 移除窄屏抽屉内重复且失效的搜索按钮，并为顶栏两端保留对称边距。ExpandPanel 改为可反转的 CSS 过渡；退出期间复用节点、取消旧卸载、隔离触发按钮的外部点击处理，避免快速开关时抽动或重新打开。

- **Input rounded 变体胶囊形态修正（视觉变更）**：`Input` 的 `rounded` 档此前给 prefix/suffix 装饰段都加了 `rounded-full`，两端各自收成一个椭圆 chip，紧邻分隔线的内侧边沿出现弧线。现在装饰段只圆外侧角（prefix `rounded-l-full`、suffix `rounded-r-full`，其余角保持直角），内侧边沿垂直并与分隔线贴合，整体是单个胶囊；`prefixStyling` 为真或假的两种圆角示例结果一致。`tests/input-surface.test.tsx` 与双主题浏览器几何核查（内侧圆角 0px、外侧圆角等于外壳胶囊半径）锁定该契约。
- **顶栏锚定浮层与滚动 owner（视觉变更）**：`ExpandPanel` 在 `side="top"` 且测量了锚元素的形态下（App Shell 顶栏汉堡面板），面板顶边即顶栏底边——此前打开动画让面板整体上移一个自身高度、从容器顶部掉下来掠过顶栏，遮罩又是 `inset-0` 把顶栏一并压暗；现在遮罩顶边与面板进出场都以该边为界，面板由 `clip-path` 从顶边向下展开（顺带裁掉向上扩散的阴影），顶栏保持可见可交互。App Shell 演示页同步把滚动 owner 从整帧改为顶栏之下的正文区，滚动条不再纵贯顶栏右侧；桌面侧栏 sticky 偏移与区块锚点留白随结构一并校正。
- **HIG-AUD-029 可见视口契约（视觉视口）**：新增共享模块 `src/lib/visual-viewport.ts`，统一「读取可见视口边界」与「订阅可见视口变化」（布局视口 `resize` + 捕获阶段 `scroll`，视觉视口 `resize` / `scroll`）。`EditMenu` 的定位改用可见视口边界，并在软键盘弹起、双指缩放等可见视口变化时收起胶囊（与既有「滚动 / 缩放即收起」同一口径）；修复前实测视觉视口变化后胶囊毫无反应、停在旧位置。Quick Actions 的越界校正同步复用该契约，不再各写一套监听。`select`、`combobox`、`drawer`、`bottom-sheet`、`side-panel`、`toast`、`tooltip` 的组件级断点行为仍待逐一核实。
- **Quick Actions 移动端视口避让**：修复 390px 视口下 224px 菜单右侧溢出 31px；以定位包装层为基准校正菜单水平位置，保留定宽、锚定形态及全屏模糊遮罩，双主题 E2E 保护左右边界。
- **HIG-AUD-027 移动端锚定浮层契约校正（视觉变更）**：ContextMenu（含 Quick Actions）、Select 与 MultiSelect 在移动端保留四角圆角和锚定定位；移除 ContextMenu 中并未形成视口全宽的 `max-sm:w-full` 及伪贴底圆角。同步纠正此前将锚定菜单称作“全宽贴底”的计划和审计说明，新增 390/1280 视口、明暗主题下标准浮层的浏览器几何回归。该项完成时，Quick Actions 在 390px 视口仍有 31px 水平溢出；现已由上方“Quick Actions 移动端视口避让”修复闭环。真正的底部面板不是本次组件行为。
- **HIG-AUD-031/032/033/047 浮层材质与错误色对齐（视觉变更）**：① 破坏性／错误文本与 toast success 前景统一走既有语义 token——`activity-view`、`context-menu`、`select`、`destructive-action-modal` 的破坏性文字改用 `text-error-foreground`（`#ee0000` / `red-900` 收敛到双主题 `--error-foreground`：浅色 `#cb2a2f`、深色 `#ff6166`），`toast` success 改用 `text-success-foreground`；raw-color 棘轮账本随之清账 143 → 134。② `dots-menu` 浮层表面由 `bg-background` 改为 `bg-surface`，与 `menu.tsx` 同源（深色主题由纯黑 `#000000` 变为 `#0a0a0a`），并移除显式 `aria-haspopup="true"`（Radix 默认的 `aria-haspopup="menu"` 语义保留）。③ `combobox` 面板阴影改走 `--material-shadow-menu`，与 select / menu 浮层同源，并新增 `data-slot="combobox-content"` 供材质契约核查。④ `menu-bar` 快捷键区新增 `data-slot="menu-bar-shortcut"` 并注明仅展示、不绑定按键；living styleguide 的 MenuBar 示例同步移除未绑定的快捷键键帽。公开 API 与组件导出不变。
- **EditMenu 选区操作列统一横向**：编辑区域选中文字后，触屏、鼠标和键盘均显示横向胶囊工具条（`role="toolbar"`、左右方向键及 Home/End），与右键唤出的竖向 ContextMenu 区分；保留触摸生成鼠标事件防闪烁、选区锚定与视口边界保护。双主题浏览器及键盘回归覆盖横向布局。

### Added

- **Motion.dev 动效接入**：固定依赖 `motion@14.0.0`，从包根导出 `MotionProvider`、精简 `motion`、`AnimatePresence` 与 `useMotionTransition`；复用现有四档时序与局部 token，按需加载 DOM 动画能力。减少动画偏好动态变化时完成进行中的动效，保留内容实例。
- **Hitu SVG 插画播放器**：内置固定上游版本的 React 19 适配运行时，导出 `HituPlayer`、相关类型及 `HituBox` / `HituFile` 资源；支持关键帧、播放、暂停、定位与循环，默认不播放、不循环。减少动画时展示初始帧，离屏和页面隐藏时暂停，场景切换及卸载清理 RAF，并保留上游 MIT 许可与第三方说明。
- **动效与插画文档试点**：新增双语 API、指南和真实示例，通过 `EmptyState.icon` 组合插画；介绍页在进入视口时按需加载并播放一次，提供播放、暂停与重播控制。Living styleguide 新增“动效与插画”导航页，纳入双主题 README 截图发现流程。
- **Toggle 圆钮拉伸动效**：白色圆钮在状态切换时沿水平方向先拉宽再收回，保持高度，拉伸幅度不超过原宽的 25%，结束时恢复原有圆形与端点位置；位移与拉伸复用 `--uni-motion-state`（默认 250ms）与 `--ease-snap` 非线性曲线。受控与非受控模式均生效，快速反向切换接续当前可见位置与宽度；首次显示和减少动画时直接定位，轨道颜色保留原有过渡。公开 props、尺寸与原生输入行为保持兼容，双语指南同步说明。

- **导航选中条几何调整**：侧栏与折叠菜单共用的蓝色指示条由 2px 加宽至 3px，静止高度保持 14px；距选中项左缘 6px，在 14px 前导留白内均衡排列，并在指针与触控行中垂直居中。原有非线性滑动与拉伸继续生效。

- **全局材质外观与 Mask 规范**：`ThemeProvider` 新增 `texture`、`defaultTexture` 与 `onTextureChange`，`useTheme` 新增 `texture`、`resolvedTexture` 与 `setTexture`，并导出 `TexturePreference`、`ThemeProviderProps`。默认保留 Solid，可全局切换 Hybrid 或 Glass；导航、功能浮层及 Portal／SubFrame 同步生效，正文与内部控件保持清晰。材质独立于明暗主题、UI 配色和代码主题，非受控偏好独立保存；不支持背景模糊／颜色混合、强制颜色或减少透明度时回退 Solid。新增 `--material-texture-*` 变量、`material-mask` 与 `material-mask-scrim` 工具类；状态色 Tooltip／Toast 保持不透明，避免嵌套重复采样。材质规范页、框架 API 与中英示例同步说明接口、兼容性及渲染边界。

- **选中指示条滑动与拉伸**：`SidebarNav` 与 `HamburgerMenu` 的主题强调色指示条在同一最基层列表内切换时非线性滑动，沿移动方向先伸长再收回目标高度，保持厚度；有二级分类时以子分类为边界，否则以一级分组为边界。`Tabs` 的 primary 下划线同样在标签行内滑动，先拉长再收回目标标签宽度，保持厚度与原有前景色。滑动与拉伸复用 `--uni-motion-state`（默认 250ms）与 `--ease-snap`；首次显示、跨组切换直接定位，快速切换从当前可见位置与长度继续。减少动画时直接定位，运行期间启用该偏好会取消当前动效；键盘、导航与公开 props 保持兼容，双语指南同步说明。

- **活动项滚动跟踪**：`SidebarNav` 与 `Tabs` 新增可选的 `scrollTracking`（`disabled` / `on-reload` / `always`，默认禁用），并从包入口导出 `ScrollTrackingMode`。载入时或活动项变化时，对齐到滚动容器顶部或水平起始边，首选 16px 留白；若会露出前一条目或标题的文字、图标，按 spacing 尺度缩小为 8px、4px 等，目标受滚动边界限制。复用 250ms 非线性动效，支持 RTL、减少动画与手动中断。SidebarNav 另提供 `scrollTrackingTarget`（默认 `item`）；`category` 定位当前条目所属的二级分类小标题，无二级分类时定位一级标题，包入口导出 `SidebarNavScrollTrackingTarget`。文档侧栏启用 `on-reload` + `category`，双语 API、指南、可交互演示、Show Code 与 living styleguide 同步覆盖。

- **预载与异步加载文档**：新增包根导出的 `createPrefetch`、`Prefetch` 与 `usePrefetchState`，支持操作意图、接近视口、浏览器空闲三种触发，共享并发请求与成功缓存、失败重试、失效与中止，并默认尊重省流量设置。文档导航复用相同资源提前准备目标页及其演示；双语指南、API、可操作示例与 Lazy Load 同列“网络与异步”。

- **全局 Token 文档与读写 API**：新增可搜索的样式源码目录、局部/全局实时编辑器，以及包根导出的读取、批量写入、恢复和 React 订阅 API；区分运行时变量与构建映射，支持主题级联和 SSR，并验证目录生成无漂移。

- **Carousel 切换效果**：新增 `variant`：默认 `slide`、`fade` 淡入淡出、`fade-scale` 淡入淡出加轻微缩放，统一使用非线性快速收尾曲线。所有效果共用现有翻页操作，支持中途反转与减少动画；双语文档和展示页提供可切换演示。

- **数字分页与媒体组件**: 新增 NumberedPagination（页码与省略号）、Carousel（图片、键盘、触摸与方向按钮）、FullPageScroller（滚轮及触摸阈值整屏切换、惯性抑制、全屏演示）与 LazyLoad（接近滚动视口时延迟挂载、尺寸占位）。同步包入口类型、中英文指南、API 表、可运行演示、Show Code 与 living styleguide。

- **HIG-AUD-023/024 公共组件文档与入口对齐**：`SidebarNav`、`Navbar`、`Footer`、`HamburgerMenu` 补齐独立文档页、双语指南、API 与可交互示例；`SidePanel` 及标题、描述、关闭子组件和类型从包根导出并补齐同等文档链。既有 `Phone`/`PhoneScreen`、`SkeletonMask`、`RatingPill` 分别由 Device、Skeleton、Feedback 页显式承接；导出到文档 owner 的双语、API 符号和示例一致性新增门禁。

- **HIG 交互组件族**：新增并从包根导出 `ActivityView`（分享目标、操作列表、取消行与可覆盖的 `sheetProps`）、`EditMenu`（选区驱动的编辑工具条）、`MenuBar`（含菜单、复选项、分隔线与子菜单）、`Toolbar` / `ToolbarGroup` / `ToolbarItem`（三段布局与组级溢出折叠），以及 Context Menu 的 `ContextMenuQuickActionsContent` / `ContextMenuQuickActionsItem` 触屏长按变体；组件元数据、双语指南、可运行示例、API 注册表与 LLM 参考页同步覆盖。
- **布局原语**：新增并从包根导出 `SafeArea` 与 `Stack`，包含 `SafeAreaProps`、`StackProps`、`LayoutSpacing` 与 `SafeAreaEdge` 类型；前者按边应用安全区 inset，后者提供受 token 约束的纵向/横向间距、对齐、换行与响应式方向。
- **组件变体 API**：`ModalContent` 新增 `placement="center" | "top"`（默认 `center`，`top` 为贴顶下落的 sheet 形态）并导出 `ModalContentProps` / `ModalPlacement`；`SplitButton` 新增 `variant="split" | "pulldown"` 与 `expandCorner`；`Tabs` 新增与 primary/secondary 正交的 `compact` 密度；Select 文档新增 pop-up button 用法，并配套补齐双语 API、演示与回归测试。
- **动效时长治理**：基础时长档位收敛为 `--uni-duration-fast/base/slow/slower`（150/250/350/500ms），新增 `--uni-motion-feedback/state/overlay/expansive` 语义别名与 `--uni-loop-standard`（1400ms）；Tailwind 默认 transition 绑定 fast 档，循环动画与裸时长由治理测试和显式 allowlist 纳管。
- **SkeletonMask 骨架遮罩组件**：给一块真实内容指定骨架模板后，`masked` 开关整体切换成骨架屏、`unmask` 切回真实界面。与 `Skeleton` 组合而非条件渲染是刻意选择——`skeleton` 模板**始终挂载**，真实内容在遮罩期间以 `visibility: hidden` 保留原盒子（`inert` + `aria-hidden`，既进不了无障碍树也不会被 Tab 或点击命中），因此切换前后是同一个盒子，不存在宽度跳变。容器承担 `aria-busy` 与 `label` 可访问名称，`liveRegion` 可选开启完成播报（默认关闭，避免同页多遮罩区重复播报）。它是框架扩展（官方 Geist 无对应组件），归档在 Skeleton 文档页共用同一份指南、API 参考与语料；从包根导出 `SkeletonMask` 与 `SkeletonMaskProps`，两个用法示例（Usage / Controlled toggle）也作为 Skeleton 页的示例区块渲染。

- **Table 带外框变体演示**：新增 `Outlined table` /「带外框表格」示例，用 `TableRoot frame="outline"` + `colorScheme="bordered"` 展示真正的容器外框。它与 `Row dividers`（只有行间分隔线、不包 `TableRoot`）唯一的区别就是这层外框，两者并排即可看出 `frame` 控制的是什么；此前 `frame` 只作为其它演示的附带属性出现，没有把外框本身当作单一变量的独立演示。

- **ContinuousSurface 合并前修正**：连续裁切增强后移除竞争的背景圆角；以本地 border-box 测量并观察边框尺寸变化，避免父级 transform 导致错误裁切；superellipse 示例使用归一化 SVG 裁切适配响应式磁贴；固定高指数曲线端点，并在特殊路径分支前统一校验采样参数。新增像素、缩放、边框变化与响应式命中回归测试。

- **Shape family 与连续曲率**：`--radius-2xl/3xl/4xl/5xl`（16/20/24/28px）扩展固定 radius scale，新增 `--radius-concentric-inset` / `--radius-circle` / `--radius-capsule` 语义；新增 `src/lib/continuous-corner.ts`（幂函数族连续曲率：`cornerCurvePoints` / `continuousCornerPath` / `superellipsePath` / `useContinuousCorners`，p=2 精确退化为圆弧）与 `ContinuousSurface` 组件，全部从包根导出；双语指南、可运行示例、API 参考与 LLM 页面同步覆盖（86 条路由 × 2 语言 = 172 页）。默认连续曲率指数 3、曲线参数均为 Unitary 团队值，不使用平台品牌命名、不复制平台资源 path；数值归属见 `docs/design/corner-and-typography-tokens.md`。
- **混排排版 token**：新增 `--uni-mixed-script-gap-ui`（0.125em）/ `--uni-mixed-script-gap-prose`（0.25em）混排间距与 `--uni-leading-compact/prose/reading`（1.35/1.55/1.7）长文本行高分层；`text-autospace: normal` 以 `@supports` 渐进增强应用于 `.text-autospace` 与文档正文（`.docs-prose-paragraph` / `.docs-prose-list` 同时升级至 1.55 行高），不支持的浏览器保持原文本不变。
- **Link 独立文档页**：将 `Link` / `LinkProps` 加入包根公开导出，并补齐组件元数据、双语指南、可运行示例、API 参考与双语 LLM 页面；LLM corpus 扩为 85 条路由 × 2 语言 = 170 页。
- **Raw color 治理门禁**：新增 `tests/raw-color-governance.test.ts`（4 条测试）与 `tests/audit/raw-color-allowlist.json`（72 条 2026-09-04 基线存量字面量）双向咬合白名单账本，防止组件源码引入新的硬编码颜色字面量。
- **BottomSheet 与 ErrorBoundary 文档**：补全 `BottomSheetProps`、`ErrorBoundaryProps` 的包根类型导出，并为两个组件新增双语 API 参考、最佳实践、可运行示例与 LLM 参考页面。
- **组件公共导出与 API 参考完善**：包根入口新增导出 `ContextMenuTrigger`、`ContextMenuContent`、`FieldsetFooterActions`、`ErrorText`、`WarningText` 与 `DisabledWall`；组件 API 注册表、双语指南与 LLM 参考同步覆盖这些导出及相关真实属性。
- **双语组件指南注册表**：75 个组件全部具备简体中文（主）与英语（替代）结构化指南（何时使用 / 何时不应使用 / 示例索引 / 无障碍 / 受控行为 / 响应式 / 主题），示例引用真实存在的 demo key；接入组件文档页渲染。
- **LLM 参考语料**：`docs/llm/` 为 84 条文档路由 × 2 语言生成 168 份 Markdown 页面与机器可读索引 `index.json`（含内容哈希）；`docs:llm:generate` / `docs:llm:check` 命令与漂移检查。
- **LLM 语料说明**：新增 `docs/llm/README.md` 与英文替代版本，说明 canonical source、索引结构、生成与零漂移校验流程。
- **版本化 LLM 任务包**：`.agents/registry.json` 注册任务 manifest；安全、Git、文档策略与任务专属提示词按 manifest 顺序组装；统一 `llm` CLI 提供 list/check/dry-run/manual，pre-push 仅负责 Git ref 上下文适配。LLM 无需执行命令即可从 `AGENTS.md` 与 `.agents/README.md` 直接定位提示词路径。
- **MIT 许可证与归属**：英文 `LICENSE`（法律权威）+ 简体中文阅读入口 `LICENSE.zh-CN.md`（非官方、非约束性）；`CREDITS.md` / `CREDITS.en.md` 与 `THIRD_PARTY_NOTICES.md` / `THIRD_PARTY_NOTICES.en.md` 双语归属与第三方声明；npm 发布清单纳入许可证与第三方声明。
- **双语 README**：`README.md`（简体中文）与 `README.en.md`（英语）提供安装、最小用例、文档入口和 living styleguide 双主题截图；LLM 仅通过顶部的 `AGENTS.md` 链接进入专用文档。
- **README 示例图片生成器**：`docs:readme:screenshots` 从 living styleguide 顶部导航自动发现页面，并以固定 1440×900 视口为每页生成 light / dark 截图；`docs:readme:screenshots:check` 提供 formatter-stable 漂移检查。
- **文档合同测试**：组件文档完整性、双语 parity、LLM 语料导出、许可证、README/AGENTS、changelog 合同。
- 字体度量探针 `src/lib/font-metrics.ts`（自注册 + `useFontMetrics` hook）与档位契约测试。
- 导航壳层组件族（框架扩展）：Navbar / SidebarNav / Footer / HamburgerMenu / ExpandPanel / BottomSheet，统一 500ms cubic-bezier(0.32,0.72,0,1) 动画与 motion-reduce 降级，受控/非受控双模。
- 壳层断点例外：侧栏断点保持 lg(1024px)（有意偏离官方 xl(1200px)，服务 VS Code 内嵌浏览器场景）。
- Button 按压态（Apple HIG 要求）与默认最小宽度（min-w = 高度 × 2.2）；Progress label/labelPosition 8 方位标签与 300ms 过渡。
- `docs/site/src/__tests__/parity-regression.test.ts`：parity 修复的源码断言回归测试。
- **Show Code 单源迁移（breaking）**：用物理 `.example.tsx` 文件替代逐条维护的 `demo-code*.ts` 字符串真源；`docs/site/src/examples/` 下 374 个可运行示例组件通过 `?example-source` 虚拟模块同时为实时渲染与展示源码提供唯一真源，并注册到 `EXAMPLE_REGISTRY`；同步删除 29 个 demo-code 分片。该变更改变文档示例的模块形式，依赖旧 `DEMO_CODE` 分片的下游引用需要迁移。
- **文档演示库存保留（不重复渲染）**：示例注册表新增 `renderInSection` 元数据：20 条 primary-only 记录保留物理 `.example.tsx` 源码与 Show Code 可见性，但不再作为重复区块渲染（迁移曾引入 7 个组件的重复未本地化演示）；补回缺失的 Video default 示例，修复该路由 live demo 不可见与 LLM 文档爬取超时。
- **16 px 文档节奏**：文档页中的 live demo、额外 demo 区与 API 参考区块统一通过 `DocsBlock` 作为 16 px 节奏 owner，消除零散的 `mt-5/mt-6/mt-8/mt-10`。
- **命令搜索双语键盘流**：Command Menu 支持中英文关键词搜索，中文 UI 下仍可用英文关键词检索；新增上下键 + Enter 键盘选择、无结果空态与 Esc 关闭。
- **组件几何验收 E2E**：新增 SplitButton minor 方形等高贴缝、StatusDot 五态色可分辨、StepPoint 外圈 16/内点 6 居中、Textarea 80/100/120 高度、Toast action 32 px 垂直居中等 Playwright 几何验收；随后扩充为尺寸矩阵（32/36/40）、深色主题状态点、Toast 48 px 最小高度与 420 px 最大宽度、16 px 节奏三点实测、Table 双 frame 圆角 owner 与列分隔线正交性，以及英文 UI 中文关键词命令搜索。
- **调色盘治理**：将 Vercel Geist Colors 声明为唯一调色板来源；浅色主题 red-400/amber-400 对齐官方快照；新增 color-palette-governance 测试对双主题 92 色阶与 Geist 快照逐字节一致，并锁定基础色阶白名单。
- **Table 扩展 API**：API 注册表新增 `TableRoot` 的 `frame` 与 `Table` 的 `columnDividers` 属性；`frame="none"` 时 `TableRoot` 仍保留 8 px 圆角 owner；示例补充无框与列分隔线展示。

### Changed

- **脚本并发执行**：`build`、测试、类型检查、lint、token 与文档生成/校验等包脚本在同一 checkout 内共用跨进程锁；并发调用会等待前一个任务完成，再以各自的参数和退出码执行，不同 checkout 互不阻塞。直接运行截图或 LLM 语料生成脚本时也会加锁；嵌套脚本复用已验证的锁。pre-push 检查链与手动或 pre-push 文档 Agent 执行各有独立锁，文档契约校验改为通过受保护的 `test` 包脚本运行。

- **主题与弹层交互修正**：修复暗色主题 token 被后续浅色块静默覆盖的问题并合并主题声明；Combobox 弹层迁移到 Radix Popover，获得碰撞翻转与视口边界避让；BottomSheet 拖拽仅从指示条启动，内容区按钮恢复点击，同时拖拽方向与面板高度跟手（下拉变矮、上拉展开）。
- **排版与控件几何收敛**：修正 Link 与正文基线、Input prefix/suffix 的 16px 图标尺寸、KeyboardInput 修饰符图标的字母墨迹高度与等宽排版、Phone 状态栏同轴/时间冒号/iOS 字号、ProjectBanner CTA 的基态与 hover 层级、Modal 标题/描述/页脚几何，以及文档 lead 与正文的行高节奏；Feedback 评分胶囊统一 17px 水平节奏并校准中文字形墨迹垂直中心。
- **文档命令面板打开语义**：搜索入口不再因输入框获得焦点自动打开，只响应明确的点击/键盘触发；关闭命令面板后不会因焦点归还而立即重开。
- **类型检查、CI 与文档任务执行**：`typecheck` 改为真实执行 `tsc -b` 并纳入 tests tsconfig，新增最小 PR CI 与 nightly E2E；docs-update runner 使用固定 Codex CLI 模板，Windows 下解析原生可执行文件以避免 Node `spawn .cmd` 的 `EINVAL`，最长执行时间与 schema 上限统一为 60 分钟。
- **`BreadcrumbProps` 改为判别联合（类型变更）**：`type="text"`（默认）继续继承 `<nav>` 属性，`type="menu"` 改为继承 `<div>` 属性。此前 `type="menu"` 会同时接受 `<nav>` 与 `<div>` 两套属性，实际渲染的 `<div>` 会收到非法属性并冲刷外层传入的 `role` / `aria-*`；现在两种变体各自只暴露真实落地的属性。传 `type="menu"` 且依赖 `<nav>` 属性的调用方需要改用 `<div>` 属性或去掉多余属性。
- **Feedback 交互与公开 API**：默认变体改为由 32px 次级按钮触发的 340px 锚定 Popover，`type="inline"` 改为 274×48 评分胶囊并在原位展开至 336px；评分键盘导航、`dryRun` / `onSubmit` 提交语义与蓝色评分状态同步实际实现，独立 `RatingPill` 保留本地四色扩展。
- **Feedback 主题（topic）契约补齐（API 变更）**：此前主题选择器只存在于内部 state，`onSubmit` 拿不到所选主题——只有默认 Popover 变体渲染该选择器，而唯一带 Select 的官方演示是 `dryRun`，因此没有任何路径能观测到 topic。现在 `onSubmit` 增加第 4 个参数 `topic?: string`；新增 `topics`（传入非空数组即渲染选择器，无需 `showTopics`）、`topic` / `defaultTopic` / `onTopicChange` 受控与非受控主题，以及 `includeTopicInMetadata`（默认 `false`，保持 `metadata` 与调用方传入内容逐字节一致）。Inline 变体按设计不渲染主题选择器，传入 `showTopics` 或 `topics` 时会被忽略；主题清单常量 `FEEDBACK_TOPICS` 只在 `feedback` 模块内导出，包根公开面仍只转发 `Feedback`，因此消费者继续通过 `topics` / `showTopics` 使用官方主题清单。依赖「topic 自动写入 metadata」的调用方需改用第 4 参或显式打开 `includeTopicInMetadata`。
- **平台特化链接图标位置**：GitHub、GitLab、Gitee、Codeberg、Bitbucket、Forgejo 与 SourceHut 链接默认把品牌图标放在文案左侧，并继续省略冗余的 ExternalLink 指示符；普通 HTTP(S) 外链仍在文案右侧显示通用指示符，显式 `iconSide` 始终优先。
- **`LoadMoreButton` 颜色语义化**：将 `src/components/ui/load-more-button.tsx` 中 12 处硬编码灰色 raw literal（`#f2f2f2` / `#8f8f8f` / `#1a1a1a` 等，含 6 个 `dark:` 变体）迁移为 2 个主题感知语义 token（`gray-100` 5 处、`gray-700` 3 处），同时移除 6 个 `dark:` 变体；双主题下渲染结果视觉等价。
- **包根公开面收敛（breaking）**：`ExpandPanel`、`Grabber`、`PhoneStatusBar` 与 `PhoneSafariChrome` 不再从包根导出，继续作为 HamburgerMenu、BottomSheet 与 Device 的内部实现；补齐 Navbar、SidebarNav、Footer 与 RatingPill 的公开 Props/数据类型导出，并移除未进入组件注册表的死 API 数据。
- **Device 成为规范设备外框文档入口**：原 Phone 页面迁移为支持 iPhone、Pixel、Galaxy 与 iPad 型号的 Device 页面；旧 `/components/phone` URL 保留兼容映射，运行时 `Phone` 别名继续用于迁移现有 iPhone 17 调用。
- **字体栈策略**：@font-face 全部改名 Subset 后缀，系统优先字体栈（已装 OPPO Sans / HarmonyOS Sans 零下载命中系统字体，未装回退自托管分级子集）；根元素 `data-font-tier="oppo|hmos|system"` 手动档位声明；档位切换防抖 120ms 重测（幂等）。
- **Table 默认对齐（breaking）**：`TableHead` / `TableCell` 删除隐式 `last:text-right`，默认全左对齐与官方 Geist 一致；依赖旧隐式右对齐的数值列需显式 `align="right"` 或 `text-right`。
- 发布边界：`files` 增加 `LICENSE`、`LICENSE.zh-CN.md` 与双语第三方声明；字体子集随 `dist` 分发（许可状态见 THIRD_PARTY_NOTICES）。
- 发布包改为外置 npm 依赖、不生成 sourcemap，并清理残留 demo/app 产物；全部 15 个处理后字体子集继续随包提供，Maple OFL-1.1 原文随包，README 明示 OPPO Sans / HarmonyOS Sans 再分发证据风险。
- LLM 生成器每次选择可用端口并启动独占 preview，不再复用可能过期的服务；生成 Markdown 保持 formatter 稳定。
- `AGENTS.md` 收敛为可移植的仓库级 LLM 入口，链接 canonical 源码、Geist 文档与 `docs/llm/index.json`，移除个人环境、签名身份和特定 Agent 工具绑定。
- 版本化 agent 任务包硬迁移到顶层 `.agents/`，不保留旧目录兼容入口；runner、schema、prompt discovery、pre-push 影响路径、合同测试与 Git 忽略/换行策略同步使用新路径。
- pre-push 将 README 截图漂移检查与既有文档 / LLM 更新 gate 合并为单一编排器：真实变更路径是唯一放行判定依据，Angular / Conventional Commit 的 type 与 scope 仅作为诊断信号，不能覆盖路径判断；截图漂移时自动生成受管文件并中止 push，所有阻断都会说明未完成的操作和恢复步骤，等待人工复核、提交并重推。
- Living styleguide 示例改用当前组件 API 与真实动作语义；`docs-update` 任务现在可在受限范围内同步 `src/App.tsx`、`src/examples/**` 和受管截图，并将截图零漂移纳入确定性校验。
- **AI 文档 pre-push 传输方式**：超过 8000 字符的 docs-update prompt 现在通过 `codex exec` 的 stdin 通道传输，修复 Windows 首次 push 时 `CreateProcess` 命令行超限导致的 `ENAMETOOLONG`。
- **LLM 任务运行器改用 Pi**：`.agents/runner.config.json` 的 `agent` 由 Codex（`codex exec`）切换为 Pi Coding Agent（`pi --print`），配置字段相应改为 `piCli` / `provider` / `model` / `thinking` / `ephemeral`；`scripts/lib/llm-task-runner.mjs` 生成固定的 `pi --print` 参数模板并拒绝替换可执行文件，默认执行模型为 `deepseek/deepseek-flash`；移除仅适用于 Codex 的 `sandbox` / `approvalMode` 配置项及其 `--ephemeral` / `--approve-for-me` / `-C` 参数形态。固定模板附加 `--no-extensions`：扩展提供的 MCP server 会在答题结束后继续占用 stdio，导致 `pi --print` 不退出、pre-push 卡死（实测默认模式 90s 未退出，附加后 3s 正常退出）。

### Fixed

- **BottomSheet / ResponsiveDrawer 指示条键盘契约**：内部 Grabber 的 `role="slider"` 现显式声明垂直方向，并支持 `ArrowUp` / `ArrowRight` 递增、`ArrowDown` / `ArrowLeft` 递减、`Home` / `End` 跳至首尾档位；方向键在边界钳制、不循环，键盘调档继续遵循 BottomSheet 的受控/非受控 `detent` 契约并通过 `onDetentChange` 上报。点击、Enter / Space 的既有循环切档与指针拖拽保持不变。
- **SplitButton 两行菜单条目与主按钮内边距修正（视觉变更）**：① `SplitButtonMenuItem` 此前把 `MenuItem` 的固定 `h-9` 原样套在两行条目（`title` + `description`）上，两行内容只剩约 1px 呼吸、相邻条目彼此贴死；现改为自适应高度（`h-auto min-h-9 py-1.5`）并补 `gap-0.5` 行间距，`icon`（`MenuItem` prefix 槽）加 `self-start` 与 1px 顶移对齐首行标题——`items-center` 会把图标吊在两行中间。② `SplitButton` 主按钮补 `min-w-0`：`Button` 的 `min-w`（高度 × 2.2）只针对独立按钮，split 两半保留后会撑开短文案，使文字右侧到 chevron 的间距远大于左侧内边距（官方两半均为内容宽 + 10px，无 min-width）。③ 文档站组件指南卡片的示例描述收回 `text-label-14`（≈15px），与同卡子标题同档；`.docs-prose-paragraph` 默认 17px 正文，此前描述比所属子标题还大，层级倒挂。公开 API 与交互行为不变；`Title with Icon` 示例改为通过官方 `icon` 属性（prefix 槽）传图标，与 `Icon` 示例一致，双语指南同步说明该用法。
- **Snippet 反色子树切换到相反 scheme（视觉变更）**：`dark` 此前只是给容器叠加一层固定深色皮肤，而主题级 token（`--foreground` / `--gray-alpha-*`）只随页面 scheme 解析、不会跟着容器翻转——深色主题下默认类型文字取 `text-foreground` 得到浅色字，落在反色的浅底（`#ffffff`）上几乎不可见，复制按钮的 hover 底色也仍是深色页的 `gray-alpha-200`。现在 `dark` 把整棵子树切到相反 scheme 的 color scheme：浅色页反色为深底 `#0a0a0a` + 浅字 `#f2f2f2`，深色页反色为浅底 `#ffffff` + 深字 `#1a1a1a`（原 `#171717` 对齐官方实测值修正为 `#1a1a1a`）；`type="default"` 的代码文字与复制按钮改为 `text-inherit` 走容器色链，按钮 hover 改用相反 scheme 的 `gray-alpha-200` 硬编码（浅色页 `#ffffff17` / 深色页 `#00000014`）。已知边界：`type="success|error|warning"` 的语义色 token 不随反色翻转，与官方一致；公开 API 与交互行为不变。双语指南中「反色变体专门针对暗色背景」的表述已同步改为相反 scheme 切换的准确描述。
- **Pill 文字垂直光学居中（视觉变更）**：`items-center` 只能居中行盒，而本项目字体栈解析到 OPPO Sans 时字形墨迹在行盒内整体偏下（fontBoundingBox 16/4，上下留白约 4:1），实测各标签墨迹中心比药丸中心低 0.5~2.5px（拉丁 x-height 词最重）。原先的 `py-1`（上下各 4px）改为 `pt-[2.5px] pb-[5.5px]`，总高与 `py-1` 相同，整体上提 1.5px 作光学补偿，实测最大偏差收敛到 ≤1px；`text-box: trim-both` 在本项目目标浏览器不生效，已实测排除。此改动只调整内边距，Pill 的公开 API、变体语义与交互行为不变。
- **裁剪表面阴影改用 `surface-shadow`（视觉变更）**：被 `clip-path` 裁切的表面无法用 `box-shadow` 正确投影——`clip-path` 会裁掉元素自身阴影，把 `box-shadow` 挪到外层包装又会画出包装自己的圆角矩形盒，形状一旦不同（超椭圆）阴影就与本体解耦、露出矩形底片。新增 `@utility surface-shadow`（两层 `filter: drop-shadow()`，由子元素渲染后的实际 alpha 生成、天然贴合裁切轮廓），必须挂在外层包装上——被裁切的同一元素加 `filter` 会被 `clip-path` 一并裁掉。`drop-shadow()` 语法为 `<length>{2,3}`、没有 spread 参数，照抄 `box-shadow` 的 `0 8px 16px -4px` 会让整条 `filter` 被解析器丢弃（lightningcss 不报错，只有浏览器拒绝），因此无法还原 `material-*` 靠 spread 画的 1px hairline 外圈，该取舍已写入注释。组件注释、角落 token 设计文档、`ContinuousSurface` 示例与双语指南同步更新，并新增 CSS 契约测试与真实浏览器断言。
- **Grid 辅助线与外框像素修正（视觉变更）**：以 `#/grid` 页面现场取证逐项修正。① 辅助线颜色由实色 `gray-400` 改为 alpha token `gray-alpha-400`（对齐官方实测 `rgba(0,0,0,.08)` / `rgba(255,255,255,.14)`），线色随底色自适应，`.dark` 覆盖随之删除；Table 表头线、`bordered` 行间线与页脚线一并统一到同一 token（此前 `gray-400` 在深浅两主题下都与该发丝线不同源）。② `.gridSystem::before` 的四边外框补 `right: var(--guide-width)`：`--width` 已把网格收窄 1px，右边框不跟着收就落在网格右侧 1px 处，使最末列线上的十字整体偏左 1px。③ 删除 `[data-grid]` 上重复的 `border-bottom`——它与外框下边同处一行，alpha 叠加后底边约 15%，而其它三边是 8%（旧实色叠加后色值不变，所以这个重复曾经看不出来）。④ 虚线规则提升权重为 `.guide.dashedGuide`：`.guide` 的 `border` 简写会重置 `border-image` 且书写顺序更靠后，浅色主题下内部辅助线此前被实色覆盖；同时为 `.crossLine` 补虚线规则，虚线十字不再恒为实线。
- **文档壳层两处几何修正**：① 页脚 feedback 列高度回到 48px——`FeedbackPanel` 的 section 是 `inline-flex`，放在块级容器里会产生行盒，父容器高度变成内容高度 + 字体降部空间（实测 54px），现给中间列加 `flex` 让 section 成为 flex item，行盒消失，反馈列高度等于胶囊实际高度（48px），nav 高度改由 prev/next 决定（54→51），三列垂直中心仍对齐；补 E2E 断言锁定该高度。②「返回组件」链接的图标与文本改为按字形居中——图标中心与文本行盒中心本就 0.00px 对齐，但本项目字体栈下 CJK 字形留白几乎全在上方（实测 ascent 13 / descent 2），几何居中会让图标视觉上偏高；现把图标与文本放进同一个 `inline-flex` 盒子共享行盒基准，并补 `whitespace-nowrap` 防止窄容器里 CJK 逐字换行，新增几何契约测试。
- **`superellipsePath` 轴端点精度与示例宽高比**：两处修正。① 轴端点判定此前用 `Number.isInteger(index * 4 / steps)`，依赖浮点精确性——`samples=96` 时第 24 个采样点的商是 `0.9999999999999999` 而非 `1`，判定失败，本该精确落在 `(a, b)` 的端点被 `Math.cos(π/2)≈6.1e-17` 取代，指数 `2/n` 放大后端点坐标出现可测量偏移；改为取模判断（`index % (steps / 4) === 0`），`samples=8/12/24/48/96` 不再受影响。② `ContinuousSurface` 示例的 superellipse 磁贴由 `aspect-[4/3]` 改为 `aspect-square`：该函数对 `|x/a|^n + |y/b|^n = 1` 按**角度**均匀采样，非方形时点的分布会被长宽比拉伸，整条曲线变形；文档原本就写明「完整 superellipse 只用于近方形表面」，示例改后与该约定一致。新增 5 条参数化端点精度回归测试。
- **Skeleton 加载动画节奏（视觉变更）**：从 Tailwind 默认的 `animate-pulse`（2s 整块明暗呼吸）改为 **1.4s 流光带扫过**（新增 `--animate-skeleton-shimmer` + `@keyframes skeleton-shimmer`，-100%→100% 用元素自身宽度度量，因此任意宽度的骨架都恰好一个周期扫完一遍；前 45% 扫过、后 55% 保持纯净底色，留出可辨识的重复节奏而非持续闪光）。周期与同族 LoadingDots 的 blink 对齐，避免同屏两种加载节奏打架；流光带的水平位移比单纯明暗变化更明确地传达「数据正在流入这块区域」。渐变本体放在 `aria-hidden` 的装饰子层而不是 `::after`，使调用方用 `className` 覆盖外形时无需推导伪元素尺寸。Apple HIG「Loading」章节未规定帧率/时长，其要求是「不要空白等待、尽早显示占位内容并让用户看出正在进行」，本次改动按该语义收敛；`motion-reduce` 仍完全停用动画。
- **Tabs 演示「未禁用标签页无响应」（修复）**：`Disable specific tabs`、`With icons`、`Secondary`、`Disabled` 四个演示把 `selected` 写成常量、`setSelected` 置为空函数，点击未禁用的 tab 只会移动焦点，选中态永远停在初始值（官方 demo 全部使用 `useState`）。现四个演示都改为 `useState` 受控，`Disable specific tabs` 里禁用的 Mango 仍然不可选。新增回归测试锁住「点击未禁用 tab 会切换选中态」这一契约。
- **Table `Bordered table` 改名（中英双语）**：该演示用的是 `colorScheme="bordered"`，语义是**行间分隔线**，而容器外框由 `TableRoot` 的 `frame` 控制，且它本身没有包 `TableRoot`——旧名（英文 `Bordered table` / 中文「带边框表格」）描述的正是它**没有**的东西。现统一改为 `Row dividers` /「行间分隔线表格」，与 `columnDividers`（列分隔线）和指南用语一致；`colorScheme` 的中文说明同步由「带边框」改为「行间分隔线」。示例文件 `bordered.example.tsx` 重命名为 `row-dividers.example.tsx`，并改用非弃用的 `Table colorScheme="bordered"` 而不是 `TableBody` 上的 `bordered`。
- **Feedback 主题选择器改用 Select 组件（视觉与无障碍一致性）**：默认 Popover 的主题下拉此前是浏览器原生 `<select>`，与仓库其余选择器的材质、圆角、高亮与键盘态不一致；现改为复用包内 `Select` / `SelectItem`（Radix），`aria-label`、`size="small"`、占位文案与主题本地化行为保持不变，选项继续由 `topics` / `showTopics` 驱动，`onSubmit` 第 4 个参数（topic）语义不变。同步把单元测试与 Playwright 用例从原生 `selectOption` / `toHaveValue` 改为真实点击触发器与 portal 选项，`tests/feedback-i18n.test.tsx` 改断言 `[data-slot="select-trigger"]` 的 `aria-label`。
- **Feedback 支持文案与内联收起判定**：表单内的 Markdown 提示此前渲染为 `supported.`（英中两侧 key/value 同形，中文侧退化为「支持。」），现改为 `Markdown supported.` / 「支持 Markdown。」；Inline 胶囊的 `focusout` 在 `relatedTarget` 为 `null` 时不再与「焦点既不在容器内、也不是已知目标」混为一谈，而是延迟一拍复核真实焦点位置，窗口失焦时不再误清评分，真正的焦点外移仍会收起。
- **Feedback Inline 胶囊几何（视觉变更）**：修复展开过程中的圆角突跳——收起态 `rounded-full` 解析为"实际无穷大"半径，浏览器会把每个中间值钳制到 `min(w,h)/2`，约 99% 的过渡进度停留在同一视觉半径上、末段再瞬间跌到 12px；现改用新增的可插值语义 token `--radius-capsule-interpolable`（24px = 48px 收起高度的一半），实测半径从 `24 → 20.06 → 17.57 → 15.78 → 13.48 → 12px` 全程线性。同时修复展开态右侧空档：header 内容此前左对齐堆积，336px 下表情行右侧空出 62~69px，现由 `flex-1` 的 label 吸收余量（表情行贴住右内边距 8px）。收起态宽度改为内容自适应（`w-fit`），**label 不再截断**（中文文案从 274px 截断 8px 变为 282.28px 完整显示），因此收起宽度不再固定为官方 274px，会随语言文案微幅变化；展开态仍为 336px。
- **Feedback 主题演示（新增）**：新增非 `dryRun` 的 `Feedback with topics` 演示，真实提交后把 `onSubmit` 实参渲染成收据（rating / topic / metadata / text），使主题交付路径可被观察到；同步补 Playwright 用例，在真实 Chromium 中断言 topic 经第 4 参交付且不污染 `metadata`，并覆盖窗口失焦不误收起、真实焦点外移仍收起且保留草稿。
- **Feedback Inline 浮动弹窗（几何与动画重构）**：胶囊以「占位层（恒定 48px）+ `absolute bottom-0` 浮动卡片」呈现，向上生长为弹窗但页脚布局完全不动（实测容器 top Δ-197、bottom/父容器高度 Δ0）。展开以**收起胶囊的几何中心为水平原点左右对称扩展**（实测中心偏移 0、左右各 +27px），header 恒为 `w-fit mx-auto` 并居中。宽度从 `w-fit` 改为显式测量值（`ResizeObserver` 测 header 自然宽度）——`fit-content` 与固定值之间无法插值，这是此前收起突兀的根因之一；表单区改为常驻挂载并用 `grid-rows 0fr→1fr` 过渡高度，收起时宽度、高度、圆角按同一条 `cubic-bezier(0.32,0.72,0,1)` 曲线同步还原（实测逐帧 w 319→297→285→282 与 h 184→103→60→48 同帧递减，无跳变）。文档站 Inline 演示改为水平居中（对齐官方 demo），并移除表单 footer 的 `bg-gray-100` 灰带接缝。
- **Feedback 默认 Popover 改为优先向上展开（视觉变更）**：默认变体通常挂在页面底部，向下弹出会被视口底边裁切。现改为 `side="top"` 优先向上展开，配合 `avoidCollisions` 与 16px `collisionPadding`，上方空间不足时仍会自动翻转到下方；宽度、锚点、键盘与关闭行为不变。
- **组件行为审计修复（20 个组件）**：按源码审计结论整改 `src/components/ui` 的交互、无障碍与状态缺陷——**Slider** 恢复把 `onValueChange` 透传给 Radix Root，受控滑块的拖拽与键盘操作重新能把新值交还父组件（此前被显式剥离，仅可选数值输入框会触发），commit 回调改在微任务中合并同一轮的重复调用，避免 StrictMode 下重复上报；**Combobox** 的列表 ID 改用 `React.useId`，同页多实例不再共用 `aria-controls`，面板关闭时上/下/Home/End 先展开列表，Enter 仅在面板打开且存在高亮项时提交；**Note** 的 `disabled` 同时写入 `aria-disabled` 与原生 `inert`，禁用态整块不进入无障碍树；**Breadcrumbs** 的 menu 型条目携带 `href` 时渲染为真实 `<a>`，恢复中键与修饰键新窗口打开；**Calendar** 的输入框/标签/`aria-controls` ID 改为实例唯一，触发按钮由 `type="submit"` 改为 `button`，消除同页多实例串扰与误提交表单；**Avatar** 在图片加载失败时回退到首字母/占位色块并参与 `aria-label`，不再残留破图；**Tooltip** 为不可交互的 children 自动补 `tabIndex=0` 与 focus ring；**ContextCard** 与 **RelativeTimeCard** 的默认触发器补 `tabIndex=0` 进入 Tab 序列；**CommandMenu** 与 **BottomSheet** 关闭后把焦点还给打开前的活动元素，而不是丢到 `document.body`；**MiddleTruncate** 在 `value` 清空时同步清空已渲染片段；**Switch** 非受控组中显式 `defaultValue` 优先于单项 `defaultChecked`；**Choicebox** 移除 `role="group"` 上的 `aria-multiselectable` 与标签上的 `aria-selected` 等非法 ARIA，并把列表容器由 `ul` 改为 `div`；**Browser** 在剪贴板不可用或写入失败时静默返回，不再停留在已复制态；**DestructiveActionModal** 每次打开重置校验输入；**Drawer** 面板最大高度由 `90dvh` 收紧为 `80dvh`（既有 `overscroll-none` 保持不变）；**Skeleton** 动画分支补 `motion-reduce:animate-none`；**SidebarNav** 不再无条件 `preventDefault`，未提供 `onNavigate` 时保留浏览器默认跳转，并放行修饰键与已 `preventDefault` 的点击，同时为导航项补上 `focus-ring` 使键盘聚焦可见；**Footer** 列表 key 由 `href` 改为 `label`，消除重复 `href` 的 React key 冲突。
- **Select 占位符中文本地化**：框架消息目录补上 `"Select…": "请选择…"`（英文侧仍为 `"Select…": "Select…"`），中文界面下的 Select 占位符不再回退为英文；`tests/framework-message-catalog.test.ts` 继续保证两种语言的键集一致。
- **Theme Switcher 文档与实现对齐**：双语组件指南与 LLM 参考语料的 Theme Switcher 条目不再声称依赖 next-themes / GeistProvider / forcedTheme；改为描述框架 `ThemeProvider`（`src/lib/theme.tsx`）、公开 API 仅 `className` / `compact` / `disabled`，标签经框架 i18n（`t()`）本地化。原 `small` 属性已更名为 `compact`，调用方需同步修改。
- **嵌套 Sheet 中的 Combobox 选项交互**：为挂载到 `document.body` 的 Combobox 面板显式恢复指针事件，使 modal Sheet 内的选项可正常点击；同步更新共享变量示例，使选中项从列表中移除并保持搜索输入可继续使用。
- **裸 Node 包入口兼容性**：Prism 语言子模块补齐 `.js` 扩展名；构建时将依赖 CSS 提取到现有 `styles.css`，不再由 ESM/CJS 入口加载 CSS。保持 Device 源码导入、组件 API 和浏览器消费方式不变。新增 `test:package` 并接入 `prepublishOnly`，覆盖裸 Node 导入、SSR、七种语言高亮、四类设备样式与 Chromium 几何回归。

- **可滚动侧栏端距**：文档侧栏导航从固定 `h-full` 改为可随内容增长的 `min-h-full`，并将首尾内容端距统一为 16px；Playwright 在初始位置与滚动到底后分别实测上下间距且要求误差 ≤0.5px。同步审计其他可滚动列表语义组件，其纵向 padding 已保持对称。
- **BottomSheet 动画、圆角与页面稳定性**：补齐 `animate-in/out` 触发器，使底部弹出/收回真正执行 300ms 吸附曲线动画并尊重 `prefers-reduced-motion`；顶部圆角统一使用 overlay token；新增 Playwright 几何门禁，保证开合前后正文位置、页面滚动和视觉视口不发生位移。
- **Textarea 尺寸 padding 计划值**：small/medium/large 的水平/垂直 padding 分别修正为 10/8、12/10、14/12 px，与设计稿一致。
- **StepPoint active inner 稳定 data-slot**：活动状态内点增加 `data-slot="step-dot-active-inner"`，使 E2E 和测试能稳定定位。
- **example-source 插件 fail-closed**：插件现在基于 TypeScript AST 验证 `.example.tsx` 源码，对空文件、语法错误、缺少导出、重复导出或无效查询执行 fail-closed。
- **README workflow 截图重新生成**：基于当前 living styleguide 重新生成 workflow 截图，`docs:readme:screenshots:check` 零漂移。

- **Device chrome 能力告警**：仅在所选型号确实不支持 `statusBar`、`safari` 或 `dynamicIsland` 时输出开发环境警告，避免 iPhone 17 的合法 chrome 配置被误报为已忽略。
- **AI 文档 pre-push 收尾**：runner 以 Codex 主进程 `exit` 作为完成边界并主动关闭管道读取端，避免遗留 helper 持有 stdout/stderr 时一直等待 `close` 到超时。
- **Geist parity 修复（14 项，Playwright 现场验证）**：内联错误文字收敛为 `--error-foreground`；`--link` 修正为官方 `#0072f5`；Entity 描述、JsonView 标点、Textarea/Input 输入文字、Badge pill 文字颜色对齐官方；FileTree label 与 Video 时间戳排版补齐；Drawer/Modal 触发按钮改为默认黑底白字；文档页 H1 响应式字号（移动端 24px / 桌面 40px）。
- 工具修复：AI 文档 runner 拒绝 `--sandbox` 与 `--approve-for-me` 同时配置（两标志互斥，approve-for-me 隐含 workspace-write 沙箱）。
- Hook 安全加固：生产环境固定 Codex 模板与确定性校验，最小环境白名单，抑制 Agent 原始 stderr，并检测既存未跟踪文件及 Git 元数据改写；紧急 skip 返回 Git 可用的成功码并保留高可见警告。
- 文档准确性：修正 Button、Toast、Progress、Feedback 的 API/guide 描述，使其与真实导出和 props 一致；Middle Truncate demo 限制移动端宽度，结构化指南卡片允许长路径换行，消除 320px 视口横向溢出。
- Input 前后缀改为无缝三段式布局，并在禁用态保留 styled affix 的固定修饰语义；Select 现在将显式或可见标签正确关联到触发按钮。示例页同时修复筛选后批量选择、重置动作和表头语义。
