import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Menu, MenuButton, MenuContainer } from "@/components/ui/menu";
import { cn } from "@/lib/utils";

/**
 * SplitButton - Geist 分割按钮（已迁移至 Menu 原语，docs/geist-markdown-refs/components/split-button.md 实测）。
 * 一个主按钮 + 一个下拉菜单按钮，两者拼成单个圆角按钮组。
 * 主按钮触发主要动作，下拉提供 1–4 个相近变体动作。
 * 官方实测几何：主/次按钮 pad 0 6px、无分隔线；菜单默认 bottom-start 对齐。
 */

function SplitButton({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <MenuContainer>
      <div data-slot="split-button" className={cn("flex rounded-md", className)} {...props}>
        {children}
      </div>
    </MenuContainer>
  );
}

function SplitButtonMain({ className, children, ...props }: ButtonProps) {
  return (
    <Button data-slot="split-button-main" className={cn("rounded-r-none", className)} {...props}>
      {children}
    </Button>
  );
}

interface SplitButtonMenuProps extends ButtonProps {
  /** 下拉触发按钮的无障碍标签（aria-label） */
  menuLabel?: string;
  /** 下拉菜单对齐方式（官方默认 bottom-start） */
  align?: "start" | "center" | "end";
  /** 下拉菜单内容 */
  children?: React.ReactNode;
}

function SplitButtonMenu({
  className,
  children,
  menuLabel = "More options",
  align = "start",
  variant = "default",
  size = "default",
  type: _type,
  ...props
}: SplitButtonMenuProps) {
  return (
    <>
      <MenuButton
        data-slot="split-button-menu"
        variant={variant}
        size={size}
        aria-label={menuLabel}
        className={cn("rounded-l-none", className)}
        {...props}
      >
        <ChevronDown className="size-3.5" aria-hidden />
      </MenuButton>
      <Menu align={align}>{children}</Menu>
    </>
  );
}

export { SplitButton, SplitButtonMain, SplitButtonMenu };
