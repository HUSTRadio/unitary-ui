import * as React from "react";

import { cn } from "@/lib/utils";

type ChoiceboxType = "radio" | "checkbox";
type ChoiceboxValue = string | string[];

type ChoiceboxGroupBaseProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  label: string;
  listClassName?: string;
  showLabel?: boolean;
  disabled?: boolean;
  required?: boolean;
};

type ChoiceboxGroupProps = ChoiceboxGroupBaseProps &
  (
    | { onChange: (value: string) => void; type: "radio"; value: string }
    | { onChange: (value: string[]) => void; type: "checkbox"; value: string[] }
  );

type ChoiceboxGroupItemProps = Omit<
  React.ComponentProps<"input">,
  "children" | "checked" | "defaultChecked" | "name" | "onChange" | "title" | "type"
> & {
  children?: React.ReactNode;
  description: React.ReactNode;
  title: React.ReactNode;
  value: string;
};

type ChoiceboxContextValue = {
  disabled: boolean;
  name: string;
  onChange: (value: ChoiceboxValue) => void;
  required: boolean;
  type: ChoiceboxType;
  value: ChoiceboxValue;
};

const ChoiceboxContext = React.createContext<ChoiceboxContextValue | null>(null);

function ChoiceboxGroup({
  "aria-label": ariaLabel,
  children,
  className,
  disabled = false,
  label,
  listClassName,
  onChange,
  required = false,
  showLabel = false,
  type,
  value,
  ...props
}: ChoiceboxGroupProps) {
  const reactId = React.useId();
  const groupId = `choicebox-${reactId}`;
  const name = `choicebox-name-${reactId}`;
  const context = React.useMemo<ChoiceboxContextValue>(
    () => ({
      disabled,
      name,
      onChange: onChange as (value: ChoiceboxValue) => void,
      required,
      type,
      value,
    }),
    [disabled, name, onChange, required, type, value],
  );

  return (
    <ChoiceboxContext.Provider value={context}>
      <div
        aria-label={showLabel ? undefined : (ariaLabel ?? label)}
        aria-labelledby={showLabel ? groupId : undefined}
        aria-multiselectable={type === "checkbox"}
        aria-required={required}
        className={className}
        role={type === "radio" ? "radiogroup" : "group"}
        {...props}
      >
        {showLabel ? (
          <label data-version="v1" htmlFor={groupId}>
            <div
              id={groupId}
              className="mb-2 block max-w-full cursor-text text-[13px] text-gray-900"
            >
              {label}
            </div>
          </label>
        ) : null}
        <ul
          className={cn(
            "m-0 flex list-none items-stretch justify-stretch gap-3 p-0",
            listClassName,
          )}
        >
          {children}
        </ul>
      </div>
    </ChoiceboxContext.Provider>
  );
}

