import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseMultiple14070FDBExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Collapse size="small" defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
        <CollapseTrigger className="text-label-14 text-foreground">
          Question A
        </CollapseTrigger>
        <CollapseContent className="pt-2 text-copy-14 text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua.
        </CollapseContent>
      </Collapse>
      <Collapse size="small" defaultOpen className="rounded-[8px] border border-gray-alpha-400 p-4">
        <CollapseTrigger className="text-label-14 text-foreground">
          Question B
        </CollapseTrigger>
        <CollapseContent className="pt-2 text-copy-14 text-muted-foreground">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur.
        </CollapseContent>
      </Collapse>
    </div>
  );
}
