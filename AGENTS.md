# AGENTS.md

## 框架定位

本仓库是 **Geist 样式框架**（geist-style-framework）——基于 **shadcn/ui** 的**可复用前端样式基础设施**，视觉系统以 **Vercel Geist 设计系统**为基准。核心形态：

> 提供 Geist 视觉体系的**样式 token + 基础组件 + 规范快照**，供消费方项目直接复用；本仓库**不包含业务页面**，`src/App.tsx` 仅为 living styleguide 示例。

- **技术栈**：Vite + React + TypeScript + Tailwind CSS + shadcn/ui（如项目实际依赖与默认不符，以 `package.json` 为准）
- **视觉系统**：**Vercel Geist**（视觉权威；shadcn/Radix 仅作为行为与无障碍基础设施，其视觉默认值不是设计权威）
- **主题**：完整支持 light / dark 双主题，两套均映射 Geist 官方 token 角色
- **响应式**：完整覆盖移动端 / 平板 / 桌面 / 超宽屏
- **消费方式**：消费方项目复制 `src/styles/`、`src/components/ui/`、`src/lib/`，或直接以本仓库为样式基础层开发
- **设计输入**：消费方项目通常以设计稿（mind draft 性质）为输入，框架自身以 `docs/geist/` 官方快照为权威

## 设计稿处理规范（Mind Draft）

### 设计稿定位

设计稿是**设计意图参考**，不是像素级还原规范。

mind draft 性质的设计稿可能：布局未最终确定、间距 / 字号 / 颜色不一致、缺少交互状态、包含探索性草稿元素。Agent 的职责是**基于设计意图做改良优化**，而非盲目 1:1 复刻。

### 处理原则

1. **先分析，后动手**：收到设计稿后先拆解为页面 / 区块 / 组件清单，识别核心视觉语言（品牌色、字体气质、圆角、间距节奏、布局意图）。
2. **行使设计判断力**：对设计稿中不一致或缺失之处（间距、字号、颜色、层级），主动统一为一致的设计语言，并在实现说明中记录差异点。
3. **补齐缺失状态**：mind draft 常缺少 hover / active / disabled / empty / error / loading 等交互状态，agent 应合理补齐，符合 shadcn/ui 惯例。
4. **保持核心语言**：改良不得丢失设计稿的核心视觉意图（品牌色、排版气质、整体结构）。
5. **不确定时先确认**：遇到影响面大的歧义（整体布局、关键交互、页面取舍），先向用户确认；小问题自行决策并记录。
6. **拒绝草稿内容**：设计稿中的标注、占位文字、探索性元素不得进入最终实现，除非用户明确要求保留。

### 视觉验证

视觉相关工作优先通过可用的截图与视觉分析工具完成，不要因「看不到图」而回避视觉验证，也不要只靠代码推断视觉结果：

- 浏览器截图：本地开发页面截图、DOM 结构、getComputedStyle 实测。

使用时机：

- 实现后自检 → 浏览器截图 + 视觉分析工具复核双主题、四视口、交互状态；
- 用户反馈「颜色不对 / 对不齐 / 太亮太暗」等视觉问题 → 优先截图定位根因并验证修复，而非猜测。

## 前端实现规范

### 视觉系统：Vercel Geist（设计权威）

本框架的视觉基准是 **Vercel Geist 设计系统**。Geist 拥有视觉主导权；对设计稿的改良优化必须落在 Geist 的语言内，不得退化成泛泛的「干净 SaaS」或偏离的装饰风格。

#### 设计权威与参考源

- 官方 token / 默认值来源：`https://vercel.com/geist/colors`、`https://vercel.com/geist/typography`、`https://vercel.com/geist/materials`（以当轮打开的官方页面为准，不要凭记忆写死色值）
- 交互 / 无障碍 / 状态检查：`https://vercel.com/design/guidelines`
- 字体安装与 Pixel 使用：`https://vercel.com/font`
- **本地权威快照（优先查值）**：`docs/geist/`（2026-08-08 从官方页面实测抓取，含 92 个 `--ds-*` token 的 Dark/Light 双主题完整色板、排版类清单、材质表、72 个组件文档与 Best Practices）。查值顺序：`docs/geist/` 本地快照 → 官方页面复核。官方页面更新后以官方为准。
- `vercel-design.md` / `vercel-design-dark.md`（skill 附带的旧 token 对照表）已过时，仅作历史参考，不得作为查值依据

