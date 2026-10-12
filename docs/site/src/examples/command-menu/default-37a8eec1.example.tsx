import { Button } from "@hustradio/unitary-ui";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@hustradio/unitary-ui";
import { useState } from "react";

export function CommandMenuDefault37A8EEC1Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuGroup heading="Suggestions">
            <CommandMenuItem callback={() => {}}>Figma Import</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Commands">
            <CommandMenuItem callback={() => {}}>Import Extension</CommandMenuItem>
            <CommandMenuItem callback={() => {}}>Manage Extensions</CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Collaboration">
            <CommandMenuItem callback={() => {}}>Flags Explorer</CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}
