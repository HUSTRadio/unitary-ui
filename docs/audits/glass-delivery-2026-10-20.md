# Glass 交付检查 / Glass delivery checks

本检查补充实施计划，不修改材质参数或组件公开 API。
This audit supplements the implementation plan. It does not change material parameters or public component APIs.

## 2026-10-22 最新复核 / Current review

### 2026-10-22 首次同步合并与最终补测

已确认并修复 LayerBridge 开启任务中的重复样式刷新：Radix 已在布局阶段初始化外包装层级，桥接器的首次读取现在与后续失效在绘制前合并；同节点 ref 更换会恢复尚未执行的同步，实际卸载继续取消。独立冻结构建的源码映射仅 LayerBridge 不同。24 次真实开关中，样式读取由 96 降至 72 次、由桥接器触发的样式刷新由 48 降至 24 次，React commit 与 Portal 接入均保持 341／24；插桩耗时不当作预算。新增回归先失败两项，修复后 LayerBridge 七项、相关六文件 71 项、生产浏览器 92 项、库／测试类型和 lint 通过。原生焦点时序、材质参数与公开 API 未变。

最终冻结候选 SHA256 为 `ccb99a4a3367a2ff39c1485025f989f1846f0574511be7c53c19ce1bb954277e`。新 54 条独立性能记录全部通过：108 个不少于五秒的稳定窗口，最大 P95 为 17.4ms；666 次选值重开、首次输入及其他阶段均未记录到长任务，空闲 RAF 为 0、几何稳定。帧指标仍只表示页面调度。旧代码同条件三次对照也未复现历史 51ms，因此这证明了冗余工作减少和本轮预算达标，尚不能唯一归因或宣称偶发超限已被彻底修复；旧失败全部保留。

最终 `pnpm run test:package` 退出 0：786 项直接通过、2 项 flaky、0 最终失败、0 跳过，独立安装、类型、九项公开导入、构建和双语语料通过。Windows Kernel-Power 日志确认两次待机／休眠与超时重叠；无重试的三轮定向补测 15 项全部通过，原超时、成功重试和 trace 均保留。54 条性能记录的采集结束早于首个睡眠事件。最终包 SHA256 为 `352251cf88bad95fe812273446f2745b431f914e0a202864451c171ff361f21d`，三个独立模板均通过并使用同一 integrity。

