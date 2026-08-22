import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

/**
 * Button - Geist 官方 Button 单轨 API 实现。
 *
 * 官方 API（vercel.com/geist/button 实测 + bundle 源码）：
 * - `type` = 视觉变体 prop：default / secondary / error / warning / tertiary
 *   （primary / success / ghost / violet 不是合法值）
 * - `typeName` = HTML type 属性，默认 "submit"
 * - `svgOnly` + `aria-label` = 图标按钮（padding collapse）
 * - `shape` = square（默认）/ circle / rounded
 * - `shadow` = 营销页阴影（配合 shape="rounded"）
 * - `size` = tiny(24) / small(32) / medium(36, 默认) / large(40)
 * - `loading` = spinner + 保持 label + disabled
 * - `prefix` / `suffix` = 前后缀图标
 *
 * 导出：Button, ButtonLink, CustomButton, buttonVariants
 */

const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded-md text-button-14 leading-[21px] font-medium whitespace-nowrap max-w-full transition-all outline-none focus-ring disabled:pointer-events-none disabled:bg-gray-100 disabled:text-gray-700 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      type: {
        default:
          "bg-primary text-primary-foreground hover:bg-action-hover hover:text-primary-foreground",
        secondary:
          "bg-background-100 text-foreground hover:bg-gray-alpha-200 hover:text-foreground",
        tertiary:
          "bg-transparent text-foreground hover:bg-gray-alpha-200 hover:text-foreground disabled:bg-transparent disabled:text-foreground disabled:opacity-50",
        error:
          "bg-button-error text-button-error-foreground hover:bg-button-error-hover hover:text-button-error-foreground",
        warning:
          "bg-button-warning text-button-warning-foreground hover:bg-button-warning-hover hover:text-button-warning-foreground",
      },
      size: {
        tiny: "h-6 rounded-[4px] px-1.5 [&_svg]:size-3",
        small: "h-8 rounded-md px-1.5",
        medium: "h-9 px-2.5",
        large: "h-10 rounded-[8px] px-3.5 text-button-16 leading-6",
      },
      shape: {
        square: "",
        circle: "rounded-full",
        rounded: "rounded-full !px-3",
      },
    },
    defaultVariants: {
      type: "default",
      size: "medium",
      shape: "square",
    },
  },
);

type ButtonType = VariantProps<typeof buttonVariants>["type"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];
type ButtonShape = VariantProps<typeof buttonVariants>["shape"];

/** svgOnly 图标按钮：padding collapse + 正方形宽高 + 图标尺寸（圆角由 size/shape 决定） */
const SVG_ONLY_CLASSES: Record<string, string> = {
  tiny: "size-6 p-0 [&_svg]:size-4",
  small: "size-8 p-0 [&_svg]:size-4",
  medium: "size-9 p-0 [&_svg]:size-4",
  large: "size-10 p-0 [&_svg]:size-4",
};

export interface ButtonProps extends Omit<
  React.ComponentProps<"button">,
  "type" | "prefix" | "shape"
> {
  /** 视觉变体（官方 type prop）：default / secondary / tertiary / error / warning */
  type?: ButtonType;
  /** HTML type 属性（官方 typeName），默认 "submit" */
  typeName?: "submit" | "button" | "reset";
  /** 尺寸 */
  size?: ButtonSize;
  /** 形状 */
  shape?: ButtonShape;
  /** 营销页阴影（配合 shape="rounded"） */
  shadow?: boolean;
  /** 图标按钮模式：padding collapse + 必须配 aria-label */
  svgOnly?: boolean;
  /** 加载态：显示 spinner 并禁用（保持 label） */
  loading?: boolean;
  /** 前缀图标 */
  prefix?: React.ReactNode;
  /** 后缀图标 */
  suffix?: React.ReactNode;
  /** asChild 模式 */
  asChild?: boolean;
}

