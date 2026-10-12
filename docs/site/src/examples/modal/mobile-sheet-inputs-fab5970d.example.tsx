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
            On a mobile viewport this Modal remains centered. Verify that both inputs accept keyboard
            input without exceeding the viewport width.
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
