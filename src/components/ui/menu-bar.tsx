import * as React from "react";
import { Menubar as MenubarPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * MenuBar — Apple HIG「The Menu Bar」的 Geist 化实现：水平应用菜单栏。
 *
 * 结构：顶级菜单横向排列（File / Edit / View …），点击或键盘展开命令菜单，
 * 菜单项支持右对齐**键盘快捷键**、分隔线、子菜单、勾选态与禁用态。
 *
 * **与 Navbar 的边界**：Navbar 是页面级导航容器（链接 + 滚动行为）；
 * MenuBar 是应用级命令菜单（动词命令 + 快捷键 + 子菜单），两者可组合但不互换。
 *
 * 键盘模型由 Radix Menubar 承担（ARIA menubar）：
 * 左右方向键切换顶级菜单、上下键进入菜单项、Enter/Space 激活、Esc 逐级关闭。
 *
 * 快捷键**只做展示**，实际按键绑定由调用方接入——组件不注册全局监听。
 *
 * ```tsx
 * <MenuBar>
 *   <MenuBarMenu>
 *     <MenuBarTrigger>File</MenuBarTrigger>
 *     <MenuBarContent>
 *       <MenuBarItem shortcut="⌘N">New Window</MenuBarItem>
 *       <MenuBarSeparator />
 *       <MenuBarCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
 *         Show Hidden Files
 *       </MenuBarCheckboxItem>
 *     </MenuBarContent>
 *   </MenuBarMenu>
 * </MenuBar>
 * ```
 */

const MENU_BAR_SURFACE =
  "z-[var(--uni-z-popover)] min-w-48 overflow-x-hidden overflow-y-auto rounded-overlay bg-surface p-1.5 text-foreground shadow-[var(--material-shadow-menu)] outline-none " +
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 " +
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 " +
  "duration-(--uni-duration-fast) motion-reduce:animate-none!";

const MENU_BAR_ITEM_BASE =
  "relative flex h-9 cursor-pointer select-none items-center rounded-overlay-item px-2 text-label-14 outline-none transition-colors " +
  "data-highlighted:bg-gray-alpha-100 data-[disabled]:pointer-events-none data-[disabled]:text-gray-500";

/** 菜单项右侧的快捷键区（HIG：右对齐、弱化色）。 */
function MenuBarShortcut({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className={cn("ml-auto pl-4 text-copy-13 tracking-wide text-gray-900", className)}
    >
      {children}
    </span>
  );
}

const MenuBar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, onScroll, style, ...props }, ref) => {
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const [edges, setEdges] = React.useState({ left: false, right: false });
  const updateEdges = React.useCallback(() => {
    if (!root) return;
    const left = root.scrollLeft > 1;
    const right = root.scrollWidth - root.clientWidth - root.scrollLeft > 1;
    setEdges((previous) =>
      previous.left === left && previous.right === right ? previous : { left, right },
    );
  }, [root]);

  React.useLayoutEffect(() => {
    if (!root) return;
    updateEdges();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateEdges);
    observer?.observe(root);
    if (root.firstElementChild) observer?.observe(root.firstElementChild);
    return () => observer?.disconnect();
  }, [root, updateEdges]);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      setRoot(node);
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  return (
    <MenubarPrimitive.Root
      {...props}
      ref={setRefs}
      data-slot="menu-bar"
      data-overflow-left={edges.left || undefined}
      data-overflow-right={edges.right || undefined}
      onScroll={(event) => {
        updateEdges();
        onScroll?.(event);
      }}
      style={{
        ...style,
        maskImage: edges.left && edges.right
          ? "linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)"
          : edges.left
            ? "linear-gradient(to right, transparent, black 16px)"
            : edges.right
              ? "linear-gradient(to left, transparent, black 16px)"
              : style?.maskImage,
      }}
      className={cn(
        "flex h-9 w-fit max-w-full items-center gap-0.5 overflow-x-auto rounded-lg bg-background p-1 shadow-[0_0_0_1px_var(--gray-alpha-400)]",
        className,
      )}
    />
  );
});
MenuBar.displayName = "MenuBar";

// 显式注解避免 TS2883：inferred 类型引用了 radix 内部 Scope，无法在 .d.ts 中命名
const MenuBarMenu: typeof MenubarPrimitive.Menu = MenubarPrimitive.Menu;

const MenuBarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    data-slot="menu-bar-trigger"
    className={cn(
      // pointer-coarse：触屏命中区 ≥44×44（HIG-AUD-013）；桌面维持 28px 视觉。
      // 补 min-w：短标签（如「编辑」）宽度约 36px，不补宽则不达 44
      "flex h-7 shrink-0 cursor-pointer select-none items-center rounded-md px-2 text-label-13 text-gray-1000 outline-none transition-colors pointer-coarse:min-h-11 pointer-coarse:min-w-11",
      "hover:bg-gray-alpha-100 data-[state=open]:bg-gray-alpha-200 data-[disabled]:pointer-events-none data-[disabled]:text-gray-700",
      className,
    )}
    {...props}
  />
));
MenuBarTrigger.displayName = "MenuBarTrigger";

const MenuBarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content
      ref={ref}
      data-slot="menu-bar-content"
      className={cn(
        MENU_BAR_SURFACE,
        // HIG-AUD-038：长菜单必须受可用高度约束（与 menu.tsx 的做法一致），
        // 否则溢出视口下沿，且 Menubar modal 锁 body 滚动后尾部菜单项不可达。
        "max-h-[var(--radix-menubar-content-available-height)]",
        className,
      )}
      {...props}
    />
  </MenubarPrimitive.Portal>
));
MenuBarContent.displayName = "MenuBarContent";

interface MenuBarItemProps extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> {
  /** 右对齐快捷键（仅展示，不绑定按键） */
  shortcut?: React.ReactNode;
  /** 无图标时与勾选项对齐 */
  inset?: boolean;
}

const MenuBarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  MenuBarItemProps
>(({ className, children, shortcut, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    data-slot="menu-bar-item"
    className={cn(MENU_BAR_ITEM_BASE, inset && "pl-8", className)}
    {...props}
  >
    {children}
    {shortcut ? <MenuBarShortcut>{shortcut}</MenuBarShortcut> : null}
  </MenubarPrimitive.Item>
));
MenuBarItem.displayName = "MenuBarItem";

interface MenuBarCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem> {
  /** 右对齐快捷键（仅展示，不绑定按键） */
  shortcut?: React.ReactNode;
}

const MenuBarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  MenuBarCheckboxItemProps
>(({ className, children, shortcut, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    checked={checked}
    data-slot="menu-bar-checkbox-item"
    className={cn(MENU_BAR_ITEM_BASE, "pl-8", className)}
    {...props}
  >
    <MenubarPrimitive.ItemIndicator className="absolute left-2 inline-flex size-4 items-center justify-center">
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 fill-none stroke-current">
        <path d="M3 8.5 6.5 12 13 4.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </MenubarPrimitive.ItemIndicator>
    {children}
    {shortcut ? <MenuBarShortcut>{shortcut}</MenuBarShortcut> : null}
  </MenubarPrimitive.CheckboxItem>
));
MenuBarCheckboxItem.displayName = "MenuBarCheckboxItem";

const MenuBarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    data-slot="menu-bar-separator"
    className={cn("-mx-1 my-1 h-px bg-gray-alpha-400", className)}
    {...props}
  />
));
MenuBarSeparator.displayName = "MenuBarSeparator";

const MenuBarSub = MenubarPrimitive.Sub;

const MenuBarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    data-slot="menu-bar-sub-trigger"
    className={cn(
      MENU_BAR_ITEM_BASE,
      "data-[state=open]:bg-gray-alpha-100",
      className,
    )}
    {...props}
  >
    {children}
    <svg viewBox="0 0 16 16" aria-hidden="true" className="ml-auto size-4 fill-none stroke-current">
      <path d="M6 3.5 10.5 8 6 12.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </MenubarPrimitive.SubTrigger>
));
MenuBarSubTrigger.displayName = "MenuBarSubTrigger";

const MenuBarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => {
  const [content, setContent] = React.useState<HTMLDivElement | null>(null);
  const [inset, setInset] = React.useState(0);
  const setRefs = React.useCallback((node: HTMLDivElement | null) => {
    setContent(node);
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);
  const updateInset = React.useCallback(() => {
    if (!content) return;
    const trigger = document.getElementById(content.getAttribute("aria-labelledby") ?? "");
    if (!trigger) return;
    // 两侧都放不下时，允许子菜单与父菜单局部重叠，避免 Popper 翻转后仍越界。
    const triggerRect = trigger.getBoundingClientRect();
    const width = content.offsetWidth;
    setInset(Math.min(0, window.innerWidth - triggerRect.right - width));
  }, [content]);
  React.useLayoutEffect(() => {
    if (!content) return;
    updateInset();
    window.addEventListener("resize", updateInset);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateInset);
    observer?.observe(content);
    return () => {
      window.removeEventListener("resize", updateInset);
      observer?.disconnect();
    };
  }, [content, updateInset]);

  return (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.SubContent
        {...props}
        ref={setRefs}
        data-slot="menu-bar-sub-content"
        className={cn(
          MENU_BAR_SURFACE,
          // HIG-AUD-038：子菜单同样受可用高度约束；Radix 提供 popper 原生变量。
          "max-h-[var(--radix-popper-available-height)]",
          className,
        )}
        sideOffset={inset}
      />
    </MenubarPrimitive.Portal>
  );
});
MenuBarSubContent.displayName = "MenuBarSubContent";

export {
  MenuBar,
  MenuBarMenu,
  MenuBarTrigger,
  MenuBarContent,
  MenuBarItem,
  MenuBarCheckboxItem,
  MenuBarSeparator,
  MenuBarSub,
  MenuBarSubTrigger,
  MenuBarSubContent,
};
export type { MenuBarItemProps, MenuBarCheckboxItemProps };
