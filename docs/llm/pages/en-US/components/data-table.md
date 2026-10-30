# Data Table

> Route: `/components/data-table`

Render caller-owned rows through typed columns with loading, empty and error states.

[Back to Components](#/components)

# Data Table

data-table

Render caller-owned rows through typed columns with loading, empty and error states.

## When to use

- The same records are read across several columns, each with its own renderer (link, badge, numeric alignment).
- Rows need a stable identity so the list does not reorder or rebuild cells.
- Loading, empty and error need the same table skeleton instead of three ad-hoc layouts.

## When not to use

- A few key-value pairs belong to Description; a single-column list belongs to Bar List.
- Sorting, selection, editing or virtual scrolling should wait for those capabilities; v1 only presents.
- Complex header merges or spans are better composed directly with Table.

## Examples

### Columns and the four states

columns define headers and cells, rows plus getRowKey define the data; switch loading, empty and error to see the states stay exclusive.

## Accessibility

Not applicable: Accessibility work is out of scope this round: DataTable reuses the semantic table structure from Table and declares no aria-sort, selection state or keyboard grid navigation, which stay with a dedicated table-interaction effort.

## Controlled behavior

- rows are fully controlled: the component never copies, sorts, filters or fetches them.
- loading wins over error and error wins over empty; all three are explicit props rather than inferred from an empty array.
- getRowKey(row, index) runs once per row, and stable keys keep row nodes identical across renders.
- onRowClick only reports the row and index; selection and navigation stay with the caller.

## Responsive behavior

- The container uses w-full min-w-0, so the table stretches with its parent instead of breaking the grid.
- Column widths accept numbers or CSS lengths through colgroup; without them Table distributes space.
- Skeleton and message rows reuse the same column count, so the header never jumps between states.

## Theme behavior

- Appearance is forwarded to Table through colorScheme (basic, striped, bordered, interactive) and every color comes from existing semantic tokens.
- Skeleton blocks use gray-alpha-300 and stop pulsing under motion-reduce.

## Live Demo

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><caption class="mt-4 text-copy-13 text-muted-foreground">Build artifacts</caption><colgroup class=""><col class=""><col class="" style="width: 120px;"><col class="" style="width: 160px;"></colgroup><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400" data-header-row=""><tr class="transition-colors data-[state=selected]:bg-gray-100"><th scope="col" class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Artifact</th><th scope="col" class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">Size</th><th scope="col" class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">Updated</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200"><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="0"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">unitary-ui-0.1.0-beta.1.tgz</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">1.2 MB</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">2 minutes ago</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="1"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">unitary-ui.css</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">643 kB</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">2 minutes ago</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="2"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">types.tar.gz</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">310 kB</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">5 minutes ago</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="3"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">fonts.zip</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">25.2 MB</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right align-middle">yesterday</td></tr></tbody></table>

```tsx
import { useState } from "react";
import { Button, DataTable, type DataTableColumn } from "@hustradio/unitary-ui";

interface Artifact {
  id: string;
  name: string;
  size: string;
  updated: string;
}

const rows: Artifact[] = [
  { id: "a", name: "unitary-ui-0.1.0-beta.1.tgz", size: "1.2 MB", updated: "2 minutes ago" },
  { id: "b", name: "unitary-ui.css", size: "643 kB", updated: "2 minutes ago" },
  { id: "c", name: "types.tar.gz", size: "310 kB", updated: "5 minutes ago" },
  { id: "d", name: "fonts.zip", size: "25.2 MB", updated: "yesterday" },
];

const columns: DataTableColumn<Artifact>[] = [
  { id: "name", header: "Artifact", cell: (row) => row.name },
  { id: "size", header: "Size", cell: (row) => row.size, align: "right", width: 120 },
  { id: "updated", header: "Updated", cell: (row) => row.updated, align: "right", width: 160 },
];

type DemoState = "ready" | "loading" | "empty" | "error";

export function DataTableBasic4E2D81B7Example() {
  const [state, setState] = useState<DemoState>("ready");

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {(["ready", "loading", "empty", "error"] as DemoState[]).map((option) => (
          <Button
            key={option}
            type={state === option ? "default" : "tertiary"}
            size="tiny"
            onClick={() => setState(option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <DataTable<Artifact>
        caption="Build artifacts"
        columns={columns}
        rows={state === "empty" ? [] : rows}
        getRowKey={(row) => row.id}
        colorScheme="striped"
        headerRow
        loading={state === "loading"}
        loadingRows={3}
        empty="No artifacts have been published yet."
        error={
          state === "error"
            ? "Could not load artifacts. Retry when the network recovers."
            : undefined
        }
      />
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import { DataTable } from "@hustradio/unitary-ui";
```

Also accepts props defined by: `ComponentProps<"div">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columns</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">DataTableColumn&lt;T&gt;[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Typed column definitions with id, header and cell renderer.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rows</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">readonly T[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Caller-owned rows, rendered in the given order.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">getRowKey</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(row, index) =&gt; Key</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Stable row identity.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">caption</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Optional table caption.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loading</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders skeleton rows instead of data.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">loadingRows</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Skeleton row count while loading.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">3</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Renders one spanning message row; wins over empty and rows.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">empty</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Message for an empty row set.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">colorScheme</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"basic" | "striped" | "bordered" | "interactive"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Appearance passed to Table.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">headerRow</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Marks the header row as row headers (scope=col).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">headerCol</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Marks the first column as row headers.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">columnDividers</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Adds inline-start dividers between cells.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rowHeight</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number | "auto"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Fixed row height or content-driven height.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">align</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">MaybeAlign</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Default cell alignment for the table.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">frame</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"outline" | "none"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Container frame passed to TableRoot.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">rowClassName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(row, index) =&gt; string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Per-row class hook.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onRowClick</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(row, index) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Row click callback; adds a pointer cursor.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Pass rows as the single source of truth and provide getRowKey; DataTable never sorts, filters or paginates.
- Keep column ids stable so cells keep their identity across renders.
- Treat loading, empty and error as explicit props instead of inferring them from an empty array.
- Compose pagination, sorting and selection in the caller; DataTable v1 stays a presentation layer.
