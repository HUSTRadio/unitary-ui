import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * KeyboardInput — Geist 官方 Keyboard Input 规范（docs/geist-markdown-refs/components/keyboard-input.md）。
 * KeyboardInput 组合容器（⌘K 这类组合键），Kbd 为单个按键的 <kbd> 元素。
 *
 * Kbd 官方 API（官方文档实测）：
 * - meta / shift / alt / ctrl 布尔修饰符：跨平台统一使用符号；Windows 中 Shift / Alt / Ctrl 分别对应
 *   ⇧ / ⌥ / ⌘，显式 ctrl 保持 ⌃。
 * - 符号修饰键与后续按键保持紧凑（⌘K、⌥K），不插入空格。
 * - 多个修饰符渲染为同一个 pill（如 <Kbd meta shift /> → '⌘⇧'）。
 * - small：紧凑尺寸（20px 高、12px、padding 0 4px）。
 * - children 为单个键名（K、7、Enter、Esc），不要小写化、不要拼写修饰符。
 * - 默认键帽：24px 高、14px（text-sm）、padding 0 6px、radius 4px、
 *   bg background-100（light #fff / dark #0a0a0a）+ ring（gray-alpha-400）。内容统一使用 Maple Mono。
 * - plain：无边框的行内快捷键，适合 Command Palette 等已有容器层级的密集界面。
 */

export type KeyboardInputProps = React.ComponentProps<"div">;

function KeyboardInput({ className, ...props }: KeyboardInputProps) {
  return (
    <div
      data-slot="keyboard-input"
      className={cn("inline-flex items-center", className)}
      {...props}
    />
  );
}

export interface KbdProps extends React.ComponentProps<"kbd"> {
  /** 主修饰键：Windows 的 Ctrl 与 macOS 的 Command 均渲染为 ⌘ */
  meta?: boolean;
  /** shift 键：所有平台渲染 ⇧ 字形 */
  shift?: boolean;
  /** alt 键：跨平台渲染 ⌥ 字形 */
  alt?: boolean;
  /** ctrl 键：所有平台渲染 ⌃ 字形 */
  ctrl?: boolean;
  /** 紧凑尺寸（20px 高、12px、padding 0 4px，密集表面：菜单行、命令栏、表格单元格） */
  small?: boolean;
  /** 无边框的行内快捷键形态（例如 ⌘K），不重复制造键帽表面 */
  plain?: boolean;
}

function Kbd({
  className,
  meta,
  shift,
  alt,
  ctrl,
  small,
  plain = false,
  children,
  ...props
}: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-block rounded-[4px] py-0 text-center font-mono !leading-[1.7em] text-gray-1000 [&>span]:font-inherit",
        plain
          ? "ml-0 min-h-0 min-w-0 bg-transparent px-0 shadow-none"
          : "bg-background-100 shadow-[0_0_0_1px_var(--ds-gray-alpha-400)]",
        !plain &&
          (small
            ? "ml-0.5 h-5 min-h-5 min-w-5 px-1 text-xs"
            : "ml-1 min-h-6 min-w-6 px-1.5 text-sm"),
        className,
      )}
      {...props}
    >
      {meta ? <span style={{ display: "inline-block", minWidth: "1em" }}>⌘</span> : null}
      {shift ? <span>⇧</span> : null}
      {alt ? <span>⌥</span> : null}
      {ctrl ? <span>⌃</span> : null}
      {children != null ? <span>{children}</span> : null}
    </kbd>
  );
}

export { KeyboardInput, Kbd };