#### 核心气质

- 中性优先（neutral-first）、高对比、克制、开发者工具风格
- 层级主要由**排版与间距**承担；颜色是功能性的（状态、焦点、选中、链接、语义色、唯一主行动）
- 边框是发丝线结构（hairline），不是装饰；动效短促、微妙、由状态驱动
- 布局整齐有序、信息密度紧凑、易于反复扫读；留白是刻意的
- **禁止**：装饰性渐变光晕 / 玻璃彩虹面板 / 夸张阴影 / 一键蓝紫渐变界面

#### 字体

- HarmonyOS Sans SC：标题、正文、导航、按钮、表单、表格、对话框等全部 UI（Latin 字形 + SC 简体中文）
- Maple Mono：代码、数据、表格数字、命令、快捷键、ID、版本号、commit hash、终端 / 日志输出、内联技术标识；**禁止用 Mono 排散文正文**
- 数字类 UI 优先 `tabular-nums`（Sans 标签 / 正文），代码语境才用 Mono
- HarmonyOS Sans SC 使用**自托管可变字体**（`public/fonts/harmonyos-sans-sc-vf.woff2`，GB2312 常用字子集，单文件覆盖 wght 40–900），通过 `@font-face` 在 `src/styles/index.css` 中引用；生僻字自动回退系统字体
- Maple Mono 通过 npm 包 `@fontsource/maple-mono` 自托管，不依赖本地系统字体安装

#### 颜色（映射 Geist token）

- 表面：`background-100`（主页面 / 卡片表面）、`background-200`（次级表面，用于微妙分隔，不作通用填充）
- 色阶 `100`–`1000`：低段作背景，中段作边框与填充，高段作次级 / 主文本与图标
- 半透明边框 / 分隔线 / 遮罩 / hover 层用 `gray-alpha-*`；文本与不透明填充用实色 `gray-*`
- 强调色（blue / red / amber / green / teal / purple / pink）仅作语义用途：状态、焦点、选中、链接、错误、成功、警告、受支持的唯一主行动；**不装饰性使用**
- 通过 CSS 变量建立语义 token 层（`background` / `foreground` / `muted-foreground` / `border` / `ring` / `link` / `info` / `destructive` / `success` / `warning` 等），映射到上述 Geist 角色；组件只消费语义 token，不硬编码灰值
- 图表与状态密集型视图：颜色不得单独承载含义，需配合标签 / 形状 / 图标 / 位置等冗余线索
- **完整色板（92 个 `--ds-*` token 的 Dark/Light 双主题实测值）见 `docs/geist/foundations/colors.md`，实现时按需查表，禁止凭记忆写值**。关键常量（双主题一致，来自官方实测）：
  - 主行动蓝：`blue-700 = #006efe`（Dark/Light 相同）
  - 破坏性红：`red-700 = #e5484d`（Dark/Light 相同，仅 hover/active 用 red-800）
  - 警告琥珀：`amber-700 = #ffb224`（Dark/Light 相同）
  - 成功绿：`green-700 = #46a758`、`green-800 = #3d8f4f`（Dark/Light 相同）
  - 深色表面：`dark background-100 = #0a0a0a`、`dark background-200 = #000000`
  - 浅色表面：`light background-100 = #ffffff`、`light background-200 = #fafafa`
  - `gray-alpha-*` 在 Dark 下为白色 alpha（`#ffffffxx`），在 Light 下为黑色 alpha（`#000000xx`）

#### 间距 / 圆角 / 材质

- 间距使用 Geist 官方尺度：**4 / 8 / 12 / 16 / 24 / 32 / 40 / 64 / 96px**；组内紧凑、组间适中、区块间大间距（Tailwind v4 默认 4px 倍数即该尺度，直接使用标准 `p-*`/`gap-*`/`space-*`，无需额外 token）
- 圆角体系（官方实测，见 `docs/geist/foundations/materials.md`）：
  - 常规表面（base/small）：**6px**
  - 抬升表面（medium/large）：**12px**
  - 浮层：tooltip **6px**、menu/modal **12px**、fullscreen **16px**
  - **禁止为「柔和感」发明更大圆角**
