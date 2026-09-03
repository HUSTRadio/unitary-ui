# 开关

> Route: `/components/toggle`

用于单个布尔设置的开关。

[返回组件](#/components)

# 开关

Toggle

用于单个布尔设置的开关。

## 何时使用

- 需要一个单一的布尔值设定，且打开后立即生效的场景（如密码保护、自动取消构建）。
- 与其他表单控件并列时，用 Toggle 表示单条设置的开/关，而不是使用 Checkbox（多选列表）或 Switch（2–3 个互斥视图）。

## 何时不应使用

- 需要多选一个项目列表时，请使用 Checkbox；Toggle 只能表达单一的开/关状态。
- 需要在两个或多个互斥视图之间切换时，请使用 Switch；Toggle 设计用于单一的布尔设定。

## 示例

### 默认样式

展示 Toggle 的基础用法，包含 checked 和 onChange 回调。

### 禁用状态

当操作不可执行时将 Toggle 设为禁用，并通过辅助文本说明原因。

### 尺寸变体

展示不同尺寸的 Toggle，以适配不同的界面密度需求。

### 带标签的开关

通过子节点传递标题式标签，并配合下方的描述性文字来解释开启时的含义。

## 无障碍

- 通过子节点、aria-label 或 aria-labelledby 提供可访问的名称；Geist 在开发环境中会在三者全部缺失时发出警告。
- 当可见标签放置在别处时，才使用 aria-label；否则让子节点同时携带视觉和屏幕阅读器的标签。

## 受控行为

- checked 在类型上可选；同时传入 checked 与 onChange 时由外部状态控制，也可使用继承的 defaultChecked 设置非受控初始状态。
- 状态变更后应立即持久化并通过 toast 反馈结果（如"密码保护已启用"），避免用户不确定操作是否生效。

## 响应式行为

不适用: Toggle 是一个小型布尔开关控件，其行为和布局在不同视口下保持一致，不涉及响应式断点或布局变化。

## 主题行为

- Toggle 跟随主题色系统，开启状态的填充颜色随当前主题自动切换，确保在所有配色方案中保持足够的对比度。

## 实时示例

```tsx
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export function Component() {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <div className="flex flex-col">
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked2}
        onChange={() => setChecked2(!checked2)}
      />
    </div>
  );
}
```

```tsx
import { Toggle } from "@/components/ui/toggle";

<div className="flex flex-col">
  <Toggle aria-label="Enable Firewall" checked={false} readOnly disabled />
  <Toggle aria-label="Enable Firewall" checked readOnly disabled />
</div>;
```

```tsx
import { Toggle } from "@/components/ui/toggle";

<div className="flex flex-row flex-wrap">
  <Toggle aria-label="Enable Firewall" checked={false} readOnly />
  <Toggle aria-label="Enable Firewall" checked={false} readOnly size="medium" />
  <Toggle aria-label="Enable Firewall" checked={false} readOnly size="large" />
</div>;
```

```tsx
import { Toggle } from "@/components/ui/toggle";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";

export function Component() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col">
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="amber"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="red"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="amber"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
        size="large"
      />
      <Toggle
        aria-label="Enable Firewall"
        checked={checked}
        color="red"
        icon={{
          checked: <Lock className="size-2" aria-hidden />,
          unchecked: <LockOpen className="size-2" aria-hidden />,
        }}
        onChange={() => setChecked(!checked)}
        size="large"
      />
    </div>
  );
}
```

启用防火墙启用防火墙

启用防火墙启用防火墙

启用防火墙启用防火墙

启用防火墙启用防火墙

```tsx
import { Toggle } from "@/components/ui/toggle";
import { Lock, LockOpen } from "lucide-react";
import { useState } from "react";

export function Component() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle checked={checked} onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
        <Toggle checked={checked} direction="rtl" onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle checked={checked} size="large" onChange={() => setChecked(!checked)}>
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle
          checked={checked}
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
      <div className="flex flex-row items-stretch justify-start gap-4">
        <Toggle
          checked={checked}
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
        <Toggle
          checked={checked}
          direction="rtl"
          icon={{
            checked: <Lock className="size-2" aria-hidden />,
            unchecked: <LockOpen className="size-2" aria-hidden />,
          }}
          size="large"
          onChange={() => setChecked(!checked)}
        >
          Enable Firewall
        </Toggle>
      </div>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { Toggle } from "@/components/ui/toggle";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">checked</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">受控开关状态。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">接收状态变化。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 单个布尔设置且 ON 立即生效用 Toggle，如 Password Protection 或 Auto-Cancel Builds。多选列表用 Checkbox，2–3 互斥视图用 Switch。
- checked 可选；同时传入 checked 与 onChange 时由调用方控制，也可用 defaultChecked 设置非受控初始状态。
- 变更即持久化，并用 useToasts().success(…) 展示结果（Password protection enabled）；不要让用户怀疑开关是否生效。仅当设置需要显式 Save 步骤时才配表单页脚。
- 仅当动作确实不可能时（缺套餐、策略锁定）禁用 Toggle；配说明解决方式的辅助文本或 Tooltip。
- 标签是 children 而非 label prop。首字母大写名词短语、1–4 个词，命名 ON 时成立的状态：Password Protection，而非 Enable Password Protection。
- 在标签下渲染可选的一句说明，只解释 ON。不要描述 OFF；它是否定。
- 通过 children、aria-label 或 aria-labelledby 提供可访问名称。三者都缺失时 Geist 在开发模式警告。
- 保持 labelCasing="title"（默认值），让标签与其他首字母大写表面一致。
- 仅当可见标签位于行上别处时才设 aria-label；否则让 children 承载它，让视觉与读屏文案保持一致。
