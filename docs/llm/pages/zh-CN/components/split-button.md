# 拆分按钮

> Route: `/components/split-button`

将主要操作与一组简短的相关操作菜单组合。

[返回组件](#/components)

# 拆分按钮

Split Button

将主要操作与一组简短的相关操作菜单组合。

## 何时使用

-   两个或更多操作共享同一行且高度相关时（如 'Deploy' 和 'Deploy to staging'）。
-   需要平衡可见性和节省空间——主要操作需要醒目，次要变体以菜单形式呈现。

## 何时不应使用

-   超过三个相关动作时使用 Menu 替代；拆分按钮的菜单不应成为垃圾箱。
-   当两个动作重要程度相当时，使用并排的两个 Button 而非主次分级。

## 示例

### 基础用法

带有主操作和基本菜单的下拉拆分按钮。

### 带图标

拆分按钮中使用图标增强操作的视觉识别度。

### 标题与图标组合

在按钮标签旁边同时显示文字和图标的用法。

## 无障碍

-   菜单按钮应设置描述性 aria-label（如 'Deploy to staging'）而非仅用下三角图标。
-   主按钮为正常焦点元素，菜单打开后焦点锁定在项目内，Escape 关闭并返回触发元素。

## 受控行为

不适用: Split Button 本身不暴露受控 API；菜单的开闭由内部 state 管理。

## 响应式行为

-   在窄视图中拆分按钮保持完整功能，但菜单宽度随窗口边界自动翻转以避免裁切。

## 主题行为

-   拆分按钮继承 Button 的 variant 体系（primary、secondary、error 等），两个部分风格一致。

## 实时示例

## 菜单对齐

```tsx
import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";

<div className="flex flex-wrap items-start gap-8">
  <SplitButton
    buttonProps={{ type: "default" }}
    menuButtonLabel="Select save method"
    menuItems={
      <>
        <SplitButtonMenuItem description="Save changes" title="Save" />
        <SplitButtonMenuItem
          description="Save changes and create a new production deployment"
          title="Save + Redeploy"
        />
      </>
    }
    menuProps={{ width: 264 }}
  >
    Save (bottom-start)
  </SplitButton>
  <SplitButton
    buttonProps={{ type: "secondary" }}
    menuAlignment="bottom-end"
    menuButtonLabel="Select save method"
    menuItems={
      <>
        <SplitButtonMenuItem description="Save changes" title="Save" />
        <SplitButtonMenuItem
          description="Save changes and create a new production deployment"
          title="Save + Redeploy"
        />
      </>
    }
    menuProps={{ width: 264 }}
  >
    Save (bottom-end)
  </SplitButton>
</div>
```

## 图标

```tsx
import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";
import { ExternalLink, Rocket } from "lucide-react";

<SplitButton
  buttonProps={{ size: "small", type: "secondary" }}
  menuButtonLabel="Copy page"
  menuItems={[
    <SplitButtonMenuItem
      key="v0"
      description="Open this page in v0"
      menuItemProps={{ className: "w-[200px]" }}
      title="Open in v0"
      icon={<Rocket className="size-4" aria-hidden />}
    />,
    <SplitButtonMenuItem
      key="chatgpt"
      description="Open this page in ChatGPT"
      menuItemProps={{ className: "w-[200px]" }}
      title="Open in ChatGPT"
      icon={<ExternalLink className="size-4" aria-hidden />}
    />,
  ]}
  menuProps={{ width: 240 }}
>
  Copy page
</SplitButton>
```

## 带图标标题

```tsx
import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";
import { CircleArrowUp, Save } from "lucide-react";

<div className="flex w-full flex-col gap-8">
  {(["default", "secondary"] as const).map((variant) => (
    <div key={variant} className="flex flex-row gap-1">
      {(["small", "medium", "large"] as const).map((size) => (
        <SplitButton
          key={`${variant}-${size}`}
          buttonProps={{ size, type: variant }}
          menuButtonLabel="Select save method"
          menuItems={
            <>
              <SplitButtonMenuItem
                description="Save changes"
                title={
                  <span className="flex items-center gap-2">
                    <Save className="size-4" aria-hidden /> Save
                  </span>
                }
              />
              <SplitButtonMenuItem
                description="Save changes and create a new production deployment"
                title={
                  <span className="flex items-center gap-2">
                    <CircleArrowUp className="size-4" aria-hidden /> Save + Redeploy
                  </span>
                }
              />
            </>
          }
          menuProps={{ width: 264 }}
        >
          Save
        </SplitButton>
      ))}
    </div>
  ))}
</div>
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import { SplitButton, SplitButtonMain, SplitButtonMenu, SplitButtonMenuItem } from "@/components/ui/split-button"
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onClick</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MouseEventHandler&lt;HTMLButtonElement&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">主操作。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menu</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">次级操作菜单。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

-   把最常见的动作放在主按钮上，并把菜单限制为密切相关的变体。
-   用目标与用途命名菜单按钮，而非 chevron 图标。
