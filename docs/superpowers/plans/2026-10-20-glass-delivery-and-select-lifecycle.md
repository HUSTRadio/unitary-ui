# Glass 交付验收与 Select 重开 / Glass delivery acceptance and Select reopening

开始：2026-10-20；复核：2026-10-22；基线：`cf4b1411`。状态：实现已落地，验收仍有未完成项。
Started: 2026-10-20. Reviewed: 2026-10-22. Baseline: `cf4b1411`. Status: implemented; acceptance remains incomplete.

## 中文实施与验收记录

### 2026-10-22 首次同步合并与最终补测

已确认并修复 LayerBridge 开启任务中的重复样式刷新：Radix 已在布局阶段初始化外包装层级，桥接器的首次读取现在与后续失效在绘制前合并；同节点 ref 更换会恢复尚未执行的同步，实际卸载继续取消。独立冻结构建的源码映射仅 LayerBridge 不同。24 次真实开关中，样式读取由 96 降至 72 次、由桥接器触发的样式刷新由 48 降至 24 次，React commit 与 Portal 接入均保持 341／24；插桩耗时不当作预算。新增回归先失败两项，修复后 LayerBridge 七项、相关六文件 71 项、生产浏览器 92 项、库／测试类型和 lint 通过。原生焦点时序、材质参数与公开 API 未变。

最终冻结候选 SHA256 为 `ccb99a4a3367a2ff39c1485025f989f1846f0574511be7c53c19ce1bb954277e`。新 54 条独立性能记录全部通过：108 个不少于五秒的稳定窗口，最大 P95 为 17.4ms；666 次选值重开、首次输入及其他阶段均未记录到长任务，空闲 RAF 为 0、几何稳定。帧指标仍只表示页面调度。旧代码同条件三次对照也未复现历史 51ms，因此这证明了冗余工作减少和本轮预算达标，尚不能唯一归因或宣称偶发超限已被彻底修复；旧失败全部保留。

最终 `pnpm run test:package` 退出 0：786 项直接通过、2 项 flaky、0 最终失败、0 跳过，独立安装、类型、九项公开导入、构建和双语语料通过。Windows Kernel-Power 日志确认两次待机／休眠与超时重叠；无重试的三轮定向补测 15 项全部通过，原超时、成功重试和 trace 均保留。54 条性能记录的采集结束早于首个睡眠事件。最终包 SHA256 为 `352251cf88bad95fe812273446f2745b431f914e0a202864451c171ff361f21d`，三个独立模板均通过并使用同一 integrity。

