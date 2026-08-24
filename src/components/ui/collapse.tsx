import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const CollapseContext = React.createContext(false);

type CollapseSize = "default" | "small";
type CollapseProps = React.ComponentProps<typeof CollapsiblePrimitive.Root> & {
  size?: CollapseSize;
};
type CollapseTriggerProps = React.ComponentProps<typeof CollapsiblePrimitive.Trigger>;
type CollapseContentProps = React.ComponentProps<typeof CollapsiblePrimitive.Content>;

/**
 * Collapse — 折叠面板（Radix Collapsible）。
 * Collapse（根，size=default/small 控制标题 padding py-6/py-3）/ CollapseTrigger（h3 内，含 chevron）
 * / CollapseContent（内容）。
 * 官方关闭态保留内容节点，使用 height:0 + inert；展开时测量实际高度并做 200ms 过渡。
 */
function Collapse({ size = "default", className, disabled = false, ...props }: CollapseProps) {
  return (
    <CollapseContext.Provider value={disabled}>
      <CollapsiblePrimitive.Root
        data-slot="collapse"
        data-size={size}
        className={cn("group w-full text-left", className)}
        {...props}
      />
    </CollapseContext.Provider>
  );
}

function CollapseTrigger({ className, children, ...props }: CollapseTriggerProps) {
  const disabled = React.useContext(CollapseContext);
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapse-trigger"
      {...props}
      aria-disabled={disabled || undefined}
      onClick={(event) => {
        props.onClick?.(event);
        if (disabled) event.preventDefault();
      }}
      className={cn("flex w-full items-center justify-between text-left", className)}
    >
      <span className="flex items-center py-6 group-data-[size=small]:py-3">{children}</span>
      <ChevronDown
        aria-hidden
        className="size-4 shrink-0 transition-transform duration-(--ds-duration-base) ease-in-out group-data-[state=open]:rotate-180"
      />
    </CollapsiblePrimitive.Trigger>
  );
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
        "collapse-content-motion overflow-y-hidden transition-all duration-(--ds-duration-base) ease-in-out",
        "data-[state=closed]:h-0",
        "data-[state=open]:h-[var(--collapse-content-height)]",
        className,
      )}
      {...props}
    />
  );
}

export { Collapse, CollapseTrigger, CollapseContent };
export type { CollapseSize, CollapseProps, CollapseTriggerProps, CollapseContentProps };
