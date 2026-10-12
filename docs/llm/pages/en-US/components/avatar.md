# Avatar

> Route: `/components/avatar`

Represent a user or team with an image, initials, or a placeholder.

[Back to Components](#/components)

# Avatar

avatar

Represent a user or team with an image, initials, or a placeholder.

## When to use

- Use Avatar to represent a single user or team, displayed alongside name and role information.
- Use stacked Avatars to represent a group of people, such as team member lists or collections of commenters.
- Provide initials or a placeholder when an image fails or is missing; use AvatarWithIcon when an overlaid icon is required.

## When not to use

- Do not repeat headshots inside cards or tables—prefer Entity rows or other structured layouts instead.
- Do not use Avatar for non-human entities (product logos, system icons)—use Icon or a generic placeholder for those.
- Do not use Avatar as a decorative background element; its semantic meaning is to represent a real person.

## Examples

### Sizes

Showcases numeric sizes such as 24, 32, and 48 px for dense rows, list mentions, and profile headers.

### Fallback states

Demonstrates initials and placeholder fallback schemes when an image is unavailable.

### Stacking and overlap

Shows overlapped arrangement of multiple Avatars with fixed overlap spacing.

## Accessibility

- Set meaningful alt text on image avatars; initials and placeholder avatars can expose the person's name through title.
- Grouped stacks should carry an aria-label describing the total count to avoid redundant individual announcements.
- Initial-only fallback avatars should use high-contrast background colors to ensure text legibility.

## Controlled behavior

Not applicable: Avatar is a passive display component with no interactive state or controlled properties; fallback rendering is handled internally without external state control.

## Responsive behavior

- Avatar size is specified explicitly via props rather than responsive breakpoints, keeping consistent appearance across all viewports.
- When limit is set and members exceed it, AvatarGroup automatically summarizes the remainder in a +N Avatar; without limit, it shows every member.

## Theme behavior

- Avatar borders and loading states follow theme variables and adapt between dark and light modes.
- Initial fallbacks use a fixed neutral surface; GitHub, GitLab, and Bitbucket avatars derive service image URLs from username.

## Live Demo

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=64)![Avatar for severinlandolt](https://github.com/severinlandolt.png?size=64)![Avatar for rauchg](https://github.com/rauchg.png?size=64)

![Avatar for christopherkindl](https://github.com/christopherkindl.png?size=64)![Avatar for rauno](https://github.com/rauno.png?size=64)![Avatar for shuding](https://github.com/shuding.png?size=64)![Avatar for skllcrn](https://github.com/skllcrn.png?size=64)+2

```tsx
import { AvatarGroup } from "@hustradio/unitary-ui";

export function AvatarGroup34CA0E76Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
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

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=64)![Avatar for severinlandolt](https://github.com/severinlandolt.png?size=64)![Avatar for rauchg](https://github.com/rauchg.png?size=64)

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=64)![Avatar for severinlandolt](https://github.com/severinlandolt.png?size=64)![Avatar for rauchg](https://github.com/rauchg.png?size=64)

```tsx
import { AvatarGroup } from "@hustradio/unitary-ui";

export function AvatarStackingOrderD2DD6E34Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AvatarGroup
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={32}
      />
      <AvatarGroup
        reverse
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={32}
      />
    </div>
  );
}
```

## Overlap

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=32)![Avatar for severinlandolt](https://github.com/severinlandolt.png?size=32)![Avatar for rauchg](https://github.com/rauchg.png?size=32)

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=48)![Avatar for severinlandolt](https://github.com/severinlandolt.png?size=48)![Avatar for rauchg](https://github.com/rauchg.png?size=48)

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=64)![Avatar for severinlandolt](https://github.com/severinlandolt.png?size=64)![Avatar for rauchg](https://github.com/rauchg.png?size=64)

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=96)![Avatar for severinlandolt](https://github.com/severinlandolt.png?size=96)![Avatar for rauchg](https://github.com/rauchg.png?size=96)

```tsx
import { AvatarGroup } from "@hustradio/unitary-ui";

export function AvatarOverlap38B163F9Example() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <AvatarGroup
        overlap="auto"
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={16}
      />
      <AvatarGroup
        overlap="auto"
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={24}
      />
      <AvatarGroup
        overlap="auto"
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={32}
      />
      <AvatarGroup
        overlap="auto"
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={48}
      />
    </div>
  );
}
```

## Fixed overlap

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=48)![Avatar for severinlandolt](https://github.com/severinlandolt.png?size=48)![Avatar for rauchg](https://github.com/rauchg.png?size=48)

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=48)![Avatar for severinlandolt](https://github.com/severinlandolt.png?size=48)![Avatar for rauchg](https://github.com/rauchg.png?size=48)

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=48)![Avatar for severinlandolt](https://github.com/severinlandolt.png?size=48)![Avatar for rauchg](https://github.com/rauchg.png?size=48)

```tsx
import { AvatarGroup } from "@hustradio/unitary-ui";

export function AvatarFixedOverlapD4FD80A3Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AvatarGroup
        overlap={10}
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={24}
      />
      <AvatarGroup
        overlap={6}
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={24}
      />
      <AvatarGroup
        overlap={0}
        members={[
          { username: "evilrabbit" },
          { username: "severinlandolt" },
          { username: "rauchg" },
        ]}
        size={24}
      />
    </div>
  );
}
```

## Size

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=48)![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=64)![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=96)

```tsx
import { Avatar } from "@hustradio/unitary-ui";

