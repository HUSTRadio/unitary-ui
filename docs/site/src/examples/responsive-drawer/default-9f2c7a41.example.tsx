import * as React from "react";

import { Button } from "@hustradio/unitary-ui";
import {
  ResponsiveDrawer,
  ResponsiveDrawerBody,
  ResponsiveDrawerClose,
  ResponsiveDrawerContent,
  ResponsiveDrawerDescription,
  ResponsiveDrawerFooter,
  ResponsiveDrawerHeader,
  ResponsiveDrawerTitle,
} from "@hustradio/unitary-ui";

export function ResponsiveDrawerDefault9F2C7A41Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <ResponsiveDrawer open={open} onOpenChange={setOpen}>
        <ResponsiveDrawerContent>
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>Deployment Actions</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>
              Choose what to do with the current deployment.
            </ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
          <ResponsiveDrawerBody>
            <p className="text-copy-14 text-muted-foreground">
              The panel slides in from the right on desktop, keeps its own scrollable body, and
              returns focus to the trigger when closed.
            </p>
          </ResponsiveDrawerBody>
          <ResponsiveDrawerFooter>
            <ResponsiveDrawerClose asChild>
              <Button typeName="button" type="secondary">
                Cancel
              </Button>
            </ResponsiveDrawerClose>
            <Button typeName="button" type="error" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </ResponsiveDrawerFooter>
        </ResponsiveDrawerContent>
      </ResponsiveDrawer>
    </>
  );
}
