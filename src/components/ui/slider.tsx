import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * Slider — Geist 滑块（docs/geist-markdown-refs/components/slider.md）。
 * 基于 Radix Slider 原语：Track / Range / Thumb 结构，支持单值与双值 range
 * （value 数组长度决定 Thumb 数量）。
 *
 * 官方 API（补全）：
 * - label：可访问名称，渲染在轨道上方（同时作为 thumb 的 aria-label）
 * - showStartInput / showEndInput：显示起始 / 结束数值输入框（输入同步 value）
 * - onValueCommitted：拖动释放后提交（映射到 Radix onValueCommit）
 *
 * 样式（官方实测对齐）：
 * - root：216px min-width、8px 轨道区，外层 group 包裹 control
 * - track：gray-200、8px 高、全圆角
 * - indicator：blue-700，禁用态 gray-500
 * - thumb：6×14px、1px 圆角、白色表面与 hairline ring
 * 官方 bestPractices：
 * - 滑块适合「形状与邻近度比精度更重要」的范围数值输入（带宽、透明度、音量、色道）；
 *   精确值（端口号、内存上限）应配数值 Input，键盘用户默认直接输入。
 * - 吸附合理 step（1/5/10%），min/max 钳制到真实产品边界。
 * - 通过 <label htmlFor> 或 aria-label 提供可访问名称，让原生方向键 /
 *   Page Up/Down / Home/End 行为接管键盘操作，不要拦截这些按键。
 */

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** 官方 API：滑块可访问名称（渲染在轨道上方） */
  label?: string;
  /** 官方 API：显示起始值数值输入框 */
  showStartInput?: boolean;
  /** 官方 API：显示结束值数值输入框 */
  showEndInput?: boolean;
  /** 官方 API：拖动释放后提交（等价 Radix onValueCommit） */
  onValueCommitted?: (value: number[]) => void;
}

interface ValueInputProps {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  ariaLabel: string;
  type?: "text" | "number";
  onChange: (next: number) => void;
}

function ValueInput({
  value,
  min,
  max,
  disabled,
  ariaLabel,
  type = "number",
  onChange,
}: ValueInputProps) {
  const [text, setText] = React.useState(String(value));
  const valueRef = React.useRef(value);
  valueRef.current = value;

  React.useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = () => {
    const parsed = Number(text);
    if (Number.isNaN(parsed)) {
      setText(String(valueRef.current));
      return;
    }
    const clamped = Math.min(max ?? Infinity, Math.max(min ?? -Infinity, parsed));
    setText(String(clamped));
    onChange(clamped);
  };

  return (
    <Input
      type={type}
      size="small"
      inputMode="numeric"
      aria-label={ariaLabel}
      className="w-12 shrink-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      value={text}
      disabled={disabled}
      onChange={(event) => setText(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commit();
        }
      }}
    />
  );
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      label,
      showStartInput,
      showEndInput,
      onValueCommitted,
      value: valueProp,
      defaultValue,
      min,
      max,
      disabled,
      ...props
    },
    ref,
  ) => {
    const value = valueProp ?? defaultValue ?? [min ?? 0];
    const rootId = React.useId();
    const thumbAriaLabel = props["aria-label"] ?? label;

    const updateValue = (index: number, next: number) => {
      const nextValues = value.map((item, i) => (i === index ? next : item));
      props.onValueChange?.(nextValues);
    };

    return (
      <div data-slot="slider-field" className={cn("flex w-full flex-col", className)}>
        {label && <Label value={label} id={rootId} />}
        <div className="flex w-full items-center gap-3">
          {showStartInput && (
            <ValueInput
              value={value[0]}
              min={min}
              max={max}
              disabled={disabled}
              ariaLabel="Starting range value"
              type="text"
              onChange={(next) => updateValue(0, next)}
            />
          )}
          <div data-slot="slider" role="group" className="h-2 min-w-54">
            <SliderPrimitive.Root
              ref={ref}
              id={rootId}
              min={min}
              max={max}
              disabled={disabled}
              value={valueProp}
              defaultValue={defaultValue}
              onValueCommit={onValueCommitted}
              data-slot="slider-control"
              className="relative flex h-2 min-w-54 touch-none items-center select-none data-[disabled]:cursor-not-allowed"
              {...props}
            >
              <SliderPrimitive.Track
                data-slot="slider-track"
                className="relative h-2 grow rounded-full bg-gray-200 select-none [&>span:has([data-slot=slider-thumb])]:-top-[3px]"
              >
                <SliderPrimitive.Range
                  data-slot="slider-indicator"
                  className="absolute h-full rounded-full bg-blue-700 select-none data-[disabled]:bg-gray-500"
                />
                {value.map((_, index) => (
                  <SliderPrimitive.Thumb
                    key={index}
                    data-slot="slider-thumb"
                    aria-label={thumbAriaLabel}
                    className="relative block h-3.5 w-1.5 shrink-0 rounded-[1px] bg-white ring-1 ring-gray-alpha-500 transition-[scale] duration-100 after:absolute after:-inset-2 focus-visible:scale-120 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-120 dark:ring-black"
                  />
                ))}
              </SliderPrimitive.Track>
            </SliderPrimitive.Root>
          </div>
          {showEndInput && (
            <ValueInput
              value={value[value.length - 1]}
              min={min}
              max={max}
              disabled={disabled}
              ariaLabel="Ending range value"
              onChange={(next) => updateValue(value.length - 1, next)}
            />
          )}
        </div>
      </div>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
