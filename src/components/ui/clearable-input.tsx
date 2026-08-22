import * as React from "react";

import { Kbd } from "@/components/ui/keyboard-input";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { layoutRootStyle, layoutSurfaceStyle, type ControlLayout } from "@/lib/control-layout";

/**
 * ClearableInput — Geist Clearable Input.
 *
 * Uses a native input inside the v1 ring wrapper. A non-empty value exposes an
 * inline Esc keycap; Escape and pointer activation clear through the native
 * input event path so controlled and uncontrolled consumers behave alike.
 *
 * 对齐官方 vercel.com/geist/clearable-input（G07 实测）：
 * - wrapper text-sm font-normal（suffix/徽章继承 14px/20px）；
 * - 无 suffix 时 input 为末子：pr-0（官方 [&>:last-child]:pr-0）；
 * - input 文字色：无 suffix --geist-foreground（light #000 / dark #fff），
 *   有 suffix --themed-fg（= --ds-gray-1000，light #171717 / dark #ededed）；
 * - cmdk 徽章 kbd 结构与官方一致（kbd > span > [esc|cmd] 双绝对定位 span，
 *   min-w-5 固定 20px，esc span w-5 / cmd span w-3 对齐官方测量宽度）。
 */
type ClearableInputProps = Omit<React.ComponentProps<"input">, "size"> & {
  /** Visible label associated with the native input. */
  label?: string;
  /** Show the desktop command-menu shortcut suffix. */
  cmdk?: boolean;
  /** Called after a pointer or Escape clear request. */
  onClear?: () => void;
  /** 统一尺寸 API：宽度/flex → 字段根容器；高度 → wrapper 表面。 */
  layout?: ControlLayout;
};

const clearableKbdClass = "font-sans! bg-background-100 text-[var(--ds-gray-900)]";

/** cmdk 徽章 kbd：官方 !flex + 无 justify（内容左对齐），min-w-5 固定宽度。 */
const badgeKbdClass = "ml-0.5 !items-stretch !justify-start !leading-[1.7em] text-center";

/** 清除按钮 kbd：官方 flex justify-center。 */
const clearButtonKbdClass = "ml-0.5 !items-stretch !leading-[1.7em] text-center";

