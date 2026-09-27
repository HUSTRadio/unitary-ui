import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function ContextMenuLinkItems2FF9F194Example() {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div tabIndex={0} aria-label="Context menu target" className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground">
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-[160px]">
        <ContextMenuItem href="/">Item one</ContextMenuItem>
        <ContextMenuItem href="/">Item Two</ContextMenuItem>
        <ContextMenuItem href="/">Item Three</ContextMenuItem>
        <ContextMenuItem href="/">Item Four</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
