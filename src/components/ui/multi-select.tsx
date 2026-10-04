import { withLayerBridge } from "@/lib/layer-bridge";
import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { layoutRootStyle, type ControlLayout } from "@/lib/control-layout";
import { Checkbox } from "./checkbox";

const LayerPopoverPrimitiveContent = withLayerBridge(PopoverPrimitive.Content);

/**
 * Multi Select — Geist 官方 Multi Select（2026-08-15 实时页面）。
 *
 * Trigger 为 36px 高的紧凑按钮；Content 使用 menu material，并由 Popover
 * 负责 Portal、Escape 与关闭后的焦点归还。打开后焦点先落在 dialog，方向键
 * 再进入组合控件：上下键跨行、左右键在 checkbox/action 间切换。
 */

export interface MultiSelectRootProps extends React.ComponentProps<typeof PopoverPrimitive.Root> {
  className?: string;
  /** 统一尺寸 API：宽度三件套+flex 作用于根容器 */
  layout?: ControlLayout;
}

function MultiSelectRoot({ className, layout, children, ...props }: MultiSelectRootProps) {
  return (
    <PopoverPrimitive.Root {...props}>
      <div
        data-slot="multi-select-root"
        style={layoutRootStyle(layout)}
        className={cn("relative w-fit max-w-full max-sm:w-full", className)}
      >
        {children}
      </div>
    </PopoverPrimitive.Root>
  );
}

export type MultiSelectTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Trigger
>;

const MultiSelectTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  MultiSelectTriggerProps
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      data-slot="multi-select-trigger"
      className={cn(
        // pointer-coarse：触屏命中区 ≥44（HIG-AUD-013）；桌面维持 36px 触发器
        "multi-select-trigger group/multi-select-trigger relative flex h-9 w-full max-w-full touch-manipulation items-center justify-between rounded-lg border-0 bg-background-100 py-0 pr-[13px] pl-[10px] text-foreground shadow-[0_0_0_1px_var(--gray-400)] outline-none hover:shadow-[0_0_0_1px_var(--gray-alpha-500)] data-[state=open]:shadow-[0_0_0_1px_var(--gray-alpha-500)] pointer-coarse:min-h-11",
        className,
      )}
      {...props}
    >
      <span className="truncate px-[6px] transition-all">
        <span className="-mx-0.5 flex h-[21px] transition-all">{children}</span>
      </span>
      <span className="ml-1 -mr-px flex size-[14px] shrink-0 transition-all">
        <div className="size-[14px] text-gray-700 transition-[color,transform] duration-(--uni-duration-fast) group-data-[state=open]/multi-select-trigger:rotate-180 motion-reduce:transition-none">
          <ChevronDown className="block size-[14px] transition-all" aria-hidden />
        </div>
      </span>
    </PopoverPrimitive.Trigger>
  );
});
MultiSelectTrigger.displayName = PopoverPrimitive.Trigger.displayName;

export type MultiSelectContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverPrimitive.Content
>;

const MultiSelectContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  MultiSelectContentProps
>(
  (
    {
      className,
      align = "start",
      sideOffset = 8,
      children,
      onKeyDown,
      onOpenAutoFocus,
      "aria-label": ariaLabelProp,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const { t } = useI18n();
    const contentRef = React.useRef<HTMLDivElement>(null);
    /** HIG-AUD-016：面板边缘 Tab 时用它走 Radix 的公开关闭通道（等价于点关闭）。 */
    const closeRef = React.useRef<HTMLButtonElement>(null);
    const setContentRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const handleOpenAutoFocus: NonNullable<MultiSelectContentProps["onOpenAutoFocus"]> = (
      event,
    ) => {
      onOpenAutoFocus?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      contentRef.current?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const content = contentRef.current;
      if (!content) return;

      const rows = Array.from(content.querySelectorAll<HTMLElement>("[data-multi-select-row]"));
      if (rows.length === 0) return;

      const active = document.activeElement;

      // HIG-AUD-016：不再用 `preventDefault` 把 Tab 锁在面板内（APG 反模式——键盘用户
      // 只能靠 Escape 离开）。但 Radix Popover 的 FocusScope **硬编码 `loop: true`**
      // （`@radix-ui/react-popover/dist/index.mjs:222-227`），只去掉我们自己的拦截仍会在
      // 内容里循环，Tab 永远走不出去。因此在**面板边缘**显式接管：Tab 到最后一个可聚焦
      // 元素（Shift+Tab 到第一个）时关闭浮层——等价于通行的「焦点移出浮层即关闭」约定，
      // 焦点由 Radix 的 `onCloseAutoFocus` 交还触发元素。方向键 roving 保持不变。
      if (event.key === "Tab") {
        const focusables = Array.from(
          content.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]):not([hidden]):not([aria-hidden="true"]), input:not([disabled]):not([hidden]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((node) => node !== content);
        const first = focusables[0];
        const last = focusables.at(-1);
        const leaving = event.shiftKey ? active === first : active === last;
        if (leaving && focusables.length > 0) {
          event.preventDefault();
          closeRef.current?.click();
        }
        return;
      }

      const activeRowIndex = rows.findIndex((row) => row.contains(active));
      if (active === content && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        const row = event.key === "ArrowDown" ? rows[0] : rows.at(-1);
        row?.querySelector<HTMLElement>("[data-multi-select-action]")?.focus();
        return;
      }
      if (activeRowIndex === -1) return;

      const controlOf = (row: HTMLElement): "checkbox" | "action" =>
        row.querySelector("[data-multi-select-action]") === active ? "action" : "checkbox";

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const delta = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = Math.min(rows.length - 1, Math.max(0, activeRowIndex + delta));
        const nextRow = rows[nextIndex];
        const selector =
          controlOf(rows[activeRowIndex]) === "action"
            ? "[data-multi-select-action]"
            : "[data-multi-select-checkbox]";
        nextRow?.querySelector<HTMLElement>(selector)?.focus();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const row = rows[activeRowIndex];
        const checkbox = row.querySelector<HTMLElement>("[data-multi-select-checkbox]");
        const action = row.querySelector<HTMLElement>("[data-multi-select-action]");
        if (event.key === "ArrowRight" && active === checkbox && action) {
          event.preventDefault();
          action.focus();
        } else if (event.key === "ArrowLeft" && active === action && checkbox) {
          event.preventDefault();
          checkbox.focus();
        }
      }
    };

    return (
      <PopoverPrimitive.Portal>
        <LayerPopoverPrimitiveContent
          ref={setContentRef}
          data-slot="multi-select-content"
          role="dialog"
          // HIG-AUD-016：`role="dialog"` 必须有可访问名称。调用方可用 aria-label /
          // aria-labelledby 覆盖，缺省回退到本地化的通用名称。
          aria-label={ariaLabelledBy ? undefined : (ariaLabelProp ?? t("Select options"))}
          aria-labelledby={ariaLabelledBy}
          align={align}
          sideOffset={sideOffset}
          onOpenAutoFocus={handleOpenAutoFocus}
          onKeyDown={handleKeyDown}
          className={cn(
            "material-menu multi-select-content z-[var(--uni-z-popover)] max-h-[min(var(--radix-popover-content-available-height),376px)] min-w-[var(--radix-popover-trigger-width)] overflow-y-scroll overscroll-contain p-2 text-popover-foreground outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-(--uni-duration-fast) motion-reduce:animate-none!",
            className,
          )}
          {...props}
        >
          {children}
          {/* 不可见、不可聚焦、不进入无障碍树的关闭通道（仅由边缘 Tab 触发） */}
          <PopoverPrimitive.Close asChild>
            <button ref={closeRef} type="button" hidden tabIndex={-1} aria-hidden="true" />
          </PopoverPrimitive.Close>
        </LayerPopoverPrimitiveContent>
      </PopoverPrimitive.Portal>
    );
  },
);
MultiSelectContent.displayName = PopoverPrimitive.Content.displayName;