const ClearableInput = React.forwardRef<HTMLInputElement, ClearableInputProps>(
  (
    {
      "aria-invalid": ariaInvalid = false,
      "aria-label": ariaLabel,
      autoCapitalize = "none",
      autoComplete = "off",
      autoCorrect = "off",
      className,
      cmdk = false,
      defaultValue = "",
      disabled = false,
      id: idProp,
      label,
      layout,
      onChange,
      onClear,
      onKeyDown,
      spellCheck = false,
      value: valueProp,
      ...props
    },
    forwardedRef,
  ) => {
    const { t } = useI18n();
    const generatedId = React.useId();
    const id = idProp ?? `input-${generatedId.replaceAll(":", "")}`;
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = React.useState(String(defaultValue));
    const value = String(isControlled ? valueProp : internalValue);
    const showClear = value.length > 0;
    const showSuffix = showClear || cmdk;

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(event.target.value);
      onChange?.(event);
    };

    const handleClear = () => {
      if (disabled || value.length === 0) return;

      const input = inputRef.current;
      if (isControlled && input) {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        setter?.call(input, "");
        input.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        setInternalValue("");
      }
      onClear?.();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Escape" && value.length > 0 && !disabled) {
        event.preventDefault();
        handleClear();
      }
      onKeyDown?.(event);
    };

    const wrapper = (
      <div
        data-slot="clearable-input-wrapper"
        data-geist-input-wrapper=""
        data-version="v1"
        style={layoutSurfaceStyle(layout)}
        className={cn(
          "flex h-9 w-full max-w-full items-center overflow-hidden rounded-[6px] bg-background-100 text-sm font-normal",
          "shadow-[0_0_0_1px_var(--ds-gray-alpha-400)] transition-all duration-150",
          "hover:shadow-[0_0_0_1px_var(--color-gray-alpha-500)] hover:has-[input:disabled]:shadow-[0_0_0_1px_var(--ds-gray-alpha-400)]",
          "focus-within:!shadow-[0_0_0_1px_var(--input-focus-border),0_0_0_4px_var(--input-focus-glow)]",
          "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-[var(--ds-gray-100)]",
          className,
        )}
      >
        <input
          {...props}
          ref={setRefs}
          id={id}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label={ariaLabel ?? label}
          aria-invalid={ariaInvalid}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          spellCheck={spellCheck}
          data-slot="input"
          data-geist-input=""
          className={cn(
            "order-1 flex h-full w-full min-w-0 appearance-none border-none bg-background-100 px-3 text-copy-14 outline-none",
            showSuffix
              ? "rounded-r-none text-[var(--ds-gray-1000)]"
              : "text-black last:pr-0 dark:text-white",
            "placeholder:text-foreground/50 focus:outline-none",
            "disabled:cursor-not-allowed disabled:bg-[var(--ds-gray-100)] disabled:text-[var(--ds-gray-700)] disabled:opacity-100 disabled:placeholder:!text-[var(--input-disabled-placeholder)]",
          )}
        />

        {showSuffix ? (
          <label
            htmlFor={id}
            aria-hidden="true"
            data-geist-input-suffix=""
            className={cn(
              "order-2 relative flex h-full shrink-0 items-center bg-background-100 pl-3 text-[var(--ds-gray-700)]",
              disabled && "bg-[var(--ds-gray-100)]",
            )}
          >
            {cmdk ? (
              <div
                aria-label={t("Press Cmd + K to open the Command Menu")}
                data-animate="false"
                className="group clearable-input max-[960px]:hidden flex items-center justify-center gap-1 pr-2.5 font-medium"
              >
                <Kbd
                  small
                  aria-hidden="true"
                  className={cn(clearableKbdClass, badgeKbdClass, "relative !overflow-hidden")}
                >
                  <span data-key="esc" className="absolute left-1 w-5 translate-x-8">
                    Esc
                  </span>
                  <span data-key="cmd" className="absolute right-1 w-3">
                    ⌘
                  </span>
                </Kbd>
                <Kbd small aria-hidden="true" className={cn(clearableKbdClass, badgeKbdClass)}>
                  K
                </Kbd>
              </div>
            ) : showClear ? (
              <button
                type="button"
                tabIndex={disabled ? -1 : undefined}
                onClick={handleClear}
                className="pointer-coarse:hidden flex h-full max-w-full shrink-0 cursor-pointer items-center rounded-r-md border-0 bg-transparent px-2.5 font-inherit text-base text-[var(--ds-gray-700)] no-underline outline-none transition-[color,box-shadow,border-color] duration-150 ease-[ease] hover:text-foreground focus-visible:-outline-offset-1 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-[var(--ds-focus-color)] disabled:cursor-not-allowed"
              >
                <Kbd small className={cn(clearableKbdClass, clearButtonKbdClass)}>
                  Esc
                </Kbd>
              </button>
            ) : null}
          </label>
        ) : null}
      </div>
    );

    return label ? (
      <label
        data-version="v1"
        htmlFor={id}
        className="block w-full max-w-full"
        style={layoutRootStyle(layout)}
      >
        <div className="mb-2 block max-w-full cursor-text capitalize text-[13px] leading-[1.5] text-[var(--ds-gray-900)]">
          {label}
        </div>
        {wrapper}
      </label>
    ) : layout ? (
      <div data-slot="clearable-input-field" style={layoutRootStyle(layout)} className="w-full min-w-0">
        {wrapper}
      </div>
    ) : (
      wrapper
    );
  },
);
ClearableInput.displayName = "ClearableInput";

export { ClearableInput };
