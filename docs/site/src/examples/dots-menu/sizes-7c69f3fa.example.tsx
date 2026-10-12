import { DotsMenu, DotsMenuItem } from "@hustradio/unitary-ui";

export function DotsMenuSizes7C69F3FAExample() {
  return (
    <div className="flex items-start gap-6">
      <DotsMenu iconSize={10}>
        <DotsMenuItem>View Build Logs</DotsMenuItem>
        <DotsMenuItem>View Projects</DotsMenuItem>
        <DotsMenuItem>View Analytics</DotsMenuItem>
      </DotsMenu>
      <DotsMenu iconSize={12}>
        <DotsMenuItem>View Build Logs</DotsMenuItem>
        <DotsMenuItem>View Projects</DotsMenuItem>
        <DotsMenuItem>View Analytics</DotsMenuItem>
      </DotsMenu>
      <DotsMenu iconSize={18}>
        <DotsMenuItem>View Build Logs</DotsMenuItem>
        <DotsMenuItem>View Projects</DotsMenuItem>
        <DotsMenuItem>View Analytics</DotsMenuItem>
      </DotsMenu>
    </div>
  );
}
