# Geist 组件 API 破坏性迁移说明

> **状态：已实施并验收。** 2026-08-09 已完成仓库内真实引用迁移、旧文件删除、72/72 文档接线、运行时路由、交互和视觉验收。

## 目标与边界

本次迁移将仓库内旧的本地命名和 API 直接替换为 Geist 官方组件命名：

- `DropdownMenu` → `Menu`
- `SegmentedControl` → `Switch`，但仅限 2–3 个互斥选项；不适合 `Switch` 的现有用法改用 `Select`
- `ThemeSwitch` → `ThemeSwitcher`

迁移范围仅包含**当前仓库中实际存在的引用**。不推测外部消费者，不保留旧导出、旧文件、旧路由、deprecated alias、兼容 wrapper 或双轨 API。

> `docs/geist-markdown-refs/` 是官方规范快照，不是本地旧 API 的消费者。迁移期间仅将其作为目标 API 和 Best Practices 的依据；全部视觉验收通过后再统一更新实测数据。

## 迁移后的目标文件

| 目标文件                               | 公开 API                                                                                               | 状态                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `src/components/ui/menu.tsx`           | `MenuContainer`、`MenuButton`、`Menu`、`MenuItem`，以及当前消费者实际需要的 separator / alignment 能力 | 已实现并接线                                             |
| `src/components/ui/switch.tsx`         | `Switch`、`SwitchControl`                                                                              | 已实现并接线；`defaultChecked` 已由根 group 映射为默认值 |
| `src/components/ui/theme-switcher.tsx` | `ThemeSwitcher`                                                                                        | 已实现并接线                                             |

迁移中已删除：

- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/segmented-control.tsx`
- `src/components/ui/theme-switch.tsx`

后续全量验收还发现并删除了代理为迁移期临时保留的双轨接口：

- Avatar、Banner、Breadcrumbs、Browser、Book、Empty State、Pagination、Tabs、Toast、Tooltip、Video 的旧 compound exports；
- Badge 的旧语义 variant 名；
- Copy Button、Gauge、Grid、Label、Middle Truncate、Note、Snippet、Status Dot、Text With Copy Button 的旧 prop alias；
- 所有仓库内消费者和文档代码片段均已迁移到最终契约，`tests/docs-coverage.test.ts` 持续阻止这些标识回流。

## API 替换关系

### Menu

| 旧引用                          | 新引用                 | 说明                                                                    |
| ------------------------------- | ---------------------- | ----------------------------------------------------------------------- |
| `@/components/ui/dropdown-menu` | `@/components/ui/menu` | 直接更换模块路径                                                        |
| `DropdownMenu`                  | `MenuContainer`        | 菜单状态和触发器的根容器                                                |
| `DropdownMenuTrigger`           | `MenuButton`           | 不保留 `asChild` 兼容 API；按 `MenuButton` 的正式 API 重写调用处        |
| `DropdownMenuContent`           | `Menu`                 | 菜单浮层；只实现当前消费者需要的宽度和对齐能力                          |
| `DropdownMenuItem`              | `MenuItem`             | 破坏性条目改用正式的 `type="error"`，不再靠调用点拼接 destructive class |
| `DropdownMenuSeparator`         | Menu 的 separator API  | 名称以最终 `menu.tsx` 实现为准，不保留旧名转发                          |

旧文件导出的 checkbox、radio、sub-menu、label、shortcut 等符号目前没有仓库消费者。迁移时不为这些未使用 API 创建替代层。

### Switch

旧 `SegmentedControl` 是受控的 `options` 数组 API；新 `Switch` 使用组合式 radio API：

```tsx
<Switch name="view" value={view} onValueChange={setView}>
  <SwitchControl label="Source" value="source" />
  <SwitchControl label="Output" value="output" />
