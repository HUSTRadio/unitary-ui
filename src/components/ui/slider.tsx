import * as React from "react";
import { Slider as SliderPrimitive } from "radix-ui";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
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

/** 单个刻度：value 为刻度值；label 显式给出时优先于 markLabelFormat。 */
export type SliderMark = { value: number; label?: string };

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /** 官方 API：滑块可访问名称（渲染在轨道上方） */
  label?: string;
  /** 官方 API：显示起始值数值输入框 */
  showStartInput?: boolean;
  /** 官方 API：显示结束值数值输入框 */
  showEndInput?: boolean;
  /**
   * 刻度。`true` = 按 step 在 min..max 上自动生成（超过 50 个时拒绝渲染并告警）；
   * 数组 = 自定义刻度，可选 label。
   */
  marks?: boolean | SliderMark[];
  /**
   * 刻度标签格式化。对所有未显式提供 label 的刻度生效
   * （自动生成的与自定义数组中无 label 的）。
   */
  markLabelFormat?: (value: number) => string;
  /**
   * @deprecated 使用 Radix 兼容的 `onValueCommit`。迁移期间若两个回调同时存在，
   * 组件会先调用 `onValueCommit`，再调用此别名，各一次。
   */
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
      className="w-12 shrink-0 text-center border-[var(--input-value-border)] text-[var(--input-value-foreground)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
      marks,
      markLabelFormat,
      onValueCommitted,
      onValueCommit,
      value: valueProp,
      defaultValue,
      min,
      max,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { t } = useI18n();
    const value = valueProp ?? defaultValue ?? [min ?? 0];
    const rootId = React.useId();
    const thumbAriaLabel = props["aria-label"] ?? label;
    // min/max 是可选透传 props（Radix 默认 0/100），本地兜底避免 NaN 定位
    const lo = min ?? 0;
    const hi = max ?? 100;

    const resolvedMarks: SliderMark[] = React.useMemo(() => {
      if (marks === true) {
        const stepValue = Math.max(props.step ?? 1, Number.EPSILON);
        const count = Math.floor((hi - lo) / stepValue) + 1;
        if (count > 50) {
          console.warn(
            `Slider: ${count} auto marks exceed the 50 limit; pass an explicit marks array instead.`,
          );
          return [];
        }
        return Array.from({ length: count }, (_, i) => ({ value: lo + i * stepValue }));
      }
      return Array.isArray(marks) ? marks : [];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marks, props.step, lo, hi]);

    const hasLabeledMark = resolvedMarks.some(
      (mark) => mark.label != null || markLabelFormat != null,
    );

    const commitCallbacksRef = React.useRef({ onValueCommit, onValueCommitted });
    commitCallbacksRef.current = { onValueCommit, onValueCommitted };
    const pendingCommitRef = React.useRef<number[] | null>(null);
    const commitScheduledRef = React.useRef(false);

    const handleValueCommit = React.useCallback((nextValue: number[]) => {
      // Radix commits keyboard changes from inside its state updater. React may
      // replay that updater in StrictMode, so schedule outside render and
      // collapse same-turn replays into one consumer notification.
      pendingCommitRef.current = nextValue;
      if (commitScheduledRef.current) return;
      commitScheduledRef.current = true;
      queueMicrotask(() => {
        commitScheduledRef.current = false;
        const committedValue = pendingCommitRef.current;
        pendingCommitRef.current = null;
        if (!committedValue) return;
        const callbacks = commitCallbacksRef.current;
        callbacks.onValueCommit?.(committedValue);
        callbacks.onValueCommitted?.(committedValue);
      });
    }, []);

    const updateValue = (index: number, next: number) => {
      // 双值 range 手动输入交叉钳制：start ≥ end 或 end ≤ start 时折叠为相等，
      // 不静默交换另一个输入框的显示值（用户对自己刚键入的值有最高预期）。
      if (value.length === 2) {
        const lastIndex = value.length - 1;
        if (index === 0 && next >= value[lastIndex]) {
          props.onValueChange?.([next, next]);
          return;
        }
        if (index === lastIndex && next <= value[0]) {
          props.onValueChange?.([next, next]);
          return;
        }
      }
      const nextValues = value.map((item, i) => (i === index ? next : item));
      props.onValueChange?.(nextValues);
    };
    // 手动输入通过 updateValue 应用双值交叉钳制；Radix 轨道、拖拽与键盘交互
    // 仍必须直接获得消费者回调，否则受控滑块无法把新值交还给父组件。
    const { onValueChange, ...restProps } = props;

    return (
      <div data-slot="slider-field" className={cn("flex w-full flex-col", className)}>
        {label && <Label value={label} id={rootId} />}
        <div className={cn("flex w-full items-center gap-3", hasLabeledMark && "pb-5")}>
          {showStartInput && (
            <ValueInput
              value={value[0]}
              min={min}
              max={max}
              disabled={disabled}
              ariaLabel={t("Starting range value")}
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
              onValueChange={onValueChange}
              onValueCommit={handleValueCommit}
              data-slot="slider-control"
              className="relative flex h-2 min-w-54 touch-none items-center select-none data-[disabled]:cursor-not-allowed"
              {...restProps}
            >
              <SliderPrimitive.Track
                data-slot="slider-track"
                className="relative h-2 grow rounded-full bg-gray-200 select-none [&>span:has([data-slot=slider-thumb])]:-top-[3px]"
              >
                <SliderPrimitive.Range
                  data-slot="slider-indicator"
                  className="absolute h-full rounded-full bg-blue-700 select-none data-[disabled]:bg-gray-500"
                />
                {resolvedMarks.length > 0 && (
                  <div
                    aria-hidden="true"
                    data-slot="slider-marks"
                    className="pointer-events-none absolute inset-0"
                  >
                    {resolvedMarks.map((mark) => {
                      const pct = ((mark.value - lo) / (hi - lo)) * 100;
                      const label = mark.label ?? (markLabelFormat ? markLabelFormat(mark.value) : null);
                      return (
                        <div
                          key={mark.value}
                          data-slot="slider-mark"
                          data-disabled={disabled ? "" : undefined}
                          style={{ left: `${pct}%` }}
                          className="absolute top-1/2 h-[4px] w-px -translate-x-1/2 -translate-y-1/2 bg-gray-500 data-[disabled]:bg-gray-300"
                        >
                          {label != null && (
                            <span className="absolute left-1/2 top-[calc(50%+6px)] -translate-x-1/2 whitespace-nowrap text-label-12 text-gray-700">
                              {label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {value.map((_, index) => (
                  <SliderPrimitive.Thumb
                    key={index}
                    data-slot="slider-thumb"
                    aria-label={thumbAriaLabel}
                    className="relative block h-3.5 w-1.5 shrink-0 rounded-[1px] bg-white ring-1 ring-gray-alpha-500 transition-[scale] duration-(--uni-duration-fast) after:absolute after:-inset-2 focus-visible:scale-120 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-120 dark:ring-black"
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
              ariaLabel={t("Ending range value")}
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
