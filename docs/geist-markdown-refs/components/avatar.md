# Avatar

Avatars represent a user or a team. Stacked avatars represent a group of people

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Group**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Stacking order**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Overlap**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Fixed overlap**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Size**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Git**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **With custom icon**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Letter**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Placeholder**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Group**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Stacking order**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Overlap**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Fixed overlap**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Size**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Git**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **With custom icon**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Letter**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Placeholder**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Group

```tsx
import { AvatarGroup } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <AvatarGroup
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={32}
      />
      <AvatarGroup
        limit={4}
        members={[
          { username: "christopherkindl" },
          { username: "rauno" },
          { username: "shuding" },
          { username: "skllcrn" },
          { username: "almonk" },
        ]}
        size={32}
      />
    </div>
  );
}
```

## Stacking order

By default the first member sits on top of the stack, so the first credited author stays the most prominent. Set reverse to flip the order so the last member sits on top instead. The visual left-to-right order is unchanged.

```tsx
import { AvatarGroup } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  const members = [
    { username: "evilrabbit" },
    { username: "severinlandolt" },
    { username: "rauchg" },
  ];

  return (
    <div className="flex items-center gap-4">
      <AvatarGroup members={members} size={32} />
      <AvatarGroup members={members} reverse size={32} />
    </div>
  );
}
```

## Overlap

By default overlap="auto" scales the spacing with size, keeping a generous, evenly-spaced cluster at any size.

```tsx
import { AvatarGroup } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  const members = [
    { username: "evilrabbit" },
    { username: "severinlandolt" },
    { username: "rauchg" },
  ];

  return (
    <div className="flex items-center gap-6">
      <AvatarGroup members={members} overlap="auto" size={16} />
      <AvatarGroup members={members} overlap="auto" size={24} />
      <AvatarGroup members={members} overlap="auto" size={32} />
      <AvatarGroup members={members} overlap="auto" size={48} />
    </div>
  );
}
```

## Fixed overlap

Pass a number to set the overlap in pixels instead. Lower values give more generous spacing; higher values pack tighter for dense, space-constrained UI.

```tsx
import { AvatarGroup } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  const members = [
    { username: "evilrabbit" },
    { username: "severinlandolt" },
    { username: "rauchg" },
  ];

  return (
    <div className="flex items-center gap-4">
      <AvatarGroup members={members} overlap={10} size={24} />
      <AvatarGroup members={members} overlap={6} size={24} />
      <AvatarGroup members={members} overlap={0} size={24} />
    </div>
  );
}
```

## Size

```tsx
import { Avatar } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <Avatar size={24} username="evilrabbit" />
      <Avatar size={32} username="evilrabbit" />
      <Avatar size={48} username="evilrabbit" />
    </div>
  );
}
```

## Git

```tsx
import { GitHubAvatar, GitLabAvatar, BitbucketAvatar } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <GitHubAvatar size={32} username="rauchg" />
      <GitLabAvatar size={32} username="severinlandolt" />
      <BitbucketAvatar size={32} username="evilrabbit" />
    </div>
  );
}
```

## With custom icon

```tsx
import { AvatarWithIcon } from "@vercel/geistcn/components";
import type { JSX } from "react";
import {
  IconArrowCircleDown,
  IconCheckCircleFill,
  IconClockDashed,
} from "@vercel/geistcn-assets/icons";

export function Component(): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <AvatarWithIcon
        icon={<IconArrowCircleDown size={14} color="gray-900" />}
        size={32}
        iconBackground
      />
      <AvatarWithIcon
        icon={<IconCheckCircleFill size={14} color="gray-900" />}
        size={32}
        iconBackground
      />
      <AvatarWithIcon
        icon={<IconClockDashed size={14} color="gray-900" />}
        size={32}
        iconBackground
      />
    </div>
  );
}
```

## Letter

```tsx
import { Avatar } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <Avatar letter="SL" placeholder size={32} />
      <Avatar letter="EK" placeholder size={32} />
      <Avatar letter="CK" placeholder size={32} />
    </div>
  );
}
```

## Placeholder

```tsx
import { Avatar } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Avatar placeholder size={90} />;
}
```

## Best Practices

- Use a single <Avatar> for one person, team, or organization. For two or more stacked avatars, use <AvatarGroup> so the cluster gets correct overlap, sizing, and a single accessible label.

- Pass src first and fall back to letter (1–2 uppercase chars) when the image is missing. Reserve placeholder for the loading shell, never as a permanent fallback.

- title is the literal entity name (Acme Inc., Jane Doe). Geist already prefixes letter avatars with Avatar with initials: for screen readers, so don’t hand-write Avatar of ….

- Keep letter uppercase and derived from the entity name. No emoji, no punctuation, no ?.

- Pick a size that matches adjacent type: 20–24px next to text-label-14, 32px next to text-label-16, 48–64px in headers and onboarding states.

Was this helpful?
