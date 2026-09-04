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
      <ModalContent className="sticky" bodyClassName="pt-0">
        <header className="sticky top-0 z-10 -mx-5 mb-5 flex items-center gap-2.5 bg-background-200 px-5 py-5">
          <h3 className="text-heading-20 leading-6 text-foreground">Create Token</h3>
        </header>
        <p className="text-copy-14">Some content contained within the modal.</p>
        <div className="h-px w-full" aria-hidden />
        <footer className="sticky bottom-0 -mx-5 flex shrink-0 justify-between bg-background-200 p-3">
          <Button size="small" typeName="button" type="secondary">
            Cancel
          </Button>
        </footer>
      </ModalContent>
    </Modal>
  );
}
