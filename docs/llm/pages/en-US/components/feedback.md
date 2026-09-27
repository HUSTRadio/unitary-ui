# Feedback

> Route: `/components/feedback`

Gathers an emoji rating and open text feedback.

[Back to Components](#/components)

# Feedback

feedback

Gathers an emoji rating and open text feedback.

## When to use

- At the end of a page, documentation article, or completed workflow — collect feedback after the user has had time to form an opinion.
- When lightweight emotional feedback (emoji rating) combined with optional detailed text comments is sufficient, without needing a full-form experience.
- For targeted feedback collection on specific flows (e.g., Feedback on Imports, Report a Bug) to gather actionable improvement insights.

## When not to use

- Don't front-load the feedback panel on a surface the user just opened — it derails the work that brought them there.
- Don't use Feedback as a substitute for a support form, bug report intake, or NPS sampling — those have dedicated surfaces and tools.
- Don't auto-open the form — keep the default as a button and Inline as a rating capsule until the user acts.

## Examples

### Default feedback panel

Shows the default 32px secondary trigger opening a 340px anchored Popover.

### Inline feedback

Shows the inline rating capsule expanding upward into the feedback form after a rating is chosen; the collapsed width is content-sized and the expanded card is 336px.

### Feedback with topics

A real, non-dryRun submit: pick a topic and press Send; the receipt below shows the rating, topic, metadata, and text that onSubmit actually received.

### Feedback with metadata

Shows attaching contextual metadata alongside the feedback panel, helping the team understand the source and context of collected responses.

### Local RatingPill extension

The locally extended four-tone rating capsule; it is not an official Feedback variant and does not change Feedback's blue selected state.

## Accessibility

- Each emoji rating button should have an explicit aria-label so screen readers identify distinct emotional options.
- After default submission, the Popover closes and focus returns to its trigger; Inline does not introduce a fake modal focus trap.
- The optional text input should have a proper label association and aria-describedby for helper text.

## Controlled behavior

- Dismissing the default Popover with Escape or an outside press preserves the current draft for reopening.
- Inline collapses and clears its rating on Escape, outside press, or focus departure while preserving the text draft; a null relatedTarget (window blur) re-checks the real focus target first instead of clearing the rating by mistake.
- The Inline form region expands upward as a floating layer (absolutely positioned), so it never participates in the parent height calculation: neither expanding nor collapsing changes the vertical metrics of the capsule's container. Expansion is horizontally centered on the collapsed capsule's geometric center — both edges move outward symmetrically — and collapsing restores width and height together along the same ease-out curve.
- In dryRun mode Send neither invokes onSubmit nor closes; a real submit resets rating, text, and topic.
- topic only comes from the default Popover's selector and is passed as the fourth onSubmit argument; it is not written into metadata unless includeTopicInMetadata is enabled.

## Responsive behavior

- The default stays anchored to its trigger and Inline expands in place; neither switches to a Modal or Drawer.
- The four emoji buttons retain 32px circular targets with a 1px gap across desktop and narrow viewports.
- Default uses 340px and expanded Inline 336px, both capped to viewport width minus 32px to avoid horizontal overflow.
- Collapsed Inline is content-sized so its label is never truncated, so it varies slightly by locale instead of being pinned to the official 274px; the expanded state stays at 336px.

## Theme behavior

- Every rating uses the same blue-300 background and blue-900 glyph emphasis; no non-official four-color emotion mapping is added.
- The separately labeled Local RatingPill extension retains semantic four-tone capsules; it is not an official Feedback variant.
- Panel shadow, background, and border colors follow the Unitary theme system, supporting global theme variable overrides.
- Collapsed Inline uses the interpolatable --radius-capsule-interpolable rather than an effectively-infinite pill radius; the latter gets clamped to half the shortest edge, which makes the radius snap mid-expansion.

## Live Demo

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackDefault21B111CBExample() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback label="unitary" dryRun />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}
```

## Inline

Was this helpful?

```tsx
import { Feedback } from "@/components/ui/feedback";

export function FeedbackInline99ED40ACExample() {
  // 官方 demo 将胶囊在演示区水平居中（flex justify-center），保持一致。
  return (
    <div className="flex justify-center">
      <Feedback dryRun type="inline" />
    </div>
  );
}
```

## Feedback with Select

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackFeedbackWithSelectBF2A8F56Example() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback label="unitary" showTopics dryRun />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}
```

## Feedback with topics

Submit the panel to see what onSubmit receives.

