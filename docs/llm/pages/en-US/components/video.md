# Video

> Route: `/components/video`

Embeds a video with built-in playback controls.

[Back to Components](#/components)

# Video

Video

Embeds a video with built-in playback controls.

## When to use

-   When embedding video clips on pages with out-of-the-box playback controls and lazy-loading performance optimization.
-   When displaying video content on marketing pages, documentation covers, or product demos while keeping visual consistency.

## When not to use

-   When you need full customization of video playback logic; consider dedicated third-party player libraries like Video.js or Plyr instead.
-   For static image scenarios; use Image instead of Video to avoid unnecessary network requests and resource consumption.

## Examples

### No loop

Demonstrates controlling the video loop attribute; the video stops when playback ends.

### No controls

Hides built-in playback controls for an immersive viewing experience, suitable for background videos.

## Accessibility

-   Video locks the inner aspect ratio so the container doesn't reflow while media loads; this matters equally for screen reader users and keyboard navigation.
-   For autoplay, respect prefers-reduced-motion and provide a paused poster fallback.

## Controlled behavior

Not applicable: Video is a presentational component focused on embedding and rendering video content; it does not expose play/pause/seek controlled APIs. Full media control should be implemented by a dedicated player library.

## Responsive behavior

-   Video maintains a fixed aspect ratio on the inner media; the container adapts to parent width, preventing layout shift across viewports.

## Theme behavior

Not applicable: Video renders the native HTML video element with OS/browser default controls; it does not directly participate in the application's theme color system.

## Live Demo

00:00

00:10

## No Loop

00:00

00:10

```tsx
import { Video } from "@/components/ui/video";

<div className="w-full min-w-0 max-w-[600px]">
  <Video height={582} lazy={false} loop={false} src="/demo.mp4" width={600} />
</div>
```

## No Controls

```tsx
import { Video } from "@/components/ui/video";

<div className="w-full min-w-0 max-w-[600px]">
  <Video controls={false} height={582} lazy={false} src="/demo.mp4" width={600} />
</div>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Video } from "@/components/ui/video"
```

Native props: `VideoHTMLAttributes<HTMLVideoElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">src</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Media source.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onEnded</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactEventHandler&lt;HTMLVideoElement&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Native media lifecycle callback.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

-   Use Video to embed clips with built-in playback controls and lazy loading support.
-   Lock the inner video aspect ratio so the container doesn't reflow while media loads.
-   For autoplay, respect prefers-reduced-motion and provide a paused poster fallback.
