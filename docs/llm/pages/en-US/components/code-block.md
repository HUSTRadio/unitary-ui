# Code Block

> Route: `/components/code-block`

Display highlighted code with filenames, line numbers, and change markers.

[Back to Components](#/components)

# Code Block

code-block

Display highlighted code with filenames, line numbers, and change markers.

## When to use

- Displaying multi-line, syntax-highlighted source code that the reader needs to scan line by line or copy and paste.
- When the code snippet has a known paste destination (like src/App.tsx or vite.config.ts), use the filename header to reinforce context clarity.

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
import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockDefault37A8EEC1Example() {
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

  return (
    <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx">
      {code}
    </CodeBlock>
  );
}
```

## No filename

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
import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockNoFilenameC9029DC2Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <CodeBlock aria-label="Hello world" language="jsx">
      {code}
    </CodeBlock>
  );
}
```

## Highlighted lines

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
import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockHighlightedLines610E38F8Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="highlighted.jsx"
      language="jsx"
      highlightedLinesNumbers={[1, 4]}
    >
      {code}
    </CodeBlock>
  );
}
```

## Added removed lines

next.config.js

```tsx
module.exports = {
-    experimental: {
-      appDir: true,
-    },
+    appDir: true,
  }
```

```tsx
import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockAddedRemovedLinesED9789E1Example() {
  const code = `module.exports = {
    experimental: {
      appDir: true,
    },
    appDir: true,
  }`;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="next.config.js"
      language="jsx"
      addedLinesNumbers={[5]}
      removedLinesNumbers={[2, 3, 4]}
    >
      {code}
    </CodeBlock>
  );
}
```

## Referenced lines

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
import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockReferencedLines009BBC04Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Count: {props.count}</h1>
      </div>
    );
  }`;

  return (
    <CodeBlock aria-label="Hello world" language="jsx" referencedLinesNumbers={[4]}>
      {code}
    </CodeBlock>
  );
}
```

## Language switcher

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
import { CodeBlock } from "@hustradio/unitary-ui";
import { useState } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

const codeTs = `function MyComponent(props: Props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

const codeNext = `export default async function Page() {
  const data = await fetch("https://api.example.com").then((res) => res.json());
  return <main>{data.title}</main>;
}`;

const codeLua = `local b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
local decode_table = {}
for i = 1, #b64 do
  decode_table[b64:byte(i)] = i - 1
end

function BloomFilter:has(key)
  local ptr = self.ptr
  for byte_offset, bit_offset in self:iterator(key) do
    local sextet = decode_table[ptr[byte_offset]]
    if bit.band(sextet, bit.lshift(1, bit_offset)) == 0 then
      return false
    end
  end
  return true
end`;

// 切换器要驱动 filename / language / code 三者一起变，否则下拉只改了自己的选中态。
const snippets: Record<string, { filename: string; language: string; code: string }> = {
  JavaScript: { filename: "language-switcher.jsx", language: "jsx", code },
  TypeScript: { filename: "language-switcher.tsx", language: "tsx", code: codeTs },
  "Next.js": { filename: "app/page.tsx", language: "tsx", code: codeNext },
  Lua: { filename: "bloom-filter.lua", language: "lua", code: codeLua },
};

export function CodeBlockLanguageSwitcherEFBF544EExample() {
  const [language, setLanguage] = useState("JavaScript");
  const snippet = snippets[language] ?? snippets.JavaScript;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename={snippet.filename}
      language={snippet.language}
      switcher={{
        options: Object.keys(snippets),
        value: language,
        onChange: setLanguage,
      }}
    >
      {snippet.code}
    </CodeBlock>
  );
}
```

## Language switcher with tabs

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
import { CodeBlock } from "@hustradio/unitary-ui";
import { useState } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

const codeTs = `function MyComponent(props: Props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Good to see you</p>
    </div>
  );
}`;

const codeNext = `export default async function Page() {
  const data = await fetch("https://api.example.com").then((res) => res.json());
  return <main>{data.title}</main>;
}`;

const codeLua = `local b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
local decode_table = {}
for i = 1, #b64 do
  decode_table[b64:byte(i)] = i - 1
