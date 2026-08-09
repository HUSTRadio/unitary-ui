import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Checkbox } from "./checkbox";

/**
 * MultiSelect — Geist 官方 MultiSelect 简化实现（docs/geist-markdown-refs/components/multi-select.md 实测）。
 * 用 radix-ui Popover。Trigger 显示已选项数量，Content 列出 Checkbox + label。
 * 状态由 <MultiSelect> 统一管理（受控 value / 非受控 internal），
 * 通过 context 暴露 selected 与 toggle 给 Trigger / Item。
 */

type MultiSelectContextValue = {
  selected: string[];
  toggle: (value: string) => void;
};

const MultiSelectContext = React.createContext<MultiSelectContextValue | null>(null);

function useMultiSelect() {
  const ctx = React.useContext(MultiSelectContext);
  if (!ctx) throw new Error("MultiSelect 子组件必须在 <MultiSelect> 内使用");
  return ctx;
}

type MultiSelectProps = {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
  children: React.ReactNode;
};

function MultiSelect({
  value: valueProp,
  defaultValue = [],
  onValueChange,
  className,
  children,
}: MultiSelectProps) {
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const selected = valueProp !== undefined ? valueProp : internal;

  const toggle = (itemValue: string) => {
    const next = selected.includes(itemValue)
      ? selected.filter((v) => v !== itemValue)
      : [...selected, itemValue];
    setInternal(next);
    onValueChange?.(next);
  };

  const ctx: MultiSelectContextValue = { selected, toggle };

  return (
    <MultiSelectContext.Provider value={ctx}>
      <PopoverPrimitive.Root>
        <div className={cn("relative", className)}>{children}</div>
      </PopoverPrimitive.Root>
    </MultiSelectContext.Provider>
  );
}

const MultiSelectTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { selected } = useMultiSelect();
  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-8 w-full items-center justify-between gap-2 rounded-[6px] border border-gray-alpha-400 bg-background px-3 text-copy-14 input-focus-ring",
        "data-[state=open]:border-[var(--input-focus-border)] data-[state=open]:shadow-[0_0_0_4px_var(--input-focus-glow)] data-[state=open]:outline-none",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children ?? `${selected.length} selected`}</span>
      <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden />
    </PopoverPrimitive.Trigger>
  );
});
MultiSelectTrigger.displayName = PopoverPrimitive.Trigger.displayName;

const MultiSelectContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 4, children, ...props }, ref) => (
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
      <div className="max-h-64 overflow-y-auto p-1">{children}</div>
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
MultiSelectContent.displayName = PopoverPrimitive.Content.displayName;

const MultiSelectItem = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const { selected, toggle } = useMultiSelect();
  const checked = selected.includes(value);
  return (
    <label
      ref={ref}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 transition-colors hover:bg-gray-alpha-100",
        className,
      )}
      {...props}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={() => toggle(value)}
        aria-label={typeof children === "string" ? children : undefined}
      />
      <span className="truncate text-copy-14 text-foreground">{children}</span>
    </label>
  );
});
MultiSelectItem.displayName = "MultiSelectItem";

export { MultiSelect, MultiSelectTrigger, MultiSelectContent, MultiSelectItem };
