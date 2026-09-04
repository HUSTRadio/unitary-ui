# 步骤指示点

> Route: `/components/step-point`

标记多步骤流程中的进度。

[返回组件](#/components)

# 步骤指示点

StepPoint

标记多步骤流程中的进度。

## 何时使用

- 引导用户完成多步流程（如设置向导、注册表单、部署配置）时显示步骤进度。
- 需要向用户传达线性任务的整体结构，以及当前位置和剩余步骤。

## 何时不应使用

- 单次操作或无需分步的场景不使用步骤指示点。
- 当页面有多个独立子流程时，每个子流程应使用独立的步骤指示组件。

## 示例

### 默认步骤指示

标准的水平步骤指示点排列，展示默认的外观。

### 完整多步流程

结合步骤指示点和内容区域展示完整的引导流程体验。

## 无障碍

- 已完成和当前步骤的指示点应有清晰的焦点样式，键盘用户可以遍历所有步骤。
- 当前步骤应配合 aria-current 属性让屏幕阅读器知道用户所在位置。

## 受控行为

- 通过 activeIndex 控制当前高亮的步骤索引，completedIndexes 数组标记已完成的步骤。

## 响应式行为

- 步骤指示点在窄视图中可以切换为垂直布局或隐藏非活跃步骤以节省空间。

## 主题行为

不适用: 步骤指示点使用固定的状态语义颜色（灰色未激活、品牌色进行中、对勾已完成），不进行主题定制。

## 实时示例

- Submitted
- Under review
- Approved

```tsx
import { StepPoint } from "@/components/ui/step-point";

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

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { StepPoint } from "@/components/ui/step-point";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">status</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">StepStatus</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">步骤状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">步骤标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
