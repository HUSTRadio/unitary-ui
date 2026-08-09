import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * KeyboardInput — Geist 官方 Keyboard Input 规范（docs/geist-markdown-refs/components/keyboard-input.md）。
 * KeyboardInput 组合容器（⌘K 这类组合键），Kbd 为单个按键的 <kbd> 元素：
 * 4px 圆角 + gray-alpha-400 边框 + gray-alpha-200 底 + text-label-12-mono。
 *
 * Kbd 官方 API（官方文档实测）：
 * - meta / shift / alt / ctrl 布尔修饰符：meta 在 macOS 渲染 ⌘、Windows/Linux 渲染 Ctrl
 *   （官方 BP：硬编码 ⌘ 会给一半用户发错符号）；shift → ⇧ / Shift、alt → ⌥ / Alt、
 *   ctrl → ⌃ / Ctrl
 * - small：紧凑尺寸（官方 Small 演示：更小 padding 与高度）
 * - children 为单个键名（K、7、Enter、Esc），不要小写化、不要拼写修饰符
 */

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

function KeyboardInput({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="keyboard-input"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** meta 键：macOS 渲染 ⌘，Windows/Linux 渲染 Ctrl */
  meta?: boolean;
  /** shift 键：macOS 渲染 ⇧，其余平台渲染 Shift */
  shift?: boolean;
  /** alt 键：macOS 渲染 ⌥，其余平台渲染 Alt */
  alt?: boolean;
  /** ctrl 键：macOS 渲染 ⌃，其余平台渲染 Ctrl */
  ctrl?: boolean;
  /** 紧凑尺寸（密集表面：菜单行、命令栏、表格单元格） */
  small?: boolean;
}

function Kbd({ className, meta, shift, alt, ctrl, small, children, ...props }: KbdProps) {
  const modifiers = [
    meta && (IS_MAC ? "⌘" : "Ctrl"),
    shift && (IS_MAC ? "⇧" : "Shift"),
    alt && (IS_MAC ? "⌥" : "Alt"),
    ctrl && (IS_MAC ? "⌃" : "Ctrl"),
  ].filter((modifier): modifier is string => Boolean(modifier));

  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[4px] border border-gray-alpha-400 bg-gray-alpha-200 px-1.5 py-0.5 font-mono text-label-12-mono text-foreground",
        small && "h-5 min-w-5 px-1 py-0",
        className,
      )}
      {...props}
    >
      {modifiers.map((modifier) => (
        <span key={modifier}>{modifier}</span>
      ))}
      {children != null ? <span>{children}</span> : null}
    </kbd>
  );
}

export { KeyboardInput, Kbd };
