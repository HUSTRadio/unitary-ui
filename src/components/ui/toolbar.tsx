import * as React from "react";

import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";
import { cn } from "@/lib/utils";

/**
 * Toolbar — Apple HIG「Toolbars」的 Geist 化实现：窗口级工具操作组容器。
 *
 * - **分组**：`ToolbarGroup` 按 `slot`（leading / center / trailing）三段排布，
 *   组间共享间距；组内可放任意控件（ToolbarItem、MenuButton、搜索框等）。
 * - **溢出折叠**：空间不足时，标记为 `collapsible` 的组（默认全部可折叠）收起，
 *   组内的 `ToolbarItem` 以同样顺序进入尾部溢出菜单（DotsMenu）。
 *   折叠以**组**为单位（避免把任意控件塞进菜单），非 ToolbarItem 内容不进入菜单。
 * - **与 Navbar 的边界**：Navbar 是页面级导航容器（路由/锚点 + 滚动行为）；
 *   Toolbar 是工具操作组（命令按钮），两者可组合使用但不互换。
 *
 * 折叠测量：`ResizeObserver` 比较容器 clientWidth 与展开态内容宽度，
 * 展开启用 +24px 滞回，避免临界宽度抖动。
 *
 * ```tsx
 * <Toolbar>
 *   <ToolbarGroup slot="leading">
 *     <ToolbarItem label="Reload" onSelect={reload} />
 *   </ToolbarGroup>
 *   <ToolbarGroup slot="trailing">
 *     <ToolbarItem label="Share" onSelect={share} />
 *   </ToolbarGroup>
 * </Toolbar>
 * ```
 */

export type ToolbarSlot = "leading" | "center" | "trailing";

/** 折叠状态由 Toolbar 下发给 ToolbarGroup（组级折叠，不做逐项测量）。 */
const ToolbarCollapsedContext = React.createContext(false);

/** 折叠菜单项：从可折叠组的 ToolbarItem 上读取，不重新渲染原控件。 */
interface CollapsedItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

export interface ToolbarProps extends React.ComponentProps<"div"> {
  /** 空间不足时折叠可折叠组，默认 true */
  collapse?: boolean;
}

export interface ToolbarGroupProps extends React.ComponentProps<"div"> {
  /** 组所在位置（前 / 中 / 后），默认 "leading" */
  slot?: ToolbarSlot;
  /** 空间不足时该组是否折叠进溢出菜单，默认 true */
  collapsible?: boolean;
}

export interface ToolbarItemProps extends Omit<React.ComponentProps<"button">, "children"> {
  /** 行首图标（16px 档） */
  icon?: React.ReactNode;
  /** 项名称：既是可见文案，也是折叠进菜单后的菜单项文案与无障碍名称 */
  label: React.ReactNode;
  /** 点击回调 */
  onSelect?: () => void;
  /** 只显示图标（无障碍名称仍取 label） */
  iconOnly?: boolean;
  /** 选中态（如分段切换的当前档） */
  active?: boolean;
}

const SLOT_CLASS: Record<ToolbarSlot, string> = {
  leading: "",
  center: "mx-auto",
  trailing: "ml-auto",
};

function isToolbarItemElement(node: React.ReactNode): node is React.ReactElement<ToolbarItemProps> {
  return React.isValidElement(node) && node.type === ToolbarItem;
}

/** 收集可折叠组内的 ToolbarItem，供溢出菜单复用其文案与回调。 */
function collectCollapsedItems(children: React.ReactNode): CollapsedItem[] {
  const items: CollapsedItem[] = [];
  React.Children.forEach(children, (group, groupIndex) => {
    if (!React.isValidElement(group)) return;
    const groupProps = group.props as ToolbarGroupProps;
    if (groupProps.collapsible === false) return;
    React.Children.forEach(groupProps.children, (item, itemIndex) => {
      if (!isToolbarItemElement(item)) return;
      items.push({
        key: `${groupIndex}-${itemIndex}`,
        label: item.props.label,
        icon: item.props.icon,
        onSelect: item.props.onSelect,
      });
    });
  });
  return items;
}

function Toolbar({ className, children, collapse = true, ...props }: ToolbarProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const requiredWidthRef = React.useRef(0);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element || !collapse || typeof ResizeObserver === "undefined") return;

    const update = () => {
      const available = element.clientWidth;
      if (!collapsed) {
        requiredWidthRef.current = element.scrollWidth;
        if (element.scrollWidth > available + 1) {
          setCollapsed(true);
          return;
        }
      } else if (available > requiredWidthRef.current + 24) {
        // 滞回 24px：避免临界宽度下反复折叠/展开
        setCollapsed(false);
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [collapse, collapsed]);

  const collapsedItems = React.useMemo(() => collectCollapsedItems(children), [children]);

  return (
    <ToolbarCollapsedContext.Provider value={collapsed}>
      <div
        ref={containerRef}
        data-slot="toolbar"
        data-collapsed={collapsed || undefined}
        className={cn(
          "flex w-full items-center gap-1 overflow-hidden rounded-lg bg-background p-1 shadow-[0_0_0_1px_var(--gray-alpha-400)]",
          className,
        )}
        {...props}
      >
        {children}
        {collapsed && collapsedItems.length > 0 ? (
          <DotsMenu>
            {collapsedItems.map((item) => (
              <DotsMenuItem key={item.key} prefix={item.icon} onSelect={item.onSelect}>
                {item.label}
              </DotsMenuItem>
            ))}
          </DotsMenu>
        ) : null}
      </div>
    </ToolbarCollapsedContext.Provider>
  );
}

function ToolbarGroup({
  slot = "leading",
  collapsible = true,
  className,
  children,
  ...props
}: ToolbarGroupProps) {
  const collapsed = React.useContext(ToolbarCollapsedContext);
  // 折叠以组为单位：整组收起，组内 ToolbarItem 转由溢出菜单承载
  if (collapsed && collapsible) return null;

  return (
    <div
      data-slot="toolbar-group"
      data-toolbar-slot={slot}
      className={cn("flex min-w-0 items-center gap-1", SLOT_CLASS[slot], className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ToolbarItem({
  icon,
  label,
  onSelect,
  iconOnly,
  active,
  className,
  ...props
}: ToolbarItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={typeof label === "string" ? label : undefined}
      aria-pressed={active}
      data-slot="toolbar-item"
      data-active={active || undefined}
      className={cn(
        "flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-label-13 text-gray-1000 outline-none transition-colors",
        "hover:bg-gray-alpha-100 focus-visible:bg-gray-alpha-100",
        active && "bg-gray-alpha-200",
        "disabled:pointer-events-none disabled:text-gray-700",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex size-4 items-center justify-center [&_svg]:size-4"
        >
          {icon}
        </span>
      ) : null}
      {iconOnly ? null : <span className="truncate">{label}</span>}
    </button>
  );
}

export { Toolbar, ToolbarGroup, ToolbarItem };
