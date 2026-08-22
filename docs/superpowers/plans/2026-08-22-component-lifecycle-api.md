# 组件生命周期与回调 API 架构统一 实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 在不偏离 Geist 官方 API 的前提下，为本框架建立一套显式、一致、有测试兜底的生命周期/回调契约——受控与非受控全支持、取消约定成文、特化 hooks 有规约、文档与实现零偏差。

**架构：** 两层模型。第一层「官方对齐层」：凡官方有的 prop/回调签名，逐字复刻，不做任何改名或重载（复刻规范的硬约束）。第二层「框架约定层」：官方未覆盖的部分（非受控补齐、preventDefault 取消、特化 hooks 形状）统一为一套书面契约，由契约测试强制执行。

**技术栈：** React 19 + TypeScript + Vitest（现有 `tests/*.test.tsx` 模式）。

---

## 背景与现状问题（2026-08-22 源码审计）

| # | 问题 | 证据 |
|---|------|------|
| 1 | 受控/非受控支持不一致：`Checkbox` 只能受控（无 `defaultChecked`）；`Switch.Control` 只有非受控 `defaultChecked`（受控走 Context）；`Combobox` 双模式齐全（`defaultValue` 内部 state + `onValueChange`） | `src/components/ui/checkbox.tsx:34-40`、`switch.tsx:57-84`、`combobox.tsx:77-176` |
| 2 | 回调签名三种风格并存：`onChange()` 无参（Checkbox）、`onChange(value)`（Choicebox）、`onValueChange(value)`（Select/Combobox）。其中前两种是官方原样，不可改；但没有文档说明「哪种是官方的、哪种是我们的」 | `checkbox.tsx:37`、`choicebox.tsx:18-19`、`select.tsx:18` |
| 3 | `preventDefault()` 取消约定已在 CopyButton / TextWithCopyButton / Collapse(disabled) 三处实现，但从未写成显式契约，也没有测试锁定；新组件无法知道该不该遵循 | `copy-button.tsx:41-43`、`text-with-copy-button.tsx:38-40`、`collapse.tsx:44` |
| 4 | 特化 hooks（`useRadio` 返回 `{component}`、`useToasts` 返回操作集合）形状各异且无规约，文档页只能含糊带过 | `radio.tsx:201-206`、`toast.tsx:67-82` |
| 5 | 「生命周期与钩子」文档页描述的契约没有对应的实现层保证（文档说「不混用两种模式」，但没有任何组件在混用时告警或测试锁定） | `docs/geist/src/pages/lifecycle-and-hooks.tsx` |

## 设计决策

**D1 — 边界（用户已确认方向）：官方对齐层保持逐字复刻。** Checkbox 的 `onChange()` 无参数、Switch 的 radio 组语义等都**不改签名**。问题 #2 不是「修复不一致」而是「标注来源」：每个组件的 API 参考数据里加 `origin: "official" | "extension"` 字段，文档渲染时官方项不加标记，扩展项标「框架扩展」。

**D2 — 非受控补齐原则：** 凡官方 demo 展示过受控用法的状态型组件，框架必须同时提供非受控入口（`default*` prop），除非官方明确只有一种模式。首期只补 `Checkbox.defaultChecked`（唯一确认缺口）。

**D3 — 取消约定成文：** 「点击类回调先调用用户的 `onClick`/`onBefore`，若 `event.defaultPrevented` 则跳过后续动作」升级为命名契约 **Cancelled-Action Contract**，抽共享工具 `callWithCancelGuard(handler, followUp)` 放入 `src/lib/`，现有三处迁移到该工具，后续新组件一律使用。

**D4 — hooks 规约：** 特化 hook 统一命名 `use<Component>`（复数视图用复数 `useToasts` 保持）、返回单一对象、对象键为名词。本期只写规约文档 + 类型测试锁定现有两个 hook 的返回形状，不改动其实现。

**D5 — 契约测试先行：** 新增 `tests/lifecycle-contracts.test.ts(x)`，用类型级 + 运行时断言锁定上述所有约定。这是本计划的骨架产出——文档可以滞后，契约测试不能。

**D6 — 文档同步：** 「生命周期与钩子」页（已迁移至 `DocPageContent` 内容模型）按最终契约改写，`component-api.ts` 补 `origin` 字段并在 API 表渲染「框架扩展」徽标。

## 开放点（实施前需用户确认）