</Switch>
```

替换规则：

- `options` 数组展开为显式 `SwitchControl`。
- `ariaLabel` 改为 `aria-label`。
- 必须传 `name`，保证底层 radio 正确分组。
- 受控用法保留 `value` / `onValueChange`。
- 非受控用法必须且只能在一个 `SwitchControl` 上设置 `defaultChecked`，或在根组件设置等效初始值。
- 超过 3 个选项的现有调用不得机械迁移为 `Switch`，应改用 `Select`。
- 旧 `activeClass` / `idleClass` 没有当前仓库调用，不迁移。

### ThemeSwitcher

| 旧引用                         | 新引用                           |
| ------------------------------ | -------------------------------- |
| `@/components/ui/theme-switch` | `@/components/ui/theme-switcher` |
| `<ThemeSwitch />`              | `<ThemeSwitcher />`              |

`ThemeSwitcher` 是 Light / System / Dark 三态控件，支持当前官方文档需要的 `compact` 和 `disabled`。不保留下拉式 `ThemeSwitch`。

## 当前真实引用与迁移方式

### 1. `src/App.tsx`

当前引用：

- `src/App.tsx:9`：导入 `SegmentedControl`。
- `src/App.tsx:28`：导入 `ThemeSwitch`。
- `src/App.tsx:85`：页头渲染 `<ThemeSwitch />`。
- `src/App.tsx:90`：移动端导航使用 5 项 `SegmentedControl`。
- `src/App.tsx:176`：组件总览展示 3 项 `SegmentedControl`。

迁移：

1. 页头直接改用 `ThemeSwitcher`。
2. 移动端导航有 5 个选项，不符合 Switch 的 2–3 项约束；改用现有 `Select`，复用 `NAV` 数据。
3. 组件总览中的 3 项筛选改为 `Switch` + 3 个 `SwitchControl`。
4. 标题由 `SegmentedControl` 改为 `Switch`。

### 2. `src/examples/DataTableExample.tsx`

当前引用：

- `src/examples/DataTableExample.tsx:8`：导入 `SegmentedControl`。
- `src/examples/DataTableExample.tsx:18`：组件说明引用旧名称。
- `src/examples/DataTableExample.tsx:104`：状态筛选包含 4 个选项。

迁移：

- 4 项筛选不迁移为 `Switch`；改用 `Select`。
- 保留现有 `filter` 状态和筛选逻辑，只替换控件及标签。
- 更新组件说明中的旧名称。

### 3. `docs/site/src/components/docs-shell.tsx`

当前引用：

- `docs/site/src/components/docs-shell.tsx:5`：导入 `SegmentedControl`。
- `docs/site/src/components/docs-shell.tsx:19`：维护本地 `THEME_OPTIONS`。
- `docs/site/src/components/docs-shell.tsx:47`：直接操作 `useTheme`。
- `docs/site/src/components/docs-shell.tsx:74`：用 `SegmentedControl` 拼装主题切换器。

迁移：

- 删除 `SegmentedControl`、主题图标、本地 `THEME_OPTIONS`、`useTheme` 和 `ThemePreference` 引用。
- 直接渲染 `<ThemeSwitcher />`。
- 主题选项顺序、图标、ARIA 和状态同步由 `ThemeSwitcher` 唯一负责。

### 4. `docs/site/src/components/docs-components-page.tsx`

当前引用：

- `docs/site/src/components/docs-components-page.tsx:75`：导入旧 Dropdown Menu API。
- `docs/site/src/components/docs-components-page.tsx:149`：导入 `SegmentedControl`。
- `docs/site/src/components/docs-components-page.tsx:185`：导入 `ThemeSwitch`。
- `docs/site/src/components/docs-components-page.tsx:435`：`DropdownMenuDemo`。
- `docs/site/src/components/docs-components-page.tsx:496`：`SegmentedControlDemo`。
- `docs/site/src/components/docs-components-page.tsx:706`：`ThemeSwitchDemo`。
- `docs/site/src/components/docs-components-page.tsx:1320`：旧 `dropdown-menu` 路由 case。
- `docs/site/src/components/docs-components-page.tsx:1356`：旧 `segmented-control` 路由 case。
- `docs/site/src/components/docs-components-page.tsx:1390`：旧 `theme-switch` 路由 case。

迁移：

- 分别改为 `MenuDemo`、`SwitchDemo`、`ThemeSwitcherDemo`。
- `MenuDemo` 使用正式 Menu API，破坏性条目使用 `type="error"`。
- `SwitchDemo` 使用 `Switch` + `SwitchControl`，保留受控交互。
- 路由 case 直接改为 `menu`、`switch`、`theme-switcher`；不保留旧 case 或重定向。

### 5. `docs/site/src/data/components.ts`

当前引用：

- `docs/site/src/data/components.ts:506`：`dropdown-menu` 元数据与旧代码示例。
- `docs/site/src/data/components.ts:1034`：`segmented-control` 元数据与旧代码示例。
- `docs/site/src/data/components.ts:1463`：`theme-switch` 元数据与旧代码示例。

迁移：

- 三个条目的 `name`、标题、说明和代码示例改为官方 `menu`、`switch`、`theme-switcher`。
- Best Practices 直接取对应的 `docs/geist-markdown-refs/components/*.md`，不保留旧组件说明。
- `Menu` 的示例使用正式 API；`Switch` 示例必须传 `name`；`ThemeSwitcher` 示例直接渲染组件。

### 6. `docs/site/src/data/nav.ts`

当前引用：

- `docs/site/src/data/nav.ts:54`：`Dropdown Menu` / `/components/dropdown-menu`。
- `docs/site/src/data/nav.ts:77`：`Segmented Control` / `/components/segmented-control`。
- `docs/site/src/data/nav.ts:94`：`Theme Switch` / `/components/theme-switch`。

迁移：

- 直接替换为 `Menu` / `/components/menu`。
- 直接替换为 `Switch` / `/components/switch`。
- 直接替换为 `Theme Switcher` / `/components/theme-switcher`。
- 不保留旧导航项或路由跳转。

### 7. `src/components/ui/dots-menu.tsx`

当前引用：

- `src/components/ui/dots-menu.tsx:4-10`：导入旧 Dropdown Menu API。
- `src/components/ui/dots-menu.tsx:19`：`DotsMenu` 直接等于 `DropdownMenu`。
- `src/components/ui/dots-menu.tsx:24-40`：触发器、浮层、条目和分隔线均直接复用旧导出。

迁移：

- 改为基于新 Menu 的内部原语实现。
- `DotsMenu`、`DotsMenuTrigger`、`DotsMenuContent`、`DotsMenuItem`、`DotsMenuSeparator` 的公开 API 可保持不变，因为仓库当前只消费这些 Dots Menu 自身符号；这不是旧 Dropdown Menu API 的兼容层。
- 注释中的 `DropdownMenu` 改为 `Menu`。

### 8. `src/components/ui/split-button.tsx`

当前引用：

- `src/components/ui/split-button.tsx:5-9`：导入旧 Dropdown Menu API。
- `src/components/ui/split-button.tsx:24-32`：根节点使用 `DropdownMenu`。
- `src/components/ui/split-button.tsx:68-85`：菜单触发器和内容使用旧导出。

迁移：

- 内部改用新 Menu 实现或其私有 primitive。
- `SplitButton`、`SplitButtonMain`、`SplitButtonMenu` 的公开 API 当前已有文档消费者，不因底层 Menu 迁移而改名。

### 9. `src/components/ui/theme-switch.tsx`

该文件本身依赖旧 Dropdown Menu，但迁移目标是删除整个 `ThemeSwitch`，无需先迁移其内部依赖。

### 10. 文档与注释引用

以下不是运行时消费者，但迁移后必须同步，否则会继续宣称旧 API 存在：

- `README.md:12`：旧基础组件清单和数量。
- `docs/site-docs-findings.md:10`、`:26-30`、`:74`、`:104-110`、`:143`：旧命名、旧差异和旧建议。
- `src/components/ui/context-menu.tsx:8`：Dropdown Menu 视觉说明。
- `src/components/ui/toggle.tsx:16`：将 Switch 解释为本地 SegmentedControl。

`docs/site-docs-findings.md` 中已过时的“保留两种形态”建议应直接删除或标记为已解决，不能继续作为设计决策。

## 推荐执行顺序

1. 完成并实测 `menu.tsx`、`switch.tsx`、`theme-switcher.tsx` 的目标 API。
2. 先迁移内部依赖：`dots-menu.tsx`、`split-button.tsx`。
3. 迁移应用消费者：`src/App.tsx`、`src/examples/DataTableExample.tsx`。
4. 迁移文档站外壳和 Live Demo：`docs-shell.tsx`、`docs-components-page.tsx`。
5. 迁移元数据和导航：`components.ts`、`nav.ts`。
6. 更新 README、findings 和源码注释。
7. 删除 3 个旧组件文件。
8. 扫描零残留，运行静态检查和实际渲染验收。

## 零残留检查

迁移后运行：

```bash
git grep -n -E '@/components/ui/dropdown-menu|@/components/ui/segmented-control|SegmentedControl|ThemeSwitch([^e]|$)|@/components/ui/theme-switch([^e]|$)' -- ':!docs/geist-markdown-refs/**' ':!docs/component-api-migration.md' ':!pnpm-lock.yaml'
```

预期：无运行时代码、导航、示例或说明文档命中。新 `Menu` 内部使用
`radix-ui` 公开的 `DropdownMenu` primitive 属于合法底层实现，因此扫描只禁止旧本地 import 路径；`pnpm-lock.yaml` 中的
`@radix-ui/react-dropdown-menu` 是 `radix-ui` 的内部依赖名称，不是本地组件 API，允许保留；
扫描命令已排除该锁文件。若只剩 Git 历史、官方快照或该锁文件依赖，不属于当前工作区的旧 API 引用。

确认旧文件已删除：

```bash
test ! -e src/components/ui/dropdown-menu.tsx
test ! -e src/components/ui/segmented-control.tsx
test ! -e src/components/ui/theme-switch.tsx
```

## 验证

静态验证：

```bash
node_modules/.bin/tsc -b --noEmit
node_modules/.bin/oxlint src/ docs/site/src/
vp check
vp test
vp build
node_modules/.bin/vite build docs --config docs/vite.config.ts
```

实际渲染至少验证：

- `#/components/menu`：打开、键盘导航、Esc 关闭、焦点返回、disabled、error item、Light / Dark。
- `#/components/switch`：点击和方向键切换、唯一选中、disabled、small / default / large、Light / Dark。
- `#/components/theme-switcher`：Light / System / Dark 状态同步、compact、disabled、刷新后偏好保持。
- `src/App.tsx`：桌面页头主题切换、移动端 5 项导航、组件总览 3 项 Switch。
- `DataTableExample`：4 项筛选迁移到 Select 后筛选结果不变。
- 375、768、1440、1920 px 四个视口下无布局跳动或横向溢出。

## 明确不做

- 不导出旧符号。
- 不保留旧文件作为 re-export。
- 不保留旧路由或重定向。
- 不创建 deprecated 类型别名。
- 不为仓库中没有引用的 Dropdown Menu 高级 API 补兼容实现。
- 不推测或迁移仓库外消费者。
