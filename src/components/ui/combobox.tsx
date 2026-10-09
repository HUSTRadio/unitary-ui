import { withLayerBridge } from "@/lib/layer-bridge";
import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { layoutRootStyle, layoutSurfaceStyle, type ControlLayout } from "@/lib/control-layout";

const LayerPopoverPrimitiveContent = withLayerBridge(PopoverPrimitive.Content);

/**
 * Combobox - 官方 vercel.com/geist/combobox 复刻实现（@vercel/geistcn Combobox）。
 *
 * DOM 结构（与官方一致，采集证据对齐）：
 * - 根 div[role=combobox]（aria-controls/aria-expanded/aria-haspopup/aria-owns）
 *   - div.group/combobox（搜索图标 + 输入框 + 清除按钮 + 展开按钮）
 *   - ul（关闭态：隐藏列表；打开态：Radix Popover Portal 面板内的 ul[role=listbox]，根内替换为 div.sr-only）
 * - 打开态：Radix Popover Portal > 面板 div[role=dialog] > ul[role=listbox] > li[role=option]
 *
 * 弹层定位由 Radix Popover 承载：左对齐输入表面（align=start）、下方 8px（sideOffset=8）、
 * 宽度联动 --radix-popover-trigger-width；视口空间不足自动翻转/避让（avoidCollisions），
 * 滚动/resize 实时跟随。进出场动画经 data-state 切换，由 Radix Presence 等待动画播完再卸载。
 *
 * 行为：
 * - 点击输入框/展开按钮打开；Escape / 点击外部 / 选中 / 清除 关闭
 * - 输入即过滤；ArrowDown/Up/Home/End 移动高亮，Enter 选中
 * - 打开时高亮第一项（aria-selected=true + bg-gray-alpha-100），选中项带对勾图标
 *
 * 官方 API（2026-08-17 对齐 combobox.md）：
 * - errored：输入文本 / 搜索图标 / 展开按钮着 --button-error（官方实测 light #da2f35 / dark #d93036）
 * - width：根节点像素宽度
 * - ComboboxList maxWidth：面板独立最大宽度（面板 = max(输入框宽, maxWidth)）
 * - ComboboxList emptyMessage：过滤无结果时的空状态文案
 * - clearable：显式开启清除按钮（默认不渲染，官方语义）
 * - ComboboxOption prefix / suffix：选项行首/行尾图标
 * - ComboboxOption ignoreDefaultHeight：取消固定行高，支持多行内容
 * - ComboboxInput onChange：输入变化回调（外部受控 query）
 */
type ComboboxSize = "small" | "medium" | "large";

type OptionMeta = {
  label: string;
  children?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  ignoreDefaultHeight?: boolean;
};

