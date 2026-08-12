# 字体映射豁免下的语义几何一致验收设计

## 背景

本项目以官方 Geist 组件为复刻目标，但仓库明确使用 HarmonyOS Sans SC 映射官方 Geist Sans，并使用 JetBrains Maple Mono 映射官方 Geist Mono。不同字体的字形度量会改变文字宽度、行内图标的横向位置和逐像素结果。若继续要求原始像素零差异，即使组件结构、盒模型和交互契约已经一致，审计仍会稳定失败；若改用统一几何容差，又会掩盖真实的 padding、对齐和图标错误。

本设计把正式验收标准改为「字体映射豁免下的语义几何一致」。豁免仅作用于有证据证明由已批准字体映射造成的差异，不改变组件容器、垂直节奏、视觉状态、可访问性或响应式结构的严格要求。

## 目标

- 让审计结论反映组件语义角色和盒模型是否与官方一致，而不是要求不同字体产生相同字形像素。
- 将每项豁免记录为结构化、可追溯的分类，而不是扩大统一阈值。
- 保留原始像素差、原始几何差和样式差，便于人工诊断。
- 防止字体豁免掩盖真实布局、颜色、状态、ARIA 或响应式错误。

## 非目标

- 不在审计时替换官方或本地字体。
- 不把所有横向差异统一放宽到固定像素阈值。
- 不因角色名称包含 `text`、`title` 或 `content` 就自动批准豁免。
- 不把本地页面健康或人工视觉观感等同于官方一致。

## 总体判定模型

每个证据 cell 同时产生两个结论：

1. **原始诊断结果：** 保留截图尺寸、逐像素差、全部角色 rect、样式和 ARIA 差异，不应用豁免。
2. **语义验收结果：** 在显式角色元数据和批准规则下分类差异，只有未豁免的失败项才决定 cell 状态。

语义验收满足以下全部条件时，cell 才能为 `PASS`：

- 官方和本地的必需语义角色均存在，且没有单侧出现的交互或 ARIA 语义节点。
- 所有严格几何字段在既有阈值内。
- 所有严格样式字段一致。
- ARIA、状态和交互契约一致。
- 响应式结构和同角色跨视口变化一致。
- 每个被排除的差异均匹配显式豁免规则，并在报告中留下原因、作用域和原始值。

原始像素差和截图尺寸差不再单独决定 `PASS`，但必须保留在报告中。任何未能归因到批准规则的像素或几何差异仍为失败或待审查项。

## 集成与 schema 演进

现有工具链的 manifest、evidence cell、comparison 和 ledger 使用不同结构，不能把 profile 临时塞入 comparator 或依赖 CLI 人工传参。实施时采用以下单一数据流：

1. `geist-audit-manifest.json` 升级到 schema v2，作为批准策略和角色契约的唯一来源。
2. `collect-replica-evidence.mjs` 根据 manifest 中的精确 contract 解析当前 source、viewport 和角色选择器；采集出的 evidence cell 升级到 v2，并固化解析后的 contract 与 digest。
3. `compare-replica-evidence.py` 同时读取 official/local evidence cell 和当前 contract，输出 comparison schema v3。只给旧式 metrics 参数的调用可继续生成诊断产物，但 `semanticAcceptanceStatus` 必须为 `BLOCKED`，不能形成验收证据。
4. `geist-audit-ledger.json` 升级到 schema v2，只引用 comparison v3 的正式结论，不自行重新解释差异。

manifest v2 顶层用结构化 `acceptancePolicy` 取代人类可读的 `globalExclusionPolicy`。现有组件级 `approvedExclusions: string[]` 全部为空，v2 将其删除；实际使用的 `approvedExclusions` 只出现在 comparison 和 ledger 输出中，且两处使用同一对象形状。

schema 文件边界明确为：

- `geist-audit-manifest.schema.json`：manifest v2、policy、contract 和 role contract；
- `evidence-cell.schema.json`：resolved evidence cell v2；
- `comparison.schema.json`：comparison v3；
- `geist-audit-ledger.schema.json`：ledger v2；
- `geist-audit-shared.schema.json`：status、classification、strict failure 和 approved exclusion 的共享 `$defs`。

validator 必须用支持本地 `$ref` 的同一 Ajv 实例加载以上 schema；不能只在 TypeScript 测试里手写局部 shape 判断。fixture 必须逐个通过对应 schema 后才能参与行为测试。

