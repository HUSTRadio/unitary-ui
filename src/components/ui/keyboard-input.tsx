import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * KeyboardInput — 键盘快捷键排版。
 *
 * 排版基线（按所有者指示采用 Apple HIG 键帽观感，偏离 Geist 官方单 pill 基线，
 * 见 tests/audit/geist-design-gate.json keyboard-input.notes 的偏离记录）：
 * Apple 的快捷键视觉可近似为**正方形键帽的邻接组成**——每个键位（修饰符符号或
 * 键名字符）渲染为独立键帽（默认高 24、small 高 20，字符同行等高、wrapper 内
 * flex 居中），组合键 = 方块邻接（间隙 4px，参照 Apple 菜单快捷键 ≈0.25em 字间
 * 间隙）。字符 wrapper 用 inline-grid auto-cols-[1fr] 等宽：每列宽 = 组内最宽
 * icon 的动态宽度（零硬编码，随字号/视口/图标字体自适应）。字体继承文档主字体
 * （如 OPPO Sans 4.0——Apple 菜单快捷键用系统主字体而非等宽字体）；修饰符字形
 * 用 Material Symbols Rounded 键帽图标（Google 官方 keyboard_*_key 系列，描边
 * 风格贴近 Apple 键帽）。字形垂直方向按 ink 光学居中：字体 metrics 的
 * ascent/descent 不对称会使字形在行框内偏下（OPPO Sans cap 系 ≈0.0625em），
 * 键名 glyph 以 em 相对 transform 校准（随字号自适应）；Material Symbols
 * 图标 metrics 对称，免校准。
 *
 * API 兼容 Geist Keyboard Input（docs/geist-markdown-refs/components/keyboard-input.md）：
 * - meta / shift / alt / ctrl 布尔修饰符分别渲染 ⌘ / ⇧ / ⌥ / ⌃ 的 Material
 *   Symbols 图标；组件不检测操作系统，调用方负责选择与目标平台快捷键一致的组合。
 * - 多个修饰符渲染为邻接方块组（如 <Kbd meta shift /> → ⌘⇧ 两个方块）。
 * - small：紧凑尺寸（20px 方块、12px 字号），密集表面：菜单行、命令栏、表格单元格。
 * - children 为单个键名（K、7、Enter、Esc）：wrapper 经 auto-cols-[1fr] 取组内
 *   最宽 icon/键名的动态宽度，多字符键名自然撑宽所在列，不裁切。
 * - plain：无边框的行内快捷键（Apple 菜单风：无键帽表面，等宽 wrapper + 1px
 *   微缝，字符居中），适合 Command Palette 等已有容器层级的密集界面。
 */

export type KeyboardInputProps = React.ComponentProps<"div">;

/**
 * 修饰符键帽字形（Material Symbols Rounded 键帽子集，自托管 woff2 3.6KB，
 * @font-face 见 src/styles/index.css）。codepoint 对照：
 *   meta  U+EAE7 keyboard_command_key（⌘）
 *   shift U+E5F2 shift（⇧；Material Symbols 无 keyboard_shift_key 名称）
 *   alt   U+EAE8 keyboard_option_key（⌥）
 *   ctrl  U+EAE6 keyboard_control_key（⌃）
 */
const MODIFIER_GLYPHS = {
  meta: "\uEAE7",
  shift: "\uE5F2",
  alt: "\uEAE8",
  ctrl: "\uEAE6",
} as const;

function KeyboardInput({ className, ...props }: KeyboardInputProps) {
  return (
    <div
      data-slot="keyboard-input"
      // 组合容器：方块邻接（4px，参照 Apple 菜单快捷键的字间间隙 ≈0.25em），
      // 取消子 kbd 的行内 ml 避免双重间距
      className={cn("inline-flex items-center gap-[4px] [&>kbd]:ml-0", className)}
      {...props}
    />
  );
}