export interface MultiSelectRowProps {
  name: string;
  checked: boolean;
  onChange: () => void;
  onSelectOnly: () => void;
  onSelectAll: () => void;
  count?: number;
  className?: string;
}

function MultiSelectRow({
  name,
  checked,
  onChange,
  onSelectOnly,
  onSelectAll,
  count,
  className,
}: MultiSelectRowProps) {
  const { t } = useI18n();
  const action = checked
    ? { label: t("Check All"), run: onSelectAll }
    : { label: t("Only"), run: onSelectOnly };

  return (
    <div
      data-slot="multi-select-row"
      data-multi-select-row
      className={cn(
        // pointer-coarse：触屏命中区 ≥44（HIG-AUD-013）；桌面维持 28px 行高
        "group/row flex h-7 items-center pointer-coarse:min-h-11",
        className,
      )}
    >
      <div
        data-slot="multi-select-checkbox-target"
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-sm"
        // HIG-AUD-016：这里只是**指针命中区的冗余放大**（触屏 ≥44 由行的 pointer-coarse 保底），
        // 真正的控件是内部 Checkbox——它现在可被 Tab 到达、带 role 与 aria-label；
        // 键盘/AT 不再依赖这个 div。
        onClick={(event) => {
          if (event.target === event.currentTarget) onChange();
        }}
      >
        <Checkbox
          data-multi-select-checkbox
          checked={checked}
          onChange={onChange}
          aria-label={`${name}. ${t(checked ? "Uncheck" : "Check")}`}
          className="after:absolute after:-inset-1.5 after:content-['']"
        />
      </div>
      <button
        type="button"
        data-slot="multi-select-action"
        data-multi-select-action
        // HIG-AUD-016：与 checkbox 一样进入 Tab 顺序（此前两者都是 -1，键盘只能靠方向键
        // 在面板内游走、且无法用 Tab 离开）；方向键 roving 仍作为快捷方式保留。
        onClick={action.run}
        aria-label={`${name}. ${action.label}`}
        className="flex h-7 min-w-0 flex-1 touch-manipulation items-center justify-between rounded-sm p-1 text-left outline-none hover:bg-gray-alpha-200 focus-visible:bg-gray-alpha-200"
      >
        <span className="flex min-w-0 items-center gap-2 text-label-14 text-foreground">
          <span className="truncate">{name}</span>
          {count !== undefined ? (
            <span className="shrink-0 text-label-13 text-muted-foreground">{count}</span>
          ) : null}
        </span>
        <span className="flex w-16 shrink-0 justify-end">
          <span className="rounded-sm px-1 py-0.5 text-button-12 text-muted-foreground opacity-0 transition-opacity duration-(--uni-duration-fast) group-hover/row:opacity-100 group-focus-within/row:opacity-100 motion-reduce:transition-none">
            {action.label}
          </span>
        </span>
      </button>
    </div>
  );
}

export { MultiSelectRoot, MultiSelectTrigger, MultiSelectContent, MultiSelectRow };
