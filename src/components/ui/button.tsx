import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Button — Geist 官方 Button 完整实现。
 * 对齐 vercel.com/geist/button 实测规范（2026-08-08 computed style）：
 * - variants: default / destructive / warning / outline / secondary / ghost / link
 * - sizes: tiny 24 / small 32 / medium 36 / large 40（默认 medium）
 * - shapes: square（默认）/ circle（pill）/ rounded（pill + shadow）
 * - prefix / suffix：图标 14px，图标↔文字间距 6px（margin 控制，
 *   无 flex gap，与官方一致）；padding 左右 10px
 * - loading：spinner + 保持 label，disabled 态
 * - disabled：default 变灰（gray-100 + gray-700），其余保持原色
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md text-[length:14px] font-medium whitespace-nowrap transition-all outline-none focus-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-action-hover hover:text-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-danger-hover hover:text-destructive-foreground focus-visible:ring-destructive/20",
        warning:
          "bg-warning-action text-warning-action-foreground hover:bg-warning-action-hover hover:text-warning-action-foreground focus-visible:ring-warning-action/30",
        outline:
          "border border-gray-alpha-400 bg-background text-foreground hover:bg-gray-alpha-200 hover:text-foreground",
        secondary:
          "border border-gray-alpha-400 bg-background text-foreground hover:bg-gray-alpha-200 hover:text-foreground",
        ghost: "hover:bg-gray-alpha-200 hover:text-foreground",
        link: "text-link underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-2.5",
        xs: "h-6 rounded-md px-1.5 [&_svg]:size-3",
        sm: "h-8 rounded-md px-1.5",
        lg: "h-10 rounded-[8px] px-3.5",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      shape: {
        square: "",
        circle: "rounded-full",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "square",
    },
  },
);

type ButtonVariant = VariantProps<typeof buttonVariants>;

interface ButtonProps extends Omit<React.ComponentProps<"button">, "prefix">, ButtonVariant {
  asChild?: boolean;
  /** 加载态：显示 spinner 并禁用（保持 label） */
  loading?: boolean;
  /** 前缀图标（14px，与文字间距 6px，官方规范） */
  prefix?: React.ReactNode;
  /** 后缀图标（14px，与文字间距 6px，官方规范） */
  suffix?: React.ReactNode;
}

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "square",
  asChild = false,
  loading = false,
  prefix,
  suffix,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden />
      ) : (
        prefix && (
          <span className="mr-1.5 flex shrink-0 items-center [&_svg]:size-3.5" aria-hidden>
            {prefix}
          </span>
        )
      )}
      <span className="inline-block truncate">{children}</span>
      {!loading && suffix && (
        <span className="ml-1.5 flex shrink-0 items-center [&_svg]:size-3.5" aria-hidden>
          {suffix}
        </span>
      )}
    </Comp>
  );
}

export { Button, buttonVariants, type ButtonVariant };
