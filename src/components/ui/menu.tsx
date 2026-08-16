import * as React from "react";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import { ChevronDown, Lock } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MenuPosition =
  | "bottom-start"
  | "bottom-end"
  | "top-start"
  | "top-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";

const MenuPositionContext = React.createContext<MenuPosition>("bottom-start");

function MenuContainer({
  position = "bottom-start",
  children,
  ...props
}: React.ComponentProps<typeof MenuPrimitive.Root> & {
  position?: MenuPosition;
}) {
  return (
    <MenuPositionContext.Provider value={position}>
      <MenuPrimitive.Root {...props}>{children}</MenuPrimitive.Root>
    </MenuPositionContext.Provider>
  );
}

interface MenuButtonProps extends Omit<ButtonProps, "type"> {
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
          className={cn("outline-none focus-ring", className)}
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

const Menu = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Content>,
  Omit<React.ComponentPropsWithoutRef<typeof MenuPrimitive.Content>, "width"> & {
    width?: number | string;
  }
>(({ className, sideOffset = 4, style, width, ...props }, ref) => {
  const position = React.useContext(MenuPositionContext);

  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        {...positionProps[position]}
        data-slot="menu"
        className={cn(
          "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-32 overflow-x-hidden overflow-y-auto rounded-[12px] bg-surface p-1.5 text-foreground shadow-[var(--material-shadow-menu)] outline-none",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          className,
        )}
        style={{ ...style, width }}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
});
Menu.displayName = "Menu";

interface MenuItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Item>,
  "asChild" | "prefix"
> {
  href?: string;
  type?: "default" | "error";
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

const MenuItem = React.forwardRef<React.ElementRef<typeof MenuPrimitive.Item>, MenuItemProps>(
  ({ className, children, disabled, href, type = "default", prefix, suffix, ...props }, ref) => {
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
        className={cn(
          "relative flex h-9 cursor-default select-none items-center gap-2 rounded-md px-2 text-label-14 text-foreground outline-none transition-colors data-highlighted:bg-gray-alpha-100 data-[disabled]:pointer-events-none data-[disabled]:text-muted-foreground data-[disabled]:opacity-60",
          type === "error" &&
            "text-destructive data-highlighted:bg-destructive data-highlighted:text-destructive-foreground",
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

const MenuLink = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  MenuItemProps & { href: string }
>((props, ref) => <MenuItem ref={ref} {...props} />);
MenuLink.displayName = "MenuLink";

const MenuItemLocked = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Item>,
  Omit<MenuItemProps, "disabled" | "suffix">
>(({ children, ...props }, ref) => (
  <MenuItem ref={ref} disabled suffix={<Lock aria-hidden />} {...props}>
    {children}
  </MenuItem>
));
MenuItemLocked.displayName = "MenuItemLocked";

const MenuDivider = React.forwardRef<
  React.ElementRef<typeof MenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenuPrimitive.Separator
    ref={ref}
    data-slot="menu-divider"
    className={cn("-mx-1 my-1 h-px bg-gray-alpha-400", className)}
    {...props}
  />
));
MenuDivider.displayName = "MenuDivider";

function MenuSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
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
