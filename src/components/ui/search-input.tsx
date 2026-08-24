import * as React from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { layoutRootStyle, type ControlLayout } from "@/lib/control-layout";
import { Input } from "./input";
import { Kbd } from "./keyboard-input";
import { Spinner } from "./spinner";

/**
 * SearchInput — Geist Search Input（vercel.com/geist/search-input 实时页面）。
 * 采用共享 Input 的 36px prefix / input / suffix slot：默认前缀为搜索图标，
 * loading 时替换为 Spinner；非空值显示 Esc 清除动作，空值且 cmdk 时显示 ⌘ K。
 * Input 的 prefix/suffix 布局分离后（外边距 12px、内容间距 8px、无负边距补偿），
 * 本组件的补偿式选择器已删除；disabled 底色与 placeholder 修正保留。
 */
export interface SearchInputProps extends Omit<React.ComponentProps<"input">, "prefix"> {
  /** 空值时显示 ⌘ K 提示；触屏设备隐藏。 */
  cmdk?: boolean;
  /** 用 Spinner 替换默认搜索前缀。 */
  loading?: boolean;
  /** 自定义前缀（替换默认搜索图标）。 */
  prefix?: React.ReactNode;
  /** 统一尺寸 API：宽度/flex → 字段根容器；高度 → 控件表面。 */
  layout?: ControlLayout;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    { className, cmdk, loading, prefix, layout, defaultValue = "", value, onChange, ...props },
    ref,
  ) => {
    const { t } = useI18n();
    const [internalValue, setInternalValue] = React.useState(
      typeof defaultValue === "string" || typeof defaultValue === "number" ? defaultValue : "",
    );
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const showClear = String(currentValue ?? "").length > 0;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(event.target.value);
      onChange?.(event);
    };

    const handleClear = () => {
      if (!isControlled) setInternalValue("");
      onChange?.({
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
    };

    const leading = loading ? (
      <Spinner size="md" className="text-gray-700" />
    ) : (
      (prefix ?? <Search className="size-4" aria-hidden />)
    );

    const trailing = showClear ? (
      <button
        type="button"
        onClick={handleClear}
        aria-label={t("Clear search")}
        className="pointer-coarse:hidden flex h-full cursor-pointer items-center rounded-r-overlay-item border-0 bg-transparent px-2.5 text-gray-700 outline-none transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring"
      >
        <Kbd small className="ml-0 font-medium text-gray-900">
          Esc
        </Kbd>
      </button>
    ) : cmdk ? (
      <span
        aria-label={t("Press Command K to open the Command Menu")}
        className="pointer-coarse:hidden flex items-center justify-center gap-1 pr-2.5 font-medium"
      >
        <Kbd small className="ml-0 text-gray-900">
          ⌘
        </Kbd>
        <Kbd small className="ml-0 text-gray-900">
          K
        </Kbd>
      </span>
    ) : undefined;

    return (
      <div
        data-slot="search-input"
        style={layoutRootStyle(layout)}
        className={cn(
          "w-full max-w-full",
          "[&_[data-geist-input-wrapper]]:text-label-14 [&_[data-geist-input-wrapper]]:transition-all [&_[data-geist-input-wrapper]]:[animation-duration:150ms]",
          "[&:has(input:disabled)_[data-slot=input-prefix]]:!bg-gray-100 [&:has(input:disabled)_[data-slot=input-suffix]]:!bg-gray-100",
          "[&:has(input:disabled)_input::placeholder]:!text-gray-500",
          className,
        )}
      >
        <Input
          ref={ref}
          prefix={leading}
          prefixStyling={false}
          suffix={trailing}
          suffixStyling={false}
          value={currentValue}
          onChange={handleChange}
          layout={layout}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          {...props}
          type="search"
          className="[&::-webkit-search-cancel-button]:hidden"
        />
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
