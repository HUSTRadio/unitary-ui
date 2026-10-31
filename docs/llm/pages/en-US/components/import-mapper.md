# Import Mapper

> Route: `/components/import-mapper`

Map parsed source columns onto target fields, validate the mapping and preview rows before submitting.

[Back to Components](#/components)

# Import Mapper

import-mapper

Map parsed source columns onto target fields, validate the mapping and preview rows before submitting.

## When to use

- The user already picked a file and the caller has parsed columns and records; the only decision left is which column feeds which field.
- The user should confirm exactly what will be imported before committing.
- Required fields and duplicate columns need per-field feedback instead of a submit-time surprise.

## When not to use

- Nothing has been parsed yet: read the file first with Upload or a file input.
- You only need a plain form: compose Field directly.
- Cell-level editing or paste correction should wait for the DataTable editing capability.

## Examples

### Mapping, validation and preview

The controlled mapping decides the preview columns; mapping two fields to one column reports duplicates immediately, and clearing a required column blocks submission.

## Accessibility

Not applicable: Accessibility work is out of scope this round: field errors are visible copy inside the Field error area without aria-describedby or aria-invalid wiring, and announcement strategy stays with the caller.

## Controlled behavior

- source and mapping are both controlled inputs: the component never reads files, parses CSV, fetches or caches the mapping.
- Validation is pure: missing required, duplicate column and out-of-range column produce one issue per field, and any issue blocks submission.
- The preview shows only mapped fields and caps rows by previewLimit, while total always reports the source record count.
- Submitting hands resolveImportRows output to onSubmit; pending disables the action and error renders in an ErrorCard.

## Responsive behavior

- The root uses w-full min-w-0 and field rows stack, so narrow widths never squeeze the select.
- The preview reuses DataTable, shrinking with its container and showing one column per mapped field.

## Theme behavior

- Field labels and error copy use the existing gray and error semantic colors, and the select keeps Select's theme behaviour.
- The preview table uses DataTable's striped scheme, driven by semantic tokens in both themes.

## Live Demo

Import contacts

Name \*

Email \*

Note

<table class="w-full caption-bottom border-collapse text-copy-14 text-muted-foreground"><caption class="mt-4 text-copy-13 text-muted-foreground">Preview · 6</caption><colgroup class=""><col class=""><col class=""></colgroup><thead class="[&amp;_tr]:border-b [&amp;_tr]:border-gray-alpha-400" data-header-row=""><tr class="transition-colors data-[state=selected]:bg-gray-100"><th scope="col" class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Name</th><th scope="col" class="h-9 whitespace-nowrap px-2 text-copy-14 font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Email</th></tr></thead><tbody class="[&amp;_td:first-child]:rounded-l-sm [&amp;_td:last-child]:rounded-r-sm [&amp;_tr:where(:nth-child(odd))]:bg-background-200"><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="0"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Ada Lovelace</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">ada@example.com</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="1"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Grace Hopper</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">grace@example.com</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="2"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Alan Turing</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">alan@example.com</td></tr><tr class="transition-colors data-[state=selected]:bg-gray-100" data-row-index="3"><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">Barbara Liskov</td><td class="whitespace-nowrap px-2 py-2.5 text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-left align-middle">barbara@example.com</td></tr></tbody></table>

```tsx
import { useState } from "react";
import { ImportMapper, type ImportField, type ImportMapping } from "@hustradio/unitary-ui";

const source = {
  columns: ["Full name", "Mail", "Remark"],
  records: [
    ["Ada Lovelace", "ada@example.com", "first batch"],
    ["Grace Hopper", "grace@example.com", "first batch"],
    ["Alan Turing", "alan@example.com", "second batch"],
    ["Barbara Liskov", "barbara@example.com", ""],
    ["Edsger Dijkstra", "edsger@example.com", "second batch"],
    ["Ken Thompson", "ken@example.com", ""],
  ],
};

const fields: ImportField[] = [
  { id: "name", label: "Name", required: true },
  { id: "email", label: "Email", required: true },
  { id: "note", label: "Note" },
];

export function ImportMapperMapping3C7F0A15Example() {
  const [mapping, setMapping] = useState<ImportMapping>({ name: 0, email: 1 });
  const [imported, setImported] = useState<number | null>(null);

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <ImportMapper
        title="Import contacts"
        source={source}
        fields={fields}
        mapping={mapping}
        onMappingChange={(next) => setMapping(next)}
        onSubmit={(rows) => setImported(rows.length)}
        previewLimit={4}
      />
      {imported !== null ? (
        <p data-demo-status className="text-copy-13 text-gray-700">
          Imported {imported} rows.
        </p>
      ) : null}
    </div>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import {
  ImportMapper,
  validateImportMapping,
  buildImportPreview,
  resolveImportRows,
  canSubmitImport,
} from "@hustradio/unitary-ui";
```

Also accepts props defined by: `ComponentProps<"div">`

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">source</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ImportSource</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Parsed columns and records supplied by the caller.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">fields</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ImportField[]</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Target fields with id, label and required.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">mapping</code><span class="ml-1 text-destructive">*</span></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ImportMapping</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled field-to-column map; null means unmapped.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onMappingChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(next) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Reports the next full mapping.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onSubmit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(rows) =&gt; void | Promise</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives field-keyed rows; omit to hide the action.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">pending</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Disables submit and swaps to the pending label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">error</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Submission error rendered in an ErrorCard.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">title</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Header label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">previewLimit</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Preview row cap; &lt;= 0 means unlimited.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">5</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">submitLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Submit label override.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">pendingLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Pending label override.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">emptyLabel</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shown when the source has no columns.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Parse the file yourself and pass columns plus records; the component never reads files or fetches.
- Keep mapping controlled so a rejected submit can restore the previous mapping.
- Treat required, duplicate and out-of-range as separate issues; each one blocks submission.
- Show only the mapped fields in the preview so reviewers see exactly what will be imported.
