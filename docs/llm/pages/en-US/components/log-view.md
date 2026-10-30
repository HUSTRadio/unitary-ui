# Log View

> Route: `/components/log-view`

Render caller-owned log entries with severity filtering, copy and export, and follow the newest line until the reader scrolls up.

[Back to Components](#/components)

# Log View

log-view

Render caller-owned log entries with severity filtering, copy and export, and follow the newest line until the reader scrolls up.

## When to use

- Build, deploy or task output needs line-by-line reading with quick severity narrowing.
- The visible log should be copyable or exportable as a text file.
- The entry count is bounded (hundreds of lines); the first version does not virtualise.

## When not to use

- Structured events that need sorting or column filtering belong to DataTable.
- Single-task progress and status belong to Task; build badges belong to StatusDot.
- Hundreds of thousands of lines that need virtual scrolling wait for a dedicated effort.

## Examples

### Follow and pause

Appending sticks to the bottom; scrolling up pauses following and reveals Jump to latest, while filtering keeps the minimum severity.

## Accessibility

Not applicable: Accessibility work is out of scope this round: LogView declares no ARIA role or aria-live region for the log surface, and expresses filtering and follow state through visible controls and data attributes. Announcement strategy stays with the caller.

## Controlled behavior

- entries are fully controlled: the component never sorts, merges, appends or fetches.
- level supports both modes: passing level makes it authoritative and reports changes through onLevelChange; omitting it uses defaultLevel plus internal state.
- Copy and export act on the visible rows; pass onExport to take the text, otherwise a text file downloads.
- Following is derived from the scroll position: at the bottom it follows, scrolling up pauses it, and Jump to latest restores it.

## Responsive behavior

- The header wraps with flex-wrap, so actions move to a new line instead of squeezing the title.
- The scroll viewport keeps a fixed height (320px by default, or any CSS length).
- The message column uses whitespace-pre-wrap with break-words: long lines wrap instead of truncating and keep their indentation.

## Theme behavior

- The viewport uses background-200 with a gray-alpha-300 edge, and levels reuse text-gray-1000, gray-700, button-warning and error-foreground semantic colors.
- Active filter buttons use gray-alpha-300, so both themes follow without new color tokens.

## Live Demo

Build log

- 10:00:01inforequest 1 completed
- 10:00:02inforequest 2 completed
- 10:00:03debugrequest 3 completed
- 10:00:04warnrequest 4 completed
- 10:00:05inforequest 5 completed
- 10:00:06debugrequest 6 completed
- 10:00:07errorrequest 7 failed: upstream timeout
- 10:00:08warnrequest 8 completed
- 10:00:09debugrequest 9 completed
- 10:00:10inforequest 10 completed
- 10:00:11inforequest 11 completed
- 10:00:12warnrequest 12 completed
- 10:00:13inforequest 13 completed
- 10:00:14errorrequest 14 failed: upstream timeout
- 10:00:15debugrequest 15 completed
- 10:00:16warnrequest 16 completed
- 10:00:17inforequest 17 completed
- 10:00:18debugrequest 18 completed
- 10:00:19inforequest 19 completed
- 10:00:20warnrequest 20 completed
- 10:00:21errorrequest 21 failed: upstream timeout
- 10:00:22inforequest 22 completed
- 10:00:23inforequest 23 completed
- 10:00:24warnrequest 24 completed
- 10:00:25inforequest 25 completed
- 10:00:26inforequest 26 completed
- 10:00:27debugrequest 27 completed
- 10:00:28errorrequest 28 failed: upstream timeout
- 10:00:29inforequest 29 completed
- 10:00:30debugrequest 30 completed
- 10:00:31inforequest 31 completed
- 10:00:32warnrequest 32 completed
- 10:00:33debugrequest 33 completed
- 10:00:34inforequest 34 completed
- 10:00:35errorrequest 35 failed: upstream timeout
- 10:00:36warnrequest 36 completed
- 10:00:37inforequest 37 completed
- 10:00:38inforequest 38 completed
- 10:00:39debugrequest 39 completed
- 10:00:40warnrequest 40 completed

```tsx
import { useState } from "react";
import { Button, LogView, type LogEntry } from "@hustradio/unitary-ui";

const seed: LogEntry[] = Array.from({ length: 40 }, (_, index) => {
  const step = index + 1;
  const level =
    step % 7 === 0 ? "error" : step % 4 === 0 ? "warn" : step % 3 === 0 ? "debug" : "info";
  return {
    id: String(step),
    level,
    time: `10:00:${String(step).padStart(2, "0")}`,
    message:
      level === "error" ? `request ${step} failed: upstream timeout` : `request ${step} completed`,
  } as LogEntry;
});

export function LogViewFollowA17B53C9Example() {
  const [entries, setEntries] = useState(seed);

  const append = () =>
    setEntries((previous) => {
      const step = previous.length + 1;
      return [
        ...previous,
        {
          id: String(step),
          level: step % 5 === 0 ? "error" : "info",
          time: `10:00:${String(step).padStart(2, "0")}`,
          message:
            step % 5 === 0
              ? `request ${step} failed: upstream timeout`
              : `request ${step} completed`,
        },
      ];
    });

  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button type="secondary" size="small" onClick={append}>
          Append log
        </Button>
        <Button type="tertiary" size="small" onClick={() => setEntries(seed)}>
          Reset
        </Button>
      </div>
      <LogView
        entries={entries}
        title="Build log"
        height={200}
        emptyLabel="No build output yet"
        onExport={(text) => {
          void text;
        }}
      />
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { LogView, LOG_LEVELS, formatLogLine, logEntriesToText } from "@hustradio/unitary-ui";
```

Also accepts props defined by: `ComponentProps<"div">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">entries</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">LogEntry[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Caller-owned rows, rendered in the given order.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">level</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"all" | LogLevel</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled minimum-severity filter.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultLevel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"all" | LogLevel</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial filter when level is omitted.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"all"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onLevelChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(level) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports a filter change from the built-in controls.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">height</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Viewport height; numbers are px.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">320</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Header label for the viewer.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">emptyLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Copy shown when no rows are visible.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">clipboard</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">{ writeText }</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Injection point for copying; defaults to navigator.clipboard.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onExport</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(text, entries) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Takes the exported text instead of downloading a file.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">exportFileName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Download file name when onExport is absent.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"logs.txt"</td></tr></tbody></table>

## Best Practices

- Pass entries in the order you want them shown; LogView never sorts, merges or fetches.
- Keep ids stable per line so new entries append instead of remounting the whole list.
- Filtering is by minimum severity: choosing Warn keeps warnings and errors.
- Auto-follow pauses as soon as the reader scrolls up; never force the viewport back while they read history.
- Cap the entry count in the caller; the first version renders every visible row without virtualisation.
