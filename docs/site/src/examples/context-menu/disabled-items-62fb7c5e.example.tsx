import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function ContextMenuDisabledItems62FB7C5EExample() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div tabIndex={0} aria-label="Context menu target" className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground">
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[160px]">
        <ContextMenuItem>Item one</ContextMenuItem>
        <ContextMenuItem disabled>Item Two</ContextMenuItem>
        <ContextMenuItem disabled>Item Three</ContextMenuItem>
        <ContextMenuItem>Item Four</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
