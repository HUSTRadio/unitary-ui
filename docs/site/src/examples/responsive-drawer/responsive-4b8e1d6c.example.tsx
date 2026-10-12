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

export function ResponsiveDrawerResponsive4B8E1D6CExample() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button typeName="button" onClick={() => setOpen(true)}>
        Open Deployment Actions
      </Button>
      <ResponsiveDrawer open={open} onOpenChange={setOpen} responsive>
        <ResponsiveDrawerContent>
          <ResponsiveDrawerHeader>
            <ResponsiveDrawerTitle>Deployment Actions</ResponsiveDrawerTitle>
            <ResponsiveDrawerDescription>
              Choose what to do with the current deployment.
            </ResponsiveDrawerDescription>
          </ResponsiveDrawerHeader>
          <ResponsiveDrawerBody>
            <p className="text-copy-14 text-muted-foreground">
              With responsive enabled the panel uses the bottom geometry below 640px and the side
              panel above it, so one drawer covers phone and desktop without branching in app code.
            </p>
          </ResponsiveDrawerBody>
          <ResponsiveDrawerFooter>
            <ResponsiveDrawerClose asChild>
              <Button typeName="button" type="secondary">
                Cancel
              </Button>
            </ResponsiveDrawerClose>
            <Button typeName="button" onClick={() => setOpen(false)}>
              Apply
            </Button>
          </ResponsiveDrawerFooter>
        </ResponsiveDrawerContent>
      </ResponsiveDrawer>
    </>
  );
}
