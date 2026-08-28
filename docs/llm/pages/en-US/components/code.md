# Code

> Route: `/components/code`

Display a snippet of code with syntax highlighting.

[Back to Components](#/components)

# Code

Code

Display a snippet of code with syntax highlighting.

## When to use

-   Referencing a single code identifier within technical prose—environment variable names, function names, class names, or file paths.
-   Applying syntax coloring to code elements inline within paragraphs or lists to improve readability while keeping the text flow intact.

## When not to use

-   When you need to display multi-line source code blocks; use Code Block instead, which ships with a border, filename header, and optional line numbers.
-   When the content is not valid code or markup; applying Code's syntax coloring to arbitrary text produces misleading visual effects.

## Examples

### Default inline code

Renders syntax-highlighted single-line code inline within paragraph text.

### Nested inline code within rich text structures

Shows how the Code component maintains correct syntax coloring inside complex nested contexts like lists, links, and block quotes.

## Accessibility

Not applicable: Code is a purely presentational element with no interactive controls; its semantic meaning is carried by the surrounding text, and no ARIA attributes are needed.

## Controlled behavior

Not applicable: Code is a read-only syntax highlighter with no value/onChange props or interactive state; its rendered content is determined entirely by the children prop.

## Responsive behavior

Not applicable: Code renders inline and does not control its own layout dimensions; its responsive behavior is entirely inherited from the parent container's typographic rules.

## Theme behavior

-   Syntax highlighting colors follow the design system's code color tokens, displaying correctly under both light and dark themes.

## Live Demo

Install with `npm i geist` and import the component.

Use `type="error"` for destructive confirmations.

```tsx
export function Component(): JSX.Element {
  return <Snippet text="npm init next-app" width="300px" />;
}
```

```tsx
import { Code, InlineCode } from "@/components/ui/code";

<div className="flex w-full max-w-2xl flex-col gap-3">
  <p className="text-copy-14 text-muted-foreground">
    Install with <InlineCode>npm i geist</InlineCode> and import the component.
  </p>
  <Code syntax="javascript">{`console.log("Hello")`}</Code>
</div>
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Code, InlineCode } from "@/components/ui/code"
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Code content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>
