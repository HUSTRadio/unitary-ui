import * as React from "react";

import { DotsMenu, DotsMenuItem } from "@/components/ui/dots-menu";
import { cn } from "@/lib/utils";

/**
 * Toolbar — Apple HIG「Toolbars」的 Geist 化实现：窗口级工具操作组容器。
 *
 * - **分组**：`ToolbarGroup` 按 `slot`（leading / center / trailing）三段排布，
 *   组间共享间距；组内可放任意控件（ToolbarItem、MenuButton、搜索框等）。
 * - **溢出折叠**：空间不足时，可折叠组收起，组内的 `ToolbarItem` 以同样顺序进入
 *   尾部溢出菜单（DotsMenu），`disabled` 与 `active` 一并透传（HIG-AUD-039）。
 *   折叠以**组**为单位（不把任意控件塞进菜单）；组内默认仅当全部是 ToolbarItem
 *   时参与折叠——含搜索框 / MenuButton 等内容的组保持常驻（这类内容没有溢出入口，
 *   HIG-AUD-039），显式 `collapsible` 可覆盖。子节点经 Fragment 展平后收集
 *   （HIG-AUD-050），`<>…</>` 包裹分组或条目不影响折叠行为。
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
  /** 禁用态透传（HIG-AUD-039）：溢出菜单项同样不可用，而非只复制文案与回调。 */
  disabled?: boolean;
  /** 选中态透传（HIG-AUD-039）：溢出菜单项保留当前档提示。 */
  active?: boolean;
}

export interface ToolbarProps extends React.ComponentProps<"div"> {
  /** 空间不足时折叠可折叠组，默认 true */
  collapse?: boolean;
}

export interface ToolbarGroupProps extends React.ComponentProps<"div"> {
  /** 组所在位置（前 / 中 / 后），默认 "leading" */
  slot?: ToolbarSlot;
  /**
   * 空间不足时该组是否折叠进溢出菜单。未指定时按组内容决定：组内全部是
   * ToolbarItem 才折叠；含搜索框 / MenuButton / 自定义控件时保持常驻
   * （HIG-AUD-039——这类内容没有溢出入口）。
   */
  collapsible?: boolean;
}

/**
 * 工具项。`disabled` 继承自底层 button props：折叠后该状态同样透传到溢出
 * 菜单项（HIG-AUD-039），不会出现「界面禁用、菜单可点」的分裂。
 */
export interface ToolbarItemProps extends Omit<React.ComponentProps<"button">, "children"> {
  /** 行首图标（16px 档） */
  icon?: React.ReactNode;
  /** 项名称：既是可见文案，也是折叠进菜单后的菜单项文案与无障碍名称 */
  label: React.ReactNode;
  /** 点击回调 */
  onSelect?: () => void;
  /** 只显示图标（无障碍名称仍取 label） */
  iconOnly?: boolean;
  /** 选中态（如分段切换的当前档）；折叠后以 data-active + aria-current 透传 */
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

/**
 * 递归展平 Fragment / 数组子节点（HIG-AUD-050）：`<>…</>` 包裹分组或条目时，
 * 收集与折叠判定必须与 React 渲染看到同一批节点。null / 布尔条件槽位原样保留
 * （不打断「仅 ToolbarItem」判定）。
 */
function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      out.push(...flattenChildren((child.props as { children?: React.ReactNode }).children));
      return;
    }
    out.push(child);
  });
  return out;
}

/** 组内是否只含 ToolbarItem（忽略 null / 布尔等空槽位）。 */
function hasOnlyToolbarItems(children: React.ReactNode): boolean {
  return flattenChildren(children).every(
    (child) => child == null || typeof child === "boolean" || isToolbarItemElement(child),
  );
}

/**
 * 组是否参与折叠（HIG-AUD-039）：
 * - 显式 `collapsible` 优先（true 折叠 / false 常驻）；
 * - 未显式指定时，仅当组内全部是 ToolbarItem 才折叠——含搜索框 / MenuButton /
 *   自定义控件的组保持常驻，避免整组消失且溢出菜单无入口。
 */
function isCollapsibleGroup(props: ToolbarGroupProps): boolean {
  if (props.collapsible !== undefined) return props.collapsible;
  return hasOnlyToolbarItems(props.children);
}

/** 收集可折叠组内的 ToolbarItem，供溢出菜单复用其文案、回调与状态。 */
function collectCollapsedItems(children: React.ReactNode): CollapsedItem[] {
  const items: CollapsedItem[] = [];
  flattenChildren(children).forEach((group, groupIndex) => {
    if (!React.isValidElement(group)) return;
    const groupProps = group.props as ToolbarGroupProps;
    if (!isCollapsibleGroup(groupProps)) return;
    flattenChildren(groupProps.children).forEach((item, itemIndex) => {
      if (!isToolbarItemElement(item)) return;
      items.push({
        key: `${groupIndex}-${itemIndex}`,
        label: item.props.label,
        icon: item.props.icon,
        onSelect: item.props.onSelect,
        disabled: item.props.disabled,
        active: item.props.active,
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

  // dev 提示（HIG-AUD-039）：显式 collapsible={true} 且组内含非 ToolbarItem 内容时，
  // 这些内容没有溢出入口，折叠后会随组隐藏——给出可定位的告警而不是静默消失。
  React.useEffect(() => {
    if (!import.meta.env?.DEV) return;
    flattenChildren(children).forEach((group) => {
      if (!React.isValidElement(group)) return;
      const groupProps = group.props as ToolbarGroupProps;
      if (groupProps.collapsible === true && !hasOnlyToolbarItems(groupProps.children)) {
        console.warn(
          "[Toolbar] collapsible={true} 的组内含非 ToolbarItem 内容（搜索框 / MenuButton / 自定义控件）：折叠后这些内容不会进入溢出菜单，将随组隐藏。改传 collapsible={false}，或把这类内容移出可折叠组。",
        );
      }
    });
  }, [children]);

  return (
    <ToolbarCollapsedContext.Provider value={collapsed}>
      <div
        ref={containerRef}
        data-slot="toolbar"
      data-material="navigation"
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
              <DotsMenuItem
                key={item.key}
                prefix={item.icon}
                onSelect={item.onSelect}
                disabled={item.disabled}
                // 溢出菜单是命令菜单（非 stateful 语言菜单）：active 直落 data-active +
                // 常驻高亮，与 ToolbarItem 的选中态视觉一致；aria-current 表达「当前档」
                data-active={item.active || undefined}
                aria-current={item.active ? "true" : undefined}
                className={item.active ? "bg-gray-alpha-100" : undefined}
              >
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
  // 默认值不能在此落地为 true：要与收集器（读原始 props）看到同一份判定输入
  collapsible,
  className,
  children,
  ...props
}: ToolbarGroupProps) {
  const collapsed = React.useContext(ToolbarCollapsedContext);
  // 折叠以组为单位：整组收起，组内 ToolbarItem 转由溢出菜单承载。
  // 含非 ToolbarItem 内容的组默认保持常驻（HIG-AUD-039）——这类内容没有溢出
  // 入口，整组收起会让它们静默消失；显式 collapsible 时才按消费者意愿折叠。
  if (collapsed && isCollapsibleGroup({ collapsible, children })) return null;

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
        // pointer-coarse：触屏命中区 ≥44×44（HIG-AUD-013）；桌面维持 32px 视觉
        "flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-label-13 text-gray-1000 outline-none transition-colors pointer-coarse:min-h-11 pointer-coarse:min-w-11",
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
