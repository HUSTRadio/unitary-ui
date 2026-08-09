import * as React from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * CommandMenu — 命令面板（对应官方 Command Menu，docs/geist-markdown-refs/components/command-menu.md）。
 * 基于 Radix Dialog 原语，全局 ⌘K 风格、键盘优先的命令面板。
 * 导出：CommandMenu, CommandMenuTrigger, CommandMenuContent, CommandMenuInput,
 *       CommandMenuList, CommandMenuItem, CommandMenuGroup, CommandMenuSeparator,
 *       CommandMenuDivider。
 * 用法与 Modal 同构：<CommandMenu open onOpenChange> 包 <CommandMenuContent>。
 * 样式（官方实测对齐）：
 * - overlay：bg #0a0a0a opacity-80（无 blur，双主题一致）
 * - content：fixed top-[85px] left-1/2 -translate-x-1/2 w-full max-w-[640px]
 *   bg-background border border-gray-alpha-400 rounded-[12px]
 *   shadow-[var(--material-shadow-modal)] overflow-hidden，aria-labelledby 指向 sr-only 标题
 * - input：border-b border-gray-alpha-400 px-4 py-3
 * - list：max-h-64 overflow-y-auto，ArrowDown/Up/Home/End 在条目间移动焦点
 * - item：px-4 py-2 text-copy-14 hover:bg-gray-alpha-100 cursor-pointer
 * 官方 bestPractices：全局 ⌘K / Ctrl+K 绑定；打开时焦点困在 overlay 内、关闭时
 * 返回触发元素；item 文案是 Title Case 动词短语（Deploy Project），命令是执行不是浏览；
 * Group heading 是 Title Case、1–2 词（Actions, Recent）。
 */

const CommandMenu = DialogPrimitive.Root;
const CommandMenuTrigger = DialogPrimitive.Trigger;

const CommandMenuContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const titleId = React.useId();
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="command-menu-overlay"
        className="fixed inset-0 z-50 bg-[#0a0a0a] opacity-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <DialogPrimitive.Content
        ref={ref}
        data-slot="command-menu-content"
        aria-labelledby={titleId}
        className={cn(
          "fixed top-[85px] left-1/2 z-50 w-full max-w-[640px] -translate-x-1/2 overflow-hidden rounded-[12px] border border-gray-alpha-400 bg-background shadow-[var(--material-shadow-modal)] outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      >
        <h2 id={titleId} className="sr-only">
          Command Menu
        </h2>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});
CommandMenuContent.displayName = DialogPrimitive.Content.displayName;

const CommandMenuInput = React.forwardRef<
  React.ElementRef<"input">,
  React.ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    data-slot="command-menu-input"
    className={cn(
      "w-full border-b border-gray-alpha-400 bg-transparent px-4 py-3 text-copy-14 text-foreground outline-none placeholder:text-muted-foreground",
      className,
    )}
    {...props}
  />
));
CommandMenuInput.displayName = "CommandMenuInput";

const CommandMenuList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onKeyDown, ...props }, ref) => {
    /** 键盘优先：ArrowDown/Up 在条目间移动焦点，Home/End 跳首尾，Enter 自然激活 */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const items = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-slot="command-menu-item"]'),
      );
      if (items.length === 0) return;
      const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
      if (event.key === "ArrowDown") {
        event.preventDefault();
        items[(currentIndex + 1) % items.length]?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
      } else if (event.key === "Home") {
        event.preventDefault();
        items[0]?.focus();
      } else if (event.key === "End") {
        event.preventDefault();
        items[items.length - 1]?.focus();
      }
      onKeyDown?.(event);
    };

    return (
      <div
        ref={ref}
        data-slot="command-menu-list"
        onKeyDown={handleKeyDown}
        className={cn("max-h-64 overflow-y-auto p-1.5", className)}
        {...props}
      />
    );
  },
);
CommandMenuList.displayName = "CommandMenuList";

const CommandMenuItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    suffix?: React.ReactNode;
    /** 官方 API 别名：激活时执行的动作（等价于 onClick） */
    callback?: () => void;
  }
>(({ className, suffix, callback, onClick, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-slot="command-menu-item"
    onClick={(event) => {
      callback?.();
      onClick?.(event);
    }}
    className={cn(
      "flex w-full cursor-pointer items-center justify-between gap-2 rounded-[6px] px-4 py-2 text-left text-copy-14 text-foreground transition-colors focus-ring hover:bg-gray-alpha-100",
      className,
    )}
    {...props}
  >
    <span className="flex-1">{children}</span>
    {suffix}
  </button>
));
CommandMenuItem.displayName = "CommandMenuItem";

const CommandMenuGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    heading?: string;
  }
>(({ className, heading, children, ...props }, ref) => (
  <div ref={ref} data-slot="command-menu-group" className={cn("py-1", className)} {...props}>
    {heading && <p className="px-4 pt-2 pb-1 text-label-12 text-muted-foreground">{heading}</p>}
    {children}
  </div>
));
CommandMenuGroup.displayName = "CommandMenuGroup";

const CommandMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="command-menu-separator"
      className={cn("mx-2 my-1 h-px bg-gray-alpha-200", className)}
      {...props}
    />
  ),
);
CommandMenuSeparator.displayName = "CommandMenuSeparator";

/** 官方 API 名称（docs 示例用 CommandMenuDivider） */
const CommandMenuDivider = CommandMenuSeparator;

export {
  CommandMenu,
  CommandMenuTrigger,
  CommandMenuContent,
  CommandMenuInput,
  CommandMenuList,
  CommandMenuItem,
  CommandMenuGroup,
  CommandMenuSeparator,
  CommandMenuDivider,
};
