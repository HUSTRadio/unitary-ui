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
