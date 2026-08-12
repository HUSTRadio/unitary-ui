# 字体映射豁免下的语义几何一致验收设计

## 背景

本项目以官方 Geist 组件为复刻目标，但仓库明确使用 HarmonyOS Sans SC 映射官方 Geist Sans，并使用 Maple Mono 映射官方 Geist Mono。不同字体的字形度量会改变文字宽度、行内图标的横向位置和逐像素结果。若继续要求原始像素零差异，即使组件结构、盒模型和交互契约已经一致，审计仍会稳定失败；若改用统一几何容差，又会掩盖真实的 padding、对齐和图标错误。

本设计把正式验收标准改为「字体映射豁免下的语义几何一致」。豁免仅作用于有证据证明由已批准字体映射造成的差异，不改变组件容器、垂直节奏、视觉状态、可访问性或响应式结构的严格要求。

## 目标

- 让审计结论反映组件语义角色和盒模型是否与官方一致，而不是要求不同字体产生相同字形像素。
- 将每项豁免记录为结构化、可追溯的分类，而不是扩大统一阈值。
- 保留原始像素差、原始几何差和样式差，便于人工诊断。
- 防止字体豁免掩盖真实布局、颜色、状态、ARIA 或响应式错误。

## 非目标

- 不在审计时替换官方或本地字体。
- 不把所有横向差异统一放宽到固定像素阈值。
- 不忽略 `fontSize`、`fontWeight`、`lineHeight`、`letterSpacing` 或颜色差异。
- 不因角色名称包含 `text`、`title` 或 `content` 就自动批准豁免。
- 不把本地页面健康或人工视觉观感等同于官方一致。

## 总体判定模型

每个证据 cell 同时产生两个结论：

1. **原始诊断结果：** 保留截图尺寸、逐像素差、全部角色 rect、样式和 ARIA 差异，不应用豁免。
2. **语义验收结果：** 在显式角色元数据和批准规则下分类差异，只有未豁免的失败项才决定 cell 状态。

语义验收满足以下全部条件时，cell 才能为 `PASS`：

- 官方和本地的必需语义角色均存在，且没有未声明的额外结构角色。
- 所有严格几何字段在既有阈值内。
- 所有严格样式字段一致。
- ARIA、状态和交互契约一致。
- 响应式结构和同角色跨视口变化一致。
- 每个被排除的差异均匹配显式豁免规则，并在报告中留下原因、作用域和原始值。

原始像素差和截图尺寸差不再单独决定 `PASS`，但必须保留在报告中。任何未能归因到批准规则的像素或几何差异仍为失败或待审查项。

## 角色元数据

每个 manifest cell 的 `roleSelectors` 继续负责把官方和本地 DOM 映射到相同语义角色。需要字体豁免的角色还必须声明 `acceptanceProfile`，禁止比较器依据角色名猜测。

支持的 profile：

