# Motion

> Route: `/components/motion`

Uses scoped motion tokens and reduced-motion preferences for React animations.

[Back to Components](#/components)

# Motion

motion

Uses scoped motion tokens and reduced-motion preferences for React animations.

## When to use

- Compose React state animations with library timing and reduced-motion policy.

## When not to use

- Keep simple color feedback in CSS; preserve existing overlay focus and unmount behavior.

## Examples

### State changes

Toggle local content with the state tier and AnimatePresence exit animation.

## Accessibility

- reducedMotion="user" follows system preferences; "always" disables motion. useMotionTransition returns instant transitions for reduced motion, invalid tokens or linear curves.
- Animations do not replace content semantics, keyboard operation or focus management.

## Controlled behavior

- The caller owns application state; useMotionTransition accepts feedback, state, overlay and expansive tiers plus an optional TokenOptions.target. The four defaults are 150 / 250 / 350 / 500ms, all reading --ease-snap.

## Responsive behavior

Not applicable: Breakpoints and layout remain controlled by the content components.

## Theme behavior

- Reads the target element's cascaded tokens and responds to local overrides and theme changes; the server does not read the DOM. --ease-snap defaults to cubic-bezier(0.22, 1, 0.36, 1) and accepts valid scoped nonlinear curves; these are project-selected values, not official Apple parameters or spring settings.

## Live Demo

Content follows the state timing token and your motion preference.

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion, MotionProvider, useMotionTransition } from "@/lib/motion";
import { useI18n } from "@/lib/i18n";

function StatePanel() {
  const [shown, setShown] = useState(true);
  const transition = useMotionTransition("state");
  const zh = useI18n().locale === "zh-CN";
  return (
    <div className="w-full space-y-4" data-motion-demo>
      <Button
        typeName="button"
        type="secondary"
        data-motion-toggle
        onClick={() => setShown(!shown)}
      >
        {zh ? "切换内容" : "Toggle Content"}
      </Button>
      <div className="flex min-h-24 items-center">
        <AnimatePresence initial={false}>
          {shown && (
            <motion.div
              key="content"
              data-motion-content
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={transition}
              className="w-full rounded-lg border border-border bg-background p-4 text-copy-14"
            >
              {zh
                ? "内容遵循状态切换时序 token 和你的动画偏好。"
                : "Content follows the state timing token and your motion preference."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MotionExample() {
  return (
    <MotionProvider>
      <StatePanel />
    </MotionProvider>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import {
  MotionProvider,
  motion,
  AnimatePresence,
  useMotionTransition,
} from "@hustradio/unitary-ui";
```

### Props & callbacks

All APIs in this table are Unitary extensions.

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">MotionProvider.children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Content using the slim motion components or HituPlayer.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">MotionProvider.reducedMotion</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"user" | "always"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Follows the system preference or enforces instant UI transitions and static illustrations.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"user"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">motion</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">typeof import("motion/react-m")</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Slim Motion elements, such as motion.div; use inside MotionProvider to load DOM animation features on demand.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">AnimatePresence</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">typeof import("motion/react").AnimatePresence</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Keeps removed keyed children present while their exit animation finishes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">useMotionTransition(tier, options)</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(tier?: MotionTier, options?: TokenOptions) =&gt; Transition</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Converts the cascaded CSS duration and nonlinear easing to Motion parameters; missing, invalid, linear, zero-duration or reduced timing is instant.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">tier = "state"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">tier</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"feedback" | "state" | "overlay" | "expansive"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Chooses an existing duration tier; all four tiers read --ease-snap for a quick response and soft finish.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"state"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">options.target</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">HTMLElement | SVGElement | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional token scope; omitted reads the document root and null has no target.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

One animation implementation owns each node's transforms. The provider skips JavaScript animations when reduced-motion preferences change; SSR uses instant transitions. Existing overlay and feedback components retain their lifecycle behavior.

## Best Practices

- Wrap animated content in MotionProvider and use useMotionTransition for timing.
- Keep one animation owner per element; preserve existing overlay focus and lifecycle behavior.
