import { Button } from "@hustradio/unitary-ui";
import {
  CommandMenu,
  CommandMenuDivider,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@hustradio/unitary-ui";
import { useState } from "react";

export function CommandMenuWithDivider5A6D5780Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuItem callback={() => {}}>Item 1</CommandMenuItem>
          <CommandMenuItem callback={() => {}}>Item 2</CommandMenuItem>
          <CommandMenuDivider />
          <CommandMenuItem callback={() => {}}>Item 3</CommandMenuItem>
          <CommandMenuGroup heading="Group 1">
            <CommandMenuItem callback={() => {}}>Grouped Item 1</CommandMenuItem>
            <CommandMenuItem callback={() => {}}>Grouped Item 2</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}
