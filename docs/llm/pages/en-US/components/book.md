# Book

> Route: `/components/book`

A responsive book component.

[Back to Components](#/components)

# Book

book

A responsive book component.

## When to use

- Use Book for marketing pages, docs landing covers, and changelog hero shots where content needs the metaphor of a labeled volume.
- Use simple when the title carries the design; use stripe when an icon or color stripe adds category hierarchy.
- Reserve the textured treatment for isolated hero shots used for single articles or chapter presentations.

## When not to use

- Do not use Book inside product info cards or dashboard tiles—it is too decorative for repeated UI rows.
- Do not treat Book as an interactive content editor—it is a purely presentational frame with no editing capabilities.
- In accessibility-first scenarios, do not use the cover as the primary content source—the cover should be treated as decorative chrome with the title surfaced via an underlying heading element.

## Examples

### Default book

Displays basic Book usage with cover, spine, and thickness effects.

### Variants

Showcases the simple and stripe style variants.

### Custom illustration

Demonstrates replacing the built-in illustration and customizing colors for a personalized book cover effect.

## Accessibility

- Book's cover should be marked as decorative chrome with the title surfaced through an underlying heading element so screen readers do not double-announce.
- Cover illustrations should have empty alt text (decorative=true) since meaning is already conveyed in the title.
- Page thickness effects should not impact core content legibility and focus capability.

## Controlled behavior

Not applicable: Book is a passive display component with no state transitions or controlled properties; cover styling is configured entirely through props.

## Responsive behavior

- Book uses responsive widths to preserve the cover proportion, scaling automatically without distortion across viewports.
- On narrow screens, book title may shrink font size or enable multi-line wrapping while preserving the cover ratio integrity.

## Theme behavior

- Book's shadows, borders, and gradient effects follow theme variables, adapting automatically between dark and light modes.
- Custom colors can override the default theme color via props to achieve brand consistency.

## Live Demo

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookDefault21B111CBExample() {
  return <Book title="The user experience of the Frontend Cloud" />;
}
```

## Variants

The user experience of the Frontend Cloud

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookVariants63D2643BExample() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book title="The user experience of the Frontend Cloud" variant="simple" width={196} />
      <Book title="The user experience of the Frontend Cloud" variant="stripe" width={196} />
    </div>
  );
}
```

## Custom color

How Unitary improves your website's search engine ranking

Design Engineering at Unitary

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookCustomColorA5F69A18Example() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book color="#9D2127" title="How Unitary improves your website's search engine ranking" />
      <Book
        color="#7DC1C1"
        textColor="white"
        title="Design Engineering at Unitary"
        variant="simple"
      />
      <Book color="#FED954" title="The user experience of the Frontend Cloud" />
    </div>
  );
}
```

## Custom icon

Unitary Platform Guide

Next.js Documentation

React Essentials

```tsx
import { Book } from "@/components/ui/book";
import { ArrowRight, Atom, Triangle } from "lucide-react";

export function BookCustomIconEE5755A2Example() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book icon={<Triangle className="size-4" aria-hidden />} title="Unitary Platform Guide" />
      <Book icon={<ArrowRight className="size-4" aria-hidden />} title="Next.js Documentation" />
      <Book icon={<Atom className="size-4" aria-hidden />} title="React Essentials" />
    </div>
  );
}
```

## Custom illustration

The user experience of the Frontend Cloud

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";
import { ChartColumn, Waves } from "lucide-react";

export function BookCustomIllustration79A95CD3Example() {
  return (
    <div className="flex flex-row items-stretch justify-start gap-8 flex-initial">
      <Book
        illustration={<Waves className="size-8" aria-hidden />}
        title="The user experience of the Frontend Cloud"
      />
      <Book
        illustration={<ChartColumn className="size-8" aria-hidden />}
        title="The user experience of the Frontend Cloud"
        variant="simple"
      />
    </div>
  );
}
```

## Responsive

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookResponsiveDE779794Example() {
  return <Book title="The user experience of the Frontend Cloud" width={{ sm: 150, md: 196 }} />;
}
```

## Width

The user experience of the Frontend Cloud

The user experience of the Frontend Cloud

The user experience of the Frontend Cloud

```tsx
import { Book } from "@/components/ui/book";

export function BookWidth3019947BExample() {
  return (
    <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
      <Book title="The user experience of the Frontend Cloud" width={300} />
      <Book title="The user experience of the Frontend Cloud" width={200} />
      <Book title="The user experience of the Frontend Cloud" width={150} />
    </div>
  );
}
```

## Textured

Design Engineering at Unitary

Design Engineering at Unitary

Design Engineering at Unitary

Design Engineering at Unitary

Design Engineering at Unitary

Design Engineering at Unitary

```tsx
import { Book } from "@/components/ui/book";

export function BookTexturedB29877FBExample() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-12 flex-initial">
      <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
        <Book color="#7DC1C1" textured title="Design Engineering at Unitary" />
        <Book color="#9D2127" textured title="Design Engineering at Unitary" />
        <Book color="#FED954" textured title="Design Engineering at Unitary" />
      </div>
      <div className="flex flex-row items-baseline justify-start gap-8 flex-initial">
        <Book
          color="#7DC1C1"
          textColor="white"
          textured
          title="Design Engineering at Unitary"
          variant="simple"
        />
        <Book
          color="#9D2127"
          textColor="#ece4db"
          textured
          title="Design Engineering at Unitary"
          variant="simple"
        />
        <Book
          color="#FED954"
          textColor="#9d3b05"
          textured
          title="Design Engineering at Unitary"
          variant="simple"
        />
      </div>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Book } from "@/components/ui/book";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Book cover title.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Book for marketing pages, docs landing covers, and changelog hero shots where content needs the metaphor of a labeled volume.
- For in-product cards and dashboard tiles, use Card; Book is too decorative for repeated UI rows.
- Use simple when the title carries the design; use stripe when an icon or color stripe adds category hierarchy.
- Use responsive widths to preserve the cover proportion, and reserve the textured treatment for isolated hero shots.
- Treat the cover as decorative chrome and surface the title via the underlying heading element so screen readers don't double-announce.
