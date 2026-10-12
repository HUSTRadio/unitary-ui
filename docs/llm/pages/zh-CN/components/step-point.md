# 步骤指示点

> Route: `/components/step-point`

标记多步流程中每个步骤的状态。

[返回组件](#/components)

# 步骤指示点

step-point

标记多步流程中每个步骤的状态。

## 何时使用

- 引导用户完成多步流程（如设置向导、注册表单、部署配置）时显示步骤进度。
- 需要向用户传达线性任务的整体结构，以及当前位置和剩余步骤。

## 何时不应使用

- 单次操作或无需分步的场景不使用步骤指示点。
- 当页面有多个独立子流程时，每个子流程应使用独立的步骤指示组件。

## 示例

### 默认步骤指示

纵向步骤列表，用 status 标记已完成、进行中与未开始的步骤。

## 无障碍

- StepPoint 是纯展示组件：圆点 aria-hidden，状态语义由文本传达，不提供焦点或键盘遍历。
- 如需可交互的步骤导航（点击切换、aria-current），由调用方在外层列表项上自行实现。

## 受控行为

不适用: StepPoint 无内部状态：每个步骤的当前态由调用方通过 status（idle/active/done/failed）逐一传入，不存在 activeIndex/completedIndexes 之类的组级受控 API。

## 响应式行为

不适用: StepPoint 不自带布局决策：垂直或水平排列由外层列表容器决定（示例使用纵向 ul），窄屏调整属调用方职责。

## 主题行为

不适用: 步骤指示点使用固定的状态语义颜色（灰色未激活、品牌色进行中、对勾已完成），不进行主题定制。

## 实时示例

- Submitted
- Under review
- Approved

```tsx
import { StepPoint } from "@hustradio/unitary-ui";

export function StepPointDefault21B111CBExample() {
  return (
    <ul className="w-full max-w-xs">
      <StepPoint status="done">Submitted</StepPoint>
      <StepPoint status="active">Under review</StepPoint>
      <StepPoint status="idle">Approved</StepPoint>
    </ul>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import { StepPoint } from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">status</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">StepStatus</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">步骤状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">步骤标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
