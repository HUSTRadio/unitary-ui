# Hitu + Motion integration guide

[简体中文](./hitu-motion.md)

Motion handles React content entering, exiting and changing state; Hitu handles keyframes inside SVG illustrations. Import every public API from the `@hustradio/unitary-ui` root. Full APIs and live examples are available at `/components/motion` and `/components/hitu-player` in the documentation site; their [bilingual guide source](../site/src/content/component-guides/guides-26-motion.ts) agrees with this guide.

## Installation and setup

```sh
pnpm add @hustradio/unitary-ui
```

The project requires React / ReactDOM 19. The library already pins `motion@14.0.0` as a regular dependency; no separate Motion or upstream Hitu npm installation is needed. Import styles in the browser application entry. Native Node server code imports the package root without importing CSS directly:

```tsx
import "@hustradio/unitary-ui/styles.css";
```

Wrap content using `motion` in `MotionProvider`. It combines `MotionConfig` and `LazyMotion`, loading `domAnimation` on demand; the exported `motion` uses the slim `m` implementation. The default `reducedMotion="user"` follows system preferences; `"always"` enforces static presentation.

## State animations and scoped timing

This example works as a standalone React component. `AnimatePresence` retains the exit-animation lifecycle when content is removed; the application still owns business state, keyboard operation and focus.

```tsx
import { useState, type CSSProperties } from "react";
import {
  AnimatePresence, Button, MotionProvider, motion, useMotionTransition,
} from "@hustradio/unitary-ui";

function StatePanel() {
  const [shown, setShown] = useState(true);
  const [scope, setScope] = useState<HTMLDivElement | null>(null);
  const transition = useMotionTransition("state", { target: scope });

  return (
    <div ref={setScope} style={{ "--uni-motion-state": "180ms" } as CSSProperties}>
      <Button typeName="button" onClick={() => setShown(!shown)}>Toggle</Button>
      <AnimatePresence initial={false}>
        {shown && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={transition}
          >
            Content follows the scoped timing token.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MotionDemo() {
  return <MotionProvider><StatePanel /></MotionProvider>;
}
```

`useMotionTransition(tier, options)` defaults to the `state` tier, and `options` uses the public `TokenOptions`. Omitting `target` reads the document root; `target: null` means the target has not mounted. Apply local overrides to the element passed to the hook. It reads computed CSS values and responds to token API writes, ancestor theme/style attributes and relevant media changes.

| Tier | Duration token | Easing token |
| --- | --- | --- |
| `feedback` | `--uni-motion-feedback` | `--ease-snap` |
| `state` | `--uni-motion-state` | `--ease-snap` |
| `overlay` | `--uni-motion-overlay` | `--ease-pop` |
| `expansive` | `--uni-motion-expansive` | `--ease-snap` |

Durations support `ms` / `s`, converted into Motion's seconds. Easing supports valid `cubic-bezier(...)` values and `linear`, `ease`, `ease-in`, `ease-out`, `ease-in-out`. Missing, invalid or zero durations, and reduced motion, return a zero-duration, zero-delay transition with `skipAnimations: true`; no numeric fallback duration is added.

## Illustrations, playback controls and EmptyState

`HituBox` and `HituFile` use existing theme color tokens and both have intrinsic dimensions of 1024 × 1024. Player `width` / `height` define canvas coordinates; CSS can scale its display proportionally. Keep `shapes` outside the component or preserve its reference with `useMemo`, so ordinary rerenders are not treated as scene changes.

```tsx
import { useRef, useState } from "react";
import {
  Button, EmptyState, HituBox, HituFile, HituPlayer, MotionProvider,
  motion, useMotionTransition, type HituPlayerRef, type HituShape,
} from "@hustradio/unitary-ui";

const shapes: readonly HituShape[] = [
  {
    source: HituFile, x: 160, y: 32,
    scaleX: 0.2, scaleY: 0.2, originX: 0, originY: 0,
    frames: [{ frame: 0, y: 32 }, { frame: 60, y: 96 }, { frame: 119, y: 32 }],
  },
  {
    source: HituBox, x: 96, y: 160,
    scaleX: 0.32, scaleY: 0.32, originX: 0, originY: 0,
  },
];

function Illustration() {
  const player = useRef<HituPlayerRef>(null);
  const [playing, setPlaying] = useState(false);
  const transition = useMotionTransition("feedback");

  return (
    <EmptyState
      title="No files yet"
      description="Add a file to start organizing your workspace."
      icon={
        <motion.div animate={{ y: playing ? -4 : 0 }} transition={transition}>
          <HituPlayer
            ref={player} width={512} height={512} frames={120} shapes={shapes}
            onPlay={setPlaying} style={{ width: 240, maxWidth: "100%", height: "auto" }}
          />
        </motion.div>
      }
    >
      <Button typeName="button" onClick={() => player.current?.triggerMotion(true)}>Play</Button>
      <Button typeName="button" onClick={() => player.current?.triggerMotion(false)}>Pause</Button>
      <Button typeName="button" onClick={() => {
        player.current?.setFrame(0);
        player.current?.triggerMotion(true);
      }}>Replay</Button>
      <p role="status">{playing ? "Playing" : "Paused"}</p>
    </EmptyState>
  );
}

export function IllustrationDemo() {
  return <MotionProvider><Illustration /></MotionProvider>;
}
```