每个具备验收证据的组件通过 `acceptanceContracts` 声明精确到 `(demoId, variant, state)` 的合同。合同至少包含：

- `clipRole`：截图和根 metrics 的角色；
- `evidenceNotBefore`：该合同允许使用的最早官方采集时间；
- `roles`：角色名到角色合同的对象；
- 每个角色的 official/local selector、`acceptanceProfile`、presence 和坐标拥有者；
- profile 需要的 `textRole`、`flowAnchorRole`、`contextOwnerRole` 或锚边等显式依赖。

selector 可以声明 `default`，并按 viewport 覆盖；解析顺序为精确 viewport → `default`。禁止 comparator 根据角色名、tag 或 selector 内容推断 profile。未声明 `acceptanceProfile` 的角色默认为 `strict`。pending 组件可以暂时没有 `acceptanceContracts`，但没有覆盖目标 cell 的精确 contract 时，该 cell 只能为 `BLOCKED`。

resolved evidence cell v2 必须保存 `contractDigest`，comparison v3 必须验证 official、local 和当前 manifest 三者完全相同。这样 profile 的批准边界可追溯到 manifest，而不是仓库外命令行。

comparison v3 的规范字段为：

- `diagnosticPixelStatus: IDENTICAL | DIFFERENT | UNAVAILABLE`；
- `semanticAcceptanceStatus: PASS | FAIL | BLOCKED`；
- `status`：为兼容现有消费者而保留，值必须严格等于 `semanticAcceptanceStatus`；
- `strictFailures`：结构化失败数组；
- `approvedExclusions`：结构化豁免数组；
- `roleComparisons`：每个角色包含 `verdict`、原始差异、`strictFailures` 和 `approvedExclusions`；
- `pixelDiff`、`normalizedGeometry`、`missingPaths` 和 `artifacts`：保留诊断数据。

comparison v2 的 `approved_exclusions`、`style_failures` 和单一 `classification` 不再作为 v3 规范字段。ledger v2 保存 comparison 中对应的 `strictFailures` 和 `approvedExclusions` 条目，禁止把自由文本 style failure 当成结构化结论。

## 角色元数据

所有角色 rect 同时保留页面绝对值和相对值。严格几何默认相对 `clipRole` 比较；角色可声明 `coordinateOwnerRole`，此时 `x`、`y`、`right` 和 `bottom` 相对该 owner 的内容盒归一化。依赖必须无环，owner 必须在同一 viewport 存在。该机制用于区分“父级因字体移动”和“子级自身几何错误”，不构成豁免。

支持的 profile：

