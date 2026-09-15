import * as React from "react";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Checkbox — Geist 官方 Checkbox 规范（docs/geist-markdown-refs/components/checkbox.md + 官方页面实测）。
 * 原生 <input type="checkbox"> + 视觉 box（结构对齐官方，非 Radix button[role=checkbox]）。
 * input 以 opacity-0 覆盖 box（保留点击/聚焦/键盘，视觉由 box 承载），避免 label 嵌套。
 *
 * 官方 API：
 * - checked：boolean（受控）
 * - onChange：() => void（无参数，官方 demo `onChange={(): void => setChecked((b) => !b)}`）
 * - indeterminate：独立 boolean prop（视觉态，非第三值；内部用 ref 设置原生 indeterminate 属性）
 * - disabled：boolean
 * - children：label 文本（有 children 时渲染 <label>，点击区域扩展到 label）
 *
 * 框架扩展（origin: extension，见文档站 API 参考表）：
 * - defaultChecked：boolean（非受控初值；未传 checked 时内部状态自管理）
 *
 * 视觉（官方实测）：
 * - box：16×16px、圆角 4px、边框 1px gray-700、bg background-100
 * - 勾选/半选：box bg = 前景色（light #171717 / dark #ededed）+ 背景色对勾/横线
 * - 禁用：灰（light bg #f2f2f2 / border #c9c9c9，dark #1a1a1a / #454545）
 * - hover 未选中：box 填充 gray-200（仅未禁用未勾选未半选）
 * - 颜色全部消费语义 token；size 为本地扩展（sm=16 / default=18 / lg=20）
 */
function Checkbox({
  className,
  checked,
  defaultChecked,
  onChange,
  disabled,
  indeterminate,
  children,
  size = "sm",
  ...props
}: Omit<
  React.ComponentProps<"input">,
  "type" | "checked" | "onChange" | "size" | "children" | "defaultChecked"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: () => void;
  indeterminate?: boolean;
  size?: "sm" | "default" | "lg";
  children?: React.ReactNode;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 非受控模式：仅当未提供 checked 时启用内部状态（defaultChecked 为初值）
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const currentChecked = isControlled ? checked : internalChecked;

  const handleChange = () => {
    if (!isControlled) setInternalChecked((prev) => !prev);
    onChange?.();
  };

  // 原生 indeterminate 是 DOM 属性（非 HTML 属性），需 ref 同步
  React.useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);

  const control = (
    <span className="relative inline-flex shrink-0 items-center justify-center">
      <input
        ref={inputRef}
        type="checkbox"
        className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        checked={currentChecked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <span
        aria-hidden
        className={cn(
          "relative block rounded-sm border border-gray-700 bg-background-100 transition-colors duration-(--uni-duration-base)",
          "peer-checked:border-foreground peer-checked:bg-foreground",
          "peer-indeterminate:border-foreground peer-indeterminate:bg-foreground",
          "peer-focus:shadow-[var(--focus-ring-outline)]",
          "peer-hover:enabled:peer-not-checked:peer-not-indeterminate:bg-gray-200",
          "peer-disabled:cursor-not-allowed peer-disabled:border-gray-500 peer-disabled:bg-gray-100",
          "peer-disabled:peer-checked:border-gray-600 peer-disabled:peer-checked:bg-gray-600",
          "peer-disabled:peer-indeterminate:border-gray-600 peer-disabled:peer-indeterminate:bg-gray-600",
          size === "sm" && "size-4",
          size === "default" && "size-[18px]",
          size === "lg" && "size-5",
          className,
        )}
      />
      <Check
        strokeWidth={2}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-20 m-auto hidden text-background peer-checked:block",
          size === "sm" && "size-3.5",
          size === "default" && "size-3.5",
          size === "lg" && "size-4",
        )}
      />
      <Minus
        strokeWidth={2}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-20 m-auto hidden text-background peer-indeterminate:block",
          size === "sm" && "size-3.5",
          size === "default" && "size-3.5",
          size === "lg" && "size-4",
        )}
      />
    </span>
  );

  // 无 children：独立 checkbox（input 覆盖 box，点击即可切换，调用方自行包裹 label）
  if (children == null) {
    return control;
  }

  // 有 children：渲染 label，点击区域扩展到 label（官方结构）
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      {control}
      <span>{children}</span>
    </label>
  );
}

export { Checkbox };
