import { Collapse, CollapseContent, CollapseTrigger } from "@/components/ui/collapse";

export function CollapseDisabled2F7D5B6EExample() {
  return (
    <>
      <Collapse className="border-b">
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question A</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            正常状态：触发器可聚焦、可点击，键盘聚焦时显示内嵌焦点环。
          </p>
        </CollapseContent>
      </Collapse>
      <Collapse className="border-b" disabled>
        <h3 className="text-[24px] font-semibold text-foreground">
          <CollapseTrigger>Question B</CollapseTrigger>
        </h3>
        <CollapseContent>
          <p className="mb-4 text-copy-16 text-muted-foreground">
            不可达内容：禁用态触发器整体降不透明度并切换为 not-allowed 光标，点击不会展开。
          </p>
        </CollapseContent>
      </Collapse>
    </>
  );
}
