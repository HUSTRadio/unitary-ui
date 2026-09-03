# Entity

> Route: `/components/entity`

A structured row for an entity and its primary action.

[Back to Components](#/components)

# Entity

Entity

A structured row for an entity and its primary action.

## When to use

- For one descriptive object with one primary row action, like a membership row, integration row, or resource detail row.
- When you need media, content, and actions in stable columns so loading and selected states do not shift the row layout.

## When not to use

- Use Table when rows share comparable columns — Entity is for single-object rows, not tabular comparison.
- A key/value metadata block on a detail page should use Description, not Entity.
- Empty lists should render Empty State outside the table rather than empty Entity rows.

## Examples

### Default entity row

Standard Entity row structure with three columns: media area, content area, and action area.

### Skeleton loading

Entity row shows skeleton placeholders during async data loading, transitioning smoothly to real content on resolve.

### Entity with list

Multiple Entity rows combined into a list view, each row displaying independent resource details and the primary action.

### Fill layout

Entity uses fill layout so columns stretch proportionally to adapt to container width changes.

## Accessibility

- Primary action buttons require clear aria-labels naming the specific action and target resource.
- Each Entity row is organized as an independent semantic block for screen-reader-friendly line-by-line narration.
- Action-area links and buttons should have adequate touch target sizes.

## Controlled behavior

Not applicable: Entity is fundamentally a presentation row component and does not manage its own interaction state. Selection state is controlled externally via props, and row-level clicks are typically handled by the outer container — the Entity component itself is responsible for displaying, not for open/close logic.

## Responsive behavior

- Entity uses a fixed flex row and does not automatically hide content or convert actions to icons on narrow screens.
- Use className, leftClassName, and rightClassName to add application-specific breakpoints, wrapping, or visibility rules.

## Theme behavior

- Row background, borders, and hover highlights follow the application's CSS token system.
- Dividers and hover effects transition correctly between dark and light modes.

## Live Demo

- ![Avatar for evilrabbit](https://vercel.com/api/www/avatar?s=64&u=evilrabbit "Avatar for evilrabbit")

  Evil Rabbit

  Glenn Hitchcock (@gln)

  Connected 1h ago

```tsx
import { Avatar } from "@/components/ui/avatar";
import {
  Entity,
  EntityAction,
  EntityContent,
  EntityDescription,
  EntityMedia,
  EntityTitle,
} from "@/components/ui/entity";

<Entity>
  <EntityMedia>
    <Avatar size={32} username="evilrabbit" />
  </EntityMedia>
  <EntityContent fill>
    <EntityTitle>Evil Rabbit</EntityTitle>
    <EntityDescription>Glenn Hitchcock (@gln)</EntityDescription>
  </EntityContent>
  <EntityAction>
    <p className="text-copy-14 text-gray-900">Connected 1h ago</p>
  </EntityAction>
</Entity>;
```

```tsx
import { Entity } from "@/components/ui/entity";
import { Skeleton } from "@/components/ui/skeleton";

<Entity>
  <div className="flex flex-col items-stretch justify-start gap-2 flex-1">
    <Skeleton height={20} width="100%" />
    <div className="flex flex-row items-center justify-start gap-2 flex-initial">
      <Skeleton height={20} width={70} />
      <Skeleton height={20} width={60} />
      <Skeleton height={20} width={68} />
    </div>
  </div>
</Entity>;
```

- GitHub Desktop on MacBook Pro

  Last used just now

- VS Code on Windows 11

  Last used 10min ago

- Terminal on Ubuntu 24.04

  Last used 25min ago

```tsx
import { Button } from "@/components/ui/button";
import {
  Entity,
  EntityAction,
  EntityContent,
  EntityDescription,
  EntityTitle,
} from "@/components/ui/entity";

<ul className="flex flex-col">
  <Entity>
    <EntityContent>
      <EntityTitle>GitHub Desktop on MacBook Pro</EntityTitle>
      <EntityDescription>Last used just now</EntityDescription>
    </EntityContent>
    <EntityAction>
      <Button size="small" type="secondary">
        Decline
      </Button>
    </EntityAction>
  </Entity>
  <Entity>
    <EntityContent>
      <EntityTitle>VS Code on Windows 11</EntityTitle>
      <EntityDescription>Last used 10min ago</EntityDescription>
    </EntityContent>
    <EntityAction>
      <Button size="small" type="secondary">
        Decline
      </Button>
    </EntityAction>
  </Entity>
  <Entity>
    <EntityContent>
      <EntityTitle>Terminal on Ubuntu 24.04</EntityTitle>
      <EntityDescription>Last used 25min ago</EntityDescription>
    </EntityContent>
    <EntityAction>
      <Button size="small" type="secondary">
        Decline
      </Button>
    </EntityAction>
  </Entity>
</ul>;
```

```tsx
import { Checkbox } from "@/components/ui/checkbox";
import {
  Entity,
  EntityContent,
  EntityDescription,
  EntityMedia,
  EntityTitle,
} from "@/components/ui/entity";
import { useState } from "react";

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

<ul className="flex flex-col">
  {items.map((item) => (
    <Entity key={item.id} onClick={() => handleCheckboxChange(item.id)}>
      <EntityMedia>
        <Checkbox
          aria-label={item.title}
          checked={checkedStates[item.id]}
          onChange={() => handleCheckboxChange(item.id)}
        />
      </EntityMedia>
      <EntityContent>
        <EntityTitle>{item.title}</EntityTitle>
        <EntityDescription>{item.description}</EntityDescription>
      </EntityContent>
    </Entity>
  ))}
</ul>;
```

- This is a simple description

  This is a simple description

```tsx
import { Entity, EntityContent, EntityDescription } from "@/components/ui/entity";

<ul className="flex flex-col">
  <Entity>
    <EntityContent fill>
      <EntityDescription>This is a simple description</EntityDescription>
    </EntityContent>
    <EntityContent>
      <EntityDescription>This is a simple description</EntityDescription>
    </EntityContent>
  </Entity>
</ul>;
```

- Entity with dashed borders

  \[some action\]

```tsx
import { Avatar } from "@/components/ui/avatar";
import {
  Entity,
  EntityAction,
  EntityContent,
  EntityDescription,
  EntityMedia,
} from "@/components/ui/entity";

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
      <span className="text-copy-14 text-gray-900">[some action]</span>
    </EntityAction>
  </Entity>
</ul>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import {
  Entity,
  EntityMedia,
  EntityContent,
  EntityTitle,
  EntityDescription,
  EntityAction,
} from "@/components/ui/entity";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Composable entity slots.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Entity for one descriptive object with one primary row action; use Table when rows share comparable columns.
- Keep media, content, and actions in stable columns so loading and selected states do not shift the row.
