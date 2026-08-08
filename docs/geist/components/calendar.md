# Calendar

Displays a calendar from which users can select a date or range of dates.

<!-- GEIST-RENDER-METRICS-START -->

> **渲染参数（官方页面实测）**
>
> **Light 主题**
>
> - **Default**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:6px
> - **Horizontal Layout**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:6px
> - **Sizes**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Select Date Range" · .outline-none · h:32px · pad:0px 6px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:6px
>   .peer/comboboxInput · h:32px · pad:0px 0px 0px 8px · 400 14px/21px · bg:#ffffff · r:0px 5px 5px 0px
>   .peer/comboboxInput · h:32px · pad:0px 0px 0px 34px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:5px 5px 0px 0px
>   .peer/comboboxInput · h:36px · pad:0px 0px 0px 8px · 400 14px/21px · bg:#ffffff · r:0px 5px 5px 0px
> - **Presets**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .peer/comboboxInput · h:36px · pad:0px 0px 0px 36px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:5px 0px 0px 5px
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:0px 5px 5px 0px
> - **Compact**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:5px 0px 0px 5px
>   .peer/comboboxInput · h:36px · pad:0px 0px 0px 8px · 400 14px/21px · bg:#ffffff · r:0px 5px 5px 0px
> - **Stacked**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .peer/comboboxInput · h:36px · pad:0px 0px 0px 36px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:5px 5px 0px 0px
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:0px 0px 5px 5px
> - **Presets with default value**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   .peer/comboboxInput · h:36px · pad:0px 0px 0px 36px · 400 14px/21px · fg:#171717 · bg:#ffffff · r:5px 5px 0px 0px
>   "Jul 25 - Aug 8" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#171717 · bg:#ffffff · r:0px 0px 5px 5px
> - **Min and max dates**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:6px
> - **Pinned timezone**
>   容器 b:1px solid rgba(0, 0, 0, 0.08) · 容器 r:8px · 容器 bg:#ffffff
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#ffffff · r:6px
>
> **Dark 主题**
>
> - **Default**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:6px
> - **Horizontal Layout**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:6px
> - **Sizes**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Select Date Range" · .outline-none · h:32px · pad:0px 6px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:6px
>   .peer/comboboxInput · h:32px · pad:0px 0px 0px 8px · 400 14px/21px · bg:#0a0a0a · r:0px 5px 5px 0px
>   .peer/comboboxInput · h:32px · pad:0px 0px 0px 34px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:5px 5px 0px 0px
>   .peer/comboboxInput · h:36px · pad:0px 0px 0px 8px · 400 14px/21px · bg:#0a0a0a · r:0px 5px 5px 0px
> - **Presets**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .peer/comboboxInput · h:36px · pad:0px 0px 0px 36px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:5px 0px 0px 5px
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:0px 5px 5px 0px
> - **Compact**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:5px 0px 0px 5px
>   .peer/comboboxInput · h:36px · pad:0px 0px 0px 8px · 400 14px/21px · bg:#0a0a0a · r:0px 5px 5px 0px
> - **Stacked**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .peer/comboboxInput · h:36px · pad:0px 0px 0px 36px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:5px 5px 0px 0px
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:0px 0px 5px 5px
> - **Presets with default value**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   .peer/comboboxInput · h:36px · pad:0px 0px 0px 36px · 400 14px/21px · fg:#ededed · bg:#0a0a0a · r:5px 5px 0px 0px
>   "Jul 25 - Aug 8" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#ededed · bg:#0a0a0a · r:0px 0px 5px 5px
> - **Min and max dates**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:6px
> - **Pinned timezone**
>   容器 b:1px solid rgba(255, 255, 255, 0.14) · 容器 r:8px · 容器 bg:#0a0a0a
>   "Select Date Range" · .outline-none · h:36px · pad:0px 10px · 400 14px/21px · fg:#8f8f8f · bg:#0a0a0a · r:6px

