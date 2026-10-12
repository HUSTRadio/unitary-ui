import { Button } from "@hustradio/unitary-ui";
import { Drawer, DrawerDescription, DrawerTitle } from "@hustradio/unitary-ui";
import { useState } from "react";

export function DrawerDefault37A8EEC1Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
    <Button type="secondary" onClick={() => setOpen(true)}>
      Open
    </Button>
    <Drawer show={open} onDismiss={() => setOpen(false)} verticalScroll>
      <div className="flex flex-col items-stretch justify-start gap-2 p-12">
        <DrawerTitle className="text-center">A drawer title</DrawerTitle>
        <DrawerDescription className="text-center">Drawer body</DrawerDescription>
      </div>
    </Drawer>
    </>
  );
}
