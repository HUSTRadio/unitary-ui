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

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
};
export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuSeparatorProps,
};
