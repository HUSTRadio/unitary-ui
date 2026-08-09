import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

/**
 * Combobox — Geist 官方 Combobox 简化实现（docs/geist-markdown-refs/components/combobox.md 实测）。
 * 用 radix-ui Popover + Input 实现搜索下拉：
 * - Combobox 提供共享状态（value / query / open / items 注册表 / 键盘导航 active）
 * - ComboboxTrigger 展示当前选中项 label（或 placeholder）
 * - ComboboxContent 内含搜索 Input + 按 query 过滤的选项列表
 * - ComboboxItem 单个可选项，点击选中并关闭
 *
 * ARIA（ARIA APG 可编辑 combobox 模式）：
 * - 搜索 Input 承载 role="combobox" + aria-expanded + aria-autocomplete="list" +
 *   aria-controls（指向 listbox）+ aria-activedescendant（指向高亮 option）
 * - 选项列表 div role="listbox"，选项 role="option" + aria-selected
 * - Trigger 保留 aria-haspopup="listbox"（Radix 自动维护 aria-expanded/aria-controls）
 * - 键盘：ArrowDown/ArrowUp/Home/End 移动高亮，Enter 选中高亮项，Escape 关闭（Radix），
 *   输入即 Type-ahead 过滤
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
  /** 过滤后可见选项的 value 列表（保持注册顺序） */
  visibleValues: string[];
  /** 键盘高亮项（aria-activedescendant 指向的 option） */
  activeValue: string;
  setActiveValue: (value: string) => void;
  /** 选中并关闭 */
  selectValue: (value: string) => void;
  listboxId: string;
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
  const [activeValue, setActiveValue] = React.useState("");
  const [itemsVersion, setItemsVersion] = React.useState(0);
  const itemsRef = React.useRef<Map<string, React.ReactNode>>(new Map());
  const id = React.useId();

  const value = valueProp !== undefined ? valueProp : internalValue;

  const handleValueChange = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
  };

  const selectValue = (next: string) => {
    handleValueChange(next);
    setOpen(false);
  };

  const registerItem = (itemValue: string, label: React.ReactNode) => {
    itemsRef.current.set(itemValue, label);
    setItemsVersion((v) => v + 1);
  };

  const unregisterItem = (itemValue: string) => {
    if (itemsRef.current.delete(itemValue)) {
      setItemsVersion((v) => v + 1);
    }
  };

  const getLabel = (itemValue: string) => itemsRef.current.get(itemValue) ?? itemValue;

  /** 与 ComboboxItem 的可见性过滤保持一致（label 包含 query） */
  const visibleValues = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...itemsRef.current.entries()]
      .filter(([, label]) => q === "" || String(label).toLowerCase().includes(q))
      .map(([itemValue]) => itemValue);
    // itemsVersion 使注册表变化时重算；eslint-disable: itemsRef 是 ref，不参与依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, itemsVersion, open]);

  /** 打开或 query 变化时重置高亮：选中项可见则保持，否则落到第一项 */
  React.useEffect(() => {
    if (!open) return;
    setActiveValue((prev) => {
      if (visibleValues.includes(prev)) return prev;
      if (visibleValues.includes(value)) return value;
      return visibleValues[0] ?? "";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, query, itemsVersion]);

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
    visibleValues,
    activeValue,
    setActiveValue,
    selectValue,
    listboxId: `${id}-listbox`,
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
>(({ className, ...props }, ref) => {
  const { value, getLabel, placeholder, open } = useCombobox();
  return (
    <PopoverPrimitive.Trigger
      ref={ref}
      aria-haspopup="listbox"
      aria-expanded={open}
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
    /** 搜索框的 accessible name（默认 "Filter options"） */
    searchLabel?: string;
  }
>(
  (
    {
      className,
      placeholder = "Search…",
      searchLabel = "Filter options",
      align = "start",
      sideOffset = 4,
      children,
      ...props
    },
    ref,
  ) => {
    const {
      query,
      setQuery,
      open,
      visibleValues,
      activeValue,
      setActiveValue,
      selectValue,
      listboxId,
    } = useCombobox();

    const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (visibleValues.length === 0) return;
      const index = visibleValues.indexOf(activeValue);
      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          setActiveValue(visibleValues[(index + 1) % visibleValues.length]);
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          setActiveValue(visibleValues[(index - 1 + visibleValues.length) % visibleValues.length]);
          break;
        }
        case "Home": {
          event.preventDefault();
          setActiveValue(visibleValues[0]);
          break;
        }
        case "End": {
          event.preventDefault();
          setActiveValue(visibleValues[visibleValues.length - 1]);
          break;
        }
        case "Enter": {
          if (activeValue) {
            event.preventDefault();
            selectValue(activeValue);
          }
          break;
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
          <div className="border-b border-gray-alpha-400 p-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={placeholder}
              aria-label={searchLabel}
              role="combobox"
              aria-expanded={open}
              aria-autocomplete="list"
              aria-controls={listboxId}
              aria-activedescendant={
                activeValue ? `${listboxId}-option-${encodeURIComponent(activeValue)}` : undefined
              }
              autoFocus
            />
          </div>
          <div
            id={listboxId}
            role="listbox"
            aria-label={searchLabel}
            className="max-h-64 overflow-y-auto p-1"
          >
            {children}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);
ComboboxContent.displayName = PopoverPrimitive.Content.displayName;

const ComboboxItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, children, onClick, ...props }, ref) => {
  const {
    value: selectedValue,
    query,
    registerItem,
    unregisterItem,
    activeValue,
    setActiveValue,
    selectValue,
    listboxId,
  } = useCombobox();

  const label: React.ReactNode = children;

  React.useEffect(() => {
    registerItem(value, label);
    return () => unregisterItem(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const visible = query === "" || String(label).toLowerCase().includes(query.toLowerCase());

  const isActive = activeValue === value;
  const isSelected = selectedValue === value;

  React.useEffect(() => {
    if (isActive && ref && typeof ref !== "function" && ref.current) {
      ref.current.scrollIntoView({ block: "nearest" });
    }
  }, [isActive, ref]);

  if (!visible) return null;

  return (
    <button
      ref={ref}
      type="button"
      role="option"
      id={`${listboxId}-option-${encodeURIComponent(value)}`}
      aria-selected={isSelected}
      data-highlighted={isActive || undefined}
      onMouseEnter={() => setActiveValue(value)}
      onClick={(e) => {
        selectValue(value);
        onClick?.(e);
      }}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-copy-14 outline-none transition-colors hover:bg-gray-alpha-100 focus:bg-gray-alpha-100",
        isActive && "bg-gray-alpha-100 text-foreground",
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check className="size-4 shrink-0 text-foreground" aria-hidden />}
    </button>
  );
});
ComboboxItem.displayName = "ComboboxItem";

export { Combobox, ComboboxTrigger, ComboboxContent, ComboboxItem };
