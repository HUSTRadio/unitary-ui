import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Combobox — 官方 vercel.com/geist/combobox 复刻实现（@vercel/geistcn Combobox）。
 *
 * DOM 结构（与官方一致，采集证据对齐）：
 * - 根 div[role=combobox]（aria-controls/aria-expanded/aria-haspopup/aria-owns）
 *   - div.group/combobox（搜索图标 + 输入框 + 清除按钮 + 展开按钮）
 *   - ul（关闭态：隐藏列表；打开态：portal 面板内的 ul[role=listbox]，根内替换为 div.sr-only）
 * - 打开态：positioner(fixed) > 面板 div[role=dialog] > ul[role=listbox] > li[role=option]
 *
 * 行为：
 * - 点击输入框/展开按钮打开；Escape / 点击外部 / 选中 / 清除 关闭
 * - 输入即过滤；ArrowDown/Up/Home/End 移动高亮，Enter 选中
 * - 打开时高亮第一项（aria-selected=true + bg-gray-alpha-100），选中项带对勾图标
 */
type ComboboxSize = "small" | "medium" | "large";

type ComboboxContextValue = {
  value: string | null;
  onValueChange: (value: string) => void;
  query: string;
  setQuery: (query: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  registerItem: (value: string, label: string) => void;
  unregisterItem: (value: string) => void;
  getLabel: (value: string) => string;
  placeholder: string;
  searchLabel: string;
  visibleValues: string[];
  activeValue: string;
  setActiveValue: (value: string) => void;
  selectValue: (value: string) => void;
  listId: string;
  optionId: (value: string) => string;
  disabled: boolean;
};

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useCombobox() {
  const ctx = React.useContext(ComboboxContext);
  if (!ctx) throw new Error("Combobox 子组件必须在 <Combobox> 内使用");
  return ctx;
}

type ComboboxProps = {
  value?: string | null;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** 输入框的 accessible name（官方 Combobox aria-label） */
  "aria-label"?: string;
  disabled?: boolean;
  size?: ComboboxSize;
  className?: string;
  children: React.ReactNode;
};

const GROUP_SIZE_CLASS: Record<ComboboxSize, string> = {
  small: "group/combobox w-full inline-block relative z-0 text-sm [&>input]:h-8",
  medium: "group/combobox text-sm w-full inline-block relative z-0",
  large: "group/combobox w-full inline-block relative z-0 text-base [&>input]:h-10",
};

const INPUT_CLASS =
  "w-full h-(--ds-size-medium) bg-[var(--ds-background-100)] rounded-md border-0 shadow-[0_0_0_1px_var(--ds-gray-alpha-400)] bg-clip-padding font-[var(--font-sans)] text-[var(--ds-gray-1000)] min-h-(--ds-size-medium) sm:min-h-0 appearance-none m-0 cursor-text outline-hidden py-0 pl-10 pr-9 placeholder:text-[var(--ds-gray-700)] transition-all duration-200 ease-in-out text-left truncate disabled:text-[var(--ds-gray-700)] disabled:bg-[var(--ds-gray-100)] disabled:cursor-not-allowed disabled:hover:!shadow-[0_0_0_1px_var(--ds-gray-alpha-400)] focus:outline-hidden sm:focus:!shadow-[0_0_0_1px_var(--ds-gray-alpha-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] group-hover/combobox:shadow-[0_0_0_1px_var(--ds-gray-alpha-500)]";

const CLEAR_BUTTON_CLASS =
  "outline-hidden m-0 p-0 border-0 box-border text-base align-baseline no-underline [tap-highlight-color:transparent] select-none bg-none cursor-pointer inline-flex items-center justify-center !w-10 group-hover/combobox:text-[var(--geist-foreground)] disabled:cursor-not-allowed [&>span]:inline-flex [&>span]:items-center [&>span]:justify-center !mr-0 absolute -right-px top-1/2 text-[var(--ds-gray-700)] transform -translate-y-1/2 border-l-0 rounded-r-[5px] py-0 px-3 order-2 transition-all duration-150 ease-out w-auto focus-visible:ring-2 focus-visible:ring-[var(--ds-focus-color)] focus-visible:ring-offset-0";

const OPEN_BUTTON_CLASS =
  "outline-hidden m-0 p-0 border-0 box-border text-base align-baseline no-underline [tap-highlight-color:transparent] select-none bg-none cursor-pointer inline-flex !w-10 group-hover/combobox:text-gray-1000 disabled:cursor-not-allowed disabled:text-[var(--ds-gray-700)] [&>span]:inline-flex items-center justify-center !mr-0 absolute -right-px top-1/2 text-[var(--ds-gray-700)] transform -translate-y-1/2 transition-colors duration-150 ease-in";

const PANEL_CLASS =
  "m-0 p-1.5 outline-hidden bg-[var(--ds-background-100)] shadow-[0_0_0_1px_var(--ds-gray-alpha-400),0_2px_2px_0_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.04),0_0_0_1px_var(--ds-background-200)] rounded-xl z-[2001] max-h-[210px] overflow-y-auto overflow-x-hidden [&>ul]:m-0 [&>ul]:p-0 [&>ul]:list-none";

const OPTION_BASE_CLASS =
  "flex items-center text-sm px-2 scroll-my-2 rounded-[6px] cursor-pointer outline-hidden h-9";

function Combobox({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  placeholder = "Search…",
  "aria-label": searchLabel = "Search",
  disabled = false,
  size = "medium",
  className,
  children,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [activeValue, setActiveValue] = React.useState("");
  const [itemsVersion, setItemsVersion] = React.useState(0);
  const [position, setPosition] = React.useState({ x: 0, y: 0, width: 0 });
  const itemsRef = React.useRef<Map<string, string>>(new Map());
  const rootRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const id = React.useId();

  const value = valueProp !== undefined ? valueProp : internalValue;

  const handleValueChange = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
  };

  const selectValue = (next: string) => {
    handleValueChange(next);
    setQuery("");
    setOpen(false);
  };

  const registerItem = (itemValue: string, label: string) => {
    itemsRef.current.set(itemValue, label);
    setItemsVersion((v) => v + 1);
  };

  const unregisterItem = (itemValue: string) => {
    if (itemsRef.current.delete(itemValue)) {
      setItemsVersion((v) => v + 1);
    }
  };

  const getLabel = (itemValue: string) => itemsRef.current.get(itemValue) ?? itemValue;

  const visibleValues = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...itemsRef.current.entries()]
      .filter(([, label]) => q === "" || label.toLowerCase().includes(q))
      .map(([itemValue]) => itemValue);
    // itemsVersion 使注册表变化时重算；itemsRef 是 ref，不参与依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, itemsVersion, open]);

  /** 打开时高亮第一项（官方行为：aria-selected=true + bg 落在第一项） */
  React.useEffect(() => {
    if (!open) return;
    setActiveValue(visibleValues[0] ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /** 输入过滤时保持高亮在可见项内 */
  React.useEffect(() => {
    setActiveValue((prev) => {
      if (visibleValues.includes(prev)) return prev;
      return visibleValues[0] ?? "";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, itemsVersion]);

  /** 打开时聚焦输入框并计算面板位置（官方：面板左对齐输入框、下方 8px，x 取整） */
  React.useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const update = () => {
      const trigger = groupRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      setPosition({ x: Math.round(rect.left), y: Math.round(rect.bottom) + 8, width: rect.width });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  /** Escape 关闭 + 点击外部关闭 */
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const listId = `combobox-list-${id}`;
  const optionId = (itemValue: string) => `${listId}-option-${itemValue}`;

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
    searchLabel,
    visibleValues,
    activeValue,
    setActiveValue,
    selectValue,
    listId,
    optionId,
    disabled,
  };

  const inputDisplay = query !== "" ? query : value ? getLabel(value) : "";

  const options = [...visibleValues].map((itemValue, index) => {
    const label = getLabel(itemValue);
    const isActive = activeValue === itemValue;
    const isSelected = value === itemValue;
    const inClosedList = !open;
    return (
      <li
        key={itemValue}
        role={inClosedList ? undefined : "option"}
        id={inClosedList ? undefined : optionId(itemValue)}
        aria-selected={inClosedList ? undefined : isActive}
        data-highlighted={inClosedList ? undefined : isSelected || undefined}
        data-order={inClosedList ? undefined : index}
        className={cn(
          OPTION_BASE_CLASS,
          inClosedList && "text-[var(--ds-gray-1000)]",
          !inClosedList && isActive && "bg-[var(--gray-alpha-100)] text-[var(--ds-gray-1000)]",
          !inClosedList && !isActive && "text-[var(--ds-gray-1000)]",
        )}
        onMouseEnter={() => setActiveValue(itemValue)}
        onClick={() => selectValue(itemValue)}
      >
        <span className="text-left truncate" title={label}>
          {label}
        </span>
        {!inClosedList && isSelected && (
          <Check
            className="size-(--ds-control-decoration-size)"
            style={{ marginLeft: "auto" }}
            aria-hidden
          />
        )}
      </li>
    );
  });

  const clearButton = (
    <button
      type="button"
      aria-label="Clear selected value"
      data-open={open}
      tabIndex={0}
      style={{ display: value ? undefined : "none" }}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        handleValueChange("");
        setQuery("");
      }}
      className={cn(
        CLEAR_BUTTON_CLASS,
        size === "small" && "!h-8",
        size === "medium" && "!h-full h-(--ds-size-medium)",
        size === "large" && "!h-10",
      )}
    >
      <X className="size-(--ds-control-decoration-size)" aria-hidden />
    </button>
  );

  const openButton =
    !open && !value ? (
      <button
        type="button"
        aria-label="Open menu"
        data-open={open}
        tabIndex={-1}
        disabled={disabled}
        className={cn(
          OPEN_BUTTON_CLASS,
          size === "small" && "!h-8",
          size === "medium" && "!h-[30px]",
          size === "large" && "!h-10",
        )}
      >
        <ChevronDown
          className="size-(--ds-control-decoration-size) rotate-0 transition-transform duration-150"
          aria-hidden
        />
      </button>
    ) : null;

  return (
    <ComboboxContext.Provider value={ctx}>
      {/* 注册容器：ComboboxInput/ComboboxList/ComboboxOption 在此挂载并注册选项 */}
      {children}
      <div
        ref={rootRef}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-owns={listId}
        tabIndex={-1}
        data-slot="combobox-root"
        className={cn(
          "relative outline-hidden rounded-md transition-shadow duration-200 focus:shadow-[var(--ds-focus-ring)]",
          className,
        )}
        onClick={() => {
          if (!open) setOpen(true);
        }}
      >
        <div
          ref={groupRef}
          className={cn(GROUP_SIZE_CLASS[size])}
          onClick={() => {
            if (!open) setOpen(true);
          }}
        >
          <div
            aria-hidden="true"
            className="inline-flex items-center justify-center text-[var(--ds-gray-700)] pointer-events-none absolute left-[13px] top-1/2 z-10 transform -translate-y-1/2"
          >
            <Search className="size-(--ds-control-decoration-size)" aria-hidden />
          </div>
          <input
            ref={inputRef}
            role="searchbox"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-label={searchLabel}
            aria-activedescendant={open && activeValue ? optionId(activeValue) : undefined}
            autoComplete="off"
            spellCheck={false}
            type="text"
            value={inputDisplay}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            className={INPUT_CLASS}
          />
          {clearButton}
          {openButton}
        </div>
        {open ? (
          <div className="sr-only" role="status" aria-live="polite" />
        ) : (
          <ul aria-hidden="true" className="hidden">{options}</ul>
        )}
        {open
          ? createPortal(
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: 2001,
                }}
              >
                <div
                  ref={panelRef}
                  role="dialog"
                  className={PANEL_CLASS}
                  style={{ width: position.width }}
                >
                  <ul role="listbox" data-slot="combobox-list">
                    {options}
                  </ul>
                </div>
              </div>,
              document.body,
            )
          : null}
      </div>
    </ComboboxContext.Provider>
  );
}

const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((_props, _ref) => {
  useCombobox();
  return null;
});
ComboboxInput.displayName = "ComboboxInput";

const ComboboxList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ children }, _ref) => {
    useCombobox();
    // 仅作为注册容器：让 ComboboxOption 挂载并注册到上下文；真实 ul 由 Combobox 根渲染。
    return <>{children}</>;
  },
);
ComboboxList.displayName = "ComboboxList";

type ComboboxOptionProps = React.HTMLAttributes<HTMLLIElement> & {
  value: string;
  children: string;
};

const ComboboxOption = React.forwardRef<HTMLLIElement, ComboboxOptionProps>(
  ({ value, children }, _ref) => {
    const { registerItem, unregisterItem } = useCombobox();
    React.useEffect(() => {
      registerItem(value, children);
      return () => unregisterItem(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, children]);
    return null;
  },
);
ComboboxOption.displayName = "ComboboxOption";

export { Combobox, ComboboxInput, ComboboxList, ComboboxOption };
