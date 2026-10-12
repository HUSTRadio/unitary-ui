# Modal

> Route: `/components/modal`

Open a dialog for a decision or form that must be completed before continuing.

[Back to Components](#/components)

# Modal

modal

Open a dialog for a decision or form that must be completed before continuing.

## When to use

- When a decision must block the rest of the page, such as confirming a deletion or transferring a project.
- When you need to confirm destructive actions; Drawer and Sheet don't fully dim the page so they read as too soft for delete or revoke flows.
- When the dialog needs to contain form inputs, a Combobox, or other complex interactive elements.

## When not to use

- Skip Modal for routine create flows that have a dedicated page; route the user to the page instead.
- For persistent associated context where the underlying page stays readable, use Sheet on desktop or Drawer on mobile.
- Don't use Modal for low-操作风险 daily confirmations like saving drafts or discarding changes—the 确认短语输入 creates unnecessary friction.

## Examples

### Default modal

The most basic Modal usage: displays a standard dialog with a title, body copy, and action buttons overlaid on a dimmed mask to interrupt the user's current task.

### Sticky mode

Uses the placement="top" form: the dialog pins to the viewport top edge with squared top corners and drops in from above (macOS sheet), while the bottom action bar stays pinned to the visible area so the actions remain clickable even when content overflows.

### Inset spacing

Compose an inset surface with className, bodyClassName, and a content wrapper; Modal does not expose a component property named inset.

### Disabled actions

Demonstrates disabling the primary action button within a Modal, typically used while awaiting validation results or when prerequisites are not met, paired with visual feedback to communicate the reason for the disabled state.

## Accessibility

- Modal traps focus inside the dialog until closed, and returns focus to the trigger element, ensuring keyboard users don't lose their place on the page.
- Sets aria-labelledby to the Modal.Title id so screen readers announce the title on open.
- Enter must never trigger a destructive action without a typed confirmation; default focus should land on Cancel to prevent accidental triggers.

## Controlled behavior

- The parent controls the Modal's open/close state entirely through the open prop; close should happen after the API settles or stay open on error for retry.
- Supports setting an initial focus target (e.g., focus-input-on-open) to direct focus into a specific input control inside the modal on open.

## Responsive behavior

- On small viewports Modal remains centered and limits its width to the viewport minus 20 px.
- Content is capped at 80vh and scrolls; use BottomSheet when the experience should be a mobile bottom panel.

## Theme behavior

- Modal's backdrop overlay color, content background, and button colors all follow theme tokens, automatically adapting for light and dark modes.
- Custom color schemes integrate seamlessly with design system token variables for consistent brand visuals.

## Live Demo

```tsx
import { Button } from "@hustradio/unitary-ui";
import { Modal, ModalContent, ModalTrigger } from "@hustradio/unitary-ui";
import { useState } from "react";

export function ModalDefault37A8EEC1Example() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent bodyClassName="pb-0">
        <header className="mb-5">
          <h3 className="text-heading-20 text-foreground">Create Token</h3>
          <div className="mt-2 mb-1 text-copy-14 text-muted-foreground">
            Enter a unique name for your token to differentiate it from other tokens and then select
            the scope.
          </div>
        </header>
        <p className="text-copy-14">Some content contained within the modal.</p>
        <footer className="sticky bottom-0 -mx-5 mt-5 flex shrink-0 items-center justify-between border-t border-gray-alpha-400 bg-background-100 px-5 py-4">
          <Button size="small" typeName="button" type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="small" typeName="button" type="default">
            Submit
          </Button>
        </footer>
      </ModalContent>
    </Modal>
  );
}
```

## Sticky

```tsx
import { Button } from "@hustradio/unitary-ui";
import { Modal, ModalContent, ModalTrigger } from "@hustradio/unitary-ui";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";

export function ModalSticky964A9431Example() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent placement="top" bodyClassName="pt-0 pb-0">
        <header className="sticky top-0 z-10 -mx-5 mb-5 flex items-center gap-2.5 border-b border-gray-alpha-400 bg-background-100 px-5 py-5">
          <h3 className="text-heading-20 leading-6 text-foreground">Create Token</h3>
        </header>
        {Array.from({ length: 52 }).map((_, index) => (
          <p key={index} className="text-copy-14">
            Some content contained within the modal.
          </p>
        ))}
        <footer className="sticky bottom-0 -mx-5 mt-5 flex shrink-0 items-center justify-between border-t border-gray-alpha-400 bg-background-100 px-5 py-4">
          <Button size="small" typeName="button" type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size="small"
            typeName="button"
            type="secondary"
            prefix={<ChevronLeft className="size-3.5" aria-hidden />}
          >
            Previous
          </Button>
          <Button size="small" typeName="button" type="default">
            Submit
          </Button>
        </footer>
      </ModalContent>
    </Modal>
  );
}
```

## Compact

```tsx
import { Button } from "@hustradio/unitary-ui";
import { Modal, ModalContent, ModalTrigger } from "@hustradio/unitary-ui";
import { useState } from "react";

export function ModalCompactC4E1A90BExample() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      {/* 紧凑变体：body padding p-5(20px) → p-4(16px)，header/footer 内边距同步各压半档 */}
      <ModalContent bodyClassName="p-4 pb-0">
        <header className="mb-2">
          <h3 className="text-heading-20 text-foreground">Create Token</h3>
          <div className="mt-1 text-copy-14 text-muted-foreground">
            Enter a unique name for your token to differentiate it from other tokens and then select
            the scope.
          </div>
        </header>
        <p className="text-copy-14">Some content contained within the modal.</p>
        <footer className="sticky bottom-0 -mx-4 mt-3 flex shrink-0 items-center justify-between border-t border-gray-alpha-400 bg-background-100 px-4 py-3">
          <Button size="small" typeName="button" type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="small" typeName="button" type="default">
            Submit
          </Button>
        </footer>
      </ModalContent>
    </Modal>
  );
}
```

## Single button

```tsx
import { Button } from "@hustradio/unitary-ui";
import { Modal, ModalContent, ModalTrigger } from "@hustradio/unitary-ui";
import { useState } from "react";

export function ModalSingleButton15781DA6Example() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent className="sticky" bodyClassName="pt-0 pb-0">
        <header className="sticky top-0 z-10 -mx-5 mb-5 flex items-center gap-2.5 border-b border-gray-alpha-400 bg-background-100 px-5 py-5">
          <h3 className="text-heading-20 leading-6 text-foreground">Create Token</h3>
        </header>
        <p className="text-copy-14">Some content contained within the modal.</p>
        <footer className="sticky bottom-0 -mx-5 mt-5 flex shrink-0 items-center justify-between border-t border-gray-alpha-400 bg-background-100 px-5 py-4">
          <Button size="small" typeName="button" type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </footer>
      </ModalContent>
    </Modal>
  );
}
```

## Inset

```tsx
import { Button } from "@hustradio/unitary-ui";
import { Modal, ModalContent, ModalTrigger } from "@hustradio/unitary-ui";
import { useState } from "react";

export function ModalInset2F0C8478Example() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent bodyClassName="pb-0">
        <header className="mb-5">
          <h3 className="text-heading-20 text-foreground">Modal</h3>
          <div className="mt-2 mb-1 text-copy-14 text-muted-foreground">This is a modal.</div>
        </header>
        <div className="mx-[-20px] border-y border-gray-400 bg-background-200 px-5 py-6">
          <p className="text-copy-14">Content within the inset.</p>
        </div>
        <div className="pt-5">
          <p className="text-copy-14">Content outside the inset.</p>
        </div>
        <footer className="sticky bottom-0 -mx-5 mt-5 flex shrink-0 items-center justify-between border-t border-gray-alpha-400 bg-background-100 px-5 py-4">
          <Button size="small" typeName="button" type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="small" typeName="button" type="default">
            Submit
          </Button>
        </footer>
      </ModalContent>
    </Modal>
  );
}
```

## Disabled actions

```tsx
import { Button } from "@hustradio/unitary-ui";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  ModalTitle,
} from "@hustradio/unitary-ui";
import { useState } from "react";

export function ModalDisabledActions96FBF6AEExample() {
  const [open, setOpen] = useState(false);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Modal</ModalTitle>
          <ModalDescription>This is a modal.</ModalDescription>
        </ModalHeader>
        <p className="text-copy-14">Some content contained within the modal.</p>
        <ModalFooter>
          <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button typeName="button" disabled onClick={() => setOpen(false)}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

## Control initial focus

```tsx
import { Button } from "@hustradio/unitary-ui";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  ModalTitle,
} from "@hustradio/unitary-ui";
import { useRef, useState } from "react";

