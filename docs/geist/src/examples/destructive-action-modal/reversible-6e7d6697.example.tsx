import { Button } from "@/components/ui/button";
import { DestructiveActionModal } from "@/components/ui/destructive-action-modal";
import { useState } from "react";

export function DestructiveActionModalReversible6E7D6697Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Disable Vercel Authentication
      </Button>
      <DestructiveActionModal
        confirmLabel="Disable Vercel Authentication"
        description="Anyone will be able to view your deployments without being a member of your team."
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        open={open}
        title="Disable Vercel Authentication"
        verificationPhrase="disable vercel authentication"
      />
    </>
  );
}
