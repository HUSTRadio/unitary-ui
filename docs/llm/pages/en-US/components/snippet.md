# Snippet

> Route: `/components/snippet`

Displays a runnable shell command or short code the user is meant to copy.

[Back to Components](#/components)

# Snippet

snippet

Displays a runnable shell command or short code the user is meant to copy.

## When to use

- Use Snippet for a runnable shell command the user is meant to copy; it ships with the prompt glyph and copy affordance built in.
- For inline tokens (env var names, paths) use InlineCode, and for multi-line source use CodeBlock; one-liner commands belong in Snippet.
- Pair Snippet with a CopyButton so users can grab the command without manually selecting text.

## When not to use

- Keep one command per Snippet; for longer scripts, switch to CodeBlock so users can read before they copy.
- Do not use Snippet for pseudocode or pseudo-syntax examples in documentation—it should present real, pasteable commands.
- Do not combine multiple commands in a single Snippet; each command should be its own independent Snippet to avoid copy confusion.

## Examples

### Default snippet

Displays the default Snippet appearance with the prompt glyph and copy button.

### Inverted variant

Demonstrates the \`dark\` inverted variant: a dark surface with light text in light theme, switching automatically to a light surface with dark text in dark theme.

### All variants

Showcases all Snippet variant styles and configuration options available.

## Accessibility

- The Copy button must be an icon-only button with an explicit aria-label so screen readers announce the action intent (e.g., "Copy deployment URL").
- Provide visual feedback (checkmark) for about 1.5 seconds after a successful copy, then reset before the next click.
- Prefer navigator.clipboard.writeText with a hidden-textarea execCommand fallback so copying works where clipboard permissions are missing.

## Controlled behavior

- Supports controlled copied-state (copied), letting developers programmatically manage the visibility and duration of copy feedback.
- The callback prop allows executing additional business logic when the copy action fires.

## Responsive behavior

- Snippet keeps the same padding and font size on narrow screens; overlong command text scrolls horizontally inside the text area (min-w shrink from sm-) instead of scaling text down.
- The copy button maintains consistent visibility and tap-target size across all screen widths.

## Theme behavior

- Snippet background, border, and text color follow theme variables, each mode having its own color palette.
- Inverted (\`dark\`) is not a fixed dark skin: it switches the whole subtree to the opposite scheme's color scheme — a \`#0a0a0a\` surface with \`#f2f2f2\` text in light theme, and a \`#ffffff\` surface with \`#1a1a1a\` text in dark theme — staying readable in both modes.
- Default (\`type="default"\`) code text and the copy button use \`text-inherit\` to follow the container color chain, while \`success\` / \`error\` / \`warning\` semantic colors do not flip with inversion, matching the official component.

## Live Demo

`$ npm init next-app`

```tsx
import { Snippet } from "@/components/ui/snippet";

export function SnippetDefault21B111CBExample() {
  return <Snippet text="npm init next-app" width="300px" />;
}
```

## Inverted

`$ npm init next-app`

```tsx
import { Snippet } from "@/components/ui/snippet";

export function SnippetInverted7A2F99B7Example() {
  return <Snippet dark text="npm init next-app" width="300px" />;
}
```

## Multi line

`$ cd project``$ now`

```tsx
import { Snippet } from "@/components/ui/snippet";

export function SnippetMultiLine8E24895DExample() {
  return <Snippet text={["cd project", "now"]} width="100%" />;
}
```

## No prompt

`npm init next-app`

```tsx
import { Snippet } from "@/components/ui/snippet";

export function SnippetNoPromptFD175ECDExample() {
  return <Snippet prompt={false} text="npm init next-app" width="300px" />;
}
```

## Callback

`$ npm init next-app`

```tsx
import { useState } from "react";
import { Snippet } from "@/components/ui/snippet";

export function SnippetCallback32E8D276Example() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col gap-2">
      <Snippet
        onCopy={() => setMessage("Copied npm init next-app")}
        text="npm init next-app"
        width="300px"
      />
      <span role="status" className="text-copy-13 text-muted-foreground">
        {message}
      </span>
    </div>
  );
}
```

## Variants

`$ npm init next-app`

`$ npm init next-app`

`$ npm init next-app`

```tsx
import { Snippet } from "@/components/ui/snippet";

export function SnippetVariants63D2643BExample() {
  return (
    <div className="flex flex-col items-stretch justify-start gap-3 flex-initial">
      <Snippet text="npm init next-app" type="success" width="300px" />
      <Snippet text="npm init next-app" type="error" width="300px" />
      <Snippet text="npm init next-app" type="warning" width="300px" />
    </div>
  );
}
```

## Controlled Copied State

`Copy install prompt`

```tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { Snippet } from "@/components/ui/snippet";
import type { JSX } from "react";

const COPY_TEXT = `# About
Unitary UI — a React component library built on the Vercel Geist design language

# Requirements
Install the package, import the stylesheet, and keep components on the semantic token layer so light and dark themes stay consistent across the library.`;

export function SnippetControlledCopiedStateB953E7D9Example(): JSX.Element {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleCopy = useCallback(() => {
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1000);
  }, []);

  return (
    <Snippet
      copied={copied}
      copyText={COPY_TEXT}
      onCopy={handleCopy}
      text="Copy install prompt"
      prompt={false}
      width="300px"
    />
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Snippet } from "@/components/ui/snippet";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">text</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | string[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Text available for copying; arrays render multiple lines.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">width</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Snippet width; numbers are pixels.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">dark</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Uses the inverted surface.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prompt</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows the shell prompt without copying it.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">true</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onCopy</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">() =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called after copying succeeds.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">type</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">SnippetType</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Semantic text color.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"default"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">copied</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled copied state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">copyText</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Overrides the clipboard payload.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Snippet for a runnable shell command the user is meant to copy. For inline tokens (env var names, paths) use InlineCode, and for multi-line source use CodeBlock.
- Pass the command as text. The component renders any prompt itself; keep the copied payload in sync with what the user sees.
- Keep one command per Snippet. For longer scripts, switch to CodeBlock so users can read before they copy.
- Pair Snippet with a CopyButton affordance so users can grab the command without selecting text manually.
