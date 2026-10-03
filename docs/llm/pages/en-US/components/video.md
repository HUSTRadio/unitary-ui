# Video

> Route: `/components/video`

Embed video with playback controls and lazy loading.

[Back to Components](#/components)

# Video

video

Embed video with playback controls and lazy loading.

## When to use

- When embedding video clips on pages with out-of-the-box playback controls and lazy-loading performance optimization.
- When displaying video content on marketing pages, documentation covers, or product demos while keeping visual consistency.

## When not to use

- When you need full customization of video playback logic; consider dedicated third-party player libraries like Video.js or Plyr instead.
- For static image scenarios; use Image instead of Video to avoid unnecessary network requests and resource consumption.

## Examples

### No loop

Demonstrates controlling the video loop attribute; the video stops when playback ends.

### No controls

Hides built-in playback controls for an immersive viewing experience, suitable for background videos.

## Accessibility

- Video locks the inner aspect ratio so the container doesn't reflow while media loads; this matters equally for screen reader users and keyboard navigation.
- For autoplay, respect prefers-reduced-motion and provide a paused poster fallback.

## Controlled behavior

- Video has no declarative playing or currentTime props; its custom controls synchronize playback state internally.
- Use the HTMLVideoElement ref to call play(), pause(), or set currentTime.

## Responsive behavior

- Video maintains a fixed aspect ratio on the inner media; the container adapts to parent width, preventing layout shift across viewports.

## Theme behavior

- With controls={true}, Video renders custom play, time, and progress controls whose background, text, and shadow use theme styles.

## Live Demo

```tsx
import { Video } from "@/components/ui/video";

export function VideoDefault37A8EEC1Example() {
  return (
    <div className="w-full min-w-0 max-w-[600px]">
      <Video height={582} lazy={false} poster="/demo-poster.png" src="/demo.mp4" width={600} />
    </div>
  );
}
```

## No Loop

```tsx
import { Video } from "@/components/ui/video";

export function VideoNoLoopAE976739Example() {
  return (
    <div className="w-full min-w-0 max-w-[600px]">
      <Video height={582} lazy={false} loop={false} src="/demo.mp4" width={600} />
    </div>
  );
}
```

## No Controls

```tsx
import { Video } from "@/components/ui/video";

export function VideoNoControlsA3B62E68Example() {
  return (
    <div className="w-full min-w-0 max-w-[600px]">
      <Video controls={false} height={582} lazy={false} src="/demo.mp4" width={600} />
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Video } from "@/components/ui/video";
```

Also accepts props defined by: `VideoHTMLAttributes<HTMLVideoElement>`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">src</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Media source.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onEnded</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactEventHandler&lt;HTMLVideoElement&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Native media lifecycle callback.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Video to embed clips with built-in playback controls and lazy loading support.
- Lock the inner video aspect ratio so the container doesn't reflow while media loads.
- For autoplay, respect prefers-reduced-motion and provide a paused poster fallback.