- **O1：** D3 是否要推广到 Modal/Sheet 的 `onOpenChange` 类回调（即允许 `preventDefault` 阻止关闭）？Radix 自带 `onInteractOutside` 等取消机制，重复建设有违 YAGNI。**计划默认：不推广，仅限点击类动作回调。**
- **O2：** `Checkbox.defaultChecked` 属于对官方 API 的扩展，需在文档标注「框架扩展」。若你认为连这个都不该加（严格 1:1 复刻），删除任务 2 即可，其余任务不受影响。

---

## 文件结构

- 创建：`src/lib/cancel-guard.ts` — Cancelled-Action Contract 共享工具（唯一新运行时代码）
- 创建：`tests/lifecycle-contracts.test.tsx` — 契约测试（受控/非受控矩阵 + cancel guard + hooks 形状）
- 修改：`src/components/ui/checkbox.tsx` — 增加 `defaultChecked` 非受控支持（O2，可裁剪）
- 修改：`src/components/ui/copy-button.tsx`、`text-with-copy-button.tsx`、`collapse.tsx` — 迁移到 cancel-guard
- 修改：`docs/geist/src/data/component-api.ts` — ApiRow 增加 `origin` 字段并填充
- 修改：`docs/geist/src/components/docs-api-reference.tsx` — 渲染「框架扩展」徽标
- 修改：`docs/geist/src/pages/lifecycle-and-hooks.tsx` — 文档页按最终契约改写

---

### 任务 1：Cancelled-Action Contract 工具 + 契约测试

**文件：**
- 创建：`src/lib/cancel-guard.ts`
- 创建：`tests/lifecycle-contracts.test.tsx`

- [ ] **步骤 1.1：编写失败的测试**

```tsx
// tests/lifecycle-contracts.test.tsx
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { callWithCancelGuard } from "@/lib/cancel-guard";

describe("callWithCancelGuard", () => {
  it("runs handler first, skips follow-up when defaultPrevented", () => {
    const followUp = vi.fn();
    const event = new MouseEvent("click");
    const handler = (e: MouseEvent) => e.preventDefault();

    callWithCancelGuard(event, handler, followUp);

    expect(followUp).not.toHaveBeenCalled();
  });

  it("runs follow-up when handler does not preventDefault", () => {
    const followUp = vi.fn();
    const event = new MouseEvent("click");

    callWithCancelGuard(event, undefined, followUp);

    expect(followUp).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **步骤 1.2：运行测试验证失败**

运行：`pnpm exec vitest run tests/lifecycle-contracts.test.tsx`
预期：FAIL，`Cannot find module '@/lib/cancel-guard'`

- [ ] **步骤 1.3：编写最少实现**

```ts
// src/lib/cancel-guard.ts
/**
 * Cancelled-Action Contract（框架约定，见文档站「生命周期与钩子」）：
 * 点击类组件先调用用户的 handler，再执行 followUp；
 * handler 内调用 event.preventDefault() 即取消 followUp。
 * 仅用于「点击触发一个明确后续动作」的组件（复制、展开等），
 * 不适用于 open/close 状态切换（那些走 Radix 自带的取消机制）。
 */
export function callWithCancelGuard<E extends { defaultPrevented: boolean }>(
  event: E,
  handler: ((event: E) => void) | undefined,
  followUp: () => void,
): void {
  handler?.(event);
  if (!event.defaultPrevented) followUp();
}
```

- [ ] **步骤 1.4：运行测试验证通过**

运行：`pnpm exec vitest run tests/lifecycle-contracts.test.tsx`
预期：PASS（2 个用例）

- [ ] **步骤 1.5：Commit**

```bash
git add src/lib/cancel-guard.ts tests/lifecycle-contracts.test.tsx
git commit -m "feat(lib): 新增 Cancelled-Action Contract 共享工具与契约测试"
```

### 任务 2：三处现有实现迁移到 cancel-guard

**文件：**
- 修改：`src/components/ui/copy-button.tsx:41-43`
- 修改：`src/components/ui/text-with-copy-button.tsx:71-73`
- 修改：`src/components/ui/collapse.tsx:44`

- [ ] **步骤 2.1：编写失败的回归测试**（锁定现有外部行为不变）

```tsx
// 追加到 tests/lifecycle-contracts.test.tsx
import { CopyButton } from "@/components/ui/copy-button";