type ComboboxContextValue = {
  value: string | null;
  onValueChange: (value: string) => void;
  query: string;
  setQuery: (query: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  registerItem: (value: string, meta: OptionMeta) => void;
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
  clearable: boolean;
  errored: boolean;
  inputOnChange?: React.ChangeEventHandler<HTMLInputElement>;
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
  /**
   * 受控打开状态；不传则内部自管（受控双模，HIG-AUD-018）。
   * 受控时选中 / Escape / 外点 / 键盘导航只上报 `onOpenChange`，组件不自行开关。
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  /** 输入框的 accessible name（官方 Combobox aria-label） */
  "aria-label"?: string;
  /** 字段标签：存在时用 <label className="block cursor-text"> 包裹标签文本（13px capitalize gray-900，mb-2 8px 间距在文本 div 上）与 combobox（对齐 Select 结构） */
  label?: string;
  disabled?: boolean;
  size?: ComboboxSize;
  /** 官方 errored：输入文本/图标/展开按钮着 --button-error */
  errored?: boolean;
  /** 官方 clearable：显式开启清除按钮（默认不渲染） */
  clearable?: boolean;
  /** 官方 width：根节点像素宽度（兼容保留；推荐改用 layout.width） */
  width?: number;
  /** 统一尺寸 API：宽度三件套+flex 作用于根节点；高度作用于输入表面 */
  layout?: ControlLayout;
  className?: string;
  children: React.ReactNode;
};

type ComboboxInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const GROUP_SIZE_CLASS: Record<ComboboxSize, string> = {
  small: "group/combobox w-full inline-block relative z-0 text-sm [&>input]:h-8",
  medium: "group/combobox text-sm w-full inline-block relative z-0",
  large: "group/combobox w-full inline-block relative z-0 text-base [&>input]:h-10",
};

const INPUT_CLASS =
  "w-full h-(--uni-size-medium) bg-[var(--uni-background-100)] rounded-lg border-0 shadow-[0_0_0_1px_var(--uni-gray-alpha-400)] bg-clip-padding font-[var(--font-sans)] text-[var(--uni-gray-1000)] min-h-(--uni-size-medium) sm:min-h-0 appearance-none m-0 cursor-text outline-hidden py-0 pl-10 pr-9 placeholder:text-[var(--uni-gray-700)] transition-all duration-(--uni-duration-base) ease-in-out text-left truncate disabled:text-[var(--uni-gray-700)] disabled:bg-[var(--uni-gray-100)] disabled:cursor-not-allowed disabled:hover:!shadow-[0_0_0_1px_var(--uni-gray-alpha-400)] focus:outline-hidden sm:focus:!shadow-[0_0_0_1px_var(--uni-gray-alpha-600),0px_0px_0px_4px_rgba(0,0,0,0.16)] group-hover/combobox:shadow-[0_0_0_1px_var(--uni-gray-alpha-500)]";

const CLEAR_BUTTON_CLASS =
  "outline-hidden m-0 p-0 border-0 box-border text-base align-baseline no-underline [tap-highlight-color:transparent] select-none bg-none cursor-pointer inline-flex items-center justify-center !w-10 group-hover/combobox:text-[var(--foreground)] disabled:cursor-not-allowed [&>span]:inline-flex [&>span]:items-center [&>span]:justify-center !mr-0 absolute -right-px top-1/2 text-[var(--uni-gray-700)] transform -translate-y-1/2 border-l-0 rounded-r-[5px] py-0 px-3 order-2 transition-all duration-(--uni-duration-fast) ease-out motion-reduce:transition-none w-auto focus-visible:ring-2 focus-visible:ring-[var(--uni-focus-color)] focus-visible:ring-offset-0";

const OPEN_BUTTON_CLASS =
  "outline-hidden m-0 p-0 border-0 box-border text-base align-baseline no-underline [tap-highlight-color:transparent] select-none bg-none cursor-pointer inline-flex !w-10 group-hover/combobox:text-gray-1000 disabled:cursor-not-allowed disabled:text-[var(--uni-gray-700)] [&>span]:inline-flex items-center justify-center !mr-0 absolute -right-px top-1/2 text-[var(--uni-gray-700)] transform -translate-y-1/2 transition-colors duration-(--uni-duration-fast) ease-snap motion-reduce:transition-none";

// HIG-AUD-033：面板阴影改走材质 token，与 select / multi-select / menu 的浮层阴影同源
// （`--material-shadow-menu` 已含双主题 1px 描边与投影层，不再自写字面量）。
const PANEL_CLASS =
  "m-0 p-1.5 outline-hidden bg-[var(--uni-background-100)] shadow-[var(--material-shadow-menu)] rounded-overlay z-[var(--uni-z-popover)] max-h-[210px] overflow-y-auto overflow-x-hidden [&>ul]:m-0 [&>ul]:p-0 [&>ul]:list-none";
/** 进出场动画经 data-state 切换：Radix Presence 检测关闭动画播完后才卸载面板 */
const PANEL_STATE_CLASS =
  "data-[state=open]:animate-in data-[state=open]:ease-out data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:ease-in data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-(--uni-duration-fast) motion-reduce:animate-none!";

const OPTION_BASE_CLASS =
  "flex items-center text-sm px-2 scroll-my-2 rounded-overlay-item cursor-pointer outline-hidden h-9";

/** 从 ReactNode 提取纯文本（过滤与输入回显用） */
function nodeToText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return nodeToText(props.children);
  }
  return "";
}

