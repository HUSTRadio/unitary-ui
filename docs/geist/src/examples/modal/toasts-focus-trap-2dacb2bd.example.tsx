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
import { useToasts } from "@/components/ui/toast";
import { useState } from "react";

export function ModalToastsFocusTrap2DACB2BDExample() {
  const [open, setOpen] = useState(false);

  const toasts = useToasts();

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger asChild>
        <Button typeName="button" type="secondary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Toasts and Focus Trap</ModalTitle>
          <ModalDescription>
            The Modal traps focus, so Tab stays within it. Toasts still render above the Modal and
            remain interactive — trigger one, then click its action. The Modal stays open and focus
            returns to it.
          </ModalDescription>
        </ModalHeader>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() =>
              toasts.message({
                text: "Project link copied",
                action: "Undo",
                onAction: () => toasts.message({ text: "Copy reverted" }),
              })
            }
            size="small"
            type="secondary"
            typeName="button"
          >
            Show Toast
          </Button>
        </div>
        <div className="h-px w-full" aria-hidden />
        <ModalFooter>
          <Button typeName="button" onClick={() => setOpen(false)}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
