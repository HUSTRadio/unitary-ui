import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function ContextMenuDefault37A8EEC1Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div tabIndex={0} aria-label="Context menu target" className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground">
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[160px]">
        <ContextMenuItem>Item one</ContextMenuItem>
        <ContextMenuItem>Item Two</ContextMenuItem>
        <ContextMenuItem>Item Three</ContextMenuItem>
        <ContextMenuItem>Item Four</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
