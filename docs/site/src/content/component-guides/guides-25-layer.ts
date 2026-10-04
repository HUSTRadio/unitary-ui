import type { ComponentGuide } from "../component-guide-schema";

function guide(zh: boolean): ComponentGuide {
  return {
    slug: "layer", locale: zh ? "zh-CN" : "en-US",
    summary: zh ? "统一语义层级、局部覆盖和 Portal 边界。" : "Control semantic levels, local overrides and portal boundaries.",
    whenToUse: [zh ? "自定义层叠内容，或局部修改现有浮层的层级。" : "Create layered content or locally override existing overlay levels."],
    whenNotToUse: [zh ? "只需要材质或阴影时使用 Materials。" : "Use Materials when only visual depth is needed."],
    examples: [
      { id: "default", kind: "minimal", title: zh ? "语义层级" : "Semantic levels", description: zh ? "切换局部层级并验证覆盖顺序。" : "Change local levels and inspect stacking order.", demoKey: "default" },
      { id: "scoped", kind: "stateful", title: zh ? "作用域" : "Scopes", description: zh ? "局部浮层与独立作用域。" : "Local overlays and independent scopes.", demoKey: "scoped" },
      { id: "portal", kind: "minimal", title: "Portal", description: zh ? "显式容器与自定义元素。" : "Explicit containers and custom elements.", demoKey: "portal" },
    ],
    accessibility: { status: "covered", content: [zh ? "布局原语保持内容语义；焦点与关闭行为由浮层组件负责。" : "Layout primitives preserve content semantics; overlay components own focus and dismissal."] },
    controlledBehavior: { status: "covered", content: [zh ? "levels 由调用方控制，移除覆盖后恢复继承值。" : "The caller controls levels; removing overrides restores inherited values."] },
    responsiveBehavior: { status: "not-applicable", reason: zh ? "层级不根据视口自动变化。" : "Levels do not change automatically with the viewport." },
    themeBehavior: { status: "covered", content: [zh ? "层级不改变颜色；材质继续响应主题。" : "Levels do not change colors; materials retain theme behavior."] },
  };
}
export const LAYER_GUIDES_ZH = { layer: guide(true) };
export const LAYER_GUIDES_EN = { layer: guide(false) };
