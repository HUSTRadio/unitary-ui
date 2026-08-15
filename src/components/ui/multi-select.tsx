import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";

/**
 * Multi Select — Geist 官方 Multi Select（2026-08-15 实时页面）。
 *
 * Trigger 为 36px 高的紧凑按钮；Content 使用 menu material，并由 Popover
 * 负责 Portal、Escape 与关闭后的焦点归还。打开后焦点先落在 dialog，方向键
 * 再进入组合控件：上下键跨行、左右键在 checkbox/action 间切换。
 */

interface MultiSelectRootProps {
  className?: string;
  children: React.ReactNode;
}

function MultiSelectRoot({ className, children }: MultiSelectRootProps) {
  return (
    <PopoverPrimitive.Root>
      <div
        data-slot="multi-select-root"
        className={cn("relative w-fit max-w-full max-sm:w-full", className)}
      >
        {children}
      </div>
    </PopoverPrimitive.Root>
  );
}

const MultiSelectTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      data-slot="multi-select-trigger"
      className={cn(
        "multi-select-trigger group/multi-select-trigger relative flex h-9 w-full max-w-full touch-manipulation items-center justify-between rounded-[6px] border-0 bg-background-100 py-0 pr-[13px] pl-[10px] text-foreground shadow-[0_0_0_1px_var(--gray-400)] outline-none hover:shadow-[0_0_0_1px_var(--gray-alpha-500)] data-[state=open]:shadow-[0_0_0_1px_var(--gray-alpha-500)]",
        className,
      )}
      {...props}
    >
      <span className="truncate px-[6px] transition-all">
        <span className="-mx-0.5 flex h-[21px] transition-all">{children}</span>
      </span>
      <span className="ml-1 -mr-px flex size-[14px] shrink-0 transition-all">
        <div className="size-[14px] text-gray-700 transition-[color,transform] duration-150 group-data-[state=open]/multi-select-trigger:rotate-180 motion-reduce:transition-none">
          <ChevronDown className="block size-[14px] transition-all" aria-hidden />
        </div>
      </span>
    </PopoverPrimitive.Trigger>
  );
});
MultiSelectTrigger.displayName = PopoverPrimitive.Trigger.displayName;

type ContentProps = React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>;

const MultiSelectContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  ContentProps
>(
  (
    { className, align = "start", sideOffset = 8, children, onKeyDown, onOpenAutoFocus, ...props },
    ref,
  ) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const setContentRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const handleOpenAutoFocus: NonNullable<ContentProps["onOpenAutoFocus"]> = (event) => {
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
      const controls = Array.from(
        content.querySelectorAll<HTMLElement>(
          "[data-multi-select-checkbox], [data-multi-select-action]",
        ),
      );

      if (event.key === "Tab") {
        event.preventDefault();
        if (controls.length === 0) return;
        const activeIndex = controls.indexOf(active as HTMLElement);
        const delta = event.shiftKey ? -1 : 1;
        const nextIndex =
          activeIndex === -1
            ? event.shiftKey
              ? controls.length - 1
              : 0
            : (activeIndex + delta + controls.length) % controls.length;
        controls[nextIndex]?.focus();
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
        <PopoverPrimitive.Content
          ref={setContentRef}
          data-slot="multi-select-content"
          role="dialog"
          align={align}
          sideOffset={sideOffset}
          onOpenAutoFocus={handleOpenAutoFocus}
          onKeyDown={handleKeyDown}
          className={cn(
            "material-menu multi-select-content max-h-[min(var(--radix-popover-content-available-height),376px)] min-w-[var(--radix-popover-trigger-width)] overflow-y-scroll overscroll-contain p-2 text-popover-foreground outline-none",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:animate-none",
            className,
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);
MultiSelectContent.displayName = PopoverPrimitive.Content.displayName;

interface MultiSelectRowProps {
  name: string;
  checked: boolean;
  onChange: () => void;
  onSelectOnly: () => void;
  onSelectAll: () => void;
  selectedCount: number;
  totalCount: number;
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
  const action = checked
    ? { label: "Check All", run: onSelectAll }
    : { label: "Only", run: onSelectOnly };

  return (
    <div
      data-slot="multi-select-row"
      data-multi-select-row
      className={cn("group/row flex h-7 items-center", className)}
    >
      <div
        data-slot="multi-select-checkbox-target"
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[4px]"
        onClick={(event) => {
          if (event.target === event.currentTarget) onChange();
        }}
      >
        <Checkbox
          data-multi-select-checkbox
          checked={checked}
          onChange={onChange}
          tabIndex={-1}
          aria-label={`${name}. ${checked ? "Uncheck" : "Check"}`}
          className="after:absolute after:-inset-1.5 after:content-['']"
        />
      </div>
      <button
        type="button"
        data-slot="multi-select-action"
        data-multi-select-action
        tabIndex={-1}
        onClick={action.run}
        aria-label={`${name}. ${action.label}`}
        className="flex h-7 min-w-0 flex-1 touch-manipulation items-center justify-between rounded-[4px] p-1 text-left outline-none hover:bg-gray-alpha-200 focus-visible:bg-gray-alpha-200"
      >
        <span className="flex min-w-0 items-center gap-2 text-label-14 text-foreground">
          <span className="truncate">{name}</span>
          {count !== undefined ? (
            <span className="shrink-0 text-label-13 text-muted-foreground">{count}</span>
          ) : null}
        </span>
        <span className="flex w-16 shrink-0 justify-end">
          <span className="rounded-[4px] px-1 py-0.5 text-button-12 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 group-focus-within/row:opacity-100 motion-reduce:transition-none">
            {action.label}
          </span>
        </span>
      </button>
    </div>
  );
}

export {
  MultiSelectRoot,
  MultiSelectTrigger,
  MultiSelectContent,
  MultiSelectRow,
  type MultiSelectRootProps,
  type MultiSelectRowProps,
};
