import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";

/**
 * MultiSelect — Geist 官方 MultiSelect（docs/geist-markdown-refs/components/multi-select.md 实测）。
 * 官方 API（2026-08）：
 * - MultiSelectRoot / MultiSelectTrigger / MultiSelectContent / MultiSelectRow：
 *   状态完全受控（checked / onChange / onSelectOnly / onSelectAll / selectedCount / totalCount），
 *   Row 内置「智能选择」隐藏 action（hover/focus 显示）：
 *   · 已选中 → "Select Only"（仅保留此项）
 *   · 未选中且 selectedCount === totalCount - 1 → "Select All"（全选）
 *   · 其余 → "Toggle"（切换单项）
 * - 键盘：↑/↓ 在行间移动并保持 checkbox/button 焦点类型，←/→ 在行内切换 checkbox/action，
 *   Enter/Space 由原生控件执行。
 * - trigger 几何：h:36px · pad:0px 13px 0px 10px · 400 14px/21px。
 */

/* ---------------- 官方无状态根组件 ---------------- */

interface MultiSelectRootProps {
  className?: string;
  children: React.ReactNode;
}

function MultiSelectRoot({ className, children }: MultiSelectRootProps) {
  return (
    <PopoverPrimitive.Root>
      <div className={cn("relative", className)}>{children}</div>
    </PopoverPrimitive.Root>
  );
}

/* ---------------- Trigger / Content ---------------- */

const MultiSelectTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      className={cn(
        // 官方实测：h:36px · pad:0px 13px 0px 10px · 400 14px/21px
        "flex h-9 w-full items-center justify-between gap-2 rounded-[6px] border border-gray-alpha-400 bg-background py-0 pr-[13px] pl-[10px] text-copy-14 input-focus-ring",
        "data-[state=open]:border-[var(--input-focus-border)] data-[state=open]:shadow-[0_0_0_4px_var(--input-focus-glow)] data-[state=open]:outline-none",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden />
    </PopoverPrimitive.Trigger>
  );
});
MultiSelectTrigger.displayName = PopoverPrimitive.Trigger.displayName;

const MultiSelectContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 4, children, onKeyDown, ...props }, ref) => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  // 官方键盘语义：↑/↓ 行间移动（保持 checkbox/button 焦点类型），←/→ 行内切换
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const content = contentRef.current;
    if (!content) return;

    const rows = Array.from(content.querySelectorAll<HTMLElement>("[data-multi-select-row]"));
    if (rows.length === 0) return;

    const active = document.activeElement;
    const activeRowIndex = rows.findIndex((row) => row.contains(active));
    if (activeRowIndex === -1) return;

    const controlOf = (row: HTMLElement): "checkbox" | "action" =>
      row.querySelector("[data-multi-select-action]") === active ? "action" : "checkbox";

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = Math.min(rows.length - 1, Math.max(0, activeRowIndex + delta));
      const nextRow = rows[nextIndex];
      const control = controlOf(rows[activeRowIndex]);
      const target =
        control === "action"
          ? nextRow.querySelector<HTMLElement>("[data-multi-select-action]")
          : nextRow.querySelector<HTMLElement>("[data-multi-select-checkbox]");
      (target ?? nextRow.querySelector<HTMLElement>("[data-multi-select-checkbox]"))?.focus();
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
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg border border-gray-alpha-400 bg-popover text-popover-foreground shadow-md",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      >
        <div ref={contentRef} onKeyDown={handleKeyDown} className="max-h-64 overflow-y-auto p-1">
          {children}
        </div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
MultiSelectContent.displayName = PopoverPrimitive.Content.displayName;

/* ---------------- 官方 MultiSelectRow（智能选择） ---------------- */

interface MultiSelectRowProps {
  /** 行名称（checkbox aria-label 为 "Select {name}"） */
  name: string;
  checked: boolean;
  /** checkbox 切换（单项） */
  onChange: () => void;
  /** 智能 action：Select Only（仅保留本项） */
  onSelectOnly: () => void;
  /** 智能 action：Select All（全选） */
  onSelectAll: () => void;
  selectedCount: number;
  totalCount: number;
  /** 可选的数量角标 */
  count?: number;
  className?: string;
}

function MultiSelectRow({
  name,
  checked,
  onChange,
  onSelectOnly,
  onSelectAll,
  selectedCount,
  totalCount,
  count,
  className,
}: MultiSelectRowProps) {
  // 官方智能选择语义：按选中状态决定隐藏 action 的文案与行为
  const action = checked
    ? { label: "Select Only", run: onSelectOnly }
    : selectedCount === totalCount - 1
      ? { label: "Select All", run: onSelectAll }
      : { label: "Toggle", run: onChange };

  return (
    <div
      data-multi-select-row
      className={cn(
        "group flex items-center gap-2 rounded-[6px] px-2 py-1.5 outline-none transition-colors hover:bg-gray-alpha-100",
        className,
      )}
    >
      <Checkbox
        data-multi-select-checkbox
        checked={checked}
        onCheckedChange={onChange}
        aria-label={`Select ${name}`}
        className="shrink-0"
      />
      <span className="min-w-0 flex-1 truncate text-copy-14 text-foreground">{name}</span>
      {count !== undefined && (
        <span className="shrink-0 text-copy-13 text-muted-foreground">{count}</span>
      )}
      <button
        type="button"
        data-multi-select-action
        onClick={action.run}
        aria-label={`${action.label} ${name}`}
        className="shrink-0 rounded-[6px] px-1.5 py-0.5 text-label-12 text-muted-foreground opacity-0 transition-opacity outline-none hover:bg-gray-alpha-200 hover:text-foreground focus-visible:bg-gray-alpha-200 focus-visible:text-foreground focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {action.label}
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
