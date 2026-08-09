import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * SplitButton - Geist 分割按钮。
 * 一个主按钮 + 一个下拉菜单按钮，两者拼成单个圆角按钮组。
 * 主按钮触发主要动作，下拉提供 1–4 个相近变体动作。
 */

function SplitButton({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <DropdownMenu>
      <div
        data-slot="split-button"
        className={cn("flex rounded-md", className)}
        {...props}
      >
        {children}
      </div>
    </DropdownMenu>
  );
}

function SplitButtonMain({ className, children, ...props }: ButtonProps) {
  return (
    <Button
      data-slot="split-button-main"
      className={cn("rounded-r-none", className)}
      {...props}
    >
      {children}
    </Button>
  );
}

interface SplitButtonMenuProps extends ButtonProps {
  /** 下拉触发按钮的无障碍标签（aria-label） */
  menuLabel?: string;
  /** 下拉菜单对齐方式 */
  align?: "start" | "center" | "end";
  /** 下拉菜单内容 */
  children?: React.ReactNode;
}

function SplitButtonMenu({
  className,
  children,
  menuLabel = "More options",
  align = "end",
  variant = "default",
  size = "default",
  ...props
}: SplitButtonMenuProps) {
  return (
    <>
      <DropdownMenuTrigger asChild>
        <Button
          data-slot="split-button-menu"
          variant={variant}
          size={size}
          aria-label={menuLabel}
          className={cn(
            "rounded-l-none border-l border-gray-alpha-400 px-2.5",
            className,
          )}
          {...props}
        >
          <ChevronDown className="size-3.5" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {children}
      </DropdownMenuContent>
    </>
  );
}

export { SplitButton, SplitButtonMain, SplitButtonMenu };
