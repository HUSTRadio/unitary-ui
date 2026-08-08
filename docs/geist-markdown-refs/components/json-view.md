# JSON View

Render JSON objects and arrays as a collapsible tree with syntax coloring, keyboard navigation, search highlighting, and selectable text.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Single line**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Wrapped**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Collapsed**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
> - **Highlighted**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Single line**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Wrapped**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Collapsed**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
> - **Highlighted**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a

<!-- GEIST-RENDER-METRICS-END -->

## Default

JSON View expands levels strictly below defaultExpandDepth. Use defaultExpandDepth={1} when the first level helps users scan the object without opening every nested value.

```tsx
import { JsonView } from "@vercel/geistcn/components";
import type { JSX } from "react";

const data = {
  deployment: {
    id: "dpl_9WjH8QFQySx7",
    project: "docs",
    target: "production",
    state: "ready",
  },
  request: {
    method: "GET",
    path: "/api/search",
    status: 200,
    durationMs: 42,
  },
  cached: false,
  error: null,
};

export function Component(): JSX.Element {
  return <JsonView data={data} defaultExpandDepth={1} />;
}
```

## Single line

Expanded objects with one short primitive key-value pair render on one line. Nested and long values remain multiline.

```tsx
import { JsonView } from "@vercel/geistcn/components";
import type { JSX } from "react";

const data = {
  foo: "bar",
};

export function Component(): JSX.Element {
  return <JsonView data={data} defaultExpandDepth={1} />;
}
```

## Wrapped

Long primitive values use the multiline layout and wrap within the available width.

```tsx
import { JsonView } from "@vercel/geistcn/components";
import type { JSX } from "react";

const data = {
  browserApiUrl:
    "https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fprocore-com-prod-f5vem4o6u-marketing-web-dev.vercel.app&width=1440&height=900&fullPage=true",
};

export function Component(): JSX.Element {
  return <JsonView data={data} defaultExpandDepth={1} />;
}
```

## Collapsed

Use defaultExpandDepth={0} when the surrounding surface needs to stay compact and users can choose which object to inspect.

```tsx
import { JsonView } from "@vercel/geistcn/components";
import type { JSX } from "react";

const data = {
  trace: {
    spanId: "span_7Qk9b4",
    parentId: "span_root",
    service: "api",
  },
  request: {
    id: "req_00042",
    path: "/api/projects",
    method: "GET",
  },
  flags: ["enable-logs-json-rendering", "observability-panel"],
};

export function Component(): JSX.Element {
  return <JsonView data={data} defaultExpandDepth={0} />;
}
```

## Highlighted

Use makeJsonViewHighlightPattern to build the highlightPattern prop from search terms. The pattern highlights matching field names and primitive values.

```tsx
import { JsonView, makeJsonViewHighlightPattern } from "@vercel/geistcn/components";
import type { JSX } from "react";

const data = {
  level: "error",
  requestId: "req_00042",
  deploymentId: "dpl_9WjH8QFQySx7",
  message: "Deployment request failed",
  statusCode: 500,
};

const highlightPattern = makeJsonViewHighlightPattern(["request", "failed"]);

export function Component(): JSX.Element {
  return <JsonView data={data} defaultExpandDepth={1} highlightPattern={highlightPattern} />;
}
```

## Best Practices

### When to use

- Use JSON View for JSON objects or arrays that users need to inspect, scan, collapse, expand, select, or copy.

- Prefer JSON View over a raw JSON string when nested structure matters or when log lines contain structured payloads.

- Use a regular code block when the value is static documentation, not an interactive product surface.

### Behavior

- Start with defaultExpandDepth={1} for log and detail surfaces where the top-level fields are useful by default.

- Use defaultExpandDepth={0} for dense tables, compact previews, or rows where expanded JSON would compete with primary row content.

- Pass highlightPattern only for active search states. Leave it null when nothing is being searched.

- Keep the source data as an object or array. Do not pre-stringify JSON before passing it to data.

### Accessibility

- JSON View renders as a tree. Arrow keys move between visible nodes, Enter and Space toggle expandable nodes, and Home and End move to the first and last visible node.

- Keep the component near the text or control that introduces the JSON. The accessible tree label is JSON, so surrounding context should identify the object.

- Preserve selectable text. Users often copy JSON from logs or traces into search, support, or debugging tools.

Was this helpful?