新候选的真实 Firefox 两项目各 15 项通过、退出 0，覆盖全部 24 个视口／主题／DPR 组合、两个原生隔离对照及四项交互光效；114 组指标、342 张比较图，DPR1/2 最大方差比 0.02683 / 0.23559，差异面积 100%、恢复差异 0。八个测试宿主输入已逐文件核实。WebKit 26.5 的 DPR1/2 必需对照仍各退出 1，方差比 1、差异面积 0，其 24 组合和远端 CI 继续未完成。额外纯 CSS 对照中普通 `filter:blur(8px)` 方差比约 0.00818，三种背景滤镜场景均无实际模糊；支持背景合成路径受限的判断，不证明具体驱动缺陷。参见 [WebKit 图形架构](https://docs.webkit.org/Ports/WebKitGTK%20and%20WPE%20WebKit/Graphics.html) 和[维护者关于 DMA-BUF 与模糊的说明](https://bugs.webkit.org/show_bug.cgi?id=303811#c3)。

精确 32 路径的 dry-run 已审阅，执行仍为退出 2／BLOCKED_SCOPE，未绕过保护。定向等效检查、完整包、模板、最新原生报告提供对应证据；本轮不改变 README 捕获状态，沿用上轮截图只读检查而不重复生成图片。原始记录位于忽略的 `layer-initial-performance-summary.json`、`layer-initial-interruption.json`、`layer-initial-native/summary.json` 和各同名前缀命令日志。未提交、未推送；无关工作保留。

| 本轮命令 / Current command | 退出 / Exit | 证据 / Evidence |
| --- | ---: | --- |
| `node node_modules/vitest/vitest.mjs run tests/layer-bridge.test.tsx` | 0 | 7 passed; related six-file run: 71 passed. |
| `pnpm run typecheck` / `pnpm run typecheck:tests` | 0 / 0 | Library and test types. |
| `pnpm exec oxlint src/lib/layer-bridge.tsx tests/layer-bridge.test.tsx` | 0 | Focused lint. |
| `node scripts/audit-glass-performance.mjs --artifact .scratch/glass-delivery/layer-initial-candidate --output .scratch/glass-delivery/layer-initial-performance --usages dense --repetitions 3 --reopening-budget 1` | 0 | All 54 independent records pass. |
| `pnpm run test:package` | 0 | 786 passed, 2 flaky; sleep/timeout evidence retained. |
| `pnpm run test:templates:package` | 0 | All three isolated consumers; same tarball integrity. |
| `node node_modules/@playwright/test/cli.js test -c playwright.glass-native.config.ts --project firefox-dpr1 --max-failures 1` | 0 | Headed Linux Xvfb, 15 passed. |
| `node node_modules/@playwright/test/cli.js test -c playwright.glass-native.config.ts --project firefox-dpr2 --max-failures 1` | 0 | Headed Linux Xvfb, 15 passed. |
| `node node_modules/@playwright/test/cli.js test -c playwright.glass-native.config.ts --project webkit-dpr1 --max-failures 1 --grep 'native blur control'` | 1 | Required isolated control fails. |
| `node node_modules/@playwright/test/cli.js test -c playwright.glass-native.config.ts --project webkit-dpr2 --max-failures 1 --grep 'native blur control'` | 1 | Required isolated control fails. |

15 项无重试补测的完整命令 / Exact command for 15 repeated cases without retries:

```sh
pnpm exec playwright test -c .scratch/glass-delivery/candidate-browser.config.ts tests/e2e/fade-motion.spec.ts --grep 'standalone device fixture|modal and drawer timelines stay coherent' --repeat-each 3 --retries 0 --reporter=list,json
```

原生命令由独立 Linux 宿主在 `UNITARY_NATIVE_GLASS_XVFB=1`、对应冻结产物与 Xvfb 下执行，具体环境和报告见最新原生汇总。Native commands run in the isolated Linux host with the frozen artifact, `UNITARY_NATIVE_GLASS_XVFB=1` and Xvfb; the fresh native summary records environment and reports.

以下为首次同步合并前的历史实现与验收记录；当前状态以上述复核为准。

### 2026-10-21 09:18 UTC 存档（首次同步合并前）

该次完整 `pnpm run test:package` 退出 **0**：独立 tarball 安装、类型、九项公开导入、文档生产构建及完整双语语料通过，浏览器 **788 项全部通过，0 失败、0 flaky、0 跳过**。当时包 SHA256：`ec665865fddb22105607c9045abfabe4e90231b1d2ef66e7402dcf5c2ed90c38`；integrity 与该次三个独立模板一致。浏览器耗时 1911.57 秒；原始报告已归档至忽略的 `.scratch/glass-delivery/package-before-initial-read-batch/docs-consumer/browser.json`，命令日志 `line-full-package-rerun.log` 与退出码文件保留。

本轮还完成 `material-lines.spec.ts` 36 项（84 个像素样本最低对比度 1.40461，原 light/390/Glass 顶栏为 1.47420）、相关材质／主题单元 72 项、导航基线／候选双主题各三次各六项、测试类型、验证关联及 lint。三个模板独立包验收与 README 八页面×双主题截图只读检查均退出 0，图片无变化。原 499 项后失败及 201 项后失败的两次完整包原始产物分别归档，未覆盖失败。

当前剩余为 Aero 51ms 重开长任务、WebKit 原生对照／24 组合和远端 CI。下文 54＋54 性能及 Firefox 原生矩阵属于结构线修复前的冻结产物，不冒充本轮新 CSS 产物的完整性能／原生证据；完整包通过也不等于关闭这些缺口。

历史第二次完整包命令在边线修复后执行，语料无漂移，浏览器 201 项通过后在移动导航快速反向用例停止（退出 1，586 项未执行）。同一节点连续性失败在冻结基线上复现；用例使用固定 35ms 等待，但浏览器协议往返可能越过退出终点。改用仓库已有 CSS 动画暂停／完成辅助，在实际过渡中点发出真实指针点击，保留十次反向、节点身份、正常关闭、Escape、焦点及 body 锁清理断言，不修改组件动效或延长产品时长。冻结基线与当前产物双主题各三次均通过（各六项），测试类型检查通过；新增辅助文件到导航用例的验证关联。最终完整包结果见本节顶部，所有失败与重试保留。

本轮确认完整包的顶栏失败来自 Glass 结构线规则的级联错误：材质已提供 18% 边线透明度，但零优先级选择器被 `.border-border` 等工具类覆盖，实际仍绘制 Solid 的 `#ebebeb`；等待全部有限动效后结果相同。参照既有 Acrylic/Aero，Glass 改为匹配工具类优先级、在边线自身解析前景色，并在透明度门关闭时分别恢复原 token。未调整填充、模糊、高光或对比度门槛。新增局部透明度／恢复回归在旧产物失败；修复后六个既有视口及保留的 1280 基准、双主题、作者覆盖、嵌套配色、普通文档、强制颜色和减少透明度合计 36 项浏览器检查通过，相关材质／主题／双语单元 72 项通过。最新完整包、模板与截图检查均通过，旧包失败保留为历史证据。

Aero 独立插桩诊断 12 次接入保留了 80ms 首次挂载及 52ms／54ms 后续长任务。后两项中 Layout／UpdateLayoutTree 分别约 22.29ms／24.36ms，LayerBridge 相关样式更新约 3.37ms／2.90ms；其余涉及 React、Radix Presence／Select、Floating UI 和原生 focus／scrollIntoView。插桩结果只用于归因，不替代原 51ms 预算失败，也不足以断言瓶颈全部在上游，故未进一步修改共享运行时或焦点时序。

WebKit 的默认、强制合成、软件 GL、CPU Skia、禁用 DMA-BUF 及传统 GL 组合共六个纯 CSS 隔离诊断均未产生模糊，原始日志有 EGL/DRI3 设备警告。宿主无预设强制关闭合成变量；已排除单一环境开关，但警告尚不能证明唯一根因。所有变体独立保留，未改变 CI 必需对照或将失败改为跳过。图形模式说明参见 [WebKit 官方图形文档](https://docs.webkit.org/Ports/WebKitGTK%20and%20WPE%20WebKit/Graphics.html) 与[官方环境变量](https://trac.webkit.org/wiki/EnvironmentVariables)。

### 边界与已实施修改

保持 Glass 外观、三档参数、交互和四档材质契约，不增加公开 API，不升级依赖。范围仅包含独立文档消费者、真实引擎绘制验收、Select 重开归因与已证实的 LayerBridge 重复工作。既有无关工作保留，本任务未暂存、提交或推送。

1. 文档动效夹具改用公开 HamburgerMenu，以受控 sidebar/left 场景驱动同一展开实现；公开导入审计覆盖可执行 build fixtures，同时允许文档内部引用。未扩大消费者复制范围或包 exports。
2. LayerBridge 去掉 ref→state 引起的额外组件渲染，合并绘制前的层级读取，复用同一 DOM 节点的订阅；保留作者 z-index、动态 token、层级作用域、同步 ref 清理和卸载取消。12 次相同挂载的诊断中，本模块样式读取由 84 次降至 37 次，相关强制样式更新由 60 次降至 24 次；插桩耗时不用于预算结论。
3. 原生绘制配置使用真实 Firefox/WebKit、六视口、浅深主题、DPR 1/2，每引擎 24 个唯一材质组合，另加隔离对照和交互光效检查。Ubuntu 24.04/Xvfb 专用 CI 在 PR、nightly、手动触发时执行，对照失败退出非零，保留浏览器版本、宿主、截图与量化指标；远端尚未运行。
4. 新增真实 Select 生命周期夹具：受控／非受控、重复选值、禁用项、作者取消、表单重置、焦点恢复、中断重开及真实触摸。无产品路由和公开 props 变化。
5. 性能工具保留 v9 阶段和真实选值，增加输入、React commit、Portal 接入、定位发布与焦点时间关联。另存 CPU profile、源码映射与布局 trace；时间关联不作为源码因果证明。修复测量失败时 context 清理可能阻塞整批运行的问题，保留失败堆栈和墙钟时长。

### 性能结果

冻结基线与候选各有 54 个有效条件：六 profile × Solid/Aero/Glass ×三次。源码映射逐项比较仅 `src/lib/layer-bridge.tsx` 不同，未降低光学参数、分辨率或门槛。

| 产物／材质 | 有效运行 | 达标运行 | 生命周期 >50ms 任务 |
| --- | ---: | ---: | ---: |
| 基线 Solid | 18 | 17 | 2 |
| 基线 Aero | 18 | 15 | 6 |
| 基线 Glass | 18 | 17 | 8 |
| 候选 Solid | 18 | 18 | 0 |
| 候选 Aero | 18 | 17 | 1 |
| 候选 Glass | 18 | 18 | 0 |

每份产物的 108 个稳定交互／滚动窗口均不少于 5 秒、无 >50ms 长任务；最大 P95 分别为 16.8ms／17.0ms，空闲采样器移除后 RAF 请求均为 0。它们表示页面帧调度节奏，不是 GPU 呈现时间或 INP。

候选 Aero 的 `desktop-dark-2` 第一次独立运行，在 `selection-lifecycle` 留有 **51ms** 长任务，起点 3452.8ms，关联第六次 Portal 接入；其间发生可信输入、React commit、定位和焦点事件，具体源码根因仍未证明。该失败不删除，不以成功重试覆盖，整体重开验收未通过。

基线初始批次记录 48 条后发生浏览器传输阻塞。第 0 条与并行测试类型编译重叠，第 47 条输入超时，均不计有效条件；第 48–53 条未完成。八个条件分别重新独立测量，原编号／重复次序与本地 invocation 编号保留映射，46 条原记录加八条恢复记录组成 54 条有效条件。所有污染、失败和中断记录仍保留。恢复驱动器退出 0 只表示收集完成，不能替代子命令预算失败的退出 1。

基线产物 SHA256：`6d7aa39393cb9e19f9a18592777b6f96bb154262af395064c8617a7075fa12b4`；候选：`283398433276b9bf5ae53a31d283b9b63e9669fcc4ed3255df2a9feafcfa9af2`。Chromium 为 `151.0.7922.34`。实测 harness SHA256：`2773cdb467e484351958c4b4c21b6013f3df3428a4db494485ddd30050dc04ce`，已通过反向重建核实。矩阵之后仅修改失败清理／watchdog、失败堆栈和墙钟记录；成功采样阶段、输入及判定未变，未将旧哈希冒充当前脚本。

### 检查与剩余缺口

- 定向导入／消费者／ExpandPanel 单元 28 项、source 动效 20 项、最终相关 LayerBridge／Select／浮层单元 66 项通过。最终七文件定向单元 50 项通过；新增验证输入关联 1 项通过，40 项因定向筛选未执行；测试与库类型检查、token 生成检查通过。
- 独立安装消费者完整公开导入 9 项、构建及双语语料无漂移；最终动效／层级／Glass 浏览器 63 项通过，另有 Select 生命周期四项通过。三个模板安装、构建和浏览器契约通过；首次端口冲突的失败日志保留，原生服务现使用独立端口 5243。
- 历史完整包第一次退出 **1**：浏览器 499 通过、1 最终失败、2 flaky、4 skipped、259 未执行；light/390/Glass 顶栏对比度 1.055547095013104，基线复现同值。结构线级联修复后第二次退出 **1**，201 通过后触发同样可在基线复现的导航测试竞态。两项修复均有回归，最新完整 `pnpm run test:package` 退出 **0**、788 项全部通过，原对比度断言未放宽。
- Firefox 初次最终矩阵被外层 600 秒命令截止时间中断；26 个通过日志缺失最终量化附件，不计完整证据。2026-10-21 改为两个独立项目，各 **15 项通过、退出 0**，完整覆盖 24 个材质组合、两个隔离对照及四个局部交互光效检查。Firefox 153.0／Linux Xvfb 共 114 组量化指标、342 张模糊／零模糊／恢复图：DPR1/2 最大方差比分别 0.02684／0.23559，有效差异面积均 100%，恢复差异均 0；物理倍率与配置一致。WebKit 26.5 在同一实际 Xvfb、物理 DPR 1/2 均未测到隔离模糊：方差比 1、差异面积 0，对照退出 **1**，其材质矩阵未通过；不能扩展成 Safari/iOS 真机结论。
- 最新精确 32 路径的 `verify --dry-run` 已审阅，以 `--base cf4b1411` 保留已提交夹具在比较范围内；执行退出 **2 / BLOCKED_SCOPE**，无检查被执行。共享 LayerBridge、样式、新原生配置／夹具与文档壳导致保守全仓回退。定向单元、类型、生产构建、独立消费者、三个模板、真实浏览器及完整语料检查提供对应证据；未机械启用全仓、未为本任务重构验证器。新增导航动画辅助的间接输入关联回归通过。
- 本次修复 Glass 结构线样式；材质参数不变。README 截图只读检查退出 0（八页面×双主题），不生成无变化图片。完整包按原计划覆盖消费者全部浏览器用例；未额外执行独立官网或全仓单元，未因并行脏文件扩大验证。

后续顺序：保留 Aero 深色桌面 DPR2 的失败，继续证明根因后再修改并重跑预算；在能通过原生隔离对照的真实 WebKit 环境完成 24 组合，并取得远端 CI 实际结果。结构线缺陷和完整包验收已关闭；未解决的性能及原生浏览器缺口继续标记未完成。

### 工作区与证据

起始文件内容哈希、32 个任务文件、命令日志、原始 RAF／长任务、独立失败记录、产物和逐条件清单保留在忽略的 `.scratch/glass-delivery/`。`final-performance-report.json` 验证冻结产物 54＋54 条条件完整性，`performance-interrupted.json` 保留恢复映射，`artifact-source-comparison-final.json` 限定该次生产差异。`final-native/summary.json` 保留冻结产物 Firefox／WebKit 各项目报告定位、指标、宿主与图片；`native-source-parity.json` 核实原生宿主六个工具输入与仓库内容一致，不包含后续结构线 CSS 的验收声明。临时产物不纳入版本管理。

复核时 HEAD 为 `1875b87a`，来自并行 Motion 工作提交；本任务没有修改 Git 索引或引用。起始快照之外有 18 个并行文件变化，另有动效夹具和验证策略的混合修改，均保留，详情在 `final-scope.json`。

## English implementation record

### 2026-10-22 Initial-read batching and final follow-up

LayerBridge's redundant opening-task style refresh is fixed: Radix initializes wrapper stacking in its layout phase, and the bridge now batches its initial reconciliation with later invalidations before paint. Same-node ref replacement retains pending synchronization; actual unmount cancels it. Frozen source maps differ only in LayerBridge. Across 24 trusted cycles, reads fall from 96 to 72 and bridge-triggered style refreshes from 48 to 24, while React commits/Portal attachments remain 341/24. Instrumented timing is not budget evidence. Two regressions fail before the fix; seven bridge cases, 71 related units, 92 production-browser cases, library/test types and lint pass afterward. Native focus timing, material parameters and public APIs are unchanged.

The final frozen artifact is `ccb99a4a3367a2ff39c1485025f989f1846f0574511be7c53c19ce1bb954277e`. All 54 fresh independent performance records pass: 108 steady windows of at least five seconds, maximum P95 17.4ms, no recorded long tasks across 666 selection reopenings, first input or other phases, zero idle RAF and stable geometry. Frame intervals measure page scheduling only. Three unchanged-code controls also fail to reproduce the historical 51ms task; this verifies reduced redundant work and passing current budgets, not exclusive attribution or definitive elimination of that intermittent result. Every historical failure remains.

The final `pnpm run test:package` exits 0: 786 passed, 2 flaky, zero final failures or skips; independent installation, types, nine public imports, build and the bilingual corpus pass. Windows Kernel-Power events overlap both timeout intervals. Three fresh targeted runs without retries pass all 15 cases, while original timeouts, retries and traces remain. The performance matrix finishes before the first sleep event. Package SHA256 is `352251cf88bad95fe812273446f2745b431f914e0a202864451c171ff361f21d`; all three independent templates pass with matching integrity.

Fresh Firefox projects each pass 15 cases with exit 0: all 24 viewport/theme/DPR combinations, two native controls and four input cases, with 114 metrics and 342 images. DPR1/2 maximum variance ratios are 0.02683 / 0.23559, changed fractions 100% and restored mismatch zero; eight host inputs match repository files. WebKit 26.5 mandatory controls at both DPRs still exit 1 (variance ratio 1, changed fraction zero); its matrix and remote CI remain incomplete. A standalone CSS Gaussian filter produces variance ratio about 0.00818 while three backdrop variants produce no blur. This supports a limitation in backdrop composition, not a uniquely identified driver defect. See [WebKit graphics architecture](https://docs.webkit.org/Ports/WebKitGTK%20and%20WPE%20WebKit/Graphics.html) and [the maintainer's DMA-BUF/blur note](https://bugs.webkit.org/show_bug.cgi?id=303811#c3).

Reviewed verification uses 32 exact paths and still exits 2/BLOCKED_SCOPE without bypassing the guard. Focused equivalents, complete package acceptance, templates and fresh native reports supply evidence. Captured README states do not change in this follow-up, so the prior read-only screenshot pass is retained without regenerating images. Ignored performance/interruption/native summaries and command logs retain the evidence. Unrelated work is preserved; no commit or push.

The following implementation and acceptance notes precede initial-read batching; the review above is current.

### 2026-10-21 09:18 UTC archive (before initial-read batching)

The latest complete `pnpm run test:package` exits **0**: independent tarball installation, types, nine public-import checks, production docs build and the complete bilingual corpus pass, with **788 passing browser cases, zero failures, flaky cases or skips**. Package SHA256 is `ec665865fddb22105607c9045abfabe4e90231b1d2ef66e7402dcf5c2ed90c38`, sharing integrity with all three freshly tested templates. Browser duration is 1911.57 seconds; the original report, command log and exit file remain in ignored evidence.

The follow-up also passes 36 structural-line cases (84 pixel samples, minimum contrast 1.40461; formerly failing header 1.47420), 72 related units, six baseline and six current navigation cases, test types, input-association regression and lint. All three independent templates and the eight-page × two-theme read-only README screenshot check exit 0, with no image drift. Both earlier full-package failures remain separately archived.

Remaining acceptance covers the 51ms Aero reopening task, WebKit native controls/24 combinations and remote CI. The 54+54 performance and Firefox native matrices below belong to frozen artifacts preceding the structural-line CSS fix; they are not complete performance/native evidence for the latest artifact. Full package success does not close those gaps.

The historical second complete package command, after the line fix, passes the corpus and 201 browser cases, then exits 1 on mobile-navigation reversal (586 not run). The same continuity failure reproduces on the frozen baseline: a fixed 35ms wait does not bound browser-protocol latency within the exit interval. Existing CSS pause/finish helpers now place real pointer clicks at an actual transition midpoint, retaining ten reversals, node identity, normal close, Escape, focus and body-lock cleanup. Component motion and product durations are unchanged. Baseline and current artifacts each pass both themes three times (six cases each), with test types passing and the helper-to-browser association declared. The final complete-package result is at the top of this section; every failure/retry remains archived.

The package header failure is a verified Glass structural-line cascade defect. Despite an 18% line-opacity parameter, zero-specificity material selectors lose to utilities such as `.border-border`, painting Solid's `#ebebeb`. Waiting for finite animations does not change it. Following the existing Acrylic/Aero pattern, Glass now matches utility specificity, resolves foreground locally and restores each canonical token when the opacity gate clears. Fill, blur, highlight parameters and contrast thresholds are unchanged. The new scoped-opacity regression fails on the old artifact; the fix passes 36 browser checks across the six existing viewports plus the retained 1280 baseline, both themes, author/nested colors, ordinary lines and accessibility fallbacks, alongside 72 related material/theme/bilingual units. The latest full-package, template and screenshot checks pass; the previous failure remains historical evidence.

Twelve instrumented Aero attachments retain an 80ms first mount and 52ms/54ms later tasks. The latter contain about 22.29ms/24.36ms of Layout/UpdateLayoutTree, including 3.37ms/2.90ms linked to LayerBridge. Other stacks include React, Radix Presence/Select, Floating UI and native focus/scrollIntoView. Diagnostic overhead is not budget evidence or proof of an exclusively upstream cause; the original 51ms budget failure remains, without further shared-runtime or focus changes.

Six standalone WebKit CSS controls (default, forced compositing, software GL, CPU Skia, disabled DMA-BUF and legacy GL combination) all fail to blur. Original logs include EGL/DRI3 device warnings, with no inherited switch forcing compositing off. This rules out a single simple environment switch but does not establish a unique cause. Every variant is retained; required CI controls remain fail-closed. See [WebKit graphics documentation](https://docs.webkit.org/Ports/WebKitGTK%20and%20WPE%20WebKit/Graphics.html) and [environment variables](https://trac.webkit.org/wiki/EnvironmentVariables).

## Contract

Restore the independent documentation consumer, establish real Firefox/WebKit blur evidence and a dedicated CI job, then attribute and address Select reopening long tasks. Preserve Glass appearance, presets, public exports/props, dependencies and existing interaction contracts. Preserve unrelated workspace changes. No commit or push.

The prior stable matrix passes at a maximum P95 of 16.8ms. Its 76 lifecycle tasks over 50ms cluster around reopening Select (Solid 23, Aero 35, Glass 18); attribution to a particular implementation remains unproven.

## Implementation

1. Replace the motion fixture's internal ExpandPanel import with the public HamburgerMenu, controlled, sidebar/left. Preserve its external controls and interruption/reversal assertions. Extend the existing public-import AST audit to portable client fixtures without changing package exports or copying repository source into consumers.
2. Separate Firefox/WebKit projects. Compare blur against blur(0px), preserving saturation, tint and decoration, after finite animations settle; handle both CSS property spellings. Use interior high-frequency luminance variance and changed-area metrics, with negative controls. Cover six viewports, two themes and DPR 1/2 per engine, the three presets, fixed header, desktop flyout and narrow Select Portal. Required-mode control failures fail rather than skip.
3. Add dedicated Ubuntu 24.04 / Xvfb headed CI for relevant PRs, nightly and manual invocation. Install pinned browsers and retain evidence. A configured but unexecuted workflow is not remote acceptance; desktop engine emulation is not Safari/iOS hardware evidence.
4. Preserve v9 phases and real selection/Portal cycles. Add input/commit/attachment/position/focus attribution, freeze baseline production output and collect separate CPU profiles/source maps and layout traces. Diagnostic overhead does not count toward budgets. Modify LayerBridge or Select only after evidence identifies redundant work. Upstream-only findings receive a minimal reproduction and remain an unresolved limitation.

## Acceptance

- Public-import, docs-consumer and ExpandPanel unit regressions; source and installed-artifact fade-motion cases; one complete successful `pnpm run test:package`, including installed path/no-repository-source evidence.
- Real Firefox/WebKit: 24 unique viewport/theme/DPR combinations each, quantitative native blur and restored-image checks. Missing native paint is incomplete evidence, not a passing fallback.
- Dense performance before and after: six existing profiles x Solid/Aero/Glass x three independent repetitions = 54 records per artifact. Reopening target: no main-thread task over 50ms. Each stable interaction/scroll window >=5s, P95 <=20ms, no >50ms task; idle has no persistent RAF. Preserve failed and interrupted runs.
- Controlled/uncontrolled, repeated selection, reversal, keyboard/touch, disabled, cancellation, form reset and focus restoration. Shared LayerBridge changes additionally cover dynamic scopes, author z-index, tokens, event completion and cleanup across consumers.
- Narrow tests first, reviewed exact-path verify dry-run, applicable execution or focused equivalents for BLOCKED_SCOPE. Add indirect-input associations. Check affected types/builds, docs determinism and consumers; update captured screenshots only when captured states change.

## Evidence

Starting tracked/untracked hashes and task paths are in ignored `.scratch/glass-delivery/`. Append actual commands, exit codes, artifact hashes, matrix coverage and unresolved limitations here as implementation proceeds.

### Implemented boundaries

- The portable motion fixture uses controlled public `HamburgerMenu` in sidebar/left mode. The AST audit now includes executable build-fixture imports while retaining local documentation imports and displayed-source checks. No package export or consumer-copy expansion was introduced.
- LayerBridge attaches its token subscription directly through the DOM ref, coalesces invalidations before paint, and reuses subscriptions when composed ref identity changes on the same node. Forwarded ref cleanup and cancellation remain synchronous; real unmount disposes subscriptions. It preserves authored stacking values and dynamic scope/token updates.
- Native paint has a separate real-engine configuration and fail-closed workflow. Quantitative checks distinguish blur from tint or arbitrary image differences. On this host, Firefox browser snapshots omit blur visible in the actual Xvfb display, so required Linux evidence reads that isolated display. A changing calibration marker verifies actual presentation and physical DPR before capture. Browser snapshots outside this mode remain diagnostic only.
- Diagnostic Select traces retain original/generated source locations and all long tasks. The v9 budget harness retains its original phases and trusted selection flow; `--reopening-budget 1` additionally rejects long tasks during reopen/selection lifecycle. Neither tool runs concurrently with other workspace checks through the existing lock.
- The final candidate and frozen baseline have identical source-map inputs except `src/lib/layer-bridge.tsx`; no fixture, material parameter or CSS reduction is used to obtain the performance comparison. Concurrent motion work is preserved in the working tree and final independent consumers, but isolated out of the frozen performance builds.

### Observed checks

| Command / evidence | Exit | Observation |
| --- | --- | --- |
| Expanded import audit before the fixture fix | 1 | Reproduced private ExpandPanel import from the portable fixture. |
| Public-import, docs-consumer and ExpandPanel unit checks | 0 | 28 passed. |
| Source `fade-motion.spec.ts` | 0 | 20 passed. |
| LayerBridge, layers, Select and ExpandPanel unit checks after the final ref fix | 0 | 66 passed, including same-node ref replacement, cleanup, live tokens and author levels. |
| Seven final focused unit files | 0 | 50 passed; import boundary, native oracle/capture/configuration, attribution, budget evaluation, stalled-browser teardown and LayerBridge. |
| `pnpm run test:templates:package` | 1, then 0 | First run built all three isolated consumers but hit a test-server port collision. Rerun passed all three installations, builds and browser contracts; native tests now reserve a separate port. Both logs retained. |
| Historical first `pnpm run test:package` | 1 | Independent imports 9/9, build and corpus passed; 499 browser cases passed, one failed, two flaky, four skipped, 259 not run. Raw artifacts remain archived. |
| Frozen-baseline `material-lines.spec.ts` / light / 390 / Glass | 1 | Reproduced header contrast 1.055547095013104 against 1.25. The verified CSS precedence defect is now fixed, without weakening the assertion. |
| `material-lines.spec.ts` after the CSS fix | 0 | 36 passed; 84 line samples, minimum contrast 1.40461, formerly failing header 1.47420. |
| Related material/theme units | 0 | 72 passed. |
| Historical package after the line fix | 1 | Corpus passed; 201 browser cases passed before the navigation race, 586 not run. Failure reproduces on the frozen baseline. |
| Controlled-clock navigation, baseline and current artifacts | 0 each | Both themes × three runs: six cases on each artifact; real input and node/cleanup assertions retained. |
| Latest complete `pnpm run test:package` | 0 | Installation, types, imports 9/9, build, bilingual corpus and all 788 browser cases passed; no failures, flaky cases or skips. |
| Latest three templates / read-only README screenshot check | 0 each | All isolated template consumers pass with the same package integrity; eight pages × two themes show no captured-image drift. |
| Linux Xvfb Firefox baseline matrix | 0 | 24 viewport/theme/DPR material combinations plus 4 local optical-input cases passed. Initial physical-DPR and stale-presentation failures remain archived; actual presentation calibration fixed the measurement path. |
| Final Firefox projects, DPR1 and DPR2 | 0 each | 15 passed each: all 24 material combinations, 2 isolated controls and 4 local-input cases. Complete reports contain 114 metrics and 342 comparison images. |
| Final installed consumer | 0 | 9 import checks, build, complete bilingual corpus and 63 motion/layer/Glass browser checks. |
| Installed Select lifecycle browser regression | 0 | 4 passed: controlled/uncontrolled, keyboard/touch, disabled/cancelled/repeated selection, interrupted reopen, form reset and focus. |
| Final targeted input-association regression | 0 | 1 passed; 40 unrelated policy tests intentionally filtered out. |
| Library/test types, token generation and focused lint | 0 | No affected type or token drift; focused lint retains nonfatal warnings. |
| Exact-path `verify --base cf4b1411` after reviewed dry-run | 2 | BLOCKED_SCOPE; no checks executed. Focused equivalents and omissions are recorded above. |
| Linux Xvfb isolated native control | 1 overall | Firefox passed; WebKit did not produce measurable native blur on this host. Its remaining matrix is not counted as passed. Remote workflow execution remains outstanding. |

Raw logs, frozen artifacts, source comparisons and per-run manifests are retained under ignored `.scratch/glass-delivery/`. They are local evidence, not committed scratch artifacts.

### Final performance and coverage

Both artifacts have 54 valid conditions (six profiles × three materials × three repetitions). Baseline lifecycle tasks over 50ms: Solid 2, Aero 6, Glass 8, across five failing conditions. Candidate: Solid 0, Aero 1, Glass 0, across one failing condition. Candidate Glass passes all 18 records; this does not make the full reopening gate pass. The remaining 51ms task is in desktop-dark-2/Aero/repetition 0 at 3452.8ms, correlated with input and Portal 6 attachment, React commits, positioning and focus. Its source cause remains unproven; no successful retry replaces it.

Each artifact's 108 stable windows exceed five seconds with no >50ms task. Baseline/candidate maximum P95 is 16.8ms/17.0ms; idle RAF requests are zero. These are page scheduling metrics, not GPU presentation or INP. Baseline artifact SHA256 is `6d7aa39393cb9e19f9a18592777b6f96bb154262af395064c8617a7075fa12b4`; candidate is `283398433276b9bf5ae53a31d283b9b63e9669fcc4ed3255df2a9feafcfa9af2`, Chromium `151.0.7922.34`. Source maps differ only in LayerBridge.

The initial baseline transport stalled after 48 records. Row 0 overlapped a separate test-type compiler, row 47 timed out, and rows 48–53 did not finish. Eight independent replacements map to the original condition/repetition, preserving raw invocation ordinals; 46 original plus eight recovery records supply all 54 valid conditions. Every contaminated, failed or interrupted record remains archived. A collection helper's exit 0 does not override failing child budget commands.

Measured harness SHA256 is `2773cdb467e484351958c4b4c21b6013f3df3428a4db494485ddd30050dc04ce`, verified by reconstructing the measured bytes. Subsequent changes affect browser teardown/watchdog and failed-record stack/elapsed time only; successful sampling phases, inputs and evaluation remain unchanged. Regression tests reproduce the stalled context cleanup failure and pass after browser-level teardown.

The earlier installed consumer passes nine import checks, build, complete deterministic bilingual corpus and 63 motion/layer/Glass browser checks, with four additional Select lifecycle cases passing. After the CSS and navigation-test fixes, the latest complete package command exits 0 with all 788 browser cases passing. Three freshly installed templates use the same package integrity and pass; the read-only README screenshot check also exits 0. Library/test types, tokens and focused lint pass. Historical failures remain archived.

The final initial Firefox command was terminated at its outer 600-second deadline: 26 passing log entries without final quantitative attachments do not establish complete evidence. On 2026-10-21 two fresh independent projects each finish 15 tests with exit 0: all 24 material combinations, two controls and four local-input cases. Firefox 153.0/Linux Xvfb reports contain 114 quantitative comparisons and 342 images. DPR1/2 maximum variance ratios are 0.02684/0.23559; changed fraction is 100%, restored mismatch zero, and physical DPR matches configuration. Actual Xvfb WebKit 26.5 controls at physical DPR 1/2 fail (variance ratio 1, changed fraction 0); its matrix and remote CI remain unverified. This is desktop-engine evidence, not Safari/iOS hardware validation. The ignored native summary retains source reports, host/version, metrics and extracted images; six native-host inputs match current repository hashes.

Latest verification reviews 32 exact paths against the original baseline after concurrent Motion work advanced HEAD. Execution exits 2/BLOCKED_SCOPE with no checks run: shared LayerBridge/CSS, native configuration/fixture and documentation shell conservatively select full suites. Focused units, types, production builds, installed consumers, templates, complete package browser coverage and corpus checks provide evidence; unrelated standalone website/full-unit checks were not added. Structural-line CSS changed; the read-only README screenshot check confirms no image regeneration is required. The navigation animation helper's indirect-input regression passes.

At review HEAD is `1875b87a` from concurrent Motion work, with 18 other changed/new files since the starting snapshot and mixed fixture/policy changes preserved. This task did not stage, commit or push. The ignored scope report records hashes and boundaries. Remaining work is attribution and resolution of the Aero task, passing WebKit native controls/matrix and remote CI; the structural-line defect and full package acceptance are resolved. Performance/native matrices above precede the CSS fix and do not establish complete acceptance of the latest artifact.
