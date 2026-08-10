import * as React from "react";
import { Loader2, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

/**
 * SearchInput — Geist 官方 SearchInput（docs/geist-markdown-refs/components/search-input.md）。
 * 官方形态：放大镜前缀 + 输入框（h:36px）+ 右侧清除按钮 / loading spinner / cmdk Esc 徽标。
 * - 清除按钮：有值时显示；受控用法下点击触发 onChange（value 置空）
 * - loading：右侧 spinner（替代清除按钮）
 * - cmdk：右侧 "Esc" 徽标（`.pointer-coarse:hidden`，触屏设备隐藏）
 * - prefix：自定义前缀节点（缺省为放大镜）
 */
interface SearchInputProps extends Omit<React.ComponentProps<"input">, "prefix"> {
  /** 显示 ⌘K 风格 Esc 徽标（触屏设备自动隐藏） */
  cmdk?: boolean;
  /** 加载态：右侧显示 spinner */
  loading?: boolean;
  /** 自定义前缀（替换默认放大镜） */
  prefix?: React.ReactNode;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, cmdk, loading, prefix, defaultValue = "", value, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(
      typeof defaultValue === "string" ? defaultValue : "",
    );
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const showClear = !loading && String(currentValue).length > 0;

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

    return (
      <div className={cn("relative", className)}>
        {prefix ?? (
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
        )}
        <Input
          ref={ref}
          value={currentValue}
          onChange={handleChange}
          className={cn(
            "h-9 pl-9 [&::-webkit-search-cancel-button]:hidden",
            (showClear || loading || cmdk) && "pr-9",
          )}
          {...props}
          type="search"
        />
        {loading ? (
          <Loader2
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden
          />
        ) : showClear ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground outline-none transition-colors hover:bg-gray-alpha-200 hover:text-foreground focus-ring"
          >
            <X className="size-4" aria-hidden />
          </button>
        ) : cmdk ? (
          <kbd className="pointer-coarse:hidden pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded-[6px] border border-gray-alpha-400 px-1.5 py-0.5 text-copy-13 text-muted-foreground">
            Esc
          </kbd>
        ) : null}
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
