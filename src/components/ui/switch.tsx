import * as React from "react";

import { cn } from "@/lib/utils";

type SwitchSize = "small" | "default" | "large";

interface SwitchContextValue {
  size: SwitchSize;
  name: string;
  controlledValue: string | undefined;
  defaultValue: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
}

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

type SwitchProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  size?: SwitchSize;
  name: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

function Switch({
  className,
  size = "default",
  name,
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  ...props
}: SwitchProps) {
  return (
    <SwitchContext.Provider value={{ size, name, controlledValue, defaultValue, onValueChange }}>
      <div
        data-slot="switch"
        className={cn(
          "switch-ring flex items-stretch bg-background-100 p-1 [&>*]:h-full",
          "rounded-[6px]",
          size === "small" && "h-8",
          size === "default" && "h-9",
          size === "large" && "h-10 rounded-[8px]",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SwitchContext.Provider>
  );
}

type SwitchControlProps = Omit<
  React.ComponentProps<"input">,
  "checked" | "defaultChecked" | "name" | "size" | "type"
> & {
  label: string;
  icon?: React.ReactNode;
  size?: SwitchSize;
  defaultChecked?: boolean;
};

function SwitchControl({
  className,
  label,
  icon,
  size: sizeProp,
  defaultChecked = false,
  disabled = false,
  onChange,
  onKeyDown,
  value,
  ...props
}: SwitchControlProps) {
  const context = React.useContext(SwitchContext);
  if (!context) throw new Error("SwitchControl must be used within Switch");
  const size = sizeProp ?? context.size;
  const stringValue = String(value ?? "");
  const isControlled = context.controlledValue !== undefined;
  const selectionProps = isControlled
    ? { checked: context.controlledValue === stringValue }
    : { defaultChecked: defaultChecked || context.defaultValue === stringValue };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return;
    }
    const direction =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (direction === 0) return;

    const root = event.currentTarget.closest<HTMLElement>('[data-slot="switch"]');
    if (!root) return;
    const enabled = Array.from(
      root.querySelectorAll<HTMLInputElement>('input[data-slot="switch-input"]:not(:disabled)'),
    );
    const currentIndex = enabled.indexOf(event.currentTarget);
    if (currentIndex === -1 || enabled.length < 2) return;
    const target = enabled[(currentIndex + direction + enabled.length) % enabled.length];
    event.preventDefault();
    target.focus();
    if (isControlled) context.onValueChange?.(target.value);
    else target.click();
  };

  return (
    <label
      className={cn("flex self-stretch flex-1", disabled && "cursor-not-allowed")}
      data-disabled={disabled ? "true" : "false"}
    >
      <input
        data-slot="switch-input"
        className="peer sr-only"
        type="radio"
        name={context.name}
        value={stringValue}
        disabled={disabled}
        onChange={(event) => {
          context.onValueChange?.(event.currentTarget.value);
          onChange?.(event);
        }}
        onKeyDown={handleKeyDown}
        {...selectionProps}
        {...props}
      />
      <div
        data-slot="switch-control"
        className={cn(
          "flex h-full flex-1 cursor-pointer items-center justify-center text-start text-gray-900 no-underline outline-none transition-colors duration-150",
          "hover:text-gray-1000 peer-focus-visible:shadow-focus-ring",
          "peer-checked:bg-gray-100 peer-checked:text-gray-1000 peer-checked:rounded-[4px]",
          "peer-disabled:pointer-events-none peer-disabled:cursor-not-allowed peer-disabled:!text-gray-800",
          icon && size !== "large" && "p-2 font-normal",
          icon && size === "large" && "p-3 peer-checked:rounded-[6px]",
          !icon &&
            size === "large" &&
            "px-4 text-label-16 leading-6 font-medium peer-checked:rounded-[6px]",
          !icon && size !== "large" && "px-3 text-label-14 leading-[21px] font-medium",
          className,
        )}
      >
        {icon ? (
          <>
            <span
              aria-hidden
              className={cn(
                "flex items-center justify-center [&_svg]:size-4",
                size === "large" ? "size-5 [&_svg]:size-5" : "size-4",
              )}
            >
              {icon}
            </span>
            <span className="sr-only">{label}</span>
          </>
        ) : (
          label
        )}
      </div>
    </label>
  );
}

export { Switch, SwitchControl };