新候选的真实 Firefox 两项目各 15 项通过、退出 0，覆盖全部 24 个视口／主题／DPR 组合、两个原生隔离对照及四项交互光效；114 组指标、342 张比较图，DPR1/2 最大方差比 0.02683 / 0.23559，差异面积 100%、恢复差异 0。八个测试宿主输入已逐文件核实。WebKit 26.5 的 DPR1/2 必需对照仍各退出 1，方差比 1、差异面积 0，其 24 组合和远端 CI 继续未完成。额外纯 CSS 对照中普通 `filter:blur(8px)` 方差比约 0.00818，三种背景滤镜场景均无实际模糊；支持背景合成路径受限的判断，不证明具体驱动缺陷。参见 [WebKit 图形架构](https://docs.webkit.org/Ports/WebKitGTK%20and%20WPE%20WebKit/Graphics.html) 和[维护者关于 DMA-BUF 与模糊的说明](https://bugs.webkit.org/show_bug.cgi?id=303811#c3)。

精确 32 路径的 dry-run 已审阅，执行仍为退出 2／BLOCKED_SCOPE，未绕过保护。定向等效检查、完整包、模板、最新原生报告提供对应证据；本轮不改变 README 捕获状态，沿用上轮截图只读检查而不重复生成图片。原始记录位于忽略的 `layer-initial-performance-summary.json`、`layer-initial-interruption.json`、`layer-initial-native/summary.json` 和各同名前缀命令日志。未提交、未推送；无关工作保留。

首次同步合并前的记录保留在后续「历史复核」部分，当前状态以本节为准。

### 2026-10-22 Initial-read batching and final follow-up

LayerBridge's redundant opening-task style refresh is fixed: Radix initializes wrapper stacking in its layout phase, and the bridge now batches its initial reconciliation with later invalidations before paint. Same-node ref replacement retains pending synchronization; actual unmount cancels it. Frozen source maps differ only in LayerBridge. Across 24 trusted cycles, reads fall from 96 to 72 and bridge-triggered style refreshes from 48 to 24, while React commits/Portal attachments remain 341/24. Instrumented timing is not budget evidence. Two regressions fail before the fix; seven bridge cases, 71 related units, 92 production-browser cases, library/test types and lint pass afterward. Native focus timing, material parameters and public APIs are unchanged.

The final frozen artifact is `ccb99a4a3367a2ff39c1485025f989f1846f0574511be7c53c19ce1bb954277e`. All 54 fresh independent performance records pass: 108 steady windows of at least five seconds, maximum P95 17.4ms, no recorded long tasks across 666 selection reopenings, first input or other phases, zero idle RAF and stable geometry. Frame intervals measure page scheduling only. Three unchanged-code controls also fail to reproduce the historical 51ms task; this verifies reduced redundant work and passing current budgets, not exclusive attribution or definitive elimination of that intermittent result. Every historical failure remains.

The final `pnpm run test:package` exits 0: 786 passed, 2 flaky, zero final failures or skips; independent installation, types, nine public imports, build and the bilingual corpus pass. Windows Kernel-Power events overlap both timeout intervals. Three fresh targeted runs without retries pass all 15 cases, while original timeouts, retries and traces remain. The performance matrix finishes before the first sleep event. Package SHA256 is `352251cf88bad95fe812273446f2745b431f914e0a202864451c171ff361f21d`; all three independent templates pass with matching integrity.

Fresh Firefox projects each pass 15 cases with exit 0: all 24 viewport/theme/DPR combinations, two native controls and four input cases, with 114 metrics and 342 images. DPR1/2 maximum variance ratios are 0.02683 / 0.23559, changed fractions 100% and restored mismatch zero; eight host inputs match repository files. WebKit 26.5 mandatory controls at both DPRs still exit 1 (variance ratio 1, changed fraction zero); its matrix and remote CI remain incomplete. A standalone CSS Gaussian filter produces variance ratio about 0.00818 while three backdrop variants produce no blur. This supports a limitation in backdrop composition, not a uniquely identified driver defect. See [WebKit graphics architecture](https://docs.webkit.org/Ports/WebKitGTK%20and%20WPE%20WebKit/Graphics.html) and [the maintainer's DMA-BUF/blur note](https://bugs.webkit.org/show_bug.cgi?id=303811#c3).

Reviewed verification uses 32 exact paths and still exits 2/BLOCKED_SCOPE without bypassing the guard. Focused equivalents, complete package acceptance, templates and fresh native reports supply evidence. Captured README states do not change in this follow-up, so the prior read-only screenshot pass is retained without regenerating images. Ignored performance/interruption/native summaries and command logs retain the evidence. Unrelated work is preserved; no commit or push.

The following implementation and acceptance notes precede initial-read batching; the review above is current.

## 2026-10-21 历史复核 / Historical review

完整包验收已恢复：修复 Glass 结构线的级联错误及移动导航反向测试的时序竞态后，`pnpm run test:package` 退出 0，788 项浏览器检查全部通过，无失败、flaky 或跳过；独立安装、九项公开导入、类型、构建及完整双语语料均通过。剩余未完成项为 Aero 深色桌面 DPR2 的 51ms 重开任务、WebKit 原生隔离模糊／矩阵及远端 CI，不能宣称全部交付通过。

Full package acceptance is restored: after fixing Glass structural-line precedence and the mobile-navigation reversal test's timing race, `pnpm run test:package` exits 0 with all 788 browser checks passing, no failures, flaky tests or skips. Independent installation, nine public-import checks, types, build and the complete bilingual corpus pass. Acceptance remains incomplete for the 51ms Aero reopening task on dark desktop DPR2, native WebKit controls/matrix and remote CI.

Glass 原来以零优先级选择器设置边线，输给了不透明工具类；现在参照 Acrylic/Aero 匹配工具类优先级，在实际边线解析前景色，辅助设置关闭透明度门时恢复各自原 token。填充、模糊、高光及对比度门槛未变。原 light/390/Glass 顶栏对比度由 1.05555 提升至 1.47420；六视口及保留的 1280 基准、双主题共 84 个线条像素样本最低为 1.40461（原断言门槛 1.25）。36 项结构线浏览器检查、72 项相关单元、三个独立模板和 README 截图只读检查通过，捕获图片无变化。

Glass previously assigned line colors through zero-specificity selectors that lost to opaque utilities. It now follows Acrylic/Aero's utility precedence, resolves foreground at the actual line and restores canonical tokens when accessibility settings clear the opacity gate. Fill, blur, highlights and contrast thresholds are unchanged. The light/390/Glass header rises from 1.05555 to 1.47420; 84 pixel samples across six viewports plus the retained 1280 baseline and both themes have minimum contrast 1.40461 (existing threshold 1.25). All 36 structural-line browser checks, 72 related units, three independent templates and the read-only README screenshot check pass; captured images are unchanged.

导航用例的固定 35ms 等待无法限制协议延迟，旧产物同样会越过退出终点。用既有 CSS 动画辅助将真实指针点击固定在过渡中点，保留十次反向、同节点、关闭、Escape、焦点和锁清理断言；产品动效不变。基线与当前产物双主题各三次均通过，随后完整包运行通过。

The navigation test's fixed 35ms delay cannot bound protocol latency; the old artifact also crosses the exit endpoint. Existing CSS-animation helpers place real pointer clicks at the transition midpoint, retaining ten reversals, node identity, close, Escape, focus and lock cleanup. Product motion is unchanged. Both themes pass three times on baseline and current artifacts before the complete passing package run.

下表性能和后述 Firefox 原生结果对应边线修复前的冻结产物；它们不作为本轮新样式产物的完整性能／原生证据。当前包 SHA256 为 `ec665865fddb22105607c9045abfabe4e90231b1d2ef66e7402dcf5c2ed90c38`，三个模板与完整包验收使用相同 integrity。

The following performance and Firefox native results belong to frozen artifacts preceding the line fix, not complete performance/native evidence for the new CSS artifact. The current package SHA256 is `ec665865fddb22105607c9045abfabe4e90231b1d2ef66e7402dcf5c2ed90c38`; all three templates and full package acceptance use the same integrity.

| 指标 / Metric | 基线 / Baseline | 候选 / Candidate |
| --- | ---: | ---: |
| 有效独立条件 / Valid independent conditions | 54 | 54 |
| 生命周期 >50ms 任务 / Lifecycle tasks >50ms | 16 | 1 |
| 未达标条件 / Failing conditions | 5 | 1 |
| 稳定窗口最大 P95 / Maximum steady-window P95 | 16.8ms | 17.0ms |
| 稳定窗口 >50ms 任务 / Steady-window tasks >50ms | 0 | 0 |
| 空闲 RAF 请求 / Idle RAF requests | 0 | 0 |

每条件包含不少于五秒的稳定交互和滚动，各产物共 108 个窗口。基线八个污染、超时或中断条件通过有编号映射的独立运行补齐；所有原始失败保留。候选两批各 27 条，第二批预算退出 1；收集脚本完成不等于预算通过。实际浏览器为 Chromium 151.0.7922.34，生产源码映射仅 LayerBridge 不同。产物／harness 哈希及恢复清单见实施计划与忽略的 `final-performance-report.json`。

Each condition includes at least five seconds of stable input and scrolling, totaling 108 windows per artifact. Eight contaminated, timed-out or interrupted baseline conditions were replaced by independently mapped runs; all original failures remain. Two candidate batches contain 27 records each; the second exits 1 on its budget. A completed collection script does not imply a passing budget. Chromium is 151.0.7922.34; production source maps differ only in LayerBridge. Artifact/harness hashes and recovery mapping are in the implementation plan and ignored `final-performance-report.json`.

最终七文件单元 50 项、相关浮层／Select 单元 66 项、独立安装消费者浏览器 63 项及 Select 生命周期四项通过。原完整包失败（499 passed、1 failed、2 flaky、4 skipped、259 未执行）及边线修复后的导航失败（201 passed、1 failed、586 未执行）均已独立归档；两项根因修复后，最新完整包命令退出 0、788 项通过。旧失败没有被成功日志覆盖。

The final seven unit files pass 50 tests, related layer/Select units pass 66, and the installed consumer passes 63 browser checks plus four Select lifecycle cases. The original full-package failure (499 passed, one failed, two flaky, four skipped, 259 not run) and subsequent navigation failure (201 passed, one failed, 586 not run) remain independently archived. After both root causes are fixed, the latest full package command exits 0 with 788 passing checks. Success does not overwrite either failure.

最终 Firefox 153.0/Linux Xvfb 两个独立项目各 15 项通过、退出 0，覆盖全部 24 个材质组合、两个隔离对照与四项交互光效；114 组量化指标对应 342 张图片。DPR1/2 最大方差比为 0.02684／0.23559，差异面积均 100%，恢复差异为 0。此前超时运行只有通过日志而缺少最终附件，不计完整证据；原失败与补测报告都保留。WebKit 26.5 两个物理 DPR 的对照仍失败（方差比 1、差异面积 0），不执行／不计其矩阵通过。汇总与逐图定位在忽略的 `final-native/summary.json`，六个原生宿主输入已与当前仓库逐文件核对。

Final Firefox 153.0/Linux Xvfb projects each pass 15 tests with exit 0, covering all 24 material combinations, two controls and four optical-input cases; 114 metrics correspond to 342 images. DPR1/2 maximum variance ratios are 0.02684/0.23559, changed fractions 100%, restored mismatch zero. Earlier timed-out passing logs lack final attachments and are not complete evidence; interrupted and replacement reports remain. WebKit 26.5 controls at both physical DPRs still fail (variance ratio 1, changed fraction 0), so its matrix is not passed. The ignored `final-native/summary.json` locates metrics and images, with six host inputs checked against current repository files.

## Native paint / 原生绘制

专用 workflow 使用 Ubuntu 24.04、Xvfb 和真实 Firefox/WebKit，按 DPR 1/2 分项目启动。每引擎有 24 个唯一视口／主题／DPR 材质组合，另有隔离对照和局部输入回归。这是桌面引擎受控视口验收，不是 Safari/iOS 真机证据；配置文件存在不代表远端 CI 已通过。

The dedicated workflow uses Ubuntu 24.04, Xvfb and real Firefox/WebKit projects at DPR 1/2. Each engine has 24 unique viewport/theme/DPR material cases, plus isolated controls and local-input checks. It tests desktop engines with controlled viewports, not physical Safari/iOS devices. Remote CI remains unverified until a real workflow run completes.

浏览器截图可能丢失合成模糊：本机 Firefox 在虚拟显示上绘制了模糊，截图却未包含它。因此 Linux 必需验收通过 Xlib 采样显式指定的 Xvfb 显示。四色标记定位页面原点并核实物理倍率；每次截图更换色序，等待该色序出现在实际显示上，DOM RAF 本身不作为呈现证明。裁切、缺失标记或 DPR 不符均失败，标记位于材质采样区域外。Python 与 Xlib 仅用于测试宿主，不增加产品依赖。未显式启用 Xvfb 时的截图仅作诊断。

Browser snapshots can omit composited blur: local Firefox paints the blur in its virtual display while its snapshot does not. Required Linux acceptance therefore captures the explicitly selected Xvfb display through Xlib. A four-color marker locates the content origin and verifies physical scale; each capture changes its palette phase and waits for that phase to appear on the display. DOM RAF alone does not prove presentation. Clipped surfaces, missing markers or DPR mismatches fail. The marker lies outside sampled material regions. Python and Xlib are test-host tools, with no product dependency. Outside the explicit Xvfb mode, snapshots are diagnostic evidence only.

有限动效结束后，测试在保留填充和饱和度的条件下比较正常模糊、blur(0px) 及恢复图。已知灰度纹理的基准亮度方差须 >=9，模糊后方差比 <=0.5，有效差异面积 >=20%，恢复不一致面积 <=1%（通道差 >2）。相同图片、空白背景、单纯填充变化和瞬态绘制均不能通过。隔离对照失败会在矩阵前阻止对应 CI job，不改为跳过。

After finite animations settle, the test compares normal blur, blur(0px) and restored blur while preserving tint/saturation. Known grayscale texture must have baseline luminance variance >=9, blur variance ratio <=0.5, changed-area fraction >=20% and restored mismatch <=1% (channel delta >2). Identical images, a blank background, tint-only changes and transient paint cannot pass. A failed isolated control stops that CI job before its matrix; it is never converted to a skip.

```sh
UNITARY_DOCS_TEST_FIXTURES=1 pnpm exec vite build --config docs/vite.config.ts
pnpm exec playwright install --with-deps firefox webkit
export UNITARY_DOCS_ARTIFACT=docs/dist UNITARY_NATIVE_GLASS_XVFB=1
export GDK_BACKEND=x11 MOZ_ENABLE_WAYLAND=0
unset WAYLAND_DISPLAY
xvfb-run -a -s "-screen 0 3200x2400x24" pnpm exec playwright test -c playwright.glass-native.config.ts --project=firefox-dpr1 --grep "native blur control"
xvfb-run -a -s "-screen 0 3200x2400x24" pnpm exec playwright test -c playwright.glass-native.config.ts --project=firefox-dpr1 --grep "material matrix|local optical input"
```

Repeat for `firefox-dpr2`, `webkit-dpr1` and `webkit-dpr2`. Inspect independent `.scratch/glass-native/` runs, including quantitative metrics, restored images, version/platform annotations and failure traces. Headed Linux execution follows [Playwright's Xvfb guidance](https://github.com/microsoft/playwright/blob/main/docs/src/ci.md).
其余三个项目使用相同顺序。检查 `.scratch/glass-native/` 下独立运行的量化指标、恢复图、版本／平台注记及失败 trace。Linux headed 运行方式参照 [Playwright Xvfb 文档](https://github.com/microsoft/playwright/blob/main/docs/src/ci.md)。

## Select reopening / Select 重开

诊断工具要求冻结的生产夹具产物和源码映射。CPU profile、时间线调用栈、React 提交与样式调用插桩存在诊断开销，不能作为性能预算证据。工具保留生成／原始位置及未归因任务，不仅凭输入时间接近就认定源码根因。

`diagnose-select-reopening.mjs` requires a frozen production fixture build with source maps. Its CPU profile, timeline stacks, React commit hook and style-call instrumentation are diagnostic overhead, never performance-budget evidence. It retains generated/original frame locations and unknown tasks rather than inferring a source from nearby input alone.

```sh
node scripts/diagnose-select-reopening.mjs --artifact .scratch/glass-baseline --output .scratch/select-diagnostic --cycles 12
node scripts/audit-glass-performance.mjs --artifact .scratch/glass-baseline --output .scratch/select-baseline --usages dense --repetitions 3 --reopening-budget 1
```

第二条命令使用六个既有性能 profile 和 Solid/Aero/Glass，共 54 条独立记录。功能检查结束后，对候选产物执行相同矩阵；保留两份产物、清单及所有失败。稳定交互／滚动维持 >=5 秒、P95 <=20ms、无 >50ms 长任务；显式重开预算额外拒绝重开及生命周期阶段的 >50ms 任务，不把开销移入预热。帧间隔表示页面调度，不是 GPU 呈现时间或 INP。

The second command uses all six existing performance profiles and Solid/Aero/Glass: 54 independent records. Repeat against the candidate artifact after functional checks stop. Keep both artifacts, manifests and every failed run. Stable interaction/scroll retain >=5s windows, P95 <=20ms and no >50ms task; explicit reopening acceptance additionally rejects >50ms tasks in reopening/lifecycle phases. It does not move those costs into warm-up. Frame intervals measure page scheduling, not GPU presentation or INP.

Both CLI tools acquire the existing `workspace-checks` lock before launching a browser. Stable Solid failures mark unstable controls; a Solid reopening-only failure is reported separately as a lifecycle limit.
两项 CLI 在启动浏览器前取得既有 `workspace-checks` 锁。Solid 稳定阶段失败标记为不稳定对照；仅重开超限则单独记录为生命周期限制。

测量记录在关闭浏览器之后由调用方写入。context 传输卡住时，原有先关闭 context 的清理可能阻止整批继续；现由 browser 关闭及 45 秒 watchdog 终止该实例，失败行保留堆栈和实际墙钟时长。工具不录制 HAR/video，无需等待这类 context 附件。此修改发生在上述性能矩阵之后；已反向重建并核对原 harness 哈希，成功采样阶段与判定未变，不把历史记录哈希标为当前代码。

The caller writes each record after browser teardown. Previously a stalled context transport could block that teardown and the batch; browser-level close and a 45-second watchdog now terminate the instance, retaining failure stacks and elapsed wall time. The tool records no HAR/video requiring graceful context attachment flushing. This change followed the measured matrix; reconstructed bytes verify the measured harness hash, while successful sampling and evaluation remain unchanged. Historical hashes are not represented as current code. See [Playwright browser teardown](https://github.com/microsoft/playwright/blob/main/docs/src/api/class-browser.md).

对剩余 Aero 条件继续诊断时，先保留冻结候选产物，再运行下列插桩命令；其耗时不能代替预算。工具当前固定深色、1280×900、DPR2，与失败 profile 一致。定位到具体源码并建立回归后，再分别执行预算矩阵；不通过修改焦点时序、常驻 Portal 或移动测量窗口消除报告。

For the remaining Aero condition, retain the frozen candidate before running this instrumented diagnostic; its timings are not budget evidence. The diagnostic uses dark 1280×900 at DPR2, matching the failing profile. Establish source attribution and regression protection before changing code and rerunning budgets. Do not hide the result through focus timing, persistent Portals or shifted windows.

```sh
 node scripts/diagnose-select-reopening.mjs --artifact .scratch/glass-delivery/candidate-final --output .scratch/select-aero-followup --textures aero --cycles 12
```

12 次插桩接入仍出现 52ms／54ms 后续任务，其中 Layout／UpdateLayoutTree 约 22.29ms／24.36ms，LayerBridge 相关约 3.37ms／2.90ms，其余涉及 React、Radix、Floating UI 及原生焦点／滚动。诊断不足以证明完全属于上游，未进一步修改共享运行时，也未用插桩耗时或成功重试替换原 51ms 预算失败。

Twelve instrumented attachments retain 52ms/54ms later tasks, with Layout/UpdateLayoutTree around 22.29ms/24.36ms and LayerBridge-related work around 3.37ms/2.90ms; other stacks involve React, Radix, Floating UI and native focus/scroll. This does not establish an exclusively upstream cause. Shared runtime remains unchanged, and neither diagnostic timings nor successful retries replace the original 51ms budget failure.

## Delivery evidence / 交付证据

Actual commands, exit codes, source boundaries and unresolved acceptance are recorded in [the implementation plan](../superpowers/plans/2026-10-20-glass-delivery-and-select-lifecycle.md). A complete package run failing later browser checks remains a failure even when the original independent-consumer build blocker is fixed.
实际命令、退出码、源码边界及未完成验收记录于[实施计划](../superpowers/plans/2026-10-20-glass-delivery-and-select-lifecycle.md)。即使原来的独立消费者构建阻塞已修复，完整包命令在后续浏览器检查失败时仍须报告失败。

以任务基线和最新 32 个精确路径审阅后，统一验证退出 2/BLOCKED_SCOPE；共享文件、新原生配置及夹具导致保守全仓选择，未绕过保护。定向单元、类型、构建、模板、截图检查和完整包验收提供对应覆盖；未额外执行无关独立官网或全仓单元。样式有结构线修复，README 截图只读检查退出 0，无需生成图片。导航动画辅助的间接输入关联和定向策略回归通过。并行 Motion 工作更新的 HEAD、夹具和验证策略均保留，本任务未暂存、提交或推送。

Verification reviewed the original baseline and the current 32 exact paths, then exited 2/BLOCKED_SCOPE: shared inputs and the new native configuration/fixture conservatively select full suites. The guard remains intact; focused units, types, builds, templates, screenshot checks and complete package acceptance provide coverage. Unrelated standalone website/full-unit checks were not added. CSS includes the structural-line fix; the read-only README screenshot check exits 0, requiring no image generation. The navigation animation helper's indirect-input association and focused policy regression pass. Concurrent Motion commits, fixture and policy changes are preserved; this task did not stage, commit or push.
