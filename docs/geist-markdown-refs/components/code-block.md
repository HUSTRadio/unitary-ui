# Code Block

Code Block component used across Vercel and Next.js.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:5px
>   "1// Usage:2// enabled by `--debug-preren" · .prism-code · h:280px · pad:20px 0px · 400 16px/24px · fg:#171717 · bg:#ffffff
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
> - **No filename**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · bg:#fafafa · r:5px
>   "1function MyComponent(props) {2 return (" · .prism-code · h:200px · pad:20px 0px · 400 16px/24px · fg:#171717 · bg:#ffffff
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
> - **Highlighted lines**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:5px
>   "1function MyComponent(props) {2 return (" · .prism-code · h:200px · pad:20px 0px · 400 16px/24px · fg:#171717 · bg:#ffffff
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
> - **Added & removed lines**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:5px
>   "1module.exports = {2 experimental: {3 ap" · .prism-code · h:160px · pad:20px 0px · 400 16px/24px · fg:#171717 · bg:#ffffff
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
> - **Referenced lines**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · bg:#fafafa · r:5px
>   "1function MyComponent(props) {2 return (" · .prism-code · h:180px · pad:20px 0px · 400 16px/24px · fg:#171717 · bg:#ffffff
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
> - **Language switcher**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "JavaScriptTypeScriptNext.jsLua" · .absolute · h:32px · 400 16px/normal · fg:#171717 · bg:#f2f2f2
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:5px
>   "1function MyComponent(props) {2 return (" · .prism-code · h:200px · pad:20px 0px · 400 16px/24px · fg:#171717 · bg:#ffffff
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
> - **Language switcher with tabs**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "JavaScript" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#ffffff · bg:#171717 · r:6px
>   "TypeScript" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#171717 · bg:#00000014 · r:6px
>   "Next.js" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#171717 · bg:#00000014 · r:6px
>   "Lua" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#171717 · bg:#00000014 · r:6px
> - **Hidden line numbers**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:5px
>   "function MyComponent(props) { return ( <" · .prism-code · h:200px · pad:20px 0px · 400 16px/24px · fg:#171717 · bg:#ffffff
> - **Open in v0**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:5px
>   "1function MyComponent(props) {2 return (" · .prism-code · h:200px · pad:20px 0px · 400 16px/24px · fg:#171717 · bg:#ffffff
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#a8a8a8
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:5px
>   "1// Usage:2// enabled by `--debug-preren" · .prism-code · h:280px · pad:20px 0px · 400 16px/24px · fg:#ededed · bg:#0a0a0a
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
> - **No filename**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · bg:#000000 · r:5px
>   "1function MyComponent(props) {2 return (" · .prism-code · h:200px · pad:20px 0px · 400 16px/24px · fg:#ededed · bg:#0a0a0a
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
> - **Highlighted lines**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:5px
>   "1function MyComponent(props) {2 return (" · .prism-code · h:200px · pad:20px 0px · 400 16px/24px · fg:#ededed · bg:#0a0a0a
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
> - **Added & removed lines**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:5px
>   "1module.exports = {2 experimental: {3 ap" · .prism-code · h:160px · pad:20px 0px · 400 16px/24px · fg:#ededed · bg:#0a0a0a
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
> - **Referenced lines**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · bg:#000000 · r:5px
>   "1function MyComponent(props) {2 return (" · .prism-code · h:180px · pad:20px 0px · 400 16px/24px · fg:#ededed · bg:#0a0a0a
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
> - **Language switcher**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "JavaScriptTypeScriptNext.jsLua" · .absolute · h:32px · 400 16px/normal · fg:#ededed · bg:#1a1a1a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:5px
>   "1function MyComponent(props) {2 return (" · .prism-code · h:200px · pad:20px 0px · 400 16px/24px · fg:#ededed · bg:#0a0a0a
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
> - **Language switcher with tabs**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "JavaScript" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#0a0a0a · bg:#ededed · r:6px
>   "TypeScript" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#ededed · bg:#ffffff17 · r:6px
>   "Next.js" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#ededed · bg:#ffffff17 · r:6px
>   "Lua" · .cursor-pointer · h:24px · pad:0px 6px · 400 13px/18.5714px · fg:#ededed · bg:#ffffff17 · r:6px
> - **Hidden line numbers**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:5px
>   "function MyComponent(props) { return ( <" · .prism-code · h:200px · pad:20px 0px · 400 16px/24px · fg:#ededed · bg:#0a0a0a
> - **Open in v0**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:5px
>   "1function MyComponent(props) {2 return (" · .prism-code · h:200px · pad:20px 0px · 400 16px/24px · fg:#ededed · bg:#0a0a0a
>   "1" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787
>   "2" · .code-block-module__vF3MAa__lineNumber · h:20px · pad:0px 20px 0px 0px · 400 13px/20px · fg:#878787

