import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { layoutRootStyle, layoutSurfaceStyle, type ControlLayout } from "@/lib/control-layout";
import { FieldError, FIELD_ERROR_RING } from "./field-error";

/**
 * Select — Geist 官方 Select（docs/geist-markdown-refs/components/select.md + 实时 vercel.com/geist/select）。
 *
 * **组合式 API**（v2）：基于 Radix Select 的自定义弹层——Trigger、Portal、Content、
 * Viewport、Item、Group、Label、Separator + 隐藏表单 select（BubbleInput）。
 * 不再接受原生 option/optgroup 子元素与原生 change 事件。
 *
 * ```tsx
 * <Select value={value} onValueChange={setValue}>
 *   <SelectGroup label="Framework">
 *     <SelectItem value="next">Next.js</SelectItem>
 *   </SelectGroup>
 *   <SelectSeparator />
 * </Select>
 * ```
 *
 * - 弹层：Geist menu material；选项高 36px（h-9）、圆角 6px；Viewport/Group 2px 间隙（gap-0.5）。
 * - 尺寸：small 32px / 默认 36px / large 40px（large 16px 文字、8px 圆角）。
 * - prefix / suffix：左侧/右侧元素（pointer-events-none；suffix 存在时替代 chevron）。
 * - error：共享 FieldError 基础层（4px 间距、图标、排版、ARIA 统一）+ 红色光环。
 * - 键盘：方向键 / Space / Enter / Escape / typeahead / 焦点归还由 Radix 承担；
 *   reduced-motion 下弹层动画禁用。
 * - 颜色按官方实时实测值落地（light 1440×900）：ring 用 --gray-alpha-400，
 *   error 环 #ee0000 + rgba(203,42,47,0.16)。
 * - Item 高亮态使用 bg-gray-alpha-100；持久选中态仅加粗并在右侧显示 check，
 *   不保留背景，避免与键盘高亮态混淆；item 间距保持 gap-0.5。
 */

export interface SelectProps extends Omit<
  React.ComponentProps<typeof SelectPrimitive.Root>,
  "dir"
> {
  /** 透传到触发器表面的类名（触发按钮，非外层字段容器） */
  className?: string;
  /** 直接命名触发按钮；优先于可见 label。 */
  "aria-label"?: string;
  /** 使用外部元素命名触发按钮；没有 aria-label 时优先于可见 label。 */
  "aria-labelledby"?: string;
  /** 占位文案（未选择时显示在触发器上） */
  placeholder?: string;
  /** small 32px / 默认 36px / large 40px */
  size?: "small" | "default" | "large";
  /** 前缀元素（左侧，pointer-events-none） */
  prefix?: React.ReactNode;
  /** 后缀元素（右侧，替代 chevron，pointer-events-none） */
  suffix?: React.ReactNode;
  /** 校验错误文案（命名字段并以句号结尾，如 "Please select a value."） */
  error?: React.ReactNode;
  /** 字段标签（13px 文本；通过 aria-labelledby 命名触发器） */
  label?: React.ReactNode;
  /** 统一尺寸 API：宽度/flex → 字段根容器；高度 → 触发器表面 */
  layout?: ControlLayout;
}

/** SelectGroup — 选项分组（可选 label 标题）。 */
interface SelectGroupProps extends React.ComponentProps<typeof SelectPrimitive.Group> {
  /** 分组标题（渲染为 Geist Label 13 分组文本） */
  label?: React.ReactNode;
}

function SelectGroup({ className, label, children, ...props }: SelectGroupProps) {
  return (
    <SelectPrimitive.Group className={cn("group/select-group", className)} {...props}>
      {label != null && (
        <SelectPrimitive.Label
          data-slot="select-group-label"
          className="px-2 py-1.5 text-label-13 text-gray-900"
        >
          {label}
        </SelectPrimitive.Label>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </SelectPrimitive.Group>
  );
}

/** SelectSeparator — 分组分隔线。 */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("-mx-1 my-1 h-px bg-gray-alpha-400", className)}
      {...props}
    />
  );
}

// pointer-coarse：触屏命中区 ≥44（HIG-AUD-013）；桌面维持各档原视觉高度
const TRIGGER_SIZE_CLASS = {
  small: "h-8 rounded-lg text-[14px] pointer-coarse:min-h-11",
  default: "h-9 rounded-lg text-[14px] leading-5 pointer-coarse:min-h-11",
  large: "h-10 rounded-lg text-[16px] leading-6 pointer-coarse:min-h-11",
} as const;