This composition uses the existing `EmptyState.icon` slot. Motion writes transforms on the outer `div`, and Hitu writes transforms on internal SVG layers. Keep each engine's transform ownership on separate nodes.

| Configuration or method | Behavior |
| --- | --- |
| `width`, `height`, `shapes` | Required canvas dimensions and React SVG layers |
| `frames` | Total frame count, default `0`; `120` means indices `0`–`119`, advancing on a 60 fps timeline |
| `defaultFrame`, `defaultPlay`, `loop` | Initially `0`, `false`, `false`; `loop` can update dynamically |
| `ref.triggerMotion(true / false)` | Requests play or pause; omitting the argument toggles playback intent; requesting play at the final frame replays |
| `ref.setFrame(frame)` | Seeks within valid indices; does not seek under reduced motion |
| `ref.getFramerInfo()` | Returns `{ play, frame }`, where `play` is effective playback state |
| `onPlay(play)` | Reports effective playback changes, including pauses caused by visibility or reduced motion |
| `onFrame(frame)` | Reports initial/seek frames and every crossed timeline frame, including loop wrapping |

`defaultFrame` and `defaultPlay` are initial values, not controlled props; use the ref for subsequent control. Zero-frame scenes remain static. Replacing the `shapes` reference restores the initial frame; changing the frame count clamps the current frame and resets the playback clock.

## Custom React SVG shapes

`source` must be a React SVG component matching `HituShapeSource`, with static numeric `width` / `height`. A `viewBox` alone does not provide the layer engine's origin dimensions.

```tsx
import type { SVGProps } from "react";
import type { HituShape, HituShapeSource } from "@hustradio/unitary-ui";

const Dot: HituShapeSource = Object.assign(
  (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" width={48} height={48} {...props}>
      <circle cx={24} cy={24} r={20} fill="var(--gray-700)" />
    </svg>
  ),
  { width: 48, height: 48 },
);

export const dotShapes: readonly HituShape[] = [{
  source: Dot, x: 64, y: 64, originX: 0.5, originY: 0.5,
  frames: [
    { frame: 0, rotate: 0, opacity: 1, cubic: [0.2, 0, 0.2, 1] },
    { frame: 119, rotate: 180, scaleX: 1.2, scaleY: 1.2, opacity: 0.5 },
  ],
}];
```

Supported transforms are `x` / `y`, `rotate`, `scaleX` / `scaleY`, `originX` / `originY` and `opacity`. Origins are fractions of the asset dimensions; rotation is in degrees. List keyframes in increasing index order. Omitted transforms inherit the shape and preceding keyframes; `cubic` belongs to the segment starting at that keyframe. Translation and rotation default to `0`, scale and opacity to `1`, and origins to `0.5`. Custom assets using gradients, masks or clipPath must isolate reference IDs per instance, for example with React `useId`.

## Reduced motion, visibility and server rendering

- When the system preference dynamically enables reduced motion, active Motion animations complete and Hitu stops JS playback at its initial frame. `MotionProvider reducedMotion="always"` enforces this for both engines within it; nested providers cannot cancel the outer static policy.
- Hitu pauses offscreen or while the page is hidden. Visibility restoration resumes only instances that still request playback; manual pause prevents automatic resumption. Pause, scene changes and unmounting clean up RAF.
- Package-root imports and SSR do not access browser globals. Hitu renders a deterministic static initial frame on the server, then reads preferences and visibility on the client. Do not make first-screen content depend on animation.
- Hitu is decorative by default with `aria-hidden` set to `true`. Give meaningful illustrations an `aria-label` or `aria-labelledby`; they receive `role="img"` by default. Keep explanatory text, playback buttons and status outside the SVG. Animations do not replace keyboard operation, focus or content semantics.

## Provenance, scope and validation

The embedded runtime adapts [ant-design/HiTu at the pinned commit](https://github.com/ant-design/HiTu/tree/92119663fb5e551ccab5d0b46532c0a3317e0cc8) `92119663fb5e551ccab5d0b46532c0a3317e0cc8`. The upstream prototype explicitly warns against direct production use; this project maintains its local React 19, lifecycle, SSR and preference adaptation. See [SOURCE.md](../../src/vendor/hitu/SOURCE.md), [LICENSE](../../src/vendor/hitu/LICENSE) and the [third-party notices](../../THIRD_PARTY_NOTICES.en.md).

This release supports complete React SVG layers and the Box/File assets. It does not support `svgText`, chip subpath animation, an illustration editor or the complete asset library. Existing Modal, Drawer, Toast, Collapse and Tabs animations retain their implementations. The [integration verification report](../audits/hitu-motion-2026-10-08.md) records production compatibility, measured consumer-build increments and validation commands. Unified root exports add a regular dependency and do not imply zero cost for every consumer.

[Live Motion example source](../site/src/examples/motion/default.example.tsx) · [Live Hitu example source](../site/src/examples/hitu-player/default.example.tsx)
