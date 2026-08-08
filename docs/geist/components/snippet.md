# Snippet

Display a snippet of copyable code for the command line.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "npm init next-app" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#171717
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:6px
> - **Inverted**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "npm init next-app" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#f2f2f2
>   .outline-none · h:32px · 500 14px/21px · fg:#f2f2f2 · r:6px
> - **Multi line**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "cd project" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#171717
>   "now" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#171717
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:6px
> - **No prompt**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "npm init next-app" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#171717
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:6px
> - **Callback**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "npm init next-app" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#171717
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:6px
> - **Variants**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "npm init next-app" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#0068d6
>   .outline-none · h:32px · 500 14px/21px · fg:#0068d6 · r:6px
> - **Controlled Copied State**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Copy install prompt" · .cursor-pointer · h:42px · 400 16px/24px · fg:#171717
>   "Copy install prompt" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#171717
>   .outline-none · h:32px · 500 14px/21px · fg:#171717 · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "npm init next-app" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#ededed
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:6px
> - **Inverted**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "npm init next-app" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#1a1a1a
>   .outline-none · h:32px · 500 14px/21px · fg:#1a1a1a · r:6px
> - **Multi line**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "cd project" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#ededed
>   "now" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#ededed
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:6px
> - **No prompt**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "npm init next-app" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#ededed
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:6px
> - **Callback**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "npm init next-app" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#ededed
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:6px
> - **Variants**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "npm init next-app" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#52a8ff
>   .outline-none · h:32px · 500 14px/21px · fg:#52a8ff · r:6px
> - **Controlled Copied State**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Copy install prompt" · .cursor-pointer · h:42px · 400 16px/24px · fg:#ededed
>   "Copy install prompt" · .geist-overflow-scroll-y · h:20px · 400 13px/20px · fg:#ededed
>   .outline-none · h:32px · 500 14px/21px · fg:#ededed · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

```
npm init next-app
```

```tsx
import { Snippet } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Snippet text="npm init next-app" width="300px" />;
}
```

## Inverted

```
npm init next-app
```

```tsx
import { Snippet } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Snippet dark text="npm init next-app" width="300px" />;
}
```

## Multi line

```
cd project
```

```
now
```

```tsx
import { Snippet } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Snippet text={["cd project", "now"]} width="100%" />;
}
```

## No prompt

```
npm init next-app
```

```tsx
import { Snippet } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return <Snippet prompt={false} text="npm init next-app" width="300px" />;
}
```

## Callback

```
npm init next-app
```

```tsx
import { Snippet } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
  return (
    <Snippet onCopy={() => alert("You copied the text!")} text="npm init next-app" width="300px" />
  );
}
```

## Variants

```
npm init next-app
```

```
npm init next-app
```

```
npm init next-app
```

```tsx
import { Snippet } from "@vercel/geistcn/components";
import type { JSX } from "react";

export function Component(): JSX.Element {
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

Use the copied prop to control the copy button animation externally. This lets you copy different text (e.g. from a context card) while reusing the snippet's checkmark feedback.

```
Copy install prompt
```

```tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { Snippet, ContextCardTrigger } from "@vercel/geistcn/components";
import type { JSX } from "react";

const COPY_TEXT = `# About
Template for a full-featured Next.js AI chatbot

# Requirements
This template uses the Vercel AI Gateway to access multiple AI models through a unified interface. The default model is OpenAI GPT-4.1 Mini, with support for Anthropic, Google, and xAI models.`;

export function Component(): JSX.Element {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleCopy = useCallback(() => {
    void navigator.clipboard.writeText(COPY_TEXT);
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 1000);
  }, []);

  return (
    <ContextCardTrigger
      content={<div className="text-copy-13-mono w-96 whitespace-pre-line">{COPY_TEXT}</div>}
      side="top"
    >
      {/* <div> since we don't want to wrap a button around a button */}
      <div
        role="button"
        tabIndex={0}
        aria-label="copy content"
        onClick={handleCopy}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCopy();
          }
        }}
        className="cursor-pointer"
      >
        <Snippet copied={copied} text="Copy install prompt" prompt={false} width="300px" />
      </div>
    </ContextCardTrigger>
  );
}
```

## Best Practices

- Use Snippet for a runnable shell command the user is meant to copy. For inline tokens (env var names, paths) use InlineCode, and for multi-line source use CodeBlock.

- Pass the command as text. Authors never type a leading $; the component renders the prompt, so text="$ vercel deploy" displays as $ $ vercel deploy.

- Set prompt={false} for non-shell content (URLs, JSON, output you want copied verbatim) so the rendered string matches what gets copied.

- Pair placeholder with text="" for an empty state. Sentence case, no trailing period, no Please: Run vercel link to fetch env vars. The placeholder is informational, not copied.

- Use copyText only when text contains rich nodes (<span> highlights, conditional fragments) and the clipboard payload should be plain text. For a string text, copyText is redundant.

- Keep one command per Snippet. Pass an array to text for a short multi-line block; for longer scripts, switch to CodeBlock so users can read before they copy.

- Use copied plus an onCopy callback when a parent surface (a card, a tooltip) needs to show the same checkmark feedback while copying different text.

Was this helpful?
