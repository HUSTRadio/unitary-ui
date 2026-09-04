# Code

> Route: `/components/code`

Display a snippet of code with syntax highlighting.

[Back to Components](#/components)

# Code

Code

Display a snippet of code with syntax highlighting.

## When to use

- Use Code for a lightweight block-level snippet and pass syntax to attach language highlighting.
- Use the module's InlineCode export for variable names, function names, or file paths inside prose.

## When not to use

- Use the richer Code Block when the example needs a filename header, line numbers, or added/removed line treatment.
- When the content is not valid code or markup; applying Code's syntax coloring to arbitrary text produces misleading visual effects.

## Examples

### Block and inline code

Shows block-level Code and InlineCode embedded in prose in one example.

### InlineCode in rich text

Use InlineCode in lists, links, and block quotes without introducing a block-level container.

## Accessibility

Not applicable: Code renders <pre><code> semantics and InlineCode renders <code>; neither contains interactive controls or needs additional ARIA.

## Controlled behavior

Not applicable: Code is a read-only syntax highlighter with no value/onChange props or interactive state; its rendered content is determined entirely by the children prop.

## Responsive behavior

Not applicable: Code preserves preformatted content and uses overflow-x-auto when it exceeds the container; InlineCode follows the surrounding prose layout.

## Theme behavior

- Syntax highlighting colors follow the design system's code color tokens, displaying correctly under both light and dark themes.

## Live Demo

Install with `npm i geist` and import the component.

```tsx
console.log("Hello");
```

```tsx
import { Code, InlineCode } from "@/components/ui/code";

export function CodeDefault21B111CBExample() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <p className="text-copy-14 text-muted-foreground">
        Install with <InlineCode>npm i geist</InlineCode> and import the component.
      </p>
      <Code syntax="javascript">{`console.log("Hello")`}</Code>
    </div>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Code, InlineCode } from "@/components/ui/code";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Code content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
