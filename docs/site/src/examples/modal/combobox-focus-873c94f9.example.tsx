import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
} from "@/components/ui/combobox";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  ModalTitle,
} from "@/components/ui/modal";
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
