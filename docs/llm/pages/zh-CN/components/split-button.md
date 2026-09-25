# 拆分按钮

> Route: `/components/split-button`

将主要操作与一组简短的相关操作菜单组合。

[返回组件](#/components)

# 拆分按钮

Split Button

将主要操作与一组简短的相关操作菜单组合。

## 何时使用

- 两个或更多操作共享同一行且高度相关时（如 'Deploy' 和 'Deploy to staging'）。
- 需要平衡可见性和节省空间——主要操作需要醒目，次要变体以菜单形式呈现。
- 下拉卡片变体（variant="pulldown"）用 expandCorner 指定卡片锚定的角；当触发按钮贴近屏幕或工具栏底部、下方空间不足时，用 bottom-left / bottom-right 让卡片向上展开。

## 何时不应使用

- 超过三个相关动作时使用 Menu 替代；拆分按钮的菜单不应成为垃圾箱。
- 当两个动作重要程度相当时，使用并排的两个 Button 而非主次分级。

## 示例

### 基础用法

带有主操作和基本菜单的下拉拆分按钮。

### 带图标

拆分按钮中使用图标增强操作的视觉识别度。

### 标题与图标组合

菜单项通过 icon 属性在标题左侧加图标，两行条目中图标与首行标题对齐。

### 下拉卡片（pull-down）

variant="pulldown" 将菜单渲染为悬浮卡片；expandCorner 指定卡片锚定不动的角——top-left / top-right 从上方锚点向下展开（卡片在按钮下方），bottom-left / bottom-right 从下方锚点向上展开（卡片在按钮上方）。动画原点固定在锚定角，卡片朝对角缩放入场。向上展开用于触发按钮贴近屏幕底部、下方无空间可用的场景。

## 无障碍

- 菜单按钮应设置描述性 aria-label（如 'Deploy to staging'）而非仅用下三角图标。
- 主按钮为正常焦点元素，菜单打开后焦点锁定在项目内，Escape 关闭并返回触发元素。
- 破坏性菜单项经 menuItemProps.type="error" 标红，并在执行前请用户确认：确认浮层由调用方在 onClick 中串接，出现在菜单之外、可取消。

## 受控行为

不适用: Split Button 本身不暴露受控 API；菜单的开闭由内部 state 管理。

## 响应式行为

- 在窄视图中拆分按钮保持完整功能，但菜单宽度随窗口边界自动翻转以避免裁切。

## 主题行为

- 拆分按钮继承 Button 的 variant 体系（primary、secondary、error 等），两个部分风格一致。

## 实时示例

```tsx
import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";

export function SplitButtonMenuAlignmentAE78EA5CExample() {
  return (
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
  );
}
```

## 图标

```tsx
import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";
import { ExternalLink, Rocket } from "lucide-react";

export function SplitButtonIconA35ABCD6Example() {
  return (
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
  );
}
```

## 带图标标题

```tsx
import { SplitButton, SplitButtonMenuItem } from "@/components/ui/split-button";
import { CircleArrowUp, Save } from "lucide-react";

export function SplitButtonTitleWithIcon9D4D6961Example() {
  return (
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
                  {/* 图标必须走官方 icon prop（MenuItem prefix 槽）：嵌进 title 会让
                      description 顶到图标正下方、不随图标缩进，两行排版错位。 */}
                  <SplitButtonMenuItem
                    description="Save changes"
                    icon={<Save className="size-4" aria-hidden />}
                    title="Save"
                  />
                  <SplitButtonMenuItem
                    description="Save changes and create a new production deployment"
                    icon={<CircleArrowUp className="size-4" aria-hidden />}
                    title="Save + Redeploy"
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
  );
}
```

## 下拉卡片

No command yet.

```tsx
import * as React from "react";

import {
  SplitButton,
  SplitButtonMenuItem,
  type SplitButtonExpandCorner,
} from "@/components/ui/split-button";

const CORNERS: readonly SplitButtonExpandCorner[] = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
];

/**
 * Pull-down Button —— split-button 的悬浮卡片变体：
 * 卡片锚定按钮的 expandCorner 角，向对向展开（动画原点即该角）。
 */
export function SplitButtonPullDownCard6B3F1D80Example() {
  const [corner, setCorner] = React.useState<SplitButtonExpandCorner>("top-left");
  const [log, setLog] = React.useState("No command yet.");

  const items = (
    <>
      <SplitButtonMenuItem
        title="New file"
        description="Create a blank file"
        menuItemProps={{ onClick: () => setLog("New file") }}
      />
      <SplitButtonMenuItem
        title="New folder"
        description="Create an empty folder"
        menuItemProps={{ onClick: () => setLog("New folder") }}
      />
      <SplitButtonMenuItem
        title="Import…"
        description="Bring in an existing project"
        menuItemProps={{ onClick: () => setLog("Import…") }}
      />
    </>
  );

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <SplitButton
        variant="pulldown"
        expandCorner={corner}
        buttonProps={{ type: "secondary", onClick: () => setLog("New file (default)") }}
        menuItems={items}
      >
        New
      </SplitButton>
      <div className="flex flex-wrap gap-1">
        {CORNERS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setCorner(value)}
            className={
              value === corner
                ? "rounded-md bg-gray-alpha-200 px-2 py-1 text-label-13 text-gray-1000"
                : "rounded-md px-2 py-1 text-label-13 text-gray-900 hover:bg-gray-alpha-100"
            }
          >
            {value}
          </button>
        ))}
      </div>
      <p className="text-copy-13 text-gray-900">{log}</p>
    </div>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import {
  SplitButton,
  SplitButtonMain,
  SplitButtonMenu,
  SplitButtonMenuItem,
} from "@/components/ui/split-button";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">buttonProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ButtonProps</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">主操作按钮属性。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuButtonLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">菜单触发器的无障碍标签。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"More options"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuButtonDisabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">仅禁用菜单触发按钮（主操作保持可用）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuAlignment</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SplitButtonMenuAlignment</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">将菜单对齐到主按钮或菜单按钮边缘。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"bottom-start"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SplitButtonVariant</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">split 渲染按钮加菜单列表；pulldown 渲染从指定角展开的悬浮卡片。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"split"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">expandCorner</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SplitButtonExpandCorner</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">pulldown 卡片锚定的角；卡片朝对角方向展开。top-* 向下展开（卡片在按钮下方），bottom-* 向上展开（卡片在按钮上方）。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top-left"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuItems</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">次级菜单项。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ComponentProps&lt;typeof Menu&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">透传给菜单表面的属性。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">菜单项标题。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">description</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">菜单项描述。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">菜单项图标。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">menuItemProps</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Omit&lt;ComponentProps&lt;typeof MenuItem&gt;, "children" | "prefix" | "suffix"&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">透传给菜单项的属性。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 把最常见的动作放在主按钮上，并把菜单限制为密切相关的变体。
- 用目标与用途命名菜单按钮，而非 chevron 图标。
