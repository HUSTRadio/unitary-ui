import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  ModalTitle,
} from "@/components/ui/modal";
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
            This Modal is set up to programmatically move the focus onto the Submit button, making it
            possible to promptly continue with the Enter key.
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
