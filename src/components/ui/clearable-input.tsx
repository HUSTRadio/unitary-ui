import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./input";

/**
 * ClearableInput — Geist 官方 ClearableInput（docs/geist-markdown-refs/components/clearable-input.md 实测）。
 * 右侧清除按钮（lucide X）：有值时显示，无值时隐藏。
 * 用 React useState 管理内部值，onClear 在清除时回调。
 */

type ClearableInputProps = React.ComponentProps<"input"> & {
  /** 点击清除按钮时回调（值已置空） */
  onClear?: () => void;
};

const ClearableInput = React.forwardRef<HTMLInputElement, ClearableInputProps>(
  ({ className, defaultValue = "", onClear, ...props }, ref) => {
    const [value, setValue] = React.useState<string>(
      typeof defaultValue === "string" ? defaultValue : "",
    );
    const showClear = value.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      props.onChange?.(e);
    };

    const handleClear = () => {
      setValue("");
      onClear?.();
    };

    return (
      <div className={cn("relative", className)}>
        <Input ref={ref} value={value} onChange={handleChange} className="pr-9" {...props} />
        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear input"
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground outline-none transition-colors hover:bg-gray-alpha-200 hover:text-foreground focus-ring"
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
