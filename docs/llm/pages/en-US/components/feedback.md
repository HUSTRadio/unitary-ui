# Feedback

> Route: `/components/feedback`

Gathers an emoji rating and open text feedback.

[Back to Components](#/components)

# Feedback

Feedback

Gathers an emoji rating and open text feedback.

## When to use

- At the end of a page, documentation article, or completed workflow — collect feedback after the user has had time to form an opinion.
- When lightweight emotional feedback (emoji rating) combined with optional detailed text comments is sufficient, without needing a full-form experience.
- For targeted feedback collection on specific flows (e.g., Feedback on Imports, Report a Bug) to gather actionable improvement insights.

## When not to use

- Don't front-load the feedback panel on a surface the user just opened — it derails the work that brought them there.
- Don't use Feedback as a substitute for a support form, bug report intake, or NPS sampling — those have dedicated surfaces and tools.
- Don't auto-open the feedback panel — keep it collapsed until the user explicitly clicks the trigger to avoid disrupting their workflow.

## Examples

### Default feedback panel

Displays the default emoji-rating and optional text input in a collapsible feedback panel structure.

### Inline feedback

Demonstrates embedding the Feedback component within a row-level layout, suitable for instant post-interaction feedback.

### Feedback with metadata

Shows attaching contextual metadata alongside the feedback panel, helping the team understand the source and context of collected responses.

## Accessibility

- Each emoji rating button should have an explicit aria-label so screen readers identify distinct emotional options.
- On submit the panel closes and focus returns to the trigger button — the close itself serves as acknowledgment.
- The optional text input should have a proper label association and aria-describedby for helper text.

## Controlled behavior

- Panel open/collapsed state can be externally controlled via an open prop, enabling conditional opening logic.
- On submission the panel auto-closes and returns focus to the trigger; callers can listen to the submit event to process collected data.
- Supports preset initial rating values via controlled props for previously selected feedback state restoration.

## Responsive behavior

- On mobile the feedback panel presents as a bottom sheet (Drawer-style); on desktop it appears as a centered floating overlay.
- Emoji rating buttons increase spacing on small screens for larger touch targets, ensuring mobile usability.
- The text input area adapts its height within the full-width container, avoiding horizontal overflow on narrow viewports.

## Theme behavior

- Emoji color mapping (green for satisfied, yellow for neutral, red for dissatisfied) maintains readability in both dark and light modes.
- Panel shadow, background, and border colors follow the Geist theme system, supporting global theme variable overrides.

## Live Demo

vercel

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackDefault21B111CBExample() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback label="vercel" dryRun />
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
  return <Feedback dryRun label="vercel" type="inline" />;
}
```

## Feedback with Select

vercel

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackFeedbackWithSelectBF2A8F56Example() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback label="vercel" showTopics dryRun />
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

## Feedback with metadata

vercel

This example is hidden because it is intended for only desktop.

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Note, NoteContent } from "@/components/ui/note";

export function FeedbackFeedbackWithMetadata6449A9ACExample() {
  return (
    <>
      <div className="hidden justify-center xl:flex">
        <Feedback
          label="vercel"
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

## Rating bar

vercel

vercel

vercel

```tsx
import { Feedback } from "@/components/ui/feedback";

export function FeedbackRatingBar253F979EExample() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Feedback label="vercel" dryRun defaultValue="love" />
        <Feedback label="vercel" dryRun defaultValue="not-great" />
        <Feedback label="vercel" dryRun defaultValue="hate" />
      </div>
    </>
  );
}
```

## Feedback with prefix

vercel

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Flag } from "lucide-react";

export function FeedbackFeedbackWithPrefixEBD13739Example() {
  return <Feedback dryRun label="vercel" prefix={<Flag className="size-4" />} />;
}
```

## Feedback with suffix

vercel

```tsx
import { Feedback } from "@/components/ui/feedback";
import { Flag } from "lucide-react";

export function FeedbackFeedbackWithSuffixE429255FExample() {
  return <Feedback dryRun label="vercel" suffix={<Flag className="size-4" />} />;
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Feedback } from "@/components/ui/feedback";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSubmit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(rating: FeedbackRatingValue | undefined, text: string, metadata?: Record&lt;string, string&gt;) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives the selected rating, feedback text, and optional metadata.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultValue</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">RatingValue</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial rating (uncontrolled). Rating bar capsule colors by tone: love → success / okay → gray / not-great → warning / hate → error.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Place Feedback at the end of a page, doc, or completed flow where the user has formed an opinion. Don't front-load it on a surface the user has only opened.
- Keep the panel collapsed until the user clicks the trigger; auto-opening derails the work that prompted the feedback.
- Submit closes the panel and returns focus to the trigger. Don't replace the panel with a generic acknowledgment toast; the close itself is the acknowledgment.
- label is Title Case and short. Default Feedback is fine; override only when scoping to a flow: Feedback on Imports, Report a Bug. Don't end the label with ?.
- copy overrides the prompt header next to the emoji row in sentence case (How did the import go?). Cut please and we're sorry.
- Don't use Feedback as a substitute for a support form, a bug report intake, or NPS sampling. Those have dedicated surfaces.
