# Search Input

> Route: `/components/search-input`

A text input with a search icon for entering a query.

[Back to Components](#/components)

# Search Input

search-input

A text input with a search icon for entering a query.

## When to use

- When users need to enter text queries that drive result filtering.
- When you want an input control with a visible search icon prefix for instant visual recognition.

## When not to use

- For ordinary form text entry such as names or email addresses; use the generic Input component instead.
- When only static text display is needed; do not use an interactive input control for that purpose.

## Examples

### Basic search input

The simplest use of SearchInput with a default magnifying-glass icon prefix and placeholder text.

### Search input with loading indicator

Shows a loading state while search results are updating, providing real-time feedback to the user.

## Accessibility

- The input carries semantic type (role=search) and an accessible name so screen readers understand its purpose.
- Should be associated with a visible label or equivalent accessible name for full contextual announcement.

## Controlled behavior

Not applicable: The parent manages the query through value and onChange.

## Responsive behavior

- Adapts its width fluidly across viewport sizes while maintaining an adequate hit area for tapping.

## Theme behavior

- Colors invert gracefully in dark mode and can stay consistent with overall brand theming.

## Live Demo

```tsx
import { SearchInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SearchInputDefault37A8EEC1Example() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## With cmdk

⌘K

```tsx
import { SearchInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SearchInputWithCmdkC25FADFBExample() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      cmdk
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## Disabled

⌘K

```tsx
import { SearchInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SearchInputDisabled17EB3C01Example() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      cmdk
      disabled
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## Loading

Loading...

```tsx
import { SearchInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SearchInputLoadingB4A070A2Example() {
  const [value, setValue] = useState("Project A");

  return (
    <SearchInput
      aria-label="Search"
      loading
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      value={value}
    />
  );
}
```

## Custom prefix

```tsx
import { Sparkles } from "lucide-react";
import { SearchInput } from "@hustradio/unitary-ui";
import { useState } from "react";

export function SearchInputCustomPrefix3441EADCExample() {
  const [value, setValue] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      onChange={(e) => {
        setValue(e.target.value);
      }}
      placeholder="Enter some text..."
      prefix={<Sparkles className="size-4" aria-hidden />}
      value={value}
    />
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { SearchInput } from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled query.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">React.ChangeEventHandler&lt;HTMLInputElement&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives native input change events.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">cmdk</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows the Command-K hint while empty.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Replaces the search icon with a spinner.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Custom leading content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Search Input for query-driven filtering, not for ordinary form text entry.
- Provide a visible label or an equivalent accessible name and preserve the query while results update.
