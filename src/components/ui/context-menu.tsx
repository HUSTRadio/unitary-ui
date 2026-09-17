import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const ContextMenu = ContextMenuPrimitive.Root;
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

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
        "rounded-overlay bg-[var(--color-bg-elevated)] shadow-[var(--material-shadow-menu)] text-sm outline-hidden overflow-x-hidden overflow-y-auto p-1.5 overscroll-contain w-max max-sm:w-full max-sm:rounded-b-none",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none",
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
  "relative flex h-9 cursor-pointer select-none items-center rounded-overlay-item px-2 text-label-14 outline-none transition-colors data-highlighted:bg-gray-alpha-100 data-[disabled]:pointer-events-none data-[disabled]:cursor-default data-[disabled]:text-gray-500 [&_svg]:size-4 [&_svg]:shrink-0";

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
  "rounded-overlay bg-[var(--color-bg-elevated)] shadow-[var(--material-shadow-menu)] p-2 outline-hidden max-sm:w-full max-sm:rounded-b-none " +
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 " +
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none";

const ContextMenuQuickActionsContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  ContextMenuQuickActionsContentProps
>(({ className, width = 224, backdropBlur = true, style, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    {backdropBlur ? (
      <div
        aria-hidden="true"
        data-slot="context-menu-quick-actions-overlay"
        className="fixed inset-0 z-[var(--uni-z-popover)] bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none"
      />
    ) : null}
    <ContextMenuPrimitive.Content
      ref={ref}
      onContextMenu={(event) => event.preventDefault()}
      style={{ width, ...style }}
      className={cn(QUICK_ACTIONS_CONTENT_CLASS, className)}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
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
  /** 破坏性项（系统尾项，如"移除 App"） */
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
      destructive && "text-[#ee0000]",
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
