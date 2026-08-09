import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

/**
 * Combobox — Geist 官方 Combobox 简化实现（docs/geist-markdown-refs/components/combobox.md 实测）。
 * 用 radix-ui Popover + Input 实现搜索下拉：
 * - Combobox 提供共享状态（value / query / open / items 注册表）
 * - ComboboxTrigger 展示当前选中项 label（或 placeholder）
 * - ComboboxContent 内含搜索 Input + 按 query 过滤的选项列表
 * - ComboboxItem 单个可选项，点击选中并关闭
 */


type ComboboxContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  query: string;
  setQuery: (query: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  registerItem: (value: string, label: React.ReactNode) => void;
  unregisterItem: (value: string) => void;
  getLabel: (value: string) => React.ReactNode;
  placeholder: string;
};

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useCombobox() {
  const ctx = React.useContext(ComboboxContext);
  if (!ctx) throw new Error("Combobox 子组件必须在 <Combobox> 内使用");
  return ctx;
}

type ComboboxProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
};

function Combobox({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  placeholder = "Select…",
  className,
  children,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const itemsRef = React.useRef<Map<string, React.ReactNode>>(new Map());

  const value = valueProp !== undefined ? valueProp : internalValue;

  const handleValueChange = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
  };

  const registerItem = (itemValue: string, label: React.ReactNode) => {
    itemsRef.current.set(itemValue, label);
  };

  const unregisterItem = (itemValue: string) => {
    itemsRef.current.delete(itemValue);
  };

  const getLabel = (itemValue: string) => itemsRef.current.get(itemValue) ?? itemValue;

  const ctx: ComboboxContextValue = {
    value,
    onValueChange: handleValueChange,
    query,
    setQuery,
    open,
    setOpen,
    registerItem,
    unregisterItem,
    getLabel,
    placeholder,
  };

  return (
    <ComboboxContext.Provider value={ctx}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <div className={cn("relative", className)}>{children}</div>
      </PopoverPrimitive.Root>
    </ComboboxContext.Provider>
  );
}

const ComboboxTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { value, getLabel, placeholder } = useCombobox();
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
      <span className={cn("truncate", !value && "text-muted-foreground")}>
        {value ? getLabel(value) : placeholder}
      </span>
      <ChevronDown className="size-4 shrink-0 opacity-50" aria-hidden />
    </PopoverPrimitive.Trigger>
  );
});
ComboboxTrigger.displayName = PopoverPrimitive.Trigger.displayName;

const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    placeholder?: string;
  }
>(({ className, placeholder = "Search…", align = "start", sideOffset = 4, children, ...props }, ref) => {
  const { query, setQuery } = useCombobox();
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
        <div className="border-b border-gray-alpha-400 p-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">{children}</div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
ComboboxContent.displayName = PopoverPrimitive.Content.displayName;

const ComboboxItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, children, onClick, ...props }, ref) => {
  const { value: selectedValue, onValueChange, setOpen, query, registerItem, unregisterItem } =
    useCombobox();

  const label: React.ReactNode = children;

  React.useEffect(() => {
    registerItem(value, label);
    return () => unregisterItem(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const visible =
    query === "" ||
    String(label).toLowerCase().includes(query.toLowerCase());

  if (!visible) return null;

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onValueChange(value);
        setOpen(false);
        onClick?.(e);
      }}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-copy-14 outline-none cursor-pointer transition-colors hover:bg-gray-alpha-100 focus:bg-gray-alpha-100",
        selectedValue === value && "text-foreground",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {selectedValue === value && <Check className="size-4 shrink-0 text-foreground" aria-hidden />}
    </button>
  );
});
ComboboxItem.displayName = "ComboboxItem";

export { Combobox, ComboboxTrigger, ComboboxContent, ComboboxItem };
