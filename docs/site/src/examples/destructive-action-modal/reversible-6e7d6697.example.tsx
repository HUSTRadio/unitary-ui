import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function DestructiveActionModalReversible6E7D6697Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Disable Unitary Authentication
      </Button>
      <DestructiveActionModal
        confirmLabel="Disable Unitary Authentication"
        description="Anyone signed in will be able to manage this integration without being a member of your workspace."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title="Disable Unitary Authentication"
        verificationPhrase="disable unitary authentication"
      />
    </>
  );
}
