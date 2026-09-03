import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";

export function DotsMenuDisabledMenuItem717ABAD2Example() {
  return (
    <DotsMenu>
      <DotsMenuItem>View Build Logs</DotsMenuItem>
      <DotsMenuItem disabled>View Projects</DotsMenuItem>
      <DotsMenuItem>View Analytics</DotsMenuItem>
    </DotsMenu>
  );
}