<!-- GEIST-RENDER-METRICS-END -->

## Default

```tsx
import type { DateValue } from "@vercel/geistcn/components";
import { Calendar } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import type { RangeValue } from "@react-types/shared";

export function Component(): JSX.Element {
  const [date, setDate] = useState<RangeValue<DateValue>>();

  const now = new Date();

  const minDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

  const maxDate = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

  return (
    <div className="flex justify-center py-12">
      <Calendar
        allowClear
        isDocsPage
        onChange={setDate}
        value={date}
        minValue={minDate}
        maxValue={maxDate}
      />
    </div>
  );
}
```

## Horizontal Layout

Use horizontalLayout to align content horizontally within the calendar popover.

```tsx
import type { DateValue } from "@vercel/geistcn/components";
import { Calendar } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import type { RangeValue } from "@react-types/shared";

export function Component(): JSX.Element {
  const [date, setDate] = useState<RangeValue<DateValue>>();

  return (
    <div className="flex justify-center py-12">
      <Calendar
        allowClear
        isDocsPage
        onChange={setDate}
        value={date}
        horizontalLayout
        showTimeInput={false}
        popoverAlignment="center"
      />
    </div>
  );
}
```

## Sizes

Choose between medium (default) and small for size.

small

default / medium

```tsx
import type { DateValue } from "@vercel/geistcn/components";
import { Calendar } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import type { RangeValue } from "@react-types/shared";
import { startOfDay, subDays, subWeeks, subMonths, endOfDay } from "date-fns";

export function Component(): JSX.Element {
  const [date, setDate] = useState<RangeValue<DateValue>>();
  const [date2, setDate2] = useState<RangeValue<DateValue>>();

  const now = new Date();

  const minDate = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

  const maxDate = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());

  const presets = {
    "last-3-days": {
      text: "Last 3 Days",
      start: startOfDay(subDays(new Date(), 3)),
      end: endOfDay(new Date()),
    },
    "last-7-days": {
      text: "Last 7 Days",
      start: startOfDay(subWeeks(new Date(), 1)),
      end: endOfDay(new Date()),
    },
    "last-14-days": {
      text: "Last 14 Days",
      start: startOfDay(subWeeks(new Date(), 2)),
      end: endOfDay(new Date()),
    },
    "last-month": {
      text: "Last Month",
      start: startOfDay(subMonths(new Date(), 1)),
      end: endOfDay(new Date()),
    },
  };

  return (
    <div className="py-12 space-y-12">
      <div>
        <p className="text-copy-14 text-gray-900 mb-4 font-mono">small</p>
        <div className="flex flex-wrap items-start gap-x-4 gap-y-12">
          <Calendar
            allowClear
            size="small"
            isDocsPage
            onChange={setDate2}
            value={date2}
            minValue={minDate}
            maxValue={maxDate}
          />
          <Calendar
            allowClear
            compact
            size="small"
            isDocsPage
            onChange={setDate2}
            value={date2}
            minValue={minDate}
            maxValue={maxDate}
            presets={presets}
          />
          <Calendar
            allowClear
            stacked
            size="small"
            isDocsPage
            onChange={setDate2}
            value={date2}
            minValue={minDate}
            maxValue={maxDate}
            presets={presets}
          />
          <Calendar isDocsPage size="small" onChange={setDate} presets={presets} value={date} />
        </div>
      </div>
      <div>
        <p className="text-copy-14 text-gray-900 mb-4 font-mono">default / medium</p>
        <div className="flex flex-wrap items-start gap-x-4 gap-y-12">
          <Calendar
            allowClear
            isDocsPage
            onChange={setDate2}
            value={date2}
            minValue={minDate}
            maxValue={maxDate}
          />
          <Calendar
            allowClear
            compact
            isDocsPage
            onChange={setDate2}
            value={date2}
            minValue={minDate}
            maxValue={maxDate}
            presets={presets}
          />
          <Calendar
            allowClear
            stacked
            isDocsPage
            onChange={setDate2}
            value={date2}
            minValue={minDate}
            maxValue={maxDate}
            presets={presets}
          />
          <Calendar isDocsPage onChange={setDate} presets={presets} value={date} />
        </div>
      </div>
    </div>
  );
}
```