function Combobox({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  open: openProp,
  onOpenChange,
  placeholder: placeholderProp,
  "aria-label": searchLabelProp,
  label,
  disabled = false,
  size = "medium",
  errored = false,
  clearable = false,
  width,
  layout,
  className,
  children,
}: ComboboxProps) {
  const { t } = useI18n();
  const placeholder = placeholderProp ?? t("Search…");
  const searchLabel = searchLabelProp ?? t("Search");
  // open：受控双模（HIG-AUD-018）。下方全部写入点（选中 / 键盘导航 / 根与输入面点击 /
  // Radix 的 Escape 与外点回调）统一走 setOpen，受控时只上报、不写内部 state。
  const isOpenControlled = openProp !== undefined;
  const [openState, setOpenState] = React.useState(false);
  const open = isOpenControlled ? openProp : openState;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setOpenState(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );
  const [query, setQuery] = React.useState("");
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [activeValue, setActiveValue] = React.useState("");
  const [itemsVersion, setItemsVersion] = React.useState(0);
  const [listMeta, setListMeta] = React.useState<{
    maxWidth?: number;
    emptyMessage?: string;
  }>({});
  const [inputOnChange, setInputOnChange] = React.useState<
    React.ChangeEventHandler<HTMLInputElement> | undefined
  >();
  const itemsRef = React.useRef<Map<string, OptionMeta>>(new Map());
  const rootRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
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

  const registerItem = (itemValue: string, meta: OptionMeta) => {
    itemsRef.current.set(itemValue, meta);
    setItemsVersion((v) => v + 1);
  };

  const unregisterItem = (itemValue: string) => {
    if (itemsRef.current.delete(itemValue)) {
      setItemsVersion((v) => v + 1);
    }
  };

  const getLabel = (itemValue: string) => itemsRef.current.get(itemValue)?.label ?? itemValue;

  const visibleValues = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...itemsRef.current.entries()]
      .filter(([, meta]) => q === "" || meta.label.toLowerCase().includes(q))
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

  /** 打开时聚焦输入框（定位/碰撞避让/滚动跟随/Esc/外部点击关闭均由 Radix Popover 承载） */
  React.useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const generatedId = React.useId();
  const listId = `combobox-list-${generatedId.replaceAll(":", "")}`;
  const optionId = (itemValue: string) => `${listId}-option-${itemValue}`;

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const navigationKey = ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key);
    if (!open && navigationKey) setOpen(true);
    if (visibleValues.length === 0) {
      if (navigationKey) event.preventDefault();
      return;
    }
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
        if (open && activeValue) {
          event.preventDefault();
          selectValue(activeValue);
        }
        break;
      }
    }
  };

  const registerList = React.useCallback((meta: { maxWidth?: number; emptyMessage?: string }) => {
    setListMeta((prev) =>
      prev.maxWidth === meta.maxWidth && prev.emptyMessage === meta.emptyMessage ? prev : meta,
    );
  }, []);

  const registerInput = React.useCallback(
    (onChange?: React.ChangeEventHandler<HTMLInputElement>) => {
      setInputOnChange((prev: React.ChangeEventHandler<HTMLInputElement> | undefined) =>
        prev === onChange ? prev : onChange,
      );
    },
    [],
  );

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
    clearable,
    errored,
    inputOnChange,
  };

  const inputDisplay = query !== "" ? query : value ? getLabel(value) : "";

  const options = [...visibleValues].map((itemValue, index) => {
    const meta = itemsRef.current.get(itemValue);
    const label = meta?.label ?? itemValue;
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
          !meta?.ignoreDefaultHeight && "h-9",
          meta?.ignoreDefaultHeight && "min-h-9 h-auto",
          inClosedList && "text-[var(--uni-gray-1000)]",
          !inClosedList && isActive && "bg-[var(--gray-alpha-100)] text-[var(--uni-gray-1000)]",
          !inClosedList && !isActive && "text-[var(--uni-gray-1000)]",
        )}
        onMouseEnter={() => setActiveValue(itemValue)}
        onClick={() => selectValue(itemValue)}
      >
        {meta?.prefix && (
          <span className="mr-2 inline-flex shrink-0 items-center">{meta.prefix}</span>
        )}
        {meta?.ignoreDefaultHeight && meta.children !== undefined ? (
          <span className="min-w-0 flex-1 text-left">{meta.children}</span>
        ) : (
          <span className="text-left truncate" title={label}>
            {label}
          </span>
        )}
        {!inClosedList && isSelected && (
          <Check className="ml-auto size-(--uni-control-decoration-size) shrink-0" aria-hidden />
        )}
        {meta?.suffix && (
          <span className="ml-2 inline-flex shrink-0 items-center">{meta.suffix}</span>
        )}
      </li>
    );
  });

  const clearButton =
    clearable && value ? (
      <button
        type="button"
        aria-label={t("Clear selected value")}
        data-open={open}
        tabIndex={0}
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          handleValueChange("");
          setQuery("");
        }}
        className={cn(
          CLEAR_BUTTON_CLASS,
          size === "small" && "!h-8",
          size === "medium" && "!h-full h-(--uni-size-medium)",
          size === "large" && "!h-10",
        )}
      >
        <X className="size-(--uni-control-decoration-size)" aria-hidden />
      </button>
    ) : null;

  const openButton =
    !open && !value ? (
      <button
        type="button"
        aria-label={t("Open menu")}
        data-open={open}
        tabIndex={-1}
        disabled={disabled}
        className={cn(
          OPEN_BUTTON_CLASS,
          errored && "text-[var(--button-error)]",
          size === "small" && "!h-8",
          size === "medium" && "!h-[30px]",
          size === "large" && "!h-10",
        )}
      >
        <ChevronDown
          className="size-(--uni-control-decoration-size) rotate-0 transition-transform duration-(--uni-duration-fast)"
          aria-hidden
        />
      </button>
    ) : null;

  /** layout.width 优先；兼容保留的 width prop（数字 px）次之 */
  const rootStyle = {
    ...layoutRootStyle(layout),
    ...(width !== undefined && layout?.width === undefined ? { width } : undefined),
  };

  const comboboxRoot = (
    <div
      ref={rootRef}
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={listId}
      aria-owns={listId}
      tabIndex={-1}
      data-slot="combobox-root"
      style={rootStyle}
      className={cn(
        "focus-ring relative outline-hidden rounded-lg transition-shadow duration-(--uni-duration-base)",
        className,
      )}
      onClick={() => {
        if (!open) setOpen(true);
      }}
    >
      {/* 弹层定位锚点 = 输入表面（virtualRef 不产出 DOM，宽度联动走 anchor 变量） */}
      <PopoverPrimitive.Anchor virtualRef={groupRef} />
      <div
        ref={groupRef}
        style={layoutSurfaceStyle(layout)}
        className={cn(GROUP_SIZE_CLASS[size])}
        onClick={() => {
          if (!open) setOpen(true);
        }}
      >
        <div
          aria-hidden="true"
          className={cn(
            "inline-flex items-center justify-center pointer-events-none absolute left-[13px] top-1/2 z-10 transform -translate-y-1/2",
            errored ? "text-[var(--button-error)]" : "text-[var(--uni-gray-700)]",
          )}
        >
          <Search className="size-(--uni-control-decoration-size)" aria-hidden />
        </div>
        <input
          ref={inputRef}
          role="searchbox"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-label={searchLabel}
          aria-activedescendant={open && activeValue ? optionId(activeValue) : undefined}
          aria-invalid={errored || undefined}
          autoComplete="off"
          spellCheck={false}
          type="text"
          value={inputDisplay}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => {
            setQuery(event.target.value);
            inputOnChange?.(event);
          }}
          onKeyDown={handleInputKeyDown}
          className={cn(
            INPUT_CLASS,
            errored && "text-[var(--button-error)] placeholder:text-[var(--button-error)]",
          )}
        />
        {clearButton}
        {openButton}
      </div>
      {open ? (
        <div className="sr-only" role="status" aria-live="polite" />
      ) : (
        <ul id={listId} aria-hidden="true" className="hidden">
          {options}
        </ul>
      )}
      <PopoverPrimitive.Portal>
        <LayerPopoverPrimitiveContent
          data-material="floating"
          align="start"
          sideOffset={8}
          // 与 select-content / menu 面板一致的可定位槽位，供浮层材质（阴影）契约核查使用
          data-slot="combobox-content"
          onOpenAutoFocus={(event) => event.preventDefault()}
          /* 点输入表面不关面板（沿用原 pointerdown 判定）；失焦不关；Esc 走 Radix 默认关闭 */
          onPointerDownOutside={(event) => {
            const target = event.detail.originalEvent.target as Node | null;
            if (target && rootRef.current?.contains(target)) event.preventDefault();
          }}
          onFocusOutside={(event) => event.preventDefault()}
          className={cn(PANEL_CLASS, PANEL_STATE_CLASS)}
          style={{
            width: "var(--radix-popover-trigger-width)",
            ...(listMeta.maxWidth ? { minWidth: `${listMeta.maxWidth}px` } : undefined),
            zIndex: "var(--uni-z-popover)",
            // Radix modal roots disable pointer events outside their branch;
            // this body portal must explicitly opt back in for nested Comboboxes.
            pointerEvents: "auto",
          }}
        >
          {visibleValues.length === 0 && listMeta.emptyMessage ? (
            <div id={open ? listId : undefined} role={open ? "listbox" : undefined}>
              <p className="m-0 px-2 py-2 text-sm text-[var(--uni-gray-900)]">
                {listMeta.emptyMessage}
              </p>
            </div>
          ) : (
            <ul id={open ? listId : undefined} role={open ? "listbox" : undefined} data-slot="combobox-list">
              {options}
            </ul>
          )}
        </LayerPopoverPrimitiveContent>
      </PopoverPrimitive.Portal>
    </div>
  );

  return (
    <ListMetaContext.Provider value={{ registerList, registerInput }}>
      <ComboboxContext.Provider value={ctx}>
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          {label ? (
            <label className="block cursor-text">
              <div className="mb-2 block max-w-full cursor-text text-[13px] text-gray-900 capitalize">
                {label}
              </div>
              {/* 注册容器：ComboboxInput/ComboboxList/ComboboxOption 在此挂载并注册选项 */}
              {children}
              {comboboxRoot}
            </label>
          ) : (
            <>
              {/* 注册容器：ComboboxInput/ComboboxList/ComboboxOption 在此挂载并注册选项 */}
              {children}
              {comboboxRoot}
            </>
          )}
        </PopoverPrimitive.Root>
      </ComboboxContext.Provider>
    </ListMetaContext.Provider>
  );
}