```tsx
import { useState } from "react";

import { Feedback } from "@/components/ui/feedback";

/**
 * 非 dryRun 的主题演示：真实提交后才渲染收据，证明 topic 确实经 onSubmit 的第 4 个
 * 参数交付（而不是被悄悄合并进 metadata）。
 */
export function FeedbackFeedbackWithTopics7C41E2ABExample() {
  const [receipt, setReceipt] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <Feedback
        label="unitary"
        showTopics
        onSubmit={(rating, text, metadata, topic) => {
          setReceipt(
            `rating=${rating ?? "none"} · topic=${topic ?? "none"} · metadata=${JSON.stringify(metadata ?? {})} · text=${text || "empty"}`,
          );
        }}
      />
      <output data-slot="feedback-topics-receipt" className="text-copy-13 text-muted-foreground">
        {receipt ?? "Submit the panel to see what onSubmit receives."}
      </output>
    </div>
  );
}
```

## Feedback with metadata

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackFeedbackWithMetadata6449A9ACExample() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback
          label="unitary"
          dryRun
          metadata={{
            userId: "user_12345",
            location: "post-checkout",
            orderId: "order_123456",
          }}
        />
      </div>
      <div className="flex justify-center xl:hidden">
        <Note>
          <NoteContent>This example is hidden because it is intended for only desktop.</NoteContent>
        </Note>
      </div>
    </>
  );
}
```

## Local RatingPill extension

Was this helpful?

Was this helpful?

Was this helpful?

```tsx
import { RatingPill } from "@/components/ui/rating-pill";

/** Local Unitary extension; not one of the six official Geist Feedback demos. */
export function FeedbackRatingBar253F979EExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <RatingPill label="Was this helpful?" defaultValue="love" />
      <RatingPill label="Was this helpful?" defaultValue="not-great" />
      <RatingPill label="Was this helpful?" defaultValue="hate" />
    </div>
  );
}
```

## Feedback with prefix

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Flag } from "lucide-react";

export function FeedbackFeedbackWithPrefixEBD13739Example() {
  return <Feedback dryRun label="unitary" prefix={<Flag className="size-4" />} />;
}
```

## Feedback with suffix

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Flag } from "lucide-react";

export function FeedbackFeedbackWithSuffixE429255FExample() {
  return <Feedback dryRun label="unitary" suffix={<Flag className="size-4" />} />;
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Feedback, RatingPill } from "@/components/ui/feedback";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">RatingValue</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">RatingPill only: controlled rating.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: RatingValue) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">RatingPill only: reports each selection.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Text shown by the default secondary trigger.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"Feedback"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">copy</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional form copy; for Inline, replaces the capsule question.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dryRun</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Demo mode: Send neither calls onSubmit nor closes the current surface.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"inline"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Uses the persistent rating capsule that expands in place.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showTopics</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows the predefined product-topic selector.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">topics</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Explicit topic options; passing a non-empty array renders the selector without showTopics.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">topic</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled topic value; pair with onTopicChange.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultTopic</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial uncontrolled topic.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onTopicChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(topic: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called when the topic selection changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">includeTopicInMetadata</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Also merges the selected topic into the third onSubmit argument as metadata.topic. Default is false so metadata stays exactly what the caller passed.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">metadata</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, string&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Context forwarded to onSubmit.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Content before the trigger or Inline question.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Content after the trigger or Inline question.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultValue</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">RatingValue</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial uncontrolled rating; all ratings use the same blue selected state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSubmit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(rating: FeedbackRatingValue | undefined, text: string, metadata?: Record&lt;string, string&gt;, topic?: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives the rating, text, caller metadata, and the selected topic after a non-dry-run submission. The topic selector only renders in the default Popover variant.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Place Feedback at the end of a page, doc, or completed flow where the user has formed an opinion. Don't front-load it on a surface the user has only opened.
- Keep the form collapsed until the user acts: default Feedback starts as a secondary button, while Inline keeps only the rating capsule visible.
- A real submit closes and resets the surface; dryRun deliberately keeps it open and does not invoke onSubmit.
- label is Title Case and short on the default trigger. Feedback is fine; override only when scoping to a flow: Feedback on Imports, Report a Bug.
- copy adds sentence-case form context in the default variant and replaces the question in Inline (How did the import go?). Cut please and we're sorry.
- Don't use Feedback as a substitute for a support form, a bug report intake, or NPS sampling. Those have dedicated surfaces.
