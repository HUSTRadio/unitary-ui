# JsonView

> Route: `/components/json-view`

Renders JSON as a syntax-highlighted tree.

[Back to Components](#/components)

# JsonView

JsonView

Renders JSON as a syntax-highlighted tree.

## When to use

- When users need to inspect, browse, or collapse and expand JSON objects or arrays; interactive viewing is the core requirement.
- As part of a product interface presenting API response data, allowing users to explore the data structure layer by layer.

## When not to use

- When the value is static documentation rather than an interactive product surface, use a regular code block; JSON View's interactivity would be unnecessary overhead.
- Keep the source data as an object or array. Do not pre-stringify JSON before passing it to data.

## Examples

### Single line

Collapse the entire JSON object to a single line for quick preview of small data structures or situations where brevity is key.

### Wrapped

Long key names and values auto-wrap at container edges, avoiding horizontal scrollbars, ideal for compact layouts within wide tables.

### Collapsed state

Deeply nested nodes are collapsed by default to reduce initial render cost; users can progressively expand branches of interest for efficient browsing of large data structures.

### Highlighted path

Highlight specific key paths within the JSON tree to help users quickly locate and analyze important fields in the data.

## Accessibility

- Expandable and collapsible nodes in JSON View support keyboard navigation; users can traverse the entire data structure with arrow keys and Enter.
- Every node has semantic roles and labels so screen readers can correctly announce hierarchy and key-value information.

## Controlled behavior

- Control which nodes are expanded by default using defaultExpandedDepth or controlled expandedKeys, precisely controlling the tree's initial view.
- The data prop accepts JavaScript objects or arrays; the component manages expand/collapse state internally and can expose change callbacks externally.

## Responsive behavior

- The JSON tree automatically adjusts indentation and font size across viewports to remain readable on small screens without triggering unnecessary horizontal scrolling.
- The container's max height adjusts with viewport changes, enabling vertical scrolling when content exceeds the visible area.

## Theme behavior

- Syntax highlighting color scheme follows theme tokens, distinguishing strings, numbers, booleans, nulls, and key names.
- Dark mode adjusts all color contrasts to meet accessibility requirements.

## Live Demo

```tsx
{deployment: { … },cached: false,durationMs: 42}
```

## Single line

```tsx
{
  foo: "bar";
}
```

```tsx
import { JsonView } from "@/components/ui/json-view";

const data = {
  foo: "bar",
};

<JsonView data={data} defaultExpandDepth={1} />;
```

## Wrapped

```tsx
{
  browserApiUrl: "https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fprocore-com-prod-f5vem4o6u-marketing-web-dev.vercel.app&width=1440&height=900&fullPage=true";
}
```

```tsx
import { JsonView } from "@/components/ui/json-view";

const data = {
  browserApiUrl:
    "https://browser-api.vercel.sh/screenshot?url=https%3A%2F%2Fprocore-com-prod-f5vem4o6u-marketing-web-dev.vercel.app&width=1440&height=900&fullPage=true",
};

<JsonView data={data} defaultExpandDepth={1} />;
```

## Collapsed

```tsx
{ … }
```

```tsx
import { JsonView } from "@/components/ui/json-view";

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

<JsonView data={data} defaultExpandDepth={0} />;
```

## Highlighted

```tsx
{level: "error",requestId: "req_00042",deploymentId: "dpl_9WjH8QFQySx7",message: "Deployment request failed",statusCode: 500}
```

```tsx
import { JsonView, makeJsonViewHighlightPattern } from "@/components/ui/json-view";

const data = {
  level: "error",
  requestId: "req_00042",
  deploymentId: "dpl_9WjH8QFQySx7",
  message: "Deployment request failed",
  statusCode: 500,
};

const highlightPattern = makeJsonViewHighlightPattern(["request", "failed"]);

<JsonView data={data} defaultExpandDepth={1} highlightPattern={highlightPattern} />;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { JsonView, makeJsonViewHighlightPattern } from "@/components/ui/json-view";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">data</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">unknown</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Data to render as a JSON tree.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultExpandDepth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial expansion depth; zero collapses the root.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">highlightPattern</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">RegExp | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Highlights matching keys and primitive values.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use JSON View for JSON objects or arrays that users need to inspect, scan, collapse, expand, select, or copy.
- Use a regular code block when the value is static documentation, not an interactive product surface.
- Keep the source data as an object or array. Do not pre-stringify JSON before passing it to data.
