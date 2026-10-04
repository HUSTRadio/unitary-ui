# Color scheme capability audit / 配色能力审计

## Existing contracts / 现有能力

The project already has runtime tokens, scoped token writes, a root ThemeProvider, syntax-highlighted Code/CodeBlock and SubFrame-local overlays. It did not have a named color scheme registry or independent inline/block code theme selection. The canonical implementation lives in `src/styles`, `src/lib/tokens.ts` and `src/components/ui`.

项目已有运行时 tokens、局部写入、根主题、语法高亮与 SubFrame 浮层边界；命名配色注册表和独立代码主题此前缺失。SubFrame 是 div，不是 iframe 或 Shadow DOM，不能承诺全局 CSS 或 React 主题上下文隔离。

## Showcase / 正式展示

The bilingual `/color-schemes` docs route uses the existing SubFrame and actual Unitary horizontal logo. Navigation, selectors, theme switch, breadcrumb, form, badges, status and overlays use public Unitary components. Layout geometry stays in the docs stylesheet; text uses standard typography utilities.

正式 docs 页面复用 SubFrame 和 Unitary SVG，导航、选择器、明暗开关、面包屑、表单与浮层均使用库内组件。UI、行内代码、代码块分别选择；语义色块展示角色、值和变量。临时 HTML 已移除。

Default captures all 313 runtime color variables in each existing docs mode. Unitary Blue, Green and Amber reuse current project scale values. Brand actions use the canonical logo blue `#0d47a1`; no new UI color values were authored. The snapshot's resolved focus shadow is rebound to local surface and focus variables when applied, preventing an old shadow from hiding a newly selected focus color.

Default 保存两种 docs 主题各 313 个颜色变量；其他 UI 方案仅从现有色阶取值，品牌动作色来自 logo。局部应用时重新绑定焦点阴影表达式，避免已解析的旧阴影盖过新焦点颜色。

## Code theme provenance / 代码主题来源

- [VS Code Light+ and Dark+](https://github.com/microsoft/vscode/tree/main/extensions/theme-defaults/themes): published syntax colors and editor backgrounds, adapted to Prism roles.
- [VS Code Monokai](https://github.com/microsoft/vscode/blob/main/extensions/theme-monokai/themes/monokai-color-theme.json): published colors including distinct string/number roles and line decorations.
- [Solarized](https://ethanschoonover.com/solarized/): canonical 16-color palette, with the published light/dark base color swap.

Fixed code themes preserve their own mode and colors across UI selections. Default follows UI. Inline and block choices are independent. This is a Prism adaptation, not a complete TextMate ruleset. Light/Dark/Solarized line-state backgrounds use existing project tokens in the code theme's fixed mode; they are documented adaptations rather than claims of exact editor parity.

固定代码主题独立于 UI 与界面明暗；Default 跟随 UI。行内默认保持纯文字。外部色值只用于代码主题；完整编辑器规则未被复制。

## Baseline compatibility assessment / baseline 兼容性评估

Baseline's working tree contains an uncommitted structural refactor affecting about 150 tracked files plus new files. It replaces Stack with Flex, adds Layer portal scopes, reorganizes API/layout/network docs routes and moves Tokens to `/api/tokens`. The showcase avoids a Stack dependency and discovers Tokens by its registered renderer key. It leaves SubFrame and global ThemeProvider contracts unchanged.

baseline 当前有未提交结构调整，与本次 docs 路由接入文件重叠。合并必须保全这些改动，不能自动提交、清除或暂存它们。新页面避免 Stack 依赖，并通过路由注册表定位 Tokens；公共配色 API 应继续组合现有 token API，使用显式局部目标，不添加全局主题状态。

## Validation / 验证

Focused tests cover complete Default token capture, palette membership, exact brand blue, text/button contrast, independent code themes, three-scope CSS export and existing token/code/frame behavior. Browser coverage exercises both docs shell modes, every UI mode and palette, all fixed code themes, standard Select interaction, role swatches, focus/hover/disabled states, normal form behavior, copy/export/reimport, mobile widths, localization and contained overlays.

Fresh results for the final implementation are recorded in the task response. Earlier full-suite sandbox execution had Python subprocess permission and Windows executable lookup failures; rerunning all nine affected files with native Python and normal subprocess permission passed 83 tests. This is not claimed as a single successful full-suite run. README capture has exhibited intermittent paged-media-light drift; a successful capture does not substitute for its read-only stability check.

## Public API implementation / 公共 API 落地

The shared engine now lives in `src/lib/color-schemes`. Package-root exports provide immutable COLOR_SCHEMES/CODE_THEMES registries, validated lookups, pure role resolution, three-scope CSS generation, applyColorScheme and applyCodeTheme. Applications require an explicit target and mode; null refs are safe no-ops. Cleanup restores owned values, priorities and attributes without overwriting subsequent external edits. The docs showcase consumes these functions, and the bilingual `/api/color-schemes` page specifies their contracts.

公共引擎已移入库内，没有保留第二套 docs 实现。API 复用 setTokens，通过正常 DOM 继承与现有 SubFrame 和 baseline 的 Layer 结构组合，不新增全局状态或修改 portal 的公共行为。

The first showcase commit was e926239. A normal `git merge --ff-only codex/color-schemes` in baseline exited 1 because its uncommitted docs registry, loader, App, corpus index and route test edits would be overwritten. Baseline remained at its prior HEAD; no unrelated changes were stashed, committed or removed. API work continued against the observed baseline contracts in the isolated feature branch.

首轮合并被 Git 正常拒绝，baseline 原有改动已保全。实际包的 ESM/CJS 导入、SSR、CSS、声明、字体及许可文件均已检查。最终测试结果以完成回复的新鲜输出为准。
