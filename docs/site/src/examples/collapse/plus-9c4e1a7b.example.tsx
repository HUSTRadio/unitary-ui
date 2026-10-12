import { Collapse, CollapseContent, CollapseTrigger } from "@hustradio/unitary-ui";

export function CollapsePlus9C4E1A7BExample() {
  return (
    <>
      <Collapse icon="plus" className="border-b">
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question A</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            Plus 图标展开时逆时针旋转 45° 变成 ×，收起时回到加号，适合 FAQ 这类「展开更多」的语义。
          </p>
        </CollapseContent>
      </Collapse>
      <Collapse icon="plus" className="border-b" defaultOpen>
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question B</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            旋转走高频微反馈档位（--uni-motion-feedback），与悬停、颜色变化保持同一节奏。
          </p>
        </CollapseContent>
      </Collapse>
    </>
  );
}
