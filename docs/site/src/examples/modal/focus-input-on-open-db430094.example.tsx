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
            On desktop and narrow viewports, the Name field receives focus when the Modal opens so the
            user can start typing immediately.
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