end

function BloomFilter:has(key)
  local ptr = self.ptr
  for byte_offset, bit_offset in self:iterator(key) do
    local sextet = decode_table[ptr[byte_offset]]
    if bit.band(sextet, bit.lshift(1, bit_offset)) == 0 then
      return false
    end
  end
  return true
end`;

// 每个 tab 都要有自己的 filename / language / code：切换时三者必须一起换，
// 否则只有选中态移动、内容不变，选项卡看起来就是失效的。
const snippets: Record<string, { filename: string; language: string; code: string }> = {
  JavaScript: { filename: "language-switcher.jsx", language: "jsx", code },
  TypeScript: { filename: "language-switcher.tsx", language: "tsx", code: codeTs },
  "Next.js": { filename: "app/page.tsx", language: "tsx", code: codeNext },
  Lua: { filename: "bloom-filter.lua", language: "lua", code: codeLua },
};

export function CodeBlockLanguageSwitcherWithTabs22834C2CExample() {
  const [language, setLanguage] = useState("JavaScript");
  const snippet = snippets[language] ?? snippets.JavaScript;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename={snippet.filename}
      language={snippet.language}
      tabs={{
        options: Object.keys(snippets),
        value: language,
        onChange: setLanguage,
      }}
    >
      {snippet.code}
    </CodeBlock>
  );
}
```

## Hidden line numbers

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
import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockHiddenLineNumbers3831A2F1Example() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>Good to see you</p>
      </div>
    );
  }`;

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="hidden-line-numbers.jsx"
      language="jsx"
      hideLineNumbers
    >
      {code}
    </CodeBlock>
  );
}
```

## Open in v0

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

[AskAsk v0](<https://v0.app/chat?q=function%20MyComponent(props)%20%7B%0A%20%20%20%20return%20(%0A%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%3Ch1%3EHello%2C%20%7Bprops.name%7D!%3C%2Fh1%3E%0A%20%20%20%20%20%20%20%20%3Cp%3EThis%20is%20an%20example%20React%20component.%3C%2Fp%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20)%3B%0A%20%20%7D>)

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

[Open inOpen in v0](<https://v0.app/chat?q=function%20MyComponent(props)%20%7B%0A%20%20%20%20return%20(%0A%20%20%20%20%20%20%3Cdiv%3E%0A%20%20%20%20%20%20%20%20%3Ch1%3EHello%2C%20%7Bprops.name%7D!%3C%2Fh1%3E%0A%20%20%20%20%20%20%20%20%3Cp%3EThis%20is%20an%20example%20React%20component.%3C%2Fp%3E%0A%20%20%20%20%20%20%3C%2Fdiv%3E%0A%20%20%20%20)%3B%0A%20%20%7D>)

```tsx
import { CodeBlock } from "@hustradio/unitary-ui";

export function CodeBlockOpenInV0CA6FBF0AExample() {
  const code = `function MyComponent(props) {
    return (
      <div>
        <h1>Hello, {props.name}!</h1>
        <p>This is an example React component.</p>
      </div>
    );
  }`;

  return (
    <div className="flex flex-col gap-4">
      <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx" v0="ask">
        {code}
      </CodeBlock>
      <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx" v0="build">
        {code}
      </CodeBlock>
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { CodeBlock, CodeBlockHeader, CodeBlockContent } from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">children</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Code rendered by the default content slot.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">language</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Language label for syntax highlighting.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use CodeBlock for multi-line, syntax-highlighted source the reader will scan or paste. For a single inline token (env var, function name, file path), use InlineCode.
- Pick Snippet for a copy-to-clipboard shell command or one-line key reveal; it ships with the prompt glyph and copy affordance built in.
- Always pass a language/syntax (tsx, bash, json, diff). Highlighting is the primary reason to choose CodeBlock over a plain <pre>.
- Highlight only the lines under discussion. A block where every line is highlighted reads the same as no highlight at all.
- Show the filename header when the snippet has a paste destination (src/App.tsx, vite.config.ts). Omit it for ephemeral examples.
- Snippets stay runnable. Don't paraphrase real code into pseudo-syntax, and don't prepend $ to shell commands.