| Profile               | 适用对象                                             | 可豁免项                                                                  | 仍严格比较                                                                                                                                              |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strict`              | 容器、表面、固定尺寸控件、未知角色                   | 批准字体对的 `fontFamily`；无字体几何豁免                                 | 除 `fontFamily` 身份外的全部字段                                                                                                                        |
| `mapped-text`         | 直接承载文本的 `dt`、`dd`、label、paragraph 等       | `fontFamily`；有字体映射证据时的 `width`、`right`；有 flow 锚证明时的 `x` | `y`、`height`、`top`、`bottom`、`fontSize`、`fontWeight`、`lineHeight`、`letterSpacing`、颜色、opacity、padding、margin、border、radius、overflow、ARIA |
| `text-adjacent-icon`  | 紧邻映射文本、由文本行盒定位的图标或 Tooltip shell   | 锚边位移完整传递时的 `x`、`right`                                         | `y`、`width`、`height`、图标 path/stroke/color、垂直对齐、状态、ARIA                                                                                    |
| `text-sized-control`  | Button、Badge、Chip、Tab 等由文本内在宽度决定的控件  | `textRole` 证明完整传递时的 `fontFamily` 和 `width`                       | `x`、`y`、`height`、padding、gap、border、radius、图标几何、状态、ARIA                                                                                  |
| `measurement-context` | 组件截图外、仅用于归因的 docs host 内容盒            | 已声明轴上的 `x`、`width`、`right`，只作为 context 原始输入               | `y`、`height`、box-sizing、padding、border、transform、overflow；禁止成为组件 PASS 的唯一角色                                                           |
| `context-owned-fill`  | 填满显式 `contextOwnerRole` 内容盒的组件或 fill 容器 | context 内容盒差完整传递时的 `x`、`width`、`right`                        | `y`、`height`、内部 padding/gap、边框、radius、overflow、响应式结构                                                                                     |

`measurement-context` 不是组件角色豁免。它只能位于 `clipRole` 之外、被至少一个 `context-owned-fill` 引用，并输出 `HOST_CONTEXT_GEOMETRY` 诊断 exclusion；其差异不能遮蔽组件自身失败。`text-sized-control` 不豁免控件的页面横向位置。多控件 flow 因前序文本宽度产生位移时，优先将每个控件设为独立 `clipRole` 或通过坐标 owner 隔离；在没有额外可机验证明前不得扩展为全局 flow 容差。

## 字体映射证明

批准字体对的 `fontFamily` 身份差异可在所有 profile 上输出 `FONT_FAMILY_MAPPING`，但它本身不允许任何几何差异。`mapped-text`、`text-adjacent-icon` 和 `text-sized-control` 只有在以下条件全部满足时才能进一步应用字体几何豁免：

1. 官方和本地 computed `fontFamily` 的首个有效 family 不同，且二者命中 manifest v2 `acceptancePolicy.approvedFontMappings` 中已批准的有向映射。
2. `fontSize`、`fontWeight`、`lineHeight` 和 `letterSpacing` 均通过严格比较。
3. 角色的垂直几何通过严格比较。
4. 容器的 padding、gap、border 和对齐规则通过严格比较。
5. 差异仅落在该 profile 允许的字段内。

任何一项不满足，相关差异都不能标为字体豁免。

`mapped-text` 自身字体度量只能直接证明 `width` 以及由同一 `x + width` 推导出的 `right`。它的 `x` 默认严格；只有 contract 显式声明 `flowAnchorRole`、双方 DOM 顺序和布局方向一致，并验证 `textXDelta - anchorEdgeDelta` 的有符号残差通过时，才能输出 `FONT_METRIC_INLINE_FLOW_X`。这避免把真实的左 padding、margin 或定位错误归因给字体。

`text-adjacent-icon` 必须显式声明 `textRole` 和 `anchorEdge`（`left | right`）。双方 DOM 顺序、布局方向、computed gap/margin 必须严格一致，并验证 `iconEdgeDelta - textAnchorEdgeDelta` 的有符号残差通过；仅凭角色名或邻接关系不能豁免。满足时输出 `FONT_METRIC_ADJACENT_ICON_X`。

初始批准映射只有：

- `Geist` → `HarmonyOS Sans SC`；
- `Geist Mono` → `JetBrains Maple Mono`。

上面的键是本轮 live computed style 与 `src/styles/index.css` 的首个有效 family，不是品牌展示名：官方 Sans 的品牌名称是 Geist Sans，但 computed family 键为 `Geist`；本地 Mono 的实际键是 `JetBrains Maple Mono`，不能缩写为 `Maple Mono`。匹配时先去除引号、规范化空白和大小写，但不把 fallback stack 中任意共同字体视为命中。新增、别名化或扩展映射都会改变全局验收边界，必须修改 manifest schema 约束、增加负向测试并独立人工 review；禁止在单个 ledger cell 临时批准。

### 文本驱动控件宽度证明

`text-sized-control` 只有满足以下条件时才能豁免外宽差：

1. 合同显式引用一个 `mapped-text` 的 `textRole`，且该文本角色已经通过字体映射证明；
2. 控件高度、padding、gap、border、图标宽度和其他非文本子项严格一致；
3. 使用有符号差值验证 `controlWidthDelta - textWidthDelta`，残差在既有几何阈值内；
4. 控件没有 `width`、`min-width`、`max-width`、stretch 或 transform 等其他宽度来源；
5. 文本不换行、未省略且未被裁切。

满足时输出 `FONT_METRIC_CONTROL_WIDTH`。任何条件不满足，控件宽差保持 `GEOMETRY_MISMATCH`。

### 文本换行规则

字体映射不会豁免换行和垂直 reflow。collector 必须为 `mapped-text` 记录 `clientRects` 行盒数量与各行 rect。若官方和本地行数、角色高度或后续严格角色的纵向位置不同，输出 `FONT_METRIC_REFLOW` strict failure，cell 为 `FAIL`。这项分类说明根因可能来自字体映射，但不把已改变的语义几何视为一致。

## 上下文拥有宽度证明

`context-owned-fill` 不能仅凭宽度相近自动通过。比较器必须验证：

1. 合同显式声明同一 cell 中的 `contextOwnerRole`，且 official/local 两侧该 owner 都存在；
2. 官方和本地角色都贴合各自 owner 的内容盒；
3. 使用有符号差值验证 `roleDelta - ownerContentBoxDelta`，残差不超过既有几何阈值；
4. 角色自身没有固定宽度、额外 padding、margin 或 transform 造成差异；
5. 内部严格角色没有出现独立于 context delta 的宽度或位置差。

几何阈值只作用于残差，不作用于原始 role delta 或 owner delta。例如角色和 owner 都相差 1 px 时，残差为 0 px，不需要把全局阈值放宽到 1 px。满足时输出 `CONTEXT_OWNED_WIDTH`；否则保持几何失败。

## 结构与语义节点

现有 collector 已采集根下全部 `metrics.nodes`，comparator 也会对 DOM path 集合生成 `missingPaths`，因此普通结构差异不是完全不可观测。但官方和本地允许使用不同透明 wrapper，不能把所有 path 差异都等同于语义失败，也不在本轮引入高成本、易误判的通用 DOM 树编辑距离算法。

manifest 合同改为显式列出：

- `roles`：必须逐项比较的语义角色；
- `semanticNodeInventory`：根下必须一致的交互与 ARIA 节点计数，例如 `button`、`a[href]`、`input`、`[role]`，以及通过 `getAttributeNames()` 识别任意 `aria-` 前缀属性的节点；`[aria-*]` 不是合法 CSS selector，禁止把它写进 contract；
- `allowedStructuralPaths`：仅用于已审核、无语义、无布局所有权的 wrapper path 差异。

单侧缺失角色、语义节点 inventory 不一致或未批准 path 差异均进入 `strictFailures`。普通包装层只有在无 ARIA/交互语义、不拥有 padding/gap/position/transform/overflow 等布局规则，且命中结构化 allowlist 时才允许排除。原规格中的“没有未声明的额外结构角色”只指这套可机验范围，不承诺发现选择器合同之外的任意业务语义。

## 差异分类

比较器至少输出以下结构化分类：

- `STRICT_MATCH`：严格字段全部一致。
- `FONT_FAMILY_MAPPING`：批准字体对的 `fontFamily` 差异。
- `FONT_METRIC_INLINE_GEOMETRY`：`mapped-text` 的横向度量差异。
- `FONT_METRIC_INLINE_FLOW_X`：由已证明的前序文本锚边位移传递到当前文本的横向位置差异。
- `FONT_METRIC_ADJACENT_ICON_X`：文本邻接图标的横向位置差异。
- `FONT_METRIC_CONTROL_WIDTH`：文本内在宽度完整传递到控件外宽。
- `CONTEXT_OWNED_WIDTH`：由已测 docs wrapper 宽度差完整传递的 fill 差异。
- `UNEXPLAINED_PIXEL_DELTA`：结构化差异无法解释的非字体像素差，经确定性 mask 仍存在。
- `GEOMETRY_MISMATCH`、`STYLE_MISMATCH`、`ARIA_MISMATCH`、`MISSING_ROLE`、`UNEXPECTED_ROLE`、`UNEXPECTED_STRUCTURE`、`FONT_METRIC_REFLOW`、`RESPONSIVE_STRUCTURE_DELTA`：严格失败分类。

每个 exclusion 必须记录：

```json
{
  "classification": "FONT_METRIC_INLINE_GEOMETRY",
  "role": "title",
  "fields": ["x", "width", "right"],
  "official": { "x": 0, "width": 277 },
  "local": { "x": 0, "width": 276 },
  "evidence": {
    "fontMapping": "Geist -> HarmonyOS Sans SC",
    "strictTypographyMatched": true,
    "verticalGeometryMatched": true
  }
}
```

禁止只写自由文本 reason 而不记录原始值和证明条件。

`approvedExclusions` 的统一对象 schema 至少要求 `classification`、`role`、非空 `fields`、`official`、`local` 和结构化 `evidence`；`strictFailures` 至少要求 `classification`、`role`、非空 `fields`、`official` 和 `local`，可附带只用于展示的 `message`。两类对象都禁止 `additionalProperties`，classification 使用枚举，字段名使用各 classification 的白名单。comparison 和 ledger 引用同一 `$defs`，不得复制出两套相似但不相同的定义。

## 响应式判定

profile 按 viewport 独立应用，不能先聚合 viewport 再统一豁免。`responsiveDelta` 使用每个端点完成 profile 分类后的**有符号有效几何值**计算：

- `mapped-text` 的横向差只有在两个端点各自通过字体映射证明时才可排除；
- `text-sized-control` 和 `context-owned-fill` 必须在两个端点分别满足残差证明；
- presence、换行数、垂直几何、样式或结构变化不受字体 profile 豁免；
- 任一端点 `FAIL` 或 `BLOCKED` 时，跨视口结果不能为 `MATCH`。

因此，同一文本角色在 375 px 和 768 px 下都只存在字体宽度差，可以保持响应式一致；若其中一个 viewport 因字体映射多换一行，则输出 `FONT_METRIC_REFLOW` 和 `RESPONSIVE_STRUCTURE_DELTA`。

## 像素差处理

原始截图继续生成：

- `diff.png`；
- `overlay.png`；
- changed pixels、ratio 和两侧原始尺寸；
- `dimension_mismatch`。

像素差不再直接决定语义验收状态。比较器需要把差异分为：

- `diagnosticPixelStatus`：原始像素是否完全一致；
- `semanticAcceptanceStatus`：应用批准规则后的正式结论。

若角色级严格比较全部通过且所有差异均有结构化批准项，`semanticAcceptanceStatus` 可以为 `PASS`，即使 `diagnosticPixelStatus` 为 `DIFFERENT`。截图或 pixel artifact 不可读时为 `UNAVAILABLE`，cell 必须 `BLOCKED`；不能把“没有运行像素比较”误记为 `IDENTICAL`。

若仍存在无法解释的像素差，结果必须为 `FAIL` 或 `BLOCKED`；不得仅因组件属于文字类组件就忽略。

像素归因使用确定性 mask，而不是人工观察：

1. `mapped-text` 仅在 official/local 文本 role rect 的并集内生成候选 mask，允许为抗锯齿边缘扩展 1 个 device pixel；
2. `text-adjacent-icon` 仅在 official/local 图标 role rect 的并集内生成候选 mask；
3. `text-sized-control` 只复用其 `textRole` mask，不 mask 整个按钮、边框或背景；
4. `context-owned-fill` 只 mask 由有符号 owner delta 产生的边缘条带，不 mask 整个组件表面；
5. 所有 mask 都必须记录来源 role、原始 rect 和扩展量。

候选矩形不是自动豁免区。像素只有在对应 role 的前景色、opacity 和背景 computed style 已严格一致，且差异像素至少一侧与该前景 alpha 合成色匹配时才能进入最终 mask；纯背景、边框、阴影或状态层差异不能因落在文字 rect 内而被吞掉。实现允许使用确定性的颜色距离阈值处理抗锯齿，但阈值必须固定在 policy、写入报告并有“相同 rect 内背景色错误仍 FAIL”的负向测试。

changed pixel 落在最终 mask 外时输出 `UNEXPLAINED_PIXEL_DELTA`。扩展量固定为 1 个 device pixel，只处理字体光栅化边缘，不改变 CSS 几何阈值。若 device scale factor 不是 1，必须按实际 device pixel ratio 记录和换算；本项目默认采集为 1。

## 证据 freshness 与 revision

freshness 不使用“距现在 N 天”的滚动 TTL；否则持久 ledger 会在代码没有变化时仅因时间经过而自动失效。采用内容和审计 epoch 门禁：

1. manifest v2 `acceptancePolicy.evidenceEpochNotBefore` 定义本轮官方证据的最早 ISO 8601 时间；单个 contract 可以用更晚的 `evidenceNotBefore` 覆盖。
2. official evidence 的 `sourceTimestamp` 必须不早于有效门禁，URL、component、demo、state、theme 和 viewport 必须与 contract 精确一致。
3. official/local evidence 必须携带相同的 `auditRunId` 和 `contractDigest`，并记录 evidence schema、collector 源文件 SHA-256 和浏览器版本；comparison 记录 comparator 源文件 SHA-256。禁止拼接不同采集轮次的截图与 metrics，也禁止来源未知的 producer 形成正式 PASS。
4. local collector 在采集前记录 40 位 `localRevision`、`worktreeClean: true` 和 `localSourceDigest`。工作树不干净时拒绝生成 acceptance evidence。
5. manifest v2 `acceptancePolicy.localSourceInputs` 明确受审 UI 输入 glob。collector 仅纳入 Git 已跟踪的匹配文件，按“POSIX 相对路径 + NUL + 文件内容”排序后计算 SHA-256，并把实际文件清单写入 evidence。初始 glob 至少覆盖 `src/**`、`public/fonts/**`、`docs/geist/src/**`、`docs/geist/public/**`、根与 docs app 的 `package.json`、当前 lockfile、`components.json`、`vite.config.*`、`docs/geist/vite.config.*` 和所有参与 CSS 构建的配置文件。
6. validator 对当前 checkout 重新计算 digest。digest 不同、revision 不是提交 SHA、artifact 缺失或 producer status 非成功时，cell 为 `BLOCKED`。

`localRevision` 用于追溯，不要求永远等于 ledger 提交后的 `HEAD`；ledger、spec 或审计脚本的后续提交不会改变 UI digest。修改 `localSourceInputs` 本身会改变 policy 和 `contractDigest`，因此必须重采。若受审 UI 输入变化，即使 SHA 仍可解析，旧证据也必须失效。该规则无法自动发现官方站点在门禁之后的未公告变化；开始新审计轮次时必须更新 epoch 并重采，不能沿用上一轮 PASS。

## Ledger 与状态

ledger 每个结果必须保存：

- `diagnosticPixelStatus`；
- `semanticAcceptanceStatus`；
- 原始 pixel 和 geometry 摘要；
- `strictFailures`；
- `approvedExclusions`；
- 角色级 classification；
- 官方证据时间戳、`auditRunId`、`contractDigest`、本地 revision、`localSourceDigest`、`worktreeClean` 和仓库外 artifact 路径。

顶层在矩阵未完成时继续保持 `IN_PROGRESS_NO_COMPLETION_CLAIM`。单个 cell 的正式 `status` 等于 `semanticAcceptanceStatus`，不能由人工描述覆盖。

## Description 试点迁移

现有 `description/default/default/light/375x812` 作为首个迁移 cell：

- `demo-context` 使用 `measurement-context`，作为 `root` 的 `contextOwnerRole` 采集双方 docs wrapper 内容盒；
- `root` 使用 `context-owned-fill`；
- `title` 和 `content` 使用 `mapped-text`；
- `tooltip-shell` 使用 `text-adjacent-icon`，`textRole` 指向 `title`；
- `tooltip-trigger` 保持 `strict`，`coordinateOwnerRole` 指向 `tooltip-shell`，因此其 14 × 14 尺寸、相对位置、颜色、ARIA 和打开状态都必须与官方一致，而不会因父 shell 的字体横向位移误报。

对应的 manifest contract 形状如下；selector 值以重采前的 live discovery 为准，示例只固定字段结构：

```json
{
  "demoId": "default",
  "variant": "default",
  "state": "default",
  "clipRole": "root",
  "evidenceNotBefore": "2026-08-12T00:00:00.000Z",
  "roles": {
    "demo-context": {
      "selectors": { "official": "[LIVE_SELECTOR]", "local": "[LIVE_SELECTOR]" },
      "acceptanceProfile": "measurement-context",
      "measurementAxes": ["x", "width", "right"]
    },
    "root": {
      "selectors": { "official": "[LIVE_SELECTOR]", "local": "[LIVE_SELECTOR]" },
      "acceptanceProfile": "context-owned-fill",
      "contextOwnerRole": "demo-context"
    },
    "title": {
      "selectors": { "official": "[LIVE_SELECTOR]", "local": "[LIVE_SELECTOR]" },
      "acceptanceProfile": "mapped-text"
    },
    "tooltip-shell": {
      "selectors": { "official": "[LIVE_SELECTOR]", "local": "[LIVE_SELECTOR]" },
      "acceptanceProfile": "text-adjacent-icon",
      "textRole": "title",
      "anchorEdge": "right"
    },
    "tooltip-trigger": {
      "selectors": { "official": "[LIVE_SELECTOR]", "local": "[LIVE_SELECTOR]" },
      "acceptanceProfile": "strict",
      "coordinateOwnerRole": "tooltip-shell"
    }
  }
}
```

`[LIVE_SELECTOR]` 不是实施占位符：它明确表示 schema 示例不能批准未经本轮 live discovery 复核的 selector。真正写入 manifest 的每个 selector 必须是非空、可在对应 source 唯一命中的具体字符串，schema 和采集测试必须拒绝该哨兵值。

迁移后必须重新采集当前提交，而不是直接改写旧 ledger 结论。若 1 px 根宽差能通过 context-owned 证明，文本横向差能通过字体映射证明，且没有其他失败，cell 才可从 `FAIL` 改为 `PASS`。

## 错误处理

- profile 未知、字段配置为空或映射对未批准：collector 或 comparator 必须失败并给出确定性错误。
- profile 允许的字段超出本设计白名单：测试失败，禁止静默接受。
- 缺少 context root 或 font mapping 证明：保持失败，不能降级为自由文本 exclusion。
- evidence epoch 过期、`auditRunId` / `contractDigest` 不一致、UI source digest 变化、artifact 缺失、dirty worktree 或 revision 不是提交 SHA：cell 为 `BLOCKED`，不能沿用旧 PASS。
- 图片尺寸不同：继续生成比较产物；尺寸差进入诊断结果，并由角色和 context 规则决定语义结论。

## 测试策略

遵循 TDD，先增加会失败的契约测试，再改实现：

1. 不带 profile 的角色保持 strict，字体导致的宽度差仍失败。
2. `mapped-text` 在排版和垂直几何一致时豁免横向宽度差。
3. `mapped-text` 的高度、行高、颜色或 padding 不一致时仍失败。
4. `mapped-text` 的 `x` 默认严格；只有显式 flow anchor 的有符号残差通过时才豁免。
5. `text-adjacent-icon` 只有锚边位移残差通过时豁免横向位置；图标尺寸、垂直位置、gap 或颜色不一致时失败。
6. `text-sized-control` 只有在控件宽差与显式 text role 宽差残差通过时豁免；padding、图标或固定宽度差仍失败。
7. `measurement-context` 只能被组件角色引用；host 差异不参与组件 verdict，也不能遮蔽组件自身失败。
8. `context-owned-fill` 只有在角色与显式 owner 的有符号宽差残差通过时豁免，验证阈值作用于残差而非原 delta。
9. 未批准字体对、未知 profile、循环 owner 依赖和越权字段确定性失败。
10. 原始 pixel DIFFERENT 与语义 PASS 能同时存在，且 diff/overlay 仍生成；pixel artifact 不可用时为 BLOCKED。
11. `dimension_mismatch: true` 可与语义 PASS 共存，但尺寸差必须被 context 或字体角色完整证明。
12. mask 外存在 changed pixel 时输出 `UNEXPLAINED_PIXEL_DELTA`，不得 PASS。
13. `mapped-text` 在任一 viewport 发生换行数或高度变化时输出 `FONT_METRIC_REFLOW`；不因字体映射豁免垂直 reflow。
14. responsiveDelta 在每个端点独立应用 profile；端点未通过时跨视口结果不能为 MATCH。
15. schema 测试接受 manifest v2、evidence v2、comparison v3 和 ledger v2 的完整结构，并拒绝旧版本冒充正式 PASS。
16. freshness 测试拒绝 epoch 之前的 official evidence、不同 run/contract digest、dirty worktree、非 40 位 SHA、未知 producer 和变化的 local source digest。
17. Description 真实 evidence fixture 固化 profile、坐标 owner、锚边证明项和正式结论。
18. 全量 ledger validator 拒绝只有自由文本、没有结构化 evidence 的 exclusion。

## 实施边界

实现阶段只修改审计工具链、manifest、ledger schema、fixtures、测试和必要文档。不得为通过新标准而修改组件视觉实现、全局字体、设计 token 或 docs shell。若新规则暴露组件真实失败，应另开独立 TDD 修复切片。

## 完成标准

- 比较器能同时输出原始诊断和语义验收结论。
- 所有字体与 context 豁免都来自显式 profile 和可机验的证明条件。
- Description 试点使用当前 revision 重采并产生可复现结果。
- 定向测试和全量门禁通过。
- ledger 保持真实状态，不因标准变更批量重写未重采 cell。
- 变更以独立签名提交落地并通过 `git verify-commit`。