- 阴影只用于厘清层级（菜单、弹窗、提示），不制造漂浮卡片美学；阴影与锐利边框搭配使用
- 材质级别按组件用途选择（`material-*` 类名对应官方材质层级，详情查 `docs/geist/foundations/materials.md`）：
  - 普通页面卡片：base / small / medium / large 表面材质
  - 浮层：tooltip（唯一带三角柄的浮层，6px 角）/ menu / modal / fullscreen 材质
- **材质使用约束（官方 Best Practices）**：
  - 同一元素禁止堆叠两个材质；子元素需要更高层级时，包一层新的材质容器
  - 材质选择与元素 z-index 层级带对齐（tooltip 类型的表面不得低于 base 卡片）
  - 用最低能满足层级区分的材质；过度抬升是常见视觉噪音来源
  - 材质是装饰性 chrome：语义放在承载 role 的包装元素上（`role="dialog"` 在 modal 上等），不靠阴影表达语义
  - 双主题都要验证材质可读（暗色背景下阴影对比弱于浅色）

#### 排版工具类

- 定义或映射 Geist 排版命名类（完整清单与用法见 `docs/geist/foundations/typography.md`）：
  - `text-heading-*`：72 / 64 / 56 / 48 / 40 / 32 / 24 / 20 / 16 / 14（页面 / 区块标题）
  - `text-button-*`：16 / 14 / 12（仅限按钮内部；12 只用于输入框内的微型按钮）
  - `text-label-*`：20 / 18 / 16 / 14 / 13 / 12 + mono 变体（单行文本，行高充裕以对齐图标；`label-14` 是全系统最常用文本样式）
  - `text-copy-*`：24 / 20 / 18 / 16 / 14 / 13 + mono 变体（多行正文，行高高于 label）
- 原始 `text-sm`、`font-bold`、任意 line-height / letter-spacing 只允许出现在共享工具类 / token 定义内；页面与组件必须消费命名类
- 常见映射：`text-label-14` 菜单 / 标签文本、`text-copy-14` 常规正文、`text-copy-13` 次级 / 密集视图、`text-heading-32` 主要区块标题、`text-button-14` 默认按钮
- 不要整站默认 `text-base`；不要所有标题都加粗（用 medium/semi-bold + 字号 + 间距做层级）
- 修饰符：`<strong>` 嵌套在排版类内自动切换 Subtle / Strong 字重（类名本身不带权重声明）
- mono 变体配对：`label-14-mono` 配更大（>14px）文本，`label-13-mono` 配 `label-14`；数字 / ID / 表格数值用 tabular（等宽数字），代码语境才用 mono

#### 布局规则

- 产品页直接进入可用工作区，不做营销落地页式的巨型 hero
- 页面分区用全宽 band / 无框布局；**卡片只用于重复条目、弹窗、独立面板与真正的工具框，禁止卡片套卡片**
- 「网格」首先是布局手段：CSS grid/flex、列、间距、边框分隔、稳定响应式跨栏；**不要**添加装饰性可见网格背景 / 蓝图线 / 图纸线，除非设计稿明确要求
- 内容 / 产品表面居中于合理 max-width；hover / loading / selected / error 状态不得改变布局尺寸或引起跳动
- 表格与日志：紧凑行高、列对齐清晰、需要时吸顶表头、数字 / ID 用等宽数字
- **Table 视觉约束（官方实测，见 `docs/geist/components/table.md` 顶部渲染参数表）**：
  - 表格外观由**外层容器**承载：1px hairline 边框（gray-alpha-400）+ 8px 圆角 + background-100；**单元格自身不加 border-bottom**
  - 表头：500 14px/20px，无填充背景，仅靠字重区分；正文：400 14px/20px；颜色均为 gray-900
  - 单元格 padding `10px 8px`（垂直 10 水平 8），行高 40px
  - 变体：`striped` 交替行背景、`bordered` 行间 hairline、`interactive` 行 hover 态
  - 空列表渲染 Empty State 而非空 tbody；未知值渲染 `—` 而非 N/A / null / 空串
- 现有应用外壳保持唯一导航 / 页脚模型，不重复同一组链接

#### Foundation Gate（先搭地基，再画屏幕）

