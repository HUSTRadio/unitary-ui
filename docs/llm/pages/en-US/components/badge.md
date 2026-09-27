# Badge

> Route: `/components/badge`

Small labels for statuses, counts, and metadata.

[Back to Components](#/components)

# Badge

badge

Small labels for statuses, counts, and metadata.

## When to use

- Place short, scannable metadata labels next to the thing they describe: status, plan tier, environment, or role.
- Showcase lifecycle stage labels (Alpha, Beta, Early Access) paired with a Tooltip noting any limitations.
- Map meaning to color: green for healthy, red for error, amber for warning, blue for informational or production.

## When not to use

- Never make a Badge clickable—if the user needs to act on the value, promote it to a Button or link.
- Never nest another Badge or multiple icons inside a Badge—one badge per row only.
- Avoid stuffing sentences inside a Badge (Currently Active); the surrounding row supplies the context.

## Examples

### Variants

Shows gray, blue, purple, amber, red, pink, green, and teal colors with low-contrast forms, plus inverted, trial, turbo, and outline variants.

### Sizes

Shows compact, sm, md, and lg sizes for different layout densities.

### Rounded rectangle & compact

The shape="rounded" (4px radius) + size="compact" (20px tall) + contrast="soft" combination used by dense navigation status markers.

### With icons

Showcases icon-plus-text Badges and the standalone dot variant (Status Dot).

## Accessibility

- Icon-only or ambiguous badges should have a title attribute so screen readers announce the meaning.
- Never rely on color alone; the text has to be readable without it.
- Error-status badges should avoid low-contrast surfaces to ensure visibility.

## Controlled behavior

Not applicable: Badge is a static label with no controlled behavior or interactive state; content renders directly via props.

## Responsive behavior

- Badge uses compact inline typography that maintains consistent visual density on both narrow and wide screens.
- Long text auto-wraps or truncates with ellipsis on narrow viewports, never overflowing its parent container.

## Theme behavior

- Each variant comes with a paired dark/light mode color set managed through theme variables.
- The -subtle suffix tone lowers saturation of any variant on dense surfaces to reduce visual interference.

## Live Demo

GrayGray Subtle

BlueBlue Subtle

PurplePurple Subtle

AmberAmber Subtle

RedRed Subtle

PinkPink Subtle

GreenGreen Subtle

TealTeal Subtle

InvertedTrialTurborepoOutline

```tsx
import { Badge } from "@/components/ui/badge";

export function BadgeVariants63D2643BExample() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="gray">Gray</Badge>
        <Badge variant="gray" contrast="low">
          Gray Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="blue">Blue</Badge>
        <Badge variant="blue" contrast="low">
          Blue Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="purple">Purple</Badge>
        <Badge variant="purple" contrast="low">
          Purple Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="amber">Amber</Badge>
        <Badge variant="amber" contrast="low">
          Amber Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="red">Red</Badge>
        <Badge variant="red" contrast="low">
          Red Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="pink">Pink</Badge>
        <Badge variant="pink" contrast="low">
          Pink Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="green">Green</Badge>
        <Badge variant="green" contrast="low">
          Green Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="teal">Teal</Badge>
        <Badge variant="teal" contrast="low">
          Teal Subtle
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge variant="inverted">Inverted</Badge>
        <Badge variant="trial">Trial</Badge>
        <Badge variant="turbo">Turborepo</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    </div>
  );
}
```

## Sizes

CompactSmallMediumLarge

```tsx
import { Badge } from "@/components/ui/badge";

export function BadgeSizes74A3978DExample() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="compact">Compact</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  );
}
```

## With icons

GrayGrayGrayGrayGrayGray

BlueBlueBlueBlueBlueBlue

GreenGreenGreenGreenGreenGreen

```tsx
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export function BadgeWithIcons1F71F4BCExample() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge icon={<Shield aria-hidden />} size="lg" variant="gray">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="gray">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="gray">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="lg" variant="gray" contrast="low">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="gray" contrast="low">
          Gray
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="gray" contrast="low">
          Gray
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge icon={<Shield aria-hidden />} size="lg" variant="blue">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="blue">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="blue">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="lg" variant="blue" contrast="low">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="blue" contrast="low">
          Blue
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="blue" contrast="low">
          Blue
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge icon={<Shield aria-hidden />} size="lg" variant="green">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="green">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="green">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="lg" variant="green" contrast="low">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="md" variant="green" contrast="low">
          Green
        </Badge>
        <Badge icon={<Shield aria-hidden />} size="sm" variant="green" contrast="low">
          Green
        </Badge>
      </div>
    </div>
  );
}
```

## Pill

LabelLabelLabel

LabelLabelLabel

```tsx
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export function BadgePill9945C78BExample() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="pill" size="sm">
          Label
        </Badge>
        <Badge variant="pill" size="md">
          Label
        </Badge>
        <Badge variant="pill" size="lg">
          Label
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="pill" size="sm" icon={<Shield aria-hidden />}>
          Label
        </Badge>
        <Badge variant="pill" size="md" icon={<Shield aria-hidden />}>
          Label
        </Badge>
        <Badge variant="pill" size="lg" icon={<Shield aria-hidden />}>
          Label
        </Badge>
      </div>
    </div>
  );
}
```

## Compact rounded

UpdatedNewHealthyWarningFailed

Pill compactRounded compactRounded mdWith icon

```tsx
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

/**
 * 圆角矩形 + compact（+ soft 底色）：导航状态标记这类密集场景的标准组合。
 * 与全圆胶囊（默认）对照，几何只有圆角与内边距两处差异。
 */
export function BadgeCompactRounded7C41E2A8Example() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge shape="rounded" size="compact" variant="gray" contrast="soft">
          Updated
        </Badge>
        <Badge shape="rounded" size="compact" variant="blue" contrast="soft">
          New
        </Badge>
        <Badge shape="rounded" size="compact" variant="green" contrast="soft">
          Healthy
        </Badge>
        <Badge shape="rounded" size="compact" variant="amber" contrast="soft">
          Warning
        </Badge>
        <Badge shape="rounded" size="compact" variant="red" contrast="soft">
          Failed
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge shape="pill" size="compact" variant="blue" contrast="soft">
          Pill compact
        </Badge>
        <Badge shape="rounded" size="compact" variant="blue">
          Rounded compact
        </Badge>
        <Badge shape="rounded" variant="blue" contrast="soft">
          Rounded md
        </Badge>
        <Badge
          shape="rounded"
          size="compact"
          variant="blue"
          contrast="soft"
          icon={<Bell aria-hidden />}
        >
          With icon
        </Badge>
      </div>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Badge, badgeVariants } from "@/components/ui/badge";
```

Native props: `HTMLAttributes<HTMLSpanElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">variant</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">BadgeVariant</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visual badge variant.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"gray"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shape</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"pill" | "rounded"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Full pill or rounded rectangle (4px radius).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"pill"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"compact" | "sm" | "md" | "lg"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Badge size.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"md"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">contrast</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"low" | "soft"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Low-contrast text treatment, or a soft tinted fill.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">icon</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional leading icon.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">asChild</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders through the child element.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

- Use Badge for short, scannable metadata that sits next to the thing it describes: status, plan tier, environment, or role. One badge per row; two side by side is a sign the row needs a second column.
- For a colored dot without text, use Status Dot. For clickable filter chips that toggle a query, use the pill variant or a small Button.
- Badges are static labels. Don’t wire onClick onto them; promote to a Button or link if the user can act on the value.
- Keep badge content to text or icon + text. Never stack two icons or a child Badge inside a Badge.
- Pair lifecycle badges (Alpha, Beta, Early Access) with a Tooltip that names the limit, like Alpha: API may change before GA.
- Title Case, one word when possible, two max: Active, Pending, Pro, Enterprise Trial. Match the canonical API or log term: Production not Prod, Deployed not Live, Canceled not Cancelled (single L, matching the canonical API spelling).
- Don’t add a checkmark icon for success states or an X for errors; the variant carries that signal. Map meaning to color: green for healthy, red for error, amber for warning, blue for informational or production, gray for neutral. The -subtle suffix tones any of them down on dense surfaces.
- Skip stuffing sentences inside (Currently Active, You are on Pro); the surrounding row supplies the context.
- Set title for icon-only or ambiguous badges so screen readers announce the meaning. Don’t rely on color alone; the text has to be readable without it.
