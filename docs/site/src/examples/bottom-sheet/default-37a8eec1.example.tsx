import * as React from "react";
import { BottomSheet } from "@hustradio/unitary-ui";
import { Button } from "@hustradio/unitary-ui";

export function BottomSheetDefault37A8EEC1Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <BottomSheet open={open} onOpenChange={setOpen} detents={[0.45, 0.8]}>
        <div className="space-y-4 p-6">
          <div>
            <h2 className="font-semibold">Deployment Actions</h2>
            <p className="text-sm text-muted-foreground">
              Choose what to do with the current deployment.
            </p>
          </div>
          <Button typeName="button" onClick={() => setOpen(false)}>
            Close Actions
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}
