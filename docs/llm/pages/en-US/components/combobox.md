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

Shows controlled usage of Combobox with external value and query props, suitable for integrating with global state management.

### Disabled combobox

Displays the disabled visual state of the Combobox, preventing user interaction and selection.

### Combobox with different sizes

Demonstrates the size variants (sm, default, lg) offered by Combobox for use in different density contexts.

### Combobox with label

Label is associated with the input, ensuring assistive technologies read the field name correctly.

### Clearable combobox

In clearable mode, the user can reset the selection back to the initial empty state at any time.

### Errored combobox

Displays a red border and error message when the selection fails validation or is otherwise invalid.

## Accessibility

- Combobox combines the semantics of an input with a list; keyboard navigation: Up/Down arrows move focus, Home/End jump to first/last item, Enter or Space activates.
- Typeahead support: pressing a character jumps to the next item whose label starts with that character, allowing keyboard users to navigate efficiently.

## Controlled behavior

- Combobox supports both controlled and uncontrolled modes; in controlled mode, external value/query props and onChange callbacks provide full external state management.
- The selected value and the search query are tracked independently so reopening the dropdown doesn't erase a previous selection.

## Responsive behavior

- The dropdown list auto-positions based on window bounds to prevent overflow on narrow viewports.
- Input width can switch between custom widths and full-width; the dropdown width adapts to follow the input box size.

## Theme behavior

- Borders, focus rings, selected-item backgrounds, and dropdown shadows all adapt automatically via design system color and token variables.
- High-contrast color schemes in dark mode ensure readable text across all themes.

## Live Demo

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>;
```

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { useState } from "react";

const [value, setValue] = useState("b");

<Combobox aria-label="Search" onValueChange={setValue} placeholder="Search..." value={value}>
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>;
```

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" disabled placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>;
```

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

const options = [
  { value: "a", label: "One" },
  { value: "b", label: "Two" },
  { value: "c", label: "Three" },
];

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
</div>;
```

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
</Combobox>;
```

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { useState } from "react";

const [value, setValue] = useState("two");

// 选中后出现清除按钮（X），点击即清空并回调 onValueChange。
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
</Combobox>;
```

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" errored placeholder="Search...">
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>;
```

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search..." width={256}>
  <ComboboxInput />
  <ComboboxList>
    <ComboboxOption value="a">One</ComboboxOption>
    <ComboboxOption value="b">Two</ComboboxOption>
    <ComboboxOption value="c">Three</ComboboxOption>
  </ComboboxList>
</Combobox>;
```

- Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
- Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
- Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search..." width={256}>
  <ComboboxInput />
  <ComboboxList maxWidth={500}>
    <ComboboxOption value="a">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua.
    </ComboboxOption>
    <ComboboxOption value="b">
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur.
    </ComboboxOption>
    <ComboboxOption value="c">
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
      id est laborum.
    </ComboboxOption>
  </ComboboxList>
</Combobox>;
```

```tsx
import { Combobox, ComboboxInput, ComboboxList } from "@/components/ui/combobox";

<Combobox aria-label="Search" placeholder="Search..." width={256}>
  <ComboboxInput />
  <ComboboxList emptyMessage="Nothing to see here..." />
</Combobox>;
```

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Triangle } from "lucide-react";

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
</Combobox>;
```

- One
- Two
- Three

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Triangle } from "lucide-react";

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
</Combobox>;
```

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

const [open, setOpen] = useState(false);

const options = [
  { value: "a", label: "One" },
  { value: "b", label: "Two" },
  { value: "c", label: "Three" },
];

<Button onClick={() => setOpen(true)} size="small" typeName="button">
  Open Modal
</Button>

<Modal open={open} onOpenChange={setOpen}>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Create Token</ModalTitle>
      <ModalDescription>
        Enter a unique name for your token to differentiate it from other tokens and then select
        the scope.
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
```

```tsx
import { Button } from "@/components/ui/button";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { useState } from "react";

const SHARED_VARS = [
  { key: "CONTENTFUL_MANAGEMENT_APP_INSTALLATION_ID", target: "Preview and Production" },
  { key: "EXTENSION_AUTH_JWT_SECRET", target: "Development" },
  { key: "DATABASE_URL", target: "Production" },
  // ...
];

const [linked, setLinked] = useState<string[]>([]);
const [search, setSearch] = useState("");

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
</Sheet>;
```

## API Reference

This page lists the stable public surface. Refer to the underlying element type for inherited native attributes.

Import

```tsx
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@/components/ui/combobox";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">value</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled selected value.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onValueChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(value: string) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives selection changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr></tbody></table>

## Best Practices

- Use Combobox when filtering materially helps users find one option; use Select for short fixed lists.
- Keep the selected value and search query distinct so reopening the list does not erase the selection.
