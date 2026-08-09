import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

/**
 * ClearableInput — Geist 官方 ClearableInput（docs/geist-markdown-refs/components/clearable-input.md 实测）。
 * 官方：输入框 36px、右侧 32×32 清除按钮（有值时显示，无值时隐藏）；
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
      <div className={cn("relative", className)}>
        <Input
          ref={ref}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="h-9 pr-10"
          {...props}
        />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear input"
            className="absolute top-1/2 right-1 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-gray-alpha-200 hover:text-foreground focus-ring"
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
