import { Button } from "@hustradio/unitary-ui";
import { DestructiveActionModal } from "@hustradio/unitary-ui";
import { useState } from "react";

export function DestructiveActionModalDefault21B111CBExample() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <>
      <Button typeName="button" type="error" size="small" onClick={() => setOpen(true)}>
        Delete Project
      </Button>
      <DestructiveActionModal
        confirmLabel="Delete Project"
        description={
          <>
            <span className="font-medium">next-year-boilerplate</span> and all its deployments,
            domains, and environment variables will be permanently deleted.
          </>
        }
        irreversibleDescription="Deleting next-year-boilerplate cannot be undone."
        loading={loading}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
        open={open}
        title="Delete Project"
        verificationLabel="project name"
        verificationPhrase="next-year-boilerplate"
      />
    </>
  );
}
