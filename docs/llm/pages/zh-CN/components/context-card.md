# 上下文卡片

> Route: `/components/context-card`

在悬停或聚焦时显示比 Tooltip 更丰富信息的浮动卡片。

[返回组件](#/components)

# 上下文卡片

Context Card

在悬停或聚焦时显示比 Tooltip 更丰富信息的浮动卡片。

## 何时使用

- 需要在悬停或聚焦时揭示实体的元数据信息，例如用户头像旁的用户详情、部署名称旁的构建信息等。
- 触发器通常为密集数据中的名称链接或头像，需要补充一行识别信息和 2–4 行的 Label: value 元数据。

## 何时不应使用

- 如果只需一行简要解释而不含多行元数据，应改用 Tooltip 而非 Context Card。
- 不要使用 Context Card 展示破坏性操作（如删除），因为鼠标移出可能导致面板在用户提交前被意外关闭。

## 示例

### 默认上下文卡片

在触发元素悬停时显示包含实体名称、识别行和元数据行的基础上下文卡片。

### 对齐方式变体

演示上下文卡片相对于触发器的不同弹出对齐位置，以适配不同的空间布局需求。

### 自定义渲染属性

通过 render prop 完全自定义卡片的内部渲染逻辑，适用于需要特殊布局或非标准数据的场景。

## 无障碍

- ContextCard 是非模态 Hover Card，不会把焦点锁定在卡片内；触发元素应保持可聚焦，Escape 可关闭浮层。
- 触发元素保留自身的 accessible name；卡片是补充信息，不应替代触发元素的无障碍名称。
- 卡片内的内容不应重复触发元素已经展示的可见信息，避免信息冗余。

## 受控行为

不适用: ContextCard 根据鼠标悬停、聚焦等交互事件自动控制开闭状态，不提供外部值控制的 API。

## 响应式行为

不适用: ContextCard 为浮动覆盖卡片，通常在小区域内呈现，不涉及复杂的响应式布局调整。

## 主题行为

- 上下文卡片支持深色/浅色主题，样式跟随 Geist 设计系统的颜色令牌自动适配用户偏好的配色方案。

## 实时示例

Top

Bottom

Left

Right

```tsx
import { Button } from "@/components/ui/button";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";

export function ContextCardDefault37A8EEC1Example() {
  const card = (
    <ContextCard>
      <ContextCardHeader>
        <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
        <div>
          <ContextCardTitle>Acme Inc.</ContextCardTitle>
          <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
        </div>
      </ContextCardHeader>
      <ContextCardBody>
        <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
        <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
      </ContextCardBody>
      <ContextCardFooter>
        <Button type="secondary" typeName="button" size="small">
          View Project
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );

  return (
    <>
      {(["Top", "Bottom", "Left", "Right"] as const).map((label) => (
        <ContextCardTrigger
          key={label}
          content={card}
          side={label.toLowerCase() as "top" | "bottom" | "left" | "right"}
        >
          <span>{label}</span>
        </ContextCardTrigger>
      ))}
    </>
  );
}
```

## alignment

```tsx
import { Button } from "@/components/ui/button";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";

export function ContextCardAlignment47CCB97AExample() {
  const card = (
    <ContextCard>
      <ContextCardHeader>
        <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
        <div>
          <ContextCardTitle>Acme Inc.</ContextCardTitle>
          <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
        </div>
      </ContextCardHeader>
      <ContextCardBody>
        <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
        <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
      </ContextCardBody>
      <ContextCardFooter>
        <Button type="secondary" typeName="button" size="small">
          View Project
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );

  return (
    <>
      {(["Start", "Center", "End"] as const).map((label) => (
        <ContextCardTrigger
          key={label}
          content={card}
          align={label.toLowerCase() as "start" | "center" | "end"}
          render={
            <Button type="default" typeName="button">
              {label}
            </Button>
          }
        />
      ))}
    </>
  );
}
```

## render-prop

[Rendered as a link](#render-prop)

```tsx
import { Button } from "@/components/ui/button";
import {
  ContextCard,
  ContextCardBody,
  ContextCardDescription,
  ContextCardFooter,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardTrigger,
} from "@/components/ui/context-card";

export function ContextCardRenderProp84FF0355Example() {
  const card = (
    <ContextCard>
      <ContextCardHeader>
        <div className="size-8 shrink-0 rounded-full bg-gray-400" aria-hidden />
        <div>
          <ContextCardTitle>Acme Inc.</ContextCardTitle>
          <ContextCardDescription>@acme · San Francisco</ContextCardDescription>
        </div>
      </ContextCardHeader>
      <ContextCardBody>
        <p className="text-copy-13 text-muted-foreground">Last Active: 2h ago</p>
        <p className="text-copy-13 text-muted-foreground">Plan: Pro</p>
      </ContextCardBody>
      <ContextCardFooter>
        <Button type="secondary" typeName="button" size="small">
          View Project
        </Button>
      </ContextCardFooter>
    </ContextCard>
  );

  return (
    <>
      <ContextCardTrigger
        content={card}
        render={
          <Button type="default" typeName="button">
            Default wrapper
          </Button>
        }
      />
      <ContextCardTrigger
        content={card}
        render={
          <a href="#render-prop" className="text-blue-700 underline underline-offset-2">
            Rendered as a link
          </a>
        }
      />
    </>
  );
}
```

## API 参考

此页只列出稳定公开表面；原生属性请参阅对应元素类型。

导入

```tsx
import {
  ContextCard,
  ContextCardTrigger,
  ContextCardHeader,
  ContextCardTitle,
  ContextCardDescription,
  ContextCardAvatar,
  ContextCardBody,
  ContextCardFooter,
} from "@/components/ui/context-card";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">side</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"top" | "right" | "bottom" | "left"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">相对触发器的优先位置。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">openDelay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">鼠标意图触发前的延迟。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 悬停或聚焦时揭示实体元数据（用户、部署、项目、API 密钥）用 Context Card；触发器通常是密集数据里的名称链接或头像。
- 单行说明且无元数据行的场合用 Tooltip；长文、编辑表单或持久导航转到 Drawer 或详情页。
- 不要用 Context Card 呈现破坏性动作；光标移出时面板可能在用户提交前关闭。
- 交互内容限制为一个主动作（View Project、Open Settings）。多于一个 CTA 看起来像菜单，应放进 Menu。
- 以实体名称开头，作为首字母大写的标题，下接一行句首大写的识别信息，再跟 2–4 行 Label: value 元数据。
- 不要复述触发器已经显示的内容；如果该行已渲染部署 URL，不要作为卡片首行重复。
- 触发器保留自己的可访问名称；卡片是补充性的，不应取代它。Escape 关闭卡片并把焦点还给触发器。