describe("CopyButton cancelled-action contract", () => {
  it("skips copy when onClick prevents default", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const { container } = render(
      <CopyButton textToCopy="x" onClick={(e) => e.preventDefault()} />,
    );
    await userEvent.click(container.querySelector("button")!);
    expect(writeText).not.toHaveBeenCalled();
  });
});
```

- [ ] **步骤 2.2：运行验证当前已通过**（这是回归锁，不是新功能）

运行：`pnpm exec vitest run tests/lifecycle-contracts.test.tsx`
预期：PASS（现有实现已满足）

- [ ] **步骤 2.3：迁移三个组件到 `callWithCancelGuard`**

以 CopyButton 为例（其余两处同构替换）：

```tsx
// copy-button.tsx handleCopy 内，替换 onClick?.(event); if (event.defaultPrevented) return;
import { callWithCancelGuard } from "@/lib/cancel-guard";

const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
  let proceed = false;
  callWithCancelGuard(event, onClick, () => { proceed = true; });
  if (!proceed) return;
  // …原有复制逻辑不变
};
```

注意：`collapse.tsx:44` 是 `if (disabled) event.preventDefault()` 后由 Radix 处理点击，属于「阻止默认」而非本契约——**不迁移**，仅在其注释中指向 cancel-guard 说明区别。

- [ ] **步骤 2.4：全量测试通过**

运行：`pnpm run test`
预期：全部 PASS，无行为变化

- [ ] **步骤 2.5：Commit**

```bash
git add src/components/ui/copy-button.tsx src/components/ui/text-with-copy-button.tsx src/components/ui/collapse.tsx
git commit -m "refactor(ui): CopyButton 系列迁移至 callWithCancelGuard 统一取消约定"
```

### 任务 3：Checkbox 非受控补齐（O2，可裁剪）

**文件：**
- 修改：`src/components/ui/checkbox.tsx:34-56`
- 测试：`tests/lifecycle-contracts.test.tsx`

- [ ] **步骤 3.1：编写失败的测试**

```tsx
// 追加到 tests/lifecycle-contracts.test.tsx
import { Checkbox } from "@/components/ui/checkbox";

describe("Checkbox uncontrolled support", () => {
  it("toggles internally when only defaultChecked is given", async () => {
    const { container } = render(<Checkbox defaultChecked />);
    const input = container.querySelector("input")!;
    expect(input.checked).toBe(true);
    await userEvent.click(input);
    expect(input.checked).toBe(false);
  });

  it("stays fully controlled when checked is provided", async () => {
    const { container } = render(<Checkbox checked={false} onChange={() => {}} />);
    const input = container.querySelector("input")!;
    await userEvent.click(input);
    expect(input.checked).toBe(false); // 未写回则不变
  });
});
```

- [ ] **步骤 3.2：运行测试验证失败**

运行：`pnpm exec vitest run tests/lifecycle-contracts.test.tsx -t "uncontrolled"`
预期：FAIL，`defaultChecked` 不在 props 类型中（TS 编译期即报错）

- [ ] **步骤 3.3：实现非受控模式**

```tsx
// checkbox.tsx — props 类型增加 defaultChecked，内部改为双模式：
function Checkbox({
  className,
  checked,
  defaultChecked,
  onChange,
  // …其余不变
}: … & {
  checked?: boolean;
  defaultChecked?: boolean;
  // …
}) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : internalChecked;
  const handleChange = () => {
    if (!isControlled) setInternalChecked((b) => !b);
    onChange?.();
  };
  // input 上：checked={currentChecked} onChange={handleChange}
}
```

- [ ] **步骤 3.4：运行测试验证通过 + 全量回归**

运行：`pnpm run test`
预期：新增 2 例 PASS，存量 Checkbox 测试不受影响（`checked` 受控路径行为不变）

- [ ] **步骤 3.5：Commit**

```bash
git add src/components/ui/checkbox.tsx tests/lifecycle-contracts.test.tsx
git commit -m "feat(ui): Checkbox 补齐 defaultChecked 非受控模式（框架扩展）"
```

### 任务 4：API 参考数据增加 origin 字段

**文件：**
- 修改：`docs/geist/src/data/component-api.ts`
- 修改：`docs/geist/src/components/docs-api-reference.tsx:26-49`

- [ ] **步骤 4.1：类型与数据**

```ts
// component-api.ts — ApiRow 增加可选字段
export interface ApiRow {
  // …现有字段
  /** official = 官方 API 原样；extension = 框架扩展（文档渲染「框架扩展」徽标） */
  origin?: "official" | "extension";
}