export interface KbdProps extends React.ComponentProps<"kbd"> {
  /** 主修饰键：Windows 的 Ctrl 与 macOS 的 Command 均渲染为 ⌘（Material Symbols 键帽图标） */
  meta?: boolean;
  /** shift 键：所有平台渲染 ⇧ 键帽图标 */
  shift?: boolean;
  /** alt 键：跨平台渲染 ⌥ 键帽图标 */
  alt?: boolean;
  /** ctrl 键：所有平台渲染 ⌃ 键帽图标 */
  ctrl?: boolean;
  /** 紧凑尺寸（20px 方块、12px 字号，密集表面：菜单行、命令栏、表格单元格） */
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
  // Apple 键帽拓扑（参照菜单快捷键排版）：每个键位槽位 = 独立键帽，邻接组成组合键
  // （gap 4px）。修饰符字形用 Material Symbols Rounded 键帽图标（描边风格贴近
  // Apple 键帽；图标撑满 em 框，16px 即与键名字母视觉同大）。键名继承文档主字体。
  const slots: { char: React.ReactNode; modifier: keyof typeof MODIFIER_GLYPHS | null }[] = [];
  if (meta) slots.push({ char: MODIFIER_GLYPHS.meta, modifier: "meta" });
  if (shift) slots.push({ char: MODIFIER_GLYPHS.shift, modifier: "shift" });
  if (alt) slots.push({ char: MODIFIER_GLYPHS.alt, modifier: "alt" });
  if (ctrl) slots.push({ char: MODIFIER_GLYPHS.ctrl, modifier: "ctrl" });
  if (children != null) slots.push({ char: children, modifier: null });

  return (
    <kbd
      data-slot="kbd"
      className={cn(
        // 槽位间距：有框 4px（方块邻接，Apple 菜单 ≈0.25em 字间间隙）；plain
        // 纯文本仅 1px 微缝（字符在等宽 wrapper 内居中，间距由 wrapper 留白承担）。
        plain ? "gap-[1px]" : "gap-[4px]",
        // 字符 wrapper 等宽网格：auto-cols-[1fr]（fr 列解析 = 最宽槽位内容，
        // 即最宽 icon 的 em 框 + padding）——零硬编码，字号/视口/图标字体变化
        // 时列宽自动跟随。字符本身在 wrapper 内 flex 居中、同行等高。
        // 字体继承文档主字体（Apple 菜单快捷键用系统主字体，非等宽字体）；
        // [font-family:inherit] 显式覆盖 Tailwind preflight 对 <kbd> 的 mono 预设。
        "inline-grid grid-flow-col auto-cols-[1fr] items-center text-gray-1000 [font-family:inherit]",
        // 行内独立使用时与前一字符的间距（Geist 行内惯例）；组合容器内已被取消
        !plain && (small ? "ml-0.5" : "ml-1"),
        className,
      )}
      {...props}
    >
      {slots.map((slot, i) => (
        <span
          key={i}
          data-slot="kbd-key"
          aria-hidden={slot.modifier ? true : undefined}
          className={cn(
            // 有框键帽几何：高度锁定（默认 24 / small 20）保证同行等高；宽度由根
            // 网格 auto-cols-[1fr] 动态给出（= 组内最宽 icon 内容宽，无 min-w
            // 硬编码，随字号/视口自适应）；上下 flex 居中对称（无行高 hack）。
            // plain 纯文本：无键帽表面几何，wrapper 宽度同样由根网格等宽给出，
            // 字符在等宽 wrapper 内居中（Apple 菜单的等宽节奏）。
            "inline-flex items-center justify-center leading-none whitespace-nowrap",
            plain
              ? ""
              : small
                ? "h-5 rounded-sm px-1 text-xs"
                : "h-6 rounded-sm px-1 text-base",
            // 修饰符槽切换到 Material Symbols 图标字体（覆盖继承的主字体）；
            // PUA 字形对读屏不可读，aria-hidden 防误读，组合语义由调用方 aria-label 承担
            slot.modifier && "msr-keycap",
            plain
              ? "bg-transparent shadow-none"
              : "bg-background-100 shadow-[0_0_0_1px_var(--uni-gray-alpha-400)]",
          )}
        >
          <span
            data-slot="kbd-glyph"
            className={cn(
              // 字形垂直光学校准：字体 metrics 的 ascent/descent 不对称使字形 ink
              // 在 leading-none 行框内偏下（OPPO Sans cap 系字形实测 fontAsc 17 /
              // desc 4 @16px → ink 中心偏下 1px ≈ 0.0625em），em 相对校准随字号
              // 自适应；transform 只改渲染、不影响 wrapper 的 flex 布局居中。
              // Material Symbols 图标 metrics 对称（已居中），无需校正。
              "inline-block",
              // 修饰符图标按 em 收窄到键名字母的墨迹高度：Material Symbols 字形铺满
              // em 框（ink = 1em），而 OPPO Sans cap 系字母墨迹仅 ≈0.8125em（实测
              // 16px 字号下 K 的 ink 13px）——不收窄则图标比字母高 23%，即便两者
              // 墨迹中心对齐，也会因上缘更高、基线更低而看起来"没对齐"。
              slot.modifier && "text-[0.8125em]",
              !slot.modifier && "-translate-y-[0.0625em]",
            )}
          >
            {slot.char}
          </span>
        </span>
      ))}
    </kbd>
  );
}

export { KeyboardInput, Kbd };