const ITEM_CLASS =
  "relative flex h-9 cursor-pointer select-none items-center rounded-overlay-item pl-2 pr-8 text-copy-14 text-gray-900 " +
  "outline-none data-[highlighted]:bg-gray-alpha-100 " +
  "data-[state=checked]:font-semibold " +
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 " +
  "pointer-coarse:min-h-11";

/** SelectItem — 弹层选项（value 必填；内容渲染为 ItemText）。 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item data-slot="select-item" className={cn(ITEM_CLASS, className)} {...props}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        aria-hidden="true"
        className="absolute right-2 inline-flex size-4 items-center justify-center"
      >
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      placeholder,
      size = "default",
      prefix,
      suffix,
      error,
      label,
      layout,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      children,
      ...props
    },
    ref,
  ) => {
    const { t } = useI18n();
    const errorId = React.useId();
    const labelId = React.useId();
    const hasPrefix = prefix != null;
    const hasSuffix = suffix != null;
    const describedBy = error ? errorId : undefined;

    return (
      <div
        data-slot="select-field"
        className="block w-full min-w-0"
        style={layoutRootStyle(layout)}
      >
        <SelectPrimitive.Root {...props}>
          {label ? (
            <div
              id={labelId}
              data-slot="select-label"
              className="mb-2 block max-w-full cursor-text text-[13px] text-gray-900 capitalize"
            >
              {label}
            </div>
          ) : null}
          <SelectPrimitive.Trigger
            ref={ref}
            data-slot="select-trigger"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy ?? (!ariaLabel && label ? labelId : undefined)}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            style={layoutSurfaceStyle(layout)}
            className={cn(
              "group/select-trigger peer flex w-full max-w-full items-center border-none bg-background px-3 text-left text-gray-1000 outline-none",
              "shadow-[0_0_0_1px_var(--gray-alpha-400)] transition-[box-shadow,color] duration-(--uni-duration-base)",
              "hover:shadow-[0_0_0_1px_var(--gray-alpha-500)]",
              "focus:!shadow-[0_0_0_1px_#00000057,0_0_0_4px_#00000029] focus:outline-none",
              "data-[state=open]:!shadow-[0_0_0_1px_#00000057,0_0_0_4px_#00000029]",
              "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-700 disabled:opacity-100",
              "disabled:shadow-[0_0_0_1px_var(--gray-alpha-400)]",
              "aria-[invalid=true]:shadow-[0_0_0_1px_#ee0000,0_0_0_4px_rgba(203,42,47,0.16)] aria-[invalid=true]:outline-none",
              TRIGGER_SIZE_CLASS[size],
              error && FIELD_ERROR_RING,
              hasPrefix && "pl-10",
              className,
            )}
          >
            {hasPrefix ? (
              <span
                aria-hidden="true"
                className="pointer-events-none mr-2 inline-flex shrink-0 text-gray-900"
              >
                {prefix}
              </span>
            ) : null}
            <span className="flex-1 truncate">
              <SelectPrimitive.Value placeholder={placeholder ?? t("Select…")} />
            </span>
            {hasSuffix ? (
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none ml-2 inline-flex shrink-0 text-gray-700",
                  error && "text-error-foreground",
                )}
              >
                {suffix}
              </span>
            ) : (
              <SelectPrimitive.Icon asChild>
                <span aria-hidden="true" className="ml-2 inline-flex shrink-0 text-gray-700">
                  <ChevronDown className="size-3.5 transition-transform duration-(--uni-motion-feedback) ease-snap group-data-[state=open]/select-trigger:rotate-180 motion-reduce:transition-none" />
                </span>
              </SelectPrimitive.Icon>
            )}
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={6}
              data-slot="select-content"
              className={cn(
                "material-menu relative z-[var(--uni-z-popover)] max-h-[min(var(--radix-select-content-available-height),376px)] min-w-(--radix-select-trigger-width) w-full overflow-y-auto overscroll-contain p-1 text-popover-foreground",
                "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-(--uni-duration-fast) motion-reduce:animate-none!",
              )}
            >
              <SelectPrimitive.Viewport className="flex flex-col gap-0.5">
                {children}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
          {/* 隐藏表单 select：FormData / required / name 契约（Radix unstable_BubbleInput） */}
          <SelectPrimitive.unstable_BubbleInput />
        </SelectPrimitive.Root>
        <FieldError id={errorId} large={size === "large"}>
          {error}
        </FieldError>
      </div>
    );
  },
);
Select.displayName = "Select";

export {
  Select,
  SelectGroup,
  SelectSeparator,
  SelectItem,
  type SelectGroupProps,
};