实现或改动渲染 UI 前，先完成共享基础层，禁止直接在各屏幕 / 页面文件里堆局部样式：

1. 字体接入（HarmonyOS Sans + Maple Mono 全局可用）
2. 语义颜色 token（light 与 dark 双套，映射 Geist 角色）
3. 排版工具类（`text-heading-*` / `text-button-*` / `text-label-*` / `text-copy-*`）
4. 间距与圆角 token（Geist 尺度）
5. 统一的 focus-visible 焦点环工具类（`focus-ring`，2px 表面色描边 + 4px 主色 ring，官方实测），接入每个可交互基础组件；页面内禁止自定义 outline / ring
6. 共享基础组件（Button / Input / Select / Tabs / Modal / Menu / Toast / Table / Skeleton 等）与状态系统（hover / active / selected / disabled / loading / empty / error / focus-visible / reduced-motion）
7. 应用外壳（根背景、内容 gutters、头部 / 侧栏 / 导航、主行动区、skip-to-content、标题层级）

### 组件选择与使用约束（Geist 官方 Best Practices）

组件选型与使用必须遵循 Geist 官方 Best Practices（完整逐组件规范见 `docs/geist/components/<component>.md` 的 Best Practices 节）。**每个组件 md 顶部都有「渲染参数（官方页面实测）」引用块**——含该组件所有 demo 区块在 light / dark 双主题下的容器样式（border / 圆角 / 背景）与控件样式（高度 / padding / 字号 / 字重 / 颜色 / 圆角），实现组件视觉时必须对照该表对齐，禁止凭想象猜参数。以下是高频约束提炼：

#### 选择逻辑（用哪个组件）

- **Button vs ButtonLink**：改变状态（deploy / save / delete）用 `Button`；改变 URL 的导航用 `ButtonLink`。一行放不下多个相关动作时，换 Menu 或 Split Button
- **Modal vs Sheet vs Drawer**：需要阻断整页的决定用 Modal；需要持久关联上下文且底层页面保持可读用 Sheet（桌面）/ Drawer（移动端）。**破坏性确认必须用 Modal**——Drawer / Sheet 不完全遮罩页面，对删除 / 撤销太"软"
- **Select vs Combobox vs MultiSelect**：短且固定列表（<10 项）用 Select；需要过滤辅助用 Combobox；多选用 MultiSelect；2–3 项互斥分段选择用 Switch。选项 >10 用原生 `<optgroup>` 分组
- **Switch vs Toggle**：2–3 个互斥选项（同一表面的不同视图）用 Switch（radio 语义）；布尔开 / 关设置用 Toggle。超过 3 项或标签变长，改用 Tabs 或 Select
- **Toast vs 持久行**：非阻塞确认（Domain added / Project archived）用 Toast；计费失败、权限拒绝、需用户处理的构建失败**不能只用 toast**——≤6 词 toast + 携带恢复步骤与稳定标识的持久行
- **Tooltip vs Context Card vs Drawer**：Tooltip 解释"为什么存在"（补充约束 / 范围 / 限制），可见标签负责"是什么"；带元数据行的实体预览（头像、标识、2–4 条事实、可选动作）用 Context Card；长内容或需持久动作走 Drawer / 页面导航
- **Badge vs Status Dot vs Pill**：短、可扫读的元数据（状态 / 计划层级 / 环境 / 角色）用 Badge，一行一个；纯色点无文字用 Status Dot；可点击的筛选 chip 用 pill 变体或小型 Button
- **Input vs Textarea**：单行自由文本用 Input；内容一旦可能换行立即换 Textarea
- **Skeleton vs Spinner vs LoadingDots vs Progress**：异步数据填充已知布局（表格行 / 卡片网格 / 侧栏）用 Skeleton；单个进行中动作用 Spinner；不确定的内联等待用 LoadingDots；已知进度用 Progress
- **Table vs Entity**：行共享同构型且至少一列可排序 / 可比较的表格数据用 Table；单条描述性内容配单个动作（成员行 / 集成行）用 Entity

#### 组件使用硬约束

