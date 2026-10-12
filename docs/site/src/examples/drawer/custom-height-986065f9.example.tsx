import { Button } from "@hustradio/unitary-ui";
import { Drawer, DrawerDescription, DrawerTitle } from "@hustradio/unitary-ui";
import { useState } from "react";

export function DrawerCustomHeight986065F9Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
    <Button onClick={() => setOpen(true)}>
      Open
    </Button>
    <Drawer height={200} show={open} onDismiss={() => setOpen(false)} verticalScroll>
      <div className="flex flex-col items-stretch justify-start gap-2 p-12">
        <DrawerTitle className="text-center">A drawer title</DrawerTitle>
        <DrawerDescription className="text-center">Drawer body</DrawerDescription>
      </div>
    </Drawer>
    </>
  );
}
