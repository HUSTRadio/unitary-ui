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
            <p className="text-copy-13 text-muted-foreground">
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
