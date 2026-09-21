import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ChevronDown, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

type CollapseIcon = "chevron" | "plus";
/**
 * 指示图标位置：
 * - end（默认）：推到行尾右对齐（`justify-between`）；
 * - inline：紧跟标题文字右侧（`justify-start` + 间距）。
 */
type CollapseIndicatorAlign = "inline" | "end";

/** 折叠面板上下文：size 走 data 属性；disabled / icon / indicatorAlign 需被 Trigger 读取。 */
interface CollapseContextValue {
  disabled: boolean;
  icon: CollapseIcon;
  indicatorAlign: CollapseIndicatorAlign;
}

const CollapseContext = React.createContext<CollapseContextValue>({
  disabled: false,
  icon: "chevron",
  indicatorAlign: "end",
});

/** bare：不施加标题内边距，行几何完全交给调用方（导航标题这类紧凑行）。 */
type CollapseSize = "default" | "small" | "bare";
type CollapseProps = React.ComponentProps<typeof CollapsiblePrimitive.Root> & {
  size?: CollapseSize;
  /** 指示图标语义：chevron（默认，展开转 180°）或 plus（展开逆时针 45° 变 ×）。 */
  icon?: CollapseIcon;
  /** 指示图标位置：end（默认，行尾右对齐）或 inline（标题右侧）。 */
  indicatorAlign?: CollapseIndicatorAlign;
};
type CollapseTriggerProps = React.ComponentProps<typeof CollapsiblePrimitive.Trigger> & {
  /** 覆盖根上的 icon 设置（同一 Collapse 只有一个触发器，按需就近声明）。 */
  icon?: CollapseIcon;
  /** 覆盖根上的指示图标位置。 */
  indicatorAlign?: CollapseIndicatorAlign;
  /**
   * 触发元素类型（默认原生 button）。传非按钮元素（如 "div"）时改用
   * role="button" + tabIndex + Enter/Space 键盘开关，且不引入任何按钮外观，
   * 供导航标题这类「只要一个简单 collapse」的场景使用。
   */
  as?: React.ElementType;
};
type CollapseContentProps = React.ComponentProps<typeof CollapsiblePrimitive.Content>;

/**
 * Collapse — 折叠面板（Radix Collapsible）。
 * Collapse（根，size=default/small 控制标题 padding py-6/py-3，icon=chevron/plus）
 * / CollapseTrigger（h3 内，含指示图标）/ CollapseContent（内容）。
 * 官方关闭态保留内容节点，使用 height:0 + inert；展开时测量实际高度并做过渡。
 * 动效走项目 Apple HIG 口径 token：开合 --uni-motion-state（250ms）+ ease-snap，
 * 图标旋转 --uni-motion-feedback（150ms）+ ease-snap。
 */
function Collapse({
  size = "default",
  icon = "chevron",
  indicatorAlign = "end",
  className,
  disabled = false,
  ...props
}: CollapseProps) {
  const contextValue = React.useMemo<CollapseContextValue>(
    () => ({ disabled, icon, indicatorAlign }),
    [disabled, icon, indicatorAlign],
  );

  return (
    <CollapseContext.Provider value={contextValue}>
      <CollapsiblePrimitive.Root
        data-slot="collapse"
        data-size={size}
        className={cn("group w-full text-left", className)}
        {...props}
      />
    </CollapseContext.Provider>
  );
}

function CollapseTrigger({
  className,
  children,
  icon,
  indicatorAlign,
  as,
  ...props
}: CollapseTriggerProps) {
  const context = React.useContext(CollapseContext);
  const { disabled } = context;
  const resolvedIcon = icon ?? context.icon;
  const align = indicatorAlign ?? context.indicatorAlign;
  // 非按钮触发元素：交给 Radix Slot 承载（Slot 会串接事件处理，开合逻辑仍由 Radix 负责）
  const plainElement = as !== undefined && as !== "button";
  const TriggerElement: React.ElementType = plainElement
    ? (as as React.ElementType)
    : CollapsiblePrimitive.Trigger;

  const triggerProps = {
    "data-slot": "collapse-trigger",
    "data-icon": resolvedIcon,
    "data-indicator-align": align,
    ...props,
    "aria-disabled": disabled || undefined,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      props.onClick?.(event as React.MouseEvent<HTMLButtonElement>);
      if (disabled) event.preventDefault();
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      props.onKeyDown?.(event as React.KeyboardEvent<HTMLButtonElement>);
      if (!plainElement || disabled) return;
      // 非按钮元素没有原生 Enter/Space 激活行为，这里补上等价语义
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.currentTarget.click();
    },
    className: cn(
      "flex w-full items-center rounded-sm text-left",
      // 指示图标位置：end = 推到行尾；inline = 紧跟标题
      align === "end" ? "justify-between" : "justify-start gap-1.5",
      "cursor-pointer outline-none focus-ring",
      // 禁用态视觉联动：整行（文本 + 图标）降不透明度并切换光标，语义仍由 aria-disabled 承担
      disabled && "cursor-not-allowed opacity-60",
      className,
    ),
  };

  const triggerBody = (
    <>
      <span className="flex items-center py-6 group-data-[size=small]:py-3 group-data-[size=bare]:py-0">
        {children}
      </span>
      {resolvedIcon === "plus" ? (
        <Plus
          aria-hidden
          className="size-4 shrink-0 transition-transform duration-(--uni-motion-feedback) ease-snap group-data-[state=open]:-rotate-45 motion-reduce:transition-none"
        />
      ) : (
        <ChevronDown
          aria-hidden
          className="size-4 shrink-0 transition-transform duration-(--uni-motion-feedback) ease-snap group-data-[state=open]:rotate-180 motion-reduce:transition-none"
        />
      )}
    </>
  );

  if (plainElement) {
    return (
      <CollapsiblePrimitive.Trigger asChild>
        <TriggerElement
          {...triggerProps}
          role="button"
          tabIndex={disabled ? undefined : 0}
        >
          {triggerBody}
        </TriggerElement>
      </CollapsiblePrimitive.Trigger>
    );
  }

  return <TriggerElement {...triggerProps}>{triggerBody}</TriggerElement>;
}

function CollapseContent({
  className,
  forceMount = true,
  ref,
  style,
  ...props
}: CollapseContentProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);
  const [closed, setClosed] = React.useState(true);

  React.useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const measure = () => setHeight(content.scrollHeight);
    const syncState = () => setClosed(content.dataset.state === "closed");
    measure();
    syncState();

    const mutationObserver = new MutationObserver(syncState);
    mutationObserver.observe(content, { attributes: true, attributeFilter: ["data-state"] });

    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    for (const child of content.children) resizeObserver?.observe(child);

    return () => {
      mutationObserver.disconnect();
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <CollapsiblePrimitive.Content
      data-slot="collapse-content"
      role="region"
      forceMount={forceMount}
      ref={(node) => {
        contentRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      inert={closed || undefined}
      style={
        {
          "--collapse-content-height": `${height}px`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "collapse-content-motion overflow-y-hidden transition-all duration-(--uni-motion-state) ease-snap motion-reduce:transition-none",
        "text-copy-16 text-muted-foreground",
        "data-[state=closed]:h-0",
        "data-[state=open]:h-[var(--collapse-content-height)]",
        className,
      )}
      {...props}
    />
  );
}

export { Collapse, CollapseTrigger, CollapseContent };
export type {
  CollapseIcon,
  CollapseIndicatorAlign,
  CollapseSize,
  CollapseProps,
  CollapseTriggerProps,
  CollapseContentProps,
};
