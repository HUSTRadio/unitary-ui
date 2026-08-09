import * as React from "react";
import { CheckCircle2, Info, OctagonAlert, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Note — 官方 Geist Note（docs/geist-markdown-refs/components/note.md + 官方 bundle 实测）。
 * 导出：Note, NoteContent, NoteAction, NoteLabel。
 *
 * 官方契约（2026-08 实测 vercel.com/geist/note 与 geistcn bundle）：
 * - variant: default / error / warning / success / secondary / violet / cyan。
 *   官方明确“No variant="info" exists”。
 * - fill: 布尔，填充柔和底色（border-*-100 bg-*-200）；secondary fill 为 gray-alpha-200。
 * - size: "small"（13px/px-2/min-h-8）| "medium"（14px/px-3/min-h-9，默认）。
 * - icon: 自定义图标节点；icon={null} 不渲染图标。
 * - disabled: 禁用态（灰化 + 内部按钮 pointer-events-none）。
 * - 官方图标：success=CheckCircle、error=Stop、warning=Warning、其余=Information，size 14；
 *   本地以 lucide 对应：CheckCircle2 / OctagonAlert / TriangleAlert / Info。
 * - 结构：root（role="note" data-slot="note"）> note-body（icon span + 非 Action children）
 *   + NoteAction（可多个，渲染在正文之后）；含 Action 时 root 追加 sm:pr-2 max-sm:py-3 rounded-[10px]。
 * - 容器材质：非 fill 透明（border 1px + gap-3 + rounded-md），文字/图标随 variant 着色（语义 token）。
 */

export type NoteVariant =
  | "default"
  | "error"
  | "warning"
  | "success"
  | "secondary"
  | "violet"
  | "cyan";

export type NoteSize = "small" | "medium";

const NOTE_VARIANT_STYLES: Record<NoteVariant, string> = {
  default: "border-gray-400 text-gray-900",
  secondary: "border-gray-alpha-400 text-gray-alpha-900",
  success: "border-blue-400 text-blue-900",
  error: "border-red-400 text-red-900",
  warning: "border-amber-400 text-amber-900",
  violet: "border-purple-400 text-purple-900",
  cyan: "border-teal-400 text-teal-900",
};

const NOTE_FILL_STYLES: Record<NoteVariant, string> = {
  default: "border-gray-100 bg-gray-100",
  secondary: "border-transparent bg-gray-alpha-200",
  success: "border-blue-100 bg-blue-200",
  error: "border-red-100 bg-red-200",
  warning: "border-amber-100 bg-amber-200",
  violet: "border-purple-100 bg-purple-200",
  cyan: "border-teal-100 bg-teal-200",
};

const NOTE_SIZE_STYLES: Record<NoteSize, string> = {
  small: "min-h-8 px-2 py-1.5 text-copy-13",
  medium: "min-h-9 px-3 py-1.5 text-copy-14",
};

const NOTE_DISABLED_STYLES = [
  "border-gray-alpha-200 bg-transparent text-gray-700",
  "[&_a]:text-gray-700",
  "[&_button]:pointer-events-none [&_button]:border [&_button]:border-gray-alpha-400 [&_button]:bg-gray-100 [&_button]:text-gray-700",
];

const NOTE_ICONS: Record<NoteVariant, React.ElementType> = {
  default: Info,
  secondary: Info,
  success: CheckCircle2,
  error: OctagonAlert,
  warning: TriangleAlert,
  violet: Info,
  cyan: Info,
};

interface NoteProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NoteVariant;
  /** 填充柔和底色（官方 fill）。 */
  fill?: boolean;
  size?: NoteSize;
  /** 自定义图标节点；传 null 则不渲染图标。 */
  icon?: React.ReactNode;
  disabled?: boolean;
}

function Note({
  className,
  variant = "default",
  fill = false,
  size = "medium",
  icon,
  disabled = false,
  children,
  ...props
}: NoteProps) {
  const actions: React.ReactNode[] = [];
  const body: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === NoteAction) {
      actions.push(child);
    } else {
      body.push(child);
    }
  });

  const defaultIcon = NOTE_ICONS[variant];
  const iconNode = icon === undefined ? React.createElement(defaultIcon, { size: 14 }) : icon;

  return (
    <div
      data-slot="note"
      role="note"
      data-disabled={disabled || undefined}
      className={cn(
        "gap-3 rounded-md relative box-border flex w-full flex-wrap items-center border break-words",
        "[&_a:not([data-geist-button])]:font-medium [&_a:not([data-geist-button])]:underline-offset-2 [&_a:not([data-geist-button]):hover]:underline",
        NOTE_VARIANT_STYLES[variant],
        fill && NOTE_FILL_STYLES[variant],
        NOTE_SIZE_STYLES[size],
        actions.length > 0 && "sm:pr-2 max-sm:py-3 rounded-[10px]",
        disabled && NOTE_DISABLED_STYLES,
        className,
      )}
      {...props}
    >
      <div data-slot="note-body" className="min-w-0 flex flex-1 items-start gap-3">
        {iconNode !== null ? (
          <span data-slot="note-icon" className="flex shrink-0 [&>svg]:h-[1lh]">
            {iconNode}
          </span>
        ) : null}
        {body}
      </div>
      {actions}
    </div>
  );
}

function NoteContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="note-content" className={cn("min-w-0 flex-1", className)} {...props} />;
}

function NoteLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="note-label"
      className={cn("mr-1 font-semibold whitespace-nowrap", className)}
      {...props}
    />
  );
}

function NoteAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="note-action"
      className={cn(
        "flex shrink-0 items-center justify-end gap-2 self-center",
        "max-sm:w-full max-sm:basis-full max-sm:justify-stretch max-sm:*:flex-1",
        className,
      )}
      {...props}
    />
  );
}

export { Note, NoteContent, NoteAction, NoteLabel };
