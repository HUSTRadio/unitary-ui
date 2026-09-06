import * as React from "react";

import {
  FeedbackHateFace,
  FeedbackLoveFace,
  FeedbackNotGreatFace,
  FeedbackOkayFace,
} from "@/components/ui/feedback-faces";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Geist Feedback 的四档评分值，顺序与官方评分行一致。 */
export type RatingValue = "hate" | "not-great" | "okay" | "love";
export type RatingTone = "success" | "neutral" | "warning" | "error";

export const RATING_TONE: Record<RatingValue, RatingTone> = {
  love: "success",
  okay: "neutral",
  "not-great": "warning",
  hate: "error",
};

export const RATING_OPTIONS: ReadonlyArray<{
  value: RatingValue;
  label: string;
  tone: RatingTone;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { value: "hate", label: "Hate it", tone: "error", icon: FeedbackHateFace },
  { value: "not-great", label: "Not great", tone: "warning", icon: FeedbackNotGreatFace },
  { value: "okay", label: "It's okay", tone: "neutral", icon: FeedbackOkayFace },
  { value: "love", label: "Love it!", tone: "success", icon: FeedbackLoveFace },
];

export const RATING_TONE_CAPSULE: Record<RatingTone, string> = {
  success: "border-success/40 bg-success-soft text-success",
  neutral: "border-gray-alpha-500 bg-gray-alpha-200 text-gray-900",
  warning: "border-warning/40 bg-warning-soft text-warning",
  error: "border-danger/40 bg-danger-soft text-danger",
};

export const RATING_TONE_FACE_HOVER: Record<RatingTone, string> = {
  success: "hover:bg-success-soft hover:text-success",
  neutral: "hover:bg-gray-alpha-200 hover:text-gray-900",
  warning: "hover:bg-warning-soft hover:text-warning",
  error: "hover:bg-danger-soft hover:text-danger",
};

export const RATING_TONE_FACE_SELECTED: Record<RatingTone, string> = {
  success: "bg-success-soft text-success",
  neutral: "bg-gray-alpha-200 text-gray-900",
  warning: "bg-warning-soft text-warning",
  error: "bg-danger-soft text-danger",
};

interface RatingButtonsProps {
  value?: RatingValue;
  onValueChange: (value: RatingValue) => void;
  className?: string;
  semanticTones?: boolean;
}

/** Feedback 默认 Popover 与 Inline 胶囊共享的官方蓝色评分行。 */
function RatingButtons({ value, onValueChange, className, semanticTones = false }: RatingButtonsProps) {
  const { t } = useI18n();
  const optionRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

  const moveSelection = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + RATING_OPTIONS.length) % RATING_OPTIONS.length;
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % RATING_OPTIONS.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = RATING_OPTIONS.length - 1;
    }
    if (nextIndex === undefined) return;

    event.preventDefault();
    onValueChange(RATING_OPTIONS[nextIndex].value);
    optionRefs.current[nextIndex]?.focus();
  };

  return (
    <span
      role="radiogroup"
      aria-orientation="horizontal"
      aria-label={t("Feedback rating")}
      className={cn("flex items-center gap-[1px] text-gray-900", className)}
    >
      {RATING_OPTIONS.map(({ value: optionValue, label, tone, icon: Icon }, index) => (
        <button
          key={optionValue}
          ref={(node) => {
            optionRefs.current[index] = node;
          }}
          type="button"
          role="radio"
          aria-checked={value === optionValue}
          aria-label={t("Select {rating} emoji", { rating: t(label) })}
          tabIndex={value ? (value === optionValue ? 0 : -1) : index === 0 ? 0 : -1}
          onClick={() => onValueChange(optionValue)}
          onKeyDown={(event) => moveSelection(event, index)}
          className={cn(
            "flex size-8 cursor-pointer items-center justify-center rounded-[50%] border-none bg-transparent p-0 outline-none",
            "transition-[background-color,border-color] duration-(--uni-duration-base) focus-ring motion-reduce:transition-none",
            semanticTones ? RATING_TONE_FACE_HOVER[tone] : "feedback-rating-option",
            semanticTones && value === optionValue && RATING_TONE_FACE_SELECTED[tone],
            "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg_path]:transition-[fill] [&_svg_path]:duration-(--uni-duration-base) motion-reduce:[&_svg_path]:transition-none",
          )}
        >
          <Icon aria-hidden />
        </button>
      ))}
    </span>
  );
}

interface RatingPillProps {
  label: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  value?: RatingValue;
  defaultValue?: RatingValue;
  onValueChange?: (value: RatingValue) => void;
  onSubmit?: (value: RatingValue) => void;
  className?: string;
}

/**
 * 可独立使用的 48px Geist 评分胶囊。Feedback 的 Inline 变体在此视觉基础上
 * 追加同容器展开的表单；独立 RatingPill 点击后只上报评分。
 */
function RatingPill(props: RatingPillProps) {
  const {
    label,
    prefix,
    suffix,
    value,
    defaultValue,
    onValueChange,
    onSubmit,
    className,
  } = props;
  const [internalValue, setInternalValue] = React.useState<RatingValue | undefined>(defaultValue);
  const controlled = Object.prototype.hasOwnProperty.call(props, "value");
  const currentValue = controlled ? value : internalValue;
  const tone = currentValue ? RATING_TONE[currentValue] : undefined;

  const handleValueChange = (nextValue: RatingValue) => {
    if (!controlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    onSubmit?.(nextValue);
  };

  return (
    <div
      data-slot="rating-pill"
      className={cn(
        "inline-flex h-12 select-none items-center gap-3 rounded-full border bg-background-100 py-2 pr-2 pl-4",
        "shadow-[0_0_0_1px_var(--uni-gray-alpha-400)] transition-colors duration-(--uni-duration-base)",
        tone && RATING_TONE_CAPSULE[tone],
        className,
      )}
    >
      {prefix ? (
        <span className="inline-flex shrink-0 items-center justify-center [&>svg]:size-4">
          {prefix}
        </span>
      ) : null}
      <span className="truncate text-[14px] font-medium leading-[21px] text-gray-900">{label}</span>
      {suffix ? (
        <span className="inline-flex shrink-0 items-center justify-center [&>svg]:size-4">
          {suffix}
        </span>
      ) : null}
      <RatingButtons
        value={currentValue}
        onValueChange={handleValueChange}
        semanticTones
      />
    </div>
  );
}

export { RatingButtons, RatingPill };
export type { RatingButtonsProps, RatingPillProps };