- **Button**：
  - 默认是 primary；支持动作用 `type="secondary"`，破坏性确认用 `type="error"`。`primary` / `success` / `ghost` / `violet` 不是合法 type 值
  - 表单提交用 `typeName="submit"`（HTML type 属性在 `typeName` 上，`type` 只控制视觉变体）
  - 用 `loading` prop 而不是换 spinner——保持可聚焦并通知辅助技术
  - **只在动作当前确实不可能时禁用**（缺输入 / 权限不足），并用 Tooltip 解释原因
  - 标签 Title Case 且写明结果：`Deploy Project`、`Invite Member`、`Rotate Key`；避免裸动词（Submit）与通用确认（OK / Confirm）
  - 破坏性按钮遵循 `动词 + 名词` 并 1:1 配 toast：`Delete Project` → `Project deleted`；模式切换按钮追加 `Instead`：`Use a Recovery Code Instead`
  - 纯图标按钮必须同时有 `svgOnly` 与 `aria-label`；aria-label 命名动作 + 目标（`Copy deployment URL`），不是图标（`Copy`）
  - **有可见文本的按钮禁止设置 `aria-label`**（会覆盖标签造成读屏不一致）
- **Switch**：必须传 `name` 使底层 radios 分组；恰好一个 Control 设 `defaultChecked` / 受控 checked；Control 内边距按最宽标签预留，选中 pill 不得改变尺寸；每个 Control 都要有 label（纯图标也必须有，渲染为 sr-only），纯图标 Switch 每个控件配 Tooltip
- **Badge**：静态标签，**禁止 onClick**；可操作时升级为 Button 或链接
- **Button 系列**：icon-only 按钮无文字时必须 aria-label（同上）；不要给已有可见文本的元素再设 aria-label

### shadcn/ui 使用规范（Geist 语境）

- 优先使用 shadcn/ui 现有组件，**禁止重复造轮子**
- 添加组件使用 CLI：`vp dlx shadcn@latest add <component>`（或遵循项目已配置的 shadcn CLI 方式）
- **定位**：Radix primitives 与 shadcn 代码仅作为**行为与无障碍基础设施**；Geist 映射之后才使用，**不得导入其视觉默认值 / 主题 / 变体作为设计权威**
- 视觉一律通过 Geist token、排版类、材质与共享基础组件表达
- 图标统一使用 `lucide-react`，不引入其他图标库
- 不引入与 shadcn 职责重叠的额外 UI 库（headlessui、chakra 等）

### 主题规范（Light / Dark）

- 所有颜色必须通过 **CSS 变量**引用，映射 **Geist 官方 light / dark token 角色**（而非自创一套近黑调色板）
- 两套主题使用**同一套语义角色**：`background` / `foreground` / `muted-foreground` / `border` / `ring` / `link` / `destructive` / `success` / `warning` 等，仅值随主题切换
- 禁止在组件中硬编码颜色值
- 暗色模式使用 `.dark` class 策略；支持手动切换，初始值尊重 `prefers-color-scheme`
- 所有主题敏感元素（文本、背景、边框、阴影、图标、图片遮罩）均需保证双主题可读
- 主题切换提供平滑过渡（`transition-colors`），避免突兀跳变

### 响应式规范（移动 / 平板 / 桌面 / 超宽屏）

- 采用**移动优先（mobile-first）**策略，以移动端为基线，用 Tailwind 断点（`sm` / `md` / `lg` / `xl`）逐级增强
- 至少覆盖四个基准视口并手动验证：
  - 移动端：375px
  - 平板：768px
  - 桌面端：1440px
  - 超宽屏：≥1920px（避免内容被拉伸得无边距，验证 max-width 与间距节奏）
- 布局适配原则：
  - 多列布局在小屏下坍缩为单列、抽屉或折叠
  - 表格在移动端横向滚动或卡片化
  - 弹窗 / 对话框在小屏下贴近屏幕边缘（如 bottom sheet 风格）
  - 导航在移动端使用抽屉 / 折叠菜单
  - 触控目标 ≥ 44×44px（按钮、图标按钮、可点击区域）
  - hover 交互必须考虑触屏不可用场景（用 `@media (hover: hover)` 隔离或交互检测）
  - 固定头部 / 底部栏 / 抽屉 / 底部弹层尊重 `env(safe-area-inset-*)`
  - 滚动条可见时测试，修复无意的横向或嵌套滚动条