type ListMetaContextValue = {
  registerList: (meta: { maxWidth?: number; emptyMessage?: string }) => void;
  registerInput: (onChange?: React.ChangeEventHandler<HTMLInputElement>) => void;
};

const ListMetaContext = React.createContext<ListMetaContextValue | null>(null);

function useListMeta() {
  const ctx = React.useContext(ListMetaContext);
  if (!ctx) throw new Error("Combobox 子组件必须在 <Combobox> 内使用");
  return ctx;
}

const ComboboxInput = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ onChange }, _ref) => {
    useCombobox();
    const { registerInput } = useListMeta();
    React.useEffect(() => {
      registerInput(onChange);
      return () => registerInput(undefined);
    }, [onChange, registerInput]);
    return null;
  },
);
ComboboxInput.displayName = "ComboboxInput";

type ComboboxListProps = React.HTMLAttributes<HTMLUListElement> & {
  /** 官方 maxWidth：面板独立最大宽度（面板 = max(输入框宽, maxWidth)） */
  maxWidth?: number;
  /** 官方 emptyMessage：过滤无结果时的空状态文案 */
  emptyMessage?: string;
};

const ComboboxList = React.forwardRef<HTMLUListElement, ComboboxListProps>(
  ({ children, maxWidth, emptyMessage }, _ref) => {
    useCombobox();
    const { registerList } = useListMeta();
    React.useEffect(() => {
      registerList({ maxWidth, emptyMessage });
      return () => registerList({});
    }, [maxWidth, emptyMessage, registerList]);
    // 仅作为注册容器：让 ComboboxOption 挂载并注册到上下文；真实 ul 由 Combobox 根渲染。
    return <>{children}</>;
  },
);
ComboboxList.displayName = "ComboboxList";