| Profile              | 适用对象                                                  | 可豁免项                                                 | 仍严格比较                                                                                                                                              |
| -------------------- | --------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strict`             | 容器、表面、控件、未知角色                                | 无字体几何豁免                                           | 全部字段                                                                                                                                                |
| `mapped-text`        | 直接承载文本的 `dt`、`dd`、label、paragraph 等            | `fontFamily`；有字体映射证据时的 `x`、`width`、`right`   | `y`、`height`、`top`、`bottom`、`fontSize`、`fontWeight`、`lineHeight`、`letterSpacing`、颜色、opacity、padding、margin、border、radius、overflow、ARIA |
| `text-adjacent-icon` | 紧邻映射文本、由文本行盒定位的图标或 Tooltip trigger      | 祖先为 `mapped-text` 且图标自身尺寸一致时的 `x`、`right` | `y`、`width`、`height`、图标 path/stroke/color、垂直对齐、状态、ARIA                                                                                    |
| `context-owned-fill` | 双方都填满各自 docs demo wrapper 的组件根或一级 fill 容器 | 由已测 wrapper 内宽差直接传递的 `x`、`width`、`right`    | `y`、`height`、内部 padding/gap、边框、radius、overflow、响应式结构                                                                                     |

未声明 `acceptanceProfile` 的角色默认为 `strict`。

## 字体映射证明

`mapped-text` 和 `text-adjacent-icon` 只有在以下条件全部满足时才能应用豁免：

1. 官方和本地的 `fontFamily` 不同，且二者属于 manifest 的批准映射对：
   - Geist Sans → HarmonyOS Sans SC；
   - Geist Mono → Maple Mono。
2. `fontSize`、`fontWeight`、`lineHeight` 和 `letterSpacing` 均通过严格比较。
3. 角色的垂直几何通过严格比较。
4. 容器的 padding、gap、border 和对齐规则通过严格比较。
5. 差异仅落在该 profile 允许的字段内。

任何一项不满足，相关差异都不能标为字体豁免。

## 上下文拥有宽度证明

`context-owned-fill` 不能仅凭宽度相近自动通过。比较器必须验证：

1. 官方和本地角色都贴合各自已采集的 context root 内容盒；
2. 角色宽度差等于 context root 内容宽度差，误差不超过既有几何阈值；
3. 角色自身没有固定宽度、额外 padding、margin 或 transform 造成差异；
4. 内部严格角色没有出现独立于 context delta 的宽度或位置差。

满足时输出 `CONTEXT_OWNED_WIDTH`；否则保持几何失败。

## 差异分类

比较器至少输出以下结构化分类：

- `STRICT_MATCH`：严格字段全部一致。
- `FONT_FAMILY_MAPPING`：批准字体对的 `fontFamily` 差异。
- `FONT_METRIC_INLINE_GEOMETRY`：`mapped-text` 的横向度量差异。
- `FONT_METRIC_ADJACENT_ICON_X`：文本邻接图标的横向位置差异。
- `CONTEXT_OWNED_WIDTH`：由已测 docs wrapper 宽度差完整传递的 fill 差异。
- `UNEXPLAINED_PIXEL_DELTA`：存在像素差，但角色差异不能被批准规则完整解释。
- `GEOMETRY_MISMATCH`、`STYLE_MISMATCH`、`ARIA_MISMATCH`、`MISSING_ROLE`、`UNEXPECTED_ROLE`、`RESPONSIVE_STRUCTURE_DELTA`：现有严格失败分类。

每个 exclusion 必须记录：

```json
{
  "classification": "FONT_METRIC_INLINE_GEOMETRY",
  "role": "title",
  "fields": ["x", "width", "right"],
  "official": { "x": 0, "width": 277 },
  "local": { "x": 0, "width": 276 },
  "evidence": {
    "fontMapping": "Geist Sans -> HarmonyOS Sans SC",
    "strictTypographyMatched": true,
    "verticalGeometryMatched": true
  }
}
```

禁止只写自由文本 reason 而不记录原始值和证明条件。

## 像素差处理

原始截图继续生成：

- `diff.png`；
- `overlay.png`；
- changed pixels、ratio 和两侧原始尺寸；
- `dimension_mismatch`。

像素差不再直接决定语义验收状态。比较器需要把差异分为：

- `diagnosticPixelStatus`：原始像素是否完全一致；
- `semanticAcceptanceStatus`：应用批准规则后的正式结论。

若角色级严格比较全部通过且所有差异均有结构化批准项，`semanticAcceptanceStatus` 可以为 `PASS`，即使 `diagnosticPixelStatus` 为 `DIFFERENT`。

若仍存在无法解释的像素差，结果必须为 `FAIL` 或 `BLOCKED`；不得仅因组件属于文字类组件就忽略。

## Ledger 与状态

ledger 每个结果必须保存：

- `diagnosticPixelStatus`；
- `semanticAcceptanceStatus`；
- 原始 pixel 和 geometry 摘要；
- `strictFailures`；
- `approvedExclusions`；
- 角色级 classification；
- 官方证据时间戳、本地 revision 和仓库外 artifact 路径。

顶层在矩阵未完成时继续保持 `IN_PROGRESS_NO_COMPLETION_CLAIM`。单个 cell 的正式 `status` 等于 `semanticAcceptanceStatus`，不能由人工描述覆盖。

## Description 试点迁移

现有 `description/default/default/light/375x812` 作为首个迁移 cell：

- `root` 使用 `context-owned-fill`；
- `title` 和 `content` 使用 `mapped-text`；
- `tooltip-shell` 使用 `text-adjacent-icon`；
- `tooltip-trigger` 保持 `strict`，因为其 14 × 14 尺寸、垂直位置、颜色、ARIA 和打开状态都应与官方一致。

迁移后必须重新采集当前提交，而不是直接改写旧 ledger 结论。若 1 px 根宽差能通过 context-owned 证明，文本横向差能通过字体映射证明，且没有其他失败，cell 才可从 `FAIL` 改为 `PASS`。

## 错误处理

- profile 未知、字段配置为空或映射对未批准：collector 或 comparator 必须失败并给出确定性错误。
- profile 允许的字段超出本设计白名单：测试失败，禁止静默接受。
- 缺少 context root 或 font mapping 证明：保持失败，不能降级为自由文本 exclusion。
- 证据过期、artifact 缺失或 revision 不匹配：cell 为 `BLOCKED`，不能沿用旧 PASS。
- 图片尺寸不同：继续生成比较产物；尺寸差进入诊断结果，并由角色和 context 规则决定语义结论。

## 测试策略

遵循 TDD，先增加会失败的契约测试，再改实现：

1. 不带 profile 的角色保持 strict，字体导致的宽度差仍失败。
2. `mapped-text` 在排版和垂直几何一致时豁免横向差。
3. `mapped-text` 的高度、行高、颜色或 padding 不一致时仍失败。
4. `text-adjacent-icon` 只豁免横向位置；图标尺寸、垂直位置或颜色不一致时失败。
5. `context-owned-fill` 只有在角色宽差严格等于 context content-box delta 时通过。
6. 未批准字体对、未知 profile 和越权字段确定性失败。
7. 原始 pixel DIFFERENT 与语义 PASS 能同时存在，且 diff/overlay 仍生成。
8. 存在未解释像素差时不得 PASS。
9. Description 真实 evidence fixture 固化 profile、证明项和正式结论。
10. 全量 ledger validator 拒绝只有自由文本、没有结构化 evidence 的 exclusion。

## 实施边界

实现阶段只修改审计工具链、manifest、ledger schema、fixtures、测试和必要文档。不得为通过新标准而修改组件视觉实现、全局字体、设计 token 或 docs shell。若新规则暴露组件真实失败，应另开独立 TDD 修复切片。

## 完成标准

- 比较器能同时输出原始诊断和语义验收结论。
- 所有字体与 context 豁免都来自显式 profile 和可机验的证明条件。
- Description 试点使用当前 revision 重采并产生可复现结果。
- 定向测试和全量门禁通过。
- ledger 保持真实状态，不因标准变更批量重写未重采 cell。
- 变更以独立签名提交落地并通过 `git verify-commit`。