## Presets

Provide common date ranges.

```tsx
import type { DateValue } from "@vercel/geistcn/components";
import { Calendar } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import type { RangeValue } from "@react-types/shared";
import { startOfDay, subDays, subWeeks, subMonths, endOfDay } from "date-fns";

const presets = {
  "last-3-days": {
    text: "Last 3 Days",
    start: startOfDay(subDays(new Date(), 3)),
    end: endOfDay(new Date()),
  },
  "last-7-days": {
    text: "Last 7 Days",
    start: startOfDay(subWeeks(new Date(), 1)),
    end: endOfDay(new Date()),
  },
  "last-14-days": {
    text: "Last 14 Days",
    start: startOfDay(subWeeks(new Date(), 2)),
    end: endOfDay(new Date()),
  },
  "last-month": {
    text: "Last Month",
    start: startOfDay(subMonths(new Date(), 1)),
    end: endOfDay(new Date()),
  },
};

export function Component(): JSX.Element {
  const [date, setDate] = useState<RangeValue<DateValue>>();

  return (
    <div className="flex justify-center py-12">
      <Calendar isDocsPage onChange={setDate} presets={presets} value={date} />
    </div>
  );
}
```

## Compact

```tsx
import type { DateValue } from "@vercel/geistcn/components";
import { Calendar } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import type { RangeValue } from "@react-types/shared";
import { startOfDay, subDays, subWeeks, subMonths, endOfDay } from "date-fns";

const presets = {
  "last-3-days": {
    text: "Last 3 Days",
    start: startOfDay(subDays(new Date(), 3)),
    end: endOfDay(new Date()),
  },
  "last-7-days": {
    text: "Last 7 Days",
    start: startOfDay(subWeeks(new Date(), 1)),
    end: endOfDay(new Date()),
  },
  "last-14-days": {
    text: "Last 14 Days",
    start: startOfDay(subWeeks(new Date(), 2)),
    end: endOfDay(new Date()),
  },
  "last-month": {
    text: "Last Month",
    start: startOfDay(subMonths(new Date(), 1)),
    end: endOfDay(new Date()),
  },
};

export function Component(): JSX.Element {
  const [date, setDate] = useState<RangeValue<DateValue>>();

  return (
    <div className="flex justify-center py-12">
      <Calendar compact isDocsPage onChange={setDate} presets={presets} value={date} />
    </div>
  );
}
```

## Stacked

```tsx
import type { DateValue } from "@vercel/geistcn/components";
import { Calendar } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import type { RangeValue } from "@react-types/shared";
import { startOfDay, subDays, subWeeks, subMonths, endOfDay } from "date-fns";

const presets = {
  "last-3-days": {
    text: "Last 3 Days",
    start: startOfDay(subDays(new Date(), 3)),
    end: endOfDay(new Date()),
  },
  "last-7-days": {
    text: "Last 7 Days",
    start: startOfDay(subWeeks(new Date(), 1)),
    end: endOfDay(new Date()),
  },
  "last-14-days": {
    text: "Last 14 Days",
    start: startOfDay(subWeeks(new Date(), 2)),
    end: endOfDay(new Date()),
  },
  "last-month": {
    text: "Last Month",
    start: startOfDay(subMonths(new Date(), 1)),
    end: endOfDay(new Date()),
  },
};

export function Component(): JSX.Element {
  const [date, setDate] = useState<RangeValue<DateValue>>();

  return (
    <div className="flex justify-center py-12">
      <Calendar isDocsPage onChange={setDate} presets={presets} stacked value={date} />
    </div>
  );
}
```

## Presets with default value

Provide common date ranges with an additional default value.

