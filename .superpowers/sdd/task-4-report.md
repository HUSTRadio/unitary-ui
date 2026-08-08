# Task 4 Report: 内容页 — Colors / Typography / Materials / Brands

## 状态：完成 ✅

## 修改文件
- `docs/geist/src/components/docs-pages.tsx` — 新增 `ColorsPage` / `TypographyPage` / `MaterialsPage` / `BrandsPage` 4 个内容页组件
- `docs/geist/src/App.tsx` — 路由映射表 `PAGE_COMPONENTS`：`/colors` `/typography` `/materials` `/brands` 渲染对应页面，未匹配路由保留占位

## 各页实现
1. **ColorsPage**（`/colors`）
   - 标题 "Colors" + 描述 "A high contrast, accessible color system."
   - 8 色阶网格（gray/blue/red/amber/green/teal/purple/pink）× 关键档（100/300/500/700/900/1000），色块 + hex 标注
   - 色值全部取自 `docs/geist-markdown-refs/foundations/colors.md` 快照（Dark 主题表），零凭记忆值
   - 语义 token 表（复用根 `@/components/ui/table`）：background / foreground / muted-foreground / border / ring / primary / destructive / success / warning，Light/Dark 双列 + 色块。Light/Dark 值取自框架 `src/styles/index.css` 实际定义（与快照色阶同源，如 foreground light=#171717=gray-1000、dark=#ededed）
2. **TypographyPage**（`/typography`）
   - heading 10 类（72→14，含 Subtle 修饰实例）、label 9 类（20→12 + 3 个 mono）、copy 7 类（24→13 + copy-13-mono）、button 3 类（渲染在真实 Button 内层 span，避免与 cva 字号冲突）
   - 实例文本与类名全部取自 typography.md 快照；mono 变体按快照实存渲染（label-14/13/12-mono、copy-13-mono），页面标注缺口：text-copy-14-mono 等其余 copy mono 变体框架中不存在
3. **MaterialsPage**（`/materials`）
   - 8 级材质方块：surface 4 级（base/small/medium/large）+ floating 4 级（tooltip/menu/modal/fullscreen），每方块应用 `material-*` 类
   - 标注圆角（6/6/12/12/6/12/12/16px，与 materials.md 及 CSS @utility 一致）、用途文案（快照原文）、z-index 层级（surface=auto 文档流内，floating=50 对齐框架 dropdown/select 弹层约定）
4. **BrandsPage**（`/brands`）
   - 6 张技术栈品牌卡（material-base 卡片）：Vercel Geist（设计基准）/ shadcn/ui（组件基础，显式呈现）/ Radix UI（行为原语）/ Tailwind CSS v4（原子化 CSS）/ lucide-react（图标库）/ HarmonyOS Sans SC + Maple Mono（字体），每卡 lucide 图标 + 角色标签 + 描述

## 验证结果
1. `pnpm exec tsc --noEmit -p docs/geist/tsconfig.json` — 通过（exit 0）
2. `pnpm exec oxlint docs/geist/src` — 0 warnings 0 errors
3. 浏览器实测（http://localhost:5199，既有 dev server HMR）：
   - 4 个页面均可从侧栏/路由访问，内容渲染正确，控制台 0 JS errors
   - Colors 页色值与快照一致：抽查 #006efe（blue-700）、#e5484d（red-700）、#ffb224（amber-700）、#46a758（green-700）、#17a693（teal-700）全部命中
   - Typography 页 29 个 specimen 行全部渲染，类名与快照一致，button 类渲染在真实按钮内
   - Materials 页 8 方块 computed border-radius = 6/6/12/12/6/12/12/16px（快照一致）
   - Brands 页 6 卡齐全（含 shadcn/ui）
   - Introduction 页无回归；dark 主题下 --background=#0a0a0a 正确切换

## 说明
- 未修改 `data/nav.ts`（任务禁止范围）；Brands 路由 `/brands` 由 Introduction 首页 "Brand Assets" 卡片链接可达
- 侧栏 Brands 组的 `/brands/vercel` 等官方品牌子路由不在本任务范围，保留占位

## Commit
`feat(docs): Colors/Typography/Materials/Brands 内容页`（GPG 签名，footer Co-Authored by glm-5.2）
