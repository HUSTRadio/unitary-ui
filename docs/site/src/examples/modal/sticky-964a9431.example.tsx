import { Button } from "@/components/ui/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
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
