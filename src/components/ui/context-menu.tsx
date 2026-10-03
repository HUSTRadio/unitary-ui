import * as React from "react";
import { createPortal, flushSync } from "react-dom";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { getVisibleViewport, subscribeToVisualViewport } from "@/lib/visual-viewport";

const ContextMenu = ContextMenuPrimitive.Root;

/**
 * HIG-AUD-002：Radix 的 `ContextMenu.Trigger` 是**指针专用**原语——渲染为无 `role`、
 * 无 `tabIndex`、无 `onKeyDown` 的 `Primitive.span`，只绑定 `onContextMenu`
 * （`node_modules/@radix-ui/react-context-menu/dist/index.mjs:84-111`）。
 * 因此键盘用户**完全无法**打开右键菜单（WCAG 2.1.1 键盘可达）。
 *
 * 这里补上 APG 的标准键盘入口（与 Radix 官方文档给出的用法一致）：
 * - 触发器默认可聚焦（`tabIndex` 默认 0，调用方显式传入可覆盖）；
 * - `Shift+F10` 与 `ContextMenu` 键在触发器中心派发一次合成 `contextmenu` 事件，
 *   交由 Radix 自身的 `handleOpen`（读 `event.clientX/clientY`）定位并打开。
 *
 * 焦点归还**无需额外实现**：只要触发器本身可聚焦，Radix 的 `FocusScope` 就会记下
 * 「展开前的焦点元素」并在关闭后归还给它
 * （`node_modules/@radix-ui/react-focus-scope/dist/index.mjs:77-104`；
 * ContextMenu 的 `onCloseAutoFocus` 并不拦截该过程，
 * 见 `node_modules/@radix-ui/react-context-menu/dist/index.mjs:137-143`）。
 * 注意该归还在 `setTimeout(…, 0)` 中执行，断言焦点归还的测试必须多等一个宏任务。
 */
const ContextMenuTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Trigger>,
  ContextMenuTriggerProps
>(({ asChild, tabIndex, onKeyDown, className, ...props }, ref) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const isContextMenuKey = event.key === "ContextMenu";
    const isShiftF10 = event.shiftKey && event.key === "F10";
    if (!isContextMenuKey && !isShiftF10) return;
    event.preventDefault();
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      }),
    );
  };

  return (
    <ContextMenuPrimitive.Trigger
      ref={ref}
      asChild={asChild}
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      className={cn("focus-ring", className)}
      {...props}
    />
  );
});
ContextMenuTrigger.displayName = "ContextMenuTrigger";

type ContextMenuProps = React.ComponentProps<typeof ContextMenuPrimitive.Root>;
type ContextMenuTriggerProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Trigger>;
type ContextMenuContentProps = React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>;
type ContextMenuSeparatorProps = React.ComponentPropsWithoutRef<
  typeof ContextMenuPrimitive.Separator
