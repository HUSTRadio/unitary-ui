import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Menu, MenuButton, MenuContainer, MenuItem } from "@/components/ui/menu";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * SplitButton - Geist 官方 props 式 API（docs/geist-markdown-refs/components/split-button.md 实测）。
 * 一个主按钮 + 一个下拉菜单按钮，两者拼成单个圆角按钮组。
 *
 * 官方 API：
 * - `buttonProps`：主按钮 props（ButtonProps：onClick / size / type 等）
 * - `menuButtonLabel`：下拉触发按钮的无障碍标签（aria-label）
 * - `menuItems`：菜单内容（SplitButtonMenuItem[] 或 fragment）
 * - `menuAlignment`：菜单对齐方式，默认 "bottom-start"（对齐主按钮下方），可选 "bottom-end"
 * - `menuProps`：菜单容器 props（如 { width: 264 }）
 * - `children`：主按钮文案
 *
 * 兼容旧 compound API：SplitButton + SplitButtonMain + SplitButtonMenu 仍可用。
 */

export type SplitButtonMenuAlignment = "bottom-start" | "bottom-end";

export interface SplitButtonProps extends React.ComponentProps<"div"> {
  /** 主按钮 props（官方 buttonProps） */
  buttonProps?: ButtonProps;
  /** 下拉触发按钮的无障碍标签（官方 menuButtonLabel） */
  menuButtonLabel?: string;
  /** 菜单对齐方式（官方 menuAlignment；默认 bottom-start 对齐主按钮下方） */
  menuAlignment?: SplitButtonMenuAlignment;
  /** 菜单内容（官方 menuItems：SplitButtonMenuItem[] 或 fragment） */
  menuItems?: React.ReactNode;
  /** 菜单容器 props（官方 menuProps，如 { width: 264 }） */
  menuProps?: React.ComponentProps<typeof Menu>;
}

export interface SplitButtonMenuItemProps {
  /** 菜单项标题（官方 title，可为任意 ReactNode） */
  title?: React.ReactNode;
  /** 菜单项描述（官方 description，第二行 muted 小字） */
  description?: React.ReactNode;
  /** 可选图标（官方 icon） */
  icon?: React.ReactNode;
  /** 透传给 MenuItem 的 props（官方 menuItemProps：onClick / className / disabled 等） */
  menuItemProps?: Omit<React.ComponentProps<typeof MenuItem>, "children" | "prefix" | "suffix">;
}

/** 测量元素宽度，用于把菜单从触发按钮锚点偏移到主按钮下方 */
function useElementWidth(ref: React.RefObject<HTMLElement | null>): number {
  const [width, setWidth] = React.useState(0);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.offsetWidth);
    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return width;
}

function SplitButton({
  className,
  children,
  buttonProps,
  menuButtonLabel = "More options",
  menuAlignment = "bottom-start",
  menuItems,
  menuProps,
  ...props
}: SplitButtonProps) {
  const { t } = useI18n();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const triggerWidth = useElementWidth(triggerRef);

  // 向后兼容：未使用官方 props 时按旧 compound API 渲染
  const isPropsApi = menuItems !== undefined || buttonProps !== undefined;

  if (!isPropsApi) {
    return (
      <MenuContainer>
        <div data-slot="split-button" className={cn("flex rounded-md", className)} {...props}>
          {children}
        </div>
      </MenuContainer>
    );
  }

  // bottom-start 时把菜单左缘从触发按钮左缘再左移一个触发按钮宽度，
  // 使菜单锚定在主按钮下方（官方 Best Practices：默认对齐主按钮）。
  const alignOffset = menuAlignment === "bottom-end" ? 0 : -triggerWidth;

  return (
    <MenuContainer position={menuAlignment}>
      <div data-slot="split-button" className={cn("flex rounded-md", className)} {...props}>
        <Button
          data-slot="split-button-main"
          {...buttonProps}
          className={cn("rounded-r-none", buttonProps?.className)}
        >
          {children}
        </Button>
        <MenuButton
          ref={triggerRef}
          data-slot="split-button-menu"
          variant={buttonProps?.type}
          size={buttonProps?.size}
          aria-label={menuButtonLabel === "More options" ? t(menuButtonLabel) : menuButtonLabel}
          className="rounded-l-none"
        >
          <ChevronDown className="size-3.5" aria-hidden />
        </MenuButton>
      </div>
      <Menu alignOffset={alignOffset} {...menuProps}>
        {menuItems}
      </Menu>
    </MenuContainer>
  );
}

/** @deprecated 使用 `SplitButton` 的 `buttonProps`/`menuItems` props API。 */
function SplitButtonMain({ className, children, ...props }: ButtonProps) {
  return (
    <Button data-slot="split-button-main" className={cn("rounded-r-none", className)} {...props}>
      {children}
    </Button>
  );
}

/** @deprecated 使用 `SplitButton` 的 props API；保留此类型用于渐进迁移。 */
export interface SplitButtonMenuProps extends ButtonProps {
  /** 下拉触发按钮的无障碍标签（aria-label） */
  menuLabel?: string;
  /** 下拉菜单对齐方式（"start" 对齐主按钮左缘，官方默认 bottom-start） */
  align?: "start" | "center" | "end";
  /** 视觉变体（透传 Button type） */
  variant?: ButtonProps["type"];
  /** 下拉菜单内容 */
  children?: React.ReactNode;
}

/** @deprecated 使用 `SplitButton` 的 `menuButtonLabel`/`menuItems` props API。 */
function SplitButtonMenu({
  className,
  children,
  menuLabel = "More options",
  align = "start",
  variant = "default",
  size = "medium",
  type: _type,
  ...props
}: SplitButtonMenuProps) {
  const { t } = useI18n();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const triggerWidth = useElementWidth(triggerRef);
  // "start" 对齐主按钮左缘；"end" 对齐整组右缘（触发按钮贴右）；"center" 取整组中心
  const alignOffset = align === "start" ? -triggerWidth : align === "end" ? 0 : -triggerWidth / 2;

  return (
    <>
      <MenuButton
        ref={triggerRef}
        data-slot="split-button-menu"
        variant={variant}
        size={size}
        aria-label={menuLabel === "More options" ? t(menuLabel) : menuLabel}
        className={cn("rounded-l-none", className)}
        {...props}
      >
        <ChevronDown className="size-3.5" aria-hidden />
      </MenuButton>
      <Menu align={align} alignOffset={alignOffset}>
        {children}
      </Menu>
    </>
  );
}

const SplitButtonMenuItem = React.forwardRef<
  React.ElementRef<typeof MenuItem>,
  SplitButtonMenuItemProps
>(({ title, description, icon, menuItemProps }, ref) => (
  <MenuItem ref={ref} prefix={icon} {...menuItemProps}>
    <span className="flex min-w-0 flex-1 flex-col items-start">
      <span className="min-w-0 max-w-full truncate text-label-13 text-foreground">{title}</span>
      {description ? (
        <span className="min-w-0 max-w-full truncate text-label-12 text-muted-foreground">
          {description}
        </span>
      ) : null}
    </span>
  </MenuItem>
));
SplitButtonMenuItem.displayName = "SplitButtonMenuItem";

export { SplitButton, SplitButtonMain, SplitButtonMenu, SplitButtonMenuItem };