export function AvatarSize1AF85190Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar size={24} username="evilrabbit" />
      <Avatar size={32} username="evilrabbit" />
      <Avatar size={48} username="evilrabbit" />
    </div>
  );
}
```

## Git

![Avatar for rauchg](https://github.com/rauchg.png?size=64)![Avatar for severinlandolt](https://gitlab.com/severinlandolt.png?size=64)![Avatar for evilrabbit](https://bitbucket.org/evilrabbit/avatar/64)

```tsx
import { GitHubAvatar, GitLabAvatar, BitbucketAvatar } from "@hustradio/unitary-ui";

export function AvatarGitB949C922Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <GitHubAvatar size={32} username="rauchg" />
      <GitLabAvatar size={32} username="severinlandolt" />
      <BitbucketAvatar size={32} username="evilrabbit" />
    </div>
  );
}
```

## With custom icon

```tsx
import { AvatarWithIcon } from "@hustradio/unitary-ui";
import { ArrowDownCircle, CircleCheck, Clock } from "lucide-react";

export function AvatarWithCustomIconECDC07D3Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <AvatarWithIcon
        icon={<ArrowDownCircle className="size-3.5 text-muted-foreground" aria-hidden />}
        size={32}
        iconBackground
      />
      <AvatarWithIcon
        icon={<CircleCheck className="size-3.5 text-muted-foreground" aria-hidden />}
        size={32}
        iconBackground
      />
      <AvatarWithIcon
        icon={<Clock className="size-3.5 text-muted-foreground" aria-hidden />}
        size={32}
        iconBackground
      />
    </div>
  );
}
```

## Letter

SLEKCK

```tsx
import { Avatar } from "@hustradio/unitary-ui";

export function AvatarLetter1BF163F2Example() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar letter="SL" placeholder size={32} />
      <Avatar letter="EK" placeholder size={32} />
      <Avatar letter="CK" placeholder size={32} />
    </div>
  );
}
```

## Placeholder

```tsx
import { Avatar } from "@hustradio/unitary-ui";

export function AvatarPlaceholderF4B24FEDExample() {
  return <Avatar placeholder size={90} />;
}
```

## Curvature

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=160)Default · circle

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=160)

Circular · p = 2

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=160)

Continuous · p = 3

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=160)

Emphasized · p = 5

![Avatar for evilrabbit](https://github.com/evilrabbit.png?size=160)

Superellipse · n = 5

```tsx
import { useId } from "react";
import { Avatar } from "@hustradio/unitary-ui";
import { ContinuousSurface } from "@hustradio/unitary-ui";
import { superellipsePath } from "@hustradio/unitary-ui";

const CURVATURE_VARIANTS = [
  { label: "Circular · p = 2", exponent: 2 },
  { label: "Continuous · p = 3", exponent: 3 },
  { label: "Emphasized · p = 5", exponent: 5 },
];

export function AvatarCurvature8D2F4A71Example() {
  const clipId = `avatar-superellipse-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const squareAvatar = "rounded-none after:rounded-none after:border-transparent";

  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col items-center gap-3">
        <Avatar size={80} username="evilrabbit" />
        <span className="text-label-13 text-muted-foreground">Default · circle</span>
      </div>
      {CURVATURE_VARIANTS.map((variant) => (
        <div key={variant.exponent} className="flex flex-col items-center gap-3">
          <ContinuousSurface
            radius={16}
            exponent={variant.exponent}
            className="size-20 overflow-hidden"
          >
            <Avatar size={80} username="evilrabbit" className={squareAvatar} />
          </ContinuousSurface>
          <span className="text-label-13 text-muted-foreground">{variant.label}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-3">
        <div className="size-20 overflow-hidden" style={{ clipPath: `url(#${clipId})` }}>
          <Avatar size={80} username="evilrabbit" className={squareAvatar} />
        </div>
        <span className="text-label-13 text-muted-foreground">Superellipse · n = 5</span>
        <svg aria-hidden width="0" height="0">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path transform="scale(0.0125)" d={superellipsePath(80, 80, { exponent: 5 })} />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import {
  Avatar,
  AvatarGroup,
  AvatarWithIcon,
  GitHubAvatar,
  GitLabAvatar,
  BitbucketAvatar,
} from "@hustradio/unitary-ui";
```

Also accepts props defined by: `ComponentProps<typeof AvatarPrimitive.Root>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Avatar or AvatarGroup diameter in pixels.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">32</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">src</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Image source.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">alt</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Accessible image description.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">username</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">GitHub username used as an image source.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">letter</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">One or two fallback initials.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">placeholder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows the placeholder shell.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Entity name used for the accessible label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">members</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">AvatarGroupMember[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Required AvatarGroup members.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">limit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Maximum AvatarGroup slots, including the +N summary when needed.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">overlap</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"auto" | number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">AvatarGroup overlap amount.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"auto"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">reverse</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reverses AvatarGroup overlap stacking order.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

- Use Avatar to represent a single user or team. Stacked Avatars represent a group of people.
- Provide initials or a placeholder so the avatar remains identifiable when an image is unavailable; use AvatarWithIcon for an icon avatar.
- Set meaningful alt text on image avatars and title on initials or placeholder avatars so assistive technology can identify the entity.
- Choose a numeric size appropriate to the context, such as 24 px for dense rows, 32 px for lists and mentions, or 48 px for profile headers.