export function ModalControlInitialFocus9DBB3C0DExample() {
  const [open, setOpen] = useState(false);

  const initialFocusRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          initialFocusRef.current?.focus();
        }}
      >
        <ModalHeader>
          <ModalTitle>Initial Focus</ModalTitle>
          <ModalDescription>
            This Modal is set up to programmatically move the focus onto the Submit button, making
            it possible to promptly continue with the Enter key.
          </ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button typeName="button" ref={initialFocusRef} onClick={() => setOpen(false)}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

## Focus input on open

```tsx
import { Button } from "@hustradio/unitary-ui";
import { Input } from "@hustradio/unitary-ui";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  ModalTitle,
} from "@hustradio/unitary-ui";
import { useRef, useState } from "react";

export function ModalFocusInputOnOpenDB430094Example() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const initialFocusRef = useRef<HTMLInputElement>(null);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          initialFocusRef.current?.focus();
        }}
      >
        <ModalHeader>
          <ModalTitle>Invite Member</ModalTitle>
          <ModalDescription>
            On desktop and narrow viewports, the Name field receives focus when the Modal opens so
            the user can start typing immediately.
          </ModalDescription>
        </ModalHeader>
        <div className="flex flex-col gap-3">
          <Input
            label="Name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            ref={initialFocusRef}
            value={name}
          />
        </div>
        <ModalFooter>
          <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button typeName="button" onClick={() => setOpen(false)}>
            Send Invite
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

## Mobile sheet inputs

```tsx
import { Button } from "@hustradio/unitary-ui";
import { Input } from "@hustradio/unitary-ui";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  ModalTitle,
} from "@hustradio/unitary-ui";
import { useState } from "react";

