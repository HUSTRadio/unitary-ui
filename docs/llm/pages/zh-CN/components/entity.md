# 实体

> Route: `/components/entity`

在一行中展示资源信息和主要操作。

[返回组件](#/components)

# 实体

entity

在一行中展示资源信息和主要操作。

## 何时使用

- 展示单一描述性对象附带一个主操作行，例如成员行、集成行或资源详情行。
- 需要将媒体、内容和操作固定在稳定列中以保证加载和选中状态不会改变行的布局时。

## 何时不应使用

- 多行共享可比列的场景应使用 Table 而非 Entity，Table 更适合横向比较。
- 键/值元数据块应使用 Description 组件而非 Entity。
- 空列表数据应渲染 Empty State 而非空 Entity 行。

## 示例

### 默认实体行

标准 Entity 行结构包含媒体区域、内容区域和操作区域三列。

### 骨架屏加载中

Entity 行在数据异步加载时显示骨架屏占位，加载完成后平滑过渡到真实内容。

### 带列表的实体

多个 Entity 行组合成的列表视图，每行展示独立资源的详细信息和主操作。

### 弹性填充布局

Entity 使用 fill 布局使各列按比例伸缩以适应容器宽度变化。

## 无障碍

- 主操作按钮需要明确的 aria-label 命名具体操作和目标资源。
- 每个 Entity 行作为独立语义区块组织，便于屏幕阅读器逐行播报。
- 操作区域中的链接和按钮应有足够的触摸目标尺寸。

## 受控行为

不适用: Entity 只负责行布局；选中状态和点击操作由父组件处理。

## 响应式行为

- Entity 本身使用固定的 flex 行布局，不会在窄屏自动隐藏内容或把操作改为图标。
- 调用方可通过 className、leftClassName 和 rightClassName 添加断点、换行或隐藏策略。

## 主题行为

- 行的背景、边框和悬停高亮通过 CSS 令牌跟随主题系统。
- 分隔线和 hover 效果在暗色/亮色模式间正确转换。

## 实时示例

- ![用户 evilrabbit 的头像](https://github.com/evilrabbit.png?size=64)

  Evil Rabbit

  Glenn Hitchcock (@gln)

  Connected 1h ago

```tsx
import { Avatar } from "@hustradio/unitary-ui";
import {
  Entity,
  EntityAction,
  EntityContent,
  EntityDescription,
  EntityMedia,
  EntityTitle,
} from "@hustradio/unitary-ui";

export function EntityDefault37A8EEC1Example() {
  return (
    <Entity>
      <EntityMedia>
        <Avatar size={32} username="evilrabbit" />
      </EntityMedia>
      <EntityContent fill>
        <EntityTitle>Evil Rabbit</EntityTitle>
        <EntityDescription>Glenn Hitchcock (@gln)</EntityDescription>
      </EntityContent>
      <EntityAction>
        <p className="text-copy-14 text-muted-foreground">Connected 1h ago</p>
      </EntityAction>
    </Entity>
  );
}
```

## 骨架屏加载中

```tsx
import { Entity } from "@hustradio/unitary-ui";
import { Skeleton } from "@hustradio/unitary-ui";

export function EntityEntityWithSkeleton02290A9AExample() {
  return (
    <Entity>
      <div className="flex flex-col items-stretch justify-start gap-2 flex-1">
        <Skeleton height={20} width="100%" />
        <div className="flex flex-row items-center justify-start gap-2 flex-initial">
          <Skeleton height={20} width={70} />
          <Skeleton height={20} width={60} />
          <Skeleton height={20} width={68} />
        </div>
      </div>
    </Entity>
  );
}
```

## 带列表的实体

- GitHub Desktop on MacBook Pro

  Last used just now

- VS Code on Windows 11

  Last used 10min ago

- Terminal on Ubuntu 24.04

  Last used 25min ago

```tsx
import { useState } from "react";
import { Button } from "@hustradio/unitary-ui";
import {
  Entity,
  EntityAction,
  EntityContent,
  EntityDescription,
  EntityTitle,
} from "@hustradio/unitary-ui";

const INITIAL_SESSIONS = [
  { id: "github", title: "GitHub Desktop on MacBook Pro", description: "Last used just now" },
  { id: "vscode", title: "VS Code on Windows 11", description: "Last used 10min ago" },
  { id: "terminal", title: "Terminal on Ubuntu 24.04", description: "Last used 25min ago" },
] as const;

export function EntityEntityWithListBD7895E8Example() {
  const [sessions, setSessions] =
    useState<ReadonlyArray<(typeof INITIAL_SESSIONS)[number]>>(INITIAL_SESSIONS);
  const [message, setMessage] = useState("");

  const decline = (id: string, title: string) => {
    setSessions((current) => current.filter((session) => session.id !== id));
    setMessage(`${title} declined`);
  };

  return (
    <div>
      <ul className="flex flex-col">
        {sessions.map((session) => (
          <Entity key={session.id}>
            <EntityContent>
              <EntityTitle>{session.title}</EntityTitle>
              <EntityDescription>{session.description}</EntityDescription>
            </EntityContent>
            <EntityAction>
              <Button
                size="small"
                type="secondary"
                onClick={() => decline(session.id, session.title)}
              >
                Decline
              </Button>
            </EntityAction>
          </Entity>
        ))}
      </ul>
      <span role="status" aria-live="polite" className="sr-only">
        {message}
      </span>
    </div>
  );
}
```

## 带列表与复选框的实体

- GitHub Desktop on MacBook Pro

  Last used just now

- VS Code on Windows 11

  Last used 10min ago

- Terminal on Ubuntu 24.04

  Last used 25min ago

```tsx
import { Checkbox } from "@hustradio/unitary-ui";
import {
  Entity,
  EntityContent,
  EntityDescription,
  EntityMedia,
  EntityTitle,
} from "@hustradio/unitary-ui";
import { useState } from "react";

export function EntityEntityWithListAndCheckbox26EB60A8Example() {
  const items = [
    {
      id: "github",
      title: "GitHub Desktop on MacBook Pro",
      description: "Last used just now",
    },
    {
      id: "vscode",
      title: "VS Code on Windows 11",
      description: "Last used 10min ago",
    },
    {
      id: "terminal",
      title: "Terminal on Ubuntu 24.04",
      description: "Last used 25min ago",
    },
  ];

  const [checkedStates, setCheckedStates] = useState<Record<string, boolean>>({
    github: true,
    vscode: false,
    terminal: false,
  });

  const handleCheckboxChange = (id: string): void => {
    setCheckedStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <Entity key={item.id} onClick={() => handleCheckboxChange(item.id)}>
          <EntityMedia>
            <Checkbox
              aria-label={item.title}
              checked={checkedStates[item.id]}
              onClick={(event) => event.stopPropagation()}
              onChange={() => handleCheckboxChange(item.id)}
            />
          </EntityMedia>
          <EntityContent>
            <EntityTitle>{item.title}</EntityTitle>
            <EntityDescription>{item.description}</EntityDescription>
          </EntityContent>
        </Entity>
      ))}
    </ul>
  );
}
```

## 弹性填充布局

- This is a simple description

  This is a simple description

```tsx
import { Entity, EntityContent, EntityDescription } from "@hustradio/unitary-ui";

export function EntityEntityWithFill1C9008CFExample() {
  return (
    <ul className="flex flex-col">
      <Entity>
        <EntityContent fill>
          <EntityDescription>This is a simple description</EntityDescription>
        </EntityContent>
        <EntityContent>
          <EntityDescription>This is a simple description</EntityDescription>
        </EntityContent>
      </Entity>
    </ul>
  );
}
```

## 自定义列样式

- Entity with dashed borders

  \[some action\]

```tsx
import { Avatar } from "@hustradio/unitary-ui";
import {
  Entity,
  EntityAction,
  EntityContent,
  EntityDescription,
  EntityMedia,
} from "@hustradio/unitary-ui";

export function EntityEntityWithColumnClassNames71E7FBA7Example() {
  return (
    <ul className="flex flex-col">
      <Entity
        leftClassName="border border-dashed border-gray-300 rounded-md p-2"
        rightClassName="border border-dashed border-gray-300 rounded-md p-2"
      >
        <EntityMedia>
          <Avatar placeholder size={50} />
        </EntityMedia>
        <EntityContent>
          <EntityDescription>Entity with dashed borders</EntityDescription>
        </EntityContent>
        <EntityAction>
          <span className="text-copy-14 text-muted-foreground">[some action]</span>
        </EntityAction>
      </Entity>
    </ul>
  );
}
```

## API 参考

组件的导入方式和 API 如下。\* 表示必填属性。

导入

```tsx
import {
  Entity,
  EntityMedia,
  EntityContent,
  EntityTitle,
  EntityDescription,
  EntityAction,
} from "@hustradio/unitary-ui";
```

### 属性与回调

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">名称</th><th class="px-3 py-2 font-medium">类型</th><th class="px-3 py-2 font-medium">说明</th><th class="px-3 py-2 font-medium">默认值</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">可组合的实体槽位。</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## 最佳实践

- 单个描述性对象配一个主要行动作用 Entity；行共享可比较列时用 Table。
- 把 media、content 与 actions 保持在稳定列，让加载与选中状态不移动行。
