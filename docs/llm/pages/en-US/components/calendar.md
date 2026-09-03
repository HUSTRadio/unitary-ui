# Calendar

> Route: `/components/calendar`

Displays a month calendar from which users can pick a date.

[Back to Components](#/components)

# Calendar

Calendar

Displays a month calendar from which users can pick a date.

## When to use

- Pick Calendar for analytics ranges and any picker where day-of-week and month context matter.
- Set min and max to the data window so users can't pick outside the retention range.
- Default to the user's locale and timezone; never silently render UTC for a US-Pacific viewer.

## When not to use

- For a single time-of-day pick without month context, use a lighter time input instead.
- Don't embed Calendar as a read-only monthly display in content flow — its semantic role is a picker.

## Examples

### Default calendar

A standard single-month date picker.

### Presets

Offers preset entries for common ranges to cut repetitive selection cost.

### Min/max range

Constrains selectable dates to the data window via min and max.

### Pinned timezone

Pins the calendar to a specific timezone to avoid cross-timezone ambiguity.

## Accessibility

- The date table exposes selection through gridcell and aria-selected. Date cells currently support click selection only; Arrow-key traversal and Enter confirmation are not implemented.
- Add the missing keyboard interaction at the application layer, or use a date picker with roving focus when a complete keyboard grid is required.

## Controlled behavior

- Calendar stores the selected range internally. Presets, Apply, and date clicks update that state and report the result through onChange.
- There is no external value/defaultValue selection contract; month paging is internal view state as well.

## Responsive behavior

- Horizontal, compact, and stacked layouts adapt the calendar to different container widths.
- Prefer the compact layout on small viewports to reduce vertical footprint.

## Theme behavior

- Today highlight, selection, and disabled-day colors all follow theme variables.
- Selected dates keep sufficient contrast in dark mode.

## Live Demo

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" />;
```

## Horizontal Layout

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" horizontalLayout />;
```

## Sizes

small

Combobox Menu

Combobox Menu

Combobox Menu

default / medium

Combobox Menu

Combobox Menu

Combobox Menu

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" size="small" />
<Calendar label="Select Date Range" />
```

## Presets

Combobox Menu

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  showCombobox
  comboboxFirst
  comboboxFull
  comboboxWide
  comboboxLabel="Combobox Menu"
  comboboxPlaceholder="Select Period"
  presets={{
    "last-7-days": {
      text: "Last 7 Days",
      start: new Date(2026, 7, 14),
      end: new Date(2026, 7, 21),
    },
  }}
/>;
```

## Compact

Combobox Menu

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  compact
  comboboxLabel="Combobox Menu"
  presets={{
    "last-7-days": {
      text: "Last 7 Days",
      start: new Date(2026, 7, 14),
      end: new Date(2026, 7, 21),
    },
  }}
/>;
```

## Stacked

Combobox Menu

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  stacked
  comboboxLabel="Combobox Menu"
  comboboxPlaceholder="Select Period"
  presets={{
    "last-7-days": {
      text: "Last 7 Days",
      start: new Date(2026, 7, 14),
      end: new Date(2026, 7, 21),
    },
  }}
/>;
```

## Default Preset

Combobox Menu

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar
  label="Select Date Range"
  showCombobox
  comboboxFirst
  comboboxFull
  comboboxWide
  comboboxLabel="Combobox Menu"
  comboboxPlaceholder="Select Period"
  presets={{
    "last-7-days": {
      text: "Last 7 Days",
      start: new Date(2026, 7, 14),
      end: new Date(2026, 7, 21),
    },
  }}
  presetIndex={0}
/>;
```

## Date Bounds

```tsx
import { Calendar } from "@/components/ui/calendar";

const now = new Date();
const minDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());
const maxDate = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

<Calendar label="Select Date Range" minValue={minDate} maxValue={maxDate} />;
```

## Pinned Timezone

```tsx
import { Calendar } from "@/components/ui/calendar";

<Calendar label="Select Date Range" pinnedTimezone="America/Los_Angeles" />;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Calendar } from "@/components/ui/calendar";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(range: CalendarDateRange) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Called after a valid range selection changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">presets</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">Record&lt;string, CalendarPreset&gt;</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Named date ranges for the optional preset picker.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">horizontalLayout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Places range inputs beside the month grid on wide surfaces.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr></tbody></table>

## Best Practices

- Pick Calendar for analytics ranges and any picker where day-of-week and month context matter.
- Set min and max to the data window so users can't pick outside the retention range.
- Default to the user's locale and timezone; never silently render UTC for a US-Pacific viewer.