function ChoiceboxGroupItem({
  children,
  className,
  description,
  disabled = false,
  id,
  title,
  value,
  ...props
}: ChoiceboxGroupItemProps) {
  const context = React.useContext(ChoiceboxContext);
  if (!context) throw new Error("ChoiceboxGroupItem must be rendered inside ChoiceboxGroup");
  const group = context;

  const reactId = React.useId();
  const inputId = id ?? `choicebox-input-${reactId}`;
  const titleId = `choicebox-title-${reactId}`;
  const descriptionId = `choicebox-description-${reactId}`;
  const selected = Array.isArray(group.value) ? group.value.includes(value) : group.value === value;
  const itemDisabled = group.disabled || disabled;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (itemDisabled) return;
    if (group.type === "radio") {
      if (event.target.checked) group.onChange(value);
      return;
    }
    const current = Array.isArray(group.value) ? group.value : [];
    group.onChange(
      event.target.checked ? [...current, value] : current.filter((item) => item !== value),
    );
  }

  return (
    <label
      aria-selected={selected}
      className={cn(
        "group/choicebox flex flex-1 list-none flex-col items-stretch justify-start overflow-hidden rounded-md border border-[var(--ds-gray-400)] transition-colors duration-150 ease-in",
        "has-checked:not-has-disabled:border-[var(--ds-blue-600)] hover:has-enabled:border-[var(--ds-gray-500)] hover:has-enabled:bg-[var(--ds-gray-100)] hover:has-checked:not-has-disabled:!border-[var(--ds-blue-600)]",
        "choicebox-focus",
        itemDisabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      <div
        data-slot="choicebox-group-item-option"
        className={cn(
          "flex flex-row items-center justify-between gap-6 p-3",
          (!selected || !children) && "h-full",
          "has-checked:not-has-disabled:bg-[var(--ds-blue-100)] hover:has-checked:not-has-disabled:!bg-[var(--ds-blue-200)]",
          selected && children && "border-b border-[var(--ds-blue-600)]",
        )}
      >
        <span
          data-slot="choicebox-group-item-title-description"
          className="flex flex-initial flex-col items-stretch justify-start gap-1 self-start"
        >
          <span
            id={titleId}
            data-slot="choicebox-group-item-title"
            className={cn(
              "text-sm font-medium leading-5",
              selected && !itemDisabled && "text-[var(--ds-blue-900)]",
              itemDisabled && "text-[var(--ds-gray-500)]",
            )}
          >
            {title}
          </span>
          <span
            id={descriptionId}
            data-slot="choicebox-group-item-description"
            className={cn(
              "text-sm leading-5 text-[var(--ds-gray-900)] empty:hidden",
              selected && !itemDisabled && "text-[var(--ds-blue-900)]",
              itemDisabled && "text-[var(--ds-gray-500)]",
            )}
          >
            {description}
          </span>
        </span>
        {group.type === "radio" ? (
          <span
            className={cn("-m-0.5 flex items-center p-0.5", itemDisabled && "cursor-not-allowed")}
          >
            <input
              {...props}
              id={inputId}
              aria-labelledby={`${titleId} ${descriptionId}`}
              checked={selected}
              className="peer sr-only"
              disabled={itemDisabled}
              name={group.name}
              onChange={handleChange}
              required={group.required || props.required}
              type="radio"
              value={value}
            />
            <span
              aria-hidden="true"
              data-slot="choicebox-radio-indicator"
              className={cn(
                "relative size-4 rounded-full border border-[var(--radio-color)] bg-[var(--ds-background-100)] [--radio-color:var(--ds-gray-500)]",
                "transition-[border-color,background] duration-200 ease-in after:absolute after:left-1/2 after:top-1/2 after:block after:size-2 after:-translate-x-1/2 after:-translate-y-1/2 after:scale-0 after:rounded-full after:bg-[var(--radio-color)] after:transition-transform after:duration-150 after:ease-in after:content-['']",
                "peer-checked:[--radio-color:var(--ds-blue-900)] peer-checked:after:scale-100 peer-disabled:peer-checked:[--radio-color:var(--ds-gray-900)] peer-disabled:not-peer-checked:bg-[var(--ds-gray-100)]",
              )}
            />
          </span>
        ) : (
          <span
            className={cn("-m-0.5 flex items-center p-0.5", itemDisabled && "cursor-not-allowed")}
          >
            <input
              {...props}
              id={inputId}
              aria-labelledby={`${titleId} ${descriptionId}`}
              checked={selected}
              className="peer sr-only"
              disabled={itemDisabled}
              name={group.name}
              onChange={handleChange}
              required={group.required || props.required}
              type="checkbox"
              value={value}
            />
            <span
              aria-hidden="true"
              data-slot="choicebox-checkbox-indicator"
              className={cn(
                "relative inline-flex size-4 items-center justify-center rounded-sm border border-[var(--ds-gray-500)] bg-[var(--ds-background-100)] transition-all duration-200",
                "peer-checked:border-[var(--ds-blue-900)] peer-checked:bg-[var(--ds-blue-900)] peer-disabled:not-peer-checked:bg-[var(--ds-gray-100)] peer-disabled:peer-checked:border-[var(--gray-600)] peer-disabled:peer-checked:bg-[var(--gray-600)]",
              )}
            >
              <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 20 20" width="16">
                <path
                  className={cn("stroke-[var(--ds-background-100)]", !selected && "invisible")}
                  d="M14 7L8.5 12.5L6 10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </span>
          </span>
        )}
      </div>
      {selected && children ? <span className="choicebox-content">{children}</span> : null}
    </label>
  );
}

export { ChoiceboxGroup, ChoiceboxGroupItem };
export type { ChoiceboxGroupItemProps, ChoiceboxGroupProps, ChoiceboxType, ChoiceboxValue };
