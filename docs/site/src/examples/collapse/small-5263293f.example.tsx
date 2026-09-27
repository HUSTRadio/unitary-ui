import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseSmall5263293FExample() {
  return (
    <Collapse size="small" className="w-full max-w-sm rounded-[8px] border border-gray-alpha-400 p-3">
      <CollapseTrigger className="text-label-13 text-foreground">
        Question A
      </CollapseTrigger>
      <CollapseContent className="pt-1.5 text-copy-13 text-muted-foreground">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore magna aliqua.
      </CollapseContent>
    </Collapse>
  );
}