- 字号与间距使用响应式尺度（`clamp()` / 断点变量），避免小屏拥挤
- 优先用 flex / grid / 原生 CSS 布局，避免用 JS 测量导致 layout thrash

### 无障碍与质量

- 使用语义化 HTML（`header` / `nav` / `main` / `section` / `button` 等），合理使用 ARIA
- 键盘可操作：焦点可见、Tab 顺序合理、弹窗焦点管理正确
- 表单控件有 label；图标按钮有 `aria-label`
- TypeScript 严格模式，避免 `any` 泛滥
- 提交前通过 `vp check` 与 `vp build`

## 前端实现工作流

收到设计稿后按以下顺序执行：

1. **分析设计稿**：输出页面 / 组件清单、视觉语言摘要、与设计稿的差异点（改良决策）
2. **确认计划**：向用户简述实现计划（页面清单、技术决策、不确定点），获确认后开始（用户明确要求直接做时除外）
3. **Foundation Gate**：先完成共享基础层（Geist 字体、语义 token 双套、排版工具类、间距圆角、焦点环、基础组件、应用外壳），再进入屏幕实现
4. **分步实现**：按组件 / 页面粒度实现，每个独立逻辑功能单独提交
5. **自检**：四视口响应式（375 / 768 / 1440 / ≥1920）、双主题、交互状态（hover / active / disabled / loading / empty / error / focus-visible / reduced-motion）、无障碍、`vp check` / `vp build`；视觉结果用浏览器截图 + 视觉分析工具复核，不凭代码推断
6. **Geist 审查**：整体扫一遍 anti-pattern（装饰渐变、卡片套卡片、超大圆角、偏离中性、Mono 排正文、硬编码颜色），对照 `docs/geist/` 本地快照逐项核对（色值 / 圆角 / 材质 / 排版类 / 组件选择），不合格即修订
7. **效果图更新（稳定后必做）**：样式 / 组件 / 示例页更新后，若已达到**稳定可生产的效果**，必须重新生成 README 效果图——用 Playwright 截取受影响页面（双主题），存入 `images/`（覆盖对应文件），并确认 README「效果图」区块的相对路径引用仍正确。截图脚本参考仓库历史（`vp dev` + Playwright chromium 截图 1440×900）
8. **提交**：遵循本文件 Git 规范提交

## Git 提交规范

所有 Git 提交必须严格遵循 **Angular Commit Convention**。

提交信息格式：

```text
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Message 要求

- `type` 必须符合 Angular Commit Convention：

  - `feat`: 新功能
  - `fix`: 修复问题
  - `docs`: 文档变更
  - `style`: 代码格式调整（不影响逻辑）
  - `refactor`: 重构
  - `perf`: 性能优化
  - `test`: 测试相关
  - `build`: 构建系统或依赖变更
  - `ci`: CI/CD 相关
  - `chore`: 其他维护工作
  - `revert`: 回滚提交

- `scope` 应根据项目结构填写，例如：

  - `frontend`
  - `backend`
  - `api`
  - `auth`
  - `ui`
  - `deps`
  - `docs`

- `subject`、`body`、`footer` 必须使用**简体中文**撰写（`Co-Authored by` 保留英文原文）。

- commit message 应清晰描述：

  - 修改内容；
  - 修改原因；
  - 影响范围。

- **Vibecoding 署名（必须）**：任何由 AI agent 生成的提交（vibecoding 结果），footer 必须附加 `Co-Authored by <模型名>`，模型名填写**实际执行本次提交的模型**（例如当前模型为 DeepSeek V4 Flash，则写 `Co-Authored by DeepSeek V4 Flash`）。禁止虚构或复用其他模型名称。

示例：

```text
feat(auth): 增加 OAuth2 登录支持

实现基于 Authentik 的 OAuth2 登录流程，
支持用户身份认证和会话管理。

Closes #123
Co-Authored by DeepSeek V4 Flash
```

## Git 签名要求

所有提交必须使用 GPG 签名。

固定使用以下 GPG key：

```
LeonhardtHUST (codex-new-2026-06-24)
92073072+LeonhardtHUST@users.noreply.github.com