type ComboboxOptionProps = Omit<
  React.HTMLAttributes<HTMLLIElement>,
  "children" | "prefix" | "suffix"
> & {
  value: string;
  /** 文本或自定义内容（ignoreDefaultHeight 时支持多行 JSX） */
  children: React.ReactNode;
  /** 官方 prefix：选项行首图标 */
  prefix?: React.ReactNode;
  /** 官方 suffix：选项行尾图标 */
  suffix?: React.ReactNode;
  /** 官方 ignoreDefaultHeight：取消固定行高，按内容自适应（多行选项） */
  ignoreDefaultHeight?: boolean;
};

const ComboboxOption = React.forwardRef<HTMLLIElement, ComboboxOptionProps>(
  ({ value, children, prefix, suffix, ignoreDefaultHeight }, _ref) => {
    const { registerItem, unregisterItem } = useCombobox();
    const label = nodeToText(children);
    React.useEffect(() => {
      registerItem(value, { label, children, prefix, suffix, ignoreDefaultHeight });
      return () => unregisterItem(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, label, prefix, suffix, ignoreDefaultHeight]);
    return null;
  },
);
ComboboxOption.displayName = "ComboboxOption";

export { Combobox, ComboboxInput, ComboboxList, ComboboxOption };
export type {
  ComboboxSize,
  ComboboxProps,
  ComboboxInputProps,
  ComboboxListProps,
  ComboboxOptionProps,
};
