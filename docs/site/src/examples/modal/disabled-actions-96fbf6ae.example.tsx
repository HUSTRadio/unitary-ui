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
