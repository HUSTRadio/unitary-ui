import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

type SwitchSize = "small" | "default" | "large";

interface SwitchContextValue {
  size: SwitchSize;
  name: string;
}

const SwitchContext = React.createContext<SwitchContextValue | null>(null);

function Switch({
  className,
  size = "default",
  name,
  children,
  defaultValue,
  onKeyDown,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root> & {
  size?: SwitchSize;
  name: string;
}) {
  const defaultChild = React.Children.toArray(children).find(
    (child) =>
      React.isValidElement<{ defaultChecked?: boolean; value?: string }>(child) &&
      child.props.defaultChecked === true,
  ) as React.ReactElement<{ defaultChecked?: boolean; value?: string }> | undefined;
  const initialValue = defaultValue ?? defaultChild?.props.value;
  const rootRef = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Radio-group semantics (WAI-ARIA radiogroup / native radio behavior):
    // arrow keys and Home/End move focus AND change the selection in one step
    // (auto-activate on focus). Radix radio-group only roves focus on arrow
    // keys, so we select the target item here to keep checked in sync.
    // Note: Radix's roving-focus handler already called preventDefault() on
    // these keys by the time this bubbles up, so we must NOT bail on
    // event.defaultPrevented — that would defeat the auto-activation.
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
      return;
    }
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(
      root.querySelectorAll<HTMLButtonElement>('[data-slot="switch-control"]'),
    );
    const enabled = items.filter((item) => !item.disabled);
    if (enabled.length === 0) return;
    const activeIndex = enabled.indexOf(root.ownerDocument.activeElement as HTMLButtonElement);
    if (activeIndex === -1) return;

    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (activeIndex + 1) % enabled.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (activeIndex - 1 + enabled.length) % enabled.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = enabled.length - 1;
        break;
      default:
        return;
    }
    const target = enabled[nextIndex];
    if (target === root.ownerDocument.activeElement) return;
    event.preventDefault();
    // Radix roves focus on these keys; selecting via a click keeps the value
    // in sync with the roved focus (native radio auto-activation).
    target.click();
  };

  return (
    <SwitchContext.Provider value={{ size, name }}>
      <RadioGroupPrimitive.Root
        ref={rootRef}
        data-slot="switch"
        name={name}
        defaultValue={initialValue}
        className={cn(
          "flex max-w-full items-stretch bg-background-100 p-1 shadow-[0_0_0_1px_var(--gray-alpha-400)] [&>*]:h-full",
          "rounded-[6px]",
          size === "small" && "h-8",
          size === "default" && "h-9",
          size === "large" && "h-10 rounded-[8px]",
          className,
        )}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          handleKeyDown(event);
        }}
        {...props}
      >
        {children}
      </RadioGroupPrimitive.Root>
    </SwitchContext.Provider>
  );
}

function SwitchControl({
  className,
  label,
  icon,
  size: sizeProp,
  defaultChecked: _defaultChecked,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  label: string;
  icon?: React.ReactNode;
  size?: SwitchSize;
}) {
  const context = React.useContext(SwitchContext);
  if (!context) throw new Error("SwitchControl must be used within Switch");
  const size = sizeProp ?? context.size;

  return (
    <RadioGroupPrimitive.Item
      data-slot="switch-control"
      aria-label={label}
      className={cn(
        "relative flex h-full flex-1 cursor-pointer items-center justify-center font-medium text-gray-800 outline-none transition-colors duration-150 focus-ring",
        "hover:text-gray-900",
        "data-[state=checked]:bg-gray-100 data-[state=checked]:text-gray-1000",
        "data-[state=checked]:rounded-[4px]",
        "data-[disabled]:pointer-events-none data-[disabled]:text-gray-800",
        size === "large" && "px-4 text-copy-16 data-[state=checked]:rounded-[6px]",
        size !== "large" && "px-3 text-copy-14",
        className,
      )}
      {...props}
    >
      {icon ? (
        <>
          <span aria-hidden className="flex size-4 items-center justify-center [&_svg]:size-4">
            {icon}
          </span>
          <span className="sr-only">{label}</span>
        </>
      ) : (
        label
      )}
    </RadioGroupPrimitive.Item>
  );
}

export { Switch, SwitchControl };
