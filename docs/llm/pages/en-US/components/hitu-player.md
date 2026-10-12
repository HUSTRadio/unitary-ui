# Hitu Player

> Route: `/components/hitu-player`

Plays frame-based SVG illustrations with explicit playback controls.

[Back to Components](#/components)

# Hitu Player

hitu-player

Plays frame-based SVG illustrations with explicit playback controls.

## When to use

- Use illustrations with explicit dimensions and playback controls in empty states, onboarding or introduction pages.

## When not to use

- Use existing components for ordinary icons and form feedback; the player does not provide an editor, text or chip layers.

## Examples

### Illustration and playback controls

HituBox and HituFile share a frame timeline with play, pause, replay and loop controls.

## Accessibility

- The SVG is decorative by default; name meaningful illustrations with aria-label and keep explanations and buttons outside the SVG.
- Reduced-motion preferences prevent playback and restore the initial frame; playback pauses offscreen and while the page is hidden.

## Controlled behavior

- defaultPlay and defaultFrame set initial state; ref.triggerMotion, setFrame and getFramerInfo control and inspect actual state, with onPlay / onFrame reporting changes.
- HituFrame.cubic applies to the segment starting at that frame; missing, invalid or identity-linear tuples use \[0.42, 0, 0.58, 1\] for a smooth start and finish. Valid explicit nonlinear curves remain supported, sparse transforms inherit prior values, and endpoints reach their targets exactly.
- In the example, Motion animates the outer container and Hitu animates the internal SVG layers, with each engine owning its own nodes.

## Responsive behavior

- width / height define SVG coordinates; scale proportionally with CSS inside the container without changing layer coordinates.

## Theme behavior

- Built-in HituBox / HituFile use library color tokens; the caller defines colors for custom shapes.

## Live Demo

No Files Yet

Add a file to start organizing your workspace.

Loop

Paused

```tsx
import { useRef, useState } from "react";
import { Button } from "@hustradio/unitary-ui";
import { Checkbox } from "@hustradio/unitary-ui";
import { EmptyState } from "@hustradio/unitary-ui";
import { HituPlayer, type HituPlayerRef } from "@hustradio/unitary-ui";
import { HituBox, HituFile } from "@hustradio/unitary-ui";
import { MotionProvider, motion, useMotionTransition } from "@hustradio/unitary-ui";
import { useI18n } from "@hustradio/unitary-ui";

const shapes = [
  {
    source: HituFile,
    x: 160,
    y: 32,
    scaleX: 0.2,
    scaleY: 0.2,
    originX: 0,
    originY: 0,
    frames: [
      { frame: 0, y: 32 },
      { frame: 60, y: 96 },
      { frame: 119, y: 32 },
    ],
  },
  { source: HituBox, x: 96, y: 160, scaleX: 0.32, scaleY: 0.32, originX: 0, originY: 0 },
];

function Illustration({ autoPlay }: { autoPlay: boolean }) {
  const player = useRef<HituPlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const transition = useMotionTransition("feedback");
  const zh = useI18n().locale === "zh-CN";
  return (
    <div data-motion-hitu-demo className="w-full">
      <EmptyState
        className="px-4 py-6"
        title={zh ? "暂无文件" : "No Files Yet"}
        description={
          zh ? "添加文件，开始整理你的工作区。" : "Add a file to start organizing your workspace."
        }
        icon={
          <motion.div
            initial={transition.skipAnimations ? false : { opacity: 0 }}
            animate={{ opacity: 1, y: playing ? -4 : 0 }}
            transition={transition}
            className="w-60 max-w-full"
          >
            <HituPlayer
              ref={player}
              width={512}
              height={512}
              frames={120}
              shapes={shapes}
              defaultPlay={autoPlay}
              loop={loop}
              onPlay={setPlaying}
              className="block h-auto w-full"
            />
          </motion.div>
        }
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            typeName="button"
            size="small"
            data-motion-play
            onClick={() => player.current?.triggerMotion(true)}
          >
            {zh ? "播放" : "Play"}
          </Button>
          <Button
            typeName="button"
            type="secondary"
            size="small"
            data-motion-pause
            onClick={() => player.current?.triggerMotion(false)}
          >
            {zh ? "暂停" : "Pause"}
          </Button>
          <Button
            typeName="button"
            type="secondary"
            size="small"
            data-motion-replay
            onClick={() => {
              player.current?.setFrame(0);
              player.current?.triggerMotion(true);
            }}
          >
            {zh ? "重播" : "Replay"}
          </Button>
          <Checkbox checked={loop} data-motion-loop onChange={() => setLoop(!loop)}>
            {zh ? "循环" : "Loop"}
          </Checkbox>
        </div>
        <p role="status" className="text-label-12 text-muted-foreground">
          {playing ? (zh ? "正在播放" : "Playing") : zh ? "已暂停" : "Paused"}
        </p>
      </EmptyState>
    </div>
  );
}

export default function HituPlayerExample({ autoPlay = false }: { autoPlay?: boolean }) {
  return (
    <MotionProvider>
      <Illustration autoPlay={autoPlay} />
    </MotionProvider>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { HituPlayer, HituBox, HituFile } from "@hustradio/unitary-ui";
```

Also accepts props defined by: `Omit<SVGProps<SVGSVGElement>, "ref" | "width" | "height" | "onPlay">`

### Props & callbacks

All APIs in this table are Unitary extensions.

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">width / height</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">SVG canvas dimensions and viewBox coordinates.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shapes</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly HituShape[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">React SVG sources with intrinsic width/height, base transforms and optional ordered keyframes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">frames</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Total frame count, advancing at 60 frames per second; indices run from zero to frames - 1. Zero leaves a static frame; negative or nonfinite values become zero.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultFrame</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial frame, clamped to the current range; reduced motion restores this frame.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">0</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultPlay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial playback request; actual playback also requires visibility and allowed motion.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loop</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Repeats the timeline while playback is requested and permitted.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onPlay</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(playing: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports actual playback changes, including visibility or preference pauses.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onFrame</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(frame: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports frame changes from playback or seeking.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">ref.triggerMotion</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(playing?: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Requests play/pause; omitted toggles the request. Manual pause prevents automatic resumption.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">ref.setFrame</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(frame: number) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Seeks within the current frame range.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">ref.getFramerInfo</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; { play: boolean; frame: number }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reads the current frame and effective playback state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shape.source</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HituShapeSource</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">React SVG component carrying numeric width and height; HituBox and HituFile are included sources.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shape transforms</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">x, y, rotate, scaleX, scaleY, originX, originY, opacity</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Transforms the complete layer; origins are fractions of the source dimensions.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">shape.frames</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly HituFrame[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Keyframes carry a frame number and sparse transforms; optional nonlinear cubic easing applies to the outgoing segment. Missing, invalid or identity-linear tuples use [0.42, 0, 0.58, 1].</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-label / aria-labelledby</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Names a meaningful illustration; unnamed players are decorative and hidden from assistive technology.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

React shapes are the only v1 layer source; svgText parsing and chip subpath animation are unavailable. Playback pauses offscreen or while the page is hidden, and resumes only while still requested; unmounting and scene changes clean up RAF.

## Best Practices

- Keep decorative illustrations hidden from assistive technology; use aria-label for meaningful content.
- Provide playback controls and reserve the illustration dimensions before mounting.
