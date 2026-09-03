import { Button } from "@/components/ui/button";
import {
  CommandMenu,
  CommandMenuGroup,
  CommandMenuInput,
  CommandMenuItem,
  CommandMenuList,
} from "@/components/ui/command-menu";
import { CircleCheck } from "lucide-react";
import { useState } from "react";

export function CommandMenuWithSuffixED17650BExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="default" onClick={() => setOpen(true)}>
        Open Command Menu
      </Button>
      <CommandMenu open={open} setOpen={setOpen}>
        <CommandMenuInput placeholder="What do you need?" />
        <CommandMenuList>
          <CommandMenuGroup heading="Group 1">
            <CommandMenuItem callback={() => {}} suffix={<span>USA</span>}>
              United States of America
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>ESP</span>}>
              Spain
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>FRA</span>}>
              France
            </CommandMenuItem>
          </CommandMenuGroup>
          <CommandMenuGroup heading="Group 2">
            <CommandMenuItem callback={() => {}} suffix={<span>AUT</span>}>
              Austria
            </CommandMenuItem>
            <CommandMenuItem
              callback={() => {}}
              suffix={<CircleCheck className="size-4 text-gray-700" />}
            >
              Switzerland
            </CommandMenuItem>
            <CommandMenuItem callback={() => {}} suffix={<span>GER</span>}>
              Germany
            </CommandMenuItem>
          </CommandMenuGroup>
        </CommandMenuList>
      </CommandMenu>
    </>
  );
}