// 为已知扩展行填充：如 Checkbox.defaultChecked → origin: "extension"；
// 其余行不写字段即为 official，避免大规模机械改动。
```

- [ ] **步骤 4.2：渲染徽标**

```tsx
// docs-api-reference.tsx 名称单元格内，deprecated 徽标旁追加：
{item.origin === "extension" ? (
  <span className="ml-2 text-label-12 text-muted-foreground">
    {language === "zh-CN" ? "框架扩展" : "Extension"}
  </span>
) : null}
```

- [ ] **步骤 4.3：验证**

运行：`cd docs/geist && ../../node_modules/.bin/tsc -p tsconfig.json --noEmit`（过滤既有存量错误后应为零新增）
浏览器抽查 `/components/checkbox` API 表出现「框架扩展」标记。

- [ ] **步骤 4.4：Commit**

```bash
git add docs/geist/src/data/component-api.ts docs/geist/src/components/docs-api-reference.tsx
git commit -m "feat(docs): API 参考表区分官方 API 与框架扩展"
```

### 任务 5：hooks 规约类型测试

**文件：**
- 测试：`tests/lifecycle-contracts.test.tsx`

- [ ] **步骤 5.1：类型级契约测试（编译期锁定，无运行时断言）**

```tsx
// 追加到 tests/lifecycle-contracts.test.tsx
import type { UseToastsReturn } from "@/components/ui/toast";
import { useRadio } from "@/components/ui/radio";
import { useToasts } from "@/components/ui/toast";

describe("specialized hooks contract", () => {
  it("useToasts returns action-object with known keys", () => {
    const toasts = useToasts();
    expect(Object.keys(toasts).sort()).toEqual(
      ["dismiss", "error", "message", "success", "warning"],
    );
  });

  it("useRadio returns { component } shape", () => {
    expectTypeOf(useRadio({ value: "a" })).toEqualTypeOf<{ component: React.ReactElement }>();
  });
});
```

注：`expectTypeOf` 来自 `vitest`（`import { expectTypeOf } from "vitest"`），若项目 tsconfig 未启用类型测试断言，退化为运行时 keys 断言即可。

- [ ] **步骤 5.2：运行验证通过（纯回归锁）**

运行：`pnpm run test`
预期：PASS；若未来有人改动 hook 返回形状，此处首先报错

- [ ] **步骤 5.3：Commit**

```bash
git add tests/lifecycle-contracts.test.tsx
git commit -m "test(ui): 锁定 useRadio/useToasts 特化 hooks 返回形状契约"
```

### 任务 6：「生命周期与钩子」文档页按最终契约改写

**文件：**
- 修改：`docs/geist/src/pages/lifecycle-and-hooks.tsx`（DocPageContent 数据，中英双语）

- [ ] **步骤 6.1：内容更新点**
  - 「回调契约」节追加 Cancelled-Action Contract 的准确表述（哪些组件遵循、如何取消、不适用于开关类）
  - 「受控与非受控」节补充：各组件支持矩阵以各自 API 表为准；扩展能力标「框架扩展」
  - 删除任何与 D1–D4 冲突的旧表述

- [ ] **步骤 6.2：验证**

浏览器双语言截图核对；`pnpm run lint` 通过。

- [ ] **步骤 6.3：Commit**

```bash
git add docs/geist/src/pages/lifecycle-and-hooks.tsx
git commit -m "docs(geist): 生命周期与钩子页对齐最终契约（取消约定/扩展标注）"
```

### 任务 7：终验

- [ ] **步骤 7.1：** `pnpm run test && pnpm run lint && pnpm run build` 全部真实通过
- [ ] **步骤 7.2：** dev server 打开 `/lifecycle-and-hooks` 与 `/components/checkbox`，双语言视觉抽查
- [ ] **步骤 7.3：** 对照「背景与现状问题」表逐条核销：#1（Checkbox 补齐）、#2（origin 标注）、#3（cancel-guard 成文）、#4（hooks 契约锁定）、#5（文档与契约一致）

---

## 自检记录

- 规格覆盖度：问题 #1–#5 各有对应任务（#1→T3，#2→T4，#3→T1/T2，#4→T5，#5→T6/T7）✓
- 占位符扫描：无 TODO/待定；O1/O2 为显式开放决策而非占位 ✓
- 类型一致性：`callWithCancelGuard(event, handler, followUp)` 签名在 T1 定义、T2 使用一致；`origin` 字段在 T4 定义并消费 ✓
