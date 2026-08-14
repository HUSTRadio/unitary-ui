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
      className={cn("inline-flex items-center", className)}
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
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-block rounded-[4px] bg-background-100 py-0 text-center font-sans !leading-[1.7em] text-gray-1000 shadow-[0_0_0_1px_var(--ds-gray-alpha-400)] [&>span]:font-inherit",
        small ? "ml-0.5 h-5 min-h-5 min-w-5 px-1 text-xs" : "ml-1 min-h-6 min-w-6 px-1.5 text-sm",
        className,
      )}
      {...props}
    >
      {meta ? (
        <span style={{ display: "inline-block", minWidth: "1em" }}>{IS_MAC ? "⌘" : "Ctrl"}</span>
      ) : null}
      {shift ? <span>⇧</span> : null}
      {alt ? <span>⌥</span> : null}
      {ctrl ? <span>⌃</span> : null}
      {children != null ? <span>{children}</span> : null}
    </kbd>
  );
}

export { KeyboardInput, Kbd };
