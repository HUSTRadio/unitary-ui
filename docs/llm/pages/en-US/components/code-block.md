# Code Block

> Route: `/components/code-block`

A bordered code block with a filename header for multi-line source.

[Back to Components](#/components)

# Code Block

Code Block

A bordered code block with a filename header for multi-line source.

## When to use

- Displaying multi-line, syntax-highlighted source code that the reader needs to scan line by line or copy and paste.
- When the code snippet has a known paste destination (like app/page.tsx or vercel.json), use the filename header to reinforce context clarity.

## When not to use

- For single-line inline code identifiers (environment variable names, function names, file paths), use the InlineCode component, which avoids the unnecessary visual weight of a bordered block.
- When presenting a runnable complete application rather than a code excerpt; use Snippet with its built-in copy affordance instead.

## Examples

### Default code block

A base Code Block render: bordered, with filename header and multi-line syntax highlighting.

### Code block without filename

Suitable for ephemeral example snippets; omitting the filename header keeps the presentation clean and uncluttered.

### Code block with highlighted lines

Highlights only the lines under discussion to draw the reader's attention; effective when selective lines are emphasized, not every line.

### Code block with added and removed line annotations

Uses green and red annotations to indicate added and deleted lines, clearly presenting diff-style changes.

### Code block with language switcher and tabs

Multi-language tabbed interface with dynamic language switching, letting readers view different language versions of the same code.

## Accessibility

Not applicable: Code Block is a code display container with no interactive UI controls; line numbers and syntax colors do not participate in the accessibility tree announcements.

## Controlled behavior

Not applicable: Code Block is a pure presentation component with no value/onChange props or expand/collapse control interfaces; its content is always statically rendered.

## Responsive behavior

- On small viewports, the code block scrolls horizontally to avoid line breaks that would break syntax readability, while maintaining correct line number alignment.
- The filename header and content area adapt spacing based on available width, keeping a compact reading rhythm on wider screens.

## Theme behavior

- Border color, background color, and padding automatically adapt to light and dark themes via design system color tokens.
- Syntax highlighting colors stay consistent with the theme's code palette, ensuring high contrast and readability across themes.

## Live Demo

Table.jsx

```tsx
// Usage:
//   enabled by `--debug-prerender`
//   route patterns: [id...] or [...id]
//   NODE_OPTIONS='--debug-prerender' node
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

const code = `// Usage:
//   enabled by \`--debug-prerender\`
//   route patterns: [id...] or [...id]
//   NODE_OPTIONS='--debug-prerender' node
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

<CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx">
  {code}
</CodeBlock>;
```

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

<CodeBlock aria-label="Hello world" language="jsx">
  {code}
</CodeBlock>;
```

highlighted.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

<CodeBlock
  aria-label="Hello world"
  filename="highlighted.jsx"
  language="jsx"
  highlightedLinesNumbers={[1, 4]}
>
  {code}
</CodeBlock>;
```

next.config.js

```tsx
module.exports = {
-  experimental: {
-    appDir: true,
-  },
+  appDir: true,
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

const code = `module.exports = {
  experimental: {
    appDir: true,
  },
  appDir: true,
}`;

<CodeBlock
  aria-label="Hello world"
  filename="next.config.js"
  language="jsx"
  addedLinesNumbers={[5]}
  removedLinesNumbers={[2, 3, 4]}
>
  {code}
</CodeBlock>;
```

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Count: {props.count}</h1>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Count: {props.count}</h1>
    </div>
  );
}`;

<CodeBlock aria-label="Hello world" language="jsx" referencedLinesNumbers={[4]}>
  {code}
</CodeBlock>;
```

language-switcher.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";
import { useState } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

export function Component() {
  const [language, setLanguage] = useState("JavaScript");

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="language-switcher.jsx"
      language="jsx"
      switcher={{
        options: ["JavaScript", "TypeScript", "Next.js", "Lua"],
        value: language,
        onChange: setLanguage,
      }}
    >
      {code}
    </CodeBlock>
  );
}
```

language-switcher.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";
import { useState } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

export function Component() {
  const [language, setLanguage] = useState("JavaScript");

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="language-switcher.jsx"
      language="jsx"
      tabs={{
        options: ["JavaScript", "TypeScript", "Next.js", "Lua"],
        value: language,
        onChange: setLanguage,
      }}
    >
      {code}
    </CodeBlock>
  );
}
```

hidden-line-numbers.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@/components/ui/code-block";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

<CodeBlock
  aria-label="Hello world"
  filename="hidden-line-numbers.jsx"
  language="jsx"
  hideLineNumbers
>
  {code}
</CodeBlock>;
```

Table.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

[AskAsk v0](<https://v0.app/chat?q=function%20MyComponent(props)%20%7B%0A%20%20return%20(%0A%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%3Ch1%3EHello%2C%20%7Bprops.name%7D!%3C%2Fh1%3E%0A%20%20%20%20%20%20%3Cp%3EThis%20is%20an%20example%20React%20component.%3C%2Fp%3E%0A%20%20%20%20%3C%2Fdiv%3E%0A%20%20)%3B%0A%7D>)

Table.jsx

```tsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

[Open inOpen in v0](<https://v0.app/chat?q=function%20MyComponent(props)%20%7B%0A%20%20return%20(%0A%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%3Ch1%3EHello%2C%20%7Bprops.name%7D!%3C%2Fh1%3E%0A%20%20%20%20%20%20%3Cp%3EThis%20is%20an%20example%20React%20component.%3C%2Fp%3E%0A%20%20%20%20%3C%2Fdiv%3E%0A%20%20)%3B%0A%7D>)

```tsx
import { CodeBlock } from "@/components/ui/code-block";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

<div className="flex flex-col gap-4">
  <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx" v0="ask">
    {code}
  </CodeBlock>
  <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx" v0="build">
    {code}
  </CodeBlock>
</div>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { CodeBlock, CodeBlockHeader, CodeBlockContent } from "@/components/ui/code-block";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">code</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Code rendered by the default content slot.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">language</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Language label for syntax highlighting.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use CodeBlock for multi-line, syntax-highlighted source the reader will scan or paste. For a single inline token (env var, function name, file path), use InlineCode.
- Pick Snippet for a copy-to-clipboard shell command or one-line key reveal; it ships with the prompt glyph and copy affordance built in.
- Always pass a language/syntax (tsx, bash, json, diff). Highlighting is the primary reason to choose CodeBlock over a plain <pre>.
- Highlight only the lines under discussion. A block where every line is highlighted reads the same as no highlight at all.
- Show the filename header when the snippet has a paste destination (app/page.tsx, vercel.json). Omit it for ephemeral examples.
- Snippets stay runnable. Don't paraphrase real code into pseudo-syntax, and don't prepend $ to shell commands.
