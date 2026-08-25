# tests/ 双层测试职责契约

本目录测试分两层，新增测试前先判断该归属哪层。

## 分层

| 层 | 位置 | 职责 | 禁止事项 |
|----|------|------|----------|
| Vitest 单元/契约 | `tests/*.test.{ts,tsx}`、`tests/audit/` | 纯函数、token 契约、组件 jsdom 行为、源码字符串契约（经 `tests/helpers/docs-page-source.ts` 统一读盘） | 断言真实浏览器几何（jsdom 推不出布局） |
| Playwright 浏览器审计 | `tests/e2e/docs-layout.spec.ts` | root overflow（`rootScrollWidth > clientWidth + 1`）、sticky 几何（≤1px）、触控目标 ≥44px、Grid computed style、双主题、浮层层级 | 用"任意 token 都返回值"的 mock 替代 token-sensitive computed 断言 |

判断口诀：**能靠 import 数据对象或 jsdom 验证的进 Vitest；必须真实浏览器几何/主题的进 e2e。**

## 运行命令

```bash
pnpm exec vitest run            # 全量单元/契约层
pnpm run test:docs-layout       # Playwright 审计（独立驱动，勿混入 vitest）
```

- vitest.config.ts 已排除 `tests/e2e/**`（Playwright 的 `test()` 与 vitest 不兼容）。
- Playwright config 使用 **端口 5211 + strictPort**，webServer 由 Playwright 自行启动回收；
  不要手动占用 5200（那是集成仓库 dev server 的常用端口，历史上曾串扰导致审计红灯）。

## 证据产物

Playwright 审计的 JSON/截图落在 `.scratch/`（git 忽略）：`docs-layout-audit.json` 汇总 +
`.scratch/playwright-results/` 失败上下文。owner 修复必须引用 JSON 中命中的证据，
禁止全局 `overflow-x-hidden` 掩盖真实 owner。

## 已知约定 / 禁令

1. `tests/hamburger-menu.test.tsx` 存在预存 CRLF-only 行尾噪声：**不得编辑、暂存或提交**
   该文件的内容改动；与 `hamburger-menu-modes.test.tsx` 的用例域重叠待噪声修复后单独处理。
2. 源码契约测试读 `docs-components-page.tsx` 一律 import `tests/helpers/docs-page-source.ts`
   的单例，不要各自 readFileSync（7000+ 行文件重复读盘且正则易漂移）。
3. 非 vitest 的审计脚本放 `scripts/`，不放 `tests/`（避免误收集隐患）。
4. audit ledger 相关套件按 schema/provenance/consumers 三分文件，共享 fixture 在
   `tests/audit/fixtures/ledger-fixture.ts`。
