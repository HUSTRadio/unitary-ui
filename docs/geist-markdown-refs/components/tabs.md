# Tabs

Display tab content.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Apple" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#171717
>   "Orange" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#4d4d4d
>   "Mango" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#4d4d4d
> - **Disabled**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Apple" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#171717
>   "Orange" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#4d4d4d
>   "Mango" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#4d4d4d
> - **Disable specific tabs**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Apple" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#171717
>   "Orange" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#4d4d4d
>   "Mango" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#4d4d4d
> - **With icons**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "GitHub" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#171717
>   "GitLab" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#4d4d4d
>   "Bitbucket" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#4d4d4d
> - **Secondary**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "GitHub" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#ffffff · bg:#171717 · r:6px
>   "GitLab" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#171717 · bg:#00000014 · r:6px
>   "Bitbucket" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#4d4d4d · bg:#ebebeb · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Apple" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#ededed
>   "Orange" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#a1a1a1
>   "Mango" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#a1a1a1
> - **Disabled**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Apple" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#ededed
>   "Orange" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#a1a1a1
>   "Mango" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#a1a1a1
> - **Disable specific tabs**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Apple" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#ededed
>   "Orange" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#a1a1a1
>   "Mango" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#a1a1a1
> - **With icons**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "GitHub" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#ededed
>   "GitLab" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#a1a1a1
>   "Bitbucket" · .cursor-pointer · h:50px · pad:14px 2px · 400 14px/20px · fg:#a1a1a1
> - **Secondary**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "GitHub" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#0a0a0a · bg:#ededed · r:6px
>   "GitLab" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#ededed · bg:#ffffff17 · r:6px
>   "Bitbucket" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#a1a1a1 · bg:#1f1f1f · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import { Tabs } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [selected, setSelected] = useState("apple");

  return (
    <Tabs
      selected={selected}
      setSelected={(t) => setSelected(t)}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        { title: "Mango", value: "mango" },
      ]}
    />
  );
}
```

## Disabled

```tsx
import { Tabs } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [selected, setSelected] = useState("apple");

  return (
    <Tabs
      disabled
      selected={selected}
      setSelected={(t) => setSelected(t)}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        { title: "Mango", value: "mango" },
      ]}
    />
  );
}
```

## Disable specific tabs

```tsx
import { Tabs } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [selected, setSelected] = useState("apple");

  return (
    <Tabs
      selected={selected}
      setSelected={(t) => setSelected(t)}
      tabs={[
        { title: "Apple", value: "apple" },
        { title: "Orange", value: "orange" },
        {
          title: "Mango",
          value: "mango",
          disabled: true,
          tooltip: "Mangos are not allowed",
        },
      ]}
    />
  );
}
```

## With icons

```tsx
import { Tabs } from "@vercel/geistcn/components";
import {
  LogoIconBitbucket,
  LogoIconGithubSvg,
  LogoIconGitlabSvg,
} from "@vercel/geistcn-assets/logos";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [git, setGit] = useState("github");

  return (
    <Tabs
      selected={git}
      setSelected={(t) => setGit(t)}
      tabs={[
        { title: "GitHub", value: "github", icon: <LogoIconGithubSvg /> },
        { title: "GitLab", value: "gitlab", icon: <LogoIconGitlabSvg /> },
        {
          title: "Bitbucket",
          value: "bitbucket",
          icon: <LogoIconBitbucket colored />,
        },
      ]}
    />
  );
}
```

## Secondary

```tsx
import { Tabs } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

export function Component(): JSX.Element {
  const [git, setGit] = useState("github");

  return (
    <Tabs
      selected={git}
      setSelected={(t) => setGit(t)}
      tabs={[
        { title: "GitHub", value: "github" },
        { title: "GitLab", value: "gitlab" },
        { title: "Bitbucket", value: "bitbucket", disabled: true },
      ]}
      variant="secondary"
    />
  );
}
```

## Best Practices

### When to use

- Use Tabs to switch between sibling views inside a single page (Overview, Logs, Settings).

- For navigation between unrelated pages, use a sub-menu, not Tabs. Tabs imply the views share scope, URL parent, and data model.

- Cap a Tabs row at 5–7 entries on desktop and 3–4 on mobile. Past that, consolidate or move secondary views behind a Menu.

### Behavior

- Selecting a tab is instant; don’t trigger network confirmation or toast on tab change.

- Reflect the active tab in the URL (query param or path) so deep-links and refresh restore state.

- Disable individual tabs only for permission or empty-state reasons; pair the disabled tab with a tooltip that names the constraint.

### Content

- tabs[].title is Title Case, 1–2 words, and names the destination noun (Overview, Logs, Settings). Verbs belong on buttons; View Logs is wrong on a tab.

- tabs[].tooltip is sentence case and explains the constraint (Only visible to project owners.), not the tab’s purpose.

- Don’t append a count to the title (Logs (12)); use a badge slot instead and drop the badge at zero.

### Accessibility

- Keep Left/Right arrows moving focus across tabs and Enter/Space activating; don’t hijack with global shortcuts.

- Label the tablist with aria-label when no visible heading sits above it (aria-label="Sections").

- Maintain a visible focus ring on the active tab; don’t suppress focus styles for visual polish.

Was this helpful?
