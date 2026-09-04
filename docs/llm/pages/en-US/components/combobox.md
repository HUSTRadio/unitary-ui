# Combobox

> Route: `/components/combobox`

A searchable single-select list.

[Back to Components](#/components)

# Combobox

Combobox

A searchable single-select list.

## When to use

- When filtering materially helps users find one option from a long list; for short fixed lists, Select is a better fit.
- When you need to keep the selected value and search query distinct so reopening the list doesn't erase the prior selection.

## When not to use

- For simple binary choices (toggle on/off), use Toggle instead of Combobox; the interaction overhead is too heavy for a simple switch.
- When users need to select multiple items; use Multi Select—Combobox is designed for single-selection only.

## Examples

### Uncontrolled combobox

A basic uncontrolled Combobox where internal state independently manages the selected value and query.

### Controlled combobox

Controls the selected value through value and onValueChange while the search query remains internal.

### Disabled combobox

Displays the disabled visual state of the Combobox, preventing user interaction and selection.

### Combobox with different sizes

Demonstrates the small, medium, and large Combobox sizes for different density contexts.

### Combobox with label

Label is associated with the input, ensuring assistive technologies read the field name correctly.

### Clearable combobox

In clearable mode, the user can reset the selection back to the initial empty state at any time.

### Errored combobox

Applies error colors to the input text and icons when validation fails; the page supplies any explanatory error message separately.

## Accessibility

- Combobox combines input and list semantics; Up/Down arrows move the highlight, Home/End jump to the first/last item, and Enter selects it.
- Typing filters the option list in real time; the first visible item is highlighted on open and the highlight remains within the filtered set.

## Controlled behavior

- The selected value supports controlled value/onValueChange and uncontrolled defaultValue modes.
- The search query is internal; ComboboxInput onChange can observe typing, but there is currently no controlled query prop.

## Responsive behavior

- The dropdown is placed below the input and recomputes its fixed position on scroll or resize; it does not currently flip or avoid viewport collisions.
- Input width comes from layout or the compatibility width prop; the list is at least as wide as the input and maxWidth can widen it.

## Theme behavior

- Borders, focus rings, selected-item backgrounds, and dropdown shadows all adapt automatically via design system color and token variables.
- High-contrast color schemes in dark mode ensure readable text across all themes.

## Live Demo

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

export function ComboboxUncontrolledAB4CD2AEExample() {
  return (
    <Combobox aria-label="Search" placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## controlled

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { useState } from "react";

export function ComboboxControlled71AD7238Example() {
  const [value, setValue] = useState("b");

  return (
    <Combobox aria-label="Search" onValueChange={setValue} placeholder="Search..." value={value}>
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## disabled

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

export function ComboboxDisabled17EB3C01Example() {
  return (
    <Combobox aria-label="Search" disabled placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## sizes

- One
- Two
- Three

- One
- Two
- Three

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

export function ComboboxSizes7C69F3FAExample() {
  const options = [
    { value: "a", label: "One" },
    { value: "b", label: "Two" },
    { value: "c", label: "Three" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch justify-start gap-4 flex-initial">
      <Combobox aria-label="Search" placeholder="Search..." size="small" className="w-[235px]">
        <ComboboxInput />
        <ComboboxList>
          {options.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              {option.label}
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>

      <Combobox aria-label="Search" placeholder="Search..." className="w-[235px]">
        <ComboboxInput />
        <ComboboxList>
          {options.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              {option.label}
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>

      <Combobox aria-label="Search" placeholder="Search..." size="large" className="w-[257px]">
        <ComboboxInput />
        <ComboboxList>
          {options.map((option) => (
            <ComboboxOption key={option.value} value={option.value}>
              {option.label}
            </ComboboxOption>
          ))}
        </ComboboxList>
      </Combobox>
    </div>
  );
}
```

## with-label

Select your country

- United States
- Canada
- United Kingdom
- Germany
- France
- Japan
- Australia
- Brazil

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

export function ComboboxWithLabelBB9F6883Example() {
  return (
    <Combobox
      label="Select your country"
      aria-label="Select your country"
      placeholder="Search countries…"
    >
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="us">United States</ComboboxOption>
        <ComboboxOption value="ca">Canada</ComboboxOption>
        <ComboboxOption value="uk">United Kingdom</ComboboxOption>
        <ComboboxOption value="de">Germany</ComboboxOption>
        <ComboboxOption value="fr">France</ComboboxOption>
        <ComboboxOption value="jp">Japan</ComboboxOption>
        <ComboboxOption value="au">Australia</ComboboxOption>
        <ComboboxOption value="br">Brazil</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## clearable

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { useState } from "react";

export function ComboboxClearable258DDE0FExample() {
  const [value, setValue] = useState("two");

  return (
    <Combobox
      aria-label="Search"
      clearable
      onValueChange={setValue}
      placeholder="Search..."
      value={value}
    >
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="one">One</ComboboxOption>
        <ComboboxOption value="two">Two</ComboboxOption>
        <ComboboxOption value="three">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## errored

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

export function ComboboxErrored138BB025Example() {
  return (
    <Combobox aria-label="Search" errored placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## custom-width-input

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

export function ComboboxCustomWidthInputC898F7ADExample() {
  return (
    <Combobox aria-label="Search" placeholder="Search..." width={256}>
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a">One</ComboboxOption>
        <ComboboxOption value="b">Two</ComboboxOption>
        <ComboboxOption value="c">Three</ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## custom-width-list

- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
- Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
- Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

export function ComboboxCustomWidthList0695C952Example() {
  return (
    <Combobox aria-label="Search" placeholder="Search..." width={256}>
      <ComboboxInput />
      <ComboboxList maxWidth={500}>
        <ComboboxOption value="a">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </ComboboxOption>
        <ComboboxOption value="b">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur.
        </ComboboxOption>
        <ComboboxOption value="c">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## custom-empty-message

```tsx
import { Combobox, ComboboxInput, ComboboxList } from "@/components/ui/combobox";

export function ComboboxCustomEmptyMessage1DAF4719Example() {
  return (
    <Combobox aria-label="Search" placeholder="Search..." width={256}>
      <ComboboxInput />
      <ComboboxList emptyMessage="Nothing to see here..." />
    </Combobox>
  );
}
```

## with-prefix-icons

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Triangle } from "lucide-react";

export function ComboboxWithPrefixIcons033AD1CBExample() {
  return (
    <Combobox aria-label="Search" className="w-fit" placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a" prefix={<Triangle className="size-4" aria-hidden />}>
          One
        </ComboboxOption>
        <ComboboxOption value="b" prefix={<Triangle className="size-4" aria-hidden />}>
          Two
        </ComboboxOption>
        <ComboboxOption value="c" prefix={<Triangle className="size-4" aria-hidden />}>
          Three
        </ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## with-suffix-icons

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Triangle } from "lucide-react";

export function ComboboxWithSuffixIcons025A8424Example() {
  return (
    <Combobox aria-label="Search" className="w-fit" placeholder="Search...">
      <ComboboxInput />
      <ComboboxList>
        <ComboboxOption value="a" suffix={<Triangle className="size-4" aria-hidden />}>
          One
        </ComboboxOption>
        <ComboboxOption value="b" suffix={<Triangle className="size-4" aria-hidden />}>
          Two
        </ComboboxOption>
        <ComboboxOption value="c" suffix={<Triangle className="size-4" aria-hidden />}>
          Three
        </ComboboxOption>
      </ComboboxList>
    </Combobox>
  );
}
```

## used-inside-modal

```tsx
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useState } from "react";

export function ComboboxUsedInsideModal1332CE87Example() {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "a", label: "One" },
    { value: "b", label: "Two" },
    { value: "c", label: "Three" },
  ];

  return (
    <>
      <Button onClick={() => setOpen(true)} size="small" typeName="button">
        Open Modal
      </Button>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create Token</ModalTitle>
            <ModalDescription>
              Enter a unique name for your token to differentiate it from other tokens and then
              select the scope.
            </ModalDescription>
          </ModalHeader>
          <div className="mx-[-20px] border-t border-gray-400 bg-background-200 px-5 py-6">
            <div className="flex flex-col gap-2.5">
              <Combobox aria-label="Region" label="Region" placeholder="Search..." size="small">
                <ComboboxInput />
                <ComboboxList>
                  {options.map((option) => (
                    <ComboboxOption key={option.value} value={option.value}>
                      {option.label}
                    </ComboboxOption>
                  ))}
                </ComboboxList>
              </Combobox>
              <p className="text-copy-13 text-gray-900">
                This is the region where your database reads and writes will take place.
              </p>
            </div>
          </div>
          <div className="h-px w-full" aria-hidden />
          <ModalFooter>
            <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button typeName="button" onClick={() => setOpen(false)}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
```

## inside-sheet

```tsx
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useState } from "react";

export function ComboboxInsideSheet95E13F11Example() {
  const SHARED_VARS = [
    { key: "CONTENTFUL_MANAGEMENT_APP_INSTALLATION_ID", target: "Preview and Production" },
    { key: "EXTENSION_AUTH_JWT_SECRET", target: "Development" },
    { key: "DATABASE_URL", target: "Production" },
    // ...
  ];

  const [linked, setLinked] = useState<string[]>([]);

  const [search, setSearch] = useState("");

  return (
    <Sheet modal>
      <SheetTrigger asChild>
        <Button size="small" typeName="button">
          Link Shared Variable
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="m-3 flex h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] max-w-3xl flex-col overflow-clip rounded-2xl bg-background-100 p-0 lg:w-5/6 sm:max-w-[auto]"
      >
        <div className="flex flex-shrink-0 items-center justify-between pt-3 pl-4 pr-3">
          <SheetTitle className="text-heading-20">Link Shared Variable</SheetTitle>
          <SheetClose asChild>
            <Button aria-label="Close" shape="square" svgOnly type="tertiary" typeName="button">
              <X className="size-4" aria-hidden />
            </Button>
          </SheetClose>
        </div>
        <p className="px-4 pb-2 text-copy-14 text-gray-900">
          Changes to shared variables sync automatically across all linked projects.
        </p>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-1">
          <Combobox
            aria-label="Search for shared environment variables"
            placeholder="Search for shared environment variables…"
            value={search}
          >
            <ComboboxInput />
            <ComboboxList>
              {SHARED_VARS.filter((v) => !linked.includes(`${v.key}::${v.target}`)).map((v) => (
                <ComboboxOption
                  ignoreDefaultHeight
                  key={`${v.key}::${v.target}`}
                  value={`${v.key}::${v.target}`}
                >
                  <div className="flex flex-col items-stretch justify-start py-[15px] px-2">
                    <p className="font-mono text-sm font-medium">{v.key}</p>
                    <p className="mt-[3px] text-xs text-gray-900">{v.target}</p>
                  </div>
                </ComboboxOption>
              ))}
            </ComboboxList>
          </Combobox>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string | null</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled selected value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultValue</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial uncontrolled selected value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">""</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives selection changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">placeholder</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Placeholder and fallback search prompt.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">aria-label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Accessible name for the search input.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">label</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Visible field label.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">disabled</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Disables the combobox.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">size</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"small" | "medium" | "large"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Input surface size.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"medium"</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">errored</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Uses error colors for the input surface.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">clearable</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows a clear button for a selected value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">width</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Legacy root width in pixels.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">layout</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ControlLayout</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controls root and input surface dimensions.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">maxWidth</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">number</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Minimum panel width beyond the trigger width.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">emptyMessage</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Message shown when filtering has no results.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">prefix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Option leading content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">suffix</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">ReactNode</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Option trailing content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">ignoreDefaultHeight</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Lets an option grow to fit multiline content.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Combobox when filtering materially helps users find one option; use Select for short fixed lists.
- Keep the selected value and search query distinct so reopening the list does not erase the selection.
