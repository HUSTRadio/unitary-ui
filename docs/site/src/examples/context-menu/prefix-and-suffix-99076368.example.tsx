import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@hustradio/unitary-ui";
import { Triangle } from "lucide-react";

export function ContextMenuPrefixAndSuffix99076368Example() {
  const icon = <Triangle className="size-4" aria-hidden />;

  return (
    <div className="flex flex-col items-stretch justify-start gap-6 md:flex-row">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div tabIndex={0} aria-label="Context menu target" className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground">
            Right click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-[160px]">
          <ContextMenuItem href="/" prefix={icon}>Item one</ContextMenuItem>
          <ContextMenuItem href="/" prefix={icon}>Item Two</ContextMenuItem>
          <ContextMenuItem href="/" prefix={icon}>Item Three</ContextMenuItem>
          <ContextMenuItem href="/" prefix={icon}>Item Four</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div tabIndex={0} aria-label="Context menu target" className="w-[300px] rounded-[4px] border border-dashed border-gray-alpha-600 py-[45px] text-center text-copy-14 text-foreground">
            Right click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-[160px]">
          <ContextMenuItem href="/" suffix={icon}>Item one</ContextMenuItem>
          <ContextMenuItem href="/" suffix={icon}>Item Two</ContextMenuItem>
          <ContextMenuItem href="/" suffix={icon}>Item Three</ContextMenuItem>
          <ContextMenuItem href="/" suffix={icon}>Item Four</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
