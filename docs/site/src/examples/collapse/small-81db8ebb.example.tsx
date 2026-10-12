import { Collapse, CollapseContent, CollapseTrigger } from "@hustradio/unitary-ui";

export function CollapseSmall81DB8EBBExample() {
  return (
    <Collapse size="small" className="border-t border-b">
      <h3 className="text-[16px] font-medium text-foreground">
        <CollapseTrigger>Question A</CollapseTrigger>
      </h3>
      <CollapseContent>
        <p className="mb-4 text-copy-16 text-muted-foreground">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </CollapseContent>
    </Collapse>
  );
}