<!-- GEIST-RENDER-METRICS-END -->

## Default

```jsx
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
import { CodeBlock } from "@vercel/geistcn/components";
import type { JSX } from "react";

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

export function Component(): JSX.Element {
  return (
    <CodeBlock aria-label="Hello world" filename="Table.jsx" language="jsx">
      {code}
    </CodeBlock>
  );
}
```

## No filename

```jsx
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
import { CodeBlock } from "@vercel/geistcn/components";
import type { JSX } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

export function Component(): JSX.Element {
  return (
    <CodeBlock aria-label="Hello world" language="jsx">
      {code}
    </CodeBlock>
  );
}
```

## Highlighted lines

```jsx
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
import { CodeBlock } from "@vercel/geistcn/components";
import type { JSX } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

export function Component(): JSX.Element {
  return (
    <CodeBlock
      aria-label="Hello world"
      filename="highlighted.jsx"
      highlightedLinesNumbers={[1, 4]}
      language="jsx"
    >
      {code}
    </CodeBlock>
  );
}
```

## Added & removed lines

```jsx
module.exports = {
  experimental: {
    appDir: true,
  },
  appDir: true,
};
```

```tsx
import { CodeBlock } from "@vercel/geistcn/components";
import type { JSX } from "react";

const code = `module.exports = {
  experimental: {
    appDir: true,
  },
  appDir: true,
}`;

export function Component(): JSX.Element {
  return (
    <CodeBlock
      aria-label="Hello world"
      filename="next.config.js"
      addedLinesNumbers={[5]}
      removedLinesNumbers={[2, 3, 4]}
      language="jsx"
    >
      {code}
    </CodeBlock>
  );
}
```

## Referenced lines

You can link to lines. Just press on any line number.

```jsx
function MyComponent(props) {
  return (
    <div>
      <h1>Count: {props.count}</h1>
    </div>
  );
}
```

```tsx
import { CodeBlock } from "@vercel/geistcn/components";
import type { JSX } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Count: {props.count}</h1>
    </div>
  );
}`;

export function Component(): JSX.Element {
  return (
    <CodeBlock aria-label="Hello world" language="jsx">
      {code}
    </CodeBlock>
  );
}
```

## Language switcher

```jsx
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
import { CodeBlock } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

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

const codeLua = `local b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
local decode_table = ffi.new 'uint8_t[256]'
for i = 1, #b64 do
  decode_table[str_byte(b64, i)] = i - 1 -- Base64 values start from 0
end

function BloomFilter:has(key)
  local ptr = self.ptr -- uint8_t* pointer to start of base64 string
  for byte_offset, bit_offset in self:iterator(key) do
    local sextet = decode_table[ptr[byte_offset]]
    if band(sextet, lshift(1, bit_offset)) == 0 then
      return false
    end
  end
  return true
end`;

const languages = [
  {
    label: "JavaScript",
    value: "js",
  },
  {
    label: "TypeScript",
    value: "ts",
  },
  {
    label: "Next.js",
    value: "next",
  },
  {
    label: "Lua",
    value: "lua",
  },
];

export function Component(): JSX.Element {
  const [language, setLanguage] = useState("js");

  if (language === "ts") {
    return (
      <CodeBlock
        aria-label="Hello world"
        filename="language-switcher.tsx"
        language="tsx"
        switcher={{
          options: languages,
          value: language,
          onChange: (l) => setLanguage(l),
        }}
      >
        {codeTs}
      </CodeBlock>
    );
  }

  if (language === "next") {
    return (
      <CodeBlock
        aria-label="Hello world"
        filename="language-switcher.tsx"
        language="next"
        switcher={{
          options: languages,
          value: language,
          onChange: (l) => setLanguage(l),
        }}
      >
        {codeTs}
      </CodeBlock>
    );
  }

  if (language === "lua") {
    return (
      <CodeBlock
        aria-label="Hello world"
        filename="bloom-filter.lua"
        language="lua"
        switcher={{
          options: languages,
          value: language,
          onChange: (l) => setLanguage(l),
        }}
      >
        {codeLua}
      </CodeBlock>
    );
  }

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="language-switcher.jsx"
      language="jsx"
      switcher={{
        options: languages,
        value: language,
        onChange: (l) => setLanguage(l),
      }}
    >
      {code}
    </CodeBlock>
  );
}
```

## Language switcher with tabs

Use the tabs prop for a tabbed language switcher instead of the default select.

```jsx
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
import { CodeBlock } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";

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