function Button({
  className,
  type = "default",
  typeName = "submit",
  size = "medium",
  shape = "square",
  shadow = false,
  svgOnly = false,
  asChild = false,
  loading = false,
  prefix,
  suffix,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const { t } = useI18n();
  const Comp = asChild ? Slot.Root : "button";

  const shadowClass = shadow ? "shadow-lg" : "";

  const resolvedSize = size;

  return (
    <Comp
      data-slot="button"
      data-geist-button=""
      data-type={type}
      data-size={resolvedSize}
      data-shape={shape}
      type={typeName}
      disabled={disabled || loading}
      className={cn(
        buttonVariants({ type, size: resolvedSize, shape, className }),
        svgOnly && SVG_ONLY_CLASSES[size ?? "medium"],
        shadowClass,
      )}
      {...props}
    >
      {loading ? (
        <span className="mr-2 flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
          <Loader2 className="size-3.5 animate-spin" />
          <span className="sr-only">{t("Loading...")}</span>
        </span>
      ) : (
        prefix && (
          <span className="mr-2 flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
            {prefix}
          </span>
        )
      )}
      {svgOnly ? children : <span className="inline-block truncate">{children}</span>}
      {!loading && suffix && (
        <span className="ml-2 flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
          {suffix}
        </span>
      )}
    </Comp>
  );
}

/* ---------- ButtonLink ---------- */

export interface ButtonLinkProps extends Omit<
  React.ComponentProps<"a">,
  "type" | "prefix" | "shape"
> {
  type?: ButtonType;
  size?: ButtonSize;
  shape?: ButtonShape;
  shadow?: boolean;
  svgOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

function ButtonLink({
  className,
  type = "default",
  size = "medium",
  shape = "square",
  shadow = false,
  svgOnly = false,
  loading = false,
  prefix,
  suffix,
  disabled,
  href,
  children,
  ...props
}: ButtonLinkProps) {
  const { t } = useI18n();
  const resolvedSize = size;
  return (
    <a
      data-slot="button"
      data-geist-button=""
      data-type={type}
      data-size={resolvedSize}
      data-shape={shape}
      href={href}
      aria-disabled={disabled || loading || undefined}
      className={cn(
        buttonVariants({ type, size: resolvedSize, shape, className }),
        svgOnly && SVG_ONLY_CLASSES[size ?? "medium"],
        shadow && "shadow-lg",
      )}
      {...props}
    >
      {loading ? (
        <span className="mr-2 flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
          <Loader2 className="size-3.5 animate-spin" />
          <span className="sr-only">{t("Loading...")}</span>
        </span>
      ) : (
        prefix && (
          <span className="mr-2 flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
            {prefix}
          </span>
        )
      )}
      {svgOnly ? children : <span className="inline-block truncate">{children}</span>}
      {!loading && suffix && (
        <span className="ml-2 flex size-3.5 shrink-0 items-center justify-center" aria-hidden>
          {suffix}
        </span>
      )}
    </a>
  );
}

/* ---------- CustomButton ---------- */

export interface CustomColorSet {
  foreground: string;
  background: string;
  border: string;
}

export interface CustomButtonProps extends Omit<ButtonProps, "type" | "className" | "style"> {
  normal: CustomColorSet;
  hover: CustomColorSet;
  active: CustomColorSet;
  width?: number;
}

function CustomButton({ normal, hover, active, width, children, ...props }: CustomButtonProps) {
  const style: React.CSSProperties = {
    // CSS custom properties for state-based color override
    ["--custom-fg" as string]: normal.foreground,
    ["--custom-bg" as string]: normal.background,
    ["--custom-border" as string]: normal.border,
  };

  if (width) style.width = `${width}px`;

  return (
    <Button
      type="default"
      className={cn(
        "border border-[var(--custom-border)] bg-[var(--custom-bg)] text-[var(--custom-fg)]",
        "hover:border-[var(--custom-hover-border)] hover:bg-[var(--custom-hover-bg)] hover:text-[var(--custom-hover-fg)]",
        "active:border-[var(--custom-active-border)] active:bg-[var(--custom-active-bg)] active:text-[var(--custom-active-fg)]",
      )}
      style={{
        ...style,
        ["--custom-hover-fg" as string]: hover.foreground,
        ["--custom-hover-bg" as string]: hover.background,
        ["--custom-hover-border" as string]: hover.border,
        ["--custom-active-fg" as string]: active.foreground,
        ["--custom-active-bg" as string]: active.background,
        ["--custom-active-border" as string]: active.border,
      }}
      typeName="button"
      {...props}
    >
      {children}
    </Button>
  );
}

export { Button, ButtonLink, CustomButton, buttonVariants };