```tsx
import type { DateValue } from "@vercel/geistcn/components";
import { Calendar } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import type { RangeValue } from "@react-types/shared";
import { startOfDay, subDays, subWeeks, subMonths, endOfDay } from "date-fns";

const presets = {
  "last-3-days": {
    text: "Last 3 Days",
    start: startOfDay(subDays(new Date(), 3)),
    end: endOfDay(new Date()),
  },
  "last-7-days": {
    text: "Last 7 Days",
    start: startOfDay(subWeeks(new Date(), 1)),
    end: endOfDay(new Date()),
  },
  "last-14-days": {
    text: "Last 14 Days",
    start: startOfDay(subWeeks(new Date(), 2)),
    end: endOfDay(new Date()),
  },
  "last-month": {
    text: "Last Month",
    start: startOfDay(subMonths(new Date(), 1)),
    end: endOfDay(new Date()),
  },
};

export function Component(): JSX.Element {
  const [date, setDate] = useState<RangeValue<DateValue>>();

  return (
    <div className="flex justify-center py-12">
      <Calendar
        isDocsPage
        onChange={setDate}
        presetIndex={2}
        presets={presets}
        stacked
        value={date}
      />
    </div>
  );
}
```

## Min and max dates

Provide common date ranges with an additional default value.

```tsx
import type { DateValue } from "@vercel/geistcn/components";
import { Calendar } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import type { RangeValue } from "@react-types/shared";
import { addDays, subDays } from "date-fns";

export function Component(): JSX.Element {
  const [date, setDate] = useState<RangeValue<DateValue>>();
  const minValue = subDays(new Date().setHours(5), 1); // 2 days ago
  const maxValue = addDays(new Date(), 1); // 2 days from now

  return (
    <div className="flex justify-center py-12">
      <Calendar
        isDocsPage
        maxValue={maxValue}
        minValue={minValue}
        onChange={setDate}
        value={date}
      />
    </div>
  );
}
```

## Pinned timezone

Use pinnedTimezone to lock the calendar to a specific timezone. The timezone is shown as read-only text instead of a select.

```tsx
import type { DateValue } from "@vercel/geistcn/components";
import { Calendar } from "@vercel/geistcn/components";
import { useState, type JSX } from "react";
import type { RangeValue } from "@react-types/shared";

export function Component(): JSX.Element {
  const [date, setDate] = useState<RangeValue<DateValue>>();

  return (
    <div className="flex justify-center py-12">
      <Calendar
        isDocsPage
        onChange={setDate}
        pinnedTimezone="America/Los_Angeles"
        popoverAlignment="center"
        value={date}
      />
    </div>
  );
}
```

## Best Practices

### When to use

- Pick <Calendar> for analytics ranges and any picker where day-of-week and month context matter.

- For ISO dates pasted whole or relative shorthand like 7d, use a free-form Input.

- Provide <Calendar.Presets> for the common ranges (Last 7 Days, Month to Date) so users land on the right window in one click.

- Pair a horizontal layout with live results next to the calendar; in narrow surfaces like a sidebar, fall back to the stacked layout.

### Behavior

- Set min and max to the data window so users can’t pick outside the retention range.

- Default to the user’s locale and timezone; never silently render UTC for a US-Pacific viewer.

- Keep the trigger label as the chosen range (Apr 1 – Apr 28, 2026); don’t fall back to Pick a date once a value is committed.

- Persist the selected range when the popover closes and re-opens so users can tweak the end date without re-picking the start.

### Accessibility

- Trap focus inside the popover so Tab cycles day cells and presets instead of the page behind it.

- Support arrow-key day navigation, Shift + arrow for week jumps, and Page Up / Page Down for month jumps.

- Announce range changes through aria-live="polite" so a screen reader hears From Apr 1 to Apr 28 after the second click.

- Each preset is a real button with a Title Case label (Last 30 Days); don’t mark presets as menu items without keyboard handling.

Was this helpful?
