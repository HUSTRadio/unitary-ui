import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * SegmentedControl — 滑块组（分段控件）。
 * 基于 Radix RadioGroup + CSS 滑块指示器（absolute 定位跟随选中项）。
 * Geist 发丝线：容器细边框 + 选中项实色滑块；语义 token，无 dark: 变体。
 */

interface SegmentedOption {
  value: string;
  label: string;
  /** 选中滑块的自定义语义色（如紧急程度：普通=中性 / 紧急=warning / 特急=danger） */
  activeClass?: string;
  /** 未选中时文字色 */
  idleClass?: string;
}

interface SegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  ariaLabel?: string;
}

function SegmentedControl({
  options,
  value,
  onValueChange,
  className,
  ariaLabel,
}: SegmentedControlProps) {
  // 用 ref + state 测量每个选项位置，计算滑块 transform
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [slider, setSlider] = React.useState<{ width: number; left: number } | null>(null);

  const measure = React.useCallback(() => {
    const index = options.findIndex((o) => o.value === value);
    const el = itemRefs.current[index];
    if (!el) return;
    const container = el.parentElement;
    if (!container) return;
    setSlider({
      width: el.offsetWidth,
      left: el.offsetLeft,
    });
  }, [value, options]);

  React.useEffect(() => {
    measure();
  }, [measure, value]);

  React.useEffect(() => {
    // 容器尺寸变化时重测
    const container = itemRefs.current[0]?.parentElement;
    if (!container) return;
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [measure]);

  // 选中项 → 滑块背景色（默认中性选中灰，自定义 activeClass 时提取语义色）
  const activeOption = options.find((o) => o.value === value);
  const sliderBg = React.useMemo(() => {
    const cls = activeOption?.activeClass ?? "";
    if (cls.includes("bg-warning")) return "var(--warning)";
    if (cls.includes("bg-danger")) return "var(--danger)";
    if (cls.includes("bg-success")) return "var(--success)";
    if (cls.includes("bg-progress")) return "var(--progress)";
    if (cls.includes("bg-info")) return "var(--info)";
    return "var(--color-selected)";
  }, [activeOption]);

  return (
    <RadioGroupPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      className={cn(
        "relative inline-flex h-9 items-center rounded-md border border-border-strong bg-surface p-1",
        className,
      )}
      aria-label={ariaLabel}
    >
      {/* 滑块指示器 */}
      {slider && (
        <span
          aria-hidden
          className="absolute top-1 bottom-1 rounded-[4px] transition-all duration-200 ease-out"
          style={{
            width: slider.width - 8, // p-1 内边距补偿
            left: slider.left + 4,
            backgroundColor: sliderBg,
          }}
        />
      )}
      {options.map((option, index) => {
        const active = option.value === value;
        return (
          <RadioGroupPrimitive.Item
            key={option.value}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            value={option.value}
            className={cn(
              "relative z-10 inline-flex h-7 flex-1 cursor-pointer items-center justify-center whitespace-nowrap rounded-[4px] px-3 text-label-14 font-medium transition-colors outline-none",
              "focus-ring",
              active
                ? (option.activeClass ?? "bg-selected text-foreground")
                : (option.idleClass ?? "text-muted-foreground"),
            )}
          >
            <RadioGroupPrimitive.Indicator className="hidden" />
            {option.label}
          </RadioGroupPrimitive.Item>
        );
      })}
    </RadioGroupPrimitive.Root>
  );
}

export { SegmentedControl };
