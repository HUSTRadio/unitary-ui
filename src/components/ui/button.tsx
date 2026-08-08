import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Button — Geist 官方 Button 完整实现。
 * 对齐 vercel.com/geist/button 实测规范：
 * - variants: default / destructive / warning / outline / secondary / ghost / link
 * - sizes: tiny 24 / small 32 / medium 36 / large 40（默认 medium）
 * - shapes: square（默认）/ circle（pill）/ rounded（pill + shadow）
 * - prefix / suffix 图标插槽（14px svg，间距对齐官方）
 * - loading：spinner + 保持 label，disabled 态
 * - disabled：default 变灰（gray-100 + gray-700），其余保持原色
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-[length:14px] font-medium whitespace-nowrap transition-all outline-none focus-ring disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
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
        default: "h-9 gap-2 px-2.5 has-[>svg]:px-2",
        xs: "h-6 gap-1 rounded-md px-1.5 has-[>svg]:px-1 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-1.5 has-[>svg]:px-1.5",
        lg: "h-10 rounded-[8px] px-3.5 has-[>svg]:px-3",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
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

interface ButtonProps extends React.ComponentProps<"button">, ButtonVariant {
  asChild?: boolean;
  /** 加载态：显示 spinner 并禁用（保持 label） */
  loading?: boolean;
  /** 前缀图标 */
  prefix?: React.ReactNode;
  /** 后缀图标 */
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
          <span className="mr-[3px] flex min-w-5 shrink-0 items-center" aria-hidden>
            {prefix}
          </span>
        )
      )}
      <span className="inline-block truncate">{children}</span>
      {!loading && suffix && (
        <span className="ml-1 mr-0.5 flex shrink-0 items-center" aria-hidden>
          {suffix}
        </span>
      )}
    </Comp>
  );
}

export { Button, buttonVariants, type ButtonVariant };