Key ID:
EDBE72B991D05B9E8E9215D5115A25A8AEC82DCC
```

对应配置：

```bash
git config user.signingkey EDBE72B991D05B9E8E9215D5115A25A8AEC82DCC
git config commit.gpgsign true
```

提交时必须生成签名：

```bash
git commit -S
```

禁止创建未签名提交。

如当前环境无法完成 GPG 签名：

1. 不得绕过签名要求；
2. 检查 GPG agent、keyring、pinentry 配置；
3. 修复签名环境后重新提交。

## Git 用户身份

提交作者身份必须保持：

```
LeonhardtHUST <92073072+LeonhardtHUST@users.noreply.github.com>
```

禁止自动替换为其他用户名或邮箱。

## Node.js / Vite+ 项目管理规范

除非存在明确技术原因，否则所有 Node.js 项目必须优先使用 Vite+ (`vp`) 作为统一开发入口。

Vite+ (`vp`) 负责：

- Node.js runtime 管理；
- 包管理器选择与调用；
- 依赖安装；
- 项目脚本执行；
- 构建、检查、测试流程。

参考：

- 官方命令入口：`vp`
- 项目本地工具：`vite-plus`

### 包管理操作

默认使用：

```bash
vp install
vp add <package>
vp add -D <package>
vp remove <package>
vp update
vp dedupe
vp outdated
```

说明：

- `vp install` 用于安装项目依赖；
- `vp add` 用于添加依赖；
- `vp remove` 用于移除依赖；
- `vp update` 用于更新依赖；
- `vp why` 用于分析依赖来源。

禁止直接修改 `package.json` 添加依赖，除非修改属于手工维护配置。

## 项目创建

新建 Vite+ 项目优先使用：

```bash
vp create
```

已有项目迁移时：

```bash
vp migrate
```

### 开发流程

统一使用：

```bash
vp dev
vp check
vp test
vp build
```

其中：

- `vp check` 用于格式检查、lint、类型检查；
- `vp test` 用于测试；
- `vp build` 用于生产构建。

### 脚本执行

项目内脚本：

```bash
vp run <script>
```

调用项目已有二进制：

```bash
vp exec <command>
```

一次性运行外部 npm package：

```bash
vp dlx <package>
```

运行临时工具优先使用：

```bash
vpx <package>
```

### 包管理器选择原则

Agent 不应主动选择底层包管理器。

Vite+ 会根据：

1. `package.json` 中 `packageManager`
2. `devEngines.packageManager`
3. workspace 配置
4. lockfile

自动确定实际使用的包管理器。([Vite+][1])

因此：

- 优先执行 `vp` 命令；
- 保留项目已有 lockfile；
- 不主动切换 pnpm/npm/yarn/bun；
- 不删除已有包管理配置。

### 底层包管理器例外

以下情况允许直接调用底层工具：

- 项目文档明确要求；
- Vite+ 尚未覆盖对应功能；
- 调试包管理器自身行为。

此时：

1. 记录原因；
2. 在 commit message 中说明；
3. 避免造成 lockfile 不一致。

需要透传底层包管理器命令时，优先：

```bash
vp pm <command>
```

### 环境管理

Node.js 环境检查：

```bash
vp env
vp env doctor
```

确认当前 Node：

```bash
vp env which node
```

更新 Vite+：

```bash
vp upgrade
```

### Agent 提交前检查

Node.js 项目提交前：

```bash
vp check
vp test
vp build
```

根据项目实际情况执行必要检查。

所有生成的依赖变更必须通过 `vp add/remove/update` 完成。

## 提交前检查

每次提交前必须：

1. 检查代码状态：

```bash
git status
```

2. 确认提交内容：

```bash
git diff --cached
```

3. 确认提交信息符合 Angular Commit Convention。

4. 确认 GPG 签名有效：

```bash
git log --show-signature -1
```

5. 确认不存在敏感信息、临时文件或调试产物。

## Agent 行为要求

Agent 在执行开发任务时：

- 主动维护规范化 Git 历史；
- 每完成一个独立逻辑功能创建一次提交；
- 避免生成大型混合提交；
- 提交信息始终使用简体中文；
- 所有 summary、change log、commit message 均使用简体中文；
- 每次提交都必须附加 `Co-Authored by <模型名>`（填写实际执行本次提交的模型名）；
- 始终优先保证提交可追溯性和工程质量。
