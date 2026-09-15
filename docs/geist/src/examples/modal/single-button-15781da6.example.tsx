import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
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