>;

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuContentProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      onContextMenu={(event) => event.preventDefault()}
      className={cn(
        "z-[var(--uni-z-popover)] rounded-overlay bg-[var(--color-bg-elevated)] shadow-[var(--material-shadow-menu)] text-sm outline-hidden overflow-x-hidden overflow-y-auto p-[var(--uni-popover-padding)] overscroll-contain w-max",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-(--uni-duration-fast) motion-reduce:animate-none!",
        className,
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

interface ContextMenuItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>,
  "asChild" | "prefix" | "suffix"
> {
  inset?: boolean;
  value?: string;
  href?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const itemClassName =
  "relative flex h-(--uni-popover-row-height) cursor-pointer select-none items-center rounded-overlay-item px-2 text-label-14 outline-none transition-colors data-highlighted:bg-gray-alpha-100 data-[disabled]:pointer-events-none data-[disabled]:cursor-default data-[disabled]:text-gray-500 [&_svg]:size-4 [&_svg]:shrink-0";

const ContextMenuItem = React.forwardRef<HTMLElement, ContextMenuItemProps>(
  (
    { className, inset, value, href, prefix, suffix, children, disabled, onClick, ...props },
    ref,
  ) => {
    const content = (
      <>
        {prefix ? (
          <span data-context-menu-prefix className="mr-2 flex size-4 items-center">
            {prefix}
          </span>
        ) : null}
        <span>{children}</span>
        {suffix ? (
          <span data-context-menu-suffix className="ml-auto flex pl-3 items-center">
            {suffix}
          </span>
        ) : null}
      </>
    );

    if (href) {
      return (
        <ContextMenuPrimitive.Item asChild disabled={disabled} {...props}>
          <a
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
            href={href}
            role="menuitem"
            data-value={value}
            aria-disabled={disabled || undefined}
            data-disabled={disabled ? "" : undefined}
            onClick={onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
            className={cn(itemClassName, inset && "pl-8", className)}
          >
            {content}
          </a>
        </ContextMenuPrimitive.Item>
      );
    }

    return (
      <ContextMenuPrimitive.Item
        ref={ref as React.ForwardedRef<HTMLDivElement>}
        disabled={disabled}
        data-value={value}
        aria-disabled={disabled || undefined}
        onClick={onClick}
        className={cn(itemClassName, inset && "pl-8", className)}
        {...props}
      >
        {content}
      </ContextMenuPrimitive.Item>
    );
  },
);
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  ContextMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-gray-alpha-400", className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

/**
 * Quick Actions —— context-menu 的**触屏长按变体**（touchscreen only）。
 *
 * Apple HIG「Home Screen Quick Actions」：长按实体（app 图标、卡片）后浮现的竖排列表。
 * 与标准形态的差异：定宽、大图标 + 标题 + 可选副标题、背景模糊遮罩，
 * 底部系统项（如"移除 App"）用 Separator 隔开并标 destructive。
 *
 * 触发机制与标准形态共用 Radix ContextMenu（触屏长按已内建，桌面为右键）：
 * - **桌面右键场景请用 `ContextMenuContent`**（小尺寸横排菜单）。
 * - **触屏长按场景用 `ContextMenuQuickActionsContent`**（本变体）。
 *
 * ```tsx
 * <ContextMenu>
 *   <ContextMenuTrigger asChild><button>App icon</button></ContextMenuTrigger>
 *   <ContextMenuQuickActionsContent>
 *     <ContextMenuQuickActionsItem icon={<Plus />} title="New note" subtitle="Create a blank note" onSelect={…} />
 *     <ContextMenuSeparator />
 *     <ContextMenuQuickActionsItem icon={<Trash2 />} title="Remove App" destructive onSelect={…} />
 *   </ContextMenuQuickActionsContent>
 * </ContextMenu>
 * ```
 */

interface ContextMenuQuickActionsContentProps extends ContextMenuContentProps {
  /** 列表宽度（px，默认 224） */
  width?: number;
  /** 背景模糊遮罩（HIG 主屏观感的 Geist 化表达），默认 true */
  backdropBlur?: boolean;
}

const QUICK_ACTIONS_CONTENT_CLASS =
  "rounded-overlay bg-[var(--color-bg-elevated)] shadow-[var(--material-shadow-menu)] p-2 outline-hidden " +
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 " +
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 " +
  "duration-(--uni-duration-fast) motion-reduce:animate-none!";

const QUICK_ACTIONS_SCRIM_CLASS =
  "fixed inset-0 z-[var(--uni-z-drawer)] bg-[var(--uni-overlay-scrim-color)] backdrop-blur-(--uni-overlay-backdrop-blur) " +
  "duration-(--uni-motion-feedback) ease-snap motion-reduce:animate-none!";

/**
 * Quick Actions 背景遮罩。
 *
 * 必须挂在 `Content` 的 React 子树里（再 portal 到 body 以避开 popper 的 transform 包含块），
 * 而不能和 `Content` 并列挂在 `Portal` 下 —— 原因见 `ContextMenuQuickActionsContent`。
 * 这样遮罩与菜单同生共死，并跟随菜单的 animationstart 同步淡出。
 */
function QuickActionsScrim({ exiting }: { exiting: boolean }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-hidden="true"
      data-slot="context-menu-quick-actions-overlay"
      data-exiting={exiting ? "" : undefined}
      className={cn(
        QUICK_ACTIONS_SCRIM_CLASS,
        exiting ? "animate-out fade-out-0" : "animate-in fade-in-0",
      )}
    />,
    document.body,
  );
}

const ContextMenuQuickActionsContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuQuickActionsContentProps
>(({ className, width = 224, backdropBlur = true, style, children, onAnimationStart, ...props }, ref) => {
  // 遮罩不能与 Content 并列挂在 Portal 下：Radix MenuPortal 的 Presence 把 ref 挂到 Portal 的
  // 「唯一子元素」上（Portal asChild → Slot，Slot 只绑定单子节点）。一旦出现并列兄弟节点，
  // ref 就无处可挂，`context.open` 转 false 时 Presence 判定「无动画」并同步卸载整个 Portal：
  // Content 的 animate-out 与遮罩自身的退场会一起失效（并列渲染还会直接抛 Slot 报错）。
  // 因此把遮罩嵌进 Content —— 菜单退场恢复对称，遮罩与菜单同生共死。
  const [scrimExiting, setScrimExiting] = React.useState(false);
  const [contentNode, setContentNode] = React.useState<HTMLDivElement | null>(null);
  const composedRef = React.useCallback((node: HTMLDivElement | null) => {
    setContentNode(node);
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);
  const [horizontalOffset, setHorizontalOffset] = React.useState(0);

  React.useEffect(() => {
    const wrapper = contentNode?.parentElement;
    if (!wrapper) return;

    let frame = 0;
    const updateOffset = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // HIG-AUD-029：边界取**可见视口**（软键盘 / 双指缩放会改变它），
        // 订阅同样走共享契约，与编辑胶囊保持一致。
        const bounds = wrapper.getBoundingClientRect();
        const viewport = getVisibleViewport();
        const padding = Math.min(8, viewport.width / 2);
        const offset = Math.max(
          viewport.left + padding - bounds.left,
          Math.min(0, viewport.right - padding - bounds.right),
        );
        setHorizontalOffset((current) => current === offset ? current : offset);
      });
    };

    const observer = new ResizeObserver(updateOffset);
    observer.observe(wrapper);
    observer.observe(contentNode);
    const unsubscribeViewport = subscribeToVisualViewport(updateOffset);
    updateOffset();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      unsubscribeViewport();
    };
  }, [contentNode, width]);

  const handleAnimationStart = (event: React.AnimationEvent<HTMLDivElement>) => {
    // 只认 Content 自身的 enter/exit；冒泡自遮罩的事件忽略，避免自激。
    // flushSync：动画事件属于连续事件，默认会被并发调度推迟一帧以上，
    // 实测遮罩会滞后菜单约 70ms 才开始淡出；同步刷新才能与菜单严丝合缝。
    if (event.target === event.currentTarget) {
      if (event.animationName === "exit") flushSync(() => setScrimExiting(true));
      else if (event.animationName === "enter") flushSync(() => setScrimExiting(false));
    }
    onAnimationStart?.(event);
  };

  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        ref={composedRef}
        onContextMenu={(event) => event.preventDefault()}
        onAnimationStart={handleAnimationStart}
        // Radix PopperContent 会让 popper 包裹层继承 Content 的计算 z-index。
        // 这里显式抬到 --uni-z-popover，遮罩才能稳定停在菜单之下、页面之上。
        style={{ width, ...style, position: "relative", left: horizontalOffset, zIndex: "var(--uni-z-popover)" }}
        className={cn(QUICK_ACTIONS_CONTENT_CLASS, className)}
        {...props}
      >
        {backdropBlur ? <QuickActionsScrim exiting={scrimExiting} /> : null}
        {children}
      </ContextMenuPrimitive.Content>
    </ContextMenuPrimitive.Portal>
  );
});
ContextMenuQuickActionsContent.displayName = "ContextMenuQuickActionsContent";

interface ContextMenuQuickActionsItemProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>,
    "children" | "title"
  > {
  /** 行首大图标（20px 档） */
  icon?: React.ReactNode;
  /** 主标题（覆盖 DOM 的 string title 属性） */
  title: React.ReactNode;
  /** 副标题（13px muted） */
  subtitle?: React.ReactNode;
  /**
   * 破坏性项（系统尾项，如"移除 App"），渲染为红字。
   *
   * 按 HIG（pull-down-buttons）破坏性操作需「红字 + 二次确认」成对：本组件只负责
   * 红色语义与分隔位置，**确认浮层由消费方在 `onSelect` 中串接**——确认应出现在
   * 菜单之外的独立位置并可取消（参见 Quick Actions 示例的 Remove App 流程，
   * HIG-AUD-037）。直接执行会使用户误触即不可恢复。
   */
  destructive?: boolean;
}

const ContextMenuQuickActionsItem = React.forwardRef<
  HTMLDivElement,
  ContextMenuQuickActionsItemProps
>(({ className, icon, title, subtitle, destructive, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "flex cursor-pointer select-none items-start gap-3 rounded-overlay-item px-2 py-2.5 text-left outline-none transition-colors",
      "data-highlighted:bg-gray-alpha-100 data-[disabled]:pointer-events-none data-[disabled]:text-gray-500",
      destructive && "text-error-foreground",
      className,
    )}
    {...props}
  >
    {icon ? (
      <span
        aria-hidden="true"
        className="mt-px flex size-5 shrink-0 items-center justify-center [&_svg]:size-5"
      >
        {icon}
      </span>
    ) : null}
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="truncate text-label-14">{title}</span>
      {subtitle ? (
        <span className="truncate text-copy-13 text-gray-900">{subtitle}</span>
      ) : null}
    </span>
  </ContextMenuPrimitive.Item>
));
ContextMenuQuickActionsItem.displayName = "ContextMenuQuickActionsItem";

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuQuickActionsContent,
  ContextMenuQuickActionsItem,
};
export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuSeparatorProps,
  ContextMenuQuickActionsContentProps,
  ContextMenuQuickActionsItemProps,
};
