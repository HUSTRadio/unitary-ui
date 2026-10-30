# Task

> Route: `/components/task`

Show long-running work with explicit status, progress, stage and cancel or retry actions.

[Back to Components](#/components)

# Task

task

Show long-running work with explicit status, progress, stage and cancel or retry actions.

## When to use

- Imports, syncs or builds that take more than a moment and need visible progress and stage.
- A failed or partially completed run should offer one clear retry entry point.
- The status comes from the caller or taskReducer and the UI only presents it.

## When not to use

- A one-shot request is covered by a button's loading state; it does not need a full task block.
- A single 0–100 reading with no stage or actions belongs to Progress Circle.
- Build and deploy semantics (QUEUED / BUILDING / READY) belong to StatusDot, not Task.

## Examples

### Progress, stage and actions

taskReducer advances the progress; cancel appears only while running and retry only after failed or partial.

## Accessibility

Not applicable: Accessibility work is out of scope this round: Task expresses state through visible copy and data-status, and the progress bar declares no ARIA role. Announcement strategy stays with the caller.

## Controlled behavior

- Fully controlled: status, progress and stage come from the caller; the component holds no state, timers or requests.
- Cancel and retry only call onCancel and onRetry; aborting or requeueing stays with the caller.
- Cancel renders only while running and retry only for failed or partial, so the offered action always matches the state.

## Responsive behavior

- The root uses w-full min-w-0, so width follows the surrounding layout instead of overflowing grids.
- Actions wrap through flex-wrap on narrow widths without squeezing the progress bar.
- The bar stretches with its container; the percentage only changes the fill width, never the track height.

## Theme behavior

- The track uses gray-alpha-300, the fill uses primary, and title and description use gray-1000 and gray-700, so both themes follow automatically.
- The width transition uses --uni-motion-state with ease-snap and is disabled under motion-reduce.

## Live Demo

Import contacts

Reads a CSV from your device and uploads it in batches.

Uploading 4 of 12

```tsx
import { useState } from "react";
import { Button, Task, createTaskState, taskReducer } from "@hustradio/unitary-ui";

export function TaskProgress5C1D9A42Example() {
  const [state, setState] = useState(
    createTaskState({ status: "running", progress: 0.35, attempts: 1 }),
  );

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Task
        status={state.status}
        progress={state.progress}
        title="Import contacts"
        description={
          state.status === "failed"
            ? (state.error ?? "Upload failed.")
            : state.status === "succeeded"
              ? "12 contacts imported."
              : "Reads a CSV from your device and uploads it in batches."
        }
        stage={
          state.status === "running"
            ? `Uploading ${Math.round(state.progress * 12)} of 12`
            : undefined
        }
        onCancel={
          state.status === "running"
            ? () =>
                setState((current) => taskReducer(current, { type: "fail", error: "Canceled." }))
            : undefined
        }
        onRetry={
          state.status === "failed" || state.status === "partial"
            ? () => setState((current) => taskReducer(current, { type: "start" }))
            : undefined
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="secondary"
          size="small"
          disabled={state.status !== "running"}
          onClick={() =>
            setState((current) =>
              taskReducer(current, { type: "progress", value: current.progress + 0.2 }),
            )
          }
        >
          Advance
        </Button>
        <Button
          type="tertiary"
          size="small"
          disabled={state.status !== "running"}
          onClick={() => setState((current) => taskReducer(current, { type: "succeed" }))}
        >
          Finish
        </Button>
        <Button
          type="tertiary"
          size="small"
          onClick={() => setState(createTaskState({ status: "running", progress: 0, attempts: 1 }))}
        >
          Restart
        </Button>
      </div>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { Task } from "@hustradio/unitary-ui";
```

Also accepts props defined by: `ComponentProps<"div">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">status</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"idle" | "running" | "partial" | "failed" | "succeeded"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Current state, usually derived by taskReducer.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">progress</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">0–1; renders a bar for running and partial.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">stage</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Current stage copy, for example Uploading 3 of 12.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Task name.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">description</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Supporting copy or the failure reason.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCancel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders a cancel action only while running.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onRetry</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders a retry action only for failed and partial.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">cancelLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Overrides the framework cancel label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">retryLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Overrides the framework retry label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Extra content rendered above the actions.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Render the status the reducer produced; Task never starts, polls or cancels on its own.
- Cancel only while running and retry only after failed or partial, so the offered action matches the state.
- Describe the current stage in the user's language (Uploading 3 of 12) instead of exposing internal ids.
- Keep the failure reason in description; Task renders what it is given and never rewrites error copy.
- Do not reuse StatusDot states here: build and deploy semantics stay on StatusDot.
