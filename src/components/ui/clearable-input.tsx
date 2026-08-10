import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * ClearableInput — Geist 官方 ClearableInput（docs/geist-markdown-refs/components/clearable-input.md 实测 + G02 审计修复）。
 * 官方：36px 高的 ring 边框 wrapper（本地用等效 border + focus-within 方案），右侧清除按钮是
 * INLINE 全高段（px-2.5 rounded-r-md h-full，实测 50×36，是输入框边框几何的一部分），有值时显示、无值时隐藏；
 * 触屏（coarse pointer）隐藏清除按钮（pointer-coarse:hidden）。
 * 标题行为 "resets the value on Escape" —— Esc 键清除。
 * 支持受控（value + onChange）与非受控（defaultValue）两种用法；
 * onClear 在清除时回调（按钮点击或 Esc）。
 */

type ClearableInputProps = Omit<React.ComponentProps<"input">, "size"> & {
  /** 点击清除按钮或按 Esc 清除时回调（值已置空） */
  onClear?: () => void;
};

const ClearableInput = React.forwardRef<HTMLInputElement, ClearableInputProps>(
  (
    { className, defaultValue = "", value: valueProp, onChange, onKeyDown, onClear, ...props },
    ref,
  ) => {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState<string>(String(defaultValue));
    const value = String(isControlled ? valueProp : internalValue);
    const showClear = value.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) setInternalValue("");
      onClear?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && value.length > 0) {
        e.preventDefault();
        handleClear();
      }
      onKeyDown?.(e);
    };

    return (
      <div
        data-slot="clearable-input-wrapper"
        className={cn(
          "flex h-9 w-full items-center rounded-[6px] border border-gray-alpha-400 bg-background",
          "transition-[border-color,box-shadow] duration-150 focus-within:border-[var(--input-focus-border)] focus-within:shadow-[0_0_0_4px_var(--input-focus-glow)] focus-within:outline-none",
          "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-muted",
          className,
        )}
      >
        <input
          ref={ref}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          data-slot="input"
          className="h-full w-full min-w-0 border-none bg-transparent px-3 text-copy-14 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-muted-foreground"
          {...props}
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear input"
            className="pointer-coarse:hidden flex h-full shrink-0 cursor-pointer items-center rounded-r-md bg-transparent px-2.5 text-muted-foreground outline-none transition-colors hover:text-foreground focus-ring"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </div>
    );
  },
);
ClearableInput.displayName = "ClearableInput";

export { ClearableInput };
