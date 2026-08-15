import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Radio — Geist 官方 Radio（docs/geist-markdown-refs/components/radio.md）。
 * 官方 API：原生 input[type=radio] 语义，无 Radix 依赖。
 * - RadioGroup：label（渲染为 sr-only 说明 + aria-labelledby，官方即此结构）/
 *   onChange(value) / value / defaultValue / required / disabled / name / aria-label
 * - RadioGroupItem：value + children（选项文案）
 * - Radio：独立无标签单选点（custom UI，需自行提供 aria-label）
 * - useRadio：headless 用法，返回 { component }
 * 圆点 16×16、边框 gray-700（--radio-color 变量）；选中态 --radio-color 切换为 gray-1000（light #171717），
 * 中心圆点 bg-[var(--radio-color)] scale-0 → scale-100（官方 peer-checked:after:scale-100 等价）；
 * 禁用态实色灰：选项文字 gray-400、圆点边框 gray-400、禁用选中圆点 gray-400（官方实测 #c9c9c9），
 * cursor-not-allowed，无 opacity 变暗；
 * 焦点环 focus-ring；颜色全部消费语义 token（--gray-700 / --gray-500 / --gray-1000 / --background-100），零 `dark:` 分支。
 * 语义：单个多选一（2–6 项）；超过 6 项改用 Select/Combobox，二选一布尔用 Toggle。
 */

type RadioGroupContextValue = {
  inGroup?: boolean;
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
    const inGroup = group.inGroup === true;
    const isChecked = checked ?? (inGroup ? group.value === String(value) : undefined);
    const generatedName = React.useId();
    const inputName = name ?? group.name ?? generatedName;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      group.onChange?.(String(value));
    };

    return (
      <span
        data-slot="radio-control"
        className={cn(
          "relative -m-0.5 inline-flex size-5 shrink-0 items-center justify-center",
          className,
        )}
      >
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
            "relative size-4 rounded-full border border-[var(--radio-color)] bg-background-100",
            "transition-[border-color,background] duration-200 ease-in",
            "peer-focus-visible:focus-ring",
            "peer-enabled:peer-checked:[--radio-color:var(--gray-1000)]",
            "peer-disabled:[--radio-color:var(--gray-500)]",
            "peer-checked:[&>span]:scale-100",
            "peer-disabled:peer-checked:![--radio-color:var(--gray-500)]",
          )}
        >
          <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-[var(--radio-color)] transition-transform duration-150 ease-in" />
        </span>
      </span>
    );
  },
);
Radio.displayName = "Radio";

interface RadioGroupProps extends Pick<
  React.ComponentProps<"div">,
  "id" | "aria-label" | "aria-describedby" | "className"
> {
  /** 组标签（Title Case 名词），渲染为 sr-only 说明并作为 aria-labelledby 目标（官方结构） */
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
  ...divProps
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const srLabelId = React.useId();
  const generatedName = React.useId();

  const handleChange = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const context = React.useMemo<RadioGroupContextValue>(
    () => ({
      inGroup: true,
      value: currentValue,
      onChange: handleChange,
      disabled,
      required,
      name: name ?? generatedName,
    }),
    [currentValue, handleChange, disabled, required, name, generatedName],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      <div
        data-slot="radio-group"
        role="radiogroup"
        aria-labelledby={label != null ? srLabelId : undefined}
        className={cn("min-w-0", className)}
        {...divProps}
      >
        {label != null ? (
          <span id={srLabelId} className="sr-only">
            {label}
          </span>
        ) : null}
        {children}
      </div>
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
      className={cn(
        "group flex items-center text-copy-13 leading-[19.5px] [--radio-color:var(--gray-700)]",
        "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:text-gray-500 has-[input:disabled]:[--radio-color:var(--gray-500)]",
        className,
      )}
    >
      <Radio value={value} {...radioProps} />
      {children ? (
        <span className="ml-2 flex p-0.5 group-hover:cursor-pointer">{children}</span>
      ) : null}
    </label>
  );
}

/** useRadio — headless 用法：返回 { component } 由调用方自行排版（标签 / 布局自定）。 */
function useRadio(props: RadioProps): { component: React.ReactElement } {
  return { component: <Radio {...props} /> };
}

export { RadioGroup, RadioGroupItem, Radio, useRadio };
