import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseDefault37A8EEC1Example() {
  return (
    <>
    <Collapse className="border-b">
      <h3 className="text-[24px] font-semibold text-foreground">
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
    <Collapse className="border-b">
      <h3 className="text-[24px] font-semibold text-foreground">
        <CollapseTrigger>Question B</CollapseTrigger>
      </h3>
      <CollapseContent>
        <p className="mb-4 text-copy-16 text-muted-foreground">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
      </CollapseContent>
    </Collapse>
    </>
  );
}
