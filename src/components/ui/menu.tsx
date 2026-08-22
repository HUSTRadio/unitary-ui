import * as React from "react";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import { ChevronDown, Lock } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MenuPosition =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";

const MenuPositionContext = React.createContext<MenuPosition>("bottom-start");

/**
 * stateful 声明：该菜单包含持久状态项（如语言切换的当前选中项）。
 * - 声明后：容器切换为 flex-col 布局并在 items 间引入 gap-1（4px，Geist 间距尺度），
 *   MenuItem 的 active 持久态样式才会生效
 * - 未声明：保持官方默认（items 块级堆叠、零间隙、active 不生效）——
 *   官方 vercel.com/geist/menu 实测 items gap=0，普通菜单无此问题
 */
const MenuStatefulContext = React.createContext(false);

export type MenuContainerProps = React.ComponentProps<typeof MenuPrimitive.Root> & {
  position?: MenuPosition;
};

function MenuContainer({ position = "bottom-start", children, ...props }: MenuContainerProps) {
  return (
    <MenuPositionContext.Provider value={position}>
      <MenuPrimitive.Root {...props}>{children}</MenuPrimitive.Root>
    </MenuPositionContext.Provider>
  );
}

export interface MenuButtonProps extends Omit<ButtonProps, "type"> {
  /** "unstyled" renders a plain button; otherwise passes visual type to Button */
  variant?: "unstyled" | ButtonProps["type"];
  showChevron?: boolean;
}

const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  (
    {
      className,
      children,
      variant,
      showChevron = false,
      prefix,
      suffix,
      size,
      shape,
      loading,
      asChild,
      disabled,
      ...props
    },
    ref,
  ) => (
    <MenuPrimitive.Trigger asChild>
      {variant === "unstyled" ? (
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          className={cn("outline-none", className)}
          {...props}
        >
          {children}
        </button>
      ) : (
        <Button
          ref={ref}
          typeName="button"
          type={variant}
          size={size}
          shape={shape}
          loading={loading}
          asChild={asChild}
          disabled={disabled}
          prefix={prefix}
          suffix={showChevron ? <ChevronDown aria-hidden /> : suffix}
          className={className}
          {...props}
        >
          {children}
        </Button>
      )}
    </MenuPrimitive.Trigger>
  ),
);
MenuButton.displayName = "MenuButton";

const positionProps: Record<
  MenuPosition,
  Pick<React.ComponentProps<typeof MenuPrimitive.Content>, "side" | "align">
> = {
  "bottom-start": { side: "bottom", align: "start" },
  "bottom-end": { side: "bottom", align: "end" },
  "top-start": { side: "top", align: "start" },
  "top-end": { side: "top", align: "end" },
  "left-start": { side: "left", align: "start" },
  "left-end": { side: "left", align: "end" },
  "right-start": { side: "right", align: "start" },
  "right-end": { side: "right", align: "end" },
};

export type MenuContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>,
  "width"
> & {
  width?: number | string;
  /**
   * 显式声明该菜单含持久状态项（如当前语言选中项）。
   * 声明后 items 间获得 4px 间隙，且 MenuItem 的 active 属性生效。
   */
  stateful?: boolean;
};

const Menu = React.forwardRef<React.ElementRef<typeof MenuPrimitive.Content>, MenuContentProps>(
  ({ className, sideOffset = 4, style, width, stateful = false, ...props }, ref) => {
    const position = React.useContext(MenuPositionContext);

    return (
      <MenuStatefulContext.Provider value={stateful}>
        <MenuPrimitive.Portal>
          <MenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            {...positionProps[position]}
            data-slot="menu"
            data-stateful={stateful || undefined}
            className={cn(
              "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-32 overflow-x-hidden overflow-y-auto rounded-[12px] bg-surface p-1.5 text-foreground shadow-[var(--material-shadow-menu)] outline-none",
              stateful && "flex flex-col gap-1",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none",
              className,
            )}
            style={{ ...style, width }}
            {...props}
          />
        </MenuPrimitive.Portal>
      </MenuStatefulContext.Provider>
    );
  },
);
Menu.displayName = "Menu";

export interface MenuItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>,
  "asChild" | "prefix"
> {
  href?: string;
  type?: "default" | "error";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  /**
   * 持久选中态（如语言菜单当前语言）。仅在父级 Menu 声明 stateful 时生效；
   * 普通菜单（官方零间隙模型）下忽略，避免常驻背景与相邻项 hover 背景互相干扰。
   */
  active?: boolean;
}

const MenuItem = React.forwardRef<React.ElementRef<typeof MenuPrimitive.Item>, MenuItemProps>(
  (
    {
      className,
      children,
      disabled,
      href,
      type = "default",
      prefix,
      suffix,
      active = false,
      ...props
    },
    ref,
  ) => {
    const stateful = React.useContext(MenuStatefulContext);
    const isActive = stateful && active;
    const content = (
      <>
        {prefix && (
          <span
            className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
            aria-hidden
          >
            {prefix}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {suffix && (
          <span
            className="ml-auto flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
            aria-hidden
          >
            {suffix}
          </span>
        )}
      </>
    );

    return (
      <MenuPrimitive.Item
        ref={ref}
        asChild={Boolean(href)}
        disabled={disabled}
        data-slot="menu-item"
        data-type={type}
        data-active={isActive || undefined}
        className={cn(
          "relative flex h-9 cursor-default select-none items-center gap-2 rounded-md px-2 text-label-14 text-foreground outline-none transition-colors data-highlighted:bg-gray-alpha-100 data-[disabled]:pointer-events-none data-[disabled]:text-gray-700 data-[disabled]:opacity-100",
          isActive && "bg-gray-alpha-100",
          type === "error" &&
            "text-error-foreground data-highlighted:bg-destructive data-highlighted:text-destructive-foreground",
          className,
        )}
        {...props}
      >
        {href ? <a href={href}>{content}</a> : content}
      </MenuPrimitive.Item>
    );
  },
);
MenuItem.displayName = "MenuItem";

export type MenuLinkProps = MenuItemProps & { href: string };

const MenuLink = React.forwardRef<React.ElementRef<typeof MenuPrimitive.Item>, MenuLinkProps>(
  (props, ref) => <MenuItem ref={ref} {...props} />,
);
MenuLink.displayName = "MenuLink";

export type MenuItemLockedProps = Omit<MenuItemProps, "disabled" | "suffix">;

const MenuItemLocked = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  MenuItemLockedProps
>(({ children, ...props }, ref) => (
  <MenuItem ref={ref} disabled suffix={<Lock aria-hidden />} {...props}>
    {children}
  </MenuItem>
));
MenuItemLocked.displayName = "MenuItemLocked";

export type MenuDividerProps = React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>;

const MenuDivider = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  MenuDividerProps
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    data-slot="menu-divider"
    className={cn("-mx-1 my-1 h-px bg-gray-alpha-400", className)}
    {...props}
  />
));
MenuDivider.displayName = "MenuDivider";

export interface MenuSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function MenuSection({ title, children, className }: MenuSectionProps) {
  return (
    <MenuPrimitive.Group className={className}>
      <MenuPrimitive.Label className="px-2 py-1.5 text-label-12 text-muted-foreground">
        {title}
      </MenuPrimitive.Label>
      {children}
    </MenuPrimitive.Group>
  );
}

export {
  MenuContainer,
  MenuButton,
  Menu,
  MenuItem,
  MenuItemLocked,
  MenuLink,
  MenuDivider,
  MenuSection,
};