export function ModalMobileSheetInputsFAB5970DExample() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Invite Member</ModalTitle>
          <ModalDescription>
            On a mobile viewport this Modal remains centered. Verify that both inputs accept
            keyboard input without exceeding the viewport width.
          </ModalDescription>
        </ModalHeader>
        <div className="flex flex-col gap-3">
          <Input
            label="Name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            value={name}
          />
          <Input
            label="Email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            value={email}
          />
        </div>
        <ModalFooter>
          <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button typeName="button" onClick={() => setOpen(false)}>
            Send Invite
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

## Combobox focus

```tsx
import { Button } from "@hustradio/unitary-ui";
import { Combobox, ComboboxInput, ComboboxList, ComboboxOption } from "@hustradio/unitary-ui";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  ModalTitle,
} from "@hustradio/unitary-ui";
import { useState } from "react";

export function ModalComboboxFocus873C94F9Example() {
  const regions = [
    { value: "iad1", label: "Washington, D.C., USA (East) – iad1" },
    { value: "sfo1", label: "San Francisco, USA (West) – sfo1" },
    { value: "lhr1", label: "London, UK (London) – lhr1" },
    { value: "fra1", label: "Frankfurt, Germany (Central EU) – fra1" },
    { value: "sin1", label: "Singapore (Southeast Asia) – sin1" },
  ];

  const [open, setOpen] = useState(false);

  const [region, setRegion] = useState<string | null>(null);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create Database</ModalTitle>
          <ModalDescription>
            Choose a region for your database. Reads and writes will take place in this region.
          </ModalDescription>
        </ModalHeader>
        <div className="mx-[-20px] border-t border-gray-400 bg-background-200 px-5 py-6">
          <Combobox
            aria-label="Region"
            label="Region"
            onValueChange={setRegion}
            placeholder="Search regions..."
            size="small"
            value={region}
          >
            <ComboboxInput />
            <ComboboxList>
              {regions.map((option) => (
                <ComboboxOption key={option.value} value={option.value}>
                  {option.label}
                </ComboboxOption>
              ))}
            </ComboboxList>
          </Combobox>
        </div>
        <ModalFooter>
          <Button typeName="button" type="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button typeName="button" onClick={() => setOpen(false)}>
            Create Database
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

## Toasts focus trap

```tsx
import { Button } from "@hustradio/unitary-ui";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  ModalTitle,
} from "@hustradio/unitary-ui";
import { useToasts } from "@hustradio/unitary-ui";
import { useState } from "react";

