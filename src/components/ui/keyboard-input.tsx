import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * KeyboardInput — Geist 官方 Keyboard Input 规范（docs/geist-markdown-refs/components/keyboard-input.md）。
 * KeyboardInput 组合容器（⌘K 这类组合键），Kbd 为单个按键的 <kbd> 元素。
 *
 * Kbd 官方 API（官方文档实测）：
 * - meta / shift / alt / ctrl 布尔修饰符：仅 meta 在 macOS 渲染 ⌘、非 macOS 渲染单词 'Ctrl'；
 *   shift / alt / ctrl 在所有平台保持 Unicode 字形（⇧ / ⌥ / ⌃）。
 * - 多个修饰符渲染为同一个 pill（如 <Kbd meta shift /> → 'Ctrl⇧'，Windows）。
 * - small：紧凑尺寸（20px 高、12px、padding 0 4px）。
 * - children 为单个键名（K、7、Enter、Esc），不要小写化、不要拼写修饰符。
 * - 官方实测样式：默认 24px 高、14px（text-sm）、padding 0 6px、radius 4px、
 *   bg background-100（light #fff / dark #0a0a0a）+ ring（gray-alpha-400）、Geist Sans 字体。
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
  /** meta 键：macOS 渲染 ⌘，其余平台渲染单词 Ctrl */
  meta?: boolean;
  /** shift 键：所有平台渲染 ⇧ 字形 */
  shift?: boolean;
  /** alt 键：所有平台渲染 ⌥ 字形 */
  alt?: boolean;
  /** ctrl 键：所有平台渲染 ⌃ 字形 */
  ctrl?: boolean;
  /** 紧凑尺寸（20px 高、12px、padding 0 4px，密集表面：菜单行、命令栏、表格单元格） */
  small?: boolean;
}

function Kbd({ className, meta, shift, alt, ctrl, small, children, ...props }: KbdProps) {
  // 官方实测：仅 meta 在非 macOS 变为单词 'Ctrl'；shift/alt/ctrl 在所有平台保留字形。
  const modifiers = [meta && (IS_MAC ? "⌘" : "Ctrl"), shift && "⇧", alt && "⌥", ctrl && "⌃"].filter(
    (modifier): modifier is string => Boolean(modifier),
  );

  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-6 items-center justify-center rounded-[4px] bg-background-100 px-1.5 text-sm text-gray-1000 ring-1 ring-inset ring-gray-alpha-400",
        small && "h-5 min-w-5 px-1 text-xs",
        className,
      )}
      {...props}
    >
      {/* 多个修饰符拼接为单个文本节点：同一个 pill（'Ctrl⇧'），无间距 */}
      {modifiers.length > 0 ? <span>{modifiers.join("")}</span> : null}
      {children != null ? <span>{children}</span> : null}
    </kbd>
  );
}

export { KeyboardInput, Kbd };
