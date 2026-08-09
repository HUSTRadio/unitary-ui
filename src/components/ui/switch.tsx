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

  return (
    <SwitchContext.Provider value={{ size, name }}>
      <RadioGroupPrimitive.Root
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
        "relative flex h-full flex-1 cursor-pointer items-center justify-center font-medium text-muted-foreground outline-none transition-colors duration-150 focus-ring",
        "hover:text-foreground",
        "data-[state=checked]:bg-gray-100 data-[state=checked]:text-foreground",
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