export function ModalToastsFocusTrap2DACB2BDExample() {
  const [open, setOpen] = useState(false);

  const toasts = useToasts();

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Toasts and Focus Trap</ModalTitle>
          <ModalDescription>
            The Modal traps focus, so Tab stays within it. Toasts still render above the Modal and
            remain interactive — trigger one, then click its action. The Modal stays open and focus
            returns to it.
          </ModalDescription>
        </ModalHeader>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() =>
              toasts.message({
                text: "Project link copied",
                action: "Undo",
                onAction: () => toasts.message({ text: "Copy reverted" }),
              })
            }
            size="small"
            type="secondary"
            typeName="button"
          >
            Show Toast
          </Button>
        </div>
        <ModalFooter>
          <Button typeName="button" onClick={() => setOpen(false)}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
```

## API Reference

Component imports and API are listed below. \* marks a required prop.

Import

```tsx
import {
  Modal,
  ModalTrigger,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from "@hustradio/unitary-ui";
```

### Props & callbacks

<table class="w-full min-w-[640px] text-left"><thead class="border-b border-border"><tr class="text-label-13 text-foreground"><th class="px-3 py-2 font-medium">Name</th><th class="px-3 py-2 font-medium">Type</th><th class="px-3 py-2 font-medium">Description</th><th class="px-3 py-2 font-medium">Default</th></tr></thead><tbody><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">open</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Controlled dialog state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">defaultOpen</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Initial uncontrolled state.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">onOpenChange</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">(open: boolean) =&gt; void</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Receives open state changes.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">showCloseButton</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">boolean</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Shows the optional close button in ModalContent.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">false</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">bodyClassName</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">string</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Additional class name for the ModalContent body.</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">—</td></tr><tr class="border-b border-border last:border-0"><td class="px-3 py-2 align-top text-label-13 text-foreground"><code translate="no">placement</code></td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"center" | "top"</td><td class="px-3 py-2 align-top text-copy-13 text-muted-foreground">Center zooms in place; "top" pins the dialog to the viewport top edge and drops in from above (macOS sheet).</td><td class="px-3 py-2 align-top font-mono text-label-12 text-muted-foreground" translate="no">"center"</td></tr></tbody></table>

## Best Practices

- Use Modal when a decision must block the rest of the page. For persistent associated context where the underlying page stays readable, use Sheet on desktop or Drawer on mobile.
- Confirm destructive actions in a Modal. Drawer and Sheet don't fully dim the page, so they read as too soft for a delete or revoke.
- Skip Modal for routine create flows that have a dedicated page; route to the page instead.
- Default focus to Cancel on any destructive Modal. Enter must never trigger the destructive action without a typed confirmation.
- Allow Escape and outside-click to dismiss non-destructive Modals; gate dismissal on destructive ones with unsaved input.
- Trap focus inside the Modal while it's open and return focus to the trigger after close. Restore body scroll on the same tick the Modal unmounts.
- For high-操作风险 destructive actions (delete production resource, rotate signing key, downgrade plan), gate the primary button on a typed match of the resource name.
- Modal.Title is a Title Case statement, never a question. Transfer Project is correct; Transfer Project? is wrong.
- Modal body copy is sentence case, 1-3 sentences. State the consequence first, then any cascade.
- Primary button is Verb + Noun and matches the title verb (Transfer Project title pairs with Transfer Project button). Never Confirm, OK, or a bare verb on a destructive primary.
- Cancel literal stays Cancel. Acknowledgment-only Modals (after a key reveal, after a one-time-show) use Done, never OK or Close.
- Close irreversible bodies with This cannot be undone.; close cascade-only bodies with Some effects cannot be undone. Don't claim full irreversibility for a partial cascade.
- Pair the success toast verb 1:1 with the primary button: Delete Project button, Project deleted toast.
- Set aria-labelledby to the Modal.Title id so screen readers announce the title on open.
- Keep the Cancel button literally Cancel so screen-reader users hear a stable dismissal label across destructive flows.
- After an error inside the Modal, keep focus inside so the user can retry; after success, return focus to the trigger.
