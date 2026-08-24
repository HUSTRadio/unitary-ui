import * as React from "react";
import { MoreHorizontal } from "lucide-react";

import { Menu, MenuButton, MenuContainer, MenuDivider, MenuItem } from "@/components/ui/menu";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * DotsMenu — Geist 官方 Dots Menu（docs/geist-markdown-refs/components/dots-menu.md 官方语义）。
 * 基于 menu.tsx（Menu 迁移后的新 API），不回退旧 DropdownMenu。
 * 官方实测（2026-08 vercel.com/geist/dots-menu 实时 DOM/computed style）：
 * - 触发器：32×32、MoreHorizontal 图标（默认 18px，iconSize 可调 10/12/18）、r:6px
 * - 浮层：min-w 200px、white、r:12px、无 border（纯 shadow，即 --material-shadow-menu
 *   的 0 0 0 1px rgba(0,0,0,.08) 描边环 + 4 层投影）、p:6px、右侧对齐触发器（bottom-end）
 * - 条目：h 36px、padding 0 8px、r:6px、14px/400、fg gray-1000；
 *   hover bg rgba(0,0,0,.05)（gray-alpha-100）；disabled fg gray-700 + aria-disabled
 * 键盘 ArrowDown/ArrowUp 移动高亮、Escape 关闭、焦点管理由 Radix DropdownMenu 提供。
 */

const DOTS_MENU_CONTENT_CLASSES =
  "min-w-[200px] rounded-overlay border-0 bg-background p-1.5 shadow-[var(--material-shadow-menu)]";

interface DotsMenuProps extends React.ComponentProps<typeof MenuContainer> {
  /** 图标尺寸（默认 18，官方实测） */
  iconSize?: number;
  /** 禁用触发器 */
  disabled?: boolean;
  /** 触发器 className */
  className?: string;
  /** 浮层 className */
  contentClassName?: string;
}

type DotsMenuItemProps = React.ComponentProps<typeof MenuItem>;
type DotsMenuSeparatorProps = React.ComponentProps<typeof MenuDivider>;

function DotsMenu({
  iconSize = 18,
  disabled,
  className,
  contentClassName,
  children,
  position = "bottom-end",
  ...props
}: DotsMenuProps) {
  const { t } = useI18n();
  return (
    <MenuContainer position={position} {...props}>
      <MenuButton
        variant="unstyled"
        disabled={disabled}
        aria-label={t("Menu")}
        aria-haspopup="true"
        style={
          disabled
            ? {
                boxShadow:
                  "0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0), 0 0 0 0 rgba(0,0,0,0)",
              }
            : undefined
        }
        className={cn(
          "relative flex size-8 max-w-full shrink-0 items-center justify-center rounded-lg text-sm font-medium leading-[21px] text-foreground outline-none transition-colors hover:bg-gray-alpha-200 data-[state=open]:bg-gray-alpha-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50",
          className,
        )}
      >
        <MoreHorizontal style={{ width: iconSize, height: iconSize }} aria-hidden />
      </MenuButton>
      <Menu className={cn(DOTS_MENU_CONTENT_CLASSES, contentClassName)}>{children}</Menu>
    </MenuContainer>
  );
}

const DotsMenuItem = React.forwardRef<React.ElementRef<typeof MenuItem>, DotsMenuItemProps>(
  ({ className, ...props }, ref) => (
    <MenuItem
      ref={ref}
      className={cn(
        "h-9 rounded-overlay-item px-2 text-sm hover:bg-gray-alpha-100 focus-visible:bg-gray-alpha-100 data-[highlighted]:bg-gray-alpha-100 data-[disabled]:text-gray-700 data-[disabled]:opacity-100",
        className,
      )}
      {...props}
    />
  ),
);
DotsMenuItem.displayName = "DotsMenuItem";

const DotsMenuSeparator: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof MenuDivider> & { asChild?: boolean } & React.RefAttributes<HTMLDivElement>> = MenuDivider;

export { DotsMenu, DotsMenuItem, DotsMenuSeparator };
export type { DotsMenuProps, DotsMenuItemProps, DotsMenuSeparatorProps };