const codeLua = `local b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
local decode_table = ffi.new 'uint8_t[256]'
for i = 1, #b64 do
  decode_table[str_byte(b64, i)] = i - 1 -- Base64 values start from 0
end

function BloomFilter:has(key)
  local ptr = self.ptr -- uint8_t* pointer to start of base64 string
  for byte_offset, bit_offset in self:iterator(key) do
    local sextet = decode_table[ptr[byte_offset]]
    if band(sextet, lshift(1, bit_offset)) == 0 then
      return false
    end
  end
  return true
end`;

const languages = [
  {
    label: "JavaScript",
    value: "js",
  },
  {
    label: "TypeScript",
    value: "ts",
  },
  {
    label: "Next.js",
    value: "next",
  },
  {
    label: "Lua",
    value: "lua",
  },
];

export function Component(): JSX.Element {
  const [language, setLanguage] = useState("js");

  if (language === "ts") {
    return (
      <CodeBlock
        aria-label="Hello world"
        filename="language-switcher.tsx"
        language="tsx"
        tabs={{
          options: languages,
          value: language,
          onChange: (l) => setLanguage(l),
        }}
      >
        {codeTs}
      </CodeBlock>
    );
  }

  if (language === "next") {
    return (
      <CodeBlock
        aria-label="Hello world"
        filename="language-switcher.tsx"
        language="next"
        tabs={{
          options: languages,
          value: language,
          onChange: (l) => setLanguage(l),
        }}
      >
        {codeTs}
      </CodeBlock>
    );
  }

  if (language === "lua") {
    return (
      <CodeBlock
        aria-label="Hello world"
        filename="bloom-filter.lua"
        language="lua"
        tabs={{
          options: languages,
          value: language,
          onChange: (l) => setLanguage(l),
        }}
      >
        {codeLua}
      </CodeBlock>
    );
  }

  return (
    <CodeBlock
      aria-label="Hello world"
      filename="language-switcher.jsx"
      language="jsx"
      tabs={{
        options: languages,
        value: language,
        onChange: (l) => setLanguage(l),
      }}
    >
      {code}
    </CodeBlock>
  );
}
```

## Hidden line numbers

```jsx
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
import { CodeBlock } from "@vercel/geistcn/components";
import type { JSX } from "react";

const code = `function MyComponent(props) {
	return (
	  <div>
		<h1>Hello, {props.name}!</h1>
		<p>Good to see you</p>
	  </div>
	);
  }`;

export function Component(): JSX.Element {
  return (
    <CodeBlock
      aria-label="Hello world"
      filename="hidden-line-numbers.jsx"
      hideLineNumbers
      language="jsx"
    >
      {code}
    </CodeBlock>
  );
}
```

## Open in v0

Use the v0 prop to add an Open in v0 action to the toolbar.

```jsx
function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}
```

```jsx
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
import { CodeBlock } from "@vercel/geistcn/components";
import type { JSX } from "react";

const code = `function MyComponent(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>This is an example React component.</p>
    </div>
  );
}`;

export function Component(): JSX.Element {
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

## Best Practices

### When to use

- Use <CodeBlock> for multi-line, syntax-highlighted source the reader will scan or paste.

- For a single inline token (env var, function name, file path), use Inline Code.

- Pick Snippet for a copy-to-clipboard shell command or one-line key reveal; it ships with the prompt glyph and copy affordance built in.

### Behavior

- Always pass a language/syntax (tsx, bash, json, diff). Highlighting is the primary reason to choose <CodeBlock> over a plain <pre>.

- Highlight only the lines under discussion. A block where every line is highlighted reads the same as no highlight at all.

- Mark added or removed lines with the diff syntax or the dedicated added/removed props. Faking them with // added comments breaks copy-paste.

- Show the filename header when the snippet has a paste destination (app/page.tsx, vercel.json). Omit it for ephemeral examples.

### Content

- Snippets stay runnable. Don’t paraphrase real code into pseudo-syntax, and don’t prepend $ to shell commands. <Snippet> already renders the prompt, so text="$ vercel deploy" doubles to $ $ vercel deploy.

- Keep prose around the block in sentence case and put backticks around CLI flags inline (`--prebuilt`).

Was this helpful?
