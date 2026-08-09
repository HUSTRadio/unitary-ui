import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Radio — Geist 官方 Radio（docs/geist-markdown-refs/components/radio.md）。
 * 官方 API：原生 input[type=radio] 语义，无 Radix 依赖。
 * - RadioGroup：label（渲染为 <legend>）/ onChange(value) / value / defaultValue /
 *   required / disabled / name / aria-label
 * - RadioGroupItem：value + children（选项文案）
 * - Radio：独立无标签单选点（custom UI，需自行提供 aria-label）
 * - useRadio：headless 用法，返回 { component }
 * 圆点 16×16、边框 gray-alpha-400；选中态 border-progress + 中心圆点 bg-progress；
 * 焦点环 focus-ring；颜色全部消费语义 token（--progress / --gray-alpha / --foreground），零 `dark:` 分支。
 * 语义：单个多选一（2–6 项）；超过 6 项改用 Select/Combobox，二选一布尔用 Toggle。
 */

type RadioGroupContextValue = {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

interface RadioProps extends Omit<React.ComponentProps<"input">, "type" | "size"> {
  /** 是否选中（受控）；组内自动从 RadioGroup.value 派生 */
  checked?: boolean;
  /** 选中变化回调（原生事件）；组内同时触发 RadioGroup.onChange(value) */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * Radio — 独立单选点（原生 input 视觉隐藏 + 语义 token 圆点）。
 * 在 RadioGroup 内时自动消费组的 value/disabled/required/name。
 */
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, checked, onChange, value, disabled, required, name, ...props }, ref) => {
    const group = React.useContext(RadioGroupContext);
    const inGroup = group.value !== undefined;
    const isChecked = checked ?? (inGroup ? group.value === String(value) : undefined);
    const generatedName = React.useId();
    const inputName = name ?? group.name ?? generatedName;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      group.onChange?.(String(value));
    };

    return (
      <span className={cn("relative inline-flex size-4 shrink-0", className)}>
        <input
          ref={ref}
          type="radio"
          data-slot="radio"
          value={value}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled ?? group.disabled}
          required={required ?? group.required}
          name={inputName}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            "grid size-4 place-content-center rounded-full border border-gray-alpha-400 transition-colors",
            "peer-checked:border-progress",
            "peer-focus-visible:focus-ring",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "peer-checked:[&>span]:opacity-100",
          )}
        >
          <span className="size-2 rounded-full bg-progress opacity-0 transition-opacity" />
        </span>
      </span>
    );
  },
);
Radio.displayName = "Radio";

interface RadioGroupProps extends Pick<
  React.ComponentProps<"fieldset">,
  "id" | "aria-label" | "aria-describedby"
> {
  /** 组标签（Title Case 名词），渲染为 <legend> */
  label?: React.ReactNode;
  /** 选中值变化回调（受控） */
  onChange?: (value: string) => void;
  /** 受控选中值 */
  value?: string;
  /** 非受控初始选中值 */
  defaultValue?: string;
  /** 必填（作用于组内所有选项，原生表单校验） */
  required?: boolean;
  /** 禁用整组 */
  disabled?: boolean;
  /** 原生 name（键盘分组 / 表单提交）；缺省按选项自动生成 */
  name?: string;
  className?: string;
  children?: React.ReactNode;
}

function RadioGroup({
  label,
  onChange,
  value,
  defaultValue,
  required,
  disabled,
  name,
  className,
  children,
  ...fieldsetProps
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const context = React.useMemo<RadioGroupContextValue>(
    () => ({ value: currentValue, onChange: handleChange, disabled, required, name }),
    [currentValue, handleChange, disabled, required, name],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <fieldset
        data-slot="radio-group"
        disabled={disabled}
        className={cn("min-w-0", className)}
        {...fieldsetProps}
      >
        {label ? (
          <legend data-slot="radio-group-label" className="mb-2.5 text-label-14 text-foreground">
            {label}
          </legend>
        ) : null}
        <div className="flex flex-col gap-2.5">{children}</div>
      </fieldset>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps extends Omit<RadioProps, "checked" | "onChange"> {
  /** 选项值 */
  value: string;
  /** 选项文案 */
  children?: React.ReactNode;
  /** 外层 label 容器的 className */
  className?: string;
}

function RadioGroupItem({ value, children, className, ...radioProps }: RadioGroupItemProps) {
  return (
    <label
      data-slot="radio-item-wrapper"
      className={cn("flex cursor-pointer items-center gap-2.5", className)}
    >
      <Radio value={value} {...radioProps} />
      {children ? <span className="text-copy-14 text-foreground">{children}</span> : null}
    </label>
  );
}

/** useRadio — headless 用法：返回 { component } 由调用方自行排版（标签 / 布局自定）。 */
function useRadio(props: RadioProps): { component: React.ReactElement } {
  return { component: <Radio {...props} /> };
}

export { RadioGroup, RadioGroupItem, Radio, useRadio };
