# 测试类型检查债务清单（2026-09-15 基线）

## 背景

- `pnpm typecheck`（`tsc -b`）覆盖 `src/` + 配置，已开 strict，**零错误**。
- `tsconfig.tests.json`（纳管 `tests/`（除 e2e）+ `docs/geist/src/`）首版**仅纳管类型解析**（未开 strict / noUnused*），
  存量类型错误约 150 条，暂不进入 CI 门禁与 build 链（避免阻塞 build/发布链）。
- 独立脚本：`pnpm typecheck:tests`（不入 `tsc -b`、不入 prepublishOnly）。

## 错误分类（存量基线）

- **TS7017（~50）**：`globalThis` 无 index signature——测试直接给 `(globalThis as ...)` 赋值 `matchMedia` 等。
  收紧路径：统一 `declare global` 或抽公共 mock 工具。
- **TS2339 / TS2353 / TS2322（~50）**：audit 系列测试与组件 props 的 mock 对象形状不匹配
  （如 choicebox `label` 缺失、hamburger-menu `side`/`query`、text-with-copy-button `textLabel`
  ——部分提示测试未跟进组件 props 演进）。
- **TS7016（~10）**：`import ../scripts/*.mjs` 无声明文件；路径：补 `.d.ts`。
- **TS2769 / TS2786 / TS7053 等（~30）**：locale 注入、JSX 组件返回类型、索引签名等。
- **其余（TS2554 / TS2790 / TS2698 / TS2307 / TS2352 等 ~10）**。

## 收紧策略（后续批次）

1. 先清零 TS7017（写法统一、可批量修）；
2. 按文件清零 audit 系列（与批次 3 的 registry 治理同期）；
3. 全绿后 `tsconfig.tests.json` 开 strict，并接入 CI 门禁（ci.yml 增 `pnpm typecheck:tests`）。

## 重新生成清单

```bash
pnpm typecheck:tests > tests-typecheck-debt.txt
```
